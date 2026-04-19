# Drivium

[![Demo](https://img.shields.io/badge/Live%20Demo-drivium.cloud-blue.svg)](https://www.drivium.cloud)
A cloud drive application for managing files and folders.

## Live Demo
DigitalOcean Droplet + Docker + Nginx reverse proxy.
- Demo live: [drivium.cloud](https://www.drivium.cloud)

## Frontend status

- frontend-ai-demo: built almost entirely with AI (except for client.js and service files), used for demo and backend validation.
- frontend: final hand-crafted implementation, currently in progress.

## Technologies

- Backend: FastAPI, SQLAlchemy, Pydantic
- Auth: JWT (python-jose)
- Database: PostgreSQL
- Storage: MinIO (S3-compatible, presigned URLs)
- Frontend: Svelte, Skeleton UI, Tailwind

## Implemented Features

- Register, login, and current-user endpoint
- Hierarchical drive structure (root/subfolders, breadcrumbs)
- File upload via presigned URL + upload confirmation
- File download via presigned URL
- Rename/move/delete for files and folders

## Backend Security

- Password hashing with Argon2/bcrypt
- JWT Bearer on protected routes
- Ownership-Based Access Control / Object-Level Authorization (owner_id verification on resources)
- Input validation (file/folder names, MIME allowlist, size limit)
- CORS configurable via environment variables

## Local Run

```bash
# Backend
cd backend
pip install -r requirements.txt
fastapi dev main.py

# Frontend demo
cd ../frontend-ai-demo
npm install
npm run dev
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- OpenAPI: http://localhost:8000/docs

## backend .env - Example for local run/testing
```
PROJECT_NAME=Drivium
DEBUG=True

# JWT Security  
SECRET_KEY=super-secret-drivium-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database (SQLite pentru dev/testing)
DATABASE_URL=sqlite:///./drivium.db

# MinIO (local development)
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=supersecret123
MINIO_BUCKET_NAME=drivium
MINIO_SECURE=false

# File upload security (optional for testing)
MAX_FILE_SIZE_BYTES=104857600  # 100MB
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```
## Planned Improvements

- New features: trash, starred, preview, share, storage quota
- Finalize frontend
- Store token in HttpOnly cookie
- Post-upload validation with magic bytes
- ETag/cache for folder listing

