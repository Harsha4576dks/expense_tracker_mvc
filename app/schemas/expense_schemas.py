from pydantic import BaseModel
from typing import List
from datetime import date

class ExpenseBase(BaseModel):
    date:date
    description:str
    payment_method:str
    amount_spent:int
    user_id:int
