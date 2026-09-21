from sqlalchemy.orm import Session

from ..repositories import expense_repository
from ..repositories import user_repository

def get_expense_summary(db:Session, user_id:int):

    user = user_repository.get_user(db, user_id)
    if user is None:
        return None    

    expenses = expense_repository.get_user_expenses(db, user_id)
    if expenses is None:
        return None

    total_expense = sum(expense.amount_spent for expense in expenses)

    total_income = user.salary

    balance_amount = total_income - total_expense

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance_amount": balance_amount
    }