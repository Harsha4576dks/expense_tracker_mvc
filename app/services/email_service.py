import os
import smtplib
from datetime import date
from email.mime.application  import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from sqlalchemy.orm import Session

from ..repositories import email_repository
from ..services.graph_service import generate_expense_graph_pdf

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_raw_email(recipient_email:str, subject:str, body:str,
                   attachment_bytes:bytes, filename:str) -> None:
    msg = MIMEMultipart()
    msg["From"] = SMTP_USER
    msg["To"] = recipient_email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    attachment = MIMEApplication(attachment_bytes, _subtype="pdf")
    attachment.add_header("content-Disposition", "attachment", filename=filename)
    msg.attach(attachment)

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)

def prepare_expense_report_email(db:Session, user_id:int, start_date:date,
                                 end_date:date, custom_comment:str | None) -> dict:

    user_details = email_repository.get_user_email_details(db, user_id)
    if not user_details:
        raise ValueError("USER_NOT_FOUND_OR_NO_EMAIL")

    user_name,  recipient_email = user_details

    pdf_bytes = generate_expense_graph_pdf(db, user_id, start_date, end_date)
    if not pdf_bytes:
        raise ValueError("NO_EXPENSE_DATA_FOUND")    

    subject = f"Expense Report ({start_date} to {end_date})"

    body = f"Hello {user_name},\n\n"
    body += f"Attached is your expense breakdown for {start_date} to {end_date}.\n\n"
    
    if custom_comment:
        body+= f"Remarks:\n{custom_comment}\n\n"
    body += "Best regards,\n Expense Tracker team"
    
    month_name = start_date.strftime("%B")
    filename = f"Expense_Report_{month_name}.pdf"

    return {
        "recipient_email": recipient_email,
        "subject": subject,
        "body": body,
        "attachment_bytes": pdf_bytes,
        "filename": filename}