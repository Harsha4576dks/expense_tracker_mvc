from sqlalchemy.orm import Session
from .. import models
from ..models.user import User

def create_user(db:Session, user):
    db_user = models.User(name=user.name, salary=user.salary, email=user.email)
    
    db.add(db_user)    
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db:Session, user_id):
    return db.query(models.User).filter(models.User.id == user_id).first()


def delete_user(db:Session, user):
    db.delete(user)
    db.commit()
    return {"message":"user deleted successfully", "deleted_user_id":user.id}

def get_user_expenses(db:Session, user_id):
    return db.query(models.Expense).filter(models.Expense.user_id == user_id).first()
    