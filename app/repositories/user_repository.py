from sqlalchemy.orm import Session
from .. import models
from ..models.user import User

def post_user(db:Session, user):
    db_user = models.User(name=user.name, salary=user.salary)
    db.add(db_user)    
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db:Session, user_id):
    result = db.query(models.User).filter(models.User.id == user_id).first()
    if not result:
        return None
    return result

def delete_user(db:Session, user_id):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        return "user not found"
    
    db_expense = db.query(models.Expense).filter(models.Expense.user_id == user_id).first()
    if db_expense is not None:
        return "This user has expense delete the expenses first"
    
    db.delete(db_user)
    db.commit()
    return {"message":"user deleted successfully", "deleted_user_id":db_user.id}