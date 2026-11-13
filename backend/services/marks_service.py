import uuid
from datetime import date, datetime
from typing import List, Dict, Any, Optional
from backend.db.supabase_client import get_supabase_client
from backend.schemas.marks import TestMarksUpload, TestMarkOut, LeaderboardEntry

_local_marks: List[Dict[str, Any]] = [
    {
        "id": "mark-1",
        "batch_id": "b1111111-1111-1111-1111-111111111111",
        "student_id": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        "student_name": "Aman Verma",
        "test_name": "Mid-Term Mathematics",
        "subject": "Mathematics",
        "test_date": date(2026, 11, 5),
        "max_marks": 100.0,
        "score": 94.0,
        "remarks": "Excellent conceptual clarity in Quadratic equations",
        "created_at": datetime.utcnow()
    },
    {
        "id": "mark-2",
        "batch_id": "b1111111-1111-1111-1111-111111111111",
        "student_id": "a2b3c4d5-e6f7-4a5b-8c9d-0e1f2a3b4c5e",
        "student_name": "Priya Sharma",
        "test_name": "Mid-Term Mathematics",
        "subject": "Mathematics",
        "test_date": date(2026, 11, 5),
        "max_marks": 100.0,
        "score": 88.5,
        "remarks": "Very good, improve step-by-step proofs",
        "created_at": datetime.utcnow()
    },
    {
        "id": "mark-3",
        "batch_id": "b1111111-1111-1111-1111-111111111111",
        "student_id": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        "student_name": "Aman Verma",
        "test_name": "Physics Optics Quiz",
        "subject": "Physics",
        "test_date": date(2026, 11, 8),
        "max_marks": 50.0,
        "score": 47.0,
        "remarks": "Outstanding ray diagrams",
        "created_at": datetime.utcnow()
    }
]

def calculate_grade(pct: float) -> str:
    if pct >= 90:
        return "A+"
    elif pct >= 80:
        return "A"
    elif pct >= 70:
        return "B+"
    elif pct >= 60:
        return "B"
    elif pct >= 50:
        return "C"
    elif pct >= 35:
        return "D"
    return "F"

class MarksService:
    @staticmethod
    async def upload_marks(teacher_id: str, data: TestMarksUpload) -> Dict[str, Any]:
        sb = get_supabase_client()
        count = 0
        for item in data.scores:
            m_id = str(uuid.uuid4())
            pct = round((item.score / data.max_marks) * 100, 1)
            grade = calculate_grade(pct)

            record = {
                "id": m_id,
                "batch_id": str(data.batch_id),
                "student_id": str(item.student_id),
                "test_name": data.test_name,
                "subject": data.subject,
                "test_date": data.test_date,
                "max_marks": data.max_marks,
                "score": item.score,
                "remarks": item.remarks,
                "created_at": datetime.utcnow()
            }
            _local_marks.append(record)
            count += 1

        return {
            "success": True,
            "count": count,
            "message": f"Successfully recorded scores for {count} students."
        }

    @staticmethod
    async def get_student_marks(student_id: str) -> List[TestMarkOut]:
        records = [m for m in _local_marks if str(m["student_id"]) == str(student_id)]
        results = []
        for r in records:
            pct = round((float(r["score"]) / float(r["max_marks"])) * 100, 1)
            grade = calculate_grade(pct)
            results.append(
                TestMarkOut(
                    id=r["id"],
                    batch_id=r["batch_id"],
                    student_id=r["student_id"],
                    student_name=r.get("student_name", "Student"),
                    test_name=r["test_name"],
                    subject=r["subject"],
                    test_date=r["test_date"],
                    max_marks=r["max_marks"],
                    score=r["score"],
                    percentage=pct,
                    grade=grade,
                    remarks=r.get("remarks"),
                    created_at=r["created_at"]
                )
            )
        return results

    @staticmethod
    async def get_leaderboard(batch_id: Optional[str] = None) -> List[LeaderboardEntry]:
        # Return ranked list of students with top marks
        return [
            LeaderboardEntry(
                rank=1,
                student_id="a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
                student_name="Aman Verma",
                avatar_url="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
                batch_name="Class 10th - Board Mastery",
                average_score=94.0,
                tests_taken=8
            ),
            LeaderboardEntry(
                rank=2,
                student_id="a2b3c4d5-e6f7-4a5b-8c9d-0e1f2a3b4c5e",
                student_name="Priya Sharma",
                avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                batch_name="Class 10th - Board Mastery",
                average_score=89.2,
                tests_taken=8
            ),
            LeaderboardEntry(
                rank=3,
                student_id="a3b4c5d6-e7f8-4a5b-8c9d-0e1f2a3b4c5f",
                student_name="Vikram Singh",
                avatar_url="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
                batch_name="Class 12th - Physics Foundation",
                average_score=84.5,
                tests_taken=7
            )
        ]
