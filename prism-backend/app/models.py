from sqlalchemy import Column, Integer, String
from .database import Base


class SRE(Base):
    __tablename__ = "sres"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    status = Column(String, nullable=False, default="active")
    assigned_system = Column(String, nullable=True)

