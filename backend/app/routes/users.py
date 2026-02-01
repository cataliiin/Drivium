from fastapi import Depends, routing
from app.schemas.user import UserCreate, UserResponse
from app.services.user import UserService
from app.dependencies import get_db, get_user_service
from sqlalchemy.orm import Session
from app.dependencies import get_current_user
from app.database.models import User

router = routing.APIRouter(prefix="/users", tags=["users"])

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db), user_service: UserService = Depends(get_user_service)):
    return user_service.create_user(user_data, db)

@router.get("/me", response_model=UserResponse)
async def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user