from pydantic import BaseModel, Field, field_validator
from enum import Enum
from typing import List
from datetime import datetime
from app.core.config import MAX_FILE_SIZE_BYTES, ALLOWED_MIME_TYPES

class FileStatus(str, Enum):
    PENDING = "PENDING"
    UPLOADED = "UPLOADED"

class Breadcrumb(BaseModel):
    id: int | None = None
    name: str

# FILE
class FileUploadRequest(BaseModel):
    name: str = Field(..., max_length=255,pattern=r"^[a-zA-Z0-9_\-\.()]+$")
    size: int = Field(..., ge=0, le=MAX_FILE_SIZE_BYTES)
    mime_type: str = Field(..., max_length=255)
    folder_id: int | None = None

    @field_validator('mime_type')
    @classmethod
    def check_mime_type(cls, v: str) -> str:
        if v not in ALLOWED_MIME_TYPES:
            raise ValueError(f"Invalid file type: {v}.")
        return v

class FileUploadResponse(BaseModel):
    file_id: int
    presigned_url: str
    status: FileStatus = FileStatus.PENDING

class FileResponse(BaseModel):
    id: int
    name: str
    size: int
    status: FileStatus
    uploaded_at: datetime | None = None
    folder_id: int | None = None

# FOLDER
class FolderCreateRequest(BaseModel):
    name: str = Field(..., max_length=255,pattern=r"^[a-zA-Z0-9_\-\.()]+$")
    parent_folder_id: int | None = None

class FolderCreateResponse(BaseModel):
    id: int
    name: str

class FolderResponse(BaseModel):
    id: int
    name: str
    parent_folder_id: int | None = None
    created_at: datetime
    file_count: int = 0
    subfolder_count: int = 0

class UploadStatusRequest(BaseModel):
    file_id: int = Field(..., gt=0)
    success: bool

class UploadStatusResponse(BaseModel):
    success: bool

# returns the contents of a folder and a way to navigate back
class FolderContentResponse(BaseModel):
    folder_id: int | None = None
    path: List[Breadcrumb] # root relative path for the current folder so that frontend can go back to parent folders
    folders: List[FolderResponse]
    files: List[FileResponse]
