from minio import Minio
from app.core.config import MINIO_BUCKET_NAME, MINIO_ENDPOINT, MINIO_USER, MINIO_PASS, MINIO_SECURE
import logging

minio_client = None

def init_minio_client():
    global minio_client
    if minio_client is None:
        minio_client = Minio(MINIO_ENDPOINT,
                              access_key=MINIO_USER,
                              secret_key=MINIO_PASS,
                              secure=MINIO_SECURE)
        
        bucket = MINIO_BUCKET_NAME
        if not minio_client.bucket_exists(bucket):
            minio_client.make_bucket(bucket)
            logging.info(f"Bucket '{bucket}' created")
    
    return minio_client