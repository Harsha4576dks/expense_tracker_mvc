from fastapi import APIRouter, HTTPException
from sqlalchemy .orm import Session
from typing import Optional

from ..database import db_dependency
from ..repositories import expense_repository
from ..schemas.expense_schemas import ExpenseBase
from ..schemas.update_expense_schemas import update_ExpenseBase
from ..services import expense_service

router = APIRouter(
    prefix="/expenses",
    tags=["Expense"],
)

@router.get("/")
async def get_expenses(db:db_dependency, name:Optional[str]=None):
    return expense_service.get_expenses(db, name)

@router.get("/search")
async def search_expenses_by_user_name(db:db_dependency, name:str):
    return expense_service.search_expenses_by_user_name(db, name)

@router.get("/{user_id}")
async def get_expense(db:db_dependency, user_id:str):
    if user_id.isdecimal():
        result = expense_service.get_expense(db, int(user_id))
    else:
        result = expense_service.search_expenses_by_user_name(db, user_id)

    if not result:
        raise HTTPException(status_code=404, detail=" user has no expenses yet")
        
    return result

@router.post("/")
async def post_expenses(db:db_dependency, expense:ExpenseBase):

    result, error = expense_service.create_expenses(db, expense)
    if error == "user not found":
        raise HTTPException(status_code=404, detail="user not found")
    if error == "multiple users have this name":
        raise HTTPException(
            status_code=409,
            detail="multiple users have this name; use a unique user name",
        )

    return expense_repository.serialize_expense(result)

@router.put("/{expense_id}")
async def update_expenses(db:db_dependency, expense_id:int, expenses:update_ExpenseBase):
    result = expense_service.update_expense(db, expense_id, expenses)
    if not result:
            raise HTTPException(status_code=404, detail="expense not found on this id")
    return expense_repository.serialize_expense(result)

@router.delete("/{expense_id}") 
async def delete_expense(db:db_dependency, expense_id:int):
    result, error = expense_service.delete_expense(db, expense_id)
    if error == "expense not found":
         raise HTTPException(status_code=404, detail="expense not found ")
    return {"message":"expense deleted successfully",  "deleted_expense":result}