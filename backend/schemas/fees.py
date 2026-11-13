from typing import Optional
from pydantic import BaseModel
from datetime import datetime
import uuid

class FeeCreate(BaseModel):
    student_id: uuid.UUID
    batch_id: uuid.UUID
    amount: float
    month: str

class FeeUpdate(BaseModel):
    status: str # paid, pending, overdue
    receipt_no: Optional[str] = None
    paid_date: Optional[datetime] = None

class FeeOut(BaseModel):
    id: uuid.UUID
    student_id: uuid.UUID
    student_name: Optional[str] = None
    batch_id: uuid.UUID
    batch_name: Optional[str] = None
    amount: float
    month: str
    status: str
    receipt_no: Optional[str] = None
    paid_date: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
