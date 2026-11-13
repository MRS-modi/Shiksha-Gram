import uuid
from datetime import datetime
from typing import List, Dict, Any
from fastapi import HTTPException
from backend.services.auth_service import _db_users, _db_profile_requests
from backend.schemas.auth import ProfileOut
from backend.schemas.admin import (
    AdminStatsOut, 
    BatchCreate, 
    BatchAssignTeacher, 
    BatchOut, 
    NoticeBroadcastCreate, 
    NoticeBroadcastOut
)

_pending_teachers: List[Dict[str, Any]] = [
    {
        "id": "t-pending-1",
        "name": "Prof. Sunita Mishra",
        "email": "sunita.mishra@example.com",
        "phone": "+91 94150 99887",
        "coaching_name": "Mishra Chemistry Classes",
        "subjects": ["Chemistry"],
        "qualification": "M.Sc Chemistry Gold Medalist",
        "experience_years": 12,
        "address": "George Town, Prayagraj",
        "applied_at": "2026-11-10T10:30:00Z",
        "status": "pending"
    },
    {
        "id": "t-pending-2",
        "name": "Er. Alok Pandey",
        "email": "alok.pandey@example.com",
        "phone": "+91 93350 44556",
        "coaching_name": "Target IIT & NEET Academy",
        "subjects": ["Physics", "Mathematics"],
        "qualification": "B.Tech IIT-BHU",
        "experience_years": 8,
        "address": "Civil Lines, Kanpur",
        "applied_at": "2026-11-11T14:15:00Z",
        "status": "pending"
    }
]

_db_batches: List[Dict[str, Any]] = [
    {
        "id": "batch-101",
        "name": "Class 10th - Board Mastery Mathematics",
        "subject": "Mathematics",
        "teacher_id": "e4b6c810-7214-41d3-98fe-f472851a7101",
        "teacher_name": "Dr. Rajesh Sharma",
        "schedule": "Mon, Wed, Fri • 4:00 PM - 5:30 PM",
        "room": "Room 101",
        "fees": 1500.0,
        "capacity": 35,
        "students_count": 28,
        "status": "active"
    },
    {
        "id": "batch-102",
        "name": "Class 12th - Target IIT Advanced Physics",
        "subject": "Physics",
        "teacher_id": "e4b6c810-7214-41d3-98fe-f472851a7101",
        "teacher_name": "Dr. Rajesh Sharma",
        "schedule": "Tue, Thu, Sat • 6:00 PM - 7:30 PM",
        "room": "Room 104",
        "fees": 2200.0,
        "capacity": 30,
        "students_count": 22,
        "status": "active"
    },
    {
        "id": "batch-103",
        "name": "Class 9th - Science & Math Foundation",
        "subject": "General Science",
        "teacher_id": None,
        "teacher_name": "Unassigned",
        "schedule": "Daily • 5:00 PM - 6:00 PM",
        "room": "Room 202",
        "fees": 1200.0,
        "capacity": 40,
        "students_count": 19,
        "status": "active"
    }
]

_db_global_notices: List[Dict[str, Any]] = [
    {
        "id": "not-glob-1",
        "title": "Admissions & Scholarship Test for 2026-27 Announced",
        "content": "All students and registered tutors are informed that the Shiksha Gram State-Level Talent Scholarship test will be conducted on 15th March 2026 across certified centers.",
        "target_audience": "all",
        "priority": "urgent",
        "author": "Platform SuperAdmin",
        "is_global": True,
        "created_at": datetime.utcnow()
    },
    {
        "id": "not-glob-2",
        "title": "New Verification Standards for Coaching Teachers",
        "content": "All educators must upload their degree verification documents and address proof within 7 days to maintain verified badge status.",
        "target_audience": "teachers",
        "priority": "normal",
        "author": "Platform SuperAdmin",
        "is_global": True,
        "created_at": datetime.utcnow()
    }
]

