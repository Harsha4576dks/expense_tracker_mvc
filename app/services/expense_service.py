from sqlalchemy.orm import Session
from typing import Optional
from ..repositories import expense_repository, user_repository

def get_expense(db:Session, user_id:int):
    return expense_repository.get_expense(db, user_id)

def get_expenses(db:Session, name:Optional[str]=None):
    trimmed_name = name.strip() if name else None
    return expense_repository.get_expenses(db, trimmed_name or None)

def search_expenses_by_user_name(db:Session, name:str):
    return get_expenses(db, name)

def user_expenses(db:Session, user_id:int):
    return expense_repository.get_user(db, user_id)

def create_expenses(db:Session, expenses):
    if expenses.user_name:
        matching_users = user_repository.get_users_by_exact_name(
            db, expenses.user_name.strip()
        )
        if not matching_users:
            return None, "user not found"
        if len(matching_users) > 1:
            return None, "multiple users have this name"
        user_id = matching_users[0].id
    else:
        user_id = expenses.user_id
        if user_repository.get_user(db, user_id) is None:
            return None, "user not found"

    return expense_repository.create_expense(db, expenses, user_id), None

def update_expense(db:Session, expense_id:int, expenses):
    db_expense = expense_repository.update_expense(db, expense_id, expenses)
    if db_expense is None:
        return None

    return db_expense

def delete_expense(db:Session, expense_id:int):
    expenses = expense_repository.get_expense(db, expense_id)
    if expenses is None:
        return None, "expense not found"

    expense_repository.delete_expense(db, expense_id)
    return expense_id, None