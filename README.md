# Drivium

**🌐 Live Demo: [drivium.cloud](https://drivium.cloud)**

> [!NOTE]
> The demo runs on budget hosting — performance (upload/download speeds, response times) may not reflect what the stack can do on proper hardware.

A self-hosted cloud storage application built with **FastAPI** and **SvelteKit 5**. Files are stored as objects in MinIO (S3-compatible), metadata and folder hierarchy are persisted in PostgreSQL, and the entire stack is orchestrated with Docker Compose behind an Nginx reverse proxy.

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend](#backend)
  - [API Endpoints](#api-endpoints)
  - [Authentication Flow](#authentication-flow)
  - [File Upload Flow](#file-upload-flow)
  - [Data Models](#data-models)
  - [Configuration](#backend-configuration)
- [Frontend](#frontend)
  - [Routing](#routing)
  - [API Client](#api-client)
  - [Drive Service](#drive-service)
  - [Authentication](#frontend-authentication)
  - [Configuration](#frontend-configuration)
- [Infrastructure](#infrastructure)
  - [Docker Compose Services](#docker-compose-services)
  - [Nginx Routing](#nginx-routing)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Environment Variables Reference](#environment-variables-reference)

---

## Architecture

```
Browser
  │
  ▼
Nginx (:80 / :443)
  ├── /api/*        → FastAPI backend  (:8000)
  ├── /storage/*    → MinIO S3 API     (:9000)   ← presigned URLs resolve here
  └── /*            → SvelteKit SSR    (:3000)

FastAPI backend
  ├── SQLAlchemy ORM  → PostgreSQL  (metadata + users + folders)
  └── Minio SDK       → MinIO       (blob storage)
```

**Upload path (two-step presigned PUT):**

1. Frontend sends file metadata to `POST /drive/files` → backend creates a `PENDING` DB record and returns a MinIO presigned PUT URL.
2. Frontend uploads the binary directly to MinIO via `PUT <presigned_url>` (bypasses the backend entirely).
3. Frontend calls `PATCH /drive/files/{id}/upload-confirm` → backend flips status to `UPLOADED`.

This design keeps large file data out of the application server.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend API | Python 3.12 · FastAPI · Uvicorn |
| ORM | SQLAlchemy (sync) |
| Database | PostgreSQL 15 |
| Object Storage | MinIO (S3-compatible) |
| Password Hashing | Argon2 (primary) / bcrypt (fallback) via passlib |
| JWT | python-jose (HS256) |
| Frontend | SvelteKit 5 · Svelte 5 · TypeScript |
| UI Components | Skeleton UI v4 · Lucide Svelte |
| CSS | Tailwind CSS v4 |
| HTTP Client | openapi-fetch (type-safe, generated from OpenAPI schema) |
| Reverse Proxy | Nginx 1.27 |
| Containerisation | Docker · Docker Compose |

---

## Project Structure

```
Drivium/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py          # All env-var configuration
│   │   │   ├── security.py        # Password hashing + JWT
│   │   │   └── health.py          # /health endpoint (DB + MinIO checks)
│   │   ├── database/
│   │   │   ├── base.py            # SQLAlchemy declarative Base
│   │   │   ├── database.py        # Engine + SessionLocal factory
│   │   │   ├── models.py          # ORM models: User, Folder, File
│   │   │   └── minio.py           # MinIO client singleton + bucket init
│   │   ├── routes/
│   │   │   ├── auth.py            # POST /auth/login
│   │   │   ├── users.py           # POST /users/register, GET /users/me
│   │   │   └── drive.py           # All /drive/* endpoints
│   │   ├── schemas/
│   │   │   ├── auth.py            # UserLogin, Token, TokenData
│   │   │   ├── user.py            # UserCreate, UserResponse
│   │   │   └── drive.py           # File/Folder request + response schemas
│   │   ├── services/
│   │   │   ├── auth.py            # AuthService (login)
│   │   │   ├── user.py            # UserService (register, get)
│   │   │   └── drive.py           # DriveService (all file/folder logic)
│   │   ├── dependencies.py        # FastAPI DI: DB session, MinIO, auth
│   │   └── main.py                # FastAPI app, lifespan, CORS, routers
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── hooks.server.ts        # Global server hook: health check + JWT verification
│       ├── lib/
│       │   ├── api/
│       │   │   ├── client.ts      # openapi-fetch client + error middleware
│       │   │   ├── contracts.ts   # Re-exported OpenAPI types
│       │   │   ├── openapi-generated-schema.ts  # Auto-generated from FastAPI
│       │   │   ├── auth.ts        # login() API call
│       │   │   ├── drive.ts       # All drive API calls
│       │   │   ├── users.ts       # register(), me() API calls
│       │   │   └── health.ts      # health() API call
│       │   ├── components/
│       │   │   ├── Sidebar.svelte          # Nav, upload button, upload queue UI
│       │   │   ├── FileRow.svelte          # File table row
│       │   │   ├── FolderRow.svelte        # Folder table row
│       │   │   ├── DriveBreadcrumbs.svelte # Path breadcrumbs
│       │   │   ├── DriveTableHead.svelte   # Table header
│       │   │   ├── DriveItemActionsMenu.svelte  # Right-click context menu
│       │   │   ├── DriveLoadingPlaceholder.svelte
│       │   │   ├── TextInputModal.svelte   # Generic text input dialog
│       │   │   ├── Navbar.svelte
│       │   │   └── Logo.svelte
│       │   ├── services/
│       │   │   ├── driveService.svelte.ts  # Svelte 5 reactive drive state + actions
│       │   │   └── toastService.svelte.ts  # Toast notification state
│       │   └── utils/
│       │       └── errorHandling.ts
│       └── routes/
│           ├── (site)/             # Public landing page
│           ├── (auth)/             # Login / Register pages
│           │   ├── login/
│           │   └── register/
│           ├── (app-protected)/    # Authenticated area
│           │   ├── drive/[[folderId]]/   # Drive view (optional folder param)
│           │   └── account/
│           └── logout/             # Form action: clears cookie, redirects
│
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
└── .env.docker.example
```

---

## Backend

### API Endpoints

#### Auth · `/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/login` | ✗ | Authenticate; returns `{ access_token, token_type }` |

#### Users · `/users`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/users/register` | ✗ | Create account |
| `GET` | `/users/me` | ✓ | Return current user info |

#### Drive – Files · `/drive/files`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/drive/files` | ✓ | Request upload ticket → returns `{ file_id, presigned_url }` |
| `PATCH` | `/drive/files/{file_id}/upload-confirm` | ✓ | Confirm upload success or failure |
| `GET` | `/drive/files/{file_id}/download-url` | ✓ | Generate presigned GET URL (60 min TTL) |
| `PATCH` | `/drive/files/{file_id}` | ✓ | Rename or move file |
| `DELETE` | `/drive/files/{file_id}` | ✓ | Delete file from MinIO + DB |

#### Drive – Folders · `/drive/folders`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/drive/folders/contents` | ✓ | List root folder (folders + files + breadcrumbs) |
| `GET` | `/drive/folders/contents/{folder_id}` | ✓ | List a subfolder |
| `POST` | `/drive/folders` | ✓ | Create folder |
| `PATCH` | `/drive/folders/{folder_id}` | ✓ | Rename or move folder |
| `DELETE` | `/drive/folders/{folder_id}` | ✓ | Recursively delete folder tree from MinIO + DB |

#### System

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Parallel check of DB (`SELECT 1`) and MinIO (bucket exists); returns `200 ok` or `503 degraded` |
| `GET` | `/` | Liveness probe |

> Auto-generated interactive docs available at `/docs` (Swagger UI) and `/redoc`.

---

### Authentication Flow

```
Client  →  POST /auth/login  { username, password }
Backend →  verify_password(argon2/bcrypt)
        →  create_access_token(TokenData{username, user_id})  [HS256 JWT]
        ←  { access_token, token_type: "bearer" }

SvelteKit server action stores token in an HttpOnly cookie (`access_token`).

Subsequent requests: backend reads token from
  1. Authorization: Bearer <token>  header, OR
  2. access_token cookie  (custom HTTPBearerCookie dependency)
```

Token expiry is configurable via `ACCESS_TOKEN_EXPIRE_MINUTES` (default 30 min; the frontend cookie is set for 7 days and refreshed on re-login).

---

### File Upload Flow

```
1. Frontend  →  POST /drive/files  { name, size, mime_type, folder_id? }
               Backend validates:
                 - filename against FILENAME_PATTERN regex
                 - size ≤ MAX_FILE_SIZE_BYTES (default: 10 GB)
                 - mime_type in ALLOWED_MIME_TYPES list
               Backend creates File record (status=PENDING, storage_key=UUID)
               Backend generates MinIO presigned PUT URL (60 min TTL)
            ←  { file_id, presigned_url }

2. Frontend  →  PUT <presigned_url>  (direct to MinIO/Nginx /storage/*)
            ←  200 OK from MinIO

3. Frontend  →  PATCH /drive/files/{file_id}/upload-confirm  { success: true }
               Backend sets status=UPLOADED, sets uploaded_at=now()
            ←  FileResponse

   On failure: success=false → Backend deletes the PENDING record.
```

Object storage path layout: `users/{user_id}/{storage_key}` (UUID, no file extension — original filename lives only in the DB).

---

### Data Models

```
user_account
  id            INTEGER PK
  username      VARCHAR(64) UNIQUE NOT NULL
  email         VARCHAR(255) UNIQUE NOT NULL
  password_hash VARCHAR(255) NOT NULL
  created_at    TIMESTAMPTZ DEFAULT now()
  is_active     BOOLEAN DEFAULT true

folders
  id               INTEGER PK
  owner_id         INTEGER FK → user_account.id
  parent_folder_id INTEGER FK → folders.id (self-referential, nullable = root)
  name             VARCHAR(255) NOT NULL
  created_at       TIMESTAMPTZ DEFAULT now()

files
  id          INTEGER PK
  owner_id    INTEGER FK → user_account.id
  folder_id   INTEGER FK → folders.id (nullable = root)
  name        VARCHAR(255) NOT NULL
  storage_key VARCHAR(512) UNIQUE NOT NULL  ← UUID used as MinIO object name
  size        BIGINT NOT NULL
  mime_type   VARCHAR(100) NOT NULL
  status      ENUM('PENDING', 'UPLOADED') DEFAULT 'PENDING'
  uploaded_at TIMESTAMPTZ DEFAULT now()
```

All user-level operations enforce `owner_id = current_user.id` before any mutation.

---

### Backend Configuration

All settings are loaded from environment variables in `backend/app/core/config.py`. Defaults are development-safe but must be overridden in production.

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./drivium.db` | SQLAlchemy DB URL |
| `SECRET_KEY` | *(insecure placeholder)* | JWT signing key |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | JWT lifetime |
| `MINIO_ENDPOINT` | `localhost:9000` | MinIO host:port |
| `MINIO_ACCESS_KEY` | `secret_key` | MinIO access key |
| `MINIO_SECRET_KEY` | `secret_key` | MinIO secret key |
| `MINIO_BUCKET_NAME` | `drivium` | Bucket name (auto-created if missing) |
| `MINIO_SECURE` | `false` | Use TLS to MinIO |
| `MINIO_PUBLIC_PREFIX` | `/storage` | URL prefix rewritten in presigned URLs |
| `MAX_FILE_SIZE_BYTES` | `10737418240` (10 GB) | Max upload size |
| `FILENAME_PATTERN` | `^[a-zA-Z0-9_\-\.() ]+$` | Allowed filename characters |
| `CORS_ORIGINS` | `http://localhost:3000,...` | Allowed CORS origins |
| `HEALTH_CHECK_TIMEOUT_SECONDS` | `6.0` | Per-service health check timeout |
| `PRESIGNED_UPLOAD_URL_EXPIRES_MINUTES` | `60` | Upload URL TTL |
| `PRESIGNED_DOWNLOAD_URL_EXPIRES_MINUTES` | `60` | Download URL TTL |

---

## Frontend

Built with **SvelteKit 5** using Svelte 5's runes (`$state`, `$derived`, `$effect`) for reactivity.

### Routing

SvelteKit file-based routing with three layout groups:

| Group | Path prefix | Guard | Purpose |
|---|---|---|---|
| `(site)` | `/` | None | Landing page, privacy policy, ToS |
| `(auth)` | `/login`, `/register` | Redirect to `/drive` if logged in | Auth pages |
| `(app-protected)` | `/drive`, `/account` | Redirect to `/login` if not logged in | App |

**`hooks.server.ts`** runs on every server request:
1. Calls `/health` on the backend — returns `503` to the user if the backend is down.
2. Verifies the `access_token` HttpOnly cookie via `jsonwebtoken` (same secret as the backend).
3. Populates `event.locals.user` and `event.locals.is_logged_in`.

Auth guard layouts read `locals.is_logged_in` and issue `redirect(302)` as needed.

**Drive route**: `/drive/[[folderId]]` — the optional `folderId` parameter allows navigating into any folder. The page loader streams the folder content promise so the UI is immediately interactive while data loads.

---

### API Client

`src/lib/api/client.ts` creates a type-safe HTTP client using **openapi-fetch** bound to the auto-generated `openapi-generated-schema.ts` (generated from FastAPI's `/openapi.json`).

A middleware layer:
- Attaches `credentials: 'include'` to every request (sends the HttpOnly cookie).
- On non-2xx responses, extracts a human-readable error message from `detail` (FastAPI validation errors) or `message` fields.
- On network errors, normalises to `new Error('Network error')`.

**SSR URL resolution**: When running server-side (SvelteKit SSR), requests to a relative `/api` path are rewritten to `http://backend:8000` (Docker internal hostname) so intra-container calls work without going through Nginx.

---

### Drive Service

`src/lib/services/driveService.svelte.ts` — a Svelte 5 reactive class (singleton) managing all drive state and actions:

```typescript
class DriveService {
  uploadQueue = $state<UploadItem[]>([]);   // reactive upload queue
  isUploading  = $state(false);
  currentUpload = $derived(...);            // item currently uploading

  registerUploadFiles(files, parentFolderId)  // enqueues files, starts processing
  downloadFile(fileId, fileName)              // fetches presigned URL, clicks hidden <a>
  createFolder(name, parentFolderId)
  renameItem(name, id, type, extension?)
  deleteItem(id, type)
}
```

Upload progress tracking uses `XMLHttpRequest` with `upload.progress` events — Fetch API does not expose upload progress. Speed (MB/s) and ETA are computed from elapsed time and bytes transferred.

After mutations, `invalidateAll()` from `$app/navigation` triggers SvelteKit to re-run all active `load` functions, keeping the UI in sync without a full page reload.

---

### Frontend Authentication

- **Login**: SvelteKit form action (`+page.server.ts`) calls `POST /auth/login`, receives the JWT, and stores it as an **HttpOnly, SameSite=Lax** cookie (`access_token`). The `secure` flag is set only when the request arrives over HTTPS.
- **Logout**: A form action at `/logout` deletes the `access_token` cookie and redirects to `/`.
- **Session validation**: On every server request, `hooks.server.ts` verifies the JWT locally (no round-trip to the backend for auth checks). Invalid or expired tokens clear the cookie.

---

### Frontend Configuration

| Variable | Scope | Description |
|---|---|---|
| `PUBLIC_API_BASE_URL` | Build-time | Base URL of the API as seen from the browser (e.g. `/api`). Set as a Docker build arg so it's baked into the bundle. |
| `JWT_SECRET_KEY` | Runtime env | Same secret as the backend; used by `hooks.server.ts` to verify JWT cookies server-side. |
| `ORIGIN` | Runtime env | The public origin of the app (e.g. `https://drivium.cloud`); required by `@sveltejs/adapter-node` for CSRF protection. |
| `PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER` | Runtime env | Forwarded headers from Nginx so SvelteKit knows the real protocol/host behind the proxy. |

---

## Infrastructure

### Docker Compose Services

| Service | Image | Internal port | Notes |
|---|---|---|---|
| `postgres` | `postgres:15-alpine` | 5432 | Health-checked; backend waits for `service_healthy` |
| `minio` | `minio/minio:latest` | 9000 (API), 9001 (console) | Data volume `minio_data` |
| `backend` | Built from `./backend` | 8000 | Depends on `postgres` (healthy) + `minio` |
| `frontend` | Built from `./frontend` | 3000 | Depends on `backend` |
| `nginx` | `nginx:1.27-alpine` | **80** (host) | Depends on all three services |

Only Nginx is exposed to the host. All other containers communicate over Docker's internal network.

---

### Nginx Routing

```
GET /api/...      → strips /api prefix → backend:8000
GET /storage/...  → strips /storage prefix → minio:9000
                    (proxy_buffering off, 300 s timeouts for large file I/O)
GET /*            → frontend:3000
                    (WebSocket upgrade headers for SvelteKit HMR in dev)
```

The included `nginx.conf` also contains the HTTPS/TLS configuration for `drivium.cloud` (Let's Encrypt certificates, HTTP→HTTPS redirect, TLS 1.2/1.3).

---

## Local Development

### Prerequisites

- Python 3.12+
- Node.js 22+
- Docker + Docker Compose (for PostgreSQL and MinIO)

### Backend

```bash
# Start dependencies
docker compose up postgres minio -d

# Create virtualenv and install
cd backend
python -m venv ../venv
../venv/Scripts/activate          # Windows
pip install -r requirements.txt

# Configure (copy and edit .env)
cp ../.env.docker.example .env
# Set DATABASE_URL=sqlite:///./drivium.db for local dev or
# Set DATABASE_URL=postgresql+psycopg2://drivium:drivium@localhost:5432/drivium

uvicorn app.main:app --reload --port 8000
# Docs: http://localhost:8000/docs
```

### Frontend

```bash
cd frontend

# Create .env with:
# PUBLIC_API_BASE_URL=http://localhost:8000
# JWT_SECRET_KEY=<same as backend SECRET_KEY>

npm install
npm run dev
# App: http://localhost:5173
```

---

## Production Deployment

```bash
# 1. Copy and fill in the env file
cp .env.docker.example .env
# Edit: JWT_SECRET_KEY, POSTGRES_PASSWORD, MINIO_ROOT_PASSWORD, APP_ORIGIN, CORS_ORIGINS

# 2. Build and start all services
docker compose up -d --build

# App is live on port 80 (or NGINX_PORT from .env)
```

**For HTTPS**: update `nginx/nginx.conf` with your domain, provision TLS certificates (e.g. via Certbot), mount the cert directory into the Nginx container, and change `APP_ORIGIN` to `https://yourdomain.com`.

---

## Environment Variables Reference

Copy `.env.docker.example` to `.env` in the project root for Docker Compose deployments.

| Variable | Required | Description |
|---|---|---|
| `JWT_SECRET_KEY` | **Yes** | Shared between backend (signing) and frontend (verification). Use a long random string. |
| `POSTGRES_DB` | No | Database name (default: `drivium`) |
| `POSTGRES_USER` | No | DB user (default: `drivium`) |
| `POSTGRES_PASSWORD` | **Yes** | DB password |
| `MINIO_ROOT_USER` | No | MinIO admin user (default: `minioadmin`) |
| `MINIO_ROOT_PASSWORD` | **Yes** | MinIO admin password |
| `APP_ORIGIN` | **Yes** | Public app URL, e.g. `http://localhost` or `https://yourdomain.com` |
| `TRUSTED_ORIGINS` | No | Comma-separated trusted origins for CSRF (default: `http://localhost,http://127.0.0.1`) |
| `CORS_ORIGINS` | No | Allowed CORS origins for the backend (default: `http://localhost`) |
| `PUBLIC_API_BASE_URL` | No | API base URL as seen from the browser (default: `/api`) |
| `NGINX_PORT` | No | Host port for Nginx (default: `80`) |
