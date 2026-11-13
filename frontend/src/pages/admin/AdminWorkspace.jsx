import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  FolderGit2, 
  Radio, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Plus, 
  Send, 
  Lock, 
  Unlock, 
  Trash2, 
  Building, 
  Phone, 
  Edit, 
  Sparkles, 
  LayoutTemplate, 
  UserPlus,
  LogOut,
  Filter,
  UserX,
  Clock,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { getMockData, saveMockNotices } from '../../services/mockData';

export const AdminWorkspace = ({ activeTab = 'dashboard', setActiveTab }) => {
  const { user, logout } = useAuth();
  const { lang, t } = useLanguage();
  const data = getMockData();

  // Statistics
  const [stats, setStats] = useState({
    total_users: 28,
    total_teachers: 4,
    total_students: 24,
    total_admins: 1,
    pending_teacher_approvals: 2,
    pending_profile_requests: 1,
    active_batches: 3,
  });

  // 1. Pending Teacher Approvals
  const [pendingTeachers, setPendingTeachers] = useState([
    {
      id: 'pt-1',
      name: 'Prof. Sunita Mishra',
      email: 'sunita.mishra@example.com',
      phone: '+91 94150 99887',
      coaching_name: 'Mishra Chemistry Classes',
      subjects: ['Chemistry'],
      qualification: 'M.Sc Chemistry Gold Medalist',
      experience_years: 12,
      address: 'George Town, Prayagraj',
      applied_at: '2026-11-10'
    },
    {
      id: 'pt-2',
      name: 'Er. Alok Pandey',
      email: 'alok.pandey@example.com',
      phone: '+91 93350 44556',
      coaching_name: 'Target IIT & NEET Academy',
      subjects: ['Physics', 'Mathematics'],
      qualification: 'B.Tech IIT-BHU',
      experience_years: 8,
      address: 'Civil Lines, Kanpur',
      applied_at: '2026-11-11'
    }
  ]);

  // 2. Profile Change Requests (Approval Workflow)
  const [profileRequests, setProfileRequests] = useState([
    {
      id: 'pr-1',
      user_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
      user_name: 'Aman Verma',
      user_email: 'student@shikshagram.com',
      user_role: 'student',
      target_teacher_name: 'Dr. Rajesh Sharma',
      requested_changes: {
        phone: '+91 98888 77777',
        guardian_phone: '+91 99999 11111',
        address: 'New Cantt Road, Prayagraj'
      },
      status: 'pending',
      created_at: '2026-11-12T16:00:00Z'
    },
    {
      id: 'pr-2',
      user_id: 'e4b6c810-7214-41d3-98fe-f472851a7101',
      user_name: 'Dr. Rajesh Sharma',
      user_email: 'teacher@shikshagram.com',
      user_role: 'teacher',
      target_teacher_name: 'Platform Admin',
      requested_changes: {
        coaching_name: 'Sharma Premier Science & Math Academy',
        experience_years: 16
      },
      status: 'pending',
      created_at: '2026-11-12T17:30:00Z'
    }
  ]);

  // 3. Admin Accounts List (Multi-Admin Management)
  const [adminsList, setAdminsList] = useState([
    {
      id: 'admin-master',
      name: 'Shiksha Gram Administrator',
      email: 'admin@shikshagram.com',
      phone: '+91 99999 88888',
      role_title: 'Super Administrator',
      created_at: '2026-01-01'
    }
  ]);

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role_title: 'Operations Admin'
  });

  // 4. Landing Page CMS & Coaching Promotions (Managed by Admin)
  const [cmsForm, setCmsForm] = useState({
    hero_title: 'Where Technology Meets Education',
    hero_title_hi: 'जहाँ तकनीक और शिक्षा का संगम होता है',
    hero_subtitle: "India's premier coaching management platform connecting independent tutors, institutes, students, and parents.",
    hero_subtitle_hi: 'कागजी रजिस्टर, उलझे हुए व्हाट्सएप ग्रुपों को कहें अलविदा। एक क्लिक में उपस्थिति, रिजल्ट और नोट्स प्रबंधित करें।',
    promotions_banner: '🔥 Admissions Open for Academic Session 2026-27! Register today for top batch seats.',
    promotions_banner_hi: '🔥 सत्र 2026-27 के नए बैच प्रारंभ! सीमित सीटें उपलब्ध, आज ही नामांकन कराएं।',
  });

  const [promotionsList, setPromotionsList] = useState([
    {
      id: 'cp-1',
      coaching_name: 'Sharma Science & Math Academy',
      mentor_name: 'Dr. Rajesh Sharma (Ph.D, 15+ Yrs Exp)',
      subjects: 'Class 9th-12th Mathematics & Physics',
      badge: 'Top Rated Institute',
      student_count: 128,
      rating: 4.9,
      contact_phone: '+91 98765 43210'
    },
    {
      id: 'cp-2',
      coaching_name: 'Target IIT & NEET Foundation',
      mentor_name: 'Er. Alok Pandey (B.Tech IIT-BHU)',
      subjects: 'Advanced Physics & Mathematics',
      badge: 'Verified Academy',
      student_count: 95,
      rating: 4.8,
      contact_phone: '+91 93350 44556'
    }
  ]);

  const [newPromo, setNewPromo] = useState({
    coaching_name: '',
    mentor_name: '',
    subjects: '',
    badge: 'Featured',
    student_count: 60,
    rating: 4.9,
    contact_phone: ''
  });

  // Users List
  const [usersList, setUsersList] = useState([
    { id: 'u-1', name: 'Dr. Rajesh Sharma', email: 'teacher@shikshagram.com', role: 'teacher', isVerified: true, isBlocked: false, coaching: 'Sharma Science & Math Academy' },
    { id: 'u-2', name: 'Aman Verma', email: 'student@shikshagram.com', role: 'student', isVerified: true, isBlocked: false, coaching: 'Class 10th - Board Mastery' },
    { id: 'u-3', name: 'Priya Sharma', email: 'priya.sharma@example.com', role: 'student', isVerified: true, isBlocked: false, coaching: 'Class 10th - Board Mastery' },
    { id: 'u-4', name: 'Rohan Gupta', email: 'rohan.gupta@example.com', role: 'student', isVerified: true, isBlocked: false, coaching: 'Class 10th - Board Mastery' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // 5.4 Batch Management (Platform Level)
  const [batchesList, setBatchesList] = useState([
    {
      id: 'batch-101',
      name: 'Class 10th - Board Mastery Mathematics',
      subject: 'Mathematics',
      teacher_id: 'e4b6c810-7214-41d3-98fe-f472851a7101',
      teacher_name: 'Dr. Rajesh Sharma',
      schedule: 'Mon, Wed, Fri • 4:00 PM - 5:30 PM',
      room: 'Room 101',
      fees: 1500,
      capacity: 35,
      students_count: 28,
      status: 'active'
    },
    {
      id: 'batch-102',
      name: 'Class 12th - Target IIT Advanced Physics',
      subject: 'Physics',
      teacher_id: 'e4b6c810-7214-41d3-98fe-f472851a7101',
      teacher_name: 'Dr. Rajesh Sharma',
      schedule: 'Tue, Thu, Sat • 6:00 PM - 7:30 PM',
      room: 'Room 104',
      fees: 2200,
      capacity: 30,
      students_count: 22,
      status: 'active'
    },
    {
      id: 'batch-103',
      name: 'Class 9th - Science & Math Foundation',
      subject: 'General Science',
      teacher_id: null,
      teacher_name: 'Unassigned',
      schedule: 'Daily • 5:00 PM - 6:00 PM',
      room: 'Room 202',
      fees: 1200,
      capacity: 40,
      students_count: 19,
      status: 'active'
    }
  ]);

  const [newBatchForm, setNewBatchForm] = useState({
    name: '',
    subject: '',
    teacher_name: 'Dr. Rajesh Sharma',
    teacher_id: 'e4b6c810-7214-41d3-98fe-f472851a7101',
    schedule: 'Mon, Wed, Fri • 4:00 PM - 5:30 PM',
    room: 'Room 101',
    fees: 1500,
    capacity: 35
  });
  const [showCreateBatchModal, setShowCreateBatchModal] = useState(false);

  // 5.5 Global Notices Broadcast
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastAudience, setBroadcastAudience] = useState('all');
  const [broadcastPriority, setBroadcastPriority] = useState('normal');
  const [noticeSuccess, setNoticeSuccess] = useState('');
  const [broadcastList, setBroadcastList] = useState([
    {
      id: 'not-glob-1',
      title: 'Admissions & Scholarship Test for 2026-27 Announced',
      content: 'All students and registered tutors are informed that the Shiksha Gram State-Level Talent Scholarship test will be conducted on 15th March 2026 across certified centers.',
      target_audience: 'all',
      priority: 'urgent',
      author: 'Platform Admin',
      created_at: '2026-03-01'
    },
    {
      id: 'not-glob-2',
      title: 'New Verification Standards for Coaching Teachers',
      content: 'All educators must upload their degree verification documents and address proof within 7 days to maintain verified badge status.',
      target_audience: 'teachers',
      priority: 'normal',
      author: 'Platform Admin',
      created_at: '2026-03-02'
    }
  ]);

  // Fetch live from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const liveStats = await api.getAdminStats();
        if (liveStats) setStats(liveStats);
      } catch (e) {}

      try {
        const liveUsers = await api.getAllUsers();
        if (liveUsers && liveUsers.length > 0) {
          setUsersList(liveUsers.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            isVerified: u.is_verified,
            isBlocked: u.is_blocked,
            coaching: u.coaching_name || (u.role === 'student' ? (u.school_name || 'Enrolled Student') : 'Platform User')
          })));
        }
      } catch (e) {}

      try {
        const liveBatches = await api.getAdminBatches();
        if (liveBatches && liveBatches.length > 0) setBatchesList(liveBatches);
      } catch (e) {}

      try {
        const liveBroadcasts = await api.getAdminBroadcasts();
        if (liveBroadcasts && liveBroadcasts.length > 0) setBroadcastList(liveBroadcasts);
      } catch (e) {}

      try {
        const liveCms = await api.getLandingContent();
        if (liveCms) setCmsForm(liveCms);
      } catch (e) {}

      try {
        const livePromos = await api.getCoachingPromotions();
        if (livePromos && livePromos.length > 0) setPromotionsList(livePromos);
      } catch (e) {}
    };

    loadData();
  }, []);

  // Handlers
  const handleVerifyTeacher = async (teacherId, approve) => {
    try {
      await api.verifyTeacher(teacherId, approve);
    } catch (e) {}

    const teacher = pendingTeachers.find(t => t.id === teacherId);
    if (approve && teacher) {
      setUsersList(prev => [
        ...prev,
        {
          id: 'u-' + Date.now(),
          name: teacher.name,
          email: teacher.email,
          role: 'teacher',
          isVerified: true,
          isBlocked: false,
          coaching: teacher.coaching_name
        }
      ]);
    }
    setPendingTeachers(prev => prev.filter(t => t.id !== teacherId));
  };

  const handleReviewProfileRequest = async (requestId, approve) => {
    try {
      await api.reviewProfileRequest(requestId, approve);
    } catch (e) {}

    setProfileRequests(prev => prev.filter(r => r.id !== requestId));
    alert(approve ? 'Profile change approved and applied to database.' : 'Profile change request rejected.');
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdmin.email || !newAdmin.password) return;

    try {
      await api.createAdmin(newAdmin);
    } catch (e) {}

    const created = {
      id: 'admin-' + Date.now(),
      ...newAdmin,
      created_at: new Date().toISOString().split('T')[0]
    };
    setAdminsList(prev => [...prev, created]);
    setNewAdmin({ name: '', email: '', password: '', phone: '', role_title: 'Operations Admin' });
    alert(`New Administrator ${created.email} registered successfully.`);
  };

  const handleSaveLandingCMS = async (e) => {
    e.preventDefault();
    try {
      await api.updateLandingContent(cmsForm);
    } catch (e) {}
    alert('Landing page content updated successfully! Changes are live on visitor page.');
  };

  const handleAddPromotion = async (e) => {
    e.preventDefault();
    try {
      await api.createCoachingPromotion(newPromo);
    } catch (e) {}

    const created = {
      id: 'cp-' + Date.now(),
      ...newPromo
    };
    setPromotionsList(prev => [created, ...prev]);
    setNewPromo({ coaching_name: '', mentor_name: '', subjects: '', badge: 'Featured', student_count: 60, rating: 4.9, contact_phone: '' });
    alert('Coaching promotion published to visitor landing page.');
  };

  const handleDeletePromotion = async (promoId) => {
    try {
      await api.deleteCoachingPromotion(promoId);
    } catch (e) {}
    setPromotionsList(prev => prev.filter(p => p.id !== promoId));
  };

  const handleToggleBlock = async (userId) => {
    const target = usersList.find(u => u.id === userId);
    const newStatus = !target?.isBlocked;
    try {
      await api.toggleBlockUser(userId, newStatus);
    } catch (e) {}
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, isBlocked: newStatus } : u));
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account? This cannot be undone.')) return;
    try {
      await api.deleteUser(userId);
    } catch (e) {}
    setUsersList(prev => prev.filter(u => u.id !== userId));
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    if (!newBatchForm.name || !newBatchForm.subject) return;

    try {
      await api.createAdminBatch(newBatchForm);
    } catch (e) {}

    const created = {
      id: 'batch-' + Date.now(),
      ...newBatchForm,
      fees: Number(newBatchForm.fees) || 1500,
      capacity: Number(newBatchForm.capacity) || 35,
      students_count: 0,
      status: 'active'
    };
    setBatchesList(prev => [created, ...prev]);
    setNewBatchForm({
      name: '',
      subject: '',
      teacher_name: 'Dr. Rajesh Sharma',
      teacher_id: 'e4b6c810-7214-41d3-98fe-f472851a7101',
      schedule: 'Mon, Wed, Fri • 4:00 PM - 5:30 PM',
      room: 'Room 101',
      fees: 1500,
      capacity: 35
    });
    setShowCreateBatchModal(false);
    alert('Platform batch created successfully.');
  };

  const handleAssignTeacher = async (batchId, teacherName, teacherId) => {
    try {
      await api.assignAdminBatchTeacher(batchId, teacherId, teacherName);
    } catch (e) {}

    setBatchesList(prev => prev.map(b => b.id === batchId ? { ...b, teacher_name: teacherName, teacher_id: teacherId } : b));
    alert(`Teacher ${teacherName} assigned to batch successfully.`);
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim()) return;

    const newBroadcast = {
      id: 'not-' + Date.now(),
      title: broadcastTitle,
      content: broadcastContent,
      target_audience: broadcastAudience,
      priority: broadcastPriority,
      date: new Date().toISOString().split('T')[0],
      author: 'Platform Admin',
      is_global: true
    };

    try {
      await api.broadcastNotice({
        title: broadcastTitle,
        content: broadcastContent,
        target_audience: broadcastAudience,
        priority: broadcastPriority,
        is_global: true
      });
    } catch (e) {}

    setBroadcastList(prev => [newBroadcast, ...prev]);
    saveMockNotices([newBroadcast, ...data.notices]);
    setBroadcastTitle('');
    setBroadcastContent('');
    setNoticeSuccess('Broadcast published successfully across platform.');
    setTimeout(() => setNoticeSuccess(''), 4000);
  };

  const handleDeleteBroadcast = async (noticeId) => {
    try {
      await api.deleteBroadcastNotice(noticeId);
    } catch (e) {}
    setBroadcastList(prev => prev.filter(n => n.id !== noticeId));
  };

  return (
    <div className="space-y-6">
      
      {/* 1. ADMIN DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-rose-900/40 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2 border border-rose-500/30">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                Root Administration Console
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                Shiksha Gram Platform Oversight
              </h2>
              <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
                Supervise verified teachers, approve user profile updates, add co-administrators, and edit visitor landing page promotions.
              </p>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-xs text-slate-400 font-semibold">Active Teachers</p>
              <h3 className="text-2xl font-extrabold text-brand-600 mt-1">4 Tutors</h3>
              <span className="text-[10px] text-slate-400 font-medium">All verified</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-xs text-slate-400 font-semibold">Enrolled Students</p>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">24 Students</h3>
              <span className="text-[10px] text-slate-400 font-medium">Active in batches</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-xs text-slate-400 font-semibold">Pending Teachers</p>
              <h3 className="text-2xl font-extrabold text-amber-500 mt-1">{pendingTeachers.length} Pending</h3>
              <span className="text-[10px] text-amber-600 font-bold">Needs Approval</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-xs text-slate-400 font-semibold">Profile Change Requests</p>
              <h3 className="text-2xl font-extrabold text-rose-500 mt-1">{profileRequests.length} Pending</h3>
              <span className="text-[10px] text-rose-400 font-bold">Awaiting Review</span>
            </div>
          </div>

          {/* Quick action cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveTab('approvals')}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-brand-500 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-600">Workflow</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600">{profileRequests.length}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Profile Edit Approvals</h4>
              <p className="text-xs text-slate-400 mt-1">Review student & teacher profile updates.</p>
            </div>

            <div
              onClick={() => setActiveTab('admins')}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-brand-500 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-brand-600">Access</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-brand-600">{adminsList.length}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Admin Management</h4>
              <p className="text-xs text-slate-400 mt-1">Add new administrators or manage permissions.</p>
            </div>

            <div
              onClick={() => setActiveTab('cms')}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-brand-500 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-600">Visitor Page</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Landing Page & Promotions</h4>
              <p className="text-xs text-slate-400 mt-1">Edit hero texts & feature coaching academies.</p>
            </div>
          </div>

        </div>
      )}

      {/* 2. PROFILE CHANGE REQUESTS WORKFLOW (Student -> Teacher/Admin; Teacher -> Admin) */}
      {activeTab === 'approvals' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Profile Update Approval Requests
            </h2>
            <p className="text-xs text-slate-400">
              Security Workflow: Student edits require Teacher or Admin approval; Teacher edits require Admin approval.
            </p>
          </div>

          {profileRequests.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">No Pending Profile Requests</h4>
              <p className="text-xs text-slate-400">All user profile change requests have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {profileRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{req.user_name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          req.user_role === 'teacher' ? 'bg-indigo-50 text-brand-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {req.user_role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{req.user_email} • Reviewer: {req.target_teacher_name}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReviewProfileRequest(req.id, true)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Allow / Approve Changes</span>
                      </button>

                      <button
                        onClick={() => handleReviewProfileRequest(req.id, false)}
                        className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                    <p className="font-bold text-slate-700 dark:text-slate-300 mb-2">Requested Modifications:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                      {Object.entries(req.requested_changes).map(([key, val]) => (
                        <div key={key} className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                          <span className="text-slate-400 capitalize">{key.replace('_', ' ')}: </span>
                          <span className="font-bold text-brand-600 dark:text-brand-400">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* 3. MULTI-ADMIN MANAGEMENT (Add & manage administrator credentials) */}
      {activeTab === 'admins' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Administrator Accounts & Permissions
            </h2>
            <p className="text-xs text-slate-400">
              Manage platform administrators. Public sign-up is closed for admin; add new admins securely here.
            </p>
          </div>

          {/* Add Admin Form */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-brand-600" />
              <span>Create New Administrator</span>
            </h3>

            <form onSubmit={handleCreateAdmin} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Admin Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    placeholder="e.g. Co-Administrator"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Admin Email (Login ID)</label>
                  <input
                    type="email"
                    required
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    placeholder="admin2@shikshagram.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Set Password</label>
                  <input
                    type="password"
                    required
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Role Designation</label>
                  <input
                    type="text"
                    value={newAdmin.role_title}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role_title: e.target.value })}
                    placeholder="Academic Supervisor / Operations"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Administrator</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Admins List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Active Administrators ({adminsList.length})</h4>
            <div className="space-y-3">
              {adminsList.map(adm => (
                <div key={adm.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{adm.name}</span>
                    <p className="text-slate-400 font-mono text-[11px]">{adm.email} • {adm.role_title}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">Active</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5.6 Admin Security Controls & Logout */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-100 dark:border-rose-950/60 p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-600" />
              <span>{lang === 'hi' ? 'व्यवस्थापक सुरक्षा व सत्र नियंत्रण' : 'Admin Session Security & Account Controls'}</span>
            </h4>
            
            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <p className="font-semibold text-rose-900 dark:text-rose-300">
                Logged in as: <span className="font-mono">{user?.email || 'admin@shikshagram.com'}</span> ({user?.name || 'Administrator'})
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Every platform request is authenticated with server-side JWT verification. Hardcoded passwords have been completely eradicated; passwords are verified using native bcrypt hashing.
              </p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  if (window.confirm('Sign out of Administrator Console?')) {
                    logout();
                    window.location.href = '/';
                  }
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>{lang === 'hi' ? 'व्यवस्थापक सत्र समाप्त करें (Logout)' : 'Secure Admin Logout'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 4. LANDING PAGE & PROMOTIONS CMS (Admin Controls Visitor Page) */}
      {activeTab === 'cms' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Visitor Landing Page CMS & Promotions Control
            </h2>
            <p className="text-xs text-slate-400">
              Customize hero headings, bilingual text, live ticker banners, and coaching academy spotlights.
            </p>
          </div>

          {/* Edit Hero Texts */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hero Headings & Announcements Banner</h3>

            <form onSubmit={handleSaveLandingCMS} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Announcement Ticker Banner (English)</label>
                <input
                  type="text"
                  value={cmsForm.promotions_banner}
                  onChange={(e) => setCmsForm({ ...cmsForm, promotions_banner: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Announcement Ticker Banner (Hindi)</label>
                <input
                  type="text"
                  value={cmsForm.promotions_banner_hi}
                  onChange={(e) => setCmsForm({ ...cmsForm, promotions_banner_hi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Hero Title (English)</label>
                  <input
                    type="text"
                    value={cmsForm.hero_title}
                    onChange={(e) => setCmsForm({ ...cmsForm, hero_title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Hero Title (Hindi)</label>
                  <input
                    type="text"
                    value={cmsForm.hero_title_hi}
                    onChange={(e) => setCmsForm({ ...cmsForm, hero_title_hi: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md"
                >
                  Save & Update Landing Page
                </button>
              </div>
            </form>
          </div>

          {/* Manage Featured Coaching Promotions */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Publish Coaching Academy Promotion</h3>

            <form onSubmit={handleAddPromotion} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Coaching Name</label>
                  <input
                    type="text"
                    required
                    value={newPromo.coaching_name}
                    onChange={(e) => setNewPromo({ ...newPromo, coaching_name: e.target.value })}
                    placeholder="e.g. Verma Physics Classes"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Mentor Name & Bio</label>
                  <input
                    type="text"
                    required
                    value={newPromo.mentor_name}
                    onChange={(e) => setNewPromo({ ...newPromo, mentor_name: e.target.value })}
                    placeholder="Prof. S. K. Verma (Ex-FIITJEE)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Subjects Taught</label>
                  <input
                    type="text"
                    required
                    value={newPromo.subjects}
                    onChange={(e) => setNewPromo({ ...newPromo, subjects: e.target.value })}
                    placeholder="Class 11th-12th Physics"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={newPromo.contact_phone}
                    onChange={(e) => setNewPromo({ ...newPromo, contact_phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                >
                  Feature on Visitor Page
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Coaching Promotions</h4>
              {promotionsList.map(p => (
                <div key={p.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{p.coaching_name}</span>
                    <p className="text-slate-400 text-[11px]">{p.mentor_name} • {p.subjects}</p>
                  </div>
                  <button
                    onClick={() => handleDeletePromotion(p.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove Promotion"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 5. TEACHER VERIFICATION */}
      {activeTab === 'verification' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Pending Teacher Verifications ({pendingTeachers.length})
            </h2>
            <p className="text-xs text-slate-400">Review teacher sign-up applications before granting coaching access.</p>
          </div>

          <div className="space-y-4">
            {pendingTeachers.map((pt) => (
              <div key={pt.id} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-base font-bold text-slate-900 dark:text-white">{pt.name}</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{pt.coaching_name} • Subjects: {pt.subjects.join(', ')}</p>
                  <p className="text-[11px] text-slate-400">{pt.phone} • {pt.email} • {pt.qualification} ({pt.experience_years} Yrs Exp)</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVerifyTeacher(pt.id, true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Activate</span>
                  </button>

                  <button
                    onClick={() => handleVerifyTeacher(pt.id, false)}
                    className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5.3 USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'उपयोगकर्ता प्रबंधन' : 'User Management'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hi' ? 'सभी पंजीकृत छात्रों, शिक्षकों और एडमिन की सूची देखें, ब्लॉक या डिलीट करें।' : 'Search/view users, block access, or permanently remove accounts.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              {/* Role filter */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                {['all', 'teacher', 'student', 'admin'].map(r => (
                  <button
                    key={r}
                    onClick={() => setUserRoleFilter(r)}
                    className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                      userRoleFilter === r
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user name or email..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3.5 pl-4">User Identity</th>
                  <th className="py-3.5">Role</th>
                  <th className="py-3.5">Institute / Coaching Details</th>
                  <th className="py-3.5">Account Status</th>
                  <th className="py-3.5 text-right pr-4">Security Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {usersList
                  .filter(u => {
                    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
                    return matchesSearch && matchesRole;
                  })
                  .map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 pl-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            usr.role === 'admin' ? 'bg-rose-100 text-rose-700' : usr.role === 'teacher' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {usr.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-100">{usr.name}</span>
                            <p className="text-[10px] text-slate-400 font-mono">{usr.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          usr.role === 'admin' ? 'bg-rose-50 text-rose-700 border border-rose-200' : usr.role === 'teacher' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-600 dark:text-slate-300 font-medium">{usr.coaching}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          usr.isBlocked ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {usr.isBlocked ? 'Blocked' : 'Active Verified'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {usr.role !== 'admin' && (
                            <>
                              <button
                                onClick={() => handleToggleBlock(usr.id)}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors ${
                                  usr.isBlocked ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                }`}
                              >
                                {usr.isBlocked ? 'Unblock' : 'Block'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(usr.id)}
                                className="px-2.5 py-1 rounded-xl text-[10px] font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 border border-rose-200 transition-colors flex items-center gap-1"
                                title="Permanently Delete User"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5.4 BATCH MANAGEMENT (PLATFORM LEVEL OVERVIEW, CREATE, ASSIGN TEACHERS) */}
      {activeTab === 'batches' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-brand-600" />
                <span>{lang === 'hi' ? 'प्लेटफ़ॉर्म बैच प्रबंधन' : 'Platform Batch Operations'}</span>
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hi' ? 'प्लेटफ़ॉर्म स्तर पर नए बैच बनाएं, क्षमता की समीक्षा करें और प्रमाणित शिक्षक नियुक्त करें।' : 'Platform-level batch overview, create batches, and assign teachers.'}
              </p>
            </div>

            <button
              onClick={() => setShowCreateBatchModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'hi' ? 'नया बैच बनाएं' : 'Create Platform Batch'}</span>
            </button>
          </div>

          {/* Batches Table Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3.5 pl-4">Batch Name & Subject</th>
                  <th className="py-3.5">Assigned Teacher</th>
                  <th className="py-3.5">Schedule & Room</th>
                  <th className="py-3.5">Monthly Fees</th>
                  <th className="py-3.5">Enrollment</th>
                  <th className="py-3.5 text-right pr-4">Teacher Assignment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {batchesList.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pl-4">
                      <span className="font-bold text-slate-800 dark:text-slate-100 block">{batch.name}</span>
                      <span className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold">{batch.subject}</span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                          {batch.teacher_name?.charAt(0) || 'T'}
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{batch.teacher_name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <p className="text-slate-600 dark:text-slate-300 font-medium">{batch.schedule}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{batch.room || 'Room 101'}</p>
                    </td>
                    <td className="py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">₹{batch.fees}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {batch.students_count} / {batch.capacity} seats
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-4">
                      <select
                        value={batch.teacher_name}
                        onChange={(e) => {
                          const chosenTeacher = usersList.find(u => u.name === e.target.value && u.role === 'teacher');
                          handleAssignTeacher(batch.id, e.target.value, chosenTeacher?.id || 'e4b6c810-7214-41d3-98fe-f472851a7101');
                        }}
                        className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                      >
                        <option value="Dr. Rajesh Sharma">Dr. Rajesh Sharma</option>
                        <option value="Prof. Sunita Mishra">Prof. Sunita Mishra</option>
                        <option value="Er. Alok Pandey">Er. Alok Pandey</option>
                        <option value="Unassigned">Unassigned</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Create Batch Modal */}
          {showCreateBatchModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  {lang === 'hi' ? 'नया प्लेटफ़ॉर्म बैच बनाएं' : 'Create New Platform Batch'}
                </h3>
                <form onSubmit={handleCreateBatch} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Batch Title</label>
                    <input
                      type="text"
                      required
                      value={newBatchForm.name}
                      onChange={(e) => setNewBatchForm({ ...newBatchForm, name: e.target.value })}
                      placeholder="e.g. Class 11th - IIT-JEE Mathematics"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Subject</label>
                      <input
                        type="text"
                        required
                        value={newBatchForm.subject}
                        onChange={(e) => setNewBatchForm({ ...newBatchForm, subject: e.target.value })}
                        placeholder="e.g. Mathematics"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Assign Teacher</label>
                      <select
                        value={newBatchForm.teacher_name}
                        onChange={(e) => setNewBatchForm({ ...newBatchForm, teacher_name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                      >
                        <option value="Dr. Rajesh Sharma">Dr. Rajesh Sharma</option>
                        <option value="Prof. Sunita Mishra">Prof. Sunita Mishra</option>
                        <option value="Er. Alok Pandey">Er. Alok Pandey</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Schedule & Days</label>
                    <input
                      type="text"
                      required
                      value={newBatchForm.schedule}
                      onChange={(e) => setNewBatchForm({ ...newBatchForm, schedule: e.target.value })}
                      placeholder="e.g. Mon, Wed, Fri • 4:00 PM - 5:30 PM"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Room</label>
                      <input
                        type="text"
                        value={newBatchForm.room}
                        onChange={(e) => setNewBatchForm({ ...newBatchForm, room: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Monthly Fee (₹)</label>
                      <input
                        type="number"
                        value={newBatchForm.fees}
                        onChange={(e) => setNewBatchForm({ ...newBatchForm, fees: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Max Capacity</label>
                      <input
                        type="number"
                        value={newBatchForm.capacity}
                        onChange={(e) => setNewBatchForm({ ...newBatchForm, capacity: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateBatchModal(false)}
                      className="px-4 py-2 text-slate-500 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md"
                    >
                      Publish Batch
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5.5 GLOBAL NOTICES BROADCAST */}
      {activeTab === 'broadcasts' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-rose-600" />
              <span>{lang === 'hi' ? 'सार्वजनिक सूचना व ब्रॉडकास्ट' : 'Global Notices & Live Broadcasts'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'hi' ? 'छात्रों, शिक्षकों या सभी उपयोगकर्ताओं के लिए तत्काल सार्वजनिक घोषणाएं प्रसारित करें।' : 'Broadcast important platform notices to relevant users.'}
            </p>
          </div>

          {noticeSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{noticeSuccess}</span>
            </div>
          )}

          {/* Broadcast Form */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Compose Platform Announcement</h3>
            
            <form onSubmit={handleSendBroadcast} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Notice Headline</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Important Update: Annual Scholarship Test Date Announced"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Target Audience</label>
                  <select
                    value={broadcastAudience}
                    onChange={(e) => setBroadcastAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <option value="all">All Platform Users (Public & Internal)</option>
                    <option value="teachers">Coaching Teachers Only</option>
                    <option value="students">Students & Parents Only</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Priority Level</label>
                  <select
                    value={broadcastPriority}
                    onChange={(e) => setBroadcastPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <option value="normal">Normal Announcement</option>
                    <option value="urgent">Urgent / Alert Notice 🔥</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Detailed Message</label>
                <textarea
                  rows={3}
                  required
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  placeholder="Enter complete notice text, guidelines, instructions, or links..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2"
                >
                  <Radio className="w-4 h-4" />
                  <span>Broadcast Notice to Target Users</span>
                </button>
              </div>
            </form>
          </div>

          {/* Broadcast History */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Platform Broadcasts ({broadcastList.length})</h3>
            {broadcastList.map((item) => (
              <div key={item.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.priority === 'urgent' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                      Audience: {item.target_audience}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.content}</p>
                  <p className="text-[10px] text-slate-400">By {item.author} • {item.created_at || item.date}</p>
                </div>

                <button
                  onClick={() => handleDeleteBroadcast(item.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors shrink-0"
                  title="Delete Notice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
