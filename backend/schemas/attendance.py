from typing import Optional, List
from pydantic import BaseModel
from datetime import date, datetime
import uuid

class AttendanceRecordItem(BaseModel):
    student_id: uuid.UUID
    status: str  # present, absent, late
    remarks: Optional[str] = None

class BatchAttendanceSubmit(BaseModel):
    batch_id: uuid.UUID
    date: date
    records: List[AttendanceRecordItem]

class AttendanceOut(BaseModel):
    id: uuid.UUID
    batch_id: uuid.UUID
    student_id: uuid.UUID
    student_name: Optional[str] = None
    date: date
    status: str
    remarks: Optional[str] = None
    marked_by: uuid.UUID

    class Config:
        from_attributes = True

class AttendanceSummary(BaseModel):
    total_classes: int
    attended_classes: int
    absent_classes: int
    late_classes: int
    percentage: float
    streak: int
