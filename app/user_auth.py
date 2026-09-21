from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt

SECRET_KEY = "your-secrest-key-change-this later"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(user_id:int):
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    data = {
        "sub" : str(user_id),
        "exp" :expire
    }
    token = jwt.encode(
        data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token

def verify_access_token(token:str):

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")
        if user_id is None:
            return None

        return int(user_id)

    except (JWTError, ValueError):
        return None