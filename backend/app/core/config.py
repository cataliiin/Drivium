import os
from pathlib import Path
from dotenv import load_dotenv
from typing import List

ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=ENV_PATH)

def _env_bool(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in ("true", "1", "t", "yes", "y", "on")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./drivium.db")

SECRET_KEY = os.getenv("SECRET_KEY", "snaddad1asvxdcasdas9uasdnu9asd")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
ALGORITHM = os.getenv("ALGORITHM", "HS256")

PROJECT_NAME = os.getenv("PROJECT_NAME", "Drivium")
PROJECT_DESCRIPTION = os.getenv("PROJECT_DESCRIPTION", "Google Drive clone")
DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")

FILENAME_PATTERN = os.getenv("FILENAME_PATTERN", r"^[a-zA-Z0-9_\-\.() ]+$")

# CORS Configuration
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173,http://localhost:5174").split(",")
CORS_ALLOW_CREDENTIALS = os.getenv("CORS_ALLOW_CREDENTIALS", "true").lower() in ("true", "1", "t")
CORS_ALLOW_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
CORS_ALLOW_HEADERS = ["*"]

MAX_FILE_SIZE_BYTES = int(os.getenv("MAX_FILE_SIZE_BYTES", str(10 * 1024 * 1024 * 1024)))  # 10 GB default

ALLOWED_MIME_TYPES_DEFAULT = [
    "application/x-msdownload", "application/x-msi", "application/x-executable",
    "application/x-apple-diskimage", "application/x-debian-package", 
    "application/x-redhat-package-manager", "application/x-ms-shortcut",
    "application/octet-stream",

    "application/x-blender", "model/obj", "model/mtl", "model/gltf+json", 
    "model/gltf-binary", "application/x-maya", "application/x-fbx", 
    "application/vmd.ms-pki.stl", "text/x-godot-scene", "text/x-gdscript",
    "application/x-unity-package", "application/x-unreal-engine", "text/x-csharp",

    "text/x-python", "text/x-python-script", "application/x-python-code",
    "text/x-csrc", "text/x-chdr", "text/x-c++src", "text/x-c++hdr",
    "text/x-java-source", "application/java-archive", "text/javascript", 
    "application/javascript", "text/typescript", "text/css", "text/html", 
    "application/json", "application/xml", "text/xml", "text/x-php", 
    "application/x-php", "text/x-ruby", "text/x-shellscript", "text/x-perl", 
    "text/x-rustsrc", "text/x-yaml", "application/x-yaml", "application/toml",
    "text/x-go", "text/x-swift", "text/x-kotlin", "application/wasm",

    "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
    "image/bmp", "image/tiff", "image/x-icon", "image/heic", "application/postscript",
    "image/vnd.adobe.photoshop", "image/x-adobe-dng", "application/x-indesign",
    "application/dwg", "application/dxf", # AutoCAD

    "application/pdf", "text/plain", "text/csv", "text/markdown", "application/rtf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword", "application/vnd.ms-excel", "application/vnd.ms-powerpoint",
    "application/vnd.oasis.opendocument.text", "application/vnd.oasis.opendocument.spreadsheet",

    "application/zip", "application/x-zip-compressed", "application/x-7z-compressed",
    "application/vnd.rar", "application/x-rar-compressed", "application/gzip", "application/x-tar",

    "audio/mpeg", "audio/wav", "audio/ogg", "audio/aac", "audio/flac", "audio/x-m4a",
    "video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo", "video/x-matroska",

    "application/x-sqlite3", "application/sql", "font/ttf", "font/otf", "font/woff", "font/woff2"
]

ALLOWED_MIME_TYPES: List[str] = os.getenv("ALLOWED_MIME_TYPES", ",".join(ALLOWED_MIME_TYPES_DEFAULT)).split(",")

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", os.getenv("MINIO_USER", "secret_key"))
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", os.getenv("MINIO_PASS", "secret_key"))
# Backward-compatible aliases used by existing imports.
MINIO_USER = MINIO_ACCESS_KEY
MINIO_PASS = MINIO_SECRET_KEY
MINIO_BUCKET_NAME = os.getenv("MINIO_BUCKET_NAME", "drivium")
MINIO_SECURE = _env_bool("MINIO_SECURE", default=False)
HEALTH_CHECK_TIMEOUT_SECONDS = float(
    os.getenv("HEALTH_CHECK_TIMEOUT_SECONDS", os.getenv("HEALTH_CHECK_TIMEOUT", "6.0"))
)

PRESIGNED_UPLOAD_URL_EXPIRES_MINUTES: int = 60
PRESIGNED_DOWNLOAD_URL_EXPIRES_MINUTES: int = 60