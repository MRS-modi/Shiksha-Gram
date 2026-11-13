import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Award, 
  Bot, 
  Flame, 
  Sparkles, 
  ExternalLink, 
  Download, 
  ChevronRight,
  BookOpen,
  Send,
  User,
  Shield,
  Edit3,
  AlertCircle,
  Share2,
  Check,
  X,
  Search,
  Filter,
  TrendingUp,
  ClipboardList,
  Radio,
  Users,
  Info,
  HelpCircle,
  CheckSquare,
  Lock,
  Sun,
  Moon,
  Globe,
  LogOut,
  MapPin,
  Phone,
  School,
  FileCheck2,
  CalendarCheck2,
  PieChart as PieIcon,
  Copy
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { getMockData } from '../../services/mockData';
import { WhatsAppShareModal } from '../../components/WhatsAppShareModal';

export const StudentWorkspace = ({ activeTab = 'overview', setActiveTab }) => {
  const { user, logout, submitProfileEdit } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const data = getMockData();

  // Find enrolled student profile
  const student = data.students.find(s => s.email === user?.email) || {
    id: user?.id || 'student-1',
    name: user?.name || 'Aman Verma',
    email: user?.email || 'student@shikshagram.com',
    rollNumber: user?.roll_number || 'SG-2026-042',
    phone: user?.phone || '+91 91234 56789',
    guardianPhone: user?.guardian_phone || '+91 98111 22334',
    guardianName: user?.guardian_name || 'Mr. R. K. Verma',
    schoolName: user?.school_name || "St. Joseph's College",
    classGrade: user?.class_grade || 'Class 10th',
    address: user?.address || 'Civil Lines, Prayagraj',
    batchId: 'batch-1',
    batchName: 'Class 10th - Board Mastery',
    attendanceRate: 92.5,
    lastScore: 94.0,
    parentPin: user?.parent_access_pin || '4289',
    avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    enrolledDate: '2026-08-15'
  };

  const myBatch = data.batches.find(b => b.id === student.batchId) || data.batches[0];
  const myClassmates = data.students.filter(s => s.batchId === student.batchId);
  const myMaterials = data.materials.filter(m => m.batchId === student.batchId || m.batchId === 'all');

  // Filter & Search states
  const [materialFilterSubject, setMaterialFilterSubject] = useState('all');
  const [materialSearchTerm, setMaterialSearchTerm] = useState('');

  // Daily Check-ins State
  const [checkins, setCheckins] = useState({
    attended: true,
    homework: true,
    doubtSolved: false,
    revisionDone: false
  });

  // Homework Assignments with Student Submission tracking
  const [assignments, setAssignments] = useState(() => {
    const local = localStorage.getItem('sg_student_assignments');
    if (local) {
      try { return JSON.parse(local); } catch (e) { }
    }
    const defaultList = data.assignments ? [...data.assignments] : [];
    return defaultList.map((asg, idx) => ({
      ...asg,
      studentStatus: idx === 0 ? 'submitted' : 'pending',
      submissionDate: idx === 0 ? '2026-11-12' : null,
      submittedScore: idx === 0 ? '24/25 (Grade A+)' : null,
      submissionLink: idx === 0 ? 'https://drive.google.com/open?id=demo_hw_aman' : ''
    }));
  });

  // Submit Assignment Modal State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAsgForSubmit, setSelectedAsgForSubmit] = useState(null);
  const [homeworkLink, setHomeworkLink] = useState('');
  const [homeworkNotes, setHomeworkNotes] = useState('');
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState('');

  // Profile Edit Request Form state
  const [editPhone, setEditPhone] = useState(student.phone);
  const [editGuardianPhone, setEditGuardianPhone] = useState(student.guardianPhone);
  const [editAddress, setEditAddress] = useState(student.address);
  const [requestStatus, setRequestStatus] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);

  // WhatsApp Share Modal State
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppData, setWhatsAppData] = useState({ title: '', text: '', phone: '' });

  // Interactive Monthly Calendar State
  const [selectedDayLog, setSelectedDayLog] = useState(null);
  const [showDayModal, setShowDayModal] = useState(false);

  // AI Doubt State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSolution, setAiSolution] = useState(null);

  // Tests & Academic Records
  const myTestScores = [
    { 
      name: 'Trigonometry & Heights Assessment', 
      subject: 'Mathematics', 
      score: 94, 
      max: 100, 
      pct: 94, 
      grade: 'A+', 
      date: '2026-11-05', 
      trend: '+2% vs last test', 
      remarks: 'Outstanding conceptual proofs and fast execution of identity transformations.' 
    },
    { 
      name: 'Chemical Reactions & Equations', 
      subject: 'Science (Chemistry)', 
      score: 46, 
      max: 50, 
      pct: 92, 
      grade: 'A+', 
      date: '2026-10-25', 
      trend: '+4% vs class average', 
      remarks: 'Accurate stoichiometric calculations and complete redox reactions explanation.' 
    },
    { 
      name: 'Algebraic Polynomials Quiz', 
      subject: 'Mathematics', 
      score: 48, 
      max: 50, 
      pct: 96, 
      grade: 'A+', 
      date: '2026-10-12', 
      trend: 'Batch High Score', 
      remarks: 'Clean step-by-step polynomial division and zero verification.' 
    },
    { 
      name: 'Physics Optics & Mirrors Test', 
      subject: 'Science (Physics)', 
      score: 42, 
      max: 50, 
      pct: 84, 
      grade: 'A', 
      date: '2026-09-28', 
      trend: '+12% improvement', 
      remarks: 'Neat concave mirror ray diagrams with correct sign conventions.' 
    },
  ];

  // Marks Progression Over Time
  const marksOverTime = [
    { test: 'Unit 1 (Optics)', studentScore: 84, classAvg: 72 },
    { test: 'Unit 2 (Polynomials)', studentScore: 96, classAvg: 75 },
    { test: 'Unit 3 (Reactions)', studentScore: 92, classAvg: 78 },
    { test: 'Unit 4 (Trigonometry)', studentScore: 94, classAvg: 80 },
  ];

  // Attendance Statistics
  const attendanceBreakdown = [
    { name: 'Present (22 Days)', value: 22, color: '#10b981' },
    { name: 'Absent (2 Days)', value: 2, color: '#f43f5e' },
  ];

  const subjectAttendanceList = [
    { subject: 'Mathematics', attended: 10, total: 10, rate: 100, teacher: myBatch.teacherName || 'Dr. Rajesh Sharma', status: 'Perfect' },
    { subject: 'Science (Physics)', attended: 8, total: 9, rate: 88.9, teacher: myBatch.teacherName || 'Dr. Rajesh Sharma', status: 'Good' },
    { subject: 'Chemistry Lab', attended: 4, total: 5, rate: 80.0, teacher: myBatch.teacherName || 'Dr. Rajesh Sharma', status: 'Regular' },
  ];

  const attendanceHistoryLog = [
    { date: '2026-11-13', day: 'Friday', subject: 'Mathematics', time: '4:30 PM - 6:00 PM', status: 'present', topic: 'Trigonometric Identities Exercise 8.4', remarks: 'On time, active participation' },
    { date: '2026-11-11', day: 'Wednesday', subject: 'Science / Physics', time: '4:30 PM - 6:00 PM', status: 'present', topic: 'Refraction through Glass Prism', remarks: 'Completed ray tracing in lab' },
    { date: '2026-11-09', day: 'Monday', subject: 'Mathematics', time: '4:30 PM - 6:00 PM', status: 'present', topic: 'Heights and Distances Angle of Elevation', remarks: 'Solved worksheet questions' },
    { date: '2026-11-06', day: 'Friday', subject: 'Chemistry Lab', time: '4:30 PM - 6:00 PM', status: 'absent', topic: 'Acid-Base Indicator Reactions', remarks: 'Medical leave informed by parent' },
    { date: '2026-11-04', day: 'Wednesday', subject: 'Science / Physics', time: '4:30 PM - 6:00 PM', status: 'present', topic: 'Lenses and Mirror Formula Numericals', remarks: 'On time' },
    { date: '2026-11-02', day: 'Monday', subject: 'Mathematics', time: '4:30 PM - 6:00 PM', status: 'present', topic: 'Trigonometry Ratios of Standard Angles', remarks: 'Accurate values memorized' },
    { date: '2026-10-30', day: 'Friday', subject: 'Science / Chemistry', time: '4:30 PM - 6:00 PM', status: 'present', topic: 'Chemical Equation Balancing Test', remarks: 'Full marks in quiz' },
    { date: '2026-10-28', day: 'Wednesday', subject: 'Mathematics', time: '4:30 PM - 6:00 PM', status: 'present', topic: 'Pythagorean Triplet Applications', remarks: 'On time' },
    { date: '2026-10-26', day: 'Monday', subject: 'Science / Physics', time: '4:30 PM - 6:00 PM', status: 'absent', topic: 'Light Reflection Laws Demonstration', remarks: 'Family function - notified' },
    { date: '2026-10-23', day: 'Friday', subject: 'Mathematics', time: '4:30 PM - 6:00 PM', status: 'present', topic: 'Chapter 7 Coordinate Geometry Revision', remarks: 'First to finish challenge problem' }
  ];

  // Handlers
  const handleAskAI = (sampleQuery) => {
    const q = sampleQuery || aiQuestion;
    if (!q || !q.trim()) return;

    setAiLoading(true);
    setAiQuestion(q);
    setTimeout(() => {
      if (lang === 'hi') {
        setAiSolution({
          question: q,
          explanation: `प्रश्न '${q}' का विस्तृत व सरल चरणबद्ध हल:`,
          steps: [
            "चरण 1: दी गई स्थिति में अज्ञात चर व मानों को रेखांकित करें।",
            "चरण 2: संबंधित मूल सूत्र sin²θ + cos²θ = 1 अथवा F = m × a लागू करें।",
            "चरण 3: दोनों पक्षों का मान रखकर सरलीकरण करें।"
          ],
          formula: "LHS = RHS सिद्ध हुआ। (Verified)",
          tip: "💡 बोर्ड परीक्षा टिप: हमेशा उत्तर के अंत में मात्रक (Units) और अंतिम निष्कर्ष बॉक्स में लिखें ताकि पूरे स्टेप मार्क्स मिलें।"
        });
      } else {
        setAiSolution({
          question: q,
          explanation: `Step-by-step structured walkthrough for "${q}":`,
          steps: [
            "Step 1: Identify given parameters and define target variables.",
            "Step 2: Apply the governing theorem (e.g. Pythagoras Theorem / Faraday's Law).",
            "Step 3: Substitute values and simplify systematically."
          ],
          formula: "LHS = RHS Verified.",
          tip: "💡 Board Exam Tip: Always state the theorem name at the beginning to secure full step-marking credit!"
        });
      }
      setAiLoading(false);
    }, 600);
  };

  const handleSubmitHomework = (e) => {
    e.preventDefault();
    if (!selectedAsgForSubmit) return;

    const updated = assignments.map(a => {
      if (a.id === selectedAsgForSubmit.id) {
        return {
          ...a,
          studentStatus: 'submitted',
          submissionDate: new Date().toISOString().split('T')[0],
          submissionLink: homeworkLink || 'https://drive.google.com/uploaded_work',
          submittedScore: 'Pending Evaluation'
        };
      }
      return a;
    });

    setAssignments(updated);
    localStorage.setItem('sg_student_assignments', JSON.stringify(updated));
    setShowSubmitModal(false);
    setSubmitSuccessNotice(lang === 'hi' ? 'गृहकार्य सफलतापूर्वक जमा कर दिया गया!' : 'Homework submitted successfully for teacher review!');
    setTimeout(() => setSubmitSuccessNotice(''), 4000);
  };

  const handleProfileUpdateRequest = async (e) => {
    e.preventDefault();
    setRequestLoading(true);

    const changes = {
      phone: editPhone,
      guardian_phone: editGuardianPhone,
      address: editAddress,
    };

    try {
      const res = await submitProfileEdit(changes);
      setRequestStatus(res.message || 'Profile edit submitted. Waiting for approval by your Teacher or Administrator.');
    } catch (err) {
      setRequestStatus('Profile edit submitted. Awaiting approval by your Teacher or Administrator.');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleShareParentLink = () => {
    const parentMsg = `🎓 *Shiksha Gram Student Portal Access*\nStudent: ${student.name} (Roll No: ${student.rollNumber})\nBatch: ${myBatch.name}\nAttendance: ${student.attendanceRate}%\nLatest Average Score: ${student.lastScore}% (Rank #1)\nParent Access PIN: *${student.parentPin}*\n\nView daily attendance, test scorecards, and teacher announcements securely at: https://shikshagram.com/parent?pin=${student.parentPin}\n\n- ${myBatch.teacherName || 'Dr. Rajesh Sharma'}`;

    setWhatsAppData({
      title: lang === 'hi' ? 'अभिभावक पोर्टल लिंक व्हाट्सएप पर साझा करें' : 'Share Parent Portal Access on WhatsApp',
      text: parentMsg,
      phone: student.guardianPhone
    });
    setShowWhatsAppModal(true);
  };

  return (
    <div className="space-y-6">
      
      {/* 3.1 OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Top Banner matching Coursue aesthetic */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-brand-700 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>{lang === 'hi' ? '5 दिन की लगातार स्ट्रीक 🔥' : '5-Day Study Streak 🔥'}</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                {lang === 'hi' ? `नमस्ते, ${student.name}! 🚀` : `Keep Learning, ${student.name}! 🚀`}
              </h2>
              
              <p className="mt-2 text-white/90 text-xs sm:text-sm leading-relaxed">
                {lang === 'hi'
                  ? `आप ${myBatch.name} में नामांकित हैं। आपकी वर्तमान उपस्थिति ${student.attendanceRate}% और औसत स्कोर ${student.lastScore}% (रैंक #1) है!`
                  : `Enrolled in ${myBatch.name}. You have an impressive ${student.attendanceRate}% attendance and 94% average score!`}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setActiveTab('learning')}
                  className="px-4 py-2 rounded-xl bg-white text-emerald-800 hover:bg-slate-100 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Bot className="w-4 h-4 text-emerald-600" />
                  <span>{t('askAi')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('performance')}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>{lang === 'hi' ? 'अंक व रिजल्ट' : 'View Scores'}</span>
                </button>

                <button
                  onClick={handleShareParentLink}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-1.5"
                >
                  <Shield className="w-4 h-4 text-white" />
                  <span>{lang === 'hi' ? 'अभिभावक लिंक भेजें' : 'Parent PIN: ' + student.parentPin}</span>
                </button>
              </div>
            </div>

            <div className="absolute right-6 bottom-4 opacity-15 hidden md:block pointer-events-none">
              <img src="/logo-icon-light.png" alt="Shiksha Gram" className="w-52 h-52 object-contain" />
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Attendance Circular Progress Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray={`${student.attendanceRate}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-black text-slate-800 dark:text-white">
                  {Math.round(student.attendanceRate)}%
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">{t('attendanceRate')}</p>
                <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Regular</h4>
                <span className="text-[10px] text-slate-400">22 of 24 attended</span>
              </div>
            </div>

            {/* Batch Rank Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">{lang === 'hi' ? 'बैच रैंक' : 'Batch Rank'}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">#1 Topper</h3>
                <span className="text-[10px] text-amber-500 font-medium">94.0% Average</span>
              </div>
            </div>

            {/* Upcoming Test Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">{t('upcomingTests')}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">Sunday</h3>
                <span className="text-[10px] text-brand-600 dark:text-brand-400 font-medium">Full Mock Test (9 AM)</span>
              </div>
            </div>

            {/* Parent Access PIN Card with 1-Click WhatsApp Share */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold">{lang === 'hi' ? 'अभिभावक पिन' : 'Parent Access PIN'}</p>
                  <h3 className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white mt-0.5">{student.parentPin}</h3>
                  <span className="text-[10px] text-slate-400">Read-only link</span>
                </div>
              </div>

              <button
                onClick={handleShareParentLink}
                className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                title="Share Access Link on WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Study Streaks, Weekly Goals & Quick Daily Check-in */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Columns: Weekly Streak & Learning Goal */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-500 animate-bounce" />
                    <span>{lang === 'hi' ? 'साप्ताहिक अध्ययन लक्ष्य व स्ट्रीक' : 'Weekly Study Goals & Streak'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'hi' ? 'दैनिक उपस्थिति व अभ्यास से लक्ष्य पूरा करें' : 'Target: 20 hours/week • 16 hours completed'}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  80% Completed
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full" style={{ width: '80%' }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                  <span>16 hrs logged</span>
                  <span>Goal: 20 hrs</span>
                </div>
              </div>

              {/* 7-Day Visual Streak Tracker */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  This Week Attendance & Streak
                </span>
                <div className="grid grid-cols-7 gap-2 text-center text-xs">
                  {[
                    { day: 'Mon', attended: true },
                    { day: 'Tue', attended: true },
                    { day: 'Wed', attended: true },
                    { day: 'Thu', attended: true },
                    { day: 'Fri', attended: true },
                    { day: 'Sat', attended: false, today: true },
                    { day: 'Sun', attended: false }
                  ].map((s, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 ${
                        s.attended 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold'
                          : s.today
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold">{s.day}</span>
                      {s.attended ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : s.today ? (
                        <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 block" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Daily Quick Check-Ins */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarCheck2 className="w-4 h-4 text-brand-600" />
                <span>{lang === 'hi' ? 'दैनिक चेक-इन' : 'Daily Quick Check-Ins'}</span>
              </h3>
              <p className="text-xs text-slate-400">Track daily habits for extra streak points</p>

              <div className="space-y-2.5 text-xs">
                <div
                  onClick={() => setCheckins(prev => ({ ...prev, attended: !prev.attended }))}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    checkins.attended ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-100">Attended coaching class today</span>
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${checkins.attended ? 'bg-emerald-600 text-white' : 'border border-slate-300'}`}>
                    {checkins.attended && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <div
                  onClick={() => setCheckins(prev => ({ ...prev, homework: !prev.homework }))}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    checkins.homework ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-100">Completed homework questions</span>
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${checkins.homework ? 'bg-emerald-600 text-white' : 'border border-slate-300'}`}>
                    {checkins.homework && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <div
                  onClick={() => setCheckins(prev => ({ ...prev, doubtSolved: !prev.doubtSolved }))}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    checkins.doubtSolved ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-100">Cleared STEM doubts with AI Tutor</span>
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${checkins.doubtSolved ? 'bg-emerald-600 text-white' : 'border border-slate-300'}`}>
                    {checkins.doubtSolved && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Performance & Materials Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7: Test Scores */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {lang === 'hi' ? 'हालिया टेस्ट स्कोर व ग्रेड' : 'Recent Test Scores & Grades'}
                </h3>
                <button
                  onClick={() => setActiveTab('performance')}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  View Full History
                </button>
              </div>

              <div className="space-y-3">
                {myTestScores.slice(0, 3).map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{t.remarks} • {t.date}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                        {t.grade}
                      </span>
                      <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                        {t.score}/{t.max}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5: Latest Notes & Announcements */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('studyMaterials')}
                  </h3>
                  <button
                    onClick={() => setActiveTab('learning')}
                    className="text-xs font-semibold text-brand-600 hover:underline"
                  >
                    View All ({myMaterials.length})
                  </button>
                </div>

                <div className="space-y-2.5">
                  {myMaterials.slice(0, 2).map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between"
                    >
                      <div className="truncate pr-2">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{m.title}</p>
                        <p className="text-[10px] text-slate-400">{m.subject} • {m.type.toUpperCase()}</p>
                      </div>
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Notice */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                    Urgent Notice
                  </span>
                  <span className="text-[10px] text-slate-400">Today</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white pt-1">
                  Special Sunday 3-Hour Mock Test
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Full syllabus mock test will be conducted this Sunday from 9:00 AM to 12:00 PM. Admittance cards are mandatory.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 3.2 MY ATTENDANCE TAB */}
      {activeTab === 'attendance' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'मेरी उपस्थिति डायरी एवं कैलेंडर' : 'Attendance Diary & Calendar'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hi' ? 'मासिक उपस्थिति रिकॉर्ड, पाई-चार्ट व विषय-वार विवरण' : 'Monthly breakdown, present/absent ratios, and verified teacher check-ins'}
              </p>
            </div>

            <button
              onClick={() => {
                const msg = `📊 *Shiksha Gram Attendance Record*\nStudent: ${student.name} (${student.rollNumber})\nBatch: ${myBatch.name}\nAttendance Rate: *${student.attendanceRate}%*\nTotal Attended: 22 / 24 classes\nParent Access PIN: ${student.parentPin}\n\n- Sharma Science & Math Academy`;
                setWhatsAppData({
                  title: 'Share Attendance Record on WhatsApp',
                  text: msg,
                  phone: student.guardianPhone
                });
                setShowWhatsAppModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'अभिभावक को भेजें' : 'Share Attendance Slip'}</span>
            </button>
          </div>

          {/* Top 3 Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300">
              <span className="text-xs font-bold uppercase tracking-wider">Present Classes</span>
              <h3 className="text-3xl font-extrabold mt-1">22</h3>
              <p className="text-xs mt-1 text-emerald-600 dark:text-emerald-400">On-time classroom attendance</p>
            </div>

            <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300">
              <span className="text-xs font-bold uppercase tracking-wider">Absent Classes</span>
              <h3 className="text-3xl font-extrabold mt-1">2</h3>
              <p className="text-xs mt-1 text-rose-600 dark:text-rose-400">Informed leaves with parent note</p>
            </div>

            <div className="p-6 rounded-3xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 text-brand-800 dark:text-brand-300">
              <span className="text-xs font-bold uppercase tracking-wider">Overall Rate</span>
              <h3 className="text-3xl font-extrabold mt-1">{student.attendanceRate}%</h3>
              <p className="text-xs mt-1 text-brand-600 dark:text-brand-400">Safe zone (&gt;75% required for exam)</p>
            </div>
          </div>

          {/* Visual Pie Chart & Subject-Wise Attendance Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 5: Present/Absent Pie Chart */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-brand-600" />
                <span>{lang === 'hi' ? 'उपस्थिति अनुपात (Pie Chart)' : 'Attendance Ratio Chart'}</span>
              </h3>

              <div className="h-52 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {attendanceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold">
                  <span>Present: 22 (91.7%)</span>
                </div>
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold">
                  <span>Absent: 2 (8.3%)</span>
                </div>
              </div>
            </div>

            {/* Right 7: Subject-Wise Attendance Table */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'विषय-वार उपस्थिति तालिका' : 'Subject-Wise Attendance Breakdown'}
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="pb-3 pl-2">Subject</th>
                      <th className="pb-3">Attended</th>
                      <th className="pb-3">Percentage</th>
                      <th className="pb-3">Teacher</th>
                      <th className="pb-3 text-right pr-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {subjectAttendanceList.map((sub, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 pl-2 font-bold text-slate-800 dark:text-slate-100">{sub.subject}</td>
                        <td className="py-3.5 font-mono text-slate-600 dark:text-slate-300">{sub.attended} / {sub.total}</td>
                        <td className="py-3.5 font-mono font-bold text-emerald-600">{sub.rate}%</td>
                        <td className="py-3.5 text-slate-500">{sub.teacher}</td>
                        <td className="py-3.5 text-right pr-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Monthly Interactive Calendar */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'नवंबर 2026 उपस्थिति कैलेंडर (क्लिक करके विवरण देखें)' : 'November 2026 Attendance Calendar (Click Day for Details)'}
              </h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Present</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Absent</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Sunday</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="font-bold text-slate-400 py-1 uppercase text-[10px]">{day}</div>
              ))}

              {Array.from({ length: 30 }, (_, i) => {
                const dayNum = i + 1;
                const isAbsent = dayNum === 6 || dayNum === 26;
                const isSunday = (dayNum % 7 === 0);
                const isFuture = dayNum > 13;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => {
                      if (!isFuture && !isSunday) {
                        setSelectedDayLog({
                          date: `2026-11-${dayNum < 10 ? '0' + dayNum : dayNum}`,
                          dayNum,
                          status: isAbsent ? 'absent' : 'present',
                          subject: dayNum % 2 === 0 ? 'Mathematics' : 'Science / Physics',
                          topic: isAbsent ? 'Absent due to informed illness' : 'NCERT Chapter 8 Trigonometry & Numerical practice',
                          teacher: myBatch.teacherName || 'Dr. Rajesh Sharma'
                        });
                        setShowDayModal(true);
                      }
                    }}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${
                      isFuture
                        ? 'border-slate-100 dark:border-slate-800/40 text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 cursor-default'
                        : isSunday
                        ? 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
                        : isAbsent
                        ? 'border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-600 font-bold hover:scale-105'
                        : 'border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-bold hover:scale-105 shadow-sm'
                    }`}
                  >
                    <span className="font-mono text-xs">{dayNum}</span>
                    <span className="text-[9px]">
                      {isFuture ? '—' : isSunday ? 'Holiday' : isAbsent ? 'Absent' : 'Present'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Chronological Attendance Sessions Log */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'दैनिक उपस्थिति इतिहास (Attendance Log)' : 'Verified Daily Attendance History'}
            </h3>

            <div className="space-y-2">
              {attendanceHistoryLog.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${log.status === 'present' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{log.subject}</span>
                      <span className="text-[11px] text-slate-400 ml-2">({log.date} • {log.day})</span>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{log.topic}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="text-[11px] text-slate-400 italic">{log.remarks}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      log.status === 'present'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 3.3 MY PERFORMANCE TAB */}
      {activeTab === 'performance' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'अकादमिक प्रदर्शन व टेस्ट रिपोर्ट' : 'Academic Performance & Test Analytics'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hi' ? 'समय के साथ विषय-वार प्रगति, टेस्ट स्कोर व शिक्षक रिमार्क्स' : 'Marks progression over time, comparative analysis, and teacher feedback'}
              </p>
            </div>

            <button
              onClick={() => {
                const reportMsg = `📝 *Shiksha Gram Academic Performance Report*\nStudent: ${student.name} (Roll: ${student.rollNumber})\nBatch: ${myBatch.name}\nBatch Rank: #1 Topper 🏆\nAverage Score: 94.0%\nLatest Test: Trigonometry & Heights Assessment (94/100, Grade A+)\nTeacher Remarks: Outstanding conceptual proofs!\n\nVerified by: Sharma Science & Math Academy`;
                setWhatsAppData({
                  title: 'Share Scorecard on WhatsApp',
                  text: reportMsg,
                  phone: student.guardianPhone
                });
                setShowWhatsAppModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'व्हाट्सएप पर रिजल्ट भेजें' : 'Share Scorecard Slip'}</span>
            </button>
          </div>

          {/* Highlights Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">Highest Score</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">96%</h3>
                <span className="text-[10px] text-amber-500 font-semibold">Polynomials Chapter Test</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">Current Grade</p>
                <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">Grade A+</h3>
                <span className="text-[10px] text-emerald-600 font-semibold">Distinction Candidate</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">Batch Percentile</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">Top 3%</h3>
                <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold">Above 97% of students</span>
              </div>
            </div>
          </div>

          {/* Marks Progression Over Time Chart (Recharts) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-600" />
                  <span>{lang === 'hi' ? 'टेस्ट-वार अंक प्रगति ग्राफ़ (Marks Over Time)' : 'Marks Progression Over Time vs Class Average'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Tracking performance across Unit Assessments</p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-600" /> Your Score</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Class Average</span>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marksOverTime} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="test" tick={{ fontSize: 11 }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="studentScore" name="Your Score" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="classAvg" name="Class Average" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Test Scorecards Grid */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'नवीनतम टेस्ट रिपोर्ट व शिक्षक रिमार्क्स' : 'Detailed Test Scorecards & Teacher Remarks'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTestScores.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                        Grade {t.grade}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{t.date}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{t.name}</h4>
                    <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold mt-0.5">{t.subject}</p>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">{t.score}</span>
                      <span className="text-sm text-slate-400 font-mono">/ {t.max} ({t.pct}%)</span>
                      <span className="ml-auto text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                        {t.trend}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong className="text-slate-800 dark:text-slate-100">Teacher Remarks:</strong> {t.remarks}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 3.4 LEARNING HUB TAB */}
      {activeTab === 'learning' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {t('studyMaterials')} & Homework
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hi' ? 'बैच नोट्स, पीडीएफ, गृहकार्य व 24x7 शिखा एआई ट्यूटर' : 'Read-only materials filtered for your batch, active homework, and instant doubt solver'}
              </p>
            </div>
          </div>

          {submitSuccessNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{submitSuccessNotice}</span>
            </div>
          )}

          {/* AI Doubt Assistant Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-brand-500/40 shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-600 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{t('aiDoubts')} (Shiksha AI)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-600">Hindi / English STEM</span>
                </h3>
                <p className="text-xs text-slate-400">Ask any equation, derivation, or NCERT concept</p>
              </div>
            </div>

            <div className="space-y-2">
              <textarea
                rows={2}
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Type your question (e.g. Derive quadratic formula or explain Snell's Law)..."
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAskAI('Prove that root 5 is an irrational number by contradiction method')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  >
                    √5 Irrational Proof
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAskAI('Derive mirror formula 1/f = 1/v + 1/u with sign convention')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  >
                    Mirror Formula
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAskAI('Explain Faraday Law of Electromagnetic Induction')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  >
                    Faraday Law
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleAskAI(aiQuestion)}
                  disabled={aiLoading || !aiQuestion.trim()}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{aiLoading ? 'Thinking...' : t('solveBtn')}</span>
                </button>
              </div>
            </div>

            {aiSolution && (
              <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-3 animate-in fade-in">
                <h4 className="text-xs font-bold text-brand-700 dark:text-brand-300">{aiSolution.explanation}</h4>
                <div className="space-y-1.5 pl-2 text-xs text-slate-700 dark:text-slate-300">
                  {aiSolution.steps.map((st, i) => (
                    <p key={i} className="leading-relaxed font-medium">{st}</p>
                  ))}
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-emerald-600">
                  {aiSolution.formula}
                </div>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">{aiSolution.tip}</p>
              </div>
            )}
          </div>

          {/* Homework & Assignments Section */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-brand-600" />
              <span>{lang === 'hi' ? 'गृहकार्य व असाइनमेंट स्थिति' : 'Homework Assignments & Submissions'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map((asg) => {
                const isSubmitted = asg.studentStatus === 'submitted';
                return (
                  <div
                    key={asg.id}
                    className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-brand-600 uppercase">
                          {asg.subject}
                        </span>
                        <span className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Due: {asg.dueDate}</span>
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{asg.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">{asg.batchName} • Max: {asg.maxMarks} marks</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {asg.instructions}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        {isSubmitted ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Submitted on time ({asg.submittedScore || 'Pending Evaluation'})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending Submission</span>
                          </span>
                        )}
                      </div>

                      {!isSubmitted && (
                        <button
                          onClick={() => {
                            setSelectedAsgForSubmit(asg);
                            setHomeworkLink('');
                            setHomeworkNotes('');
                            setShowSubmitModal(true);
                          }}
                          className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
                        >
                          Submit Work
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Batch Materials Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-600" />
                <span>{lang === 'hi' ? 'बैच अध्ययन सामग्री (Read-Only)' : 'Batch Study Notes & References (Read-Only)'}</span>
              </h3>

              <div className="flex items-center gap-2">
                <select
                  value={materialFilterSubject}
                  onChange={(e) => setMaterialFilterSubject(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 font-semibold"
                >
                  <option value="all">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Science">Science</option>
                </select>

                <div className="relative w-44 sm:w-52">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={materialSearchTerm}
                    onChange={(e) => setMaterialSearchTerm(e.target.value)}
                    placeholder="Search notes..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myMaterials
                .filter(m => materialFilterSubject === 'all' || m.subject.toLowerCase().includes(materialFilterSubject.toLowerCase()))
                .filter(m => m.title.toLowerCase().includes(materialSearchTerm.toLowerCase()) || m.description?.toLowerCase().includes(materialSearchTerm.toLowerCase()))
                .map((m) => (
                  <div
                    key={m.id}
                    className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-brand-600 uppercase">
                          {m.type}
                        </span>
                        <span className="text-[10px] text-slate-400">{m.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{m.title}</h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">{m.subject}</p>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{m.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                      >
                        <span>Open & Read</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => {
                          const msg = `📚 *Study Material*\nTitle: ${m.title}\nSubject: ${m.subject}\nLink: ${m.url}\n\n- Shiksha Gram Student Portal`;
                          setWhatsAppData({
                            title: 'Share Material Link',
                            text: msg,
                            phone: ''
                          });
                          setShowWhatsAppModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                        title="Share on WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>
      )}

      {/* 3.5 ACADEMIC & LEADERBOARD TAB */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'बैच रैंकिंग, टॉपर बोर्ड व अंकतालिका' : 'Coaching Leaderboard & Academic Report'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hi' ? 'कोचिंग के शीर्ष छात्र, बैच रैंकिंग में आपका स्थान व आधिकारिक रिपोर्ट' : 'Institute rankings with your position highlighted and subject-wise grades'}
              </p>
            </div>

            <button
              onClick={() => {
                const markMsg = `🏆 *Shiksha Gram Marksheet & Report Card*\nStudent: ${student.name} (Roll: ${student.rollNumber})\nBatch: ${myBatch.name}\nOverall Grade: A+ (94.0%)\nRank: #1 Batch Topper\nAttendance: 92.5%\n\nVerified by: ${myBatch.teacherName || 'Dr. Rajesh Sharma'}\nSharma Science & Math Academy`;
                setWhatsAppData({
                  title: 'Send Official Marksheet on WhatsApp',
                  text: markMsg,
                  phone: student.guardianPhone
                });
                setShowWhatsAppModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Marksheet on WhatsApp</span>
            </button>
          </div>

          {/* Top Podium Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/20 text-white uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Batch Rank #1 — Topper Spotlight</span>
              </span>
              <h3 className="text-2xl font-black mt-2">Aman Verma (You)</h3>
              <p className="text-xs text-white/90">Class 10th - Board Mastery • 94.0% Average Score</p>
            </div>
            <div className="text-5xl shrink-0">🏆</div>
          </div>

          {/* Coaching Toppers Board Podium (1st, 2nd, 3rd) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-5 rounded-3xl shadow-md ring-4 ring-amber-400/30">
              <span className="text-lg font-black">🥇 1st Rank (You)</span>
              <h4 className="text-base font-extrabold mt-1">{student.name}</h4>
              <p className="text-xs text-white/80">{myBatch.name}</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black">94.0%</span>
                <span className="text-xs text-white/80">Average Score</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-400 to-slate-500 text-white p-5 rounded-3xl shadow-md">
              <span className="text-lg font-black">🥈 2nd Rank</span>
              <h4 className="text-base font-extrabold mt-1">Sneha Patel</h4>
              <p className="text-xs text-white/80">Class 12th - Physics Foundation</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black">92.0%</span>
                <span className="text-xs text-white/80">Average Score</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-700 to-amber-800 text-white p-5 rounded-3xl shadow-md">
              <span className="text-lg font-black">🥉 3rd Rank</span>
              <h4 className="text-base font-extrabold mt-1">Priya Sharma</h4>
              <p className="text-xs text-white/80">Class 10th - Board Mastery</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black">89.5%</span>
                <span className="text-xs text-white/80">Average Score</span>
              </div>
            </div>
          </div>

          {/* Per-Batch Leaderboard with Student's Own Rank Highlighted */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {myBatch.name} — Classmates Leaderboard
            </h4>

            <div className="space-y-2.5">
              {myClassmates
                .sort((a,b) => (b.lastScore || 0) - (a.lastScore || 0))
                .map((cm, idx) => {
                  const isMe = cm.id === student.id || cm.email === student.email;
                  return (
                    <div
                      key={cm.id}
                      className={`p-4 rounded-2xl flex items-center justify-between text-xs transition-all ${
                        isMe
                          ? 'bg-gradient-to-r from-indigo-50 to-amber-50/60 dark:from-indigo-950/60 dark:to-amber-950/40 border-2 border-brand-500 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                          idx === 0 ? 'bg-amber-500 text-white' : idx === 1 ? 'bg-slate-400 text-white' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          #{idx + 1}
                        </span>

                        <img src={cm.avatar} alt={cm.name} className="w-8 h-8 rounded-full object-cover" />

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">{cm.name}</span>
                            {isMe && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-brand-600 text-white">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400">{cm.rollNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold hidden sm:inline">
                          Att: {cm.attendanceRate}%
                        </span>
                        <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                          {cm.lastScore}%
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Official Academic Report Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center">
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {lang === 'hi' ? 'आधिकारिक अकादमिक रिपोर्ट कार्ड (Marksheet)' : 'Official Academic Term Scorecard'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Term 1 Assessment Report • Sharma Science & Math Academy</p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Grade A+ Distinction
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="pb-3 pl-2">Subject</th>
                    <th className="pb-3">Tests Taken</th>
                    <th className="pb-3">Score %</th>
                    <th className="pb-3">Grade</th>
                    <th className="pb-3 pr-2">Teacher Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {academicReportSubjects.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 pl-2 font-bold text-slate-800 dark:text-slate-100">{r.subject}</td>
                      <td className="py-3.5 font-mono text-slate-600 dark:text-slate-300">{r.testsTaken} tests</td>
                      <td className="py-3.5 font-mono font-bold text-emerald-600">{r.scorePct}%</td>
                      <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">{r.grade}</td>
                      <td className="py-3.5 pr-2 text-slate-500 dark:text-slate-400 italic">{r.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 3.6 NOTICES & MY BATCH TAB */}
      {activeTab === 'notices' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'शिक्षक सूचनाएं व मेरे बैच का विवरण' : 'Teacher Announcements & My Batch'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'hi' ? 'बैच समय सारिणी, शिक्षक प्रोफ़ाइल व सहपाठियों की सूची' : 'Date-stamped teacher notices, classroom details, and classmate directory'}
            </p>
          </div>

          {/* Batch Details Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {myBatch.subject}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {myBatch.name}
                </h3>
              </div>

              <div className="text-xs text-slate-500 font-semibold">
                Classroom: <strong className="text-slate-800 dark:text-slate-200">{myBatch.room}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Batch Schedule</span>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{myBatch.schedule}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Teacher & Mentor</span>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{myBatch.teacherName || 'Dr. Rajesh Sharma'}</p>
                <p className="text-[11px] text-slate-400">Ph.D in Mathematics, M.Sc, B.Ed</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Academy</span>
                <p className="font-semibold text-slate-800 dark:text-slate-100">Sharma Science & Math Academy</p>
                <p className="text-[11px] text-slate-400">Civil Lines, Prayagraj</p>
              </div>
            </div>
          </div>

          {/* Date-Stamped Announcements List */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-brand-600" />
              <span>{lang === 'hi' ? 'अध्यापक घोषणाएं व अलर्ट' : 'Date-Stamped Teacher Announcements'}</span>
            </h3>

            {data.notices.map((n) => (
              <div
                key={n.id}
                className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border ${
                  n.priority === 'urgent'
                    ? 'border-rose-200 dark:border-rose-900 shadow-rose-500/5'
                    : 'border-slate-100 dark:border-slate-800'
                } shadow-sm space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      n.priority === 'urgent'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-indigo-50 text-brand-600 dark:bg-indigo-950 dark:text-brand-300'
                    }`}>
                      {n.priority}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">• {n.batchName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white pt-1">{n.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.content}</p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">By: {n.author}</span>

                  <button
                    onClick={() => {
                      const msg = `📢 *Shiksha Gram Announcement*\n*${n.title}*\n${n.content}\n\n- ${n.author}`;
                      setWhatsAppData({
                        title: 'Share Announcement',
                        text: msg,
                        phone: ''
                      });
                      setShowWhatsAppModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Classmates Directory */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-600" />
              <span>{lang === 'hi' ? 'बैच के सहपाठी (Classmates)' : 'Batch Classmates Directory'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {myClassmates.map((cm) => (
                <div
                  key={cm.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3"
                >
                  <img src={cm.avatar} alt={cm.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="truncate">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {cm.name} {cm.id === student.id && <span className="text-brand-600 font-normal">(You)</span>}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-mono">{cm.rollNumber}</p>
                    <p className="text-[10px] text-slate-500">Enrolled: {cm.enrolledDate || '2026-08-15'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 3.7 SETTINGS & PROFILE TAB */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
          
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'छात्र प्रोफ़ाइल एवं सुरक्षा सेटिंग्स' : 'Student Profile & Security Settings'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'hi'
                  ? 'सुरक्षा नियम: प्रोफ़ाइल संपादन अनुरोध आपके शिक्षक या व्यवस्थापक द्वारा अनुमोदित होने के बाद ही लागू होगा।'
                  : 'Security Policy: Profile edits are submitted for review and will be applied once verified by your Teacher or Administrator.'}
              </p>
            </div>

            {requestStatus && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{requestStatus}</span>
              </div>
            )}

            <form onSubmit={handleProfileUpdateRequest} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Student Full Name (Verified)</label>
                  <input type="text" disabled value={student.name} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 cursor-not-allowed" />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Roll Number</label>
                  <input type="text" disabled value={student.rollNumber} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-800 dark:text-slate-200 cursor-not-allowed" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Registered Email</label>
                  <input type="text" disabled value={student.email} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300 cursor-not-allowed" />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Enrolled Batch</label>
                  <input type="text" disabled value={myBatch.name} className="w-full p-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 cursor-not-allowed" />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Student Mobile Phone</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Guardian Phone (WhatsApp)</label>
                <input
                  type="text"
                  value={editGuardianPhone}
                  onChange={(e) => setEditGuardianPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">City Address</label>
                <textarea
                  rows={2}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              {/* Parent Access PIN Card */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-brand-600" />
                      <span>Parent Portal Access PIN</span>
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Read-only link for parents to monitor attendance & scores</p>
                  </div>
                  <span className="font-mono text-base font-black text-brand-600">{student.parentPin}</span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleShareParentLink}
                    className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share PIN & Portal Link on WhatsApp</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={requestLoading}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Edit3 className="w-4 h-4" />
                <span>{requestLoading ? 'Submitting Request...' : t('requestProfileChange')}</span>
              </button>
            </form>
          </div>

          {/* Account Preferences (Theme, Language, Logout) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Account Preferences</h4>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
              <button
                onClick={toggleLanguage}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 font-semibold"
              >
                <Globe className="w-4 h-4 text-brand-600" />
                <span>Language: {lang === 'hi' ? 'हिंदी (सक्रिय)' : 'English (Active)'}</span>
              </button>

              <button
                onClick={toggleTheme}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 font-semibold"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
                <span>Theme: {isDark ? 'Dark Mode' : 'Light Mode'}</span>
              </button>

              <button
                onClick={logout}
                className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100 flex items-center justify-center gap-2 font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SUBMIT ASSIGNMENT MODAL */}
      {showSubmitModal && selectedAsgForSubmit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {lang === 'hi' ? 'गृहकार्य जमा करें' : 'Submit Homework Solution'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedAsgForSubmit.title}</p>
              </div>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitHomework} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Google Drive or Document Link</label>
                <input
                  type="url"
                  required
                  value={homeworkLink}
                  onChange={(e) => setHomeworkLink(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
                <span className="text-[10px] text-slate-400">Ensure the link sharing permission is set to "Anyone with link"</span>
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes for Teacher (Optional)</label>
                <textarea
                  rows={3}
                  value={homeworkNotes}
                  onChange={(e) => setHomeworkNotes(e.target.value)}
                  placeholder="e.g. Solved all 10 questions from Exercise 8.4 on loose sheets..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  Submit for Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CALENDAR DAY DETAILS MODAL */}
      {showDayModal && selectedDayLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedDayLog.date} Attendance Detail
              </h4>
              <button onClick={() => setShowDayModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  selectedDayLog.status === 'present' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {selectedDayLog.status}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Subject:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedDayLog.subject}</p>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Topic Covered:</span>
                <p className="text-slate-600 dark:text-slate-300">{selectedDayLog.topic}</p>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Verified By:</span>
                <p className="text-slate-600 dark:text-slate-300 font-semibold">{selectedDayLog.teacher}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDayModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP SHARE MODAL */}
      <WhatsAppShareModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        title={whatsAppData.title}
        defaultText={whatsAppData.text}
        targetPhone={whatsAppData.phone}
      />

    </div>
  );
};
