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
}

export interface SubjectGrade {
  subject: string;
  marksObtained: number;
  totalMarks: number;
  grade: string; // A+, A, B, etc.
  point: number; // 4.0, 3.7, etc.
  remarks: string;
}

export interface GradeReport {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  grade: string;
  term: 'Midterm 2026' | 'Final Term 2026' | 'Term 1 Assessment' | 'Annual Evaluation';
  academicYear: string;
  subjects: SubjectGrade[];
  totalScore: number;
  maxScore: number;
  gpa: number;
  overallGrade: string;
  positionInClass: number;
  attendancePercentage: number;
  conductRemarks: string;
  teacherRemarks: string;
  principalRemarks: string;
  publishedDate: string;
  isPublished: boolean;
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
  category: 'attendance_alert' | 'grade_published' | 'emergency_circular' | 'fee_reminder' | 'general' | 'assignment';
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
