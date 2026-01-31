from fastapi import Depends, routing
from app.schemas.user import UserCreate, UserResponse
from app.services.user import user_service
from app.database.database import get_db
from sqlalchemy.orm import Session

router = routing.APIRouter(prefix="/users", tags=["users"])

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    return user_service.create_user(user_data, db)