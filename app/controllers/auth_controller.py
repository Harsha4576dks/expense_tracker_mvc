from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.security import HTTPAuthorizationCredentials

from ..database import db_dependency
from ..schemas.auth_schemas import RegisterUser, LoginUser, UserResponse
from ..services import auth_service
from ..security import security
from ..user_auth import verify_access_token
from ..repositories import auth_repository

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=UserResponse)
def register(user: RegisterUser, db: db_dependency):

    new_user, error = auth_service.register_user( db, user)
    if error:
        raise HTTPException( status_code=400, detail=error)
    return new_user


@router.post("/login")
def login( user: LoginUser, db: db_dependency):
    token, error = auth_service.login_user( db,  user.username, user.password)
    if error:
        raise HTTPException( status_code=401, detail=error )

    return {"access_token": token, "token_type": "bearer" }

@router.get("/user", response_model=UserResponse)
def get_logged_user(db: db_dependency, credentials: HTTPAuthorizationCredentials = Depends(security)):
    user_id = verify_access_token(credentials.credentials)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = auth_repository.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

