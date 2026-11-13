from typing import List
from fastapi import APIRouter, Depends
from backend.schemas.landing import (
    LandingContentUpdate,
    LandingContentOut,
    CoachingPromotionCreate,
    CoachingPromotionOut,
)
from backend.services.landing_service import LandingService
from backend.core.security import require_role

router = APIRouter(prefix="/landing", tags=["Landing Page CMS & Promotions"])

@router.get("/content", response_model=LandingContentOut)
async def get_landing_content():
    """Public: Fetch dynamic landing page titles, subtitles, and banners."""
    return await LandingService.get_landing_content()

@router.put("/content", response_model=LandingContentOut)
async def update_landing_content(
    data: LandingContentUpdate,
    current_user: dict = Depends(require_role(["admin"]))
):
    """Admin Only: Update landing page hero texts and promotion banner."""
    return await LandingService.update_landing_content(data)

@router.get("/promotions", response_model=List[CoachingPromotionOut])
async def list_coaching_promotions():
    """Public: Retrieve active coaching promotions and mentor spotlights."""
    return await LandingService.list_promotions()

@router.post("/promotions", response_model=CoachingPromotionOut)
async def create_coaching_promotion(
    data: CoachingPromotionCreate,
    current_user: dict = Depends(require_role(["admin"]))
):
    """Admin Only: Add new featured coaching promotion to visitor page."""
    return await LandingService.create_promotion(data)

@router.delete("/promotions/{promo_id}")
async def delete_coaching_promotion(
    promo_id: str,
    current_user: dict = Depends(require_role(["admin"]))
):
    """Admin Only: Remove a coaching promotion from visitor page."""
    return await LandingService.delete_promotion(promo_id)
