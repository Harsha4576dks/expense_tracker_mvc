from fastapi import APIRouter, HTTPException
from sqlalchemy .orm import Session

from ..repositories import expense_repository
from ..database import db_dependency
from ..schemas.expense_schemas import ExpenseBase

router = APIRouter(
    prefix="/expenses",
    tags=["Expense"]
)

@router.get("/{expense_id}")
async def get_expense(db:db_dependency, expense_id:int):
    result = expense_repository.get_expense(db, expense_id)
    if not result:
        return None
    return result

@router.post("/")
async def post_expenses(db:db_dependency, expense:ExpenseBase):
    return expense_repository.post_expense(db, expense)

@router.put("/{expense_id}")
async def update_expense(db:db_dependency, expense:ExpenseBase, expense_id:int):
    result = expense_repository.update_expense(db, expense_id, expense)
    if not result:
            return None
    return result

@router.delete("/{expense_id}") 
async def delete_expense(db:db_dependency, expense_id:int):
    result = expense_repository.delete_expense(db, expense_id)
    if not result:
                 return None
    return result
         