from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.database.database import engine
from app.database.base import Base
from app.core.config import PROJECT_NAME, PROJECT_DESCRIPTION, DEBUG

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

@app.get("/")
async def root():
    return {"message": f"{PROJECT_NAME} is running."}
