export * from '../types';

import type {
  AttendanceRecord,
  BookIssue,
  BroadcastMessageLog,
  EnrollmentApplication,
  ExamRoutineItem,
  FeeInvoice,
  GradeReport,
  LibraryBook,
  MessageNotification,
  NoticeItem,
  OnlineQuiz,
  SchoolEvent,
  SubjectGrade,
  TransportBus,
  User,
  ClassSchedule,
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin_1',
    name: 'Apex Administrator',
    email: 'admin@apexacademy.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    phone: '+8801711223344',
    designation: 'School Administrator',
    joinedDate: '2024-01-01',
    address: 'Dhaka',
    status: 'active',
  },
  {
    id: 'usr_student_1',
    name: 'Abrar Zahin',
    email: 'abrar@apexacademy.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    phone: '+8801811223344',
    grade: 'Grade 10-A',
    rollNo: '2026-1001',
    guardianName: 'Fazlul Rahman',
    guardianPhone: '+8801712345678',
    joinedDate: '2025-01-15',
    address: 'Dhaka',
    bloodGroup: 'B+',
    status: 'active',
  },
  {
    id: 'usr_teacher_1',
    name: 'Anisur Rahman',
    email: 'anisur@apexacademy.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    phone: '+8801911223344',
    designation: 'Science Teacher',
    department: 'Science',
    joinedDate: '2023-09-01',
    address: 'Dhaka',
    status: 'active',
  },
  {
    id: 'usr_principal_1',
    name: 'Dr. Salma Karim',
    email: 'principal@apexacademy.edu',
    role: 'principal',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&auto=format&fit=crop&q=80',
    phone: '+8801611223344',
    designation: 'Principal',
    department: 'Administration',
    joinedDate: '2021-07-01',
    address: 'Dhaka',
    status: 'active',
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att_1',
    date: '2026-08-25',
    studentId: 'usr_student_1',
    studentName: 'Abrar Zahin',
    grade: 'Grade 10-A',
    section: 'A',
    status: 'present',
    remarks: 'On-time biometric entry',
    recordedBy: 'Anisur Rahman',
    timeIn: '08:15 AM',
  },
];

export const INITIAL_GRADE_REPORTS: GradeReport[] = [
  {
    id: 'rep_1',
    studentId: 'usr_student_1',
    studentName: 'Abrar Zahin',
    rollNo: '2026-1001',
    grade: 'Grade 10-A',
    examName: 'Annual Evaluation 2026',
    term: 'Annual Evaluation',
    academicYear: '2026',
    subjects: [
      { subject: 'Physics', subjectName: 'Physics', marksObtained: 92, totalMarks: 100, grade: 'A+', point: 4, gradePoint: 4, letterGrade: 'A+', remarks: 'Excellent' },
      { subject: 'Mathematics', subjectName: 'Mathematics', marksObtained: 89, totalMarks: 100, grade: 'A', point: 3.8, gradePoint: 3.8, letterGrade: 'A', remarks: 'Very Good' },
    ],
    totalScore: 181,
    maxScore: 200,
    totalObtainedMarks: 181,
    totalPossibleMarks: 200,
    gpa: 3.9,
    overallGrade: 'A',
    letterGrade: 'A',
    positionInClass: 2,
    attendancePercentage: 96.2,
    conductRemarks: 'Strong leadership and punctuality',
    teacherRemarks: 'Consistently strong academic performance',
    principalRemarks: 'Excellent performance and future potential',
    publishedDate: '2026-08-25',
    isPublished: true,
    status: 'passed',
  },
];

export const INITIAL_ENROLLMENT_APPLICATIONS: EnrollmentApplication[] = [
  {
    id: 'app_1',
    applicantName: 'Nadia Rahman',
    dob: '2014-05-12',
    gender: 'female',
    applyingForGrade: 'Grade 9',
    previousSchool: 'Dhaka City Academy',
    previousGpa: '4.6',
    guardianName: 'Mahmud Rahman',
    guardianRelation: 'Father',
    guardianPhone: '+8801712345678',
    guardianEmail: 'mahmud@gmail.com',
    address: 'Dhanmondi, Dhaka',
    submittedAt: '2026-08-20',
    status: 'pending',
  },
];

export const INITIAL_NOTIFICATIONS: MessageNotification[] = [
  {
    id: 'msg_1',
    senderId: 'usr_admin_1',
    senderName: 'Apex Administration',
    senderRole: 'admin',
    recipientType: 'all',
    title: 'Welcome to Apex Academy',
    content: 'Welcome to the Apex Academy school management portal.',
    category: 'general',
    priority: 'normal',
    createdAt: '2026-08-25 08:00',
    isAutomated: true,
    read: false,
  },
];

