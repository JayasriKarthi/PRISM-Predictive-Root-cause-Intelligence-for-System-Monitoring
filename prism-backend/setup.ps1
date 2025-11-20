# Setup script for PRISM Backend
# Run this script from the prism-backend directory

Write-Host "=== PRISM Backend Setup ===" -ForegroundColor Cyan

# 1. Install Python dependencies
Write-Host "`n[1/8] Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing dependencies!" -ForegroundColor Red
    exit 1
}

# 2. Install Prisma CLI globally (if not already installed)
Write-Host "`n[2/8] Checking Prisma CLI..." -ForegroundColor Yellow
$prismaInstalled = Get-Command prisma -ErrorAction SilentlyContinue
if (-not $prismaInstalled) {
    Write-Host "Installing Prisma CLI..." -ForegroundColor Yellow
    npm install -g prisma
}

# 3. Generate Prisma Client
Write-Host "`n[3/8] Generating Prisma Client..." -ForegroundColor Yellow
prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error generating Prisma client!" -ForegroundColor Red
    exit 1
}

# 4. Check if .env file exists
Write-Host "`n[4/8] Checking .env file..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    @"
DATABASE_URL=postgresql://user:password@localhost:5432/prism_db
ACCESS_SECRET_KEY=your-access-secret-key-change-in-production-$(Get-Random -Minimum 1000 -Maximum 9999)
REFRESH_SECRET_KEY=your-refresh-secret-key-change-in-production-$(Get-Random -Minimum 1000 -Maximum 9999)
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
API_V1_PREFIX=/api/v1
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host ".env file created. Please update DATABASE_URL and JWT secrets!" -ForegroundColor Yellow
} else {
    Write-Host ".env file already exists. Skipping creation." -ForegroundColor Green
}

# 5. Run Prisma migrations (optional - uncomment if you want to run migrations)
Write-Host "`n[5/8] Prisma migrations..." -ForegroundColor Yellow
Write-Host "Note: Run 'prisma migrate dev' manually to create database schema" -ForegroundColor Yellow
# prisma migrate dev --name init

# 6. Verify Prisma Client generation
Write-Host "`n[6/8] Verifying Prisma setup..." -ForegroundColor Yellow
if (Test-Path "prisma\schema.prisma") {
    Write-Host "✓ Prisma schema found" -ForegroundColor Green
} else {
    Write-Host "✗ Prisma schema not found!" -ForegroundColor Red
}

# 7. Check Python packages
Write-Host "`n[7/8] Verifying Python packages..." -ForegroundColor Yellow
$packages = @("fastapi", "prisma", "python-jose", "passlib")
foreach ($package in $packages) {
    $installed = python -c "import $($package.Replace('-', '_')); print('OK')" 2>$null
    if ($installed) {
        Write-Host "✓ $package installed" -ForegroundColor Green
    } else {
        Write-Host "✗ $package not found" -ForegroundColor Red
    }
}

# 8. Setup complete
Write-Host "`n[8/8] Setup Summary" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Cyan
Write-Host "✓ Dependencies installed" -ForegroundColor Green
Write-Host "✓ Prisma client generated" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Update .env file with your DATABASE_URL and secure JWT secrets" -ForegroundColor White
Write-Host "2. Run 'prisma migrate dev' to create database tables" -ForegroundColor White
Write-Host "3. Start the server with 'uvicorn app.main:app --reload'" -ForegroundColor White
Write-Host "`n=== Setup Complete ===" -ForegroundColor Cyan

