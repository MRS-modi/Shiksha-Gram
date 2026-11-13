from typing import List
from fastapi import APIRouter, Depends, HTTPException
from backend.schemas.batch import (
    BatchCreate,
    BatchUpdate,
    BatchOut,
    StudentRosterItem,
    EnrollmentStatusUpdate,
)
from backend.services.batch_service import BatchService
from backend.core.security import get_current_user, require_role

router = APIRouter(prefix="/batches", tags=["Batches & Classes"])

@router.get("/", response_model=List[BatchOut])
async def get_my_batches(current_user: dict = Depends(get_current_user)):
    """Get all batches for the authenticated teacher or enrolled student."""
    return await BatchService.get_teacher_batches(current_user["id"])

@router.post("/", response_model=BatchOut)
async def create_batch(
    data: BatchCreate,
    current_user: dict = Depends(require_role(["teacher", "admin"]))
):
    """Create a new batch (Teacher only)."""
    return await BatchService.create_batch(current_user["id"], data)

@router.get("/{batch_id}/roster", response_model=List[StudentRosterItem])
async def get_batch_roster(
    batch_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get student roster and pending requests for a batch."""
    return await BatchService.get_roster(batch_id)

@router.post("/enrollments/status")
async def update_enrollment_status(
    data: EnrollmentStatusUpdate,
    current_user: dict = Depends(require_role(["teacher", "admin"]))
):
    """Accept or reject an enrollment request."""
    return await BatchService.update_enrollment_status(str(data.enrollment_id), data.status)
