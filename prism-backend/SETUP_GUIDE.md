# PRISM Backend Setup Guide

## Quick Setup (PowerShell)

### Option 1: Automated Setup Script
```powershell
cd prism-backend
.\setup.ps1
```

### Option 2: Manual Setup

1. **Install Dependencies**
   ```powershell
   cd prism-backend
   pip install -r requirements.txt
   ```

2. **Install Prisma CLI** (requires Node.js)
   ```powershell
   npm install -g prisma
   ```

3. **Generate Prisma Client**
   ```powershell
   prisma generate
   ```

4. **Create .env File**
   Create a `.env` file in `prism-backend/` with:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/prism_db
   ACCESS_SECRET_KEY=your-secure-access-secret-key-here
   REFRESH_SECRET_KEY=your-secure-refresh-secret-key-here
   ACCESS_TOKEN_EXPIRE_MINUTES=15
   REFRESH_TOKEN_EXPIRE_DAYS=7
   API_V1_PREFIX=/api/v1
   ```

5. **Run Database Migrations**
   ```powershell
   prisma migrate dev --name init
   ```

6. **Start the Server**
   ```powershell
   uvicorn app.main:app --reload
   ```

## API Endpoints

After setup, the following endpoints will be available:

- `POST /api/v1/auth/login` - Login with email and password
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
  Returns:
  ```json
  {
    "access_token": "...",
    "refresh_token": "...",
    "token_type": "bearer"
  }
  ```

- `POST /api/v1/auth/refresh` - Refresh access token
  ```json
  {
    "refresh_token": "..."
  }
  ```
  Returns new access and refresh tokens.

## Troubleshooting

- **Prisma not found**: Install Node.js and run `npm install -g prisma`
- **Database connection error**: Check your `DATABASE_URL` in `.env`
- **Import errors**: Make sure all packages are installed: `pip install -r requirements.txt`

