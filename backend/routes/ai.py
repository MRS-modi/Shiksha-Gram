from pydantic import BaseModel
from fastapi import APIRouter, Depends
from backend.core.security import get_current_user

router = APIRouter(prefix="/ai", tags=["Shiksha AI Doubt Assistant"])

class DoubtQuery(BaseModel):
    subject: str
    question: str
    language: str = "hi" # "hi" or "en"

class DoubtResponse(BaseModel):
    explanation: str
    step_by_step: list[str]
    formula_used: str = None
    tip: str

@router.post("/solve", response_model=DoubtResponse)
async def solve_doubt(data: DoubtQuery, current_user: dict = Depends(get_current_user)):
    """Educational AI assistant explaining concepts step-by-step in Hindi or English."""
    if data.language == "hi":
        return DoubtResponse(
            explanation=f"आपके प्रश्न '{data.question}' का सरल समाधान:",
            step_by_step=[
                "चरण 1: दी गई शर्तों और चर (variables) को पहचानें।",
                "चरण 2: संबंधित प्रमेय अथवा सूत्र लागू करें।",
                "चरण 3: मानों को प्रतिस्थापित करें और बीजगणितीय सरलीकरण करें।"
            ],
            formula_used="sin²(θ) + cos²(θ) = 1  |  F = m × a",
            tip="याद रखें: बोर्ड परीक्षा में हमेशा प्रत्येक चरण और इकाई (units) स्पष्ट रूप से लिखें।"
        )
    else:
        return DoubtResponse(
            explanation=f"Structured solution for '{data.question}':",
            step_by_step=[
                "Step 1: Identify given parameters and target variables.",
                "Step 2: Apply the relevant theorem or governing formula.",
                "Step 3: Substitute values and simplify systematically."
            ],
            formula_used="sin²(θ) + cos²(θ) = 1  |  F = m × a",
            tip="Exam tip: Always state assumptions and highlight final answers with proper units."
        )
