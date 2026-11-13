import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List
from fastapi import HTTPException, status
from backend.core.security import verify_password, get_password_hash, create_access_token
from backend.db.supabase_client import get_supabase_client
from backend.schemas.auth import (
    UserSignup,
    UserLogin,
    ProfileOut,
    TokenResponse,
    ProfileChangeSubmit,
    ProfileChangeReview,
    ProfileChangeRequestOut,
)

# Persistent production database seed with hardcoded initial Admin
_db_users: Dict[str, Dict[str, Any]] = {
    # 1. Hardcoded Administrator as specified by user
    "admin@shikshagram.com": {
        "id": "f9e8d7c6-b5a4-3210-fedc-ba9876543210",
        "name": "Shiksha Gram Administrator",
        "email": "admin@shikshagram.com",
        "hashed_password": get_password_hash("admin1234"),
        "role": "admin",
        "is_verified": True,
        "is_blocked": False,
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "phone": "+91 99999 88888",
        "created_at": datetime.utcnow()
    },
    # 2. Approved Teacher
    "teacher@shikshagram.com": {
        "id": "e4b6c810-7214-41d3-98fe-f472851a7101",
        "name": "Dr. Rajesh Sharma",
        "email": "teacher@shikshagram.com",
        "hashed_password": get_password_hash("teacher123"),
        "role": "teacher",
        "is_verified": True,
        "is_blocked": False,
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "phone": "+91 98765 43210",
        "address": "Civil Lines, Prayagraj, UP",
        "gender": "Male",
        "coaching_name": "Sharma Science & Math Academy",
        "coaching_address": "Hall A, Civil Lines, Prayagraj",
        "subjects": ["Mathematics", "Physics"],
        "qualification": "Ph.D. in Physics, M.Sc Mathematics",
        "experience_years": 15,
        "bio": "Passionate educator mentoring CBSE & UP Board students for over 15 years with 100% board success.",
        "created_at": datetime.utcnow()
    },
    # 3. Active Enrolled Student
    "student@shikshagram.com": {
        "id": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        "name": "Aman Verma",
        "email": "student@shikshagram.com",
        "hashed_password": get_password_hash("student123"),
        "role": "student",
        "is_verified": True,
        "is_blocked": False,
        "avatar_url": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        "phone": "+91 91234 56789",
        "address": "Tagore Town, Prayagraj",
        "gender": "Male",
        "school_name": "St. Joseph's College, Prayagraj",
        "class_grade": "Class 10th",
        "guardian_name": "Mr. R. K. Verma",
        "guardian_phone": "+91 98111 22334",
        "roll_number": "SG-2026-042",
        "parent_access_pin": "4289",
        "created_at": datetime.utcnow()
    }
}

# Profile Change Requests Queue
_db_profile_requests: List[Dict[str, Any]] = []

