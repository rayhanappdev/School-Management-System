export type Role = 'admin' | 'principal' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  phone: string;
  designation?: string; // For staff/teachers/principal
  department?: string;
  grade?: string; // For students: e.g. "Grade 10-A"
  rollNo?: string; // For students
  guardianName?: string;
  guardianPhone?: string;
  joinedDate: string;
  address: string;
  bloodGroup?: string;
  status: 'active' | 'inactive' | 'suspended';
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  status: AttendanceStatus;
  remarks?: string;
  recordedBy: string; // teacher name or id
  timeIn?: string;
}

export interface SubjectGrade {
  subject: string;
  subjectName?: string;
  marksObtained: number;
  totalMarks: number;
  grade: string; // A+, A, B, etc.
  point: number; // 4.0, 3.7, etc.
  gradePoint?: number;
  letterGrade?: string;
  remarks: string;
}

export interface GradeReport {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  grade: string;
  examName?: string;
  term: 'Midterm 2026' | 'Final Term 2026' | 'Term 1 Assessment' | 'Annual Evaluation';
  academicYear: string;
  subjects: SubjectGrade[];
  totalScore: number;
  maxScore: number;
  totalObtainedMarks?: number;
  totalPossibleMarks?: number;
  gpa: number;
  overallGrade: string;
  letterGrade?: string;
  positionInClass: number;
  attendancePercentage: number;
  conductRemarks: string;
  teacherRemarks: string;
  principalRemarks: string;
  publishedDate: string;
  isPublished: boolean;
  status?: 'passed' | 'failed' | 'published' | 'excellent' | string;
}

export type EnrollmentStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'enrolled';

export interface EnrollmentApplication {
  id: string;
  applicantName: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  applyingForGrade: string;
  previousSchool: string;
  previousGpa: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianEmail: string;
  address: string;
  submittedAt: string;
  status: EnrollmentStatus;
  assignedRollNo?: string;
  notes?: string;
  reviewDate?: string;
}

export interface MessageNotification {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  recipientType: 'all' | 'students' | 'teachers' | 'grade' | 'individual';
  recipientTarget?: string; // e.g., student ID, grade name, or 'all'
  recipientName?: string;
  title: string;
  content: string;
  category: 'attendance_alert' | 'grade_published' | 'emergency_circular' | 'emergency_closure' | 'fee_reminder' | 'general' | 'assignment';
  priority: 'normal' | 'urgent' | 'announcement';
  createdAt: string;
  isAutomated: boolean;
  read: boolean;
}

export interface FeeInvoice {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  grade: string;
  month: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
  paidDate?: string;
  paymentMethod?: string;
  transactionId?: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  category: 'academic' | 'sports' | 'cultural' | 'exam' | 'holiday';
  date: string;
  time: string;
  location: string;
  description: string;
  isFeatured?: boolean;
}

export interface NoticeItem {
  id: string;
  title: string;
  category: 'academic' | 'admin' | 'admission' | 'sports';
  date: string;
  summary: string;
  content: string;
  attachmentName?: string;
  publishedBy: string;
  isImportant?: boolean;
}

export interface ClassSchedule {
  id: string;
  grade: string;
  day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
  periods: {
    time: string;
    subject: string;
    teacher: string;
    room: string;
  }[];
}

// 1. Fee Breakdown & Payment
export interface FeeBreakdown {
  tuitionFee: number;
  examFee: number;
  labFee: number;
  libraryFee: number;
  developmentFee: number;
  lateFine: number;
  discount: number;
}

// 2. Online Quiz & Exam System
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  marks: number;
}

export interface OnlineQuiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  teacherName: string;
  status: 'active' | 'upcoming' | 'completed';
  questions: QuizQuestion[];
  instructions?: string;
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  score: number;
  totalMarks: number;
  percentage: number;
  status: 'passed' | 'failed';
  submittedAt: string;
  answers: Record<string, number>;
}

// 3. Library Management
export type LibraryCategory =
  | 'Science'
  | 'Mathematics'
  | 'Literature'
  | 'History'
  | 'Computer Science'
  | 'General'
  | 'Physics'
  | 'Chemistry'
  | 'ICT'
  | 'Biology';

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: LibraryCategory;
  totalCopies: number;
  availableCopies: number;
  rackLocation: string;
  coverImage?: string;
}

export interface BookIssue {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount: number;
  status: 'borrowed' | 'returned' | 'overdue';
}

// 4. Transport Fleet & Tracking
export interface BusStop {
  stopName: string;
  pickupTime: string;
  dropTime: string;
}

export interface TransportBus {
  id: string;
  busNumber: string;
  plateNumber?: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  helperName: string;
  helperPhone: string;
  capacity: number;
  activeStudentsCount: number;
  stoppages: BusStop[];
  status: 'on_route' | 'in_campus' | 'maintenance' | 'arrived_campus';
  currentLocation?: string;
}

// 5. Exam Routine / Schedule
export interface ExamRoutineItem {
  id: string;
  term: string;
  examName: string;
  grade: string;
  subject: string;
  date: string;
  time: string;
  room: string;
  syllabus: string;
  totalMarks: number;
}

// 6. SMS & WhatsApp Broadcast
export interface BroadcastMessageLog {
  id: string;
  type: 'sms' | 'whatsapp';
  category: 'attendance_alert' | 'exam_result' | 'fee_reminder' | 'emergency_circular' | 'emergency_closure' | 'general';
  recipientGroup: string;
  recipientCount: number;
  message: string;
  sentAt: string;
  senderName: string;
  status: 'delivered' | 'sent' | 'failed';
}
