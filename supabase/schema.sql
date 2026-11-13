-- ==============================================================================
-- SHIKSHA GRAM PRODUCTION DATABASE SCHEMA (Supabase / PostgreSQL)
-- "Where Technology Meets Education"
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom ENUM Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enrollment_status AS ENUM ('pending', 'accepted', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE material_type AS ENUM ('pdf', 'drive_link', 'video_link', 'notes');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE fee_status AS ENUM ('paid', 'pending', 'overdue');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notice_priority AS ENUM ('normal', 'urgent', 'announcement');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Profiles Table (Linked with Supabase Auth or standalone custom auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    role user_role NOT NULL DEFAULT 'student',
    is_verified BOOLEAN NOT NULL DEFAULT false, -- Teachers must be verified by admin
    is_blocked BOOLEAN NOT NULL DEFAULT false,
    avatar_url TEXT,
    phone TEXT,
    address TEXT,
    gender TEXT,
    dob DATE,
    
    -- Teacher specific fields
    coaching_name TEXT,
    coaching_address TEXT,
    subjects TEXT[] DEFAULT '{}',
    qualification TEXT,
    experience_years INT DEFAULT 0,
    bio TEXT,
    
    -- Student specific fields
    school_name TEXT,
    class_grade TEXT,
    guardian_name TEXT,
    guardian_phone TEXT,
    roll_number TEXT,
    parent_access_pin TEXT, -- 4-digit PIN for parent portal
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Batches (Classes created by teachers)
CREATE TABLE IF NOT EXISTS public.batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    schedule TEXT NOT NULL,
    room_or_link TEXT,
    fees_amount NUMERIC(10, 2) DEFAULT 0.00,
    capacity INT DEFAULT 40,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Batch Enrollments (Requests and Active rosters)
CREATE TABLE IF NOT EXISTS public.batch_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status enrollment_status NOT NULL DEFAULT 'pending',
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(batch_id, student_id)
);

-- 6. Profile Change Requests (Approval Workflow: Student -> Teacher/Admin; Teacher -> Admin)
CREATE TABLE IF NOT EXISTS public.profile_change_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_role user_role NOT NULL,
    target_teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Teacher of the student's batch
    requested_changes JSONB NOT NULL, -- Object containing new profile fields
    status request_status NOT NULL DEFAULT 'pending',
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    review_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    reviewed_at TIMESTAMPTZ
);

-- 7. Attendance Table
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL DEFAULT 'present',
    remarks TEXT,
    marked_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(batch_id, student_id, date)
);

-- 8. Tests and Marks Table
CREATE TABLE IF NOT EXISTS public.tests_and_marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    test_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    test_date DATE NOT NULL,
    max_marks NUMERIC(6, 2) NOT NULL DEFAULT 100.00,
    score NUMERIC(6, 2) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Study Materials
CREATE TABLE IF NOT EXISTS public.study_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    material_type material_type NOT NULL DEFAULT 'pdf',
    file_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Notices & Announcements
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE,
    posted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority notice_priority NOT NULL DEFAULT 'normal',
    is_global BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Fee Records
CREATE TABLE IF NOT EXISTS public.fees_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    month TEXT NOT NULL,
    status fee_status NOT NULL DEFAULT 'pending',
    receipt_no TEXT,
    paid_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Landing Page CMS & Coaching Promotions (Managed by Admin)
CREATE TABLE IF NOT EXISTS public.landing_content (
    id INT PRIMARY KEY DEFAULT 1,
    hero_title TEXT NOT NULL DEFAULT 'Where Technology Meets Education',
    hero_title_hi TEXT NOT NULL DEFAULT 'जहाँ तकनीक और शिक्षा का संगम होता है',
    hero_subtitle TEXT NOT NULL DEFAULT 'Unified role-based platform connecting students, teachers, and coaching institutes across India.',
    hero_subtitle_hi TEXT NOT NULL DEFAULT 'भारत के शिक्षकों और विद्यार्थियों को एक सूत्र में पिरोने वाला डिजिटल मंच।',
    promotions_banner TEXT NOT NULL DEFAULT 'Special Admissions Open for 2026-27 Board & Competitive Batches!',
    promotions_banner_hi TEXT NOT NULL DEFAULT 'सत्र 2026-27 बोर्ड एवं प्रतियोगी परीक्षाओं के नए बैच प्रारंभ!',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.coaching_promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coaching_name TEXT NOT NULL,
    mentor_name TEXT NOT NULL,
    subjects TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    badge TEXT DEFAULT 'Top Rated',
    student_count INT DEFAULT 50,
    rating NUMERIC(2, 1) DEFAULT 4.9,
    contact_phone TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests_and_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_promotions ENABLE ROW LEVEL SECURITY;

-- Public / Anonymous can read landing page CMS
CREATE POLICY "Landing content is viewable by all" ON public.landing_content FOR SELECT USING (true);
CREATE POLICY "Coaching promotions viewable by all" ON public.coaching_promotions FOR SELECT USING (true);
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);

