import asyncio

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from minio.error import S3Error
from sqlalchemy import text
from starlette.concurrency import run_in_threadpool

from app.core.config import HEALTH_CHECK_TIMEOUT_SECONDS, MINIO_BUCKET_NAME
from app.database.database import engine
from app.database.minio import init_minio_client

router = APIRouter(tags=["System"])


def _check_database_sync() -> dict[str, object]:
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "ok"}
    except Exception as exc:
        return {
            "status": "error",
            "message": str(exc),
        }


def _check_minio_sync() -> dict[str, object]:
    try:
        minio_client = init_minio_client()
        bucket_exists = minio_client.bucket_exists(MINIO_BUCKET_NAME)
        return {
            "status": "ok",
            "bucket": MINIO_BUCKET_NAME,
            "bucket_exists": bucket_exists,
        }
    except HTTPException as exc:
        if isinstance(exc.detail, dict):
            return {
                "status": "error",
                **exc.detail,
            }
        return {
            "status": "error",
            "message": str(exc.detail),
        }
    except S3Error as exc:
        return {
            "status": "error",
            "message": f"S3 error: {str(exc)}",
        }
    except Exception as exc:
        return {
            "status": "error",
            "message": str(exc),
        }


async def _run_check_with_timeout(check_name: str, check_fn) -> dict[str, object]:
    try:
        return await asyncio.wait_for(
            run_in_threadpool(check_fn),
            timeout=HEALTH_CHECK_TIMEOUT_SECONDS,
        )
    except asyncio.TimeoutError:
        return {
            "status": "error",
            "message": f"{check_name} check timed out",
            "timeout_seconds": HEALTH_CHECK_TIMEOUT_SECONDS,
        }


@router.get("/health")
async def health_check() -> JSONResponse:
    db_task = asyncio.create_task(_run_check_with_timeout("database", _check_database_sync))
    minio_task = asyncio.create_task(_run_check_with_timeout("minio", _check_minio_sync))

    db_result, minio_result = await asyncio.gather(db_task, minio_task)

    checks = {
        "database": db_result,
        "minio": minio_result,
    }
    overall_ok = all(result.get("status") == "ok" for result in checks.values())

    return JSONResponse(
        status_code=200 if overall_ok else 503,
        content={
            "status": "ok" if overall_ok else "degraded",
            "checks": checks,
        },
    )
