from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class ExpenseSummary(Base):
    __tablename__ = 'expensesummary'

    id = Column(Integer, primary_key=True, index=True)
    total_income = Column(Float, index=True)
    total_expense = Column(Float, index=True)
    balance_amount = Column(Float, index=True)
