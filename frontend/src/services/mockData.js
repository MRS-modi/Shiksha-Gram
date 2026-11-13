// Default Mock Data for Shiksha Gram Prototype
const STORAGE_PREFIX = 'sg_db_';

const initialBatches = [
  {
    id: 'batch-1',
    name: 'Class 10th - Board Mastery',
    subject: 'Mathematics & Science',
    schedule: 'Mon, Wed, Fri • 4:30 PM - 6:00 PM',
    room: 'Hall A (Room 201)',
    fees: 1500,
    capacity: 35,
    studentsCount: 28,
    teacherName: 'Dr. Rajesh Sharma',
    teacherId: 'teacher-1'
  },
  {
    id: 'batch-2',
    name: 'Class 12th - Physics Foundation',
    subject: 'Physics (Board & JEE)',
    schedule: 'Tue, Thu, Sat • 5:00 PM - 6:30 PM',
    room: 'Science Lab 3',
    fees: 1800,
    capacity: 30,
    studentsCount: 22,
    teacherName: 'Dr. Rajesh Sharma',
    teacherId: 'teacher-1'
  },
  {
    id: 'batch-3',
    name: 'Class 9th - Science Spark',
    subject: 'Integrated Science',
    schedule: 'Mon, Wed, Fri • 3:00 PM - 4:15 PM',
    room: 'Room 104',
    fees: 1200,
    capacity: 25,
    studentsCount: 19,
    teacherName: 'Dr. Rajesh Sharma',
    teacherId: 'teacher-1'
  }
];

const initialStudents = [
  {
    id: 'student-1',
    name: 'Aman Verma',
    rollNumber: 'SG-2026-042',
    email: 'student@shikshagram.com',
    phone: '+91 91234 56789',
    guardianPhone: '+91 98111 22334',
    batchId: 'batch-1',
    batchName: 'Class 10th - Board Mastery',
    attendanceRate: 92.5,
    lastScore: 94.0,
    parentPin: '4289',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    status: 'enrolled',
    enrolledDate: '2026-08-15'
  },
  {
    id: 'student-2',
    name: 'Priya Sharma',
    rollNumber: 'SG-2026-043',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 11223',
    guardianPhone: '+91 98765 44332',
    batchId: 'batch-1',
    batchName: 'Class 10th - Board Mastery',
    attendanceRate: 88.0,
    lastScore: 89.5,
    parentPin: '1122',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'enrolled',
    enrolledDate: '2026-08-18'
  },
  {
    id: 'student-3',
    name: 'Rohan Gupta',
    rollNumber: 'SG-2026-044',
    email: 'rohan.gupta@example.com',
    phone: '+91 97654 33445',
    guardianPhone: '+91 97654 00998',
    batchId: 'batch-1',
    batchName: 'Class 10th - Board Mastery',
    attendanceRate: 64.0, // weak student for alerts!
    lastScore: 48.0,
    parentPin: '3344',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'enrolled',
    enrolledDate: '2026-09-01'
  },
  {
    id: 'student-4',
    name: 'Sneha Patel',
    rollNumber: 'SG-2026-045',
    email: 'sneha.patel@example.com',
    phone: '+91 99887 76655',
    guardianPhone: '+91 99887 11223',
    batchId: 'batch-2',
    batchName: 'Class 12th - Physics Foundation',
    attendanceRate: 96.0,
    lastScore: 92.0,
    parentPin: '5566',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    status: 'enrolled',
    enrolledDate: '2026-08-20'
  },
  {
    id: 'student-5',
    name: 'Vikram Singh',
    rollNumber: 'SG-2026-046',
    email: 'vikram.singh@example.com',
    phone: '+91 96543 21876',
    guardianPhone: '+91 96543 11111',
    batchId: 'batch-2',
    batchName: 'Class 12th - Physics Foundation',
    attendanceRate: 82.0,
    lastScore: 84.5,
    parentPin: '7788',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'enrolled',
    enrolledDate: '2026-08-22'
  }
];

