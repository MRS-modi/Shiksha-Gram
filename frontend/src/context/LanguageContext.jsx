import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Brand & Topbar
    brandName: "Shiksha Gram",
    tagline: "Where technology meets education",
    searchPlaceholder: "Search batches, students, materials...",
    notifications: "Notifications",
    markAllRead: "Mark all as read",
    noNotifications: "No new notifications",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    language: "Language",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    
    // Roles
    roleTeacher: "Teacher",
    roleStudent: "Student",
    roleParent: "Parent View",
    roleAdmin: "Administrator",
    
    // Navigation
    navOverview: "Overview",
    navMyClasses: "My Classes",
    navAcademics: "Academics",
    navLearningHub: "Learning Hub",
    navScheduleFees: "Schedule & Fees",
    navCommunication: "Communication",
    navSettings: "Settings & Profile",
    navAttendance: "My Attendance",
    navPerformance: "My Performance",
    navNotices: "Notices & Batch",
    navLeaderboard: "Leaderboard",
    navAdminDashboard: "Dashboard",
    navTeacherVerify: "Teacher Verification",
    navUserManagement: "User Management",
    navBatchManagement: "Batch Management",
    navGlobalNotices: "Global Broadcasts",
    navProfileApprovals: "Profile Approvals",
    navAdminManagement: "Admin Management",
    navLandingCms: "Landing & Promotions CMS",

    // Common Actions
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    edit: "Edit",
    delete: "Delete",
    upload: "Upload",
    download: "Download",
    view: "View",
    present: "Present",
    absent: "Absent",
    late: "Late",
    markAllPresent: "Mark All Present",
    shareWhatsApp: "Share to WhatsApp",
    viewDetails: "View Details",
    accept: "Accept",
    reject: "Reject",
    pending: "Pending",
    approved: "Approved",
    paid: "Paid",
    overdue: "Overdue",
    requestProfileChange: "Request Profile Update",
    profileChangePending: "Your profile update request is pending review by Teacher or Administrator.",
    
    // Dashboard Stats
    totalStudents: "Total Students",
    activeBatches: "Active Batches",
    todayAttendance: "Today's Attendance",
    feeCollection: "Pending Dues",
    attendanceRate: "Attendance Rate",
    studyStreak: "Study Streak",
    upcomingTests: "Upcoming Tests",
    classesAttended: "Classes Attended",
    
    // Quick Actions
    quickActions: "Quick Actions",
    markAttendanceBtn: "Mark Attendance",
    addStudentBtn: "Add / Enroll Student",
    uploadMaterialBtn: "Upload Material",
    createNoticeBtn: "Post Announcement",
    
    // Learning Hub & AI
    studyMaterials: "Study Materials",
    assignments: "Homework & Assignments",
    aiDoubts: "Shiksha AI Doubt Solver",
    askAi: "Ask Doubt to AI",
    aiPrompt: "Enter your question or math equation...",
    solveBtn: "Get Instant Solution",

    // Public / Landing
    heroTitle: "Where Technology Meets Education",
    heroSubtitle: "India's premier coaching management platform connecting independent tutors, institutes, students, and parents.",
    getStarted: "Get Started Free",
    loginBtn: "Sign In",
    signUpBtn: "Create Account",
    tryDemo: "Try Interactive Demo",
    parentPortal: "Parent Portal",
    adminLogin: "Admin Portal",
    promotionsHeader: "Featured Coaching Academies & Tutors",
    broadcastNoticesHeader: "Live Platform Announcements & Notices",
    welcomeBack: "Sign In to Shiksha Gram",
    welcomeSubtitle: "Enter your registered credentials to access your personalized dashboard",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    signInWithGoogle: "Sign in with Google",
    noAccount: "Don't have an account?",
    alreadyAccount: "Already registered? Sign in here",
    selectRoleToSignUp: "Select Registration Role:",
    registerAsTeacher: "Register as Coaching Teacher / Tutor",
    registerAsStudent: "Register as Student",
    qualificationLabel: "Highest Qualification (e.g. M.Sc, B.Tech, Ph.D)",
    experienceLabel: "Years of Teaching Experience",
    coachingNameLabel: "Coaching Institute / Academy Name",
    coachingAddressLabel: "Coaching Center Address",
    subjectsTaughtLabel: "Subjects Taught",
    schoolNameLabel: "School / College Name",
    classGradeLabel: "Class / Grade (e.g. Class 10th)",
    guardianNameLabel: "Guardian Full Name",
    guardianPhoneLabel: "Guardian Mobile Number",
    phoneLabel: "Contact Phone Number",
    dobLabel: "Date of Birth",
    cityAddressLabel: "Address / City",
  },
  hi: {
    // Brand & Topbar
    brandName: "शिक्षा ग्राम",
    tagline: "जहाँ तकनीक और शिक्षा का संगम होता है",
    searchPlaceholder: "बैच, विद्यार्थी, अध्ययन सामग्री खोजें...",
    notifications: "सूचनाएँ (नोटिफिकेशन)",
    markAllRead: "सभी को पढ़ा हुआ चिन्हित करें",
    noNotifications: "कोई नई सूचना नहीं है",
    lightMode: "लाइट मोड",
    darkMode: "डार्क मोड",
    language: "भाषा",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",
    logout: "लॉगआउट",
    
    // Roles
    roleTeacher: "अध्यापक (शिक्षक)",
    roleStudent: "विद्यार्थी (छात्र)",
    roleParent: "अभिभावक व्यू",
    roleAdmin: "व्यवस्थापक (एडमिन)",
    
    // Navigation
    navOverview: "डैशबोर्ड सारांश",
    navMyClasses: "मेरी कक्षाएं / बैच",
    navAcademics: "अकादमिक व उपस्थिति",
    navLearningHub: "स्टडी मैटेरियल हब",
    navScheduleFees: "समय सारिणी व फीस",
    navCommunication: "सूचना व संचार",
    navSettings: "सेटिंग्स व प्रोफ़ाइल",
    navAttendance: "मेरी उपस्थिति",
    navPerformance: "मेरा प्रदर्शन / अंक",
    navNotices: "सूचनाएँ व सहपाठी",
    navLeaderboard: "लीडरबोर्ड व टॉपर",
    navAdminDashboard: "एडमिन डैशबोर्ड",
    navTeacherVerify: "शिक्षक सत्यापन",
    navUserManagement: "उपयोगकर्ता प्रबंधन",
    navBatchManagement: "बैच प्रबंधन",
    navGlobalNotices: "सार्वजनिक घोषणाएँ",
    navProfileApprovals: "प्रोफ़ाइल अनुमोदन",
    navAdminManagement: "एडमिन प्रबंधन",
    navLandingCms: "लैंडिंग पेज व विज्ञापन",

    // Common Actions
    save: "सुरक्षित करें",
    cancel: "रद्द करें",
    submit: "जमा करें",
    edit: "संशोधित करें",
    delete: "हटाएँ",
    upload: "अपलोड करें",
    download: "डाउनलोड करें",
    view: "देखें",
    present: "उपस्थित (Present)",
    absent: "अनुपस्थित (Absent)",
    late: "देर से (Late)",
    markAllPresent: "सभी को उपस्थित लगाएँ",
    shareWhatsApp: "व्हाट्सएप पर भेजें",
    viewDetails: "विवरण देखें",
    accept: "स्वीकार करें",
    reject: "अस्वीकार करें",
    pending: "प्रतीक्षारत (Pending)",
    approved: "सत्यापित (Approved)",
    paid: "भुगतान पूर्ण",
    overdue: "बकाया",
    requestProfileChange: "प्रोफ़ाइल संशोधन अनुरोध भेजें",
    profileChangePending: "आपका प्रोफ़ाइल संपादन अनुरोध शिक्षक अथवा एडमिन के अनुमोदन के लिए प्रतीक्षारत है।",
    
    // Dashboard Stats
    totalStudents: "कुल विद्यार्थी",
    activeBatches: "सक्रिय बैच",
    todayAttendance: "आज की उपस्थिति",
    feeCollection: "बकाया शुल्क",
    attendanceRate: "उपस्थिति प्रतिशत",
    studyStreak: "अध्ययन स्ट्रीक",
    upcomingTests: "आगामी परीक्षा",
    classesAttended: "कक्षा उपस्थिति",
    
    // Quick Actions
    quickActions: "त्वरित कार्य (Quick Actions)",
    markAttendanceBtn: "उपस्थिति दर्ज करें",
    addStudentBtn: "नया विद्यार्थी जोड़ें",
    uploadMaterialBtn: "नोट्स / पीडीएफ अपलोड",
    createNoticeBtn: "सूचना जारी करें",
    
    // Learning Hub & AI
    studyMaterials: "अध्ययन सामग्री (नोट्स)",
    assignments: "गृहकार्य (Assignments)",
    aiDoubts: "शिक्षा AI शंका समाधान",
    askAi: "AI शिक्षक से पूछें",
    aiPrompt: "अपना सवाल या गणित का प्रश्न यहाँ लिखें...",
    solveBtn: "तुरंत समाधान पाएँ",

    // Public / Landing
    heroTitle: "जहाँ तकनीक और शिक्षा का संगम होता है",
    heroSubtitle: "भारत के कोचिंग शिक्षकों और विद्यार्थियों के लिए सरल और भरोसेमंद डिजिटल मंच।",
    getStarted: "निःशुल्क शुरुआत करें",
    loginBtn: "लॉगिन करें",
    signUpBtn: "नया खाता बनाएँ",
    tryDemo: "डेमो चलाकर देखें",
    parentPortal: "अभिभावक पोर्टल",
    adminLogin: "एडमिन पोर्टल",
    promotionsHeader: "प्रमुख कोचिंग संस्थान एवं शिक्षक",
    broadcastNoticesHeader: "लाइव सूचनाएँ एवं घोषणाएँ",
    welcomeBack: "शिक्षा ग्राम में लॉगिन करें",
    welcomeSubtitle: "अपने व्यक्तिगत डैशबोर्ड पर जाने के लिए अपनी ईमेल आईडी और पासवर्ड दर्ज करें",
    emailLabel: "ईमेल पता (Email ID)",
    passwordLabel: "पासवर्ड",
    signInWithGoogle: "गूगल (Google) से लॉगिन करें",
    noAccount: "नया खाता बनाना चाहते हैं?",
    alreadyAccount: "पहले से खाता है? यहाँ लॉगिन करें",
    selectRoleToSignUp: "पंजीकरण भूमिका चुनें:",
    registerAsTeacher: "शिक्षक (Teacher) के रूप में पंजीकरण करें",
    registerAsStudent: "विद्यार्थी (Student) के रूप में पंजीकरण करें",
    qualificationLabel: "उच्चतम योग्यता (जैसे M.Sc, B.Tech, Ph.D)",
    experienceLabel: "शिक्षण अनुभव (वर्षों में)",
    coachingNameLabel: "कोचिंग / ट्यूशन संस्थान का नाम",
    coachingAddressLabel: "कोचिंग सेंटर का पता",
    subjectsTaughtLabel: "पढ़ाए जाने वाले विषय",
    schoolNameLabel: "स्कूल / कॉलेज का नाम",
    classGradeLabel: "कक्षा (जैसे Class 10th)",
    guardianNameLabel: "अभिभावक का पूरा नाम",
    guardianPhoneLabel: "अभिभावक का मोबाइल नंबर",
    phoneLabel: "संपर्क मोबाइल नंबर",
    dobLabel: "जन्म तिथि (DOB)",
    cityAddressLabel: "पता / शहर",
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('sg_language');
    if (saved) return saved;
    // Default to English as explicitly requested
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('sg_language', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
