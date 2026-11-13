from datetime import datetime
import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Date, Numeric, Integer, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=True)
    role = Column(String(50), nullable=False, default="student") # student, teacher, admin
    is_verified = Column(Boolean, default=False)
    is_blocked = Column(Boolean, default=False)
    avatar_url = Column(Text, nullable=True)
    phone = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    gender = Column(String(20), nullable=True)
    dob = Column(Date, nullable=True)
    
    # Teacher specific
    coaching_name = Column(String(255), nullable=True)
    coaching_address = Column(Text, nullable=True)
    subjects = Column(ARRAY(String), default=[])
    qualification = Column(String(255), nullable=True)
    experience_years = Column(Integer, default=0)
    bio = Column(Text, nullable=True)
    
    # Student specific
    school_name = Column(String(255), nullable=True)
    class_grade = Column(String(50), nullable=True)
    guardian_name = Column(String(255), nullable=True)
    guardian_phone = Column(String(50), nullable=True)
    roll_number = Column(String(50), nullable=True)
    parent_access_pin = Column(String(10), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    batches_taught = relationship("Batch", back_populates="teacher")
    enrollments = relationship("BatchEnrollment", back_populates="student")
    attendances = relationship("Attendance", back_populates="student")
    marks = relationship("TestMark", back_populates="student")
    change_requests = relationship("ProfileChangeRequest", back_populates="user", foreign_keys="ProfileChangeRequest.user_id")


class ProfileChangeRequest(Base):
    __tablename__ = "profile_change_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    user_role = Column(String(50), nullable=False)
    target_teacher_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    requested_changes = Column(JSON, nullable=False)
    status = Column(String(50), default="pending") # pending, approved, rejected
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    review_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)

    user = relationship("Profile", foreign_keys=[user_id], back_populates="change_requests")


class Batch(Base):
    __tablename__ = "batches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    subject = Column(String(255), nullable=False)
    schedule = Column(String(255), nullable=False)
    room_or_link = Column(String(255), nullable=True)
    fees_amount = Column(Numeric(10, 2), default=0.00)
    capacity = Column(Integer, default=40)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    teacher = relationship("Profile", back_populates="batches_taught")
    enrollments = relationship("BatchEnrollment", back_populates="batch", cascade="all, delete-orphan")
    attendances = relationship("Attendance", back_populates="batch", cascade="all, delete-orphan")
    marks = relationship("TestMark", back_populates="batch", cascade="all, delete-orphan")
    materials = relationship("StudyMaterial", back_populates="batch", cascade="all, delete-orphan")
    notices = relationship("Notice", back_populates="batch", cascade="all, delete-orphan")


class BatchEnrollment(Base):
    __tablename__ = "batch_enrollments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("batches.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), default="pending") # pending, accepted, rejected
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    batch = relationship("Batch", back_populates="enrollments")
    student = relationship("Profile", back_populates="enrollments")


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("batches.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String(50), default="present") # present, absent, late
    remarks = Column(Text, nullable=True)
    marked_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    batch = relationship("Batch", back_populates="attendances")
    student = relationship("Profile", back_populates="attendances")


class TestMark(Base):
    __tablename__ = "tests_and_marks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("batches.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    test_name = Column(String(255), nullable=False)
    subject = Column(String(255), nullable=False)
    test_date = Column(Date, nullable=False)
    max_marks = Column(Numeric(6, 2), default=100.00)
    score = Column(Numeric(6, 2), nullable=False)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    batch = relationship("Batch", back_populates="marks")
    student = relationship("Profile", back_populates="marks")


class StudyMaterial(Base):
    __tablename__ = "study_materials"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("batches.id", ondelete="CASCADE"), nullable=False)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    subject = Column(String(255), nullable=False)
    material_type = Column(String(50), default="pdf")
    file_url = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    batch = relationship("Batch", back_populates="materials")


class Notice(Base):
    __tablename__ = "notices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("batches.id", ondelete="CASCADE"), nullable=True)
    posted_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    priority = Column(String(50), default="normal")
    is_global = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    batch = relationship("Batch", back_populates="notices")


class FeeRecord(Base):
    __tablename__ = "fees_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("batches.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    month = Column(String(50), nullable=False)
    status = Column(String(50), default="pending")
    receipt_no = Column(String(100), nullable=True)
    paid_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class LandingContent(Base):
    __tablename__ = "landing_content"

    id = Column(Integer, primary_key=True, default=1)
    hero_title = Column(Text, nullable=False)
    hero_title_hi = Column(Text, nullable=False)
    hero_subtitle = Column(Text, nullable=False)
    hero_subtitle_hi = Column(Text, nullable=False)
    promotions_banner = Column(Text, nullable=False)
    promotions_banner_hi = Column(Text, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CoachingPromotion(Base):
    __tablename__ = "coaching_promotions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    coaching_name = Column(String(255), nullable=False)
    mentor_name = Column(String(255), nullable=False)
    subjects = Column(String(255), nullable=False)
    tagline = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    badge = Column(String(50), default="Top Rated")
    student_count = Column(Integer, default=50)
    rating = Column(Numeric(2, 1), default=4.9)
    contact_phone = Column(String(50), nullable=True)
    image_url = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
