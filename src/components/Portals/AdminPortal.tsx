import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { User, EnrollmentApplication, FeeInvoice, Role } from '../../types';
import { MessagingCenter } from '../Common/MessagingCenter';
import { ReceiptModal } from '../Common/ReceiptModal';
import { FeesPaymentGateway } from '../Features/FeesPaymentGateway';
import { IdAndAdmitCardGenerator } from '../Features/IdAndAdmitCardGenerator';
import { OnlineExamQuiz } from '../Features/OnlineExamQuiz';
import { LibraryAndTransport } from '../Features/LibraryAndTransport';
import { ClassRoutineAndExamSchedule } from '../Features/ClassRoutineAndExamSchedule';
import { SmsWhatsAppGateway } from '../Features/SmsWhatsAppGateway';
import { AiStudyAndTeacherAssistant } from '../Features/AiStudyAndTeacherAssistant';
import {
  Users,
  UserPlus,
  GraduationCap,
  Briefcase,
  DollarSign,
  FileCheck,
  TrendingUp,
  Search,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Mail,
  Phone,
  Calendar,
  Layers,
  Send,
  Download,
  CreditCard,
  Building,
  Check,
  QrCode,
  Bus,
  MessageSquare,
  Bot
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

export const AdminPortal: React.FC = () => {
  const {
    users,
    addUser,
    updateUser,
    deleteUser,
    enrollments,
    updateEnrollmentStatus,
    invoices,
    payInvoice,
    generateInvoice,
    attendance,
    notices,
    addNotice,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'enrollments'
    | 'users'
    | 'finance'
    | 'fees_gateway'
    | 'id_cards'
    | 'online_exams'
    | 'library_transport'
    | 'class_routine'
    | 'sms_gateway'
    | 'ai_assistant'
    | 'messaging'
    | 'notices'
  >('overview');
  const [selectedReceipt, setSelectedReceipt] = useState<FeeInvoice | null>(null);

  // User management form state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserRole, setNewUserRole] = useState<Role>('student');
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    department: 'Science',
    grade: 'Grade 10-A',
    rollNo: '',
    guardianName: '',
    guardianPhone: '',
    address: 'Dhaka, Bangladesh',
  });
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | Role>('all');

  // Invoicing state
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [newInvoiceData, setNewInvoiceData] = useState({
    studentId: '',
    month: 'September 2026',
    amount: 12500,
    dueDate: '2026-09-28',
  });

  // Notice publishing state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'academic' | 'admin' | 'admission' | 'sports'>('academic');
  const [noticeSummary, setNoticeSummary] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [isImportantNotice, setIsImportantNotice] = useState(false);

  // Calculate metrics
  const totalStudents = users.filter((u) => u.role === 'student').length;
  const totalTeachers = users.filter((u) => u.role === 'teacher').length;
  const pendingEnrollments = enrollments.filter((e) => e.status === 'pending' || e.status === 'under_review').length;
  const totalFeeCollected = invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const totalFeePending = invoices.filter((i) => i.status === 'unpaid').reduce((sum, i) => sum + i.amount, 0);

  // Charts Data
  const revenueTrendData = [
    { month: 'Apr', collected: 320000, pending: 25000 },
    { month: 'May', collected: 345000, pending: 15000 },
    { month: 'Jun', collected: 330000, pending: 30000 },
    { month: 'Jul', collected: 360000, pending: 18000 },
    { month: 'Aug', collected: totalFeeCollected, pending: totalFeePending },
  ];

  const gradeDistributionData = [
    { name: 'Grade 8', count: 18, fill: '#3b82f6' },
    { name: 'Grade 9', count: 24, fill: '#6366f1' },
    { name: 'Grade 10', count: 32, fill: '#8b5cf6' },
    { name: 'Grade 11', count: 20, fill: '#ec4899' },
    { name: 'Grade 12', count: 16, fill: '#10b981' },
  ];

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email) return;

    addUser({
      name: newUserData.name,
      email: newUserData.email,
      role: newUserRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: newUserData.phone || '+880 1711-000000',
      designation: newUserRole === 'teacher' ? newUserData.designation || 'Instructor' : undefined,
      department: newUserRole === 'teacher' ? newUserData.department : undefined,
      grade: newUserRole === 'student' ? newUserData.grade : undefined,
      rollNo: newUserRole === 'student' ? newUserData.rollNo || `2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      guardianName: newUserRole === 'student' ? newUserData.guardianName : undefined,
      guardianPhone: newUserRole === 'student' ? newUserData.guardianPhone : undefined,
      joinedDate: new Date().toISOString().split('T')[0],
      address: newUserData.address,
      status: 'active',
    });

    setShowAddUserModal(false);
    setNewUserData({
      name: '',
      email: '',
      phone: '',
      designation: '',
      department: 'Science',
      grade: 'Grade 10-A',
      rollNo: '',
      guardianName: '',
      guardianPhone: '',
      address: 'Dhaka, Bangladesh',
    });
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const student = users.find((u) => u.id === newInvoiceData.studentId);
    if (!student) return;

    generateInvoice({
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo || '2026-N/A',
      grade: student.grade || 'Grade 10',
      month: newInvoiceData.month,
      amount: Number(newInvoiceData.amount),
      dueDate: newInvoiceData.dueDate,
      status: 'unpaid',
    });

    setShowAddInvoiceModal(false);
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeSummary) return;

    addNotice({
      title: noticeTitle,
      category: noticeCategory,
      summary: noticeSummary,
      content: noticeContent || noticeSummary,
      publishedBy: 'Office of the Administrator',
      isImportant: isImportantNotice,
      attachmentName: 'Circular_Certified.pdf',
    });

    setNoticeTitle('');
    setNoticeSummary('');
    setNoticeContent('');
    setIsImportantNotice(false);
    alert('Notice published and broadcasted to school community!');
  };

  const filteredUsers = users.filter((u) => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (
      userSearchTerm &&
      !u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) &&
      !u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) &&
      !u.rollNo?.toLowerCase().includes(userSearchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Students</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalStudents}</h3>
            <span className="text-[11px] text-emerald-600 font-semibold">Active Cohort</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Faculty Staff</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalTeachers}</h3>
            <span className="text-[11px] text-purple-600 font-semibold">Senior Educators</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Admissions Queue</p>
            <h3 className="text-2xl font-bold text-amber-700">{pendingEnrollments}</h3>
            <span className="text-[11px] text-amber-600 font-semibold">Awaiting Verification</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Fee Collections</p>
            <h3 className="text-xl font-bold text-emerald-700 font-mono">{totalFeeCollected.toLocaleString()} ৳</h3>
            <span className="text-[11px] text-slate-400">August 2026 Cycle</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">System Health</p>
            <h3 className="text-2xl font-bold text-indigo-700">99.9%</h3>
            <span className="text-[11px] text-emerald-600 font-semibold">All Gateways Active</span>
          </div>
        </div>
      </div>

      {/* Portal Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
        {[
          { id: 'overview', label: '📊 System Analytics', count: null },
          { id: 'enrollments', label: '📝 Admissions', count: pendingEnrollments },
          { id: 'users', label: '👥 Users Directory', count: users.length },
          { id: 'fees_gateway', label: '💳 Fee & Billing Desk', count: null },
          { id: 'id_cards', label: '📄 ID & Admit Cards', count: null },
          { id: 'online_exams', label: '📝 Quizzes & Exams', count: null },
          { id: 'library_transport', label: '🚌 Library & Buses', count: null },
          { id: 'class_routine', label: '📅 Routine & Schedules', count: null },
          { id: 'sms_gateway', label: '📱 SMS / WhatsApp', count: null },
          { id: 'ai_assistant', label: '🤖 AI Exam Author', count: null },
          { id: 'messaging', label: '📢 Internal Comms', count: null },
          { id: 'notices', label: '📰 Notices', count: notices.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Analytics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Revenue Analytics Chart */}
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="font-bold text-slate-900 text-base mb-1">Monthly Tuition Recovery vs Pending (BDT)</h4>
              <p className="text-xs text-slate-500 mb-6">Real-time financial clearing tracking</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="collected" name="Collected (BDT)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" name="Outstanding (BDT)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Student Distribution by Grade */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="font-bold text-slate-900 text-base mb-1">Student Enrollment Distribution</h4>
              <p className="text-xs text-slate-500 mb-4">Breakdown across middle & senior wings</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={gradeDistributionData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                      {gradeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Enrollments Processing */}
      {activeTab === 'enrollments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Student Admission & Enrollment Queue</h3>
              <p className="text-xs text-slate-500">
                Review submitted online applications, verify documents, and convert approved applicants into active students.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold uppercase border-y border-slate-200">
                  <th className="p-3">Applicant Name</th>
                  <th className="p-3">Applying Grade</th>
                  <th className="p-3">Previous School & GPA</th>
                  <th className="p-3">Guardian Contact</th>
                  <th className="p-3">Submitted Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrollments.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{app.applicantName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{app.id}</p>
                    </td>
                    <td className="p-3 font-semibold text-blue-700">{app.applyingForGrade}</td>
                    <td className="p-3">
                      <p className="text-slate-800">{app.previousSchool}</p>
                      <p className="text-emerald-700 font-semibold">GPA: {app.previousGpa}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-slate-800">{app.guardianName} ({app.guardianRelation})</p>
                      <p className="text-slate-500">{app.guardianPhone}</p>
                    </td>
                    <td className="p-3 font-mono text-slate-500">{app.submittedAt}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          app.status === 'approved' || app.status === 'enrolled'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                      {app.assignedRollNo && (
                        <p className="text-[10px] text-emerald-700 font-mono mt-0.5">Roll: {app.assignedRollNo}</p>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {app.status !== 'approved' && app.status !== 'enrolled' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const roll = `2026-${Math.floor(1000 + Math.random() * 9000)}`;
                              updateEnrollmentStatus(app.id, 'approved', roll, 'Verified and enrolled');
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve & Enroll
                          </button>
                          <button
                            type="button"
                            onClick={() => updateEnrollmentStatus(app.id, 'rejected', undefined, 'Did not meet criteria')}
                            className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-emerald-700 font-bold flex items-center justify-end gap-1">
                          <CheckCircle className="w-4 h-4" /> Enrolled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: User Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">User, Student & Faculty Directory</h3>
              <p className="text-xs text-slate-500">Manage credentials, roles, and status for all school members.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" /> Add New User / Student
              </button>
            </div>
          </div>

          {/* Filters and search */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, roll no..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {(['all', 'student', 'teacher', 'principal', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    userRoleFilter === r
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold uppercase border-y border-slate-200">
                  <th className="p-3">Member Details</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Class / Designation</th>
                  <th className="p-3">Phone & Guardian</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border" />
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-slate-500 text-[11px]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-indigo-100 text-indigo-800'
                            : u.role === 'principal'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'teacher'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      {u.role === 'student' ? (
                        <div>
                          <span className="font-bold text-slate-800">{u.grade}</span>
                          <span className="block text-[10px] text-blue-700 font-mono">Roll: {u.rollNo}</span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-bold text-slate-800">{u.designation}</span>
                          <span className="block text-[10px] text-slate-500">{u.department}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <p className="text-slate-800">{u.phone}</p>
                      {u.guardianName && <p className="text-[10px] text-slate-500">Guardian: {u.guardianName}</p>}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {u.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={() => deleteUser(u.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Finance & Fee Billing */}
      {activeTab === 'finance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Tuition Fee Management & Invoices</h3>
              <p className="text-xs text-slate-500">Generate student bills, record manual receipts, and monitor fee collections.</p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddInvoiceModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Generate New Student Invoice
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold uppercase border-y border-slate-200">
                  <th className="p-3">Invoice ID</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Roll & Class</th>
                  <th className="p-3">Month</th>
                  <th className="p-3">Amount (BDT)</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Receipt / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-700">{inv.id}</td>
                    <td className="p-3 font-bold text-slate-900">{inv.studentName}</td>
                    <td className="p-3 text-slate-600">{inv.rollNo} ({inv.grade})</td>
                    <td className="p-3 font-medium text-slate-800">{inv.month}</td>
                    <td className="p-3 font-mono font-bold text-blue-900">{inv.amount.toLocaleString()} ৳</td>
                    <td className="p-3 font-mono text-slate-500">{inv.dueDate}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {inv.status === 'paid' ? (
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(inv)}
                          className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1 ml-auto"
                        >
                          <Download className="w-3.5 h-3.5" /> View Receipt
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => payInvoice(inv.id, 'Cash / Bank Counter')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                        >
                          Mark Paid (Record Cash)
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Messaging */}
      {activeTab === 'messaging' && <MessagingCenter />}

      {/* Tab 6: Notice Publishing */}
      {activeTab === 'notices' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-3xl space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Publish School Notice & Circular</h3>
            <p className="text-xs text-slate-500">
              Notices will appear on both the public school website noticeboard and inside student/teacher portals.
            </p>
          </div>

          <form onSubmit={handlePublishNotice} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">Notice Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Annual Sports Fair Schedule & Dress Code"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Notice Category</label>
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="academic">Academic / Exams</option>
                  <option value="admin">Administrative</option>
                  <option value="admission">Admissions 2026</option>
                  <option value="sports">Sports & Co-curricular</option>
                </select>
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isImportantNotice}
                    onChange={(e) => setIsImportantNotice(e.target.checked)}
                    className="rounded text-rose-600"
                  />
                  <span className="font-bold text-rose-600">Pin as High-Priority Notice</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">Notice Summary (Brief) *</label>
              <input
                type="text"
                required
                placeholder="One sentence overview displayed in cards"
                value={noticeSummary}
                onChange={(e) => setNoticeSummary(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">Full Detailed Circular Content</label>
              <textarea
                rows={4}
                placeholder="Type complete circular guidelines here..."
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Publish & Broadcast Notice
            </button>
          </form>
        </div>
      )}

      {/* Tab 7: Fees & Billing Gateway */}
      {activeTab === 'fees_gateway' && <FeesPaymentGateway />}

      {/* Tab 8: ID Card & Admit Card Generator */}
      {activeTab === 'id_cards' && <IdAndAdmitCardGenerator />}

      {/* Tab 9: Online Exams & Quizzes */}
      {activeTab === 'online_exams' && <OnlineExamQuiz />}

      {/* Tab 10: Library & Transport Bus Fleet */}
      {activeTab === 'library_transport' && <LibraryAndTransport />}

      {/* Tab 11: Class Routine & Exam Schedule */}
      {activeTab === 'class_routine' && <ClassRoutineAndExamSchedule />}

      {/* Tab 12: SMS & WhatsApp Broadcast System */}
      {activeTab === 'sms_gateway' && <SmsWhatsAppGateway />}

      {/* Tab 13: AI Assistant (Question Maker & Lesson Planner) */}
      {activeTab === 'ai_assistant' && <AiStudyAndTeacherAssistant defaultMode="teacher" />}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Add New School Member</h3>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Account Role *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['student', 'teacher', 'principal'] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setNewUserRole(r)}
                      className={`p-2 rounded-xl text-xs font-bold uppercase transition-all ${
                        newUserRole === r ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahir Farhan"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="m.farhan@apexacademy.edu"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+880 1711-..."
                  value={newUserData.phone}
                  onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {newUserRole === 'student' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">Grade Level</label>
                      <select
                        value={newUserData.grade}
                        onChange={(e) => setNewUserData({ ...newUserData, grade: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="Grade 10-A">Grade 10-A</option>
                        <option value="Grade 10-B">Grade 10-B</option>
                        <option value="Grade 9-A">Grade 9-A</option>
                        <option value="Grade 8-A">Grade 8-A</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">Roll Number</label>
                      <input
                        type="text"
                        placeholder="2026-1010"
                        value={newUserData.rollNo}
                        onChange={(e) => setNewUserData({ ...newUserData, rollNo: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">Guardian Name</label>
                      <input
                        type="text"
                        placeholder="Guardian Name"
                        value={newUserData.guardianName}
                        onChange={(e) => setNewUserData({ ...newUserData, guardianName: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">Guardian Phone</label>
                      <input
                        type="tel"
                        placeholder="+880 18..."
                        value={newUserData.guardianPhone}
                        onChange={(e) => setNewUserData({ ...newUserData, guardianPhone: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </>
              )}

              {newUserRole === 'teacher' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">Designation</label>
                    <input
                      type="text"
                      placeholder="Senior Biology Lead"
                      value={newUserData.designation}
                      onChange={(e) => setNewUserData({ ...newUserData, designation: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">Department</label>
                    <input
                      type="text"
                      placeholder="Science & STEM"
                      value={newUserData.department}
                      onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      {showAddInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-4">Generate Tuition Fee Invoice</h3>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Select Student *</label>
                <select
                  required
                  value={newInvoiceData.studentId}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, studentId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="">Choose Student</option>
                  {users
                    .filter((u) => u.role === 'student')
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.rollNo} - {s.grade})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Billing Month</label>
                <input
                  type="text"
                  value={newInvoiceData.month}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, month: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Amount (BDT)</label>
                  <input
                    type="number"
                    value={newInvoiceData.amount}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, amount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newInvoiceData.dueDate}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, dueDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddInvoiceModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && <ReceiptModal invoice={selectedReceipt} onClose={() => setSelectedReceipt(null)} />}
    </div>
  );
};
