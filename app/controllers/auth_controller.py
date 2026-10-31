from fastapi import APIRouter, HTTPException, Request, Response
from starlette import status

from ..database import db_dependency
from ..schemas.auth_schemas import RegisterUser, LoginUser, UserResponse
from ..services import auth_service
from ..user_auth import ACCESS_TOKEN_EXPIRE_MINUTES

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
def login(user: LoginUser, db: db_dependency, response: Response):
    token, error = auth_service.login_user( db,  user.username, user.password)
    if error:
        raise HTTPException( status_code=401, detail=error )

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    return {"message": "Login successful"}


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
    )


@router.get("/user", response_model=UserResponse)
def get_logged_user(request: Request):
    return request.state.user
