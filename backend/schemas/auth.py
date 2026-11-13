from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr
from datetime import date, datetime
import uuid

# Comprehensive User Signup with Role-Specific fields
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str # student or teacher
    phone: str
    gender: Optional[str] = "Other"
    dob: Optional[date] = None
    address: Optional[str] = None

    # Teacher specific
    coaching_name: Optional[str] = None
    coaching_address: Optional[str] = None
    subjects: Optional[List[str]] = []
    qualification: Optional[str] = None
    experience_years: Optional[int] = 0
    bio: Optional[str] = None

    # Student specific
    school_name: Optional[str] = None
    class_grade: Optional[str] = None
    guardian_name: Optional[str] = None
    guardian_phone: Optional[str] = None
    batch_id: Optional[str] = None

# Unified Role-Free Login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthRequest(BaseModel):
    id_token: str
    role: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

# Profile Change Request Schema (Approval Workflow)
class ProfileChangeSubmit(BaseModel):
    requested_changes: Dict[str, Any]

class ProfileChangeReview(BaseModel):
    request_id: uuid.UUID
    approve: bool
    review_notes: Optional[str] = None

class ProfileChangeRequestOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    user_role: str
    target_teacher_id: Optional[uuid.UUID] = None
    target_teacher_name: Optional[str] = None
    requested_changes: Dict[str, Any]
    status: str
    reviewed_by: Optional[uuid.UUID] = None
    review_notes: Optional[str] = None
    created_at: datetime
    reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProfileOut(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    role: str
    is_verified: bool
    is_blocked: bool
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[date] = None
    
    # Teacher
    coaching_name: Optional[str] = None
    coaching_address: Optional[str] = None
    subjects: Optional[List[str]] = []
    qualification: Optional[str] = None
    experience_years: Optional[int] = 0
    bio: Optional[str] = None
    
    # Student
    school_name: Optional[str] = None
    class_grade: Optional[str] = None
    guardian_name: Optional[str] = None
    guardian_phone: Optional[str] = None
    roll_number: Optional[str] = None
    parent_access_pin: Optional[str] = None
    
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: ProfileOut
    message: Optional[str] = None
