from backend.routes.auth import router as auth_router
from backend.routes.batches import router as batches_router
from backend.routes.attendance import router as attendance_router
from backend.routes.marks import router as marks_router
from backend.routes.materials import router as materials_router
from backend.routes.notices import router as notices_router
from backend.routes.fees import router as fees_router
from backend.routes.admin import router as admin_router
from backend.routes.ai import router as ai_router
from backend.routes.landing import router as landing_router

__all__ = [
    "auth_router",
    "batches_router",
    "attendance_router",
    "marks_router",
    "materials_router",
    "notices_router",
    "fees_router",
    "admin_router",
    "ai_router",
    "landing_router",
]