const initialEnrollmentRequests = [
  {
    id: 'req-1',
    studentName: 'Kavita Chawla',
    email: 'kavita.c@example.com',
    phone: '+91 93355 77889',
    batchId: 'batch-1',
    batchName: 'Class 10th - Board Mastery',
    requestedAt: '2026-11-11T09:30:00Z',
    status: 'pending'
  },
  {
    id: 'req-2',
    studentName: 'Aditya Raj',
    email: 'aditya.raj@example.com',
    phone: '+91 98822 33441',
    batchId: 'batch-2',
    batchName: 'Class 12th - Physics Foundation',
    requestedAt: '2026-11-12T08:15:00Z',
    status: 'pending'
  }
];

const initialMaterials = [
  {
    id: 'mat-1',
    batchId: 'batch-1',
    title: 'Trigonometry All Key Formulas & 100 Solved MCQs',
    subject: 'Mathematics',
    type: 'pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Concise formula cheat sheet for CBSE & UP Board with step-by-step proofs.',
    date: '2026-11-08'
  },
  {
    id: 'mat-2',
    batchId: 'batch-1',
    title: 'Light Reflection & Refraction - Animated Video',
    subject: 'Science / Physics',
    type: 'video_link',
    url: 'https://youtube.com',
    description: 'Visualizing concave/convex mirror ray diagrams in 3D.',
    date: '2026-11-04'
  },
  {
    id: 'mat-3',
    batchId: 'batch-2',
    title: 'Electromagnetic Induction NCERT Exemplar Solutions',
    subject: 'Physics',
    type: 'notes',
    url: '#',
    description: 'Handwritten class notes with special tips for Board exam subjective questions.',
    date: '2026-11-02'
  }
];

const initialNotices = [
  {
    id: 'not-1',
    title: 'Special Sunday 3-Hour Mock Test for Class 10 & 12',
    content: 'Full syllabus mock test will be conducted this Sunday from 9:00 AM to 12:00 PM. Admittance cards are mandatory.',
    priority: 'urgent',
    date: '2026-11-11',
    author: 'Dr. Rajesh Sharma (Director)',
    batchName: 'All Batches',
    isGlobal: true
  },
  {
    id: 'not-2',
    title: 'Trigonometry Homework Solutions Uploaded to Learning Hub',
    content: 'Please check your steps in Question 8 to 14 from NCERT exercise 8.4 before next class.',
    priority: 'normal',
    date: '2026-11-09',
    author: 'Dr. Rajesh Sharma',
    batchName: 'Class 10th - Board Mastery',
    isGlobal: false
  }
];

const initialFees = [
  {
    id: 'fee-1',
    studentId: 'student-1',
    studentName: 'Aman Verma',
    batchName: 'Class 10th - Board Mastery',
    month: 'November 2026',
    amount: 1500,
    status: 'paid',
    receiptNo: 'REC-SG-2026-11-042',
    paidDate: '2026-11-02'
  },
  {
    id: 'fee-2',
    studentId: 'student-2',
    studentName: 'Priya Sharma',
    batchName: 'Class 10th - Board Mastery',
    month: 'November 2026',
    amount: 1500,
    status: 'paid',
    receiptNo: 'REC-SG-2026-11-043',
    paidDate: '2026-11-03'
  },
  {
    id: 'fee-3',
    studentId: 'student-3',
    studentName: 'Rohan Gupta',
    batchName: 'Class 10th - Board Mastery',
    month: 'November 2026',
    amount: 1500,
    status: 'pending',
    receiptNo: null,
    paidDate: null
  }
];

