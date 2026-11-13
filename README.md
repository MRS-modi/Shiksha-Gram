# Shiksha Gram (शिक्षा ग्राम)
> *"Where Technology Meets Education"* • *"जहाँ तकनीक और शिक्षा का संगम होता है"*

A full-stack, Hindi-first coaching management web application designed for independent tutors, small coaching institutes, students, and parents across India.

---

## 🌟 Key Features

1. **Brand Identity & Reference UI/UX**
   - Designed based on the modern, rounded card layout with custom stats, attendance rings, weekly trend charts, pill tags, and sleek sidebar.
   - Integrated authentic **Shiksha Gram brand logos**: Horizontal banner logo, vertical badge, light & dark app icons, and monogram.

2. **Bilingual & Dual Theme**
   - **Language Toggle**: Full bilingual support with instant **Hindi (हिन्दी)** and **English** switching across all navigation, cards, tables, and actions.
   - **Theme Toggle**: Smooth **Dark Mode** and **Light Mode** persistence.

3. **Role-Based Workspaces**
   - **Teacher Workspace**:
     - *Overview*: Quick stats (students, batches, attendance %, pending dues), today's class schedule, pending enrollment requests, and quick action buttons.
     - *My Classes*: Horizontal batch selector, contextual sub-tabs (Student Roster with search/filter, Attendance marker, Performance, and Resources).
     - *Academics*: 1-click batch attendance ("Mark All Present"), test marks upload with auto-calculated grades (`A+`, `A`, `B`), coaching topper leaderboard, and **Weak Students Alert List** (&lt;75% attendance or failing scores) with 1-click WhatsApp alerts.
     - *Learning Hub*: Upload PDFs, Google Drive links, YouTube video lectures, and handwritten notes.
     - *Shiksha AI Doubt Helper*: Interactive AI doubt tutor explaining STEM questions step-by-step.
     - *Schedule & Fees*: Timetable grid and fee register (mark fees paid and generate receipt slips).
     - *Communication*: Post batch or platform notices with WhatsApp share integration.
   - **Student Workspace**:
     - *Overview*: 5-day study streak (🔥), circular attendance percentage gauge, upcoming tests, and recent test results.
     - *My Attendance*: Monthly calendar with green/red status dots and subject-wise breakdown.
     - *My Performance*: Marks over time and teacher feedback remarks.
     - *Learning Hub*: Downloadable lecture notes and interactive Ask Shiksha AI doubt widget.
     - *Leaderboard*: Coaching toppers board with student's rank highlighted.
     - *Notices & Batch*: Batch schedule, teacher contact, and classmates list.
   - **Parent View (Read-Only)**:
     - Secured by Student Roll Number and 4-digit PIN (default demo PIN: `4289`).
     - Live view of attendance %, latest test scores, and 1-click "Chat with Teacher on WhatsApp".
   - **Admin Console**:
     - Dedicated `/admin/login` page with secure credentials verification.
     - Platform oversight: Total users, active teachers, active students, pending verifications.
     - Teacher Verification: Review coaching details and 1-click Approve or Reject.
     - User Management: Search users and toggle account blocks.
     - Global Broadcast Notices to all users.

4. **Security & Supabase Integration**
   - PostgreSQL schema with Row Level Security (RLS) policies (`supabase/schema.sql`).
   - Trigger functions to auto-provision user profiles on auth signup.
   - Google OAuth 2.0 integration support.
   - Interactive CAPTCHA security challenge on login and registration.

---

## 🚀 Quick Start Guide

### 1. Run the Frontend (React + Vite + Tailwind CSS)

```bash
cd frontend
npm run dev
```

Open your browser at `http://localhost:5173`.

> **Note**: The frontend features a **Bottom Role Switcher Bar** that allows you to instantly preview Teacher, Student, Parent, and Admin views with one click, or jump to the Public Landing Page!

### 2. Run the Backend (Python FastAPI)

```bash
# From workspace root
.\venv\Scripts\activate
uvicorn backend.main:app --reload --port 8000
```

Open your browser at:
- API Root: `http://localhost:8000`
- Interactive Swagger API Docs: `http://localhost:8000/docs`
- ReDoc Docs: `http://localhost:8000/redoc`

---

## 🗄️ Setting Up Supabase & Google Auth

See the complete guide in [`supabase/setup_guide.md`](file:///c:/Projects/shiksha-gram/supabase/setup_guide.md):
1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and paste [`supabase/schema.sql`](file:///c:/Projects/shiksha-gram/supabase/schema.sql).
3. Enable Google OAuth under Authentication > Providers.
4. Copy your Project URL & Anon Key into `frontend/.env` and `backend/.env`.

---

## 🔑 Demo Login Credentials

| Role | Email | Password | PIN / Notes |
| :--- | :--- | :--- | :--- |
| **Teacher** | `teacher@shikshagram.com` | `teacher1234` | Dr. Rajesh Sharma |
| **Student** | `student@shikshagram.com` | `student1234` | Roll: `SG-2026-042`, PIN: `4289` |
| **Parent** | *(Use Parent Portal)* | — | Roll: `SG-2026-042`, PIN: `4289` |
| **Admin** | `admin@shikshagram.com` | `admin1234` | Dedicated `/admin/login` route |
