from app.schemas.user import UserCreate, UserResponse
from app.database.models import User
from app.core.security import get_password_hash
from sqlalchemy.orm import Session
from fastapi import HTTPException

class UserService:
    def create_user(self, user_data: UserCreate, db: Session) -> User:
        if db.query(User).filter(User.email == user_data.email).first():
            raise HTTPException(status_code=400, detail="Email already registered")
        if db.query(User).filter(User.username == user_data.username).first():
            raise HTTPException(status_code=400, detail="Username already taken")

        db_user = User(
            username=user_data.username,
            email=user_data.email,
            password_hash=get_password_hash(user_data.password)
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        return UserResponse.model_validate(db_user)

_user_service = UserService()