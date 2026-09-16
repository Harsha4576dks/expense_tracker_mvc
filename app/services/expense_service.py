from sqlalchemy.orm import Session
from ..repositories import expense_repository, user_repository

def get_expense(db:Session, expense_id:int):
    return expense_repository.get_expense(db, expense_id)

def user_expenses(db:Session, user_id:int):
    return expense_repository.get_user(db, user_id)

def create_expenses(db:Session, expenses):
    db_user = user_repository.get_user(db, expenses.user_id)
    if db_user is None:
        return None, "user not found"

    return expense_repository.create_expense(db, expenses), None

def update_expense(db:Session, expense_id:int, expenses):
    db_expense = expense_repository.update_expense(db, expense_id, expenses)
    if db_expense is None:
        return None

    update_data = expenses.model_dump(exclude_unset=True)
    return expense_repository.update_expense(db, expense_id, expenses)

def delete_expense(db:Session, expense_id:int):
    expenses = expense_repository.get_expense(db, expense_id)
    if expenses is None:
        return None, "expense not found"

    expense_repository.delete_expense(db, expense_id)
    return expense_id, None