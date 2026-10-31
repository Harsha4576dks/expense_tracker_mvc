from sqlalchemy.orm import Session
from typing import Optional
from ..import models
from ..models.expense import Expense

def create_expense(db:Session, expense, user_id:int):
    db_expense = models.Expense(date=expense.date, description=expense.description,category=expense.category,
                                 payment_method=expense.payment_method, amount_spent=expense.amount_spent, 
                                 user_id=user_id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def get_expense(db:Session, user_id:int):
    matches = (
        db.query(models.Expense, models.User.name)
        .join(models.User, models.Expense.user_id == models.User.id)
        .filter(models.Expense.user_id == user_id)
        .all()
    )
    return [_serialize_expense(expense, user_name) for expense, user_name in matches]

def get_expenses(db:Session, name:Optional[str]=None):
    query = db.query(models.Expense, models.User.name).join(
        models.User, models.Expense.user_id == models.User.id
    )
    if name:
        query = query.filter(models.User.name.ilike(f"%{name.strip()}%"))
    return [
        _serialize_expense(expense, user_name)
        for expense, user_name in query.all()
    ]

def search_expenses_by_user_name(db:Session, name:str):
    return get_expenses(db, name)

def serialize_expense(expense):
    return _serialize_expense(expense, expense.user.name)

def _serialize_expense(expense, user_name):
    return {
        "id": expense.id,
        "date": expense.date,
        "description": expense.description,
        "category": expense.category,
        "payment_method": expense.payment_method,
        "amount_spent": expense.amount_spent,
        "user_id": expense.user_id,
        "user_name": user_name,
    }

def update_expense(db:Session, expense_id:int, update_data):
    db_expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if db_expense is None:
        return None
    for key, value in update_data.model_dump(exclude_unset=True).items():
        setattr(db_expense, key, value)

    db.commit()
    db.refresh(db_expense)
    return db_expense

def delete_expense(db:Session, expense_id:int):
    db_expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if db_expense is None:
        return None

    deleted_id = db_expense.id
    
    db.delete(db_expense)
    db.commit()
    return deleted_id

def get_user_expenses(db: Session, user_id: int):
    return db.query(models.Expense).filter( models.Expense.user_id == user_id).all()