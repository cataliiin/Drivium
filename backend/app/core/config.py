import os
from dotenv import load_dotenv
from typing import List

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./drivium.db")

SECRET_KEY = os.getenv("SECRET_KEY", "snaddad1asvxdcasdas9uasdnu9asd")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
ALGORITHM = os.getenv("ALGORITHM", "HS256")

PROJECT_NAME = os.getenv("PROJECT_NAME", "Drivium")
PROJECT_DESCRIPTION = os.getenv("PROJECT_DESCRIPTION", "Google Drive clone")
DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")

FILENAME_PATTERN = os.getenv("FILENAME_PATTERN", r"^[a-zA-Z0-9_\-\.()]+$")

# CORS Configuration
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")
CORS_ALLOW_CREDENTIALS = os.getenv("CORS_ALLOW_CREDENTIALS", "true").lower() in ("true", "1", "t")
CORS_ALLOW_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
CORS_ALLOW_HEADERS = ["*"]

MAX_FILE_SIZE_BYTES = int(os.getenv("MAX_FILE_SIZE_BYTES", str(10 * 1024 * 1024 * 1024)))  # 10 GB default

ALLOWED_MIME_TYPES_DEFAULT = [
    "image/jpeg",
    "image/jpg",
    "image/png", 
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",

    "application/pdf",
    "text/plain",
    "text/csv",
    "text/markdown",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  # .docx
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",       # .xlsx
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", # .pptx
    "application/msword",           # .doc
    "application/vnd.ms-excel",     # .xls
    "application/vnd.ms-powerpoint",# .ppt
    "application/vnd.oasis.opendocument.text",      # .odt
    "application/vnd.oasis.opendocument.spreadsheet", # .ods
    "application/vnd.oasis.opendocument.presentation", # .odp

    "application/zip",
    "application/x-zip-compressed",
    "application/gzip",
    
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    
    "video/mp4",
    "video/webm",
    "video/ogg",
]

ALLOWED_MIME_TYPES: List[str] = os.getenv("ALLOWED_MIME_TYPES", ",".join(ALLOWED_MIME_TYPES_DEFAULT)).split(",")

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "localhost:9000")
MINIO_USER = os.getenv("MINIO_USER", "admin")
MINIO_PASS = os.getenv("MINIO_PASS", "supersecret123")
MINIO_BUCKET_NAME = os.getenv("MINIO_BUCKET_NAME", "drivium")
MINIO_SECURE = os.getenv("MINIO_SECURE", "false").lower() == "false"

PRESIGNED_UPLOAD_URL_EXPIRES_MINUTES: int = 60
PRESIGNED_DOWNLOAD_URL_EXPIRES_MINUTES: int = 60