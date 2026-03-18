from fastapi import HTTPException
from minio import Minio
from app.core.config import MINIO_BUCKET_NAME, MINIO_ENDPOINT, MINIO_USER, MINIO_PASS, MINIO_SECURE
import logging
import urllib3
from urllib3.exceptions import MaxRetryError, NewConnectionError
from minio.error import S3Error

minio_client = None


def init_minio_client():
    global minio_client
    if minio_client is None:
        try:
            http_client = urllib3.PoolManager(
                timeout=urllib3.Timeout(connect=2.0, read=3.0),
                retries=urllib3.Retry(total=1, connect=1, read=1, backoff_factor=0.1),
            )

            minio_client = Minio(MINIO_ENDPOINT,
                                access_key=MINIO_USER,
                                secret_key=MINIO_PASS,
                                secure=MINIO_SECURE,
                                http_client=http_client)
            
            bucket = MINIO_BUCKET_NAME
            if not minio_client.bucket_exists(bucket):
                minio_client.make_bucket(bucket)
                logging.info(f"Bucket '{bucket}' created")
        
        except (MaxRetryError, NewConnectionError):
            raise HTTPException(
                status_code=503,
                detail={
                    "success": False,
                    "message": "Storage service unavailable (MinIO not running)",
                    "error": "MINIO_CONNECTION_REFUSED",
                    "service": "minio"
                }
            )
        except S3Error as e:
            raise HTTPException(
                status_code=503,
                detail={
                    "success": False,
                    "message": "Storage service error",
                    "error": "MINIO_S3_ERROR",
                    "service": "minio"
                }
            )
        except Exception as e:
            logging.error(f"MinIO init failed: {str(e)}")
            raise HTTPException(
                status_code=503,
                detail={
                    "success": False,
                    "message": "Storage service initialization failed",
                    "error": "MINIO_INIT_ERROR",
                    "service": "minio"
                }
            )
    return minio_client