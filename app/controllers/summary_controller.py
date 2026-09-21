from fastapi import APIRouter, HTTPException

from ..database import db_dependency
from ..services import summary_service
from ..schemas.summary_schemas import ExpenseSummary

router = APIRouter(
    prefix="/summary",
    tags=["Summary"]
)

@router.get("/{user_id}", response_model=ExpenseSummary)
def get_summary(db:db_dependency, user_id:int):

    summary = summary_service.get_expense_summary(db, user_id)

    if summary is None:
        raise HTTPException(status_code=404, detail="user not found")

    return summary