from typing import Optional, Tuple
from sqlalchemy.orm import Session
from ..models.user import User

def get_user_email_details(db:Session, user_id:int) -> Optional[Tuple[str, str]]:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    name = (getattr(user, "name", None) 
            or getattr(user, "full_name", None) 
            or f"User_{user_id}")
   
    email = getattr(user, "email", None)
    if not email:
        return None

    return name, email