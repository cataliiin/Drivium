from app.database.database import SessionLocal
from app.database.minio import init_minio_client
from minio import Minio
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.security import verify_token
from app.database.models import User
from app.services.user import _user_service
from app.services.auth import _auth_service
from app.services.drive import _drive_service

from fastapi.security.utils import get_authorization_scheme_param
from fastapi import Request, HTTPException, status
from starlette.status import HTTP_401_UNAUTHORIZED

# Databases
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_minio() -> Minio:
    return init_minio_client()

class HTTPBearerCookie(HTTPBearer):
    async def __call__(self, request: Request):
        # 1. incerca mai intai din header 
        try:
            return await super().__call__(request)
        except HTTPException:
            pass
        
        # 2. daca nu e in header, incearca din cookie
        authorization = request.cookies.get("access_token")
        if authorization is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated",
                headers={"WWW-Authenticate": "Bearer"},
            )
        scheme, param = get_authorization_scheme_param(authorization)
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid auth scheme",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return HTTPAuthorizationCredentials(scheme=scheme, token=param)

# Authentication
security = HTTPBearerCookie()
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)) -> User:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = verify_token(credentials.credentials)
    if token_data is None or token_data.user_id is None:
        raise credentials_exception
    
    user = _user_service.get_user(token_data.user_id, db)
    if user is None:
        raise credentials_exception
    
    return user

# Services

def get_user_service():
    return _user_service

def get_auth_service():
    return _auth_service

def get_drive_service():
    return _drive_service