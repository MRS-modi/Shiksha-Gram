import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends
from backend.schemas.fees import FeeCreate, FeeUpdate, FeeOut
from backend.core.security import get_current_user, require_role

router = APIRouter(prefix="/fees", tags=["Schedule & Fees"])

_local_fees: List[dict] = [
    {
        "id": "fee-1",
        "student_id": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        "student_name": "Aman Verma",
        "batch_id": "b1111111-1111-1111-1111-111111111111",
        "batch_name": "Class 10th - Board Mastery",
        "amount": 1500.0,
        "month": "November 2026",
        "status": "paid",
        "receipt_no": "REC-2026-11-042",
        "paid_date": datetime(2026, 11, 2),
        "created_at": datetime.utcnow()
    },
    {
        "id": "fee-2",
        "student_id": "a2b3c4d5-e6f7-4a5b-8c9d-0e1f2a3b4c5e",
        "student_name": "Priya Sharma",
        "batch_id": "b1111111-1111-1111-1111-111111111111",
        "batch_name": "Class 10th - Board Mastery",
        "amount": 1500.0,
        "month": "November 2026",
        "status": "pending",
        "receipt_no": None,
        "paid_date": None,
        "created_at": datetime.utcnow()
    }
]

@router.get("/", response_model=List[FeeOut])
async def list_fees(
    student_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """List fee records."""
    if student_id:
        return [f for f in _local_fees if str(f["student_id"]) == str(student_id)]
    return _local_fees

@router.post("/mark-paid/{fee_id}")
async def mark_fee_paid(
    fee_id: str,
    current_user: dict = Depends(require_role(["teacher", "admin"]))
):
    """Mark student fee as paid and generate receipt number."""
    for f in _local_fees:
        if str(f["id"]) == str(fee_id):
            f["status"] = "paid"
            f["receipt_no"] = f"REC-SG-{datetime.utcnow().strftime('%Y%m%d%H%M')}"
            f["paid_date"] = datetime.utcnow()
            return {"success": True, "fee": f}
    return {"success": False, "message": "Fee record not found"}
