from sqlalchemy import Integer, String, Column
from ..database import Base

class User(Base):
    __tablename__ = "authentication"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)
    