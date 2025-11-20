from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .database_prisma import get_prisma, disconnect_prisma
from .routers import sre
from .auth import routes as auth_routes
from .config import settings

# Create FastAPI app
app = FastAPI(
    title="PRISM Backend API",
    description="Backend API for PRISM application",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],  # Common frontend ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Create database tables and connect Prisma on startup."""
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully")
    except Exception as e:
        print(f"Warning: Could not create database tables: {e}")
        print("Make sure PostgreSQL is running and DATABASE_URL is correct in .env")
    
    # Connect Prisma client
    try:
        from .database_prisma import prisma_client
        if not prisma_client.is_connected():
            await prisma_client.connect()
        print("Prisma client connected successfully")
    except Exception as e:
        print(f"Warning: Could not connect Prisma client: {e}")


@app.on_event("shutdown")
async def shutdown_event():
    """Disconnect Prisma on shutdown."""
    await disconnect_prisma()
    print("Prisma client disconnected")


# Include routers
app.include_router(sre.router)
app.include_router(auth_routes.router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root():
    return {"message": "PRISM Backend API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/favicon.ico")
def favicon():
    """Handle favicon requests to prevent 404 errors."""
    return Response(status_code=204)

