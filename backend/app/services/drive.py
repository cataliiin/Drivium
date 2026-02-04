import logging
from typing import List
import uuid
from sqlalchemy.orm import Session
from app.schemas.drive import *
from app.core.config import MINIO_BUCKET_NAME, PRESIGNED_DOWNLOAD_URL_EXPIRES_MINUTES, PRESIGNED_UPLOAD_URL_EXPIRES_MINUTES
from app.database.models import File, Folder, User
from fastapi import HTTPException
from minio import Minio
from minio.error import S3Error
from datetime import datetime, timedelta, timezone

class DriveService:
    def __init__(self):
        self.BUCKET_NAME = MINIO_BUCKET_NAME

    def get_upload_url(self, file_data: FileUploadRequest, db: Session, minio: Minio, current_user: User) -> FileUploadResponse:
        if file_data.folder_id is not None:
            folder = db.query(Folder).filter(Folder.id == file_data.folder_id).first()
            if not folder:
                raise HTTPException(404, "Folder not found")
            if folder.owner_id != current_user.id:
                raise HTTPException(403, "Not authorized for this folder")

        db_file = File(
            name=file_data.name,
            storage_key=str(uuid.uuid4()),
            size=file_data.size,
            mime_type=file_data.mime_type,
            folder_id=file_data.folder_id,
            status=FileStatus.PENDING,
            owner_id=current_user.id
        )

        db.add(db_file)
        db.flush()
        file_id = db_file.id

        if not file_id:
            raise HTTPException(500, "Failed to create file record")

        try:
            object_name = f"users/{current_user.id}/{db_file.storage_key}"
                        
            presigned_url = minio.presigned_put_object(
                self.BUCKET_NAME, 
                object_name, 
                expires=timedelta(minutes=PRESIGNED_UPLOAD_URL_EXPIRES_MINUTES)
            )
            
            db.commit()
            
            return FileUploadResponse(
                file_id=file_id,
                presigned_url=presigned_url
            )
            
        except S3Error as e:
            logging.error(f"S3Error details: code={e.code}, message='{e.message}', bucket={self.BUCKET_NAME}, object={object_name}")
            db.rollback()
            raise HTTPException(503, "Object storage unavailable")
        except Exception as e:
            db.rollback()
            raise HTTPException(500, f"Failed to generate upload URL: {str(e)}")
        
    def update_upload_status(self,file_id: int, status_data: UploadStatusRequest, db: Session, current_user: User) -> None:
        try:
            file = db.query(File).filter(
                File.id == file_id, 
            ).first()

            if not file:
                raise HTTPException(404, "File not found")
            
            if file.owner_id != current_user.id:
                raise HTTPException(403, "Not authorized for this file")
            
            if status_data.success:
                file.status = FileStatus.UPLOADED
                file.uploaded_at = datetime.now(timezone.utc)
                db.commit()
            else:
                db.delete(file)
                db.commit()
        except HTTPException:
            db.rollback()
            raise
        except Exception:
            db.rollback()
            raise HTTPException(500, "Failed to update upload status")

    def get_download_url(self, file_id: int, db: Session, minio: Minio, current_user: User) -> str:    
        
        file = db.query(File).filter(
            File.id == file_id, 
        ).first()
        
        if not file:
            raise HTTPException(404, "File not found")
        
        if file.owner_id != current_user.id:
            raise HTTPException(403, "Not authorized for this file")
        
        object_name = f"users/{current_user.id}/{file.storage_key}"
        
        try:
            return minio.presigned_get_object(
                bucket_name=self.BUCKET_NAME,
                object_name=object_name,
                expires=timedelta(minutes=PRESIGNED_DOWNLOAD_URL_EXPIRES_MINUTES)
            )
        except S3Error:
            raise HTTPException(503, "Object storage unavailable")
        except Exception as e:
            raise HTTPException(500, f"Failed to generate download URL: {str(e)}")
    
    def delete_file(self, file_id: int, db: Session, minio: Minio, current_user: User) -> None:
        file = db.query(File).filter(
            File.id == file_id, 
        ).first()

        if not file:
            raise HTTPException(404, "File not found")
        
        if file.owner_id != current_user.id:
            raise HTTPException(403, "Not authorized for this file")
        
        object_name = f"users/{current_user.id}/{file.storage_key}"
        
        try:
            minio.remove_object(self.BUCKET_NAME, object_name)
        except S3Error:
            raise HTTPException(503, "Object storage unavailable")
        except Exception as e:
            raise HTTPException(500, f"Failed to delete file from storage: {str(e)}")
        
        try:
            db.delete(file)
            db.commit()
        except Exception as e:
            raise HTTPException(500, f"Failed to delete file record: {str(e)}")

    def edit_file(self, file_id: int, edit: FileEditRequest, db: Session, current_user: User) -> File:
        update = edit.model_dump(exclude_unset=True)

        if not update:
            raise HTTPException(400, "No fields provided to update")

        file = db.query(File).filter(File.id == file_id).first()
        if not file:
            raise HTTPException(404, "File not found")

        if file.owner_id != current_user.id:
            raise HTTPException(403, "Not authorized for this file")

        if "new_name" in update:
            file.name = update["new_name"]

        if "new_folder_id" in update:
            new_folder_id = update["new_folder_id"]

            if new_folder_id is not None:
                new_folder = db.query(Folder).filter(Folder.id == new_folder_id).first()
                if not new_folder:
                    raise HTTPException(404, "New folder not found")
                if new_folder.owner_id != current_user.id:
                    raise HTTPException(403, "Not authorized for new folder")

            file.folder_id = new_folder_id

        try:
            db.commit()
            db.refresh(file)
            return file
        except Exception:
            db.rollback()
            raise HTTPException(500, "Failed to edit file")

    def create_folder(self, folder_data: FolderCreateRequest, db: Session, current_user: User) -> FolderCreateResponse:
        if folder_data.parent_folder_id is not None:
            parent_folder = db.query(Folder).filter(Folder.id == folder_data.parent_folder_id).first()
            if not parent_folder:
                raise HTTPException(404, "Parent folder not found")
            if parent_folder.owner_id != current_user.id:
                raise HTTPException(403, "Not authorized for parent folder")

        db_folder = Folder(
            name=folder_data.name,
            parent_folder_id=folder_data.parent_folder_id,
            owner_id=current_user.id
        )

        try:
            db.add(db_folder)
            db.flush()
            folder_id = db_folder.id
            
            db.commit()
            return FolderCreateResponse(id=folder_id, name=folder_data.name)
        except Exception:
            db.rollback()
            raise HTTPException(500, "Failed to create folder")

    def delete_folder(self, folder_id: int, db: Session, minio: Minio, current_user: User) -> None:
        folder = db.query(Folder).filter(
            Folder.id == folder_id,
        ).first()

        if not folder:
            raise HTTPException(404, "Folder not found")
        
        if folder.owner_id != current_user.id:
            raise HTTPException(403, "Not authorized for this folder")
        
        all_files = self._get_all_files_in_folder_recursive(db, folder_id, current_user.id)
        
        try:
            for file in all_files:
                object_name = f"users/{current_user.id}/{file.storage_key}"
                try:
                    minio.remove_object(self.BUCKET_NAME, object_name)
                except S3Error:
                    raise HTTPException(503, "Object storage unavailable")
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(500, f"Failed to delete files from object storage: {str(e)}")
        
        self._delete_folder_from_database(db, folder_id)

    def edit_folder(self, folder_id: int, edit: FolderEditRequest, db: Session, current_user: User) -> Folder:
        update = edit.model_dump(exclude_unset=True)
        if not update:
            raise HTTPException(400, "No fields provided to update")

        folder = db.query(Folder).filter(Folder.id == folder_id).first()
        if not folder:
            raise HTTPException(404, "Folder not found")

        if folder.owner_id != current_user.id:
            raise HTTPException(403, "Not authorized for this folder")

        if "new_name" in update:
            folder.name = update["new_name"]

        if "new_parent_folder_id" in update:
            new_parent_id = update["new_parent_folder_id"]

            if new_parent_id == folder.id:
                raise HTTPException(400, "Folder cannot be moved into itself")

            if new_parent_id is not None:
                new_parent = db.query(Folder).filter(Folder.id == new_parent_id).first()
                if not new_parent:
                    raise HTTPException(404, "New parent folder not found")
                if new_parent.owner_id != current_user.id:
                    raise HTTPException(403, "Not authorized for new parent folder")

            folder.parent_folder_id = new_parent_id

        try:
            db.commit()
            db.refresh(folder)
            return folder
        except Exception:
            db.rollback()
            raise HTTPException(500, "Failed to edit folder")

    def _get_all_files_in_folder_recursive(self, db: Session, folder_id: int, user_id: int) -> List[File]:
        files = []
        
        files.extend(db.query(File).filter(
            File.folder_id == folder_id,
            File.owner_id == user_id
        ).all())
        
        subfolders = db.query(Folder).filter(
            Folder.parent_folder_id == folder_id,
            Folder.owner_id == user_id
        ).all()
        
        for subfolder in subfolders:
            files.extend(self._get_all_files_in_folder_recursive(db, subfolder.id, user_id))
        
        return files

    def _get_all_subfolders(self, db: Session, folder_id: int, user_id: int) -> List[Folder]:
        subfolders = []
        
        direct = db.query(Folder).filter(
            Folder.parent_folder_id == folder_id,
            Folder.owner_id == user_id
        ).all()
        
        for folder in direct:
            subfolders.append(folder)
            subfolders.extend(self._get_all_subfolders(db, folder.id, user_id))
        
        return subfolders

    def _delete_folder_from_database(self, db: Session, folder_id: int):
        try:
            subfolders = db.query(Folder).filter(Folder.parent_folder_id == folder_id).all()
            
            for subfolder in subfolders:
                self._delete_folder_from_database(db, subfolder.id)
            
            files = db.query(File).filter(File.folder_id == folder_id).all()
            for file in files:
                db.delete(file)
            
            folder = db.query(Folder).filter(Folder.id == folder_id).first()
            if folder:
                db.delete(folder)
            
            db.commit()
        except Exception:
            db.rollback()
            raise HTTPException(500, "Failed to delete folder from database")

    def _build_breadcrumbs(self, db: Session, current_user: User, folder_id: int | None = None) -> List[Breadcrumb]:
        breadcrumbs = [{"id": None, "name": "Root"}]
        
        if folder_id is None:
            return [Breadcrumb(**b) for b in breadcrumbs]
        
        current = folder_id
        path_stack = []
        visited = set()
        
        while current:
            if current in visited:
                raise HTTPException(500, "Circular folder reference detected")
            visited.add(current)
            
            folder = db.query(Folder).filter(
                Folder.id == current,
                Folder.owner_id == current_user.id
            ).first()
            
            if not folder:
                raise HTTPException(404, "Folder not found or access denied")
                
            path_stack.append({"id": folder.id, "name": folder.name})
            current = folder.parent_folder_id
        
        breadcrumbs.extend(reversed(path_stack))
        
        return [Breadcrumb(**b) for b in breadcrumbs]

    def get_folder_content(self, db: Session, current_user: User, folder_id: int | None) -> FolderContentResponse:
        current_folder = None
        if folder_id is not None:
            current_folder = db.query(Folder).filter(
                Folder.id == folder_id,
            ).first()
            
            if not current_folder:
                raise HTTPException(404, "Folder not found or access denied")

        if current_folder and current_folder.owner_id != current_user.id:
            raise HTTPException(403, "Not authorized for this folder")

        subfolders = db.query(Folder).filter(
            Folder.owner_id == current_user.id,
            Folder.parent_folder_id == folder_id
        ).order_by(Folder.name.asc()).all()

        files = db.query(File).filter(
            File.owner_id == current_user.id,
            File.folder_id == folder_id
        ).order_by(File.uploaded_at.desc(), File.id.desc()).all()

        breadcrumbs = self._build_breadcrumbs(db, current_user, folder_id)

        folder_responses = [
            FolderResponse(
                id=f.id,
                name=f.name,
                parent_folder_id=f.parent_folder_id,
                created_at=f.created_at,
            )
            for f in subfolders
        ]

        file_responses = [
            FileResponse(
                id=f.id,
                name=f.name,
                size=f.size,
                status=f.status,
                uploaded_at=f.uploaded_at,
                folder_id=f.folder_id
            )
            for f in files
        ]

        return FolderContentResponse(
            folder_id=folder_id,
            path=breadcrumbs,
            folders=folder_responses,
            files=file_responses
        )


_drive_service = DriveService()

