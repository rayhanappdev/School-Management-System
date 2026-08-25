import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Role,
  AttendanceRecord,
  AttendanceStatus,
  GradeReport,
  EnrollmentApplication,
  MessageNotification,
  FeeInvoice,
  SchoolEvent,
  NoticeItem,
  ClassSchedule,
  SubjectGrade,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ATTENDANCE,
  INITIAL_GRADE_REPORTS,
  INITIAL_ENROLLMENT_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_FEE_INVOICES,
  INITIAL_NOTICES,
  INITIAL_EVENTS,
  INITIAL_SCHEDULE,
} from '../data/initialData';

interface SchoolContextType {
  // Authentication & Navigation
  currentUser: User | null;
  currentRole: Role | 'guest';
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
  login: (user: User) => void;
  loginAsRole: (role: Role) => void;
  logout: () => void;
  activeView: 'website' | 'portal';
  setActiveView: (view: 'website' | 'portal') => void;
  currentView: 'website' | 'portal';
  setCurrentView: (view: 'website' | 'portal') => void;
  activePortalTab: string;
  setActivePortalTab: (tab: string) => void;

  // Login Modal Controls
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  setLoginModalOpen: (open: boolean) => void;
  loginModalRole: Role;
  setLoginModalRole: (role: Role) => void;
  openLoginForRole: (role?: Role) => void;
  closeLoginModal: () => void;

  // Data Collections
  users: User[];
  attendance: AttendanceRecord[];
  gradeReports: GradeReport[];
  enrollments: EnrollmentApplication[];
  notifications: MessageNotification[];
  invoices: FeeInvoice[];
  notices: NoticeItem[];
  events: SchoolEvent[];
  schedules: ClassSchedule[];

  // User Actions
  addUser: (user: Omit<User, 'id'>) => User;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Attendance Actions
  markAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  markBatchAttendance: (
    date: string,
    grade: string,
    section: string,
    studentStatuses: { studentId: string; status: AttendanceStatus; remarks?: string }[],
    recordedBy: string
  ) => void;

  // Gradebook Actions
  saveGradeReport: (report: Omit<GradeReport, 'id'> | GradeReport) => void;
  publishGradeReport: (id: string) => void;
  calculateGpa: (subjects: SubjectGrade[]) => { gpa: number; overallGrade: string; totalScore: number };

  // Enrollment Actions
  submitEnrollmentApplication: (application: Omit<EnrollmentApplication, 'id' | 'submittedAt' | 'status'>) => string;
  updateEnrollmentStatus: (id: string, status: EnrollmentApplication['status'], rollNo?: string, notes?: string) => void;

