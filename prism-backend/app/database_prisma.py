"""
Prisma client setup for database operations.
"""
from prisma import Prisma
from .config import settings

# Global Prisma client instance
prisma_client = Prisma()


async def get_prisma():
    """Dependency to get Prisma client."""
    if not prisma_client.is_connected():
        await prisma_client.connect()
    return prisma_client


async def disconnect_prisma():
    """Disconnect Prisma client."""
    if prisma_client.is_connected():
        await prisma_client.disconnect()

