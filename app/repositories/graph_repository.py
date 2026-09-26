from sqlalchemy.orm import Session
from ..models.expense import Expense
from ..models.user import User
from datetime import date


def get_amountSpent_of_expense(db:Session, amount_spent):
    return db.query(Expense).filter(Expense.amount_spent == amount_spent).all()

def get_category_of_expense(db: Session, user_id: int, category: str):
    return db.query(Expense).filter(
        Expense.user_id == user_id, 
        Expense.category == category
    ).all()

def get_user_expenses_by_date(db: Session, user_id: int, start_date: date, end_date: date):
    return db.query(Expense).filter(
        Expense.user_id == user_id,
        Expense.date >= start_date,
        Expense.date <= end_date
    ).all()

def get_expense_by_id(db:Session, expense_id:int):
    return db.query(Expense).filter(Expense.id == expense_id).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()