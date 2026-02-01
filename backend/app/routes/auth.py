from fastapi import Depends, routing
from app.schemas.auth import UserLogin
from app.services.auth import AuthService
from app.dependencies import get_db
from sqlalchemy.orm import Session

router = routing.APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
async def login(user_data: UserLogin, db: Session = Depends(get_db), auth_service: AuthService = Depends()):
    return auth_service.login(user_data, db)
