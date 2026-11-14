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
  UserCheck,
  Star,
  Award,
  MapPin,
  RotateCcw,
  Eye,
  Tag,
  ExternalLink,
  Layers,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { getMockData, saveMockNotices } from '../../services/mockData';
import {
  DEFAULT_CMS_CONTENT,
  DEFAULT_PROMO_POSTERS,
  DEFAULT_COACHING_PARTNERS,
  DEFAULT_GLOBAL_BROADCASTS,
  getStoredLandingCMS,
  saveLandingCMS,
  getStoredPromoPosters,
  savePromoPosters,
  getStoredCoachingPromotions,
  saveCoachingPromotions,
  getStoredBroadcasts,
  saveStoredBroadcasts,
  resetAllLandingDataToDefault
} from '../../services/landingData';

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
      name: 'Dr. Rajesh Sharma',
      email: 'teacher@shikshagram.com',
      phone: '+91 98765 43210',
      coaching_name: 'Sharma Science & Math Academy',
      qualification: 'Ph.D in Physics, M.Sc Mathematics',
      experience_years: 15,
      subjects: ['Physics', 'Mathematics'],
      created_at: '2026-03-01',
      is_approved: false
    },
    {
      id: 'pt-2',
      name: 'Sunita Mishra',
      email: 'sunita.mishra@example.com',
      phone: '+91 94150 99887',
      coaching_name: 'Mishra Chemistry Classes',
      qualification: 'M.Sc Chemistry Gold Medalist',
      experience_years: 8,
      subjects: ['Chemistry'],
      created_at: '2026-03-02',
      is_approved: false
    }
  ]);

  // 2. Profile Update Approval Workflow
  const [profileRequests, setProfileRequests] = useState([
    {
      id: 'pr-1',
      user_id: 'u-101',
      user_name: 'Aman Verma',
      user_email: 'student@shikshagram.com',
      user_role: 'student',
      target_teacher_name: 'Dr. Rajesh Sharma',
      requested_changes: {
        guardian_phone: '+91 98111 99999',
        address: 'House #42, Block C, Civil Lines, Kanpur'
      },
      status: 'pending',
      created_at: '2026-03-03T10:30:00Z'
    }
  ]);

  // 3. Admin Accounts Management
  const [adminsList, setAdminsList] = useState([
    {
      id: 'adm-1',
      name: 'Antigravity SuperAdmin',
      email: 'admin@shikshagram.com',
      phone: '+91 98000 00001',
      role_title: 'Platform SuperAdmin',
      created_at: '2026-01-01',
      is_root: true
    }
  ]);

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role_title: 'Operations Admin'
  });

  // 4. Landing Page CMS & Dynamic Data (Managed by Admin)
  const [cmsForm, setCmsForm] = useState(getStoredLandingCMS);
  const [promotionsList, setPromotionsList] = useState(getStoredCoachingPromotions);
  const [postersList, setPostersList] = useState(getStoredPromoPosters);
  const [broadcastList, setBroadcastList] = useState(getStoredBroadcasts);

  // Subtab inside CMS: 'coachings' | 'posters' | 'hero'
  const [cmsSubTab, setCmsSubTab] = useState('coachings');

  // Coaching Form State (Add / Edit)
  const [editingPromoId, setEditingPromoId] = useState(null);
  const [promoForm, setPromoForm] = useState({
    coaching_name: '',
    mentor_name: '',
    subjects: '',
    category: 'boards',
    tagline: '',
    description: '',
    badge: 'Top Rated Institute',
    student_count: 80,
    rating: 4.9,
    contact_phone: '+91 98765 43210',
    location: 'Central Campus',
    achievements: '98% Board Distinction Rate',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'
  });

  // Poster Carousel Form State (Add / Edit)
  const [editingPosterId, setEditingPosterId] = useState(null);
  const [posterForm, setPosterForm] = useState({
    title: '',
    title_hi: '',
    tagline: '',
    tagline_hi: '',
    badge: '🔥 ADMISSIONS OPEN 2026-27',
    badge_hi: '🔥 सत्र 2026-27 नामांकन प्रारंभ',
    description: '',
    description_hi: '',
    discount: 'Scholarship up to 100%',
    validTill: '31 March 2026',
    organizer: 'Target IIT & NEET Foundation',
    phone: '+91 93350 44556',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80'
  });

  // Broadcasts Form State (Add / Edit)
  const [editingBroadcastId, setEditingBroadcastId] = useState(null);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastTitleHi, setBroadcastTitleHi] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastContentHi, setBroadcastContentHi] = useState('');
  const [broadcastAudience, setBroadcastAudience] = useState('all');
  const [broadcastPriority, setBroadcastPriority] = useState('normal');
  const [broadcastCategory, setBroadcastCategory] = useState('platform');
  const [broadcastAuthor, setBroadcastAuthor] = useState('Platform Admin');
  const [noticeSuccess, setNoticeSuccess] = useState('');

  // Users List
  const [usersList, setUsersList] = useState([
    { id: 'u-1', name: 'Dr. Rajesh Sharma', email: 'teacher@shikshagram.com', role: 'teacher', isVerified: true, isBlocked: false, coaching: 'Sharma Science & Math Academy' },
    { id: 'u-2', name: 'Aman Verma', email: 'student@shikshagram.com', role: 'student', isVerified: true, isBlocked: false, coaching: 'Class 10th - Board Mastery' },
    { id: 'u-3', name: 'Priya Sharma', email: 'priya.sharma@example.com', role: 'student', isVerified: true, isBlocked: false, coaching: 'Class 10th - Board Mastery' },
    { id: 'u-4', name: 'Rohan Gupta', email: 'rohan.gupta@example.com', role: 'student', isVerified: true, isBlocked: false, coaching: 'Class 10th - Board Mastery' },
  ]);

  // Batches List
  const [batchesList, setBatchesList] = useState([
    {
      id: 'batch-1',
      name: 'Class 10th - Board Mastery',
      subject: 'Mathematics & Science',
      teacher_name: 'Dr. Rajesh Sharma',
      teacher_id: 'e4b6c810-7214-41d3-98fe-f472851a7101',
      schedule: 'Mon, Wed, Fri • 4:30 PM - 6:00 PM',
      room: 'Hall A (Room 201)',
      fees: 1500,
      capacity: 35,
      students_count: 28,
      status: 'active'
    },
    {
      id: 'batch-2',
      name: 'Class 12th - Physics Foundation',
      subject: 'Physics (Board & JEE)',
      teacher_name: 'Dr. Rajesh Sharma',
      teacher_id: 'e4b6c810-7214-41d3-98fe-f472851a7101',
      schedule: 'Tue, Thu, Sat • 5:00 PM - 6:30 PM',
      room: 'Science Lab 3',
      fees: 1800,
      capacity: 30,
      students_count: 22,
      status: 'active'
    },
    {
      id: 'batch-3',
      name: 'Class 9th - Science Spark',
      subject: 'Integrated Science',
      teacher_name: 'Dr. Rajesh Sharma',
      teacher_id: 'e4b6c810-7214-41d3-98fe-f472851a7101',
      schedule: 'Mon, Wed, Fri • 3:00 PM - 4:15 PM',
      room: 'Room 104',
      fees: 1200,
      capacity: 25,
      students_count: 19,
      status: 'active'
    }
  ]);

  const [showCreateBatchModal, setShowCreateBatchModal] = useState(false);
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

  // Fetch live from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const liveStats = await api.getAdminDashboardStats();
        if (liveStats) setStats(liveStats);
      } catch (e) {}

      try {
        const livePending = await api.getPendingTeachers();
        if (livePending && livePending.length > 0) setPendingTeachers(livePending);
      } catch (e) {}

      try {
        const liveRequests = await api.getPendingProfileRequests();
        if (liveRequests && liveRequests.length > 0) setProfileRequests(liveRequests);
      } catch (e) {}

      try {
        const liveUsers = await api.getAllUsers();
        if (liveUsers && liveUsers.length > 0) setUsersList(liveUsers);
      } catch (e) {}

      try {
        const liveBatches = await api.getAdminBatches();
        if (liveBatches && liveBatches.length > 0) setBatchesList(liveBatches);
      } catch (e) {}

      try {
        const liveBroadcasts = await api.getAdminBroadcasts();
        if (liveBroadcasts && liveBroadcasts.length > 0) {
          setBroadcastList(liveBroadcasts);
          saveStoredBroadcasts(liveBroadcasts);
        }
      } catch (e) {}

      try {
        const liveCms = await api.getLandingContent();
        if (liveCms && liveCms.hero_title) {
          setCmsForm(liveCms);
          saveLandingCMS(liveCms);
        }
      } catch (e) {}

      try {
        const livePromos = await api.getCoachingPromotions();
        if (livePromos && livePromos.length > 0) {
          setPromotionsList(livePromos);
          saveCoachingPromotions(livePromos);
        }
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
    setPendingTeachers(prev => prev.filter(t => t.id !== teacherId));

    if (approve && teacher) {
      setUsersList(prev => [
        {
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          role: 'teacher',
          isVerified: true,
          isBlocked: false,
          coaching: teacher.coaching_name
        },
        ...prev
      ]);
      alert(`Teacher ${teacher.name} approved! They can now log in and manage batches.`);
    } else {
      alert('Teacher application rejected.');
    }
  };

  const handleReviewProfileRequest = async (requestId, approve) => {
    try {
      await api.reviewProfileRequest(requestId, approve, approve ? 'Approved by Admin' : 'Rejected');
    } catch (e) {}

    const req = profileRequests.find(r => r.id === requestId);
    setProfileRequests(prev => prev.filter(r => r.id !== requestId));

    if (approve && req) {
      setUsersList(prev => prev.map(u => {
        if (u.id === req.user_id) {
          return {
            ...u,
            phone: req.requested_changes.phone || req.requested_changes.guardian_phone || u.phone,
            name: req.requested_changes.name || u.name
          };
        }
        return u;
      }));
      alert(`Profile update for ${req.user_name} approved and applied successfully.`);
    } else {
      alert('Profile update request rejected.');
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdmin.email || !newAdmin.name) return;

    try {
      await api.createAdminAccount(newAdmin);
    } catch (e) {}

    const created = {
      id: 'adm-' + Date.now(),
      name: newAdmin.name,
      email: newAdmin.email,
      phone: newAdmin.phone,
      role_title: newAdmin.role_title,
      created_at: new Date().toISOString().split('T')[0],
      is_root: false
    };

    setAdminsList(prev => [...prev, created]);
    setNewAdmin({ name: '', email: '', password: '', phone: '', role_title: 'Operations Admin' });
    alert(`New Administrator ${created.email} registered successfully.`);
  };

  // --- 1. HERO CMS & MARQUEE ANNOUNCEMENTS HANDLER ---
  const handleSaveLandingCMS = async (e) => {
    e.preventDefault();
    saveLandingCMS(cmsForm);
    try {
      await api.updateLandingContent(cmsForm);
    } catch (e) {}
    alert('Landing page hero & announcement ticker updated successfully! Changes are live on visitor page.');
  };

  // --- 2. COACHING PROMOTIONS HANDLERS (ADD / EDIT / DELETE) ---
  const handleSavePromotion = async (e) => {
    e.preventDefault();
    if (!promoForm.coaching_name.trim()) return;

    let updated;
    if (editingPromoId) {
      updated = promotionsList.map(p => p.id === editingPromoId ? { ...p, ...promoForm } : p);
      alert(`Coaching "${promoForm.coaching_name}" updated successfully!`);
    } else {
      const created = {
        id: 'cp-' + Date.now(),
        ...promoForm
      };
      updated = [created, ...promotionsList];
      try {
        await api.createCoachingPromotion(created);
      } catch (e) {}
      alert(`Coaching "${promoForm.coaching_name}" published to visitor landing directory!`);
    }

    setPromotionsList(updated);
    saveCoachingPromotions(updated);

    // Reset Form
    setEditingPromoId(null);
    setPromoForm({
      coaching_name: '',
      mentor_name: '',
      subjects: '',
      category: 'boards',
      tagline: '',
      description: '',
      badge: 'Top Rated Institute',
      student_count: 80,
      rating: 4.9,
      contact_phone: '+91 98765 43210',
      location: 'Central Campus',
      achievements: '98% Board Distinction Rate',
      image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'
    });
  };

  const handleEditPromotion = (promo) => {
    setEditingPromoId(promo.id);
    setPromoForm({ ...promo });
    window.scrollTo({ top: 280, behavior: 'smooth' });
  };

  const handleCancelPromoEdit = () => {
    setEditingPromoId(null);
    setPromoForm({
      coaching_name: '',
      mentor_name: '',
      subjects: '',
      category: 'boards',
      tagline: '',
      description: '',
      badge: 'Top Rated Institute',
      student_count: 80,
      rating: 4.9,
      contact_phone: '+91 98765 43210',
      location: 'Central Campus',
      achievements: '98% Board Distinction Rate',
      image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'
    });
  };

  const handleDeletePromotion = async (promoId) => {
    if (!window.confirm('Are you sure you want to remove this coaching from the visitor landing page?')) return;
    try {
      await api.deleteCoachingPromotion(promoId);
    } catch (e) {}

    const updated = promotionsList.filter(p => p.id !== promoId);
    setPromotionsList(updated);
    saveCoachingPromotions(updated);
  };

  // --- 3. PROMOTIONAL CAROUSEL POSTERS & OFFERS HANDLERS (ADD / EDIT / DELETE) ---
  const handleSavePoster = (e) => {
    e.preventDefault();
    if (!posterForm.title.trim()) return;

    let updated;
    if (editingPosterId) {
      updated = postersList.map(p => p.id === editingPosterId ? { ...p, ...posterForm } : p);
      alert(`Promotional Poster "${posterForm.title}" updated successfully!`);
    } else {
      const created = {
        id: 'poster-' + Date.now(),
        ...posterForm
      };
      updated = [created, ...postersList];
      alert(`New Promotional Poster "${posterForm.title}" added to landing banner carousel!`);
    }

    setPostersList(updated);
    savePromoPosters(updated);

    // Reset Form
    setEditingPosterId(null);
    setPosterForm({
      title: '',
      title_hi: '',
      tagline: '',
      tagline_hi: '',
      badge: '🔥 ADMISSIONS OPEN 2026-27',
      badge_hi: '🔥 सत्र 2026-27 नामांकन प्रारंभ',
      description: '',
      description_hi: '',
      discount: 'Scholarship up to 100%',
      validTill: '31 March 2026',
      organizer: 'Target IIT & NEET Foundation',
      phone: '+91 93350 44556',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80'
    });
  };

  const handleEditPoster = (poster) => {
    setEditingPosterId(poster.id);
    setPosterForm({ ...poster });
    window.scrollTo({ top: 280, behavior: 'smooth' });
  };

  const handleCancelPosterEdit = () => {
    setEditingPosterId(null);
    setPosterForm({
      title: '',
      title_hi: '',
      tagline: '',
      tagline_hi: '',
      badge: '🔥 ADMISSIONS OPEN 2026-27',
      badge_hi: '🔥 सत्र 2026-27 नामांकन प्रारंभ',
      description: '',
      description_hi: '',
      discount: 'Scholarship up to 100%',
      validTill: '31 March 2026',
      organizer: 'Target IIT & NEET Foundation',
      phone: '+91 93350 44556',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80'
    });
  };

  const handleDeletePoster = (posterId) => {
    if (postersList.length <= 1) {
      alert('At least one promotional poster must remain active in the carousel.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this poster from the landing carousel?')) return;
    const updated = postersList.filter(p => p.id !== posterId);
    setPostersList(updated);
    savePromoPosters(updated);
  };

  // --- 4. GLOBAL NOTICES BROADCAST HANDLERS (ADD / EDIT / DELETE) ---
  const handleSaveBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim()) return;

    let updated;
    if (editingBroadcastId) {
      updated = broadcastList.map(b => b.id === editingBroadcastId ? {
        ...b,
        title: broadcastTitle,
        title_hi: broadcastTitleHi,
        content: broadcastContent,
        content_hi: broadcastContentHi,
        target_audience: broadcastAudience,
        priority: broadcastPriority,
        category: broadcastCategory,
        author: broadcastAuthor || 'Platform Admin',
        date: new Date().toISOString().split('T')[0]
      } : b);
      setEditingBroadcastId(null);
      setNoticeSuccess('Broadcast notice updated successfully!');
    } else {
      const newBroadcast = {
        id: 'not-glob-' + Date.now(),
        title: broadcastTitle,
        title_hi: broadcastTitleHi,
        content: broadcastContent,
        content_hi: broadcastContentHi,
        target_audience: broadcastAudience,
        priority: broadcastPriority,
        category: broadcastCategory,
        author: broadcastAuthor || 'Platform Admin',
        date: new Date().toISOString().split('T')[0],
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

      updated = [newBroadcast, ...broadcastList];
      setNoticeSuccess('Notice broadcasted to landing page & target users!');
    }

    setBroadcastList(updated);
    saveStoredBroadcasts(updated);

    // Reset Form
    setBroadcastTitle('');
    setBroadcastTitleHi('');
    setBroadcastContent('');
    setBroadcastContentHi('');
    setBroadcastPriority('normal');
    setBroadcastAudience('all');
    setBroadcastCategory('platform');
    setBroadcastAuthor('Platform Admin');

    setTimeout(() => setNoticeSuccess(''), 4000);
  };

  const handleEditBroadcast = (item) => {
    setEditingBroadcastId(item.id);
    setBroadcastTitle(item.title || '');
    setBroadcastTitleHi(item.title_hi || '');
    setBroadcastContent(item.content || '');
    setBroadcastContentHi(item.content_hi || '');
    setBroadcastAudience(item.target_audience || 'all');
    setBroadcastPriority(item.priority || 'normal');
    setBroadcastCategory(item.category || 'platform');
    setBroadcastAuthor(item.author || 'Platform Admin');
    window.scrollTo({ top: 250, behavior: 'smooth' });
  };

  const handleCancelBroadcastEdit = () => {
    setEditingBroadcastId(null);
    setBroadcastTitle('');
    setBroadcastTitleHi('');
    setBroadcastContent('');
    setBroadcastContentHi('');
    setBroadcastPriority('normal');
    setBroadcastAudience('all');
    setBroadcastCategory('platform');
    setBroadcastAuthor('Platform Admin');
  };

  const handleDeleteBroadcast = async (noticeId) => {
    if (!window.confirm('Are you sure you want to delete this broadcast notice? It will be removed from the landing page.')) return;
    try {
      await api.deleteBroadcastNotice(noticeId);
    } catch (e) {}

    const updated = broadcastList.filter(n => n.id !== noticeId);
    setBroadcastList(updated);
    saveStoredBroadcasts(updated);
  };

  // --- 5. RESET ALL LANDING DATA TO DEFAULT SHOWCASE ---
  const handleResetDefaults = () => {
    if (!window.confirm('Reset all landing page data (posters, coachings, broadcasts, and CMS text) back to default showcase? Custom edits will be cleared.')) return;
    resetAllLandingDataToDefault();
    setCmsForm(DEFAULT_CMS_CONTENT);
    setPromotionsList(DEFAULT_COACHING_PARTNERS);
    setPostersList(DEFAULT_PROMO_POSTERS);
    setBroadcastList(DEFAULT_GLOBAL_BROADCASTS);
    alert('All landing page content has been reset to default showcase data.');
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
                Supervise verified teachers, approve user profile updates, add co-administrators, and control visitor landing page dynamic showcases.
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
              <p className="text-xs text-slate-400 font-semibold">Active Students</p>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">24 Enrolled</h3>
              <span className="text-[10px] text-slate-400 font-medium">Across 3 batches</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-xs text-slate-400 font-semibold">Live Coachings Spotlight</p>
              <h3 className="text-2xl font-extrabold text-amber-500 mt-1">{promotionsList.length} Academies</h3>
              <span className="text-[10px] text-slate-400 font-medium">On visitor page</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-xs text-slate-400 font-semibold">Active Broadcasts</p>
              <h3 className="text-2xl font-extrabold text-rose-600 mt-1">{broadcastList.length} Notices</h3>
              <span className="text-[10px] text-slate-400 font-medium">Live broadcasting</span>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => setActiveTab('approvals')}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-brand-500 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-600">Workflow</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600">{profileRequests.length}</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Review Profile Requests</h4>
              <p className="text-xs text-slate-400 mt-1">Approve teacher/student phone & guardian details.</p>
            </div>

            <div 
              onClick={() => setActiveTab('admins')}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-brand-500 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-brand-600">Access</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-brand-600">{adminsList.length}</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Administrator Accounts</h4>
              <p className="text-xs text-slate-400 mt-1">Manage platform operators and root privileges.</p>
            </div>

            <div 
              onClick={() => setActiveTab('cms')}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-brand-500 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-600">Visitor Page</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Landing Page Dynamic CMS</h4>
              <p className="text-xs text-slate-400 mt-1">Add/Edit coachings, carousel posters & banner ticker.</p>
            </div>
          </div>

        </div>
      )}

      {/* 2. PROFILE UPDATE APPROVAL WORKFLOW */}
      {activeTab === 'approvals' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Profile Update Approval Requests
            </h2>
            <p className="text-xs text-slate-400">
              Users cannot edit critical profile information directly. Review and approve their change requests here.
            </p>
          </div>

          <div className="space-y-4">
            {profileRequests.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">All caught up!</p>
                <p className="text-xs text-slate-400 mt-1">No pending profile change requests require admin review.</p>
              </div>
            ) : (
              profileRequests.map((req) => (
                <div 
                  key={req.id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{req.user_name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-50 text-brand-700">
                        {req.user_role}
                      </span>
                      <span className="text-xs text-slate-400">({req.user_email})</span>
                    </div>

                    <p className="text-xs text-slate-500">
                      Coaching Mentor: <span className="font-bold text-slate-700 dark:text-slate-200">{req.target_teacher_name || 'Direct Admin'}</span>
                    </p>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-xs space-y-1">
                      <p className="font-semibold text-slate-700 dark:text-slate-300">Requested Information Changes:</p>
                      {Object.entries(req.requested_changes).map(([k, v]) => (
                        <p key={k} className="text-slate-500">
                          <span className="font-mono font-medium text-brand-600">{k}:</span> {String(v)}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => handleReviewProfileRequest(req.id, false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleReviewProfileRequest(req.id, true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
                    >
                      Approve & Update
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* 3. ADMIN MANAGEMENT */}
      {activeTab === 'admins' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Administrator Accounts & Permissions
            </h2>
            <p className="text-xs text-slate-400">
              Only platform administrators can add or revoke administrator access.
            </p>
          </div>

          {/* Add Admin Form */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-brand-600" />
              <span>Create New Platform Administrator</span>
            </h3>

            <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Admin Name</label>
                <input
                  type="text"
                  required
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  placeholder="e.g. Vikramaditya Singh"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  placeholder="admin@shikshagram.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Secure Password</label>
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
                <label className="block font-semibold mb-1">Role Title</label>
                <input
                  type="text"
                  value={newAdmin.role_title}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role_title: e.target.value })}
                  placeholder="Operations Admin"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Admin</span>
                </button>
              </div>
            </form>
          </div>

          {/* Admins List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Platform Administrators ({adminsList.length})</h4>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {adminsList.map((adm) => (
                <div key={adm.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{adm.name}</span>
                      {adm.is_root && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Root Admin
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">{adm.email} • {adm.role_title} • Created {adm.created_at}</p>
                  </div>

                  {!adm.is_root && (
                    <button
                      onClick={() => setAdminsList(prev => prev.filter(a => a.id !== adm.id))}
                      className="text-rose-500 hover:underline font-semibold"
                    >
                      Revoke Access
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 4. LANDING PAGE & PROMOTIONS CMS (DYNAMIC VISITOR SHOWCASE CONTROLS) */}
      {activeTab === 'cms' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header & Subtab Bar with Reset to Default button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/60 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Live Dynamic Landing Controls</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Landing Page CMS, Coaching & Offers Manager
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage promotional carousel posters, verified coaching academy cards, and live announcements displayed to public visitors.
              </p>
            </div>

            <button
              onClick={handleResetDefaults}
              className="self-start md:self-auto px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all flex items-center gap-1.5 shadow-xs"
              title="Reset all dynamic content back to original defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset to Default Showcase</span>
            </button>
          </div>

          {/* Subtab Selector */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl shadow-inner">
            <button
              type="button"
              onClick={() => setCmsSubTab('coachings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                cmsSubTab === 'coachings'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building className="w-4 h-4 text-brand-500" />
              <span>🏫 Coaching Spotlight Directory ({promotionsList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setCmsSubTab('posters')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                cmsSubTab === 'posters'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-500" />
              <span>🎯 Promotional Posters & Carousel ({postersList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setCmsSubTab('hero')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                cmsSubTab === 'hero'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>✍️ Hero Headlines & Marquee Ticker</span>
            </button>
          </div>

          {/* --- SUBTAB 1: COACHING SPOTLIGHT DIRECTORY (ADD / EDIT / DELETE) --- */}
          {cmsSubTab === 'coachings' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Add / Edit Coaching Form */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {editingPromoId ? (
                      <>
                        <Edit className="w-4 h-4 text-amber-500" />
                        <span>Editing Coaching: <span className="text-brand-600 font-bold">{promoForm.coaching_name}</span></span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-emerald-500" />
                        <span>Add & Publish Verified Coaching Academy</span>
                      </>
                    )}
                  </h3>

                  {editingPromoId && (
                    <button
                      type="button"
                      onClick={handleCancelPromoEdit}
                      className="px-3 py-1 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel Edit</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleSavePromotion} className="space-y-3.5 text-xs">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Coaching Institute Name</label>
                      <input
                        type="text"
                        required
                        value={promoForm.coaching_name}
                        onChange={(e) => setPromoForm({ ...promoForm, coaching_name: e.target.value })}
                        placeholder="e.g. Sharma Science & Math Academy"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Mentor Name & Qualifications</label>
                      <input
                        type="text"
                        required
                        value={promoForm.mentor_name}
                        onChange={(e) => setPromoForm({ ...promoForm, mentor_name: e.target.value })}
                        placeholder="e.g. Dr. Rajesh Sharma (Ph.D, 15+ Yrs Exp)"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Subjects Taught</label>
                      <input
                        type="text"
                        required
                        value={promoForm.subjects}
                        onChange={(e) => setPromoForm({ ...promoForm, subjects: e.target.value })}
                        placeholder="Class 9th-12th Mathematics & Physics"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Target Category</label>
                      <select
                        value={promoForm.category}
                        onChange={(e) => setPromoForm({ ...promoForm, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                      >
                        <option value="boards">Board Prep (Class 9th-12th)</option>
                        <option value="jee_neet">IIT-JEE & NEET Foundation</option>
                        <option value="science">Science & Mathematics</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Highlight Badge</label>
                      <input
                        type="text"
                        value={promoForm.badge}
                        onChange={(e) => setPromoForm({ ...promoForm, badge: e.target.value })}
                        placeholder="Top Rated Institute / Verified Academy"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Active Students</label>
                      <input
                        type="number"
                        value={promoForm.student_count}
                        onChange={(e) => setPromoForm({ ...promoForm, student_count: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Rating (Out of 5)</label>
                      <input
                        type="number"
                        step="0.1"
                        max="5.0"
                        min="3.0"
                        value={promoForm.rating}
                        onChange={(e) => setPromoForm({ ...promoForm, rating: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={promoForm.contact_phone}
                        onChange={(e) => setPromoForm({ ...promoForm, contact_phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Location</label>
                      <input
                        type="text"
                        value={promoForm.location}
                        onChange={(e) => setPromoForm({ ...promoForm, location: e.target.value })}
                        placeholder="Civil Lines, Center Hall A"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Key Achievement Tag</label>
                      <input
                        type="text"
                        value={promoForm.achievements}
                        onChange={(e) => setPromoForm({ ...promoForm, achievements: e.target.value })}
                        placeholder="e.g. 98.2% District Topper in 2025"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Tagline</label>
                      <input
                        type="text"
                        value={promoForm.tagline}
                        onChange={(e) => setPromoForm({ ...promoForm, tagline: e.target.value })}
                        placeholder="Excellence in CBSE & State Board Preparation"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Mentor Avatar Photo URL</label>
                      <input
                        type="text"
                        value={promoForm.image_url}
                        onChange={(e) => setPromoForm({ ...promoForm, image_url: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Card Cover Banner URL</label>
                      <input
                        type="text"
                        value={promoForm.banner_url}
                        onChange={(e) => setPromoForm({ ...promoForm, banner_url: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Detailed Description & Features</label>
                    <textarea
                      rows={2}
                      value={promoForm.description}
                      onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })}
                      placeholder="Specialized coaching in board exam pattern with weekly mock tests, NCERT exemplar solving, formula cheat sheets, and personal mentorship."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    {editingPromoId && (
                      <button
                        type="button"
                        onClick={handleCancelPromoEdit}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingPromoId ? 'Update Coaching Spotlight' : 'Publish to Visitor Directory'}</span>
                    </button>
                  </div>

                </form>

              </div>

              {/* Coaching Showcase List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Active Coaching Spotlights ({promotionsList.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">All live on visitor landing page</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {promotionsList.map(p => (
                    <div 
                      key={p.id}
                      className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <img 
                          src={p.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                          alt={p.coaching_name}
                          className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-brand-500/20"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">{p.coaching_name}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                              {p.badge}
                            </span>
                          </div>
                          <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold">{p.mentor_name} • {p.subjects}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{p.description}</p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium pt-1">
                            <span className="flex items-center gap-1 text-amber-500 font-bold">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{p.rating || 4.9}</span>
                            </span>
                            <span>{p.student_count || 80}+ Students</span>
                            <span>{p.location || 'Campus'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEditPromotion(p)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors"
                          title="Edit Coaching"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePromotion(p.id)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-500 hover:text-rose-600 transition-colors"
                          title="Remove Coaching"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* --- SUBTAB 2: PROMOTIONAL CAROUSEL POSTERS & OFFERS (ADD / EDIT / DELETE) --- */}
          {cmsSubTab === 'posters' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Add / Edit Poster Form */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {editingPosterId ? (
                      <>
                        <Edit className="w-4 h-4 text-amber-500" />
                        <span>Editing Poster: <span className="text-amber-600 font-bold">{posterForm.title}</span></span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-emerald-500" />
                        <span>Add New Promotional Banner Poster (Landing Carousel)</span>
                      </>
                    )}
                  </h3>

                  {editingPosterId && (
                    <button
                      type="button"
                      onClick={handleCancelPosterEdit}
                      className="px-3 py-1 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel Edit</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleSavePoster} className="space-y-3.5 text-xs">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Poster Headline (English)</label>
                      <input
                        type="text"
                        required
                        value={posterForm.title}
                        onChange={(e) => setPosterForm({ ...posterForm, title: e.target.value })}
                        placeholder="e.g. Super-30 Advanced IIT-JEE & NEET Rankers Batch"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Poster Headline (Hindi)</label>
                      <input
                        type="text"
                        value={posterForm.title_hi}
                        onChange={(e) => setPosterForm({ ...posterForm, title_hi: e.target.value })}
                        placeholder="e.g. सुपर-30 जेईई व नीट रैंकर बैच 2026-27"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Subtitle / Tagline (English)</label>
                      <input
                        type="text"
                        value={posterForm.tagline}
                        onChange={(e) => setPosterForm({ ...posterForm, tagline: e.target.value })}
                        placeholder="Guided by IIT-BHU and AIIMS Alumni Mentors • Limited 30 Seats"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Subtitle / Tagline (Hindi)</label>
                      <input
                        type="text"
                        value={posterForm.tagline_hi}
                        onChange={(e) => setPosterForm({ ...posterForm, tagline_hi: e.target.value })}
                        placeholder="आईआईटी व एम्स मेंटर्स द्वारा मार्गदर्शन • केवल 30 सीटें उपलब्ध"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Badge Text (English)</label>
                      <input
                        type="text"
                        value={posterForm.badge}
                        onChange={(e) => setPosterForm({ ...posterForm, badge: e.target.value })}
                        placeholder="🔥 ADMISSIONS OPEN 2026-27"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-amber-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Special Discount / Offer</label>
                      <input
                        type="text"
                        value={posterForm.discount}
                        onChange={(e) => setPosterForm({ ...posterForm, discount: e.target.value })}
                        placeholder="Scholarship up to 100%"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Valid Till Date</label>
                      <input
                        type="text"
                        value={posterForm.validTill}
                        onChange={(e) => setPosterForm({ ...posterForm, validTill: e.target.value })}
                        placeholder="31 March 2026"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">WhatsApp Contact Phone</label>
                      <input
                        type="text"
                        value={posterForm.phone}
                        onChange={(e) => setPosterForm({ ...posterForm, phone: e.target.value })}
                        placeholder="+91 93350 44556"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Banner Background Image URL</label>
                    <input
                      type="text"
                      required
                      value={posterForm.image}
                      onChange={(e) => setPosterForm({ ...posterForm, image: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-[11px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Description (English)</label>
                      <textarea
                        rows={2}
                        value={posterForm.description}
                        onChange={(e) => setPosterForm({ ...posterForm, description: e.target.value })}
                        placeholder="Intensive problem-solving, daily 4-hour concept mastery, weekly All-India rank test series, and 1-on-1 personal mentorship."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Description (Hindi)</label>
                      <textarea
                        rows={2}
                        value={posterForm.description_hi}
                        onChange={(e) => setPosterForm({ ...posterForm, description_hi: e.target.value })}
                        placeholder="दैनिक 4 घंटे गहन अभ्यास, वीकली ऑल-इंडिया टेस्ट सीरीज, एनसीईआरटी मास्टरक्लास और 24x7 शंका समाधान।"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    {editingPosterId && (
                      <button
                        type="button"
                        onClick={handleCancelPosterEdit}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingPosterId ? 'Update Banner Poster' : 'Publish Poster to Landing Carousel'}</span>
                    </button>
                  </div>

                </form>

              </div>

              {/* Active Posters List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Active Landing Carousel Posters ({postersList.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">Auto-rotates every 5 seconds on visitor page</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {postersList.map(poster => (
                    <div 
                      key={poster.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                    >
                      <div className="relative h-28 w-full overflow-hidden bg-slate-800">
                        <img 
                          src={poster.image} 
                          alt={poster.title} 
                          className="w-full h-full object-cover filter brightness-[0.6]" 
                        />
                        <div className="absolute inset-0 p-3 flex flex-col justify-between text-white">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-brand-500 self-start">
                            {poster.badge}
                          </span>
                          <h5 className="font-bold text-xs truncate drop-shadow-sm">{poster.title}</h5>
                        </div>
                      </div>

                      <div className="p-4 space-y-2 text-xs">
                        <p className="text-amber-500 font-bold text-[11px]">{poster.tagline}</p>
                        <p className="text-slate-500 line-clamp-2">{poster.description}</p>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                          <span className="font-bold text-emerald-600">{poster.discount}</span>
                          <span className="text-slate-400">Valid: {poster.validTill}</span>
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800/60 mt-1">
                        <button
                          type="button"
                          onClick={() => handleEditPoster(poster)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 text-slate-700 dark:text-slate-200 hover:text-brand-600 text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePoster(poster.id)}
                          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-rose-500 hover:text-rose-600 transition-colors"
                          title="Delete Poster"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* --- SUBTAB 3: HERO TEXTS & MARQUEE ANNOUNCEMENTS --- */}
          {cmsSubTab === 'hero' && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Visitor Page Hero Headings & Marquee Ticker</h3>

              <form onSubmit={handleSaveLandingCMS} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Live Marquee Announcement Ticker (English)</label>
                  <input
                    type="text"
                    value={cmsForm.promotions_banner}
                    onChange={(e) => setCmsForm({ ...cmsForm, promotions_banner: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Live Marquee Announcement Ticker (Hindi)</label>
                  <input
                    type="text"
                    value={cmsForm.promotions_banner_hi}
                    onChange={(e) => setCmsForm({ ...cmsForm, promotions_banner_hi: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Hero Main Title (English)</label>
                    <input
                      type="text"
                      value={cmsForm.hero_title}
                      onChange={(e) => setCmsForm({ ...cmsForm, hero_title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Hero Main Title (Hindi)</label>
                    <input
                      type="text"
                      value={cmsForm.hero_title_hi}
                      onChange={(e) => setCmsForm({ ...cmsForm, hero_title_hi: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Hero Subtitle (English)</label>
                    <textarea
                      rows={2}
                      value={cmsForm.hero_subtitle}
                      onChange={(e) => setCmsForm({ ...cmsForm, hero_subtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Hero Subtitle (Hindi)</label>
                    <textarea
                      rows={2}
                      value={cmsForm.hero_subtitle_hi}
                      onChange={(e) => setCmsForm({ ...cmsForm, hero_subtitle_hi: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save & Update Landing Page</span>
                  </button>
                </div>
              </form>
            </div>
          )}

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
                    onClick={() => handleVerifyTeacher(pt.id, false)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleVerifyTeacher(pt.id, true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                  >
                    Verify & Activate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'उपयोगकर्ता प्रबंधन' : 'User Management'}
              </h2>
              <p className="text-xs text-slate-400">View registered teachers and students, manage access status.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[600px]">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Coaching / Batch</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'teacher' ? 'bg-indigo-50 text-brand-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{u.coaching}</td>
                      <td className="py-3 px-4">
                        {u.isBlocked ? (
                          <span className="text-rose-600 font-bold flex items-center gap-1 text-[11px]">
                            <UserX className="w-3.5 h-3.5" /> Deactivated
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleBlock(u.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            u.isBlocked 
                              ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' 
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                          title={u.isBlocked ? 'Reactivate User' : 'Deactivate User'}
                        >
                          {u.isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. BATCH OPERATIONS */}
      {activeTab === 'batches' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-brand-600" />
                <span>{lang === 'hi' ? 'बैच प्रबंधन व शिक्षक आवंटन' : 'Batch Operations & Teacher Allocation'}</span>
              </h2>
              <p className="text-xs text-slate-400">Oversee all coaching batches and reassign educators as required.</p>
            </div>

            <button
              onClick={() => setShowCreateBatchModal(true)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Batch</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {batchesList.map((batch) => (
              <div key={batch.id} className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600">
                      {batch.status}
                    </span>
                    <span className="text-xs font-bold text-brand-600">₹{batch.fees}/mo</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{batch.name}</h4>
                  <p className="text-xs text-brand-600 font-semibold">{batch.subject}</p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    <span>Teacher: <strong className="text-slate-700 dark:text-slate-200">{batch.teacher_name}</strong></span>
                  </p>
                  <p className="text-[11px] text-slate-400">{batch.schedule} • {batch.room}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px] font-medium">{batch.students_count} / {batch.capacity} Students</span>
                  <button
                    onClick={() => {
                      const newT = prompt('Enter new Teacher Name for this batch:', batch.teacher_name);
                      if (newT) handleAssignTeacher(batch.id, newT, 'teacher-custom');
                    }}
                    className="text-brand-600 hover:underline font-bold text-[11px]"
                  >
                    Reassign Teacher
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. GLOBAL NOTICES & LIVE BROADCASTS CENTER (ADD / EDIT / DELETE) */}
      {activeTab === 'broadcasts' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-rose-600" />
                <span>{lang === 'hi' ? 'सार्वजनिक सूचना व लाइव ब्रॉडकास्ट' : 'Global Notices & Live Broadcasts Center'}</span>
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hi' 
                  ? 'छात्रों, शिक्षकों या सभी उपयोगकर्ताओं के लिए तत्काल सार्वजनिक घोषणाएं प्रसारित करें एवं लैंडिंग पेज पर लाइव दिखाएं।' 
                  : 'Broadcast announcements to target user roles and display them live on the visitor landing page.'}
              </p>
            </div>

            <div className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 border border-rose-200">
              🔴 Live Broadcast Center ({broadcastList.length} Active)
            </div>
          </div>

          {noticeSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{noticeSuccess}</span>
            </div>
          )}

          {/* Broadcast Form (Add / Edit) */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {editingBroadcastId ? (
                  <>
                    <Edit className="w-4 h-4 text-amber-500" />
                    <span>Editing Broadcast: <span className="text-rose-600 font-bold">{broadcastTitle}</span></span>
                  </>
                ) : (
                  <>
                    <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span>Compose & Broadcast New Announcement</span>
                  </>
                )}
              </h3>

              {editingBroadcastId && (
                <button
                  type="button"
                  onClick={handleCancelBroadcastEdit}
                  className="px-3 py-1 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel Edit</span>
                </button>
              )}
            </div>
            
            <form onSubmit={handleSaveBroadcast} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Notice Headline (English)</label>
                  <input
                    type="text"
                    required
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="e.g. Important Update: Annual Scholarship Test Date Announced"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Notice Headline (Hindi)</label>
                  <input
                    type="text"
                    value={broadcastTitleHi}
                    onChange={(e) => setBroadcastTitleHi(e.target.value)}
                    placeholder="e.g. महत्वपूर्ण सूचना: वार्षिक छात्रवृत्ति परीक्षा तिथि घोषित"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Target Audience</label>
                  <select
                    value={broadcastAudience}
                    onChange={(e) => setBroadcastAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <option value="all">All Platform Users (Public & Internal)</option>
                    <option value="teachers">Coaching Teachers Only</option>
                    <option value="students">Students Only</option>
                    <option value="parents">Parents Only</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Priority Level</label>
                  <select
                    value={broadcastPriority}
                    onChange={(e) => setBroadcastPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <option value="normal">Normal Announcement 📢</option>
                    <option value="urgent">Urgent / Alert Notice 🔥</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Category Tag</label>
                  <select
                    value={broadcastCategory}
                    onChange={(e) => setBroadcastCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <option value="scholarship">Scholarship & Admissions 🏆</option>
                    <option value="academic">Academic & Exams 🎓</option>
                    <option value="platform">System & Guidelines 📢</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Issuing Authority</label>
                  <input
                    type="text"
                    value={broadcastAuthor}
                    onChange={(e) => setBroadcastAuthor(e.target.value)}
                    placeholder="Platform Admin / Director"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Detailed Message (English)</label>
                  <textarea
                    rows={3}
                    required
                    value={broadcastContent}
                    onChange={(e) => setBroadcastContent(e.target.value)}
                    placeholder="Enter complete notice text, guidelines, instructions, or links..."
                    className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Detailed Message (Hindi)</label>
                  <textarea
                    rows={3}
                    value={broadcastContentHi}
                    onChange={(e) => setBroadcastContentHi(e.target.value)}
                    placeholder="विस्तृत सूचना संदेश यहाँ लिखें..."
                    className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                {editingBroadcastId && (
                  <button
                    type="button"
                    onClick={handleCancelBroadcastEdit}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-all"
                >
                  <Radio className="w-4 h-4" />
                  <span>{editingBroadcastId ? 'Update Broadcast Notice' : 'Broadcast Notice to Target Users & Landing Page'}</span>
                </button>
              </div>

            </form>
          </div>

          {/* Broadcast History */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Platform Broadcasts ({broadcastList.length})</h3>
            
            <div className="space-y-3">
              {broadcastList.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.priority === 'urgent' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {item.priority === 'urgent' ? '🚨 URGENT' : '📢 NORMAL'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        Audience: {item.target_audience}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.content}</p>
                    <p className="text-[11px] text-slate-400">By {item.author} • {item.created_at || item.date || 'Recent'}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditBroadcast(item)}
                      className="p-2 text-slate-600 dark:text-slate-300 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      title="Edit Notice"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBroadcast(item.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl transition-colors"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* CREATE BATCH MODAL */}
      {showCreateBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-100 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Platform Batch</h3>

            <form onSubmit={handleCreateBatch} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Batch Name</label>
                <input
                  type="text"
                  required
                  value={newBatchForm.name}
                  onChange={(e) => setNewBatchForm({ ...newBatchForm, name: e.target.value })}
                  placeholder="e.g. Class 11th - Chemistry Crash Course"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newBatchForm.subject}
                  onChange={(e) => setNewBatchForm({ ...newBatchForm, subject: e.target.value })}
                  placeholder="e.g. Organic & Inorganic Chemistry"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Monthly Fees (₹)</label>
                  <input
                    type="number"
                    value={newBatchForm.fees}
                    onChange={(e) => setNewBatchForm({ ...newBatchForm, fees: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={newBatchForm.capacity}
                    onChange={(e) => setNewBatchForm({ ...newBatchForm, capacity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Schedule</label>
                  <input
                    type="text"
                    value={newBatchForm.schedule}
                    onChange={(e) => setNewBatchForm({ ...newBatchForm, schedule: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Room / Hall</label>
                  <input
                    type="text"
                    value={newBatchForm.room}
                    onChange={(e) => setNewBatchForm({ ...newBatchForm, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateBatchModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md"
                >
                  Create Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
