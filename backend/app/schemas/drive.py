from pydantic import BaseModel, ConfigDict, Field, field_validator
from enum import Enum
from typing import List, Optional
from datetime import datetime
from app.core.config import MAX_FILE_SIZE_BYTES, ALLOWED_MIME_TYPES

FILENAME_PATTERN = r"^[a-zA-Z0-9_\-\.()]+$"

class FileStatus(str, Enum):
    PENDING = "PENDING"
    UPLOADED = "UPLOADED"

class Breadcrumb(BaseModel):
    id: int | None = None
    name: str

# FILE
class FileUploadRequest(BaseModel):
    name: str = Field(..., max_length=255,pattern=FILENAME_PATTERN)
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

class FileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    size: int
    status: FileStatus
    uploaded_at: datetime | None = None
    folder_id: int | None = None

class FileEditRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    new_name: Optional[str] = Field(default=None, max_length=255, pattern=FILENAME_PATTERN)
    new_folder_id: Optional[int] = None

class FileDownloadResponse(BaseModel):
    url: str
    expires_at: datetime

# FOLDER
class FolderCreateRequest(BaseModel):
    name: str = Field(..., max_length=255,pattern=FILENAME_PATTERN)
    parent_folder_id: int | None = None

class FolderCreateResponse(BaseModel):
    id: int
    name: str

class FolderResponse(BaseModel):
    id: int
    name: str
    parent_folder_id: int | None = None
    created_at: datetime

class FolderEditRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    new_name: Optional[str] = Field(default=None, max_length=255, pattern=FILENAME_PATTERN)
    new_parent_folder_id: Optional[int] = None

# STATUS

class UploadStatusRequest(BaseModel):
    success: bool

# returns the contents of a folder and a way to navigate back
class FolderContentResponse(BaseModel):
    folder_id: int | None = None
    path: List[Breadcrumb] # root relative path for the current folder so that frontend can go back to parent folders
    folders: List[FolderResponse]
    files: List[FileResponse]
