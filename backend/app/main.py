from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine
from app.database.base import Base
from app.core.config import (
    PROJECT_NAME, 
    PROJECT_DESCRIPTION, 
    DEBUG,
    CORS_ORIGINS,
    CORS_ALLOW_CREDENTIALS,
    CORS_ALLOW_METHODS,
    CORS_ALLOW_HEADERS
)
from app.routes import auth, users, drive

@asynccontextmanager
async def lifespan(app: FastAPI):
    # STARTUP
    Base.metadata.create_all(bind=engine)
    print("Tables created")

    yield

    # SHUTDOWN - cleanup
    print("App shutdown")

app = FastAPI(
    title=PROJECT_NAME,
    description=PROJECT_DESCRIPTION,
    debug=DEBUG,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=CORS_ALLOW_CREDENTIALS,
    allow_methods=CORS_ALLOW_METHODS,
    allow_headers=CORS_ALLOW_HEADERS,
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(drive.router)

@app.get("/")
async def root():
    return {"message": f"{PROJECT_NAME} is running."}
