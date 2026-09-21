from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__='user_data'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    salary = Column(Integer, index=True)
    email = Column(String, index=True, nullable=False)
    expenses = relationship("Expense", back_populates="user")
    