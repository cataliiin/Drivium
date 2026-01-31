from fastapi import Depends, routing
from app.schemas.auth import UserLogin
from app.services.auth import auth_service
from app.database.database import get_db
from sqlalchemy.orm import Session

router = routing.APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    return auth_service.login(user_data, db)
