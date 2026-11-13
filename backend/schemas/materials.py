from typing import Optional
from pydantic import BaseModel
from datetime import datetime
import uuid

class MaterialCreate(BaseModel):
    batch_id: uuid.UUID
    title: str
    subject: str
    material_type: str = "pdf" # pdf, drive_link, video_link, notes
    file_url: str
    description: Optional[str] = None

class MaterialOut(BaseModel):
    id: uuid.UUID
    batch_id: uuid.UUID
    uploaded_by: uuid.UUID
    teacher_name: Optional[str] = None
    title: str
    subject: str
    material_type: str
    file_url: str
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
