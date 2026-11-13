from typing import List, Optional
from fastapi import APIRouter, Depends
from backend.schemas.marks import TestMarksUpload, TestMarkOut, LeaderboardEntry
from backend.services.marks_service import MarksService
from backend.core.security import get_current_user, require_role

router = APIRouter(prefix="/marks", tags=["Marks & Academics"])

@router.post("/upload")
async def upload_marks(
    data: TestMarksUpload,
    current_user: dict = Depends(require_role(["teacher", "admin"]))
):
    """Upload test marks for students in a batch."""
    return await MarksService.upload_marks(current_user["id"], data)

@router.get("/student/{student_id}", response_model=List[TestMarkOut])
async def get_student_marks(
    student_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Retrieve test marks history and grades for a student."""
    return await MarksService.get_student_marks(student_id)

@router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(
    batch_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get coaching top performers and rankings."""
    return await MarksService.get_leaderboard(batch_id)
