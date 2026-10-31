from fastapi import APIRouter, HTTPException
from typing import Optional


from ..database import db_dependency
from ..schemas.user_schemas import UserBase
from ..services import user_service

router = APIRouter(
    prefix="/users",
    tags=["user"],
)

@router.get("/")
async def get_users(db:db_dependency, name:Optional[str]=None):
    return user_service.get_users(db, name)

@router.get("/search")
async def search_users_by_name(db:db_dependency, name:str):
    return user_service.search_users_by_name(db, name)

@router.get("/{user_id}")
async def get_user(db:db_dependency, user_id:str):
    if user_id.isdecimal():
        result = user_service.get_user(db, int(user_id))
    else:
        result = user_service.search_users_by_name(db, user_id)

    if result is None:
        raise HTTPException(status_code=404, detail="user not found")
    return result

@router.post("/")
async def create_user(db:db_dependency, user:UserBase):
    return user_service.create_user(db, user)

@router.delete("/{user_id}")
async def delete_user(db:db_dependency, user_id:int):
    result, error = user_service.delete_user(db, user_id)
    if error == "user not found":
            raise HTTPException(status_code=404, detail="user not found")

    if error == "delete expenses of this user first":
         raise HTTPException(status_code=400, detail="delete expenses on this user first")

    return {"message":"user deleted successfully", "deleted_user":result}
    