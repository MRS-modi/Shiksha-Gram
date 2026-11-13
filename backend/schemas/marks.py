from typing import Optional, List
from pydantic import BaseModel
from datetime import date, datetime
import uuid

class StudentScoreItem(BaseModel):
    student_id: uuid.UUID
    score: float
    remarks: Optional[str] = None

class TestMarksUpload(BaseModel):
    batch_id: uuid.UUID
    test_name: str
    subject: str
    test_date: date
    max_marks: float = 100.0
    scores: List[StudentScoreItem]

class TestMarkOut(BaseModel):
    id: uuid.UUID
    batch_id: uuid.UUID
    student_id: uuid.UUID
    student_name: Optional[str] = None
    test_name: str
    subject: str
    test_date: date
    max_marks: float
    score: float
    percentage: Optional[float] = None
    grade: Optional[str] = None
    remarks: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class LeaderboardEntry(BaseModel):
    rank: int
    student_id: uuid.UUID
    student_name: str
    avatar_url: Optional[str] = None
    batch_name: str
    average_score: float
    tests_taken: int
