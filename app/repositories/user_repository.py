from sqlalchemy import func
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

def search_users_by_name(db:Session, name:str):
    return db.query(models.User).filter(models.User.name.ilike(f"%{name}%")).all()

def get_users_by_exact_name(db:Session, name:str):
    return db.query(models.User).filter(func.lower(models.User.name) == name.lower()).all()


def delete_user(db:Session, user):
    db.delete(user)
    db.commit()
    return {"message":"user deleted successfully", "deleted_user_id":user.id}
