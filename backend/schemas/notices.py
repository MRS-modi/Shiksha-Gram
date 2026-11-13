from typing import Optional
from pydantic import BaseModel
from datetime import datetime
import uuid

class NoticeCreate(BaseModel):
    batch_id: Optional[uuid.UUID] = None # None means global
    title: str
    content: str
    priority: str = "normal" # normal, urgent, announcement
    is_global: bool = False

class NoticeOut(BaseModel):
    id: uuid.UUID
    batch_id: Optional[uuid.UUID] = None
    batch_name: Optional[str] = None
    posted_by: uuid.UUID
    author_name: Optional[str] = None
    title: str
    content: str
    priority: str
    is_global: bool
    created_at: datetime

    class Config:
        from_attributes = True
