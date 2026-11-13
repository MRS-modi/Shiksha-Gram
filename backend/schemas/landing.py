from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
import uuid

class LandingContentUpdate(BaseModel):
    hero_title: str
    hero_title_hi: str
    hero_subtitle: str
    hero_subtitle_hi: str
    promotions_banner: str
    promotions_banner_hi: str

class LandingContentOut(BaseModel):
    id: int
    hero_title: str
    hero_title_hi: str
    hero_subtitle: str
    hero_subtitle_hi: str
    promotions_banner: str
    promotions_banner_hi: str
    updated_at: datetime

    class Config:
        from_attributes = True

class CoachingPromotionCreate(BaseModel):
    coaching_name: str
    mentor_name: str
    subjects: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    badge: Optional[str] = "Top Rated"
    student_count: Optional[int] = 50
    rating: Optional[float] = 4.9
    contact_phone: Optional[str] = None
    image_url: Optional[str] = None

class CoachingPromotionOut(BaseModel):
    id: uuid.UUID
    coaching_name: str
    mentor_name: str
    subjects: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    badge: str
    student_count: int
    rating: float
    contact_phone: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
