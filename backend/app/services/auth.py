from app.schemas.auth import UserLogin, TokenData
from app.database.models import User
from app.core.security import create_access_token, verify_password
from sqlalchemy.orm import Session
from fastapi import HTTPException

class AuthService:
    def login(self, user_data: UserLogin, db: Session):
        user = db.query(User).filter(User.username == user_data.username).first()

        if not user or not verify_password(user_data.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid username or password")

        token_data = TokenData(username=user.username, user_id=user.id)
        access_token = create_access_token(token_data)

        return {"access_token": access_token, "token_type": "bearer"}
    
_auth_service = AuthService()