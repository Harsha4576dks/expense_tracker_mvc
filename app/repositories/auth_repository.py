from sqlalchemy.orm import Session
from ..models.auth_ import AuthUser


def get_user_by_username(db: Session, username: str):
    return db.query(AuthUser).filter(AuthUser.username == username).first()


def get_user_by_email(db: Session, email: str):
    return db.query(AuthUser).filter(AuthUser.email == email).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(AuthUser).filter(AuthUser.id == user_id).first()


def create_user(db: Session, username: str, email: str, password: str):
    db_user = AuthUser(
        username=username,
        email=email,
        password=password
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user