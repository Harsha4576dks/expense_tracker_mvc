from sqlalchemy.orm import Session
from ..repositories import user_repository

def get_user(db:Session, user_id:int):
    return user_repository.get_user(db, user_id)

def create_user(db:Session, user):
    return user_repository.create_user(db, user)

def delete_user(db:Session, user_id:int):
    user = user_repository.get_user(db, user_id)
    if user is None:
        return None, "user not found"

    user_expense = user_repository.get_user_expenses(db, user_id)
    if user_expense is not  None:
        return None, "delete expenses of this user first"

    user_repository.delete_user(db, user)
    return user_id, None