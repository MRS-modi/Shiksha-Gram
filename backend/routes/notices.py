import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends
from backend.schemas.notices import NoticeCreate, NoticeOut
from backend.core.security import get_current_user, require_role

router = APIRouter(prefix="/notices", tags=["Notices & Announcements"])

_local_notices: List[dict] = [
    {
        "id": "not-1",
        "batch_id": None,
        "batch_name": "All Batches",
        "posted_by": "f9e8d7c6-b5a4-3210-fedc-ba9876543210",
        "author_name": "Administration",
        "title": "Special Sunday Mock Test for Class 10 & 12 Board Aspirants",
        "content": "All students are informed that a full-length 3-hour mock test will be conducted this Sunday from 9:00 AM to 12:00 PM. Please bring your geometry box and admit cards.",
        "priority": "urgent",
        "is_global": True,
        "created_at": datetime.utcnow()
    },
    {
        "id": "not-2",
        "batch_id": "b1111111-1111-1111-1111-111111111111",
        "batch_name": "Class 10th - Board Mastery",
        "posted_by": "e4b6c810-7214-41d3-98fe-f472851a7101",
        "author_name": "Dr. Rajesh Sharma",
        "title": "Mathematics Homework Submission Deadline Extended",
        "content": "Exercise 8.4 solutions can now be submitted by Friday 5:00 PM in the Learning Hub.",
        "priority": "normal",
        "is_global": False,
        "created_at": datetime.utcnow()
    }
]

@router.get("/", response_model=List[NoticeOut])
async def list_notices(
    batch_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Retrieve global and batch notices."""
    if batch_id:
        return [n for n in _local_notices if n["is_global"] or str(n.get("batch_id")) == str(batch_id)]
    return _local_notices

@router.post("/", response_model=NoticeOut)
async def post_notice(
    data: NoticeCreate,
    current_user: dict = Depends(require_role(["teacher", "admin"]))
):
    """Post an announcement (Teacher/Admin)."""
    new_not = {
        "id": str(uuid.uuid4()),
        "batch_id": str(data.batch_id) if data.batch_id else None,
        "batch_name": "Batch Notice" if data.batch_id else "Global Announcement",
        "posted_by": current_user["id"],
        "author_name": "Teacher / Institute",
        "title": data.title,
        "content": data.content,
        "priority": data.priority,
        "is_global": data.is_global,
        "created_at": datetime.utcnow()
    }
    _local_notices.insert(0, new_not)
    return NoticeOut(**new_not)
