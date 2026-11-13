from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime
import uuid
from backend.schemas.auth import ProfileOut

class AdminCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    role_title: Optional[str] = "Co-Administrator"

class TeacherVerificationAction(BaseModel):
    teacher_id: uuid.UUID
    approve: bool
    notes: Optional[str] = None

class AdminStatsOut(BaseModel):
    total_users: int
    total_teachers: int
    total_students: int
    total_admins: int
    pending_teacher_approvals: int
    pending_profile_requests: int
    active_batches: int
    total_attendance_marked: int
    total_tests_conducted: int

class UserBlockToggle(BaseModel):
    user_id: uuid.UUID
    is_blocked: bool

class BatchCreate(BaseModel):
    name: str
    subject: str
    teacher_id: Optional[str] = None
    teacher_name: Optional[str] = None
    schedule: str
    room: Optional[str] = "Room 101"
    fees: float = 1500.0
    capacity: int = 40

class BatchAssignTeacher(BaseModel):
    teacher_id: str
    teacher_name: str

class BatchOut(BaseModel):
    id: str
    name: str
    subject: str
    teacher_id: Optional[str] = None
    teacher_name: Optional[str] = None
    schedule: str
    room: Optional[str] = None
    fees: float
    capacity: int
    students_count: int = 0
    status: str = "active"

class NoticeBroadcastCreate(BaseModel):
    title: str
    content: str
    target_audience: Optional[str] = "all"
    priority: Optional[str] = "normal"
    is_global: Optional[bool] = True

class NoticeBroadcastOut(BaseModel):
    id: str
    title: str
    content: str
    target_audience: str
    priority: str
    author: str
    is_global: bool
    created_at: datetime
