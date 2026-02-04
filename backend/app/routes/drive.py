from fastapi import Depends, routing
from app.dependencies import get_db, get_minio, get_drive_service, get_current_user
from sqlalchemy.orm import Session
from app.schemas.drive import *
from app.core.config import PRESIGNED_DOWNLOAD_URL_EXPIRES_MINUTES
from datetime import datetime, timedelta, timezone

router = routing.APIRouter(prefix="/drive", tags=["drive"])

# FILE OPERATIONS

# Generate presigned URL for file upload
@router.post("/files", response_model=FileUploadResponse)
async def request_file_upload(file: FileUploadRequest, 
                              db: Session = Depends(get_db), 
                              minio = Depends(get_minio), 
                              drive_service = Depends(get_drive_service), 
                              current_user = Depends(get_current_user)):
    
    return drive_service.get_upload_url(file, db, minio, current_user)

# Frontend calls this after successful upload to minio - > the status of the file changes to UPLOADED
@router.patch("/files/{file_id}/upload-confirm")
async def confirm_file_upload( file_id: int,
                               file_data: UploadStatusRequest,
                               db: Session = Depends(get_db), 
                               drive_service = Depends(get_drive_service), 
                               current_user = Depends(get_current_user)):
    
    drive_service.update_upload_status(file_id, file_data, db, current_user)
    return {"message": "File upload confirmed."}

# Generate presigned URL for file download
@router.get("/files/{file_id}/download-url", response_model=FileDownloadResponse)
async def request_file_download(file_id: int, 
                                db: Session = Depends(get_db), 
                                minio = Depends(get_minio), 
                                drive_service = Depends(get_drive_service), 
                                current_user = Depends(get_current_user)):
    
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=PRESIGNED_DOWNLOAD_URL_EXPIRES_MINUTES)
    
    return FileDownloadResponse(
        url=drive_service.get_download_url(file_id, db, minio, current_user),
        expires_at=expires_at
    )

@router.delete("/files/{file_id}")
async def delete_file(file_id: int, 
                      db: Session = Depends(get_db), 
                      minio = Depends(get_minio), 
                      drive_service = Depends(get_drive_service), 
                      current_user = Depends(get_current_user)):
    
    drive_service.delete_file(file_id, db, minio, current_user)
    return {"message": "File deleted successfully."}

# Rename or move a file, return updated file metadata
@router.patch("/files/{file_id}", response_model=FileResponse)
async def edit_file(file_id: int,
                      request: FileEditRequest,
                      db: Session = Depends(get_db), 
                      drive_service = Depends(get_drive_service), 
                      current_user = Depends(get_current_user)):
    
    return drive_service.edit_file(file_id, request, db, current_user)

# FOLDER OPERATIONS

# Create a new folder
@router.post("/folders", response_model=FolderCreateResponse)
async def create_folder(request: FolderCreateRequest,
                        db: Session = Depends(get_db), 
                        drive_service = Depends(get_drive_service), 
                        current_user = Depends(get_current_user)):
    
    return drive_service.create_folder(request, db, current_user)

@router.delete("/folders/{folder_id}")
async def delete_folder(folder_id: int, 
                        db: Session = Depends(get_db), 
                        minio = Depends(get_minio),
                        drive_service = Depends(get_drive_service), 
                        current_user = Depends(get_current_user)):
    
    drive_service.delete_folder(folder_id, db, minio, current_user)
    return {"message": "Folder deleted successfully."}

@router.patch("/folders/{folder_id}", response_model=FolderResponse)
async def edit_folder(folder_id: int,
                      request: FolderEditRequest,
                      db: Session = Depends(get_db), 
                      drive_service = Depends(get_drive_service), 
                      current_user = Depends(get_current_user)):
    
    return drive_service.edit_folder(folder_id, request, db, current_user)

# List contents of a folder
@router.get("/folders/contents", response_model=FolderContentResponse)
async def list_folder_contents(folder_id: int | None = None,
                               db: Session = Depends(get_db), 
                               drive_service = Depends(get_drive_service), 
                               current_user = Depends(get_current_user)):
    
    return drive_service.get_folder_content(db, current_user, folder_id)