import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { FeeInvoice, GradeReport } from '../../types';
import { ReportCardModal } from '../Common/ReportCardModal';
import { ReceiptModal } from '../Common/ReceiptModal';
import { MessagingCenter } from '../Common/MessagingCenter';
import { FeesPaymentGateway } from '../Features/FeesPaymentGateway';
import { IdAndAdmitCardGenerator } from '../Features/IdAndAdmitCardGenerator';
import { OnlineExamQuiz } from '../Features/OnlineExamQuiz';
import { LibraryAndTransport } from '../Features/LibraryAndTransport';
import { ClassRoutineAndExamSchedule } from '../Features/ClassRoutineAndExamSchedule';
import { AiStudyAndTeacherAssistant } from '../Features/AiStudyAndTeacherAssistant';
import {
  GraduationCap,
  Award,
  Calendar,
  CreditCard,
  Printer,
  FileCheck,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  DollarSign,
  AlertTriangle,
  BookOpen,
  QrCode,
  Bus,
  Bot,
  FileSpreadsheet
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const {
    currentUser,
    gradeReports,
    attendance,
    invoices,
    payInvoice,
    schedules,
    language,
    quizzes,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<
    'academics' | 'fees_gateway' | 'id_admit_card' | 'online_quizzes' | 'library_bus' | 'routine_schedule' | 'ai_study' | 'attendance' | 'messages'
  >('academics');
  const [selectedReportCard, setSelectedReportCard] = useState<GradeReport | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<FeeInvoice | null>(null);

  // Filter student-specific data
  const myReports = gradeReports.filter((r) => r.studentId === currentUser?.id || r.rollNo === currentUser?.rollNo);
  const latestReport = myReports[0] || gradeReports[0];

  const myAttendance = attendance.filter((a) => a.studentId === currentUser?.id || a.studentName === currentUser?.name);
  const presentDays = myAttendance.filter((a) => a.status === 'present').length;
  const totalDays = myAttendance.length;
  const attendanceRate = totalDays ? ((presentDays / totalDays) * 100).toFixed(1) : '96.2';

  const myInvoices = invoices.filter((i) => i.studentId === currentUser?.id || i.studentName === currentUser?.name);
  const unpaidCount = myInvoices.filter((i) => i.status !== 'paid').length;

  return (
    <div className="space-y-6">
      {/* Student Top Identity Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-blue-800/40">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-400/40 shadow-md"
          />
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Student & Guardian Unified Portal</span>
            </div>
            <h2 className="text-2xl font-bold font-serif">{currentUser?.name || 'Abrar Zahin'}</h2>
            <p className="text-xs text-blue-200 mt-0.5 font-mono">
              Roll: <strong>{currentUser?.rollNo || '2026-1001'}</strong> | Class: <strong>{currentUser?.grade || 'Grade 10-A'}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('fees_gateway')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay Fees ({unpaidCount > 0 ? `${unpaidCount} Due` : 'Online'})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai_study')}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>AI Study Buddy</span>
          </button>

          {latestReport && (
            <button
              type="button"
              onClick={() => setSelectedReportCard(latestReport)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>Report Card</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
        {[
          { id: 'academics', label: '🏆 Performance & Grades', icon: Award },
          { id: 'fees_gateway', label: '💳 Pay Fees & Invoices', icon: CreditCard },
          { id: 'id_admit_card', label: '📄 ID Card & Admit Card', icon: QrCode },
          { id: 'online_quizzes', label: `📝 Online Exams (${quizzes.length})`, icon: FileCheck },
          { id: 'library_bus', label: '🚌 Library & Bus Tracking', icon: Bus },
          { id: 'routine_schedule', label: '📅 Class Routine & Timetable', icon: Calendar },
          { id: 'ai_study', label: '🤖 AI Homework Helper', icon: Bot },
          { id: 'attendance', label: '📊 Attendance Log', icon: Clock },
          { id: 'messages', label: '🔔 SMS & Notifications', icon: Mail },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ACADEMIC PERFORMANCE */}
      {activeTab === 'academics' && (
        <div className="space-y-6">
          {latestReport ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Latest Report Overview */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {latestReport.academicYear} Assessment
                    </span>
                    <h3 className="text-xl font-bold font-serif text-slate-900 mt-1">{latestReport.examName}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total GPA</span>
                      <span className="text-2xl font-black text-emerald-600">{latestReport.gpa.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Letter Grade</span>
                      <span className="text-2xl font-black text-blue-700">{latestReport.letterGrade}</span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Obtained Marks</th>
                        <th className="p-3">Grade Point</th>
                        <th className="p-3">Letter Grade</th>
                        <th className="p-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {latestReport.subjects.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold text-slate-800">{sub.subjectName}</td>
                          <td className="p-3 font-mono font-bold text-slate-900">{sub.marksObtained}/{sub.totalMarks}</td>
                          <td className="p-3 font-bold text-emerald-600">{sub.gradePoint.toFixed(2)}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                              {sub.letterGrade}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500">{sub.remarks || 'Excellent'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">
                    Status: <strong className="text-emerald-700 capitalize">{latestReport.status}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedReportCard(latestReport)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" /> Print Verified Grade Sheet
                  </button>
                </div>
              </div>

              {/* Right: Academic Summary Box */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md space-y-4">
                  <h4 className="font-serif font-bold text-sm">Academic Standings</h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-blue-200">Merit Position:</span>
                      <strong className="text-amber-300 font-bold">2nd in Section A</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-blue-200">Total Marks:</span>
                      <strong>{latestReport.totalObtainedMarks} / {latestReport.totalPossibleMarks}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Exam Assessment:</span>
                      <strong className="text-emerald-300">Passed with Distinction</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                  <h5 className="text-xs font-bold text-slate-900 uppercase">Quick Feature Hub</h5>
                  <button
                    onClick={() => setActiveTab('fees_gateway')}
                    className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-between"
                  >
                    <span>💳 Online Fee Payment</span>
                    <CreditCard className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('online_quizzes')}
                    className="w-full py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold flex items-center justify-between"
                  >
                    <span>📝 Online Quiz Assessment</span>
                    <FileCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('id_admit_card')}
                    className="w-full py-2.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold flex items-center justify-between"
                  >
                    <span>📄 Digital ID & Admit Card</span>
                    <QrCode className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('library_bus')}
                    className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold flex items-center justify-between"
                  >
                    <span>🚌 Library & Bus Tracking</span>
                    <Bus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-sm text-slate-500">No examination reports found for this student account.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FEES PAYMENT GATEWAY */}
      {activeTab === 'fees_gateway' && <FeesPaymentGateway />}

      {/* TAB 3: ID CARD & ADMIT CARD GENERATOR */}
      {activeTab === 'id_admit_card' && <IdAndAdmitCardGenerator />}

      {/* TAB 4: ONLINE QUIZZES & EXAMS */}
      {activeTab === 'online_quizzes' && <OnlineExamQuiz />}

      {/* TAB 5: LIBRARY & BUS FLEET TRACKING */}
      {activeTab === 'library_bus' && <LibraryAndTransport />}

      {/* TAB 6: CLASS ROUTINE & EXAM SCHEDULE */}
      {activeTab === 'routine_schedule' && <ClassRoutineAndExamSchedule />}

      {/* TAB 7: AI HOMEWORK HELPER */}
      {activeTab === 'ai_study' && <AiStudyAndTeacherAssistant defaultMode="student" />}

      {/* TAB 8: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Sessions</span>
              <p className="text-2xl font-bold text-slate-900">{totalDays || 48}</p>
              <p className="text-xs text-slate-500">Academic Working Days</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Present Count</span>
              <p className="text-2xl font-bold text-emerald-600">{presentDays || 46}</p>
              <p className="text-xs text-emerald-700 font-semibold">{attendanceRate}% Regularity</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">Absent Days</span>
              <p className="text-2xl font-bold text-red-600">{totalDays - presentDays || 2}</p>
              <p className="text-xs text-slate-500">Authorized medical leaves</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold font-serif text-slate-900">Attendance Log History</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Punch Time</th>
                    <th className="p-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myAttendance.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50">
                      <td className="p-3 font-medium">{rec.date}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            rec.status === 'present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rec.status === 'late'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{rec.timeIn || '08:15 AM'}</td>
                      <td className="p-3 text-slate-500">{rec.remarks || 'On-time Biometric Entry'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: MESSAGES */}
      {activeTab === 'messages' && <MessagingCenter />}

      {/* Printable Modals */}
      {selectedReportCard && (
        <ReportCardModal report={selectedReportCard} onClose={() => setSelectedReportCard(null)} />
      )}
      {selectedReceipt && <ReceiptModal invoice={selectedReceipt} onClose={() => setSelectedReceipt(null)} />}
    </div>
  );
};
