// Dynamic Production API Service for Shiksha Gram
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Helper for making API requests with JWT Auth header
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('sg_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || data.message || 'API request failed');
    }
    return data;
  } catch (error) {
    // If backend is offline or network fails, throw to let service handle local dynamic cache
    throw error;
  }
}

export const api = {
  // Authentication
  login: async (email, password) => {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  adminLogin: async (email, password) => {
    return await request('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (signupData) => {
    return await request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });
  },

  googleAuth: async (idToken, role = 'student') => {
    return await request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken, role }),
    });
  },

  // Profile Change Request Workflow
  submitProfileEditRequest: async (requestedChanges) => {
    return await request('/auth/profile/edit-request', {
      method: 'POST',
      body: JSON.stringify({ requested_changes: requestedChanges }),
    });
  },

  getMyPendingProfileRequest: async () => {
    return await request('/auth/profile/my-request');
  },

  getPendingProfileRequests: async () => {
    return await request('/auth/profile/pending-requests');
  },

  reviewProfileRequest: async (requestId, approve, reviewNotes = '') => {
    return await request('/auth/profile/review-request', {
      method: 'POST',
      body: JSON.stringify({
        request_id: requestId,
        approve,
        review_notes: reviewNotes,
      }),
    });
  },

  // Landing Page CMS & Promotions
  getLandingContent: async () => {
    return await request('/landing/content');
  },

  updateLandingContent: async (contentData) => {
    return await request('/landing/content', {
      method: 'PUT',
      body: JSON.stringify(contentData),
    });
  },

  getCoachingPromotions: async () => {
    return await request('/landing/promotions');
  },

  createCoachingPromotion: async (promotionData) => {
    return await request('/landing/promotions', {
      method: 'POST',
      body: JSON.stringify(promotionData),
    });
  },

  deleteCoachingPromotion: async (promoId) => {
    return await request(`/landing/promotions/${promoId}`, {
      method: 'DELETE',
    });
  },

  // Admin Management
  createAdmin: async (adminData) => {
    return await request('/admin/create-admin', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  },

  getAdminStats: async () => {
    return await request('/admin/stats');
  },

  getPendingTeachers: async () => {
    return await request('/admin/teachers/pending');
  },

  verifyTeacher: async (teacherId, approve, notes = '') => {
    return await request('/admin/teachers/verify', {
      method: 'POST',
      body: JSON.stringify({
        teacher_id: teacherId,
        approve,
        notes,
      }),
    });
  },

  getAllUsers: async () => {
    return await request('/admin/users');
  },

  toggleBlockUser: async (userId, isBlocked) => {
    return await request('/admin/users/block', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        is_blocked: isBlocked,
      }),
    });
  },

  deleteUser: async (userId) => {
    return await request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // 5.4 Batch Management (Platform Admin)
  getAdminBatches: async () => {
    return await request('/admin/batches');
  },

  createAdminBatch: async (batchData) => {
    return await request('/admin/batches', {
      method: 'POST',
      body: JSON.stringify(batchData),
    });
  },

  assignAdminBatchTeacher: async (batchId, teacherId, teacherName) => {
    return await request(`/admin/batches/${batchId}/assign-teacher`, {
      method: 'POST',
      body: JSON.stringify({
        teacher_id: teacherId,
        teacher_name: teacherName,
      }),
    });
  },

  // 5.5 Global Notices Broadcast (Platform Admin)
  getAdminBroadcasts: async () => {
    return await request('/admin/notices/broadcasts');
  },

  broadcastNotice: async (noticeData) => {
    return await request('/admin/notices/broadcast', {
      method: 'POST',
      body: JSON.stringify(noticeData),
    });
  },

  deleteBroadcastNotice: async (noticeId) => {
    return await request(`/admin/notices/broadcasts/${noticeId}`, {
      method: 'DELETE',
    });
  },

  // Batches
  getMyBatches: async () => {
    return await request('/batches/');
  },

  createBatch: async (batchData) => {
    return await request('/batches/', {
      method: 'POST',
      body: JSON.stringify(batchData),
    });
  },

  getBatchRoster: async (batchId) => {
    return await request(`/batches/${batchId}/roster`);
  },

  // Attendance
  markBatchAttendance: async (batchId, date, records) => {
    return await request('/attendance/mark', {
      method: 'POST',
      body: JSON.stringify({
        batch_id: batchId,
        date,
        records,
      }),
    });
  },

  // Marks
  uploadTestMarks: async (testData) => {
    return await request('/marks/upload', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  },

  getLeaderboard: async (batchId = null) => {
    const q = batchId ? `?batch_id=${batchId}` : '';
    return await request(`/marks/leaderboard${q}`);
  },

  // Materials & Notices
  getMaterials: async (batchId = null) => {
    const q = batchId ? `?batch_id=${batchId}` : '';
    return await request(`/materials/${q}`);
  },

  uploadMaterial: async (materialData) => {
    return await request('/materials/', {
      method: 'POST',
      body: JSON.stringify(materialData),
    });
  },

  getNotices: async (batchId = null) => {
    const q = batchId ? `?batch_id=${batchId}` : '';
    return await request(`/notices/${q}`);
  },

  postNotice: async (noticeData) => {
    return await request('/notices/', {
      method: 'POST',
      body: JSON.stringify(noticeData),
    });
  },

  // AI Doubt Solve
  askDoubtAI: async (question, language = 'en') => {
    return await request('/ai/solve', {
      method: 'POST',
      body: JSON.stringify({ question, language, subject: 'General' }),
    });
  },
};
