from fastapi import APIRouter, HTTPException
from sqlalchemy .orm import Session

from ..database import db_dependency
from ..schemas.expense_schemas import ExpenseBase
from ..schemas.update_expense_schemas import update_ExpenseBase
from ..services import expense_service

router = APIRouter(
    prefix="/expenses",
    tags=["Expense"]
)

@router.get("/{expense_id}")
async def get_expense(db:db_dependency, expense_id:int):
    result = expense_service.get_expense(db, expense_id)
    if not result:
        raise HTTPException(status_code=404, detail="expense not found")
        
    return result

@router.post("/")
async def post_expenses(db:db_dependency, expense:ExpenseBase):

    result, error = expense_service.create_expenses(db, expense)
    if error == "user not found":
          raise HTTPException(status_code=404, detail="user not found on this id")
          
    return  result

@router.put("/{expense_id}")
async def update_expenses(db:db_dependency, expense_id:int, expenses:update_ExpenseBase):
    result = expense_service.update_expense(db, expense_id, expenses)
    if not result:
            raise HTTPException(status_code=404, detail="expense not found on this id")
    return result

@router.delete("/{expense_id}") 
async def delete_expense(db:db_dependency, expense_id:int):
    result, error = expense_service.delete_expense(db, expense_id)
    if error == "expense not found":
         raise HTTPException(status_code=404, detail="expense not found ")
    return {"message":"expense deleted successfully",  "deleted_expense":result}