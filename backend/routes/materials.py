import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends
from backend.schemas.materials import MaterialCreate, MaterialOut
from backend.core.security import get_current_user, require_role

router = APIRouter(prefix="/materials", tags=["Learning Hub & Study Material"])

_local_materials: List[dict] = [
    {
        "id": "mat-1",
        "batch_id": "b1111111-1111-1111-1111-111111111111",
        "uploaded_by": "e4b6c810-7214-41d3-98fe-f472851a7101",
        "teacher_name": "Dr. Rajesh Sharma",
        "title": "Complete Trigonometry Formula Sheet & Quick Revision",
        "subject": "Mathematics",
        "material_type": "pdf",
        "file_url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        "description": "Essential formulas, identities and NCERT exemplar questions with solved solutions.",
        "created_at": datetime.utcnow()
    },
    {
        "id": "mat-2",
        "batch_id": "b1111111-1111-1111-1111-111111111111",
        "uploaded_by": "e4b6c810-7214-41d3-98fe-f472851a7101",
        "teacher_name": "Dr. Rajesh Sharma",
        "title": "Light & Reflection Animated Video Lecture",
        "subject": "Physics",
        "material_type": "video_link",
        "file_url": "https://youtube.com/watch?v=sample",
        "description": "Watch before Thursday lecture. Covers concave and convex mirror ray diagrams.",
        "created_at": datetime.utcnow()
    }
]

@router.get("/", response_model=List[MaterialOut])
async def list_materials(
    batch_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """List study materials filtered by batch."""
    if batch_id:
        return [m for m in _local_materials if str(m.get("batch_id")) == str(batch_id)]
    return _local_materials

@router.post("/", response_model=MaterialOut)
async def upload_material(
    data: MaterialCreate,
    current_user: dict = Depends(require_role(["teacher", "admin"]))
):
    """Upload new PDF or link (Teacher only)."""
    new_mat = {
        "id": str(uuid.uuid4()),
        "batch_id": str(data.batch_id),
        "uploaded_by": current_user["id"],
        "teacher_name": "Teacher",
        "title": data.title,
        "subject": data.subject,
        "material_type": data.material_type,
        "file_url": data.file_url,
        "description": data.description,
        "created_at": datetime.utcnow()
    }
    _local_materials.insert(0, new_mat)
    return MaterialOut(**new_mat)
