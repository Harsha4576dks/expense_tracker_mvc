from pydantic import BaseModel
from typing import List

class ExpenseSummary(BaseModel):
    total_income:float
    total_expense:float
    balance_amount:float

class CategoryBreakdown(BaseModel):
    category:str
    total_spent:float

class ExpenseReport(BaseModel):
    summary:ExpenseSummary
    expensesSummary:List[CategoryBreakdown]