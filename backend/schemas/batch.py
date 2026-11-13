from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
import uuid

class BatchCreate(BaseModel):
    name: str
    subject: str
    schedule: str
    room_or_link: Optional[str] = None
    fees_amount: Optional[float] = 0.0
    capacity: Optional[int] = 40

class BatchUpdate(BaseModel):
    name: Optional[str] = None
    subject: Optional[str] = None
    schedule: Optional[str] = None
    room_or_link: Optional[str] = None
    fees_amount: Optional[float] = None
    capacity: Optional[int] = None
    is_active: Optional[bool] = None

class BatchOut(BaseModel):
    id: uuid.UUID
    teacher_id: uuid.UUID
    name: str
    subject: str
    schedule: str
    room_or_link: Optional[str] = None
    fees_amount: float
    capacity: int
    is_active: bool
    student_count: Optional[int] = 0
    created_at: datetime

    class Config:
        from_attributes = True

class EnrollmentRequest(BaseModel):
    batch_id: uuid.UUID

class EnrollmentStatusUpdate(BaseModel):
    enrollment_id: uuid.UUID
    status: str  # accepted or rejected

class StudentRosterItem(BaseModel):
    enrollment_id: uuid.UUID
    student_id: uuid.UUID
    name: str
    email: str
    phone: Optional[str] = None
    roll_number: Optional[str] = None
    avatar_url: Optional[str] = None
    status: str
    attendance_rate: Optional[float] = 0.0
    last_score: Optional[float] = None
    enrolled_at: datetime
