from fastapi import APIRouter, Depends
from backend.schemas.attendance import BatchAttendanceSubmit, AttendanceSummary
from backend.services.attendance_service import AttendanceService
from backend.core.security import get_current_user, require_role

router = APIRouter(prefix="/attendance", tags=["Attendance Management"])

@router.post("/mark")
async def mark_attendance(
    data: BatchAttendanceSubmit,
    current_user: dict = Depends(require_role(["teacher", "admin"]))
):
    """Mark daily attendance for a batch (Present/Absent/Late)."""
    return await AttendanceService.mark_batch_attendance(current_user["id"], data)

@router.get("/summary/{student_id}", response_model=AttendanceSummary)
async def get_attendance_summary(
    student_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get attendance statistics, percentages, and streaks for a student."""
    return await AttendanceService.get_student_summary(student_id)
