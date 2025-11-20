# PRISM Project - Quick Start Guide

## Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 18+** (for frontend)
- **PostgreSQL** (database)
- **Prisma CLI** (for database migrations)

## Quick Start

### 1. Backend Setup

```powershell
# Navigate to backend directory
cd prism-backend

# Install Python dependencies
pip install -r requirements.txt

# Install Prisma CLI (if not already installed)
npm install -g prisma

# Generate Prisma Client
prisma generate

# Create .env file (if it doesn't exist)
# Copy the template below and update with your values
```

**Create `prism-backend/.env` file:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/prism_db
ACCESS_SECRET_KEY=your-secure-access-secret-key-change-this
REFRESH_SECRET_KEY=your-secure-refresh-secret-key-change-this
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
API_V1_PREFIX=/api/v1
```

**Run database migrations:**
```powershell
prisma migrate dev --name init
```

**Start the backend server:**
```powershell
uvicorn app.main:app --reload
```

Backend will run on: `http://localhost:8000`

### 2. Frontend Setup

```powershell
# Navigate to frontend directory (in a new terminal)
cd prism-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on: `http://localhost:5173` (or similar port)

## Verify Setup

1. **Backend Health Check:**
   - Open: `http://localhost:8000/health`
   - Should return: `{"status": "healthy"}`

2. **Frontend:**
   - Open: `http://localhost:5173`
   - Should show the login page

## Creating a Test User

To test login, you'll need to create a user in the database. You can do this via:

1. **Using Prisma Studio:**
   ```powershell
   cd prism-backend
   prisma studio
   ```
   Then manually create a user with a hashed password.

2. **Or create a Python script** to hash password and create user:
   ```python
   from app.auth.utils import get_password_hash
   from app.database_prisma import prisma_client
   import asyncio

   async def create_user():
       await prisma_client.connect()
       hashed = get_password_hash("test123")
       user = await prisma_client.user.create({
           "data": {
               "email": "test@example.com",
               "password": hashed,
               "role": "SRE"
           }
       })
       print(f"User created: {user}")
       await prisma_client.disconnect()

   asyncio.run(create_user())
   ```

## Troubleshooting

### Backend Issues

- **Database connection error:** Check PostgreSQL is running and DATABASE_URL is correct
- **Prisma not found:** Install with `npm install -g prisma`
- **Module not found:** Run `pip install -r requirements.txt`

### Frontend Issues

- **Port already in use:** Change port in `vite.config.ts` or kill the process using the port
- **Dependencies missing:** Run `npm install`

## API Endpoints

Once running, these endpoints are available:

- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /health` - Health check

## Notes

- Backend runs on port **8000**
- Frontend runs on port **5173** (or next available)
- Make sure PostgreSQL is running before starting the backend
- JWT secrets should be strong random strings in production

