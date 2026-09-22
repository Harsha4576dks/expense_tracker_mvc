from sqlalchemy import Column, String, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Expense(Base):
    __tablename__='expenses'

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    description = Column(String, index=True)
    payment_method = Column(String, index=True)
    amount_spent = Column(Integer, index=True)
    user_id = Column(Integer, ForeignKey("user_data.id"))
    user = relationship("User", back_populates="expenses")
    category = Column(String, index=True)