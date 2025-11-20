# Script to create .env file with PostgreSQL configuration
# Run this from the prism-backend directory

Write-Host "=== Creating .env File ===" -ForegroundColor Cyan
Write-Host ""

# Check if .env already exists
if (Test-Path ".env") {
    Write-Host "WARNING: .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Cancelled. Existing .env file preserved." -ForegroundColor Yellow
        exit
    }
}

Write-Host "Please provide your PostgreSQL credentials:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Common PostgreSQL defaults:" -ForegroundColor Gray
Write-Host "  - Username: postgres" -ForegroundColor Gray
Write-Host "  - Password: (the password you set during PostgreSQL installation)" -ForegroundColor Gray
Write-Host "  - Port: 5432 (default)" -ForegroundColor Gray
Write-Host "  - Database: prism_db (will be created automatically)" -ForegroundColor Gray
Write-Host ""

$dbUser = Read-Host "PostgreSQL Username [default: postgres]"
if ([string]::IsNullOrWhiteSpace($dbUser)) {
    $dbUser = "postgres"
}

$dbPassword = Read-Host "PostgreSQL Password" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
)

$dbHost = Read-Host "PostgreSQL Host [default: localhost]"
if ([string]::IsNullOrWhiteSpace($dbHost)) {
    $dbHost = "localhost"
}

$dbPort = Read-Host "PostgreSQL Port [default: 5432]"
if ([string]::IsNullOrWhiteSpace($dbPort)) {
    $dbPort = "5432"
}

$dbName = Read-Host "Database Name [default: prism_db]"
if ([string]::IsNullOrWhiteSpace($dbName)) {
    $dbName = "prism_db"
}

# Generate random secrets for JWT
$accessSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$refreshSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Create DATABASE_URL
$databaseUrl = "postgresql://${dbUser}:${dbPasswordPlain}@${dbHost}:${dbPort}/${dbName}"

# Create .env file content
$envContent = @"
# PostgreSQL Database Configuration
DATABASE_URL=$databaseUrl

# JWT Authentication Secrets (auto-generated)
ACCESS_SECRET_KEY=$accessSecret
REFRESH_SECRET_KEY=$refreshSecret

# Token Expiration Settings
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# API Configuration
API_V1_PREFIX=/api/v1
"@

# Write to .env file
$envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline

Write-Host ""
Write-Host "✓ .env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure PostgreSQL is running" -ForegroundColor White
Write-Host "2. Run: prisma migrate dev --name init" -ForegroundColor White
Write-Host "3. Run: python create_test_user.py (optional)" -ForegroundColor White
Write-Host "4. Start server: uvicorn app.main:app --reload" -ForegroundColor White

