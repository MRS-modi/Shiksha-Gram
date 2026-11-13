import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Upload, 
  Send, 
  FileText, 
  Award, 
  AlertTriangle, 
  Search, 
  Filter, 
  DollarSign, 
  Sparkles, 
  ChevronRight, 
  Share2, 
  ExternalLink,
  Trash2,
  Edit,
  Bot,
  UserCheck,
  UserX,
  Check,
  X,
  Clock4,
  Info,
  History,
  BookOpen,
  UserMinus,
  CheckSquare,
  Square,
  ClipboardList,
  FileQuestion,
  TrendingUp,
  HelpCircle,
  Eye,
  Bell,
  Receipt,
  Download,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
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
import { api } from '../../services/api';
import { WhatsAppShareModal } from '../../components/WhatsAppShareModal';
import { 
  getMockData, 
  saveMockBatches, 
  saveMockStudents, 
  saveMockRequests, 
  saveMockMaterials, 
  saveMockNotices, 
  saveMockFees,
  saveMockTests,
  saveMockAssignments
} from '../../services/mockData';

export const TeacherWorkspace = ({ activeTab = 'overview', setActiveTab }) => {
  const { user, submitProfileEdit } = useAuth();
  const { lang, t } = useLanguage();

  const [data, setData] = useState(getMockData());
  const [selectedBatchId, setSelectedBatchId] = useState('batch-1');
  const [batchSubTab, setBatchSubTab] = useState('roster'); // roster, attendance, marks, resources, approvals
  const [searchTerm, setSearchTerm] = useState('');

  // Student Profile Change Requests
  const [profileRequests, setProfileRequests] = useState([
    {
      id: 'pr-demo-1',
      user_id: 'student-1',
      user_name: 'Aman Verma',
      user_email: 'student@shikshagram.com',
      user_role: 'student',
      target_teacher_name: 'Dr. Rajesh Sharma',
      requested_changes: {
        phone: '+91 98765 00001',
        guardian_phone: '+91 98765 00002',
        address: '45 Tagore Nagar, Civil Lines'
      },
      status: 'pending',
      created_at: '2026-11-12T17:30:00Z'
    }
  ]);
  const [profileRequestsLoading, setProfileRequestsLoading] = useState(false);

  // Teacher Profile Settings State (Edits require Admin verification)
  const [teacherForm, setTeacherForm] = useState({
    name: user?.name || 'Dr. Rajesh Sharma',
    email: user?.email || 'teacher@shikshagram.com',
    phone: user?.phone || '+91 98765 43210',
    coaching_name: user?.coaching_name || user?.coachingName || 'Sharma Science & Math Academy',
    address: user?.address || 'Civil Lines, Prayagraj, UP',
    qualifications: user?.qualifications || 'Ph.D in Mathematics, M.Sc, B.Ed',
    experience_years: user?.experience_years || 15,
    subjects: user?.subjects || 'Class 9th-12th Mathematics, IIT-JEE Foundation',
    bio: user?.bio || 'Dedicated to empowering students with conceptual mathematics and physics foundation.'
  });
  const [teacherProfileSubmitting, setTeacherProfileSubmitting] = useState(false);
  const [teacherProfileNotice, setTeacherProfileNotice] = useState('');
  const [myProfileStatus, setMyProfileStatus] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setProfileRequestsLoading(true);
        const res = await api.getPendingProfileRequests();
        if (res && Array.isArray(res) && res.length > 0) {
          setProfileRequests(res);
        } else {
          const local = JSON.parse(localStorage.getItem('sg_profile_requests') || '[]');
          const pending = local.filter(r => r.user_role === 'student' && r.status === 'pending');
          if (pending.length > 0) setProfileRequests(pending);
        }
      } catch (err) {
        const local = JSON.parse(localStorage.getItem('sg_profile_requests') || '[]');
        const pending = local.filter(r => r.user_role === 'student' && r.status === 'pending');
        if (pending.length > 0) setProfileRequests(pending);
      } finally {
        setProfileRequestsLoading(false);
      }
    };

    const fetchMyStatus = async () => {
      try {
        const res = await api.getMyPendingProfileRequest();
        if (res) setMyProfileStatus(res);
      } catch (err) {
        const local = JSON.parse(localStorage.getItem('sg_profile_requests') || '[]');
        const myReq = local.slice().reverse().find(r => r.user_id === user?.id);
        if (myReq) setMyProfileStatus(myReq);
      }
    };

    fetchRequests();
    fetchMyStatus();
  }, [user?.id]);

  // Modals state
  const [showCreateBatchModal, setShowCreateBatchModal] = useState(false);
  const [showEditBatchModal, setShowEditBatchModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', phone: '', guardianPhone: '' });
  const [showAttendanceHistoryModal, setShowAttendanceHistoryModal] = useState(false);
  const [historyStudent, setHistoryStudent] = useState(null);
  const [showMarkAttendanceModal, setShowMarkAttendanceModal] = useState(false);
  const [showUploadMarksModal, setShowUploadMarksModal] = useState(false);
  const [showUploadMaterialModal, setShowUploadMaterialModal] = useState(false);
  const [showEditMaterialModal, setShowEditMaterialModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [showPostNoticeModal, setShowPostNoticeModal] = useState(false);
  const [showEditNoticeModal, setShowEditNoticeModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', subject: 'Mathematics', dueDate: '', maxMarks: 25, instructions: '' });
  const [showReviewAssignmentModal, setShowReviewAssignmentModal] = useState(false);
  const [selectedAssignmentForReview, setSelectedAssignmentForReview] = useState(null);
  const [showAIDoubtModal, setShowAIDoubtModal] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppData, setWhatsAppData] = useState({ title: '', text: '', phone: '' });

  // Filter states
  const [materialFilterSubject, setMaterialFilterSubject] = useState('all');
  const [materialSearchTerm, setMaterialSearchTerm] = useState('');

  // Form states
  const [newBatch, setNewBatch] = useState({ name: '', subject: '', schedule: '', room: '', fees: 1500, capacity: 35 });
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [newTest, setNewTest] = useState({ testName: '', subject: 'Mathematics', maxMarks: 100, date: new Date().toISOString().split('T')[0] });
  const [studentMarksInput, setStudentMarksInput] = useState({});
  const [newMaterial, setNewMaterial] = useState({ title: '', subject: 'Mathematics', type: 'pdf', url: '', description: '' });
  const [newNotice, setNewNotice] = useState({ title: '', content: '', priority: 'normal', isGlobal: false });

  // Current batch object
  const currentBatch = data.batches.find(b => b.id === selectedBatchId) || data.batches[0];
  const batchStudents = data.students.filter(s => s.batchId === selectedBatchId);
  const weakStudents = data.students.filter(s => s.attendanceRate < 75 || s.lastScore < 50);

  // Quick stats
  const totalStudentsCount = data.students.length;
  const activeBatchesCount = data.batches.length;
  const pendingRequestsCount = data.enrollmentRequests.filter(r => r.status === 'pending').length;
  const pendingFeesTotal = data.fees.filter(f => f.status === 'pending').reduce((acc, f) => acc + f.amount, 0);

  // Chart data
  const attendanceChartData = [
    { day: 'Mon', attendance: 92 },
    { day: 'Tue', attendance: 88 },
    { day: 'Wed', attendance: 95 },
    { day: 'Thu', attendance: 91 },
    { day: 'Fri', attendance: 96 },
    { day: 'Sat', attendance: 89 },
  ];

  // Actions
  const handleAcceptRequest = (reqId) => {
    const req = data.enrollmentRequests.find(r => r.id === reqId);
    if (!req) return;

    const newStudent = {
      id: 'student-' + Date.now(),
      name: req.studentName,
      rollNumber: 'SG-2026-0' + (data.students.length + 42),
      email: req.email,
      phone: req.phone,
      guardianPhone: req.phone,
      batchId: req.batchId,
      batchName: req.batchName,
      attendanceRate: 100,
      lastScore: null,
      parentPin: String(Math.floor(1000 + Math.random() * 9000)),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${req.email}`,
      status: 'enrolled',
      enrolledDate: new Date().toISOString().split('T')[0]
    };

    const updatedStudents = [...data.students, newStudent];
    const updatedRequests = data.enrollmentRequests.filter(r => r.id !== reqId);
    
    // update batch count
    const updatedBatches = data.batches.map(b => b.id === req.batchId ? { ...b, studentsCount: b.studentsCount + 1 } : b);

    saveMockStudents(updatedStudents);
    saveMockRequests(updatedRequests);
    saveMockBatches(updatedBatches);
    setData(prev => ({ ...prev, students: updatedStudents, enrollmentRequests: updatedRequests, batches: updatedBatches }));
  };

  const handleRejectRequest = (reqId) => {
    const updatedRequests = data.enrollmentRequests.filter(r => r.id !== reqId);
    saveMockRequests(updatedRequests);
    setData(prev => ({ ...prev, enrollmentRequests: updatedRequests }));
  };

  const handleCreateBatch = (e) => {
    e.preventDefault();
    const created = {
      id: 'batch-' + Date.now(),
      name: newBatch.name,
      subject: newBatch.subject,
      schedule: newBatch.schedule,
      room: newBatch.room || 'Room 101',
      fees: Number(newBatch.fees),
      capacity: Number(newBatch.capacity),
      studentsCount: 0,
      teacherName: user?.name || 'Dr. Rajesh Sharma',
      teacherId: user?.id || 'teacher-1'
    };
    const updated = [...data.batches, created];
    saveMockBatches(updated);
    setData(prev => ({ ...prev, batches: updated }));
    setSelectedBatchId(created.id);
    setShowCreateBatchModal(false);
  };

  const handleSaveAttendance = () => {
    // Generate WhatsApp Summary
    const presentCount = Object.values(attendanceRecords).filter(v => v === 'present').length;
    const absentStudents = batchStudents.filter(s => attendanceRecords[s.id] === 'absent');
    
    const summaryMsg = `📊 *Shiksha Gram Attendance Alert*\nBatch: ${currentBatch.name}\nDate: ${attendanceDate}\nPresent: ${presentCount}/${batchStudents.length}\n${absentStudents.length > 0 ? `Absent students: ${absentStudents.map(s => s.name).join(', ')}` : '100% Attendance recorded! 🎉'}\n\n- Dr. Rajesh Sharma (Shiksha Gram)`;

    setWhatsAppData({
      title: lang === 'hi' ? 'उपस्थिति रिपोर्ट व्हाट्सएप पर भेजें' : 'Share Attendance on WhatsApp',
      text: summaryMsg,
      phone: ''
    });
    setShowMarkAttendanceModal(false);
    setShowWhatsAppModal(true);
  };

  const handleSaveMarks = (e) => {
    e.preventDefault();
    const scores = batchStudents.map(s => {
      const scoreVal = Number(studentMarksInput[s.id] || 0);
      const pct = (scoreVal / newTest.maxMarks) * 100;
      let grade = 'B';
      if (pct >= 90) grade = 'A+';
      else if (pct >= 80) grade = 'A';
      else if (pct >= 60) grade = 'B';
      else if (pct >= 40) grade = 'C';
      else grade = 'D';

      return {
        studentId: s.id,
        studentName: s.name,
        score: scoreVal,
        grade,
        remarks: pct >= 80 ? 'Good conceptual clarity' : 'Needs practice'
      };
    });

    const createdTest = {
      id: 'test-' + Date.now(),
      batchId: selectedBatchId,
      testName: newTest.testName,
      subject: newTest.subject,
      date: newTest.date,
      maxMarks: newTest.maxMarks,
      scores
    };

    const updatedTests = [createdTest, ...data.tests];
    saveMockTests(updatedTests);
    setData(prev => ({ ...prev, tests: updatedTests }));
    setShowUploadMarksModal(false);

    // Prompt WhatsApp Share
    const topScorer = scores.sort((a,b) => b.score - a.score)[0];
    const reportMsg = `📝 *Test Results Published*\nBatch: ${currentBatch.name}\nTest: ${newTest.testName} (${newTest.subject})\nMax Marks: ${newTest.maxMarks}\nTopper: ${topScorer?.studentName} (${topScorer?.score}/${newTest.maxMarks})\nCheck complete scorecards on Shiksha Gram student portal!`;

    setWhatsAppData({
      title: lang === 'hi' ? 'रिजल्ट घोषणा व्हाट्सएप पर साझा करें' : 'Share Result Announcement',
      text: reportMsg,
      phone: ''
    });
    setShowWhatsAppModal(true);
  };

  const handleSaveMaterial = (e) => {
    e.preventDefault();
    const mat = {
      id: 'mat-' + Date.now(),
      batchId: selectedBatchId,
      title: newMaterial.title,
      subject: newMaterial.subject,
      type: newMaterial.type,
      url: newMaterial.url || '#',
      description: newMaterial.description,
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [mat, ...data.materials];
    saveMockMaterials(updated);
    setData(prev => ({ ...prev, materials: updated }));
    setShowUploadMaterialModal(false);
  };

  const handleSaveNotice = (e) => {
    e.preventDefault();
    const not = {
      id: 'not-' + Date.now(),
      title: newNotice.title,
      content: newNotice.content,
      priority: newNotice.priority,
      date: new Date().toISOString().split('T')[0],
      author: user?.name || 'Dr. Rajesh Sharma',
      batchName: newNotice.isGlobal ? 'All Batches' : currentBatch.name,
      isGlobal: newNotice.isGlobal
    };
    const updated = [not, ...data.notices];
    saveMockNotices(updated);
    setData(prev => ({ ...prev, notices: updated }));
    setShowPostNoticeModal(false);
  };

  const handleMarkFeePaid = (feeId) => {
    const updated = data.fees.map(f => {
      if (f.id === feeId) {
        return {
          ...f,
          status: 'paid',
          receiptNo: 'REC-SG-' + Date.now().toString().slice(-6),
          paidDate: new Date().toISOString().split('T')[0]
        };
      }
      return f;
    });
    saveMockFees(updated);
    setData(prev => ({ ...prev, fees: updated }));
  };

  const handleReviewProfileRequest = async (requestId, approve) => {
    try {
      await api.reviewProfileRequest(requestId, approve);
    } catch (err) {
      const local = JSON.parse(localStorage.getItem('sg_profile_requests') || '[]');
      const updated = local.map(r => {
        if (r.id === requestId) return { ...r, status: approve ? 'approved' : 'rejected' };
        return r;
      });
      localStorage.setItem('sg_profile_requests', JSON.stringify(updated));
    }

    setProfileRequests(prev => prev.filter(r => r.id !== requestId));
    alert(
      approve
        ? (lang === 'hi' ? 'छात्र प्रोफ़ाइल परिवर्तन स्वीकृत और सिस्टम में अपडेट कर दिया गया।' : 'Student profile edit approved and applied to database.')
        : (lang === 'hi' ? 'अनुरोध अस्वीकार कर दिया गया।' : 'Student profile edit request rejected.')
    );
  };

  const handleTeacherProfileSubmit = async (e) => {
    e.preventDefault();
    setTeacherProfileSubmitting(true);
    setTeacherProfileNotice('');

    const changes = {
      phone: teacherForm.phone,
      coaching_name: teacherForm.coaching_name,
      address: teacherForm.address,
      qualifications: teacherForm.qualifications,
      experience_years: Number(teacherForm.experience_years) || 10,
      subjects: teacherForm.subjects,
      bio: teacherForm.bio
    };

    try {
      const res = await submitProfileEdit(changes);
      setTeacherProfileNotice(res.message || 'Profile edit submitted. Waiting for approval by Administrator.');
      setMyProfileStatus({ status: 'pending', requested_changes: changes });
    } catch (err) {
      setTeacherProfileNotice('Profile edit request submitted. Awaiting Administrator approval.');
      setMyProfileStatus({ status: 'pending', requested_changes: changes });
    } finally {
      setTeacherProfileSubmitting(false);
    }
  };

  // Batch Operations
  const handleOpenEditBatch = (batch) => {
    setEditingBatch({
      id: batch.id,
      name: batch.name,
      subject: batch.subject,
      schedule: batch.schedule,
      room: batch.room || 'Room 101',
      fees: batch.fees || 1500,
      capacity: batch.capacity || 35
    });
    setShowEditBatchModal(true);
  };

  const handleSaveBatchEdit = (e) => {
    e.preventDefault();
    const updated = data.batches.map(b => b.id === editingBatch.id ? { 
      ...b, 
      ...editingBatch, 
      fees: Number(editingBatch.fees), 
      capacity: Number(editingBatch.capacity) 
    } : b);
    saveMockBatches(updated);
    setData(prev => ({ ...prev, batches: updated }));
    setShowEditBatchModal(false);
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const st = {
      id: 'student-' + Date.now(),
      name: newStudent.name,
      rollNumber: 'SG-2026-0' + (data.students.length + 43),
      email: newStudent.email || `${newStudent.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: newStudent.phone || '+91 98000 00000',
      guardianPhone: newStudent.guardianPhone || newStudent.phone || '+91 98000 00000',
      batchId: selectedBatchId,
      batchName: currentBatch?.name || 'Class 10th - Board Mastery',
      attendanceRate: 100,
      lastScore: null,
      parentPin: String(Math.floor(1000 + Math.random() * 9000)),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${newStudent.name}`,
      status: 'enrolled',
      enrolledDate: new Date().toISOString().split('T')[0]
    };
    const updatedStudents = [...data.students, st];
    const updatedBatches = data.batches.map(b => b.id === selectedBatchId ? { ...b, studentsCount: b.studentsCount + 1 } : b);
    saveMockStudents(updatedStudents);
    saveMockBatches(updatedBatches);
    setData(prev => ({ ...prev, students: updatedStudents, batches: updatedBatches }));
    setShowAddStudentModal(false);
    setNewStudent({ name: '', email: '', phone: '', guardianPhone: '' });
  };

  const handleRemoveStudent = (studentId, studentName) => {
    if (!window.confirm(lang === 'hi' 
      ? `क्या आप वाकई "${studentName}" को इस बैच से हटाना चाहते हैं?` 
      : `Are you sure you want to remove "${studentName}" from this batch?`)) {
      return;
    }
    const updatedStudents = data.students.filter(s => s.id !== studentId);
    const updatedBatches = data.batches.map(b => b.id === selectedBatchId ? { ...b, studentsCount: Math.max(0, b.studentsCount - 1) } : b);
    saveMockStudents(updatedStudents);
    saveMockBatches(updatedBatches);
    setData(prev => ({ ...prev, students: updatedStudents, batches: updatedBatches }));
  };

  const handleOpenAttendanceHistory = (student) => {
    setHistoryStudent(student);
    setShowAttendanceHistoryModal(true);
  };

  // Study Materials Edit & Delete
  const handleOpenEditMaterial = (m) => {
    setEditingMaterial({ ...m });
    setShowEditMaterialModal(true);
  };

  const handleSaveMaterialEdit = (e) => {
    e.preventDefault();
    const updated = data.materials.map(m => m.id === editingMaterial.id ? editingMaterial : m);
    saveMockMaterials(updated);
    setData(prev => ({ ...prev, materials: updated }));
    setShowEditMaterialModal(false);
  };

  const handleDeleteMaterial = (id, title) => {
    if (!window.confirm(lang === 'hi' ? `क्या आप वाकई "${title}" सामग्री को हटाना चाहते हैं?` : `Are you sure you want to delete "${title}"?`)) {
      return;
    }
    const updated = data.materials.filter(m => m.id !== id);
    saveMockMaterials(updated);
    setData(prev => ({ ...prev, materials: updated }));
  };

  // Homework & Assignments
  const handleCreateAssignment = (e) => {
    e.preventDefault();
    const asg = {
      id: 'asg-' + Date.now(),
      batchId: selectedBatchId,
      batchName: currentBatch?.name || 'Class 10th - Board Mastery',
      title: newAssignment.title,
      subject: newAssignment.subject,
      dueDate: newAssignment.dueDate || new Date(Date.now() + 5*86400000).toISOString().split('T')[0],
      maxMarks: Number(newAssignment.maxMarks),
      instructions: newAssignment.instructions,
      totalSubmissions: 0,
      status: 'active'
    };
    const updated = [asg, ...(data.assignments || [])];
    saveMockAssignments(updated);
    setData(prev => ({ ...prev, assignments: updated }));
    setShowCreateAssignmentModal(false);
    setNewAssignment({ title: '', subject: 'Mathematics', dueDate: '', maxMarks: 25, instructions: '' });

    const msg = `📚 *New Homework Assigned*\nBatch: ${asg.batchName}\nSubject: ${asg.subject}\nTitle: ${asg.title}\nDue Date: ${asg.dueDate}\nMax Marks: ${asg.maxMarks}\nInstructions: ${asg.instructions}\n\nPlease submit via Shiksha Gram or in class before due date!`;
    setWhatsAppData({
      title: lang === 'hi' ? 'गृहकार्य अधिसूचना व्हाट्सएप पर साझा करें' : 'Announce Homework on WhatsApp',
      text: msg,
      phone: ''
    });
    setShowWhatsAppModal(true);
  };

  // Notices Edit & Delete
  const handleOpenEditNotice = (n) => {
    setEditingNotice({ ...n });
    setShowEditNoticeModal(true);
  };

  const handleSaveNoticeEdit = (e) => {
    e.preventDefault();
    const updated = data.notices.map(n => n.id === editingNotice.id ? editingNotice : n);
    saveMockNotices(updated);
    setData(prev => ({ ...prev, notices: updated }));
    setShowEditNoticeModal(false);
  };

  const handleDeleteNotice = (id, title) => {
    if (!window.confirm(lang === 'hi' ? `क्या आप वाकई "${title}" सूचना को हटाना चाहते हैं?` : `Are you sure you want to delete this notice?`)) {
      return;
    }
    const updated = data.notices.filter(n => n.id !== id);
    saveMockNotices(updated);
    setData(prev => ({ ...prev, notices: updated }));
  };

  // Shiksha AI Guided Tutor
  const handleAskAI = (promptText) => {
    const q = promptText || aiQuery;
    if (!q) return;
    setAiLoading(true);
    setTimeout(() => {
      setAiAnswer(
        lang === 'hi' 
          ? `💡 *शिखा एआई समाधान*\nविषय: गणित / विज्ञान\nप्रश्न: "${q}"\n\n📌 *हल के मुख्य चरण:*\n1. संबंधित मूल प्रमेय अथवा सूत्र की पहचान करें।\n2. प्रश्न में दिए गए मानों को मानक इकाइयों (SI Units) में रखें।\n3. चरण-दर-चरण गणना करें और अंतिम उत्तर को रेखांकित करें।\n\n🎯 *बोर्ड परीक्षा टिप:* उत्तर के अंत में मात्रक (Unit) लिखना कभी न भूलें, इसके 1 अंक निर्धारित होते हैं!`
          : `💡 *Shiksha AI Guided Solution*\nSubject: STEM Curriculum\nQuestion: "${q}"\n\n📌 *Step-by-Step Breakdown:*\n1. Identify governing formulas and boundary conditions.\n2. Substitute values systematically adhering to SI units.\n3. Simplify equations step-by-step and verify dimensions.\n\n🎯 *Board Exam Tip:* Always highlight final answers with proper units to secure full step marks!`
      );
      setAiLoading(false);
    }, 500);
  };

  // Weak Student Remedial Alert
  const handleAlertWeakStudent = (student) => {
    const msg = `⚠️ *Shiksha Gram Academic Performance Alert*\nDear Parent of *${student.name}*,\nStudent Roll No: ${student.rollNumber}\nBatch: ${student.batchName}\nAttendance Rate: *${student.attendanceRate}%* (Required: 75%)\nLast Test Score: *${student.lastScore !== null ? student.lastScore + '%' : 'Pending'}*\n\nWe recommend a quick mentor check-in with ${user?.name || 'Dr. Rajesh Sharma'} to improve foundational understanding.\n\n- Sharma Science & Math Academy`;

    setWhatsAppData({
      title: lang === 'hi' ? `${student.name} के अभिभावक को चेतावनी भेजें` : `Alert Parent of ${student.name}`,
      text: msg,
      phone: student.guardianPhone
    });
    setShowWhatsAppModal(true);
  };

  // Timetable and Schedule Data
  const weeklyTimetable = [
    { day: 'Monday', time: '3:00 PM - 4:15 PM', batch: 'Class 9th - Science Spark', room: 'Room 104', subject: 'Integrated Science' },
    { day: 'Monday', time: '4:30 PM - 6:00 PM', batch: 'Class 10th - Board Mastery', room: 'Hall A (Room 201)', subject: 'Mathematics' },
    { day: 'Tuesday', time: '5:00 PM - 6:30 PM', batch: 'Class 12th - Physics Foundation', room: 'Science Lab 3', subject: 'Physics' },
    { day: 'Wednesday', time: '3:00 PM - 4:15 PM', batch: 'Class 9th - Science Spark', room: 'Room 104', subject: 'Chemistry Lab' },
    { day: 'Wednesday', time: '4:30 PM - 6:00 PM', batch: 'Class 10th - Board Mastery', room: 'Hall A (Room 201)', subject: 'Science (Physics)' },
    { day: 'Thursday', time: '5:00 PM - 6:30 PM', batch: 'Class 12th - Physics Foundation', room: 'Science Lab 3', subject: 'Electrostatics' },
    { day: 'Friday', time: '3:00 PM - 4:15 PM', batch: 'Class 9th - Science Spark', room: 'Room 104', subject: 'Mathematics Foundation' },
    { day: 'Friday', time: '4:30 PM - 6:00 PM', batch: 'Class 10th - Board Mastery', room: 'Hall A (Room 201)', subject: 'Trigonometry Problem Solving' },
    { day: 'Saturday', time: '5:00 PM - 6:30 PM', batch: 'Class 12th - Physics Foundation', room: 'Science Lab 3', subject: 'JEE Foundation & Numericals' },
  ];

  const upcomingTestsList = [
    {
      id: 'up-1',
      testName: 'Trigonometric Identities & Heights Major Test',
      batchName: 'Class 10th - Board Mastery',
      date: '2026-11-16',
      maxMarks: 100,
      syllabus: 'NCERT Chapter 8 & 9 Complete',
      daysLeft: '3 days left'
    },
    {
      id: 'up-2',
      testName: 'Ray Optics & Wave Optics Full Unit Test',
      batchName: 'Class 12th - Physics Foundation',
      date: '2026-11-19',
      maxMarks: 70,
      syllabus: 'Reflection, Refraction, Optical Instruments & Interference',
      daysLeft: '6 days left'
    },
    {
      id: 'up-3',
      testName: 'Force & Laws of Motion Assessment',
      batchName: 'Class 9th - Science Spark',
      date: '2026-11-22',
      maxMarks: 50,
      syllabus: 'Newton 3 Laws, Momentum Numericals',
      daysLeft: '9 days left'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* 2.1 OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Top Banner with reference "Coursue" layout & gradient aesthetic */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-700 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {lang === 'hi' ? 'शिक्षक नियंत्रण कक्ष' : 'Teacher Master Hub'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                {lang === 'hi' ? `नमस्ते, ${user?.name || 'डॉ. राजेश शर्मा'}! 👋` : `Good day, ${user?.name || 'Dr. Rajesh Sharma'}! 👋`}
              </h2>
              <p className="mt-2 text-white/80 text-xs sm:text-sm leading-relaxed">
                {lang === 'hi'
                  ? 'आज 3 बैच निर्धारित हैं। सभी उपस्थिति, छात्र प्रगति और नोटिस यहाँ से तुरंत प्रबंधित करें।'
                  : 'You have 3 active coaching batches today. Mark attendance, upload marks, and share notes.'}
              </p>

              {/* Quick Action buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => {
                    const initial = {};
                    batchStudents.forEach(s => { initial[s.id] = 'present'; });
                    setAttendanceRecords(initial);
                    setShowMarkAttendanceModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-white text-brand-700 hover:bg-slate-100 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('markAttendanceBtn')}</span>
                </button>

                <button
                  onClick={() => setShowUploadMarksModal(true)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>{lang === 'hi' ? 'अंक दर्ज करें' : 'Upload Marks'}</span>
                </button>

                <button
                  onClick={() => setShowUploadMaterialModal(true)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4 text-white" />
                  <span>{t('uploadMaterialBtn')}</span>
                </button>

                <button
                  onClick={() => setShowPostNoticeModal(true)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>{t('createNoticeBtn')}</span>
                </button>
              </div>
            </div>

            <div className="absolute right-6 bottom-4 opacity-15 hidden md:block pointer-events-none">
              <img src="/logo-icon-light.png" alt="Shiksha Gram" className="w-52 h-52 object-contain" />
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">{t('totalStudents')}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalStudentsCount}</h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Across all batches</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">{t('activeBatches')}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{activeBatchesCount}</h3>
                <span className="text-[10px] text-brand-600 dark:text-brand-400 font-medium">Daily running</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">{t('todayAttendance')}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">91.8%</h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">+2.4% vs last week</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">{t('feeCollection')}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">₹{pendingFeesTotal.toLocaleString()}</h3>
                <span className="text-[10px] text-rose-500 font-medium">1 student pending</span>
              </div>
            </div>

          </div>

          {/* Main Grid: Left (Classes & Pending) - Right (Attendance Analytics & Weak Students) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Columns */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Today's Schedule Cards */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-600" />
                    <span>{lang === 'hi' ? 'आज की कक्षाएं व समय' : "Today's Schedule & Batches"}</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('classes')}
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    {lang === 'hi' ? 'सभी बैच देखें' : 'View All'}
                  </button>
                </div>

                <div className="space-y-3">
                  {data.batches.map((batch) => (
                    <div
                      key={batch.id}
                      onClick={() => {
                        setSelectedBatchId(batch.id);
                        setActiveTab('classes');
                      }}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 border border-slate-100 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold text-xs">
                          {batch.name.split(' ')[1] || 'Cl'}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-brand-600 transition-colors">
                            {batch.name}
                          </h4>
                          <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{batch.schedule}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-600 dark:text-slate-300">{batch.studentsCount} Students</span>
                          </p>
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Enrollment Requests (Core Requirement in Report Section 2 & 3) */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {lang === 'hi' ? 'लंबित प्रवेश अनुरोध' : 'Pending Enrollment Requests'}
                    </h3>
                    {pendingRequestsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                        {pendingRequestsCount} new
                      </span>
                    )}
                  </div>
                </div>

                {data.enrollmentRequests.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    {lang === 'hi' ? 'कोई नया प्रवेश अनुरोध लंबित नहीं है।' : 'No pending student requests.'}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.enrollmentRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between gap-3"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{req.studentName}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {req.batchName} • <span className="font-mono">{req.phone}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAcceptRequest(req.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t('accept')}</span>
                          </button>

                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-all"
                          >
                            {t('reject')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right 5 Columns: Attendance Chart & Weak Students */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Attendance Chart matching reference design */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {lang === 'hi' ? 'साप्ताहिक उपस्थिति विश्लेषण' : 'Weekly Attendance Trend (%)'}
                  </h3>
                  <span className="text-xs text-brand-600 dark:text-brand-400 font-bold">Avg 91.8%</span>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.4} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <YAxis hide domain={[60, 100]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(val) => [`${val}%`, 'Attendance']}
                      />
                      <Bar dataKey="attendance" fill="#6366F1" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weak Students Alert Card (Report Section 2.3 - Student Support) */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'hi' ? 'ध्यान योग्य छात्र (Weak Students)' : 'Students Needing Attention'}
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">&lt; 75% Att. or &lt; 50% Marks</span>
                </div>

                <div className="space-y-3">
                  {weakStudents.map((ws) => (
                    <div
                      key={ws.id}
                      className="p-3 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={ws.avatar} alt={ws.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{ws.name}</p>
                          <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                            Att: {ws.attendanceRate}% • Score: {ws.lastScore || 0}%
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const msg = `⚠️ *Shiksha Gram Academic Notice*\nDear Parent of ${ws.name},\nWe observed that ${ws.name}'s attendance has dropped to ${ws.attendanceRate}% (Score: ${ws.lastScore}%). Please ensure regular attendance and revision.\n\n- Dr. Rajesh Sharma (Shiksha Gram)`;
                          setWhatsAppData({
                            title: lang === 'hi' ? 'अभिभावक को अलर्ट भेजें' : 'Send Alert to Parent',
                            text: msg,
                            phone: ws.guardianPhone
                          });
                          setShowWhatsAppModal(true);
                        }}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                        title="Alert Parent on WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Alert</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 2.2 MY CLASSES TAB */}
      {activeTab === 'classes' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header & Create Batch CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'कक्षाएं व बैच प्रबंधन' : 'Class & Batch Operations'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hi' ? 'बैच चुनें, छात्रों का रोस्टर देखें व उपस्थिति दर्ज करें' : 'Select a batch to inspect student rosters and contextual sub-tabs'}
              </p>
            </div>

            <button
              onClick={() => setShowCreateBatchModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'hi' ? 'नया बैच बनाएँ' : 'Create New Batch'}</span>
            </button>
          </div>

          {/* Horizontal Batch Tab Selector matching Report Section 2.2 & 3 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {data.batches.map((batch) => {
              const isSelected = selectedBatchId === batch.id;
              return (
                <button
                  key={batch.id}
                  onClick={() => setSelectedBatchId(batch.id)}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-600/25'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>{batch.name}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {batch.studentsCount} Students
                  </span>
                </button>
              );
            })}
          </div>

          {/* Batch Quick Information Card & Action Header */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                  {currentBatch.subject}
                </span>
                <span className="text-xs text-slate-400">• {currentBatch.room}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                {currentBatch.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-brand-500" />
                <span>{currentBatch.schedule}</span>
                <span>•</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">₹{currentBatch.fees} / mo</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{batchStudents.length} / {currentBatch.capacity} Capacity</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleOpenEditBatch(currentBatch)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'बैच विवरण बदलें' : 'Edit Batch'}</span>
              </button>

              <button
                onClick={() => setShowAddStudentModal(true)}
                className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'छात्र जोड़ें' : 'Add Student'}</span>
              </button>
            </div>
          </div>

          {/* Contextual Sub-Tabs (Report Section 2.2: Student Roster, Attendance, Performance, Resources, Approvals) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                <button
                  onClick={() => setBatchSubTab('roster')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    batchSubTab === 'roster'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lang === 'hi' ? 'छात्र रोस्टर' : 'Student Roster'} ({batchStudents.length})
                </button>

                <button
                  onClick={() => setBatchSubTab('attendance')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    batchSubTab === 'attendance'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lang === 'hi' ? 'दैनिक उपस्थिति' : 'Attendance'}
                </button>

                <button
                  onClick={() => setBatchSubTab('performance')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    batchSubTab === 'performance'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lang === 'hi' ? 'टेस्ट प्रदर्शन' : 'Performance'}
                </button>

                <button
                  onClick={() => setBatchSubTab('resources')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    batchSubTab === 'resources'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lang === 'hi' ? 'अध्ययन सामग्री' : 'Materials'} ({data.materials.filter(m => m.batchId === selectedBatchId).length})
                </button>

                <button
                  onClick={() => setBatchSubTab('enrollments')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                    batchSubTab === 'enrollments'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{lang === 'hi' ? 'प्रवेश अनुरोध' : 'Enrollments'}</span>
                  {data.enrollmentRequests.filter(r => r.batchId === selectedBatchId).length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold leading-none">
                      {data.enrollmentRequests.filter(r => r.batchId === selectedBatchId).length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setBatchSubTab('approvals')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap relative flex items-center gap-1.5 ${
                    batchSubTab === 'approvals'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'प्रोफ़ाइल' : 'Approvals'}</span>
                  {profileRequests.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold leading-none">
                      {profileRequests.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Search within batch roster */}
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search students..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {/* SUB-TAB 1: STUDENT ROSTER */}
            {batchSubTab === 'roster' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="pb-3 pl-2">Student</th>
                      <th className="pb-3">Roll No.</th>
                      <th className="pb-3">Guardian Phone</th>
                      <th className="pb-3">Enrolled</th>
                      <th className="pb-3">Attendance %</th>
                      <th className="pb-3">Last Score</th>
                      <th className="pb-3">Parent PIN</th>
                      <th className="pb-3 text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {batchStudents
                      .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 pl-2">
                            <div className="flex items-center gap-2.5">
                              <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{student.name}</span>
                                <p className="text-[10px] text-slate-400">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 font-mono font-semibold text-slate-600 dark:text-slate-300">{student.rollNumber}</td>
                          <td className="py-3.5 font-mono text-slate-500 dark:text-slate-400">{student.guardianPhone}</td>
                          <td className="py-3.5 text-slate-400 text-[11px]">{student.enrolledDate || '2026-08-15'}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              student.attendanceRate >= 85 
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' 
                                : student.attendanceRate >= 75 
                                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                            }`}>
                              {student.attendanceRate}%
                            </span>
                          </td>
                          <td className="py-3.5 font-bold text-slate-700 dark:text-slate-300">
                            {student.lastScore !== null ? `${student.lastScore}%` : 'N/A'}
                          </td>
                          <td className="py-3.5 font-mono text-brand-600 dark:text-brand-400 font-bold">
                            {student.parentPin}
                          </td>
                          <td className="py-3.5 text-right pr-2">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Attendance History Preview */}
                              <button
                                onClick={() => handleOpenAttendanceHistory(student)}
                                className="p-1.5 rounded-lg bg-indigo-50 text-brand-600 dark:bg-indigo-950/60 dark:text-brand-400 hover:bg-indigo-100 transition-colors"
                                title="View Attendance History"
                              >
                                <History className="w-3.5 h-3.5" />
                              </button>

                              {/* WhatsApp Student Progress Card */}
                              <button
                                onClick={() => {
                                  const msg = `🎓 *Shiksha Gram Student Progress Update*\nStudent: ${student.name}\nRoll No: ${student.rollNumber}\nBatch: ${student.batchName}\nAttendance: ${student.attendanceRate}%\nLast Score: ${student.lastScore || 'N/A'}%\nParent Portal Access PIN: ${student.parentPin}\n\n- ${user?.name || 'Dr. Rajesh Sharma'}`;
                                  setWhatsAppData({
                                    title: `Share ${student.name}'s Update`,
                                    text: msg,
                                    phone: student.guardianPhone
                                  });
                                  setShowWhatsAppModal(true);
                                }}
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                                title="Send WhatsApp Card"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Remove Student from Batch */}
                              <button
                                onClick={() => handleRemoveStudent(student.id, student.name)}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                                title="Remove Student from Batch"
                              >
                                <UserMinus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* SUB-TAB 2: ATTENDANCE QUICK MARKER */}
            {batchSubTab === 'attendance' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-brand-600" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {lang === 'hi' ? 'दैनिक उपस्थिति दर्ज करें' : 'Mark Daily Attendance'}
                      </h4>
                      <p className="text-xs text-slate-400">Batch: {currentBatch.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-100"
                    />

                    <button
                      onClick={() => {
                        const allPresent = {};
                        batchStudents.forEach(s => { allPresent[s.id] = 'present'; });
                        setAttendanceRecords(allPresent);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
                    >
                      {t('markAllPresent')}
                    </button>
                  </div>
                </div>

                {/* Live Daily Attendance Counters */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">{batchStudents.length}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
                    <span className="text-[10px] text-emerald-600 font-semibold block uppercase">Present</span>
                    <span className="text-base font-extrabold text-emerald-600">
                      {batchStudents.filter(s => (attendanceRecords[s.id] || 'present') === 'present').length}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40">
                    <span className="text-[10px] text-rose-600 font-semibold block uppercase">Absent</span>
                    <span className="text-base font-extrabold text-rose-600">
                      {batchStudents.filter(s => attendanceRecords[s.id] === 'absent').length}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40">
                    <span className="text-[10px] text-amber-600 font-semibold block uppercase">Late</span>
                    <span className="text-base font-extrabold text-amber-600">
                      {batchStudents.filter(s => attendanceRecords[s.id] === 'late').length}
                    </span>
                  </div>
                </div>

                {/* Student Attendance Marking Roster with P / A / L Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {batchStudents.map(student => {
                    const status = attendanceRecords[student.id] || 'present';
                    return (
                      <div key={student.id} className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">
                        <div className="truncate">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate block">{student.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{student.rollNumber}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setAttendanceRecords(prev => ({ ...prev, [student.id]: 'present' }))}
                            className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${status === 'present' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 dark:bg-slate-700'}`}
                            title="Present"
                          >
                            P
                          </button>
                          <button
                            onClick={() => setAttendanceRecords(prev => ({ ...prev, [student.id]: 'absent' }))}
                            className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${status === 'absent' ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 dark:bg-slate-700'}`}
                            title="Absent"
                          >
                            A
                          </button>
                          <button
                            onClick={() => setAttendanceRecords(prev => ({ ...prev, [student.id]: 'late' }))}
                            className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${status === 'late' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 dark:bg-slate-700'}`}
                            title="Late"
                          >
                            L
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleSaveAttendance}
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'उपस्थिति सुरक्षित करें व व्हाट्सएप समरी भेजें' : 'Save Attendance & Trigger WhatsApp Summary'}</span>
                </button>
              </div>
            )}

            {/* SUB-TAB 3: PERFORMANCE */}
            {batchSubTab === 'performance' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {lang === 'hi' ? 'हालिया टेस्ट परिणाम' : 'Recent Batch Tests & Grades'}
                  </h4>
                  <button
                    onClick={() => setShowUploadMarksModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload New Test</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {data.tests
                    .filter(t => t.batchId === selectedBatchId)
                    .map(test => (
                      <div key={test.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white">{test.testName}</h5>
                            <p className="text-[10px] text-slate-400">{test.subject} • Date: {test.date} • Max: {test.maxMarks}</p>
                          </div>
                          <span className="text-xs font-mono font-bold text-brand-600">{test.scores.length} Scores</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {test.scores.map((sc, i) => (
                            <div key={i} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{sc.studentName}</span>
                              <span className="font-bold font-mono text-emerald-600">{sc.score}/{test.maxMarks} ({sc.grade})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* SUB-TAB 4: BATCH STUDY RESOURCES */}
            {batchSubTab === 'resources' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'hi' ? 'बैच अध्ययन सामग्री' : 'Batch Study Materials'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {lang === 'hi' ? 'इस बैच के लिए साझा की गई नोट्स व व्याख्यान' : 'Curated files, videos, and worksheets for this batch'}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowUploadMaterialModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Resource</span>
                  </button>
                </div>

                {data.materials.filter(m => m.batchId === selectedBatchId).length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                    <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {lang === 'hi' ? 'इस बैच में कोई अध्ययन सामग्री नहीं है।' : 'No study materials for this batch yet.'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {lang === 'hi' ? 'ऊपर दिए बटन से पहली सामग्री अपलोड करें।' : 'Click the upload button above to share notes or video links.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.materials
                      .filter(m => m.batchId === selectedBatchId)
                      .map((mat) => (
                        <div
                          key={mat.id}
                          className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-brand-600 dark:text-brand-400 uppercase">
                                {mat.type}
                              </span>
                              <span className="text-[10px] text-slate-400">{mat.date}</span>
                            </div>
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{mat.title}</h5>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{mat.description}</p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                            <a
                              href={mat.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                            >
                              <span>Open</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditMaterial(mat)}
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                                title="Edit Material"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteMaterial(mat.id, mat.title)}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                                title="Delete Material"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* SUB-TAB 5: BATCH ENROLLMENT REQUESTS */}
            {batchSubTab === 'enrollments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {lang === 'hi' ? 'बैच प्रवेश अनुरोध' : 'Batch Enrollment Requests'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {lang === 'hi' ? 'स्वीकृत छात्र तुरंत बैच रोस्टर में जुड़ जाएंगे' : 'Accepting a request immediately enrolls the student into this batch'}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                    {data.enrollmentRequests.filter(r => r.batchId === selectedBatchId).length} {lang === 'hi' ? 'लंबित' : 'Pending'}
                  </span>
                </div>

                {data.enrollmentRequests.filter(r => r.batchId === selectedBatchId).length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {lang === 'hi' ? 'इस बैच में कोई नया प्रवेश अनुरोध लंबित नहीं है।' : 'No pending enrollment requests for this batch.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.enrollmentRequests
                      .filter(r => r.batchId === selectedBatchId)
                      .map((req) => (
                        <div
                          key={req.id}
                          className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm">
                              {req.studentName.charAt(0)}
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-slate-900 dark:text-white">{req.studentName}</h5>
                              <p className="text-[11px] text-slate-400">{req.email} • {req.phone}</p>
                              <span className="text-[10px] text-slate-400">Requested: {new Date(req.requestedAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRejectRequest(req.id)}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleAcceptRequest(req.id)}
                              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept & Enroll</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* SUB-TAB 6: PROFILE APPROVALS */}
            {batchSubTab === 'approvals' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {lang === 'hi' ? 'छात्र प्रोफ़ाइल संपादन अनुरोध' : 'Student Profile Edit Requests'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {lang === 'hi' ? 'बैच के छात्रों द्वारा दर्ज किए गए नए विवरणों की समीक्षा करें' : 'Verify new contact details or guardian info before updating database'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                    {profileRequests.length} {lang === 'hi' ? 'लंबित' : 'Pending'}
                  </span>
                </div>

                {profileRequests.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {lang === 'hi' ? 'सभी अनुरोध स्वीकृत हैं!' : 'No pending profile update requests'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {lang === 'hi' ? 'सभी छात्रों की प्रोफ़ाइल अप-टू-डेट है।' : 'All student profiles in your batches are currently verified.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {profileRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs">
                              {req.user_name?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <span className="font-bold text-xs text-slate-800 dark:text-slate-100">{req.user_name}</span>
                              <span className="ml-2 text-[11px] text-slate-400">{req.user_email}</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                            Awaiting Batch Approval
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl text-xs">
                          {Object.entries(req.requested_changes || {}).map(([k, v]) => (
                            <div key={k}>
                              <span className="text-[10px] uppercase text-slate-400 font-bold block">{k.replace('_', ' ')}</span>
                              <span className="font-semibold text-slate-700 dark:text-slate-200">{String(v)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => handleReviewProfileRequest(req.id, false)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleReviewProfileRequest(req.id, true)}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Save</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}

      {/* 2.3 ACADEMICS TAB */}
      {activeTab === 'academics' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'अकादमिक रिपोर्ट, टॉपर बोर्ड व छात्र सहायता' : 'Academic Analytics & Toppers Leaderboard'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hi' ? 'कोचिंग के शीर्ष छात्र, विषय-वार प्रदर्शन व कमजोर विद्यार्थियों की सहायता' : 'Institute rankings, score distribution, and student support remedial queue'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{weakStudents.length} Students Need Support</span>
              </span>
            </div>
          </div>

          {/* Coaching Toppers Board matching report section 3 & 2.3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <span className="text-2xl font-black">🥇 1st Rank</span>
              <h4 className="text-lg font-extrabold mt-2">Aman Verma</h4>
              <p className="text-xs text-white/80">Class 10th - Board Mastery</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black">94.0%</span>
                <span className="text-xs text-white/80">Average Score</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-400 to-slate-500 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <span className="text-2xl font-black">🥈 2nd Rank</span>
              <h4 className="text-lg font-extrabold mt-2">Sneha Patel</h4>
              <p className="text-xs text-white/80">Class 12th - Physics Foundation</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black">92.0%</span>
                <span className="text-xs text-white/80">Average Score</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-700 to-amber-800 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <span className="text-2xl font-black">🥉 3rd Rank</span>
              <h4 className="text-lg font-extrabold mt-2">Priya Sharma</h4>
              <p className="text-xs text-white/80">Class 10th - Board Mastery</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black">89.5%</span>
                <span className="text-xs text-white/80">Average Score</span>
              </div>
            </div>

          </div>

          {/* WEAK STUDENTS LIST & REMEDIAL SUPPORT QUEUE (Core Requirement in Planning Report Section 2.3 & 3) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-rose-100 dark:border-rose-950/60 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{lang === 'hi' ? 'कमजोर विद्यार्थी सहायता एवं उपचारात्मक सूची' : 'Weak Students Support & Remedial Queue'}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold">
                      Threshold: &lt;75% Attendance or &lt;50% Marks
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'hi'
                      ? 'इन विद्यार्थियों को विशेष ध्यान व अभिभावक सूचना की आवश्यकता है।'
                      : 'Students with attendance under 75% or test scores under 50% are automatically queued for mentor intervention.'}
                  </p>
                </div>
              </div>
            </div>

            {weakStudents.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {lang === 'hi' ? 'सभी विद्यार्थी सुरक्षित सीमा में हैं!' : 'Excellent! All students are above academic & attendance thresholds.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weakStudents.map((st) => (
                  <div
                    key={st.id}
                    className="p-5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/60 flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={st.avatar} alt={st.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-400/30" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{st.name}</h4>
                          <p className="text-xs text-slate-400">{st.rollNumber} • {st.batchName}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Guardian: {st.guardianPhone}</p>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${st.attendanceRate < 75 ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200' : 'bg-slate-100 text-slate-600'}`}>
                          Att: {st.attendanceRate}%
                        </span>
                        <br />
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${st.lastScore < 50 ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200' : 'bg-slate-100 text-slate-600'}`}>
                          Score: {st.lastScore !== null ? `${st.lastScore}%` : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between">
                      <span className="text-[11px] text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{st.attendanceRate < 75 && st.lastScore < 50 ? 'Low attendance & score' : st.attendanceRate < 75 ? 'Irregular in class' : 'Needs score improvement'}</span>
                      </span>

                      <button
                        onClick={() => handleAlertWeakStudent(st)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'व्हाट्सएप चेतावनी भेजें' : 'Alert Parent'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Academic Reports & Trends Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-600" />
                <span>{lang === 'hi' ? 'विषय-वार औसत परिणाम' : 'Subject-Wise Performance Overview'}</span>
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Class 10th Mathematics</span>
                    <span className="text-emerald-600 font-bold">88.4% Avg</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88.4%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Class 12th Physics (Board & JEE)</span>
                    <span className="text-brand-600 font-bold">84.2% Avg</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: '84.2%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Class 9th Integrated Science</span>
                    <span className="text-amber-600 font-bold">79.6% Avg</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '79.6%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{lang === 'hi' ? 'ग्रेड वितरण (Grade Distribution)' : 'Overall Grade Distribution'}</span>
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
                  <span className="text-lg font-black text-emerald-600">38%</span>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase mt-0.5">Grade A+</span>
                </div>
                <div className="p-3 bg-brand-50 dark:bg-brand-950/40 rounded-2xl border border-brand-100 dark:border-brand-900/40">
                  <span className="text-lg font-black text-brand-600">42%</span>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase mt-0.5">Grade A</span>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/40">
                  <span className="text-lg font-black text-amber-600">15%</span>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase mt-0.5">Grade B</span>
                </div>
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-100 dark:border-rose-900/40">
                  <span className="text-lg font-black text-rose-600">5%</span>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase mt-0.5">Needs Work</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Leaderboard Table */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {lang === 'hi' ? 'बैच-वार संपूर्ण रैंकिंग सूची' : 'Coaching Institute Comprehensive Leaderboard'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="pb-3 pl-2">Rank</th>
                    <th className="pb-3">Student Name</th>
                    <th className="pb-3">Batch</th>
                    <th className="pb-3">Attendance Rate</th>
                    <th className="pb-3">Academic Score</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {data.students
                    .sort((a,b) => (b.lastScore || 0) - (a.lastScore || 0))
                    .map((st, idx) => (
                      <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 pl-2 font-bold font-mono text-brand-600">#{idx + 1}</td>
                        <td className="py-3.5 font-bold text-slate-800 dark:text-slate-100">{st.name}</td>
                        <td className="py-3.5 text-slate-500">{st.batchName}</td>
                        <td className="py-3.5 font-semibold text-emerald-600">{st.attendanceRate}%</td>
                        <td className="py-3.5 font-bold font-mono text-slate-900 dark:text-white">{st.lastScore}%</td>
                        <td className="py-3.5 text-right pr-2">
                          <button
                            onClick={() => {
                              const msg = `🏆 *Achievement Certificate*\nCongratulations ${st.name} on securing Rank #${idx + 1} with ${st.lastScore}% score in ${st.batchName}!\n\n- Dr. Rajesh Sharma (Shiksha Gram)`;
                              setWhatsAppData({
                                title: 'Congratulate Student & Parents',
                                text: msg,
                                phone: st.guardianPhone
                              });
                              setShowWhatsAppModal(true);
                            }}
                            className="text-xs font-semibold text-brand-600 hover:underline"
                          >
                            Share Certificate
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

      {/* 2.4 LEARNING HUB TAB */}
      {activeTab === 'learning' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {t('studyMaterials')} & Homework
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hi' ? 'पीडीएफ नोट्स, गृहकार्य, गूगल ड्राइव व वीडियो लेक्चर साझा करें' : 'Upload and organize lecture notes, assign homework, and review student submissions'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateAssignmentModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-brand-700 dark:text-brand-300 hover:bg-indigo-100 font-bold text-xs transition-all flex items-center gap-2"
              >
                <ClipboardList className="w-4 h-4 text-brand-600" />
                <span>{lang === 'hi' ? 'गृहकार्य दें' : 'Create Assignment'}</span>
              </button>

              <button
                onClick={() => setShowUploadMaterialModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{t('uploadMaterialBtn')}</span>
              </button>
            </div>
          </div>

          {/* AI Doubt Assistant Widget as specified in report section 2.4 & 7 */}
          <div className="bg-gradient-to-r from-cyan-600 to-brand-600 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-base font-extrabold flex items-center gap-2">
                  <span>{t('aiDoubts')}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-semibold">24x7 Shiksha AI</span>
                </h4>
                <p className="text-xs text-white/80 max-w-lg mt-0.5">
                  {lang === 'hi'
                    ? 'विद्यार्थी घर बैठे किसी भी कठिन प्रश्न का चरण-दर-चरण समाधान हिंदी या अंग्रेजी में प्राप्त कर सकते हैं।'
                    : 'Interactive AI doubt tutor helping students solve complex STEM problems with step-by-step guidance.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAiQuery('');
                  setAiAnswer('');
                  setShowAIDoubtModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-white text-cyan-900 hover:bg-slate-100 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{lang === 'hi' ? 'शंका समाधान डेमो देखें' : 'Test AI Doubt Assistant'}</span>
              </button>
            </div>
          </div>

          {/* HOMEWORK & ASSIGNMENTS SECTION (Section 2.4 Proposal) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-brand-600" />
                <span>{lang === 'hi' ? 'सक्रिय गृहकार्य व असाइनमेंट' : 'Active Homework & Assignments'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-50 dark:bg-indigo-950 text-brand-600 font-bold">
                  {(data.assignments || []).length} active
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(data.assignments || []).map((asg) => (
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
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">{asg.batchName}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed line-clamp-2">
                      {asg.instructions}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Submissions: <strong className="text-slate-800 dark:text-slate-200">{asg.totalSubmissions}</strong> / Max: {asg.maxMarks} marks
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedAssignmentForReview(asg);
                          setShowReviewAssignmentModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-bold transition-colors"
                      >
                        {lang === 'hi' ? 'उत्तर पुस्तिकाएं जांचें' : 'Review Work'}
                      </button>

                      <button
                        onClick={() => {
                          const msg = `📚 *Homework Reminder*\nBatch: ${asg.batchName}\nSubject: ${asg.subject}\nTitle: ${asg.title}\nDue Date: ${asg.dueDate}\nMax Marks: ${asg.maxMarks}\nInstructions: ${asg.instructions}\n\nPlease submit on time!\n- ${user?.name || 'Dr. Rajesh Sharma'}`;
                          setWhatsAppData({
                            title: 'Share Homework Reminder on WhatsApp',
                            text: msg,
                            phone: ''
                          });
                          setShowWhatsAppModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 hover:bg-emerald-100"
                        title="Share on WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Materials Search & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-600" />
              <span>{lang === 'hi' ? 'पाठ्यक्रम अध्ययन सामग्री भंडार' : 'Study Notes & Reference Library'}</span>
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

              <div className="relative w-48 sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={materialSearchTerm}
                  onChange={(e) => setMaterialSearchTerm(e.target.value)}
                  placeholder="Filter notes..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Materials Grid with Edit & Delete actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.materials
              .filter(m => materialFilterSubject === 'all' || m.subject.toLowerCase().includes(materialFilterSubject.toLowerCase()))
              .filter(m => m.title.toLowerCase().includes(materialSearchTerm.toLowerCase()) || m.description?.toLowerCase().includes(materialSearchTerm.toLowerCase()))
              .map((mat) => (
                <div
                  key={mat.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-brand-600 dark:text-brand-400 uppercase">
                        {mat.type}
                      </span>
                      <span className="text-[10px] text-slate-400">{mat.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{mat.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 font-semibold">{mat.subject}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {mat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <a
                      href={mat.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                    >
                      <span>{lang === 'hi' ? 'खोलें / डाउनलोड' : 'Open / View'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditMaterial(mat)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                        title="Edit Material"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteMaterial(mat.id, mat.title)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                        title="Delete Material"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          const msg = `📚 *New Study Material Uploaded*\nTitle: ${mat.title}\nSubject: ${mat.subject}\nLink: ${mat.url}\n\n- Dr. Rajesh Sharma (Shiksha Gram)`;
                          setWhatsAppData({
                            title: 'Share Study Material Link',
                            text: msg,
                            phone: ''
                          });
                          setShowWhatsAppModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                        title="Share to WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

        </div>
      )}

      {/* 2.5 SCHEDULE & FEES TAB */}
      {activeTab === 'schedule' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'समय सारिणी, परीक्षा कैलेंडर व फीस प्रबंधन' : 'Class Timetable, Tests Calendar & Fees'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hi' ? 'साप्ताहिक समय सारिणी, आगामी टेस्ट व छात्रों की शुल्क रसीदें' : 'Weekly batch schedule, scheduled test dates, and official fee payment records'}
              </p>
            </div>
          </div>

          {/* Fee Overview Cards matching Report Section 2.5 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">{lang === 'hi' ? 'कुल मासिक अपेक्षित फीस' : 'Projected Fees (Nov)'}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  ₹{data.fees.reduce((acc, f) => acc + f.amount, 0).toLocaleString()}
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">All enrolled batches</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">{lang === 'hi' ? 'प्राप्त कुल शुल्क' : 'Collected Fees'}</p>
                <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  ₹{data.fees.filter(f => f.status === 'paid').reduce((acc, f) => acc + f.amount, 0).toLocaleString()}
                </h3>
                <span className="text-[10px] text-emerald-600 font-medium">
                  {data.fees.filter(f => f.status === 'paid').length} students settled
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">{lang === 'hi' ? 'बकाया शुल्क' : 'Pending Dues'}</p>
                <h3 className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
                  ₹{pendingFeesTotal.toLocaleString()}
                </h3>
                <span className="text-[10px] text-rose-500 font-medium">
                  {data.fees.filter(f => f.status === 'pending').length} student pending
                </span>
              </div>
            </div>
          </div>

          {/* Timetable Grid & Upcoming Tests Dual Column */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Weekly Timetable Grid (8 Columns) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-600" />
                  <span>{lang === 'hi' ? 'साप्ताहिक कक्षा समय सारिणी' : 'Weekly Batch Class Timetable'}</span>
                </h3>
                <span className="text-xs text-slate-400 font-semibold">Mon - Sat Schedule</span>
              </div>

              <div className="space-y-2.5">
                {weeklyTimetable.map((slot, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 px-2 py-1 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 text-center font-bold text-[10px] uppercase">
                        {slot.day.slice(0, 3)}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100">{slot.batch}</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">{slot.subject} • {slot.room}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono block">
                        {slot.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Tests Calendar (5 Columns) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>{lang === 'hi' ? 'आगामी परीक्षा कैलेंडर' : 'Upcoming Tests Calendar'}</span>
                </h3>
              </div>

              <div className="space-y-3">
                {upcomingTestsList.map((test) => (
                  <div
                    key={test.id}
                    className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                        {test.daysLeft}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">{test.date}</span>
                    </div>

                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">{test.testName}</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">{test.batchName} • Max: {test.maxMarks} marks</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 italic">Syllabus: {test.syllabus}</p>
                    </div>

                    <div className="pt-2 border-t border-amber-200/50 dark:border-amber-900/30 flex justify-end">
                      <button
                        onClick={() => {
                          const msg = `📅 *Upcoming Test Reminder*\nBatch: ${test.batchName}\nTest: ${test.testName}\nDate: ${test.date}\nMax Marks: ${test.maxMarks}\nSyllabus: ${test.syllabus}\n\nPlease prepare thoroughly!\n- ${user?.name || 'Dr. Rajesh Sharma'}`;
                          setWhatsAppData({
                            title: 'Share Test Alert on WhatsApp',
                            text: msg,
                            phone: ''
                          });
                          setShowWhatsAppModal(true);
                        }}
                        className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Send WhatsApp Alert</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Fee Records Table */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'नवंबर 2026 शुल्क विवरण एवं आधिकारिक रसीदें' : 'November 2026 Student Fee Ledger & Payment Receipts'}
              </h3>
              <span className="text-xs font-bold text-slate-500">
                Pending: ₹{pendingFeesTotal.toLocaleString()}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="pb-3 pl-2">Student</th>
                    <th className="pb-3">Batch</th>
                    <th className="pb-3">Month</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Receipt No.</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {data.fees.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 pl-2 font-bold text-slate-800 dark:text-slate-100">{f.studentName}</td>
                      <td className="py-3.5 text-slate-500">{f.batchName}</td>
                      <td className="py-3.5 font-semibold text-slate-600 dark:text-slate-300">{f.month}</td>
                      <td className="py-3.5 font-bold font-mono text-slate-900 dark:text-white">₹{f.amount}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          f.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}>
                          {f.status}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono text-slate-500">{f.receiptNo || '—'}</td>
                      <td className="py-3.5 text-right pr-2">
                        {f.status === 'pending' ? (
                          <button
                            onClick={() => handleMarkFeePaid(f.id)}
                            className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-sm flex items-center gap-1 ml-auto"
                          >
                            <Check className="w-3 h-3" />
                            <span>Mark Paid</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              const msg = `🧾 *Shiksha Gram Official Fee Receipt*\nStudent: ${f.studentName}\nReceipt No: ${f.receiptNo}\nMonth: ${f.month}\nAmount: ₹${f.amount}\nStatus: Paid on ${f.paidDate}\n\nThank you for prompt fee clearance!\n- Sharma Science & Math Academy`;
                              setWhatsAppData({
                                title: 'Share Official Fee Receipt',
                                text: msg,
                                phone: ''
                              });
                              setShowWhatsAppModal(true);
                            }}
                            className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1 ml-auto"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>WhatsApp Slip</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 2.6 COMMUNICATION TAB */}
      {activeTab === 'communication' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'सूचना पटल एवं व्हाट्सएप संचार हब' : 'Notice Board & Communication Hub'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hi' ? 'कोचिंग या बैच के लिए तुरंत घोषणा जारी करें, संपादित करें व अभिभावक रिपोर्ट भेजें' : 'Publish announcements, manage broadcast updates, and trigger WhatsApp progress reports'}
              </p>
            </div>

            <button
              onClick={() => setShowPostNoticeModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{t('createNoticeBtn')}</span>
            </button>
          </div>

          {/* WhatsApp-Friendly Fast Reports Generator Hub (Section 2.6) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'hi' ? 'व्हाट्सएप-फ्रेंडली त्वरित रिपोर्ट जनरेटर' : 'WhatsApp-Friendly Rapid Reports Generator'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <button
                onClick={() => {
                  const msg = `📊 *Shiksha Gram Attendance Summary*\nDate: ${new Date().toISOString().split('T')[0]}\nTotal Batches Running: 3\nToday Average Attendance: 91.8%\n\nRegular attendance ensures concept mastery!\n- ${user?.name || 'Dr. Rajesh Sharma'}`;
                  setWhatsAppData({
                    title: 'Broadcast Attendance Summary',
                    text: msg,
                    phone: ''
                  });
                  setShowWhatsAppModal(true);
                }}
                className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-left hover:shadow-md transition-all group"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                <h5 className="font-bold text-slate-800 dark:text-slate-100">Daily Attendance</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">Share today's batch attendance breakdown</p>
              </button>

              <button
                onClick={() => {
                  const msg = `📝 *Test Scorecards Released*\nCheck the latest chapter assessments on the Shiksha Gram portal.\nToppers have been awarded special certificates!\n\n- ${user?.name || 'Dr. Rajesh Sharma'}`;
                  setWhatsAppData({
                    title: 'Broadcast Test Results Bulletin',
                    text: msg,
                    phone: ''
                  });
                  setShowWhatsAppModal(true);
                }}
                className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40 text-left hover:shadow-md transition-all group"
              >
                <Award className="w-5 h-5 text-brand-600 mb-2 group-hover:scale-110 transition-transform" />
                <h5 className="font-bold text-slate-800 dark:text-slate-100">Test Scorecards</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">Publish test ranks and feedback</p>
              </button>

              <button
                onClick={() => {
                  const msg = `🧾 *Monthly Fee Clearance Reminder*\nDear Parents, please clear pending coaching tuition fees for November 2026. Official computer generated receipts will be provided instantly upon payment.\n\nThank you,\n- Sharma Science & Math Academy`;
                  setWhatsAppData({
                    title: 'Broadcast Fee Reminder Alert',
                    text: msg,
                    phone: ''
                  });
                  setShowWhatsAppModal(true);
                }}
                className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-left hover:shadow-md transition-all group"
              >
                <DollarSign className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                <h5 className="font-bold text-slate-800 dark:text-slate-100">Fee Reminder</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">Send friendly fee due reminders</p>
              </button>

              <button
                onClick={() => {
                  const msg = `🔔 *Coaching Holiday & Schedule Notice*\nAll batches will observe holiday this coming Monday on occasion of festive holiday. Extra doubt class scheduled for next Saturday.\n\n- ${user?.name || 'Dr. Rajesh Sharma'}`;
                  setWhatsAppData({
                    title: 'Broadcast Holiday & Schedule Notice',
                    text: msg,
                    phone: ''
                  });
                  setShowWhatsAppModal(true);
                }}
                className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 text-left hover:shadow-md transition-all group"
              >
                <Calendar className="w-5 h-5 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
                <h5 className="font-bold text-slate-800 dark:text-slate-100">Holiday & Timing</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">Broadcast holiday or timetable update</p>
              </button>
            </div>
          </div>

          {/* Notices List with Edit & Delete */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              <span>{lang === 'hi' ? 'प्रकाशित सूचनाएं व घोषणाएं' : 'Published Coaching Announcements'}</span>
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
                  <span className="text-[11px] text-slate-400 font-medium">Posted by: {n.author}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditNotice(n)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                      title="Edit Notice"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteNotice(n.id, n.title)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        const msg = `📢 *Shiksha Gram Announcement*\n*${n.title}*\nBatch: ${n.batchName}\nDate: ${n.date}\n\n${n.content}\n\n- ${n.author}`;
                        setWhatsAppData({
                          title: 'Broadcast Announcement to WhatsApp',
                          text: msg,
                          phone: ''
                        });
                        setShowWhatsAppModal(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 hover:bg-emerald-100 font-bold transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share on WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 2.8 PROFILE APPROVALS TAB (TEACHER VIEW) */}
      {activeTab === 'approvals' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header Banner matching Coursue theme */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
                <UserCheck className="w-3.5 h-3.5" />
                {lang === 'hi' ? 'छात्र प्रोफ़ाइल अनुमोदन' : 'Student Profile Verification Queue'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                {lang === 'hi' ? 'छात्र प्रोफ़ाइल परिवर्तन समीक्षा' : 'Authorize Student Profile Edits'}
              </h2>
              <p className="mt-2 text-white/90 text-xs sm:text-sm leading-relaxed">
                {lang === 'hi'
                  ? 'जब कोई छात्र अपना फोन नंबर, पता या अभिभावक विवरण बदलता है, तो आपकी या एडमिन की अनुमति के बाद ही वह डेटाबेस में अपडेट होगा।'
                  : 'Student profile changes (contact, address, guardian info) require your batch authorization or Admin approval before updating official records.'}
              </p>
            </div>
          </div>

          {/* Pending Requests Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{lang === 'hi' ? 'लंबित छात्र अनुरोध' : 'Pending Student Change Requests'}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                  {profileRequests.length}
                </span>
              </h3>
            </div>

            {profileRequests.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {lang === 'hi' ? 'कोई लंबित अनुरोध नहीं' : 'All Clear! No Pending Requests'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {lang === 'hi' 
                    ? 'वर्तमान में किसी भी छात्र का प्रोफ़ाइल परिवर्तन अनुमोदन लंबित नहीं है।' 
                    : 'All student profile update requests have been reviewed and applied.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {profileRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                          {req.user_name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            {req.user_name}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {req.user_email} • <span className="text-brand-600 font-semibold">{req.user_role === 'student' ? 'Enrolled Student' : req.user_role}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 flex items-center gap-1.5">
                          <Clock4 className="w-3.5 h-3.5" />
                          <span>{lang === 'hi' ? 'सत्यापन आवश्यक' : 'Awaiting Teacher Action'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Requested Changes Grid */}
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {lang === 'hi' ? 'अनुरोधित नए विवरण:' : 'Requested Modifications:'}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        {Object.entries(req.requested_changes || {}).map(([key, val]) => (
                          <div key={key} className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {key.replace('_', ' ')}
                            </span>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 break-words">
                              {String(val)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => handleReviewProfileRequest(req.id, false)}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1.5"
                      >
                        <X className="w-4 h-4" />
                        <span>{lang === 'hi' ? 'अस्वीकार करें' : 'Reject'}</span>
                      </button>

                      <button
                        onClick={() => handleReviewProfileRequest(req.id, true)}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>{lang === 'hi' ? 'स्वीकार करें व डेटाबेस में अपडेट करें' : 'Approve & Update Database'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2.7 SETTINGS & PROFILE TAB (TEACHER PROFILE WITH ADMIN APPROVAL FLOW) */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
          
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{lang === 'hi' ? 'शिक्षक प्रोफ़ाइल व संस्थान सेटिंग्स' : 'Teacher Profile & Institute Credentials'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'hi'
                    ? 'अपनी प्रोफ़ाइल जानकारी संपादित करें। परिवर्तन व्यवस्थापक (Admin) द्वारा अनुमोदित होने के बाद लागू होंगे।'
                    : 'Manage your coaching credentials. Profile updates are submitted to Administrator for verification.'}
                </p>
              </div>

              {/* Status Badge */}
              <div>
                {myProfileStatus?.status === 'pending' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    <Clock4 className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'एडमिन अनुमोदन प्रतीक्षारत' : 'Admin Approval Pending'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'सत्यापित शिक्षक प्रोफ़ाइल' : 'Verified & Active'}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Notification message if request submitted */}
            {teacherProfileNotice && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{lang === 'hi' ? 'अनुरोध सफलतापूर्वक भेजा गया' : 'Request Submitted Successfully'}</p>
                  <p className="mt-0.5">{teacherProfileNotice}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleTeacherProfileSubmit} className="space-y-4 text-xs">
              
              {/* Account Credentials (Immutable Identity) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">
                    {lang === 'hi' ? 'शिक्षक का पूरा नाम' : 'Teacher Full Name'}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={teacherForm.name}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400">Registered Platform Identity</span>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">
                    {lang === 'hi' ? 'पंजीकृत ईमेल' : 'Registered Email Address'}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={teacherForm.email}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400">Primary login credential</span>
                </div>
              </div>

              {/* Editable Fields Requiring Admin Review */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                    {lang === 'hi' ? 'कोचिंग / संस्थान का नाम' : 'Coaching Institute Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherForm.coaching_name}
                    onChange={(e) => setTeacherForm({ ...teacherForm, coaching_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                    {lang === 'hi' ? 'मोबाइल नंबर (व्हाट्सएप)' : 'Contact Phone (WhatsApp)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherForm.phone}
                    onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                    {lang === 'hi' ? 'शैक्षणिक योग्यताएं (Degrees)' : 'Qualifications / Degrees'}
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherForm.qualifications}
                    onChange={(e) => setTeacherForm({ ...teacherForm, qualifications: e.target.value })}
                    placeholder="e.g. M.Sc, B.Ed, Ph.D"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                    {lang === 'hi' ? 'शिक्षण अनुभव (वर्ष)' : 'Teaching Experience (Years)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={teacherForm.experience_years}
                    onChange={(e) => setTeacherForm({ ...teacherForm, experience_years: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                  {lang === 'hi' ? 'विषय व विशेषज्ञता' : 'Subjects Taught & Specialization'}
                </label>
                <input
                  type="text"
                  required
                  value={teacherForm.subjects}
                  onChange={(e) => setTeacherForm({ ...teacherForm, subjects: e.target.value })}
                  placeholder="e.g. Class 9th-12th Mathematics, Physics, IIT-JEE Foundation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                  {lang === 'hi' ? 'कोचिंग पता / शहर' : 'Institute Address & City'}
                </label>
                <input
                  type="text"
                  required
                  value={teacherForm.address}
                  onChange={(e) => setTeacherForm({ ...teacherForm, address: e.target.value })}
                  placeholder="e.g. 14 Tagore Road, Civil Lines, Prayagraj"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                  {lang === 'hi' ? 'शिक्षक बायो / विवरण' : 'Teacher Bio / Coaching Overview'}
                </label>
                <textarea
                  rows={3}
                  value={teacherForm.bio}
                  onChange={(e) => setTeacherForm({ ...teacherForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Policy note */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'hi' ? 'सुरक्षा नियम:' : 'Security Policy:'}
                </span>{' '}
                {lang === 'hi'
                  ? 'शिक्षक विवरण में कोई भी बदलाव व्यवस्थापक (Admin) की अनुमति के बाद ही लागू होता है ताकि विद्यार्थियों व अभिभावकों को हमेशा प्रमाणित जानकारी मिले।'
                  : 'Teacher profile modifications require Administrator approval before syncing to public coaching listings and parent dashboards.'}
              </div>

              <button
                type="submit"
                disabled={teacherProfileSubmitting}
                className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-brand-600/25 transition-all flex items-center justify-center gap-2"
              >
                {teacherProfileSubmitting ? (
                  <span>{lang === 'hi' ? 'अनुरोध भेजा जा रहा है...' : 'Submitting Request...'}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'एडमिन अनुमोदन हेतु प्रोफ़ाइल अपडेट भेजें' : 'Save Changes (Submit for Admin Approval)'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE BATCH MODAL */}
      {showCreateBatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {lang === 'hi' ? 'नया बैच शुरू करें' : 'Create New Coaching Batch'}
            </h3>
            <form onSubmit={handleCreateBatch} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Batch Name</label>
                <input
                  type="text"
                  required
                  value={newBatch.name}
                  onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                  placeholder="e.g. Class 11th - Chemistry Crash Course"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newBatch.subject}
                  onChange={(e) => setNewBatch({ ...newBatch, subject: e.target.value })}
                  placeholder="e.g. Chemistry"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Schedule & Days</label>
                <input
                  type="text"
                  required
                  value={newBatch.schedule}
                  onChange={(e) => setNewBatch({ ...newBatch, schedule: e.target.value })}
                  placeholder="e.g. Mon, Wed, Fri • 6:00 PM - 7:30 PM"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Monthly Fee (₹)</label>
                  <input
                    type="number"
                    value={newBatch.fees}
                    onChange={(e) => setNewBatch({ ...newBatch, fees: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Student Capacity</label>
                  <input
                    type="number"
                    value={newBatch.capacity}
                    onChange={(e) => setNewBatch({ ...newBatch, capacity: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateBatchModal(false)}
                  className="px-4 py-2 font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl shadow"
                >
                  Create Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD MARKS MODAL */}
      {showUploadMarksModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {lang === 'hi' ? 'टेस्ट के अंक दर्ज करें' : 'Upload Test Marks'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">{currentBatch.name}</p>

            <form onSubmit={handleSaveMarks} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Test Name</label>
                  <input
                    type="text"
                    required
                    value={newTest.testName}
                    onChange={(e) => setNewTest({ ...newTest, testName: e.target.value })}
                    placeholder="Chapter 4 Quadratic Test"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Max Marks</label>
                  <input
                    type="number"
                    required
                    value={newTest.maxMarks}
                    onChange={(e) => setNewTest({ ...newTest, maxMarks: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                {batchStudents.map(student => (
                  <div key={student.id} className="flex items-center justify-between gap-3 p-2 bg-white dark:bg-slate-900 rounded-xl">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{student.name}</span>
                    <input
                      type="number"
                      placeholder="Score"
                      onChange={(e) => setStudentMarksInput({ ...studentMarksInput, [student.id]: e.target.value })}
                      className="w-20 px-2 py-1 text-center rounded-lg border border-slate-200 dark:border-slate-700 font-bold font-mono"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadMarksModal(false)}
                  className="px-4 py-2 font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl shadow"
                >
                  Save & Publish Scores
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD MATERIAL MODAL */}
      {showUploadMaterialModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {lang === 'hi' ? 'स्टडी मैटेरियल अपलोड करें' : 'Upload Study Material'}
            </h3>
            <form onSubmit={handleSaveMaterial} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  placeholder="e.g. Chapter 6 Triangles Theorem Sheet"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Subject</label>
                  <input
                    type="text"
                    value={newMaterial.subject}
                    onChange={(e) => setNewMaterial({ ...newMaterial, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Type</label>
                  <select
                    value={newMaterial.type}
                    onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="video_link">Video Lecture</option>
                    <option value="drive_link">Google Drive Link</option>
                    <option value="notes">Handwritten Notes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">URL / File Link</label>
                <input
                  type="text"
                  required
                  value={newMaterial.url}
                  onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
                  placeholder="https://drive.google.com/... or https://youtube.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadMaterialModal(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl shadow"
                >
                  Publish Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST NOTICE MODAL */}
      {showPostNoticeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {t('createNoticeBtn')}
            </h3>
            <form onSubmit={handleSaveNotice} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="e.g. Extra Class on Saturday"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Message Content</label>
                <textarea
                  rows={3}
                  required
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Write clear instructions for students..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newNotice.isGlobal}
                    onChange={(e) => setNewNotice({ ...newNotice, isGlobal: e.target.checked })}
                    className="rounded"
                  />
                  <span>Broadcast to all batches</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostNoticeModal(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl shadow"
                >
                  Post Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT BATCH MODAL */}
      {showEditBatchModal && editingBatch && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {lang === 'hi' ? 'बैच विवरण संपादित करें' : 'Edit Batch Schedule & Room'}
            </h3>
            <form onSubmit={handleSaveBatchEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Batch Name</label>
                <input
                  type="text"
                  required
                  value={editingBatch.name}
                  onChange={(e) => setEditingBatch({ ...editingBatch, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={editingBatch.subject}
                    onChange={(e) => setEditingBatch({ ...editingBatch, subject: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Room / Hall</label>
                  <input
                    type="text"
                    required
                    value={editingBatch.room}
                    onChange={(e) => setEditingBatch({ ...editingBatch, room: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Schedule & Timing</label>
                <input
                  type="text"
                  required
                  value={editingBatch.schedule}
                  onChange={(e) => setEditingBatch({ ...editingBatch, schedule: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Monthly Fee (₹)</label>
                  <input
                    type="number"
                    value={editingBatch.fees}
                    onChange={(e) => setEditingBatch({ ...editingBatch, fees: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={editingBatch.capacity}
                    onChange={(e) => setEditingBatch({ ...editingBatch, capacity: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditBatchModal(false)}
                  className="px-4 py-2 font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD STUDENT MODAL */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {lang === 'hi' ? 'बैच में नया छात्र जोड़ें' : 'Add Student to Batch'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">{currentBatch.name}</p>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="e.g. Rahul Mishra"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Student Email Address</label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  placeholder="e.g. rahul@example.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Student Phone</label>
                  <input
                    type="text"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Guardian Phone (WhatsApp)</label>
                  <input
                    type="text"
                    required
                    value={newStudent.guardianPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianPhone: e.target.value })}
                    placeholder="+91 98765 11111"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl shadow"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ATTENDANCE HISTORY MODAL */}
      {showAttendanceHistoryModal && historyStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img src={historyStudent.avatar} alt={historyStudent.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{historyStudent.name}</h3>
                  <p className="text-xs text-slate-400">{historyStudent.rollNumber} • {historyStudent.batchName}</p>
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                  historyStudent.attendanceRate >= 85 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                    : historyStudent.attendanceRate >= 75
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {historyStudent.attendanceRate}% Attendance
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Parent PIN: {historyStudent.parentPin}</span>
              </div>
            </div>

            {/* Attendance Sessions Log */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {lang === 'hi' ? 'हालिया दैनिक उपस्थिति लॉग' : 'Recent 7 Daily Attendance Sessions'}
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {[
                  { date: '2026-11-13', day: 'Friday', status: 'present', remarks: 'On time, active participation' },
                  { date: '2026-11-11', day: 'Wednesday', status: 'present', remarks: 'Present' },
                  { date: '2026-11-09', day: 'Monday', status: 'present', remarks: 'Present' },
                  { date: '2026-11-06', day: 'Friday', status: historyStudent.attendanceRate < 75 ? 'absent' : 'present', remarks: historyStudent.attendanceRate < 75 ? 'Uninformed absence - alert sent' : 'Present' },
                  { date: '2026-11-04', day: 'Wednesday', status: 'present', remarks: 'Present' },
                  { date: '2026-11-02', day: 'Monday', status: 'present', remarks: 'Present' },
                  { date: '2026-10-30', day: 'Friday', status: 'late', remarks: '10 min late due to school bus' }
                ].map((log, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-100 font-mono">{log.date}</span>
                      <span className="text-[11px] text-slate-400 ml-2">({log.day})</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{log.remarks}</p>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      log.status === 'present' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : log.status === 'absent'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowAttendanceHistoryModal(false)}
                className="px-4 py-2 font-semibold text-slate-500 hover:text-slate-700 text-xs"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const msg = `📊 *Shiksha Gram Attendance Record*\nStudent: ${historyStudent.name}\nRoll No: ${historyStudent.rollNumber}\nBatch: ${historyStudent.batchName}\nOverall Rate: ${historyStudent.attendanceRate}%\nParent Access PIN: ${historyStudent.parentPin}\n\n- ${user?.name || 'Dr. Rajesh Sharma'}`;
                  setWhatsAppData({
                    title: `Share ${historyStudent.name}'s Attendance`,
                    text: msg,
                    phone: historyStudent.guardianPhone
                  });
                  setShowAttendanceHistoryModal(false);
                  setShowWhatsAppModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share WhatsApp Card</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STUDY MATERIAL MODAL */}
      {showEditMaterialModal && editingMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {lang === 'hi' ? 'सामग्री विवरण संपादित करें' : 'Edit Study Material'}
            </h3>
            <form onSubmit={handleSaveMaterialEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingMaterial.title}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Subject</label>
                  <input
                    type="text"
                    value={editingMaterial.subject}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Type</label>
                  <select
                    value={editingMaterial.type}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="video_link">Video Lecture</option>
                    <option value="drive_link">Google Drive Link</option>
                    <option value="notes">Handwritten Notes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">URL / Link</label>
                <input
                  type="text"
                  required
                  value={editingMaterial.url}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingMaterial.description}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditMaterialModal(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ASSIGNMENT MODAL */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {lang === 'hi' ? 'नया गृहकार्य (असाइनमेंट) बनाएं' : 'Create New Homework Assignment'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">{currentBatch.name}</p>

            <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="e.g. Chapter 8 Trigonometry Exercise 8.4"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Max Marks / Points</label>
                <input
                  type="number"
                  required
                  value={newAssignment.maxMarks}
                  onChange={(e) => setNewAssignment({ ...newAssignment, maxMarks: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Detailed Instructions for Students</label>
                <textarea
                  rows={3}
                  required
                  value={newAssignment.instructions}
                  onChange={(e) => setNewAssignment({ ...newAssignment, instructions: e.target.value })}
                  placeholder="Write questions, proofs, or reference textbook pages..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateAssignmentModal(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl shadow"
                >
                  Assign to Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW ASSIGNMENT SUBMISSIONS MODAL */}
      {showReviewAssignmentModal && selectedAssignmentForReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedAssignmentForReview.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedAssignmentForReview.batchName} • Due: {selectedAssignmentForReview.dueDate} • Max: {selectedAssignmentForReview.maxMarks} marks
              </p>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {batchStudents.map((st, i) => (
                <div key={st.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={st.avatar} alt={st.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{st.name}</span>
                      <p className="text-[10px] text-slate-400">{st.rollNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      i % 4 === 0 
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' 
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {i % 4 === 0 ? 'Pending Submission' : 'Submitted on time'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowReviewAssignmentModal(false)}
                className="px-5 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold rounded-xl text-xs"
              >
                Done Reviewing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT NOTICE MODAL */}
      {showEditNoticeModal && editingNotice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {lang === 'hi' ? 'सूचना संपादित करें' : 'Edit Notice Announcement'}
            </h3>
            <form onSubmit={handleSaveNoticeEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingNotice.title}
                  onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Content</label>
                <textarea
                  rows={3}
                  required
                  value={editingNotice.content}
                  onChange={(e) => setEditingNotice({ ...editingNotice, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Priority</label>
                <select
                  value={editingNotice.priority}
                  onChange={(e) => setEditingNotice({ ...editingNotice, priority: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="exam">Exam Alert</option>
                  <option value="holiday">Holiday</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditNoticeModal(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHIKSHA AI GUIDED DOUBT SOLVER MODAL */}
      {showAIDoubtModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Shiksha AI Doubt Tutor
                </h3>
                <p className="text-xs text-slate-400">Step-by-step NCERT & Board STEM guided solutions</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">
                  {lang === 'hi' ? 'गणित या विज्ञान का प्रश्न टाइप करें:' : 'Enter student question or problem:'}
                </label>
                <textarea
                  rows={2}
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="e.g. Prove that √5 is an irrational number or derive mirror formula"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              {/* Sample Queries */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const q = "Prove that root 5 is irrational using contradiction method";
                    setAiQuery(q);
                    handleAskAI(q);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  √5 Irrational Proof
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const q = "Derive quadratic formula using completing square method";
                    setAiQuery(q);
                    handleAskAI(q);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  Quadratic Formula Derivation
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const q = "State and explain Faraday's Law of Electromagnetic Induction with Lenz Law";
                    setAiQuery(q);
                    handleAskAI(q);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  Faraday & Lenz Law
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleAskAI(aiQuery)}
                disabled={aiLoading || !aiQuery.trim()}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{aiLoading ? 'Thinking...' : 'Solve with Shiksha AI'}</span>
              </button>

              {aiAnswer && (
                <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/30 border border-cyan-200/60 dark:border-cyan-900/40 text-xs text-slate-800 dark:text-slate-200 space-y-2 whitespace-pre-line leading-relaxed max-h-52 overflow-y-auto">
                  {aiAnswer}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAIDoubtModal(false)}
                className="px-4 py-2 text-slate-500 font-semibold text-xs"
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
