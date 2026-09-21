from sqlalchemy.orm import Session
from ..models.auth_ import User

def get_user_by_username(db:Session, username:str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db:Session, email:str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db:Session, user_id:int):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db:Session, user):
    db_user = User(username=user.name, email=user.email, password=user.password)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user