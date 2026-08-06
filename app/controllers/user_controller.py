from fastapi import APIRouter, HTTPException
from sqlalchemy .orm import Session

from ..repositories import user_repository
from ..database import db_dependency
from ..schemas.user_schemas import UserBase

router = APIRouter(
    prefix="/users",
    tags=["user"]
)

@router.get("/{user_id}")
async def get_user(user_id:int, db:db_dependency):
    result = user_repository.get_user(db, user_id)
    if result is None:
        raise HTTPException(status_code=404, detail="user not found")
    return result

@router.post("/")
async def post_user(db:db_dependency, user:UserBase):
    return user_repository.post_user(db, user)

@router.delete("/{user_id}")
async def delete_user(db:db_dependency, user_id:int):
    result = user_repository.delete_user(db, user_id)
    if result is None:
            raise HTTPException(status_code=404, detail="user not found")
    return result
    