export const INITIAL_FEE_INVOICES: FeeInvoice[] = [
  {
    id: 'INV-2026-1001',
    studentId: 'usr_student_1',
    studentName: 'Abrar Zahin',
    rollNo: '2026-1001',
    grade: 'Grade 10-A',
    month: 'August 2026',
    amount: 6500,
    dueDate: '2026-08-30',
    status: 'unpaid',
  },
];

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'not_1',
    title: 'School Reopens on Sunday',
    category: 'academic',
    date: '2026-08-25',
    summary: 'Regular classes resume on Sunday as scheduled.',
    content: 'All students are required to attend classes on time.',
    publishedBy: 'Principal Office',
    isImportant: true,
  },
];

export const INITIAL_EVENTS: SchoolEvent[] = [
  {
    id: 'evt_1',
    title: 'Science Fair 2026',
    category: 'academic',
    date: '2026-09-05',
    time: '10:00 AM',
    location: 'Main Auditorium',
    description: 'Annual science exhibition of students',
    isFeatured: true,
  },
];

export const INITIAL_SCHEDULE: ClassSchedule[] = [
  {
    id: 'sched_1',
    grade: 'Grade 10-A',
    day: 'Sunday',
    periods: [
      { time: '08:30-09:15', subject: 'Physics', teacher: 'Anisur Rahman', room: 'Room 101' },
      { time: '09:15-10:00', subject: 'Mathematics', teacher: 'Dr. R. Huq', room: 'Room 201' },
    ],
  },
];

export const INITIAL_QUIZZES: OnlineQuiz[] = [
  {
    id: 'quiz_1',
    title: 'Physics Quiz 01',
    subject: 'Physics',
    grade: 'Grade 10-A',
    durationMinutes: 20,
    totalMarks: 20,
    passingMarks: 10,
    teacherName: 'Anisur Rahman',
    status: 'active',
    questions: [
      {
        id: 'q1',
        question: 'Which formula represents Newton’s second law?',
        options: ['F = mv', 'F = ma', 'E = mc^2', 'V = IR'],
        correctAnswerIndex: 1,
        explanation: 'Newton’s second law is F = ma.',
        marks: 5,
      },
    ],
    instructions: 'Answer all questions before submitting.',
  },
];

export const INITIAL_LIBRARY_BOOKS: LibraryBook[] = [
  {
    id: 'bk_1',
    title: 'Physics Fundamentals',
    author: 'L. Holt',
    isbn: 'ISBN-978-001-1234',
    category: 'Physics',
    totalCopies: 5,
    availableCopies: 4,
    rackLocation: 'Rack A-2',
  },
];

export const INITIAL_BOOK_ISSUES: BookIssue[] = [
  {
    id: 'iss_1',
    bookId: 'bk_1',
    bookTitle: 'Physics Fundamentals',
    studentId: 'usr_student_1',
    studentName: 'Abrar Zahin',
    rollNo: '2026-1001',
    issueDate: '2026-08-20',
    dueDate: '2026-08-30',
    fineAmount: 0,
    status: 'borrowed',
  },
];

export const INITIAL_TRANSPORT_BUSES: TransportBus[] = [
  {
    id: 'bus_1',
    busNumber: 'A-01',
    plateNumber: 'Dhaka-12-1456',
    routeName: 'Dhanmondi Route',
    driverName: 'Rahim Uddin',
    driverPhone: '+8801711000001',
    helperName: 'Karim',
    helperPhone: '+8801711000002',
    capacity: 40,
    activeStudentsCount: 28,
    stoppages: [
      { stopName: 'Dhanmondi 27', pickupTime: '07:40 AM', dropTime: '04:10 PM' },
      { stopName: 'Mohakhali', pickupTime: '07:55 AM', dropTime: '03:55 PM' },
    ],
    status: 'on_route',
    currentLocation: 'Airport Road crossing',
  },
];

export const INITIAL_EXAM_ROUTINE: ExamRoutineItem[] = [
  {
    id: 'ex_1',
    term: 'Annual Evaluation',
    examName: 'Final Examination',
    grade: 'Grade 10-A',
    subject: 'Physics',
    date: '2026-09-10',
    time: '10:00 AM - 01:00 PM',
    room: 'Hall A',
    syllabus: 'Full syllabus',
    totalMarks: 100,
  },
];

export const INITIAL_BROADCAST_LOGS: BroadcastMessageLog[] = [
  {
    id: 'log_1',
    type: 'sms',
    category: 'emergency_circular',
    recipientGroup: 'All Parents (Grade 6 - Grade 12)',
    recipientCount: 320,
    message: 'Apex Academy Notice: School is open as normal.',
    sentAt: '2026-08-25 08:30',
    senderName: 'School Administration',
    status: 'delivered',
  },
];