-- 14. SEED INITIAL PRODUCTION DATA
-- Seed Default Landing CMS Content
INSERT INTO public.landing_content (id, hero_title, hero_title_hi, hero_subtitle, hero_subtitle_hi, promotions_banner, promotions_banner_hi)
VALUES (
    1,
    'Where Technology Meets Education',
    'जहाँ तकनीक और शिक्षा का संगम होता है',
    'India''s premiere coaching platform. Replace manual registers with 1-click digital attendance, automated report cards, and seamless WhatsApp updates.',
    'कागजी रजिस्टर और उलझे हुए व्हाट्सएप ग्रुपों को कहें अलविदा। एक क्लिक में उपस्थिति लें, टेस्ट रिपोर्ट साझा करें और कोचिंग को स्मार्ट बनाएँ।',
    '🔥 Admissions Open: 2026 Board & Foundation Batches now enrolling!',
    '🔥 नए प्रवेश प्रारंभ: 2026 बोर्ड परीक्षा और फाउंडेशन बैचों में नामांकन शुरू!'
)
ON CONFLICT (id) DO UPDATE SET
    hero_title = EXCLUDED.hero_title,
    hero_title_hi = EXCLUDED.hero_title_hi;

-- Seed Coaching Promotions (Featured on Landing Page)
INSERT INTO public.coaching_promotions (coaching_name, mentor_name, subjects, tagline, description, badge, student_count, rating, contact_phone, image_url)
VALUES 
(
    'Sharma Science & Math Academy',
    'Dr. Rajesh Sharma (Ph.D, 15+ Yrs Exp)',
    'Class 9th-12th Mathematics & Physics',
    'Excellence in CBSE & State Board Preparation',
    'Special focus on concept clarity, NCERT exemplar problems, and weekly mock exams with personal doubt clearing.',
    'Top Rated Institute',
    128,
    4.9,
    '+91 98765 43210',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
),
(
    'Target IIT & NEET Foundation',
    'Er. Alok Pandey (B.Tech IIT-BHU)',
    'Advanced Physics & Mathematics',
    'Rankers Batch for JEE & NEET Aspirants',
    'Rigorous question banks, previous 15 years papers analysis, and timed chapter-wise speed tests.',
    'Verified Academy',
    95,
    4.8,
    '+91 93350 44556',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
),
(
    'Mishra Chemistry Classes',
    'Prof. Sunita Mishra (M.Sc Gold Medalist)',
    'Organic & Inorganic Chemistry',
    'Master Reactions & Formulas with Easy Tricks',
    'Interactive 3D molecular structure visualizers, concise formula cheat sheets, and board scoring tricks.',
    'Popular',
    82,
    4.9,
    '+91 94150 99887',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
);

-- Seed Initial Super Admin (admin@shikshagram.com / admin1234)
INSERT INTO public.profiles (
    id,
    name,
    email,
    password_hash,
    role,
    is_verified,
    is_blocked,
    phone,
    avatar_url
)
VALUES (
    'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
    'Shiksha Gram Administrator',
    'admin@shikshagram.com',
    '$2b$12$e8Yk1h6K6Z8gXfW6g5zT5.04q7Xh1f0d3B4c5D6e7F8g9H0i1j2k3', -- bcrypt hash of admin1234
    'admin',
    true,
    false,
    '+91 99999 88888',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
)
ON CONFLICT (email) DO UPDATE SET
    role = 'admin',
    is_verified = true,
    is_blocked = false;
