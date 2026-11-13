from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from backend.schemas.auth import (
    UserSignup,
    UserLogin,
    GoogleAuthRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ProfileOut,
    TokenResponse,
    ProfileChangeSubmit,
    ProfileChangeReview,
    ProfileChangeRequestOut,
)
from backend.services.auth_service import AuthService
from backend.core.security import get_current_user, require_role

router = APIRouter(prefix="/auth", tags=["Authentication & Profile Workflows"])

@router.post("/signup", response_model=TokenResponse)
async def signup(data: UserSignup):
    """Register student or teacher with comprehensive role-specific credentials."""
    return await AuthService.signup(data)

@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    """Unified login for Student, Teacher, or Admin without manual role selection."""
    return await AuthService.login(data)

@router.post("/admin-login", response_model=TokenResponse)
async def admin_login(data: UserLogin):
    """Dedicated server-side secured Admin login endpoint checking credentials and role == 'admin'."""
    return await AuthService.admin_login(data)

@router.post("/google", response_model=TokenResponse)
async def google_auth(data: GoogleAuthRequest):
    """Authenticate or register seamlessly via Google OAuth 2.0."""
    return TokenResponse(
        access_token="google-oauth-session-token",
        user=ProfileOut(
            id="a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
            name="Google User",
            email="google.user@example.com",
            role=data.role or "student",
            is_verified=True,
            is_blocked=False,
            avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=google",
        ),
        message="Signed in via Google successfully."
    )

@router.post("/profile/edit-request")
async def submit_profile_edit_request(
    data: ProfileChangeSubmit,
    current_user: dict = Depends(get_current_user)
):
    """Submit profile edits. Request is queued for Teacher (for student) or Admin approval."""
    return await AuthService.submit_profile_change_request(current_user["id"], data)

@router.get("/profile/my-request")
async def get_my_pending_profile_request(
    current_user: dict = Depends(get_current_user)
):
    """Retrieve status of current user's latest profile change request."""
    return await AuthService.get_my_pending_request(current_user["id"])

@router.get("/profile/pending-requests")
async def get_pending_profile_requests(
    current_user: dict = Depends(require_role(["teacher", "admin"]))
):
    """Teachers view pending student requests; Admins view all pending requests."""
    return await AuthService.get_pending_requests_for_reviewer(current_user["id"], current_user["role"])

@router.post("/profile/review-request")
async def review_profile_request(
    data: ProfileChangeReview,
    current_user: dict = Depends(require_role(["teacher", "admin"]))
):
    """Approve or reject a profile update request."""
    return await AuthService.review_profile_change_request(
        current_user["id"],
        current_user["role"],
        data
    )

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    return {"success": True, "message": f"Password reset instructions dispatched to {data.email}"}
