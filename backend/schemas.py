from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class EntryCreate(BaseModel):
    amount: float
    category: str
    date: date
    note: Optional[str] = None

class EntryOut(BaseModel):
    id: int
    amount: float
    category: str
    date: date
    note: Optional[str] = None

    class Config:
        from_attributes = True

class CategoryTotal(BaseModel):
    category: str
    total: float

class DashboardSummary(BaseModel):
    month_total: float
    by_category: list[CategoryTotal]