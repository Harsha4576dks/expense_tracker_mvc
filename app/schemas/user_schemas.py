from pydantic import BaseModel
from typing import List

class UserBase(BaseModel):
    name:str
    salary:int
