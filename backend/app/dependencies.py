from app.database.database import SessionLocal
from app.database.minio import init_minio_client
from minio import Minio

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_minio() -> Minio:
    return init_minio_client()