from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from ..database import get_db
from ..services.graph_service import generate_expense_graph_png
from ..services.graph_service import generate_expense_graph_pdf
from ..security import security

router = APIRouter(
    prefix="/expenses",
    tags=["Expense Reports"],
    dependencies=[Depends(security)]
)


@router.get("/user/{user_id}/graph", response_class=Response)
def view_user_expense_graph(user_id: int, start_date: date, end_date: date, db: Session = Depends(get_db)):
    image_bytes = generate_expense_graph_png(db, user_id, start_date, end_date)
    if not image_bytes:
        raise HTTPException(status_code=404, detail="No expense records found for this user")

    return Response(content=image_bytes, media_type="image/png")

@router.get("/user/{user_id}/graph/pdf", response_class=Response)
def download_user_expense_pdf(user_id:int, start_date:date, end_date:date, db:Session = Depends(get_db)):
    pdf_bytes = generate_expense_graph_pdf(db, user_id, start_date, end_date)
    if not pdf_bytes:
        raise  HTTPException(status_code=404, detail="No expense records found for this user")

    return Response(content=pdf_bytes, media_type="application/pdf", 
                    headers={"Content-Disposition": f'attachment; filename="expense_report_user_{user_id}.pdf"'})

