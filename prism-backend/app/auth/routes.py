"""
Authentication routes for login and token refresh.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Literal

from pydantic import BaseModel, EmailStr, Field
from prisma import Prisma
from jose import JWTError
from prisma.errors import UniqueViolationError

from ..database_prisma import get_prisma
from .utils import (
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6)


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def login(
    login_data: LoginRequest,
    prisma: Prisma = Depends(get_prisma)
):
    """
    Authenticate user and return access and refresh tokens.
    
    Args:
        login_data: Login credentials (email and password)
        prisma: Prisma client dependency
        
    Returns:
        TokenResponse with access_token and refresh_token
        
    Raises:
        HTTPException: If credentials are invalid
    """
    # Find user by email using Prisma
    user = await prisma.user.find_unique(
        where={"email": login_data.email}
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create tokens
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "username": user.username,
    }
    access_token = create_access_token(data=token_data)
    refresh_token = create_refresh_token(data=token_data)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )


async def _register_user(
    register_data: RegisterRequest,
    role: Literal["SRE", "ADMIN"],
    prisma: Prisma,
) -> TokenResponse:
    """Shared helper to create a user and return tokens."""
    normalized_role = role.upper()

    existing_email = await prisma.user.find_unique(where={"email": register_data.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed_password = get_password_hash(register_data.password)

    try:
        user = await prisma.user.create(
            data={
                "username": register_data.username,
                "email": register_data.email,
                "password": hashed_password,
                "role": normalized_role,
            }
        )
    except UniqueViolationError as exc:
        field = ", ".join(exc.fields) if exc.fields else "username"
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{field.title()} already registered",
        ) from exc

    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "username": user.username,
    }
    access_token = create_access_token(data=token_data)
    refresh_token = create_refresh_token(data=token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
    )


@router.post("/refresh", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def refresh_token(
    refresh_data: RefreshRequest,
    prisma: Prisma = Depends(get_prisma)
):
    """
    Refresh access token using a valid refresh token.
    
    Args:
        refresh_data: Refresh token request
        prisma: Prisma client dependency
        
    Returns:
        TokenResponse with new access_token and refresh_token
        
    Raises:
        HTTPException: If refresh token is invalid or expired
    """
    try:
        # Decode and verify refresh token
        payload = decode_token(refresh_data.refresh_token, is_refresh=True)
        
        # Verify token type
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        # Get user ID from token
        user_id = payload.get("sub")
        email = payload.get("email")
        
        if not user_id or not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        # Verify user still exists
        user = await prisma.user.find_unique(
            where={"id": int(user_id)}
        )
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        # Create new tokens
        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
            "username": user.username,
        }
        access_token = create_access_token(data=token_data)
        refresh_token = create_refresh_token(data=token_data)
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )


@router.post(
    "/register/sre",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register_sre(
    register_data: RegisterRequest,
    prisma: Prisma = Depends(get_prisma),
):
    """Register a new SRE account."""
    return await _register_user(register_data, "SRE", prisma)


@router.post(
    "/register/admin",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register_admin(
    register_data: RegisterRequest,
    prisma: Prisma = Depends(get_prisma),
):
    """Register a new Admin account."""
    return await _register_user(register_data, "ADMIN", prisma)

