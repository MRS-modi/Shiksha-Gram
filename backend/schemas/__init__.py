from backend.schemas.auth import (
    UserSignup,
    UserLogin,
    GoogleAuthRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ProfileChangeSubmit,
    ProfileChangeReview,
    ProfileChangeRequestOut,
    ProfileOut,
    TokenResponse,
)
from backend.schemas.batch import (
    BatchCreate,
    BatchUpdate,
    BatchOut,
    EnrollmentRequest,
    EnrollmentStatusUpdate,
    StudentRosterItem,
)
from backend.schemas.attendance import (
    AttendanceRecordItem,
    BatchAttendanceSubmit,
    AttendanceOut,
    AttendanceSummary,
)
from backend.schemas.marks import (
    StudentScoreItem,
    TestMarksUpload,
    TestMarkOut,
    LeaderboardEntry,
)
from backend.schemas.materials import (
    MaterialCreate,
    MaterialOut,
)
from backend.schemas.notices import (
    NoticeCreate,
    NoticeOut,
)
from backend.schemas.fees import (
    FeeCreate,
    FeeUpdate,
    FeeOut,
)
from backend.schemas.admin import (
    AdminCreate,
    TeacherVerificationAction,
    AdminStatsOut,
    UserBlockToggle,
)
from backend.schemas.landing import (
    LandingContentUpdate,
    LandingContentOut,
    CoachingPromotionCreate,
    CoachingPromotionOut,
)

__all__ = [
    "UserSignup",
    "UserLogin",
    "GoogleAuthRequest",
    "ForgotPasswordRequest",
    "ResetPasswordRequest",
    "ProfileChangeSubmit",
    "ProfileChangeReview",
    "ProfileChangeRequestOut",
    "ProfileOut",
    "TokenResponse",
    "BatchCreate",
    "BatchUpdate",
    "BatchOut",
    "EnrollmentRequest",
    "EnrollmentStatusUpdate",
    "StudentRosterItem",
    "AttendanceRecordItem",
    "BatchAttendanceSubmit",
    "AttendanceOut",
    "AttendanceSummary",
    "StudentScoreItem",
    "TestMarksUpload",
    "TestMarkOut",
    "LeaderboardEntry",
    "MaterialCreate",
    "MaterialOut",
    "NoticeCreate",
    "NoticeOut",
    "FeeCreate",
    "FeeUpdate",
    "FeeOut",
    "AdminCreate",
    "TeacherVerificationAction",
    "AdminStatsOut",
    "UserBlockToggle",
    "LandingContentUpdate",
    "LandingContentOut",
    "CoachingPromotionCreate",
    "CoachingPromotionOut",
]