  // Messaging & Automation Actions
  sendMessage: (msg: Omit<MessageNotification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Finance Actions
  payInvoice: (invoiceId: string, method: string) => void;
  generateInvoice: (invoice: Omit<FeeInvoice, 'id'>) => void;

  // School Web Management
  addNotice: (notice: Omit<NoticeItem, 'id' | 'date'>) => void;
  addEvent: (event: Omit<SchoolEvent, 'id'>) => void;
  resetAllData: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'apex_sms_';

function loadStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Failed loading ${key} from storage:`, e);
    return defaultValue;
  }
}

function saveStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed saving ${key} to storage:`, e);
  }
}

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'en' | 'bn'>(() => loadStorage('lang', 'en'));
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadStorage('auth_user', null));
  const [activeView, setActiveView] = useState<'website' | 'portal'>('website');
  const [activePortalTab, setActivePortalTab] = useState<string>('dashboard');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginModalRole, setLoginModalRole] = useState<Role>('student');

  const [users, setUsers] = useState<User[]>(() => loadStorage('users', INITIAL_USERS));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadStorage('attendance', INITIAL_ATTENDANCE));
  const [gradeReports, setGradeReports] = useState<GradeReport[]>(() => loadStorage('grades', INITIAL_GRADE_REPORTS));
  const [enrollments, setEnrollments] = useState<EnrollmentApplication[]>(() =>
    loadStorage('enrollments', INITIAL_ENROLLMENT_APPLICATIONS)
  );
  const [notifications, setNotifications] = useState<MessageNotification[]>(() =>
    loadStorage('notifications', INITIAL_NOTIFICATIONS)
  );
  const [invoices, setInvoices] = useState<FeeInvoice[]>(() => loadStorage('invoices', INITIAL_FEE_INVOICES));
  const [notices, setNotices] = useState<NoticeItem[]>(() => loadStorage('notices', INITIAL_NOTICES));
  const [events, setEvents] = useState<SchoolEvent[]>(() => loadStorage('events', INITIAL_EVENTS));
  const [schedules] = useState<ClassSchedule[]>(INITIAL_SCHEDULE);

  // Sync to localStorage
  useEffect(() => saveStorage('lang', language), [language]);
  useEffect(() => saveStorage('auth_user', currentUser), [currentUser]);
  useEffect(() => saveStorage('users', users), [users]);
  useEffect(() => saveStorage('attendance', attendance), [attendance]);
  useEffect(() => saveStorage('grades', gradeReports), [gradeReports]);
  useEffect(() => saveStorage('enrollments', enrollments), [enrollments]);
  useEffect(() => saveStorage('notifications', notifications), [notifications]);
  useEffect(() => saveStorage('invoices', invoices), [invoices]);
  useEffect(() => saveStorage('notices', notices), [notices]);
  useEffect(() => saveStorage('events', events), [events]);

  const setLanguage = (lang: 'en' | 'bn') => setLanguageState(lang);

  const login = (user: User) => {
    setCurrentUser(user);
    setActiveView('portal');
    setActivePortalTab('dashboard');
  };

  const loginAsRole = (role: Role) => {
    const targetUser = users.find((u) => u.role === role && u.status === 'active') || INITIAL_USERS.find((u) => u.role === role);
    if (targetUser) {
      login(targetUser);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('website');
  };

  const openLoginForRole = (role?: Role) => {
    if (role) {
      setLoginModalRole(role);
    }
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const setLoginModalOpen = (open: boolean) => {
    setIsLoginModalOpen(open);
  };

  const addUser = (userData: Omit<User, 'id'>): User => {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`,
    };
    setUsers((prev) => [newUser, ...prev]);

    // Send automated welcome message
    sendMessage({
      senderId: 'usr_admin',
      senderName: 'Apex School Administration',
      senderRole: 'admin',
      recipientType: 'individual',
      recipientTarget: newUser.id,
      recipientName: newUser.name,
      title: `Welcome to Apex Academy & SMS Portal, ${newUser.name}!`,
      content: `Your profile has been created with role [${newUser.role.toUpperCase()}]. Explore your dedicated dashboard, attendance records, course modules, and communication channels.`,
      category: 'general',
      priority: 'normal',
      isAutomated: true,
    });

    return newUser;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    if (currentUser?.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const markAttendance = (recordData: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = {
      ...recordData,
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setAttendance((prev) => {
      // Remove existing record for same date & student if any
      const filtered = prev.filter((a) => !(a.date === recordData.date && a.studentId === recordData.studentId));
      return [newRecord, ...filtered];
    });

    // If absent or late, trigger automated notification to guardian/student
    if (recordData.status === 'absent' || recordData.status === 'late') {
      sendMessage({
        senderId: 'sys_attendance',
        senderName: 'Apex Automated Attendance Bot',
        senderRole: 'admin',
        recipientType: 'individual',
        recipientTarget: recordData.studentId,
        recipientName: recordData.studentName,
        title: `⚠️ Attendance Alert: Marked ${recordData.status.toUpperCase()} on ${recordData.date}`,
        content: `${recordData.studentName} was recorded as ${recordData.status.toUpperCase()} for ${recordData.grade}-${recordData.section} on ${recordData.date}. Recorded by: ${recordData.recordedBy}. ${recordData.remarks ? 'Note: ' + recordData.remarks : ''}`,
        category: 'attendance_alert',
        priority: 'urgent',
        isAutomated: true,
      });
    }
  };

  const markBatchAttendance = (
    date: string,
    grade: string,
    section: string,
    studentStatuses: { studentId: string; status: AttendanceStatus; remarks?: string }[],
    recordedBy: string
  ) => {
    const newRecords: AttendanceRecord[] = studentStatuses.map((st) => {
      const student = users.find((u) => u.id === st.studentId);
      return {
        id: `att_${Date.now()}_${st.studentId}`,
        date,
        studentId: st.studentId,
        studentName: student?.name || 'Student',
        grade,
        section,
        status: st.status,
        remarks: st.remarks,
        recordedBy,
      };
    });

    setAttendance((prev) => {
      const studentIds = new Set(studentStatuses.map((s) => s.studentId));
      const filtered = prev.filter((a) => !(a.date === date && studentIds.has(a.studentId)));
      return [...newRecords, ...filtered];
    });

    // Check absent/late students and dispatch alerts
    studentStatuses.forEach((st) => {
      if (st.status === 'absent' || st.status === 'late') {
        const student = users.find((u) => u.id === st.studentId);
        if (student) {
          sendMessage({
            senderId: 'sys_attendance',
            senderName: 'Attendance Automation Gateway',
            senderRole: 'admin',
            recipientType: 'individual',
            recipientTarget: student.id,
            recipientName: student.name,
            title: `⚠️ Automated Daily Attendance Notice: Marked ${st.status.toUpperCase()}`,
            content: `${student.name} (${student.rollNo || grade}) was marked ${st.status.toUpperCase()} for ${date}. Guardian Contact: ${student.guardianPhone || 'On File'}.`,
            category: 'attendance_alert',
            priority: 'urgent',
            isAutomated: true,
          });
        }
      }
    });
  };

  const calculateGpa = (subjects: SubjectGrade[]) => {
    if (!subjects.length) return { gpa: 0, overallGrade: 'F', totalScore: 0 };
    const totalScore = subjects.reduce((sum, s) => sum + s.marksObtained, 0);
    const avgScore = totalScore / subjects.length;
    const avgPoint = subjects.reduce((sum, s) => sum + s.point, 0) / subjects.length;

    let overallGrade = 'F';
    if (avgScore >= 90) overallGrade = 'A+';
    else if (avgScore >= 80) overallGrade = 'A';
    else if (avgScore >= 70) overallGrade = 'B+';
    else if (avgScore >= 60) overallGrade = 'B';
    else if (avgScore >= 50) overallGrade = 'C';
    else if (avgScore >= 40) overallGrade = 'D';

    return {
      gpa: Number(avgPoint.toFixed(2)),
      overallGrade,
      totalScore,
    };
  };

  const saveGradeReport = (reportData: Omit<GradeReport, 'id'> | GradeReport) => {
    const isExisting = 'id' in reportData && reportData.id;
    const reportId = isExisting ? (reportData as GradeReport).id : `rep_${Date.now()}`;
    const report: GradeReport = {
      ...reportData,
      id: reportId,
    };

    setGradeReports((prev) => {
      const idx = prev.findIndex((r) => r.id === report.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = report;
        return next;
      }
      return [report, ...prev];
    });

    // Send automated notification if published
    if (report.isPublished) {
      sendMessage({
        senderId: 'sys_exam',
        senderName: 'Exam & Academic Controller',
        senderRole: 'admin',
        recipientType: 'individual',
        recipientTarget: report.studentId,
        recipientName: report.studentName,
        title: `📊 Academic Report Released: ${report.term}`,
        content: `Official academic report card for ${report.studentName} has been certified. Overall GPA: ${report.gpa} (Grade ${report.overallGrade}). Position: #${report.positionInClass}. You can now view and download the official transcript.`,
        category: 'grade_published',
        priority: 'normal',
        isAutomated: true,
      });
    }
  };

  const publishGradeReport = (id: string) => {
    setGradeReports((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, isPublished: true, publishedDate: new Date().toISOString().split('T')[0] };
          sendMessage({
            senderId: 'sys_exam',
            senderName: 'Academic Controller',
            senderRole: 'admin',
            recipientType: 'individual',
            recipientTarget: r.studentId,
            recipientName: r.studentName,
            title: `📊 Certified Report Card Published: ${r.term}`,
            content: `The official Grade Report for ${r.term} is now published and certified by the Principal. GPA: ${r.gpa} (${r.overallGrade}). Download transcript in your portal.`,
            category: 'grade_published',
            priority: 'normal',
            isAutomated: true,
          });
          return updated;
        }
        return r;
      })
    );
  };

  const submitEnrollmentApplication = (
    appData: Omit<EnrollmentApplication, 'id' | 'submittedAt' | 'status'>
  ): string => {
    const id = `app_${Date.now()}`;
    const newApp: EnrollmentApplication = {
      ...appData,
      id,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setEnrollments((prev) => [newApp, ...prev]);

    // Send automated system notification to Admin and Principal
    sendMessage({
      senderId: 'sys_admissions',
      senderName: 'Online Admissions Portal',
      senderRole: 'admin',
      recipientType: 'all',
      title: `📝 New Student Enrollment Application: ${newApp.applicantName}`,
      content: `A new admission application has been received for ${newApp.applyingForGrade}. Applicant: ${newApp.applicantName} (Prev GPA: ${newApp.previousGpa}). Review under the Enrollment desk.`,
      category: 'general',
      priority: 'normal',
      isAutomated: true,
    });

    return id;
  };

  const updateEnrollmentStatus = (
    id: string,
    status: EnrollmentApplication['status'],
    rollNo?: string,
    notes?: string
  ) => {
    setEnrollments((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const updated: EnrollmentApplication = {
            ...app,
            status,
            assignedRollNo: rollNo || app.assignedRollNo,
            notes: notes || app.notes,
            reviewDate: new Date().toISOString().split('T')[0],
          };

          // If approved or enrolled, automatically convert applicant to Student user if not existing!
          if (status === 'enrolled' || status === 'approved') {
            const existingStudent = users.find((u) => u.email.toLowerCase() === app.guardianEmail.toLowerCase());
            if (!existingStudent) {
              const generatedRoll = rollNo || `2026-${Math.floor(1000 + Math.random() * 9000)}`;
              addUser({
                name: app.applicantName,
                email: `${app.applicantName.toLowerCase().replace(/\s+/g, '.')}@apexacademy.edu`,
                role: 'student',
                avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
                phone: app.guardianPhone,
                grade: `${app.applyingForGrade}-A`,
                rollNo: generatedRoll,
                guardianName: app.guardianName,
                guardianPhone: app.guardianPhone,
                joinedDate: new Date().toISOString().split('T')[0],
                address: app.address,
                status: 'active',
              });
            }
          }

          return updated;
        }
        return app;
      })
    );
  };

  const sendMessage = (msgData: Omit<MessageNotification, 'id' | 'createdAt' | 'read'>) => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg: MessageNotification = {
      ...msgData,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: timeStr,
      read: false,
    };
    setNotifications((prev) => [newMsg, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const payInvoice = (invoiceId: string, method: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const txnId = `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;
          const paidDate = new Date().toISOString().split('T')[0];
          sendMessage({
            senderId: 'sys_finance',
            senderName: 'Accounts Department',
            senderRole: 'admin',
            recipientType: 'individual',
            recipientTarget: inv.studentId,
            recipientName: inv.studentName,
            title: `🧾 Payment Received for ${inv.month} (${inv.amount} BDT)`,
            content: `Payment confirmed for ${inv.studentName}. Transaction ID: ${txnId}. Payment Method: ${method}. Official receipt is available for download.`,
            category: 'fee_reminder',
            priority: 'normal',
            isAutomated: true,
          });
          return {
            ...inv,
            status: 'paid',
            paidDate,
            paymentMethod: method,
            transactionId: txnId,
          };
        }
        return inv;
      })
    );
  };

  const generateInvoice = (invoiceData: Omit<FeeInvoice, 'id'>) => {
    const newInvoice: FeeInvoice = {
      ...invoiceData,
      id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
  };

  const addNotice = (noticeData: Omit<NoticeItem, 'id' | 'date'>) => {
    const newNotice: NoticeItem = {
      ...noticeData,
      id: `not_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setNotices((prev) => [newNotice, ...prev]);

    // Broadcast automated notification
    sendMessage({
      senderId: currentUser?.id || 'usr_admin',
      senderName: currentUser?.name || 'Administration',
      senderRole: currentUser?.role || 'admin',
      recipientType: 'all',
      title: `📢 New Notice Published: ${newNotice.title}`,
      content: newNotice.summary,
      category: 'emergency_circular',
      priority: newNotice.isImportant ? 'urgent' : 'normal',
      isAutomated: true,
    });
  };

  const addEvent = (eventData: Omit<SchoolEvent, 'id'>) => {
    const newEvent: SchoolEvent = {
      ...eventData,
      id: `evt_${Date.now()}`,
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const resetAllData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setAttendance(INITIAL_ATTENDANCE);
    setGradeReports(INITIAL_GRADE_REPORTS);
    setEnrollments(INITIAL_ENROLLMENT_APPLICATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setInvoices(INITIAL_FEE_INVOICES);
    setNotices(INITIAL_NOTICES);
    setEvents(INITIAL_EVENTS);
    setCurrentUser(null);
    setActiveView('website');
  };

  const currentRole: Role | 'guest' = currentUser?.role || 'guest';

  return (
    <SchoolContext.Provider
      value={{
        currentUser,
        currentRole,
        language,
        setLanguage,
        login,
        loginAsRole,
        logout,
        activeView,
        setActiveView,
        currentView: activeView,
        setCurrentView: setActiveView,
        activePortalTab,
        setActivePortalTab,
        isLoginModalOpen,
        setIsLoginModalOpen,
        setLoginModalOpen,
        loginModalRole,
        setLoginModalRole,
        openLoginForRole,
        closeLoginModal,
        users,
        attendance,
        gradeReports,
        enrollments,
        notifications,
        invoices,
        notices,
        events,
        schedules,
        addUser,
        updateUser,
        deleteUser,
        markAttendance,
        markBatchAttendance,
        saveGradeReport,
        publishGradeReport,
        calculateGpa,
        submitEnrollmentApplication,
        updateEnrollmentStatus,
        sendMessage,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        payInvoice,
        generateInvoice,
        addNotice,
        addEvent,
        resetAllData,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
