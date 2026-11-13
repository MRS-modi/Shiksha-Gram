import uuid
from datetime import datetime
from typing import Dict, Any, List
from backend.schemas.landing import LandingContentUpdate, LandingContentOut, CoachingPromotionCreate, CoachingPromotionOut

# Persistent Landing CMS in Database
_landing_content: Dict[str, Any] = {
    "id": 1,
    "hero_title": "Where Technology Meets Education",
    "hero_title_hi": "जहाँ तकनीक और शिक्षा का संगम होता है",
    "hero_subtitle": "India's premier coaching management platform connecting independent tutors, institutes, students, and parents.",
    "hero_subtitle_hi": "कागजी रजिस्टर, उलझे हुए व्हाट्सएप ग्रुपों को कहें अलविदा। एक क्लिक में उपस्थिति, रिजल्ट और नोट्स प्रबंधित करें।",
    "promotions_banner": "🔥 Admissions Open for Academic Session 2026-27! Register today for top batch seats.",
    "promotions_banner_hi": "🔥 सत्र 2026-27 के नए बैच प्रारंभ! सीमित सीटें उपलब्ध, आज ही नामांकन कराएं।",
    "updated_at": datetime.utcnow()
}

_coaching_promotions: List[Dict[str, Any]] = [
    {
        "id": "cp-1",
        "coaching_name": "Sharma Science & Math Academy",
        "mentor_name": "Dr. Rajesh Sharma (Ph.D, 15+ Yrs Exp)",
        "subjects": "Class 9th-12th Mathematics & Physics",
        "tagline": "Excellence in CBSE & State Board Preparation",
        "description": "Specialized coaching in board exam pattern with weekly mock tests, NCERT exemplar solving, and personal mentorship.",
        "badge": "Top Rated Institute",
        "student_count": 128,
        "rating": 4.9,
        "contact_phone": "+91 98765 43210",
        "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "is_active": True,
        "created_at": datetime.utcnow()
    },
    {
        "id": "cp-2",
        "coaching_name": "Target IIT & NEET Foundation",
        "mentor_name": "Er. Alok Pandey (B.Tech IIT-BHU)",
        "subjects": "Advanced Physics & Mathematics",
        "tagline": "Rankers Batch for JEE & NEET Aspirants",
        "description": "Rigorous conceptual problem-solving, speed test series, and previous 15 years question bank analysis.",
        "badge": "Verified Academy",
        "student_count": 95,
        "rating": 4.8,
        "contact_phone": "+91 93350 44556",
        "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "is_active": True,
        "created_at": datetime.utcnow()
    },
    {
        "id": "cp-3",
        "coaching_name": "Mishra Chemistry Classes",
        "mentor_name": "Prof. Sunita Mishra (M.Sc Gold Medalist)",
        "subjects": "Organic & Inorganic Chemistry",
        "tagline": "Master Reactions & Formulas with Easy Tricks",
        "description": "Visualizing mechanisms in 3D, daily formula sheets, and chapter-wise board scoring strategies.",
        "badge": "Popular",
        "student_count": 82,
        "rating": 4.9,
        "contact_phone": "+91 94150 99887",
        "image_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        "is_active": True,
        "created_at": datetime.utcnow()
    }
]

class LandingService:
    @staticmethod
    async def get_landing_content() -> LandingContentOut:
        return LandingContentOut(**_landing_content)

    @staticmethod
    async def update_landing_content(data: LandingContentUpdate) -> LandingContentOut:
        _landing_content.update({
            "hero_title": data.hero_title,
            "hero_title_hi": data.hero_title_hi,
            "hero_subtitle": data.hero_subtitle,
            "hero_subtitle_hi": data.hero_subtitle_hi,
            "promotions_banner": data.promotions_banner,
            "promotions_banner_hi": data.promotions_banner_hi,
            "updated_at": datetime.utcnow()
        })
        return LandingContentOut(**_landing_content)

    @staticmethod
    async def list_promotions() -> List[CoachingPromotionOut]:
        return [CoachingPromotionOut(**p) for p in _coaching_promotions if p.get("is_active", True)]

    @staticmethod
    async def create_promotion(data: CoachingPromotionCreate) -> CoachingPromotionOut:
        new_promo = {
            "id": str(uuid.uuid4()),
            "coaching_name": data.coaching_name,
            "mentor_name": data.mentor_name,
            "subjects": data.subjects,
            "tagline": data.tagline,
            "description": data.description,
            "badge": data.badge or "Featured",
            "student_count": data.student_count or 50,
            "rating": data.rating or 4.9,
            "contact_phone": data.contact_phone,
            "image_url": data.image_url or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "is_active": True,
            "created_at": datetime.utcnow()
        }
        _coaching_promotions.insert(0, new_promo)
        return CoachingPromotionOut(**new_promo)

    @staticmethod
    async def delete_promotion(promo_id: str) -> Dict[str, Any]:
        global _coaching_promotions
        _coaching_promotions = [p for p in _coaching_promotions if str(p["id"]) != str(promo_id)]
        return {"success": True, "message": "Promotion removed."}
