from pydantic import BaseModel, EmailStr
from typing import List

class UserBase(BaseModel):
    name:str
    salary:int
    email:EmailStr