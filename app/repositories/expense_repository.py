from sqlalchemy.orm import Session
from ..import models
from ..models.expense import Expense

def post_expense(db:Session, expense):
    db_user = db.query(models.User).filter(models.User.id == expense.user_id).first()

    if db_user is None:
        return "User not found"
    
    db_expense = models.Expense(date=expense.date, description=expense.description,
                                 payment_method=expense.payment_method, amount_spent=expense.amount_spent, 
                                 user_id=expense.user_id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def get_expense(db:Session, expense_id):
    result = db.query(models.Expense).filter(models.Expense.id == expense_id).all()
    if not result:
        return None
    return result

def update_expense(db:Session, expense_id, expense):
    db_user = db.query(models.User).filter(models.User.id == expense.user_id).first()
    if db_user is None:
        return "expense not found"
        
    db_expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if db_expense is None:
        return "expense not found"
    
    db_expense.date=expense.date, 
    db_expense.description=expense.description,
    db_expense.payment_method=expense.payment_method,
    db_expense.amount_spent=expense.amount_spent,
    db_expense.user_id=expense.user_id

    db.commit()
    db.refresh(db_expense)
    return db_expense

def delete_expense(db:Session, expense_id):
    db_expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if db_expense is None:
        return "expense does not exist"
    
    db.delete(db_expense)
    db.commit()
    return {"message":"expenses deleted successfully", "deleted_expense_id":db_expense.id}
