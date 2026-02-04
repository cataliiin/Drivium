from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.database.database import engine
from app.database.base import Base
from app.core.config import PROJECT_NAME, PROJECT_DESCRIPTION, DEBUG
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

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(drive.router)

@app.get("/")
async def root():
    return {"message": f"{PROJECT_NAME} is running."}
