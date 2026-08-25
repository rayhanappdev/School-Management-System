import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { FeeInvoice, GradeReport } from '../../types';
import { ReportCardModal } from '../Common/ReportCardModal';
import { ReceiptModal } from '../Common/ReceiptModal';
import { MessagingCenter } from '../Common/MessagingCenter';
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
  BookOpen
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
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'profile' | 'academics' | 'attendance' | 'fees' | 'routine' | 'messages'>('academics');
  const [selectedReportCard, setSelectedReportCard] = useState<GradeReport | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<FeeInvoice | null>(null);
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Visa / Master Card'>('bKash');

  // Filter student-specific data
  const myReports = gradeReports.filter((r) => r.studentId === currentUser?.id || r.rollNo === currentUser?.rollNo);
  const latestReport = myReports[0] || gradeReports[0];

  const myAttendance = attendance.filter((a) => a.studentId === currentUser?.id || a.studentName === currentUser?.name);
  const presentDays = myAttendance.filter((a) => a.status === 'present').length;
  const totalDays = myAttendance.length;
  const attendanceRate = totalDays ? ((presentDays / totalDays) * 100).toFixed(1) : '96.2';

  const myInvoices = invoices.filter((i) => i.studentId === currentUser?.id || i.studentName === currentUser?.name);

  const handlePayOnline = (invoiceId: string) => {
    payInvoice(invoiceId, paymentMethod);
    setPayingInvoiceId(null);
    alert(`Payment of invoice completed successfully via ${paymentMethod}! Digital Receipt generated.`);
  };

  return (
    <div className="space-y-8">
      {/* Student Top Identity Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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

        <div className="flex flex-wrap items-center gap-3">
          {latestReport && (
            <button
              type="button"
              onClick={() => setSelectedReportCard(latestReport)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>Official Certified Transcript</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
        {[
          { id: 'academics', label: '🏆 Academic Performance & Grades' },
          { id: 'attendance', label: '📅 My Attendance Log' },
          { id: 'fees', label: '💳 Tuition Fees & Receipts' },
          { id: 'routine', label: '🗓️ Class Routine' },
          { id: 'profile', label: '👤 Student Identity Card' },
          { id: 'messages', label: '🔔 Alerts & Notifications' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Academic Performance */}
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
                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                      {latestReport.term} — Academic Progress
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedReportCard(latestReport)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Certified Transcript
                  </button>
                </div>

                {/* Score Summary Boxes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">GPA Achieved</p>
                    <p className="text-2xl font-black font-mono text-emerald-700">{latestReport.gpa.toFixed(2)}</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">Scale: 4.00</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Overall Grade</p>
                    <p className="text-2xl font-black text-blue-700">{latestReport.overallGrade}</p>
                    <span className="text-[10px] text-blue-600 font-semibold">Distinction</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Total Marks</p>
                    <p className="text-2xl font-black font-mono text-slate-900">{latestReport.totalScore}</p>
                    <span className="text-[10px] text-slate-500">Out of {latestReport.maxScore}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Class Rank</p>
                    <p className="text-2xl font-black text-purple-700">#{latestReport.positionInClass}</p>
                    <span className="text-[10px] text-purple-600 font-semibold">Cohort Position</span>
                  </div>
                </div>

                {/* Subject Breakdown */}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                    Discipline Scores & Letter Grades
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                    {latestReport.subjects.map((sub, idx) => (
                      <div key={idx} className="p-3.5 bg-white flex flex-wrap items-center justify-between gap-3">
                        <div className="w-48">
                          <p className="font-bold text-slate-900">{sub.subject}</p>
                          <p className="text-[10px] text-slate-500">{sub.remarks}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="font-bold font-mono text-blue-900">{sub.marksObtained}</span>
                            <span className="text-slate-400 font-mono text-[11px]"> / {sub.totalMarks}</span>
                          </div>

                          <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 font-extrabold text-xs">
                            {sub.grade}
                          </span>

                          <span className="font-mono font-bold text-emerald-700 text-xs w-16 text-right">
                            {sub.point.toFixed(2)} GP
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remarks */}
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/80 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-blue-900 font-bold">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    <span>Official Certification & Faculty Assessment</span>
                  </div>
                  <p className="text-slate-700 italic">Teacher: "{latestReport.teacherRemarks}"</p>
                  <p className="text-slate-700 italic">Principal: "{latestReport.principalRemarks}"</p>
                </div>
              </div>

              {/* Right: Academic History sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="font-bold text-sm">Grading System Legend</h4>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>

                  <div className="text-xs space-y-2 text-slate-300">
                    <div className="flex justify-between">
                      <span>90% - 100% (A+)</span>
                      <strong className="text-emerald-400 font-mono">4.00 GP</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>80% - 89% (A)</span>
                      <strong className="text-emerald-400 font-mono">3.75 GP</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>70% - 79% (B+)</span>
                      <strong className="text-blue-400 font-mono">3.25 GP</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>60% - 69% (B)</span>
                      <strong className="text-blue-400 font-mono">3.00 GP</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>50% - 59% (C)</span>
                      <strong className="text-amber-400 font-mono">2.50 GP</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
              No published report cards currently available for this academic term.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Attendance Log */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">My Attendance History & Compliance</h3>
              <p className="text-xs text-slate-500">Minimum 90% attendance mandatory for final examination clearance.</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500">Compliance Rate:</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-mono font-bold text-sm rounded-xl">
                {attendanceRate}% Present
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold uppercase border-y border-slate-200">
                  <th className="p-3">Date</th>
                  <th className="p-3">Session</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Teacher Remarks</th>
                  <th className="p-3">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-semibold text-slate-800">{rec.date}</td>
                    <td className="p-3 text-slate-600">{rec.grade}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          rec.status === 'present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.status === 'absent'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{rec.remarks || 'Normal Attendance'}</td>
                    <td className="p-3 text-slate-500">{rec.recordedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Tuition Fees & Payment */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Tuition Invoices & Payment Gateway</h3>
              <p className="text-xs text-slate-500">Pay monthly dues securely or download official electronic receipts.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold uppercase border-y border-slate-200">
                  <th className="p-3">Invoice Number</th>
                  <th className="p-3">Fee Period</th>
                  <th className="p-3">Amount (BDT)</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Receipt / Pay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-800">{inv.id}</td>
                    <td className="p-3 font-medium text-slate-900">{inv.month}</td>
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
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold flex items-center gap-1 ml-auto"
                        >
                          <Printer className="w-3.5 h-3.5" /> Download Receipt
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPayingInvoiceId(inv.id)}
                          className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                        >
                          Pay Online Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Online Payment Modal simulation */}
          {payingInvoiceId && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 max-w-md">
              <h4 className="font-bold text-slate-900 text-sm">Select Secure Payment Channel</h4>
              <div className="grid grid-cols-3 gap-2">
                {(['bKash', 'Nagad', 'Visa / Master Card'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === method ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayingInvoiceId(null)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handlePayOnline(payingInvoiceId)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Confirm & Clear Invoice
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Routine */}
      {activeTab === 'routine' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schedules.map((sch) => (
            <div key={sch.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-slate-900 text-base">{sch.day} Routine</span>
                <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold font-mono">
                  {sch.grade}
                </span>
              </div>

              <div className="space-y-2.5">
                {sch.periods.map((p, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{p.subject}</p>
                      <p className="text-slate-500 text-[11px] font-mono">{p.time}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-blue-700">{p.room}</span>
                      <p className="text-[10px] text-slate-400">{p.teacher}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Profile Card */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-xl space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200"
            />
            <div>
              <h3 className="text-xl font-bold text-slate-900">{currentUser?.name}</h3>
              <p className="text-xs text-blue-700 font-bold font-mono">Roll: {currentUser?.rollNo}</p>
              <p className="text-xs text-slate-500">{currentUser?.grade} | Apex International Academy</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Guardian Name</span>
              <span className="font-bold text-slate-800">{currentUser?.guardianName || 'Dr. Tariq Rahman'}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Guardian Phone</span>
              <span className="font-bold text-slate-800">{currentUser?.guardianPhone || '+880 1711-998877'}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Email Address</span>
              <span className="font-bold text-slate-800">{currentUser?.email}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Emergency Contact</span>
              <span className="font-bold text-slate-800">{currentUser?.phone}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Residential Address</span>
              <span className="font-bold text-slate-800">{currentUser?.address}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Messages */}
      {activeTab === 'messages' && <MessagingCenter />}

      {/* Printable Modals */}
      {selectedReportCard && (
        <ReportCardModal report={selectedReportCard} onClose={() => setSelectedReportCard(null)} />
      )}
      {selectedReceipt && <ReceiptModal invoice={selectedReceipt} onClose={() => setSelectedReceipt(null)} />}
    </div>
  );
};
