import sqlalchemy as sa
from app.database.base import Base
from enum import Enum as PyEnum # as pyenum to avoid conflict with sqlalchemy Enum

class FileStatus(str, PyEnum):
    PENDING = "PENDING"
    UPLOADED = "UPLOADED"

class User(Base):
    __tablename__ = "user_account"
    
    id = sa.Column(sa.Integer, primary_key=True, index=True, autoincrement=True)
    username = sa.Column(sa.String(64), unique=True, index=True, nullable=False)
    email = sa.Column(sa.String(255), unique=True, index=True, nullable=False)
    password_hash = sa.Column(sa.String(255), nullable=False)
    created_at = sa.Column(sa.DateTime(timezone=True), server_default=sa.func.now())
    is_active = sa.Column(sa.Boolean, default=True)
    
    folders = sa.orm.relationship("Folder", back_populates="owner")
    files = sa.orm.relationship("File", back_populates="owner")

class Folder(Base):
    __tablename__ = "folders"
    
    id = sa.Column(sa.Integer, primary_key=True, index=True, autoincrement=True)
    owner_id = sa.Column(sa.Integer, sa.ForeignKey("user_account.id"), nullable=False, index=True)
    parent_folder_id = sa.Column(sa.Integer, sa.ForeignKey("folders.id"), nullable=True, index=True)
    name = sa.Column(sa.String(255), nullable=False)
    created_at = sa.Column(sa.DateTime(timezone=True), server_default=sa.func.now())
    
    owner = sa.orm.relationship("User", back_populates="folders")
    parent = sa.orm.relationship("Folder", remote_side=[id], back_populates="subfolders")
    subfolders = sa.orm.relationship("Folder", back_populates="parent")
    files = sa.orm.relationship("File", back_populates="folder")

class File(Base):
    __tablename__ = "files"
    
    id = sa.Column(sa.Integer, primary_key=True, index=True, autoincrement=True)
    owner_id = sa.Column(sa.Integer, sa.ForeignKey("user_account.id"), nullable=False, index=True)
    folder_id = sa.Column(sa.Integer, sa.ForeignKey("folders.id"), nullable=True, index=True)
    name = sa.Column(sa.String(255), nullable=False)
    storage_key = sa.Column(sa.String(512), unique=True, nullable=False, index=True)
    size = sa.Column(sa.BigInteger, nullable=False, default=0)
    mime_type = sa.Column(sa.String(100), nullable=False, default="application/octet-stream")
    status = sa.Column(sa.Enum(FileStatus), default=FileStatus.PENDING, index=True)
    uploaded_at = sa.Column(sa.DateTime(timezone=True), server_default=sa.func.now())
    
    owner = sa.orm.relationship("User", back_populates="files")
    folder = sa.orm.relationship("Folder", back_populates="files")
