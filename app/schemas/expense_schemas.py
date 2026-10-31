from pydantic import BaseModel
from pydantic import model_validator
from typing import Optional
from datetime import date

class ExpenseBase(BaseModel):
    date:date
    description:str
    category:str
    payment_method:str
    amount_spent:int
    user_id:Optional[int]=None
    user_name:Optional[str]=None

    @model_validator(mode="after")
    def require_user_reference(self):
        if self.user_id is None and not self.user_name:
            raise ValueError("user_name is required")
        return self
