from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class ExpenseSummary(Base):
    __tablename__ = 'expensesummary'

    id = Column(Integer, primary_key=True, index=True)
    total_income = Column(Float, index=True)
    total_expense = Column(Float, index=True)
    balance_amount = Column(Float, index=True)
  #  report = relationship("ExpenseReport", back_populates="summary", uselist=False)


# class CategoryBreakdown(Base):
#     __tablename__ = 'Categorybreakdown'

#     id = Column(Integer, primary_key=True, index=True)
#     category = Column(String, index=True)
#     total_spent = Column(Float, index=True)   
#     report_id = Column(Integer, ForeignKey("expense_report.id"))
#     report = relationship("ExpenseReport", back_populates="breakdown")

# class ExpenseReport(Base):
#     __tablename__ = 'Expensereport'

#     id = Column(Integer, primary_key=True, index=True)
#     summary_id = Column(Integer, ForeignKey("expense_summary.id"))
#     summary = relationship("ExpenseSummary", back_populates="report")
#     breakdown = relationship("CategoryBreakdown", back_populates="report")