class AdminService:
    @staticmethod
    async def get_stats() -> AdminStatsOut:
        total_users = len(_db_users) + len(_pending_teachers)
        total_teachers = len([u for u in _db_users.values() if u.get("role") == "teacher"]) + len(_pending_teachers)
        total_students = len([u for u in _db_users.values() if u.get("role") == "student"])
        total_admins = len([u for u in _db_users.values() if u.get("role") == "admin"])
        pending_profile_reqs = len([r for r in _db_profile_requests if r.get("status") == "pending"])
        
        return AdminStatsOut(
            total_users=total_users,
            total_teachers=total_teachers,
            total_students=total_students,
            total_admins=total_admins,
            pending_teacher_approvals=len(_pending_teachers),
            pending_profile_requests=pending_profile_reqs,
            active_batches=len(_db_batches),
            total_attendance_marked=412,
            total_tests_conducted=18
        )

    @staticmethod
    async def get_pending_teachers() -> List[Dict[str, Any]]:
        return _pending_teachers

    @staticmethod
    async def verify_teacher(teacher_id: str, approve: bool, notes: str = None) -> Dict[str, Any]:
        global _pending_teachers
        found = next((t for t in _pending_teachers if str(t["id"]) == str(teacher_id)), None)
        if not found:
            raise HTTPException(status_code=404, detail="Pending teacher request not found")
        
        _pending_teachers = [t for t in _pending_teachers if str(t["id"]) != str(teacher_id)]
        
        status_str = "approved" if approve else "rejected"
        if approve:
            _db_users[found["email"].lower()] = {
                "id": str(uuid.uuid4()),
                "name": found["name"],
                "email": found["email"].lower(),
                "role": "teacher",
                "is_verified": True,
                "is_blocked": False,
                "phone": found["phone"],
                "coaching_name": found["coaching_name"],
                "subjects": found["subjects"],
                "qualification": found.get("qualification"),
                "experience_years": found.get("experience_years", 0),
                "address": found["address"],
                "avatar_url": f"https://api.dicebear.com/7.x/bottts/svg?seed={found['email']}"
            }

        return {
            "success": True,
            "teacher_id": teacher_id,
            "status": status_str,
            "message": f"Teacher registration {status_str} successfully."
        }

    @staticmethod
    async def list_all_users() -> List[ProfileOut]:
        results = []
        for u in _db_users.values():
            results.append(ProfileOut(**u))
        return results

    @staticmethod
    async def toggle_block_user(user_id: str, is_blocked: bool) -> Dict[str, Any]:
        for u in _db_users.values():
            if str(u["id"]) == str(user_id):
                u["is_blocked"] = is_blocked
                return {"success": True, "user_id": user_id, "is_blocked": is_blocked}
        raise HTTPException(status_code=404, detail="User not found")

    @staticmethod
    async def delete_user(user_id: str) -> Dict[str, Any]:
        target_email = None
        for email, u in _db_users.items():
            if str(u["id"]) == str(user_id):
                target_email = email
                break
        if not target_email:
            raise HTTPException(status_code=404, detail="User not found")
        del _db_users[target_email]
        return {"success": True, "user_id": user_id, "message": "User account deleted permanently"}

    # 5.4 Batch Management
    @staticmethod
    async def list_batches() -> List[BatchOut]:
        return [BatchOut(**b) for b in _db_batches]

    @staticmethod
    async def create_batch(data: BatchCreate) -> BatchOut:
        new_batch = {
            "id": "batch-" + str(uuid.uuid4())[:8],
            "name": data.name,
            "subject": data.subject,
            "teacher_id": data.teacher_id,
            "teacher_name": data.teacher_name or "Unassigned",
            "schedule": data.schedule,
            "room": data.room or "Room 101",
            "fees": data.fees,
            "capacity": data.capacity,
            "students_count": 0,
            "status": "active"
        }
        _db_batches.append(new_batch)
        return BatchOut(**new_batch)

    @staticmethod
    async def assign_batch_teacher(batch_id: str, data: BatchAssignTeacher) -> BatchOut:
        batch = next((b for b in _db_batches if str(b["id"]) == str(batch_id)), None)
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")
        batch["teacher_id"] = data.teacher_id
        batch["teacher_name"] = data.teacher_name
        return BatchOut(**batch)

    # 5.5 Global Notices Broadcast
    @staticmethod
    async def broadcast_notice(author_name: str, data: NoticeBroadcastCreate) -> NoticeBroadcastOut:
        new_notice = {
            "id": "not-" + str(uuid.uuid4())[:8],
            "title": data.title,
            "content": data.content,
            "target_audience": data.target_audience or "all",
            "priority": data.priority or "normal",
            "author": author_name,
            "is_global": True,
            "created_at": datetime.utcnow()
        }
        _db_global_notices.insert(0, new_notice)
        return NoticeBroadcastOut(**new_notice)

    @staticmethod
    async def list_broadcast_notices() -> List[NoticeBroadcastOut]:
        return [NoticeBroadcastOut(**n) for n in _db_global_notices]

    @staticmethod
    async def delete_broadcast_notice(notice_id: str) -> Dict[str, Any]:
        global _db_global_notices
        _db_global_notices = [n for n in _db_global_notices if str(n["id"]) != str(notice_id)]
        return {"success": True, "notice_id": notice_id, "message": "Notice deleted"}