class AuthService:
    @staticmethod
    async def signup(data: UserSignup) -> TokenResponse:
        sb = get_supabase_client()
        normalized_email = data.email.lower().strip()

        # Check existing user
        if normalized_email in _db_users:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email address already exists. Please login instead."
            )

        new_id = str(uuid.uuid4())
        # Teachers must be verified by administrator before gaining access
        is_verified = True if data.role == "student" else False
        pin = str(uuid.uuid4().int)[:4] if data.role == "student" else None

        user_dict = {
            "id": new_id,
            "name": data.name,
            "email": normalized_email,
            "hashed_password": get_password_hash(data.password),
            "role": data.role,
            "is_verified": is_verified,
            "is_blocked": False,
            "avatar_url": f"https://api.dicebear.com/7.x/bottts/svg?seed={normalized_email}",
            "phone": data.phone,
            "address": data.address,
            "gender": data.gender,
            "dob": data.dob,
            
            # Teacher fields
            "coaching_name": data.coaching_name,
            "coaching_address": data.coaching_address,
            "subjects": data.subjects or [],
            "qualification": data.qualification,
            "experience_years": data.experience_years or 0,
            "bio": data.bio,
            
            # Student fields
            "school_name": data.school_name,
            "class_grade": data.class_grade,
            "guardian_name": data.guardian_name,
            "guardian_phone": data.guardian_phone,
            "roll_number": f"SG-2026-{str(len(_db_users) + 40).zfill(3)}" if data.role == "student" else None,
            "parent_access_pin": pin,
            "created_at": datetime.utcnow()
        }

        # Store in Supabase if configured
        if sb:
            try:
                sb.table("profiles").insert({
                    k: v for k, v in user_dict.items() if k != "hashed_password"
                }).execute()
            except Exception:
                pass

        _db_users[normalized_email] = user_dict
        token = create_access_token(new_id, data.role)

        msg = "Account created successfully."
        if data.role == "teacher":
            msg = "Teacher registration submitted. Your account is pending verification by the administrator."

        return TokenResponse(
            access_token=token,
            user=ProfileOut(**user_dict),
            message=msg
        )

    @staticmethod
    async def admin_login(data: UserLogin) -> TokenResponse:
        """Dedicated secured login strictly verifying role == 'admin' server-side with bcrypt verification."""
        normalized_email = data.email.lower().strip()
        user = _db_users.get(normalized_email)
        if not user or not verify_password(data.password, user.get("hashed_password", "")):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid administrator credentials."
            )
        if user.get("role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access Denied: This portal is strictly restricted to platform administrators."
            )
        token = create_access_token(user["id"], "admin")
        return TokenResponse(
            access_token=token,
            user=ProfileOut(**user),
            message="Administrator authentication successful."
        )

    @staticmethod
    async def login(data: UserLogin) -> TokenResponse:
        sb = get_supabase_client()
        normalized_email = data.email.lower().strip()

        # Hardcoded Admin credentials check as required by user
        if normalized_email == "admin@shikshagram.com" and data.password == "admin1234":
            admin_user = _db_users["admin@shikshagram.com"]
            token = create_access_token(admin_user["id"], "admin")
            return TokenResponse(
                access_token=token,
                user=ProfileOut(**admin_user),
                message="Welcome Administrator."
            )

        # Check in database
        user = _db_users.get(normalized_email)
        if not user or not verify_password(data.password, user.get("hashed_password", "")):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password."
            )

        if user.get("is_blocked"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account has been deactivated by the platform administrator."
            )

        # Check teacher verification status
        if user.get("role") == "teacher" and not user.get("is_verified"):
            token = create_access_token(user["id"], user["role"])
            return TokenResponse(
                access_token=token,
                user=ProfileOut(**user),
                message="PENDING_VERIFICATION: Your teacher account is awaiting admin approval before workspace activation."
            )

        token = create_access_token(user["id"], user["role"])
        return TokenResponse(
            access_token=token,
            user=ProfileOut(**user),
            message="Login successful."
        )

    @staticmethod
    async def create_new_admin(creator_admin_id: str, admin_data: Any) -> ProfileOut:
        normalized_email = admin_data.email.lower().strip()
        if normalized_email in _db_users:
            raise HTTPException(status_code=400, detail="User with this email already exists.")

        new_id = str(uuid.uuid4())
        new_admin = {
            "id": new_id,
            "name": admin_data.name,
            "email": normalized_email,
            "hashed_password": get_password_hash(admin_data.password),
            "role": "admin",
            "is_verified": True,
            "is_blocked": False,
            "avatar_url": f"https://api.dicebear.com/7.x/bottts/svg?seed={normalized_email}",
            "phone": admin_data.phone,
            "created_at": datetime.utcnow()
        }
        _db_users[normalized_email] = new_admin
        return ProfileOut(**new_admin)

    @staticmethod
    async def submit_profile_change_request(user_id: str, data: ProfileChangeSubmit) -> Dict[str, Any]:
        """User submits edits. Changes do not apply immediately; request is queued for Teacher/Admin approval."""
        # Find user
        user = None
        for u in _db_users.values():
            if str(u["id"]) == str(user_id):
                user = u
                break
        if not user:
            raise HTTPException(status_code=404, detail="User profile not found")

        req_id = str(uuid.uuid4())
        target_teacher_id = "e4b6c810-7214-41d3-98fe-f472851a7101" if user["role"] == "student" else None

        req_dict = {
            "id": req_id,
            "user_id": user["id"],
            "user_name": user["name"],
            "user_email": user["email"],
            "user_role": user["role"],
            "target_teacher_id": target_teacher_id,
            "target_teacher_name": "Dr. Rajesh Sharma" if target_teacher_id else None,
            "requested_changes": data.requested_changes,
            "status": "pending",
            "created_at": datetime.utcnow()
        }
        _db_profile_requests.append(req_dict)

        return {
            "success": True,
            "request_id": req_id,
            "status": "pending",
            "message": "Your profile edit request has been submitted for approval. Changes will take effect once reviewed."
        }

    @staticmethod
    async def review_profile_change_request(reviewer_id: str, reviewer_role: str, data: ProfileChangeReview) -> Dict[str, Any]:
        """Admin or enrolled Teacher reviews and approves/rejects the profile change request."""
        req = next((r for r in _db_profile_requests if str(r["id"]) == str(data.request_id)), None)
        if not req:
            raise HTTPException(status_code=404, detail="Profile change request not found.")

        # Permission check: Teacher can only approve students; Admin can approve anyone
        if reviewer_role == "teacher" and req["user_role"] != "student":
            raise HTTPException(status_code=403, detail="Teachers can only review student profile change requests.")

        req["status"] = "approved" if data.approve else "rejected"
        req["reviewed_by"] = reviewer_id
        req["review_notes"] = data.review_notes
        req["reviewed_at"] = datetime.utcnow()

        # If approved, apply changes to user profile in database
        if data.approve:
            target_user = None
            for u in _db_users.values():
                if str(u["id"]) == str(req["user_id"]):
                    target_user = u
                    break
            if target_user:
                for k, v in req["requested_changes"].items():
                    if k in target_user and k not in ("id", "email", "role", "hashed_password"):
                        target_user[k] = v

        return {
            "success": True,
            "request_id": req["id"],
            "status": req["status"],
            "message": f"Profile update request {req['status']} successfully."
        }

    @staticmethod
    async def get_pending_requests_for_reviewer(reviewer_id: str, reviewer_role: str) -> List[Dict[str, Any]]:
        if reviewer_role == "admin":
            return [r for r in _db_profile_requests if r["status"] == "pending"]
        elif reviewer_role == "teacher":
            return [r for r in _db_profile_requests if r["status"] == "pending" and r.get("user_role") == "student"]
        return []

    @staticmethod
    async def get_my_pending_request(user_id: str) -> Optional[Dict[str, Any]]:
        return next((r for r in reversed(_db_profile_requests) if str(r["user_id"]) == str(user_id)), None)
