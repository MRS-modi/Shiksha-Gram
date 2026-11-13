from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Path
from backend.schemas.admin import (
    AdminStatsOut, 
    TeacherVerificationAction, 
    UserBlockToggle, 
    AdminCreate,
    BatchCreate,
    BatchAssignTeacher,
    BatchOut,
    NoticeBroadcastCreate,
    NoticeBroadcastOut
)
from backend.schemas.auth import ProfileOut
from backend.services.admin_service import AdminService
from backend.services.auth_service import AuthService
from backend.core.security import require_role

router = APIRouter(prefix="/admin", tags=["Admin Console"])

# 5.1 Admin Dashboard Overview
@router.get("/stats", response_model=AdminStatsOut)
async def get_admin_dashboard_stats(
    current_user: dict = Depends(require_role(["admin"]))
):
    """Platform-wide statistics for the admin dashboard."""
    return await AdminService.get_stats()

# 5.2 Teacher Verification
@router.get("/teachers/pending")
async def list_pending_teachers(
    current_user: dict = Depends(require_role(["admin"]))
):
    """Retrieve list of teachers awaiting verification."""
    return await AdminService.get_pending_teachers()

@router.post("/teachers/verify")
async def verify_teacher(
    data: TeacherVerificationAction,
    current_user: dict = Depends(require_role(["admin"]))
):
    """Approve or reject a teacher application."""
    return await AdminService.verify_teacher(str(data.teacher_id), data.approve, data.notes)

# 5.3 User Management (List, Block, Delete)
@router.get("/users", response_model=List[ProfileOut])
async def list_all_users(
    current_user: dict = Depends(require_role(["admin"]))
):
    """Search and manage all users."""
    return await AdminService.list_all_users()

@router.post("/users/block")
async def toggle_block_user(
    data: UserBlockToggle,
    current_user: dict = Depends(require_role(["admin"]))
):
    """Block or unblock a user account."""
    return await AdminService.toggle_block_user(str(data.user_id), data.is_blocked)

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str = Path(...),
    current_user: dict = Depends(require_role(["admin"]))
):
    """Permanently remove a user account from platform."""
    return await AdminService.delete_user(user_id)

# 5.4 Batch Management (Overview, Create, Assign Teacher)
@router.get("/batches", response_model=List[BatchOut])
async def list_batches(
    current_user: dict = Depends(require_role(["admin"]))
):
    """Platform-level batch overview."""
    return await AdminService.list_batches()

@router.post("/batches", response_model=BatchOut)
async def create_batch(
    data: BatchCreate,
    current_user: dict = Depends(require_role(["admin"]))
):
    """Create a new batch at platform level."""
    return await AdminService.create_batch(data)

@router.post("/batches/{batch_id}/assign-teacher", response_model=BatchOut)
async def assign_batch_teacher(
    data: BatchAssignTeacher,
    batch_id: str = Path(...),
    current_user: dict = Depends(require_role(["admin"]))
):
    """Assign or reassign an approved teacher to a batch."""
    return await AdminService.assign_batch_teacher(batch_id, data)

# 5.5 Global Notices Broadcast
@router.get("/notices/broadcasts", response_model=List[NoticeBroadcastOut])
async def list_broadcast_notices(
    current_user: dict = Depends(require_role(["admin"]))
):
    """List all global broadcasts."""
    return await AdminService.list_broadcast_notices()

@router.post("/notices/broadcast", response_model=NoticeBroadcastOut)
async def broadcast_notice(
    data: NoticeBroadcastCreate,
    current_user: dict = Depends(require_role(["admin"]))
):
    """Broadcast platform-wide announcement to teachers, students, or all users."""
    return await AdminService.broadcast_notice(current_user.get("name", "Administrator"), data)

@router.delete("/notices/broadcasts/{notice_id}")
async def delete_broadcast_notice(
    notice_id: str = Path(...),
    current_user: dict = Depends(require_role(["admin"]))
):
    """Delete a broadcast notice."""
    return await AdminService.delete_broadcast_notice(notice_id)

# 5.6 Admin Account Controls
@router.post("/create-admin", response_model=ProfileOut)
async def create_new_admin(
    data: AdminCreate,
    current_user: dict = Depends(require_role(["admin"]))
):
    """Admin Only: Register an additional administrator account with designated credentials."""
    return await AuthService.create_new_admin(current_user["id"], data)
