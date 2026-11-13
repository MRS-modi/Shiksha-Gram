import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import HTTPException
from backend.db.supabase_client import get_supabase_client
from backend.schemas.batch import BatchCreate, BatchUpdate, BatchOut, StudentRosterItem

_local_batches: List[Dict[str, Any]] = [
    {
        "id": "b1111111-1111-1111-1111-111111111111",
        "teacher_id": "e4b6c810-7214-41d3-98fe-f472851a7101",
        "name": "Class 10th - Board Mastery (Math & Science)",
        "subject": "Mathematics & Science",
        "schedule": "Mon, Wed, Fri • 4:30 PM - 6:00 PM",
        "room_or_link": "Room 201 / Hall A",
        "fees_amount": 1500.00,
        "capacity": 35,
        "is_active": True,
        "created_at": datetime.utcnow()
    },
    {
        "id": "b2222222-2222-2222-2222-222222222222",
        "teacher_id": "e4b6c810-7214-41d3-98fe-f472851a7101",
        "name": "Class 12th - Physics Foundation",
        "subject": "Physics (CBSE & UP Board)",
        "schedule": "Tue, Thu, Sat • 5:00 PM - 6:30 PM",
        "room_or_link": "Lab Room 3",
        "fees_amount": 1800.00,
        "capacity": 30,
        "is_active": True,
        "created_at": datetime.utcnow()
    }
]

_local_enrollments: List[Dict[str, Any]] = [
    {
        "id": "e1111111-1111-1111-1111-111111111111",
        "batch_id": "b1111111-1111-1111-1111-111111111111",
        "student_id": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        "name": "Aman Verma",
        "email": "student@shikshagram.com",
        "phone": "+91 91234 56789",
        "roll_number": "SG-2026-042",
        "avatar_url": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        "status": "accepted",
        "attendance_rate": 92.5,
        "last_score": 94.0,
        "enrolled_at": datetime.utcnow()
    },
    {
        "id": "e2222222-2222-2222-2222-222222222222",
        "batch_id": "b1111111-1111-1111-1111-111111111111",
        "student_id": "a2b3c4d5-e6f7-4a5b-8c9d-0e1f2a3b4c5e",
        "name": "Priya Sharma",
        "email": "priya.sharma@example.com",
        "phone": "+91 98765 11223",
        "roll_number": "SG-2026-043",
        "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        "status": "accepted",
        "attendance_rate": 88.0,
        "last_score": 86.5,
        "enrolled_at": datetime.utcnow()
    },
    {
        "id": "e3333333-3333-3333-3333-333333333333",
        "batch_id": "b1111111-1111-1111-1111-111111111111",
        "student_id": "a3b4c5d6-e7f8-4a5b-8c9d-0e1f2a3b4c5f",
        "name": "Rohan Gupta",
        "email": "rohan.gupta@example.com",
        "phone": "+91 97654 33445",
        "roll_number": "SG-2026-044",
        "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        "status": "pending",
        "attendance_rate": 0.0,
        "last_score": None,
        "enrolled_at": datetime.utcnow()
    }
]

class BatchService:
    @staticmethod
    async def get_teacher_batches(teacher_id: str) -> List[BatchOut]:
        sb = get_supabase_client()
        if sb:
            try:
                res = sb.table("batches").select("*, batch_enrollments(count)").eq("teacher_id", teacher_id).execute()
                if res.data:
                    return [
                        BatchOut(
                            **b,
                            student_count=b.get("batch_enrollments", [{}])[0].get("count", 0)
                        ) for b in res.data
                    ]
            except Exception:
                pass
        
        batches = [b for b in _local_batches if str(b["teacher_id"]) == str(teacher_id)]
        results = []
        for b in batches:
            count = len([e for e in _local_enrollments if str(e["batch_id"]) == str(b["id"]) and e["status"] == "accepted"])
            results.append(BatchOut(**b, student_count=count))
        return results

    @staticmethod
    async def create_batch(teacher_id: str, data: BatchCreate) -> BatchOut:
        sb = get_supabase_client()
        new_id = str(uuid.uuid4())
        batch_dict = {
            "id": new_id,
            "teacher_id": teacher_id,
            "name": data.name,
            "subject": data.subject,
            "schedule": data.schedule,
            "room_or_link": data.room_or_link,
            "fees_amount": data.fees_amount or 0.0,
            "capacity": data.capacity or 40,
            "is_active": True,
            "created_at": datetime.utcnow()
        }

        if sb:
            try:
                res = sb.table("batches").insert(batch_dict).execute()
                if res.data:
                    return BatchOut(**res.data[0], student_count=0)
            except Exception:
                pass

        _local_batches.append(batch_dict)
        return BatchOut(**batch_dict, student_count=0)

    @staticmethod
    async def get_roster(batch_id: str) -> List[StudentRosterItem]:
        items = [e for e in _local_enrollments if str(e["batch_id"]) == str(batch_id)]
        return [
            StudentRosterItem(
                enrollment_id=e["id"],
                student_id=e["student_id"],
                name=e["name"],
                email=e["email"],
                phone=e.get("phone"),
                roll_number=e.get("roll_number"),
                avatar_url=e.get("avatar_url"),
                status=e["status"],
                attendance_rate=e.get("attendance_rate", 0.0),
                last_score=e.get("last_score"),
                enrolled_at=e["enrolled_at"]
            )
            for e in items
        ]

    @staticmethod
    async def update_enrollment_status(enrollment_id: str, status_val: str) -> Dict[str, Any]:
        for e in _local_enrollments:
            if str(e["id"]) == str(enrollment_id):
                e["status"] = status_val
                return {"success": True, "enrollment": e}
        raise HTTPException(status_code=404, detail="Enrollment record not found")
