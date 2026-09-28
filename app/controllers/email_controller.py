from datetime import date
from fastapi import APIRouter, HTTPException, BackgroundTasks, Query, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..services import email_service
from ..security import security

router = APIRouter(
    prefix="/email",
    tags = ["email operations"],
    dependencies=[Depends(security)]
)

@router.post("/send-expense-report/{user_id}")
def send_expense_report_to_user(user_id:int, start_date:date, end_date:date,
                                background_tasks:BackgroundTasks,
                                comment:str | None = Query(default = None, description="Optional custom remarks"),
                                db:Session = Depends(get_db)):

    try:
        payload = email_service.prepare_expense_report_email(
            db=db,
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
            custom_comment=comment
        )

        background_tasks.add_task(
            email_service.send_raw_email,
            recipient_email=payload["recipient_email"],
            subject=payload["subject"],
            body=payload["body"],
            attachment_bytes=payload["attachment_bytes"],
            filename=payload["filename"]
        )

        return {
            "status": "success",
            "message": f"Expense report email queued for {payload['recipient_email']}"
        }

    except ValueError as err:
        err_msg = str(err)
        if err_msg == "USER_NOT_FOUND_OR_NO_EMAIL":
            raise HTTPException(status_code=404, detail="User not found or has no registered email.")
        elif err_msg == "NO_EXPENSE_DATA_FOUND":
            raise HTTPException(status_code=404, detail="No expense records found for this date range.")
        else:
            raise HTTPException(status_code=400, detail=err_msg)
