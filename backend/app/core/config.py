import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./drivium.db")

SECRET_KEY = os.getenv("SECRET_KEY", "snaddad1asvxdcasdas9uasdnu9asd")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
ALGORITHM = os.getenv("ALGORITHM", "HS256")

PROJECT_NAME = os.getenv("PROJECT_NAME", "Drivium")
PROJECT_DESCRIPTION = os.getenv("PROJECT_DESCRIPTION", "Google Drive clone")
DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")