const initialTests = [
  {
    id: 'test-1',
    batchId: 'batch-1',
    testName: 'Trigonometry & Heights Assessment',
    subject: 'Mathematics',
    date: '2026-11-05',
    maxMarks: 100,
    scores: [
      { studentId: 'student-1', studentName: 'Aman Verma', score: 94, grade: 'A+', remarks: 'Outstanding proofs' },
      { studentId: 'student-2', studentName: 'Priya Sharma', score: 89, grade: 'A', remarks: 'Good accuracy' },
      { studentId: 'student-3', studentName: 'Rohan Gupta', score: 48, grade: 'C', remarks: 'Needs revision in identities' }
    ]
  },
  {
    id: 'test-2',
    batchId: 'batch-1',
    testName: 'Chemical Reactions & Acids Test',
    subject: 'Science',
    date: '2026-10-25',
    maxMarks: 50,
    scores: [
      { studentId: 'student-1', studentName: 'Aman Verma', score: 46, grade: 'A+', remarks: 'Great equation balancing' },
      { studentId: 'student-2', studentName: 'Priya Sharma', score: 44, grade: 'A', remarks: 'Well explained concepts' },
      { studentId: 'student-3', studentName: 'Rohan Gupta', score: 26, grade: 'D', remarks: 'Practice chemical formulas' }
    ]
  }
];

const initialAssignments = [
  {
    id: 'asg-1',
    batchId: 'batch-1',
    batchName: 'Class 10th - Board Mastery',
    title: 'Trigonometry NCERT Exercise 8.4 Solutions',
    subject: 'Mathematics',
    dueDate: '2026-11-18',
    maxMarks: 25,
    instructions: 'Solve Q5 (i) to (x) with neat step-by-step proofs on paper. Write your roll number on top.',
    totalSubmissions: 26,
    status: 'active'
  },
  {
    id: 'asg-2',
    batchId: 'batch-2',
    batchName: 'Class 12th - Physics Foundation',
    title: 'Electromagnetic Induction Numerical Problem Sheet',
    subject: 'Physics',
    dueDate: '2026-11-20',
    maxMarks: 30,
    instructions: 'Complete 15 standard numericals based on Faraday law and Lenz law.',
    totalSubmissions: 20,
    status: 'active'
  }
];

// Helper to get from local storage or initialize
const getStored = (key, fallback) => {
  try {
    const val = localStorage.getItem(STORAGE_PREFIX + key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStored = (key, data) => {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to storage', e);
  }
};

export const getMockData = () => {
  return {
    batches: getStored('batches', initialBatches),
    students: getStored('students', initialStudents),
    enrollmentRequests: getStored('requests', initialEnrollmentRequests),
    materials: getStored('materials', initialMaterials),
    notices: getStored('notices', initialNotices),
    fees: getStored('fees', initialFees),
    tests: getStored('tests', initialTests),
    assignments: getStored('assignments', initialAssignments),
  };
};

export const saveMockBatches = (batches) => setStored('batches', batches);
export const saveMockStudents = (students) => setStored('students', students);
export const saveMockRequests = (requests) => setStored('requests', requests);
export const saveMockMaterials = (materials) => setStored('materials', materials);
export const saveMockNotices = (notices) => setStored('notices', notices);
export const saveMockFees = (fees) => setStored('fees', fees);
export const saveMockTests = (tests) => setStored('tests', tests);
export const saveMockAssignments = (assignments) => setStored('assignments', assignments);

export const resetMockData = () => {
  localStorage.removeItem(STORAGE_PREFIX + 'batches');
  localStorage.removeItem(STORAGE_PREFIX + 'students');
  localStorage.removeItem(STORAGE_PREFIX + 'requests');
  localStorage.removeItem(STORAGE_PREFIX + 'materials');
  localStorage.removeItem(STORAGE_PREFIX + 'notices');
  localStorage.removeItem(STORAGE_PREFIX + 'fees');
  localStorage.removeItem(STORAGE_PREFIX + 'tests');
  localStorage.removeItem(STORAGE_PREFIX + 'assignments');
  window.location.reload();
};
