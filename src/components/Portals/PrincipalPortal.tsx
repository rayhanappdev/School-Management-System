import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { GradeReport } from '../../types';
import { ReportCardModal } from '../Common/ReportCardModal';
import { MessagingCenter } from '../Common/MessagingCenter';
import { SmsWhatsAppGateway } from '../Features/SmsWhatsAppGateway';
import { ClassRoutineAndExamSchedule } from '../Features/ClassRoutineAndExamSchedule';
import { LibraryAndTransport } from '../Features/LibraryAndTransport';
import { AiStudyAndTeacherAssistant } from '../Features/AiStudyAndTeacherAssistant';
import {
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  TrendingUp,
  Briefcase,
  Sparkles,
  ShieldCheck,
  Send,
  Calendar,
  Radio,
  MessageSquare,
  Bus,
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
  Legend,
  AreaChart,
  Area
} from 'recharts';

export const PrincipalPortal: React.FC = () => {
  const { users, gradeReports, publishGradeReport, attendance, sendMessage, notices, language } = useSchool();

  const [activeTab, setActiveTab] = useState<
    | 'analytics'
    | 'grades'
    | 'attendance'
    | 'faculty'
    | 'sms_broadcast'
    | 'routines_exams'
    | 'library_buses'
    | 'ai_oversight'
    | 'broadcast'
  >('analytics');
  const [selectedReportForView, setSelectedReportForView] = useState<GradeReport | null>(null);

  const students = users.filter((u) => u.role === 'student');
  const teachers = users.filter((u) => u.role === 'teacher');

  const publishedReportsCount = gradeReports.filter((r) => r.isPublished).length;
  const pendingCertificationCount = gradeReports.filter((r) => !r.isPublished).length;

  // Calculate mean GPA across all reports
  const meanGpa = gradeReports.length
    ? (gradeReports.reduce((sum, r) => sum + r.gpa, 0) / gradeReports.length).toFixed(2)
    : '3.85';

  // Overall attendance rate
  const totalAttendanceRecords = attendance.length;
  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const overallAttendanceRate = totalAttendanceRecords
    ? ((presentCount / totalAttendanceRecords) * 100).toFixed(1)
    : '95.8';

  // Subject Performance analytics
  const subjectAveragesData = [
    { subject: 'Pure Math', avgScore: 92, target: 85 },
    { subject: 'Physics', avgScore: 89, target: 85 },
    { subject: 'Computer Sci', avgScore: 95, target: 88 },
    { subject: 'Chemistry', avgScore: 86, target: 85 },
    { subject: 'English Lit', avgScore: 88, target: 85 },
    { subject: 'Social Studies', avgScore: 90, target: 85 },
  ];

  // Daily attendance timeline
  const attendanceTimelineData = [
    { day: 'Sun', present: 96, absent: 4 },
    { day: 'Mon', present: 97, absent: 3 },
    { day: 'Tue', present: 94, absent: 6 },
    { day: 'Wed', present: 98, absent: 2 },
    { day: 'Thu', present: 95, absent: 5 },
  ];

  const handleCertifyReport = (reportId: string) => {
    publishGradeReport(reportId);
  };

  const handleSendAttendanceWarning = (studentName: string, studentId: string) => {
    sendMessage({
      senderId: 'usr_principal',
      senderName: 'Prof. Anisur Rahman (Principal)',
      senderRole: 'principal',
      recipientType: 'individual',
      recipientTarget: studentId,
      recipientName: studentName,
      title: `⚠️ Executive Notice: Attendance Warning & Counselor Meeting`,
      content: `Attendance records for ${studentName} have fallen below the mandatory 90% threshold. Respected guardians are requested to attend a brief review with the Principal's Academic Council this Thursday.`,
      category: 'attendance_alert',
      priority: 'urgent',
      isAutomated: false,
    });
    alert(`Principal Executive Attendance Warning sent directly to ${studentName}!`);
  };

  return (
    <div className="space-y-8">
      {/* Top Executive Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-900 to-slate-900 text-white p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-semibold text-purple-300">Mean Academic GPA</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-3xl font-extrabold font-mono text-white">{meanGpa} / 4.00</h3>
          <p className="text-xs text-purple-200 mt-1">Institutional Academic Distinction</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-semibold text-slate-500">School Attendance Rate</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-3xl font-extrabold text-emerald-600 font-mono">{overallAttendanceRate}%</h3>
          <p className="text-xs text-slate-500 mt-1">Across all middle & senior cohorts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-semibold text-slate-500">Certified Transcripts</span>
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-3xl font-extrabold text-blue-700">{publishedReportsCount}</h3>
          <p className="text-xs text-slate-500 mt-1">Midterm 2026 Reports Published</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-semibold text-slate-500">Faculty Members</span>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900">{teachers.length} Active</h3>
          <p className="text-xs text-slate-500 mt-1">Across 6 Academic Departments</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
        {[
          { id: 'analytics', label: '📈 Executive Analytics' },
          { id: 'grades', label: `🏆 Gradebook Review (${pendingCertificationCount} Pending)` },
          { id: 'attendance', label: '📋 Attendance Oversight' },
          { id: 'sms_broadcast', label: '📱 SMS / WhatsApp Broadcast' },
          { id: 'routines_exams', label: '📅 Routine & Exam Schedules' },
          { id: 'library_buses', label: '🚌 Library & Transport' },
          { id: 'ai_oversight', label: '🤖 AI Lesson Plans & Question Bank' },
          { id: 'faculty', label: '🎓 Faculty Council' },
          { id: 'broadcast', label: '📢 Principal Internal Circulars' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-purple-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Executive Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Subject benchmark */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="font-bold text-slate-900 text-base mb-1">Academic Department Benchmarks</h4>
              <p className="text-xs text-slate-500 mb-6">Subject mean scores vs institutional targets</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectAveragesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="avgScore" name="Actual Mean %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" name="Target Benchmark %" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Attendance weekly stream */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="font-bold text-slate-900 text-base mb-1">Weekly School Attendance Trend</h4>
              <p className="text-xs text-slate-500 mb-6">Daily cohort presence percentage</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="present" name="Present %" stroke="#10b981" fill="#d1fae5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Honor Roll Highlight Card */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500 text-white rounded-xl">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Principal's Honor Roll — Term 2026</h4>
                <p className="text-xs text-slate-600">Students achieving GPA 3.85 and above with exemplary conduct</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {gradeReports
                .filter((r) => r.gpa >= 3.8)
                .map((rep) => (
                  <div key={rep.id} className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{rep.studentName}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-xs font-mono font-bold">
                        GPA {rep.gpa.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{rep.grade} | Roll: {rep.rollNo}</p>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-2">Class Rank: #{rep.positionInClass}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Grade Review & Certification */}
      {activeTab === 'grades' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Academic Transcripts & Official Certification</h3>
              <p className="text-xs text-slate-500">
                Audit teacher-submitted grades, apply the official Principal seal, and publish verified transcripts.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold uppercase border-y border-slate-200">
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Class & Roll</th>
                  <th className="p-3">Exam Term</th>
                  <th className="p-3">Total Marks</th>
                  <th className="p-3">GPA & Grade</th>
                  <th className="p-3">Class Rank</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Certification Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gradeReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{report.studentName}</td>
                    <td className="p-3 text-slate-600">{report.grade} ({report.rollNo})</td>
                    <td className="p-3 font-medium text-slate-800">{report.term}</td>
                    <td className="p-3 font-mono font-bold">{report.totalScore} / {report.maxScore}</td>
                    <td className="p-3">
                      <span className="font-mono font-bold text-emerald-700 text-sm">GPA {report.gpa.toFixed(2)}</span>{' '}
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-extrabold text-[10px]">
                        {report.overallGrade}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-blue-700">#{report.positionInClass}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          report.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {report.isPublished ? 'Certified & Published' : 'Pending Certification'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedReportForView(report)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" /> View / Print
                        </button>
                        {!report.isPublished && (
                          <button
                            type="button"
                            onClick={() => handleCertifyReport(report.id)}
                            className="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> Sign & Publish
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Attendance Oversight */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">School-Wide Attendance & Leave Audit</h3>
              <p className="text-xs text-slate-500">Monitor attendance compliance and dispatch executive notifications.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 font-semibold block uppercase">Total Present Records</span>
              <span className="text-xl font-bold text-emerald-700">{presentCount} Days</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 font-semibold block uppercase">Recorded Absences</span>
              <span className="text-xl font-bold text-rose-600">
                {attendance.filter((a) => a.status === 'absent').length} Days
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 font-semibold block uppercase">Late Arrivals</span>
              <span className="text-xl font-bold text-amber-600">
                {attendance.filter((a) => a.status === 'late').length} Incidents
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold uppercase border-y border-slate-200">
                  <th className="p-3">Date</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Notes & Reason</th>
                  <th className="p-3">Recorded By</th>
                  <th className="p-3 text-right">Intervention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-700">{att.date}</td>
                    <td className="p-3 font-bold text-slate-900">{att.studentName}</td>
                    <td className="p-3 text-slate-600">{att.grade}-{att.section}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          att.status === 'present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : att.status === 'absent'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{att.remarks || 'Standard'}</td>
                    <td className="p-3 text-slate-500">{att.recordedBy}</td>
                    <td className="p-3 text-right">
                      {att.status === 'absent' && (
                        <button
                          type="button"
                          onClick={() => handleSendAttendanceWarning(att.studentName, att.studentId)}
                          className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold flex items-center gap-1 ml-auto"
                        >
                          <AlertTriangle className="w-3 h-3" /> Issue Warning
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

      {/* Tab 4: Faculty Directory */}
      {activeTab === 'faculty' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teachers.map((tch) => (
            <div key={tch.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <img src={tch.avatar} alt={tch.name} className="w-12 h-12 rounded-full object-cover border" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{tch.name}</h4>
                  <p className="text-xs text-purple-700 font-semibold">{tch.designation}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <p className="text-slate-600">Department: <strong className="text-slate-900">{tch.department}</strong></p>
                <p className="text-slate-600">Email: {tch.email}</p>
                <p className="text-slate-600">Contact: {tch.phone}</p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold">● 100% Class Routine Compliance</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: SMS / WhatsApp Broadcast */}
      {activeTab === 'sms_broadcast' && <SmsWhatsAppGateway />}

      {/* Tab 6: Class Routine & Exam Schedule */}
      {activeTab === 'routines_exams' && <ClassRoutineAndExamSchedule />}

      {/* Tab 7: Library & Transport Bus Fleet */}
      {activeTab === 'library_buses' && <LibraryAndTransport />}

      {/* Tab 8: AI Academic Oversight */}
      {activeTab === 'ai_oversight' && <AiStudyAndTeacherAssistant defaultMode="teacher" />}

      {/* Tab 9: Principal Broadcast Desk */}
      {activeTab === 'broadcast' && <MessagingCenter />}

      {/* Official Report Card Printable Modal */}
      {selectedReportForView && (
        <ReportCardModal report={selectedReportForView} onClose={() => setSelectedReportForView(null)} />
      )}
    </div>
  );
};
