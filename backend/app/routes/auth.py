from fastapi import Depends, routing
from app.schemas.auth import UserLogin, Token
from app.services.auth import AuthService
from app.dependencies import get_db, get_auth_service
from sqlalchemy.orm import Session

router = routing.APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db), auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.login(user_data, db)
