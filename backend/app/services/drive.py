import uuid
from sqlalchemy.orm import Session
from app.schemas.drive import FileUploadRequest, FileUploadResponse, FileStatus, FolderCreateRequest, FolderCreateResponse
from app.core.config import MINIO_BUCKET_NAME, PRESIGNED_DOWNLOAD_URL_EXPIRES_MINUTES, PRESIGNED_UPLOAD_URL_EXPIRES_MINUTES
from app.database.models import File, Folder, User
from fastapi import HTTPException
from minio import Minio
from minio.error import S3Error
from datetime import timedelta

class DriveService:
    def __init__(self):
        self.BUCKET_NAME = MINIO_BUCKET_NAME

    def get_upload_url(self, file_data: FileUploadRequest, db: Session, minio: Minio, current_user: User) -> FileUploadResponse:
        if file_data.folder_id:
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
            
        except S3Error:
            db.rollback()
            raise HTTPException(503, "Object storage unavailable")
        except Exception as e:
            db.rollback()
            raise HTTPException(500, f"Failed to generate upload URL: {str(e)}")
        
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
            
    def create_folder(self, folder_data: FolderCreateRequest, db: Session, current_user: User) -> FolderCreateResponse:
        if folder_data.parent_folder_id:
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