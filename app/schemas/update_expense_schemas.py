from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class update_ExpenseBase(BaseModel):
    date:Optional[date]=None
    description:Optional[str]=None
    payment_method:Optional[str]=None
    amount_spent:Optional[int]=None
    user_id:Optional[int]=None
