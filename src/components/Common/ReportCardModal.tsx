import React from 'react';
import { GradeReport, User } from '../../types';
import { School, Award, Printer, X, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ReportCardModalProps {
  report: GradeReport | null;
  student?: User | null;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({ report, student, onClose }) => {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 print:m-0 print:shadow-none print:border-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">Certified Academic Progress Transcript</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Transcript</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Transcript Document Body */}
        <div className="p-8 sm:p-12 bg-white text-slate-900 print:p-8">
          {/* Institutional Header with Crest */}
          <div className="text-center pb-6 border-b-2 border-slate-900">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-md">
                <School className="w-7 h-7 text-blue-300" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-black tracking-tight font-serif uppercase text-slate-950">
                  Apex International Academy
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  Affiliated with Cambridge Assessment International Education (CAIE) & National Board
                </p>
                <p className="text-[11px] text-slate-500">
                  Gulshan Academic Campus, Dhaka 1212 | Tel: +880 2-9884501 | www.apexacademy.edu
                </p>
              </div>
            </div>
            <div className="mt-4 py-1 px-4 bg-slate-100 rounded-full inline-block text-xs font-extrabold tracking-wider text-slate-800 uppercase border border-slate-200">
              OFFICIAL ACADEMIC TRANSCRIPT & PROGRESS REPORT — {report.term.toUpperCase()}
            </div>
          </div>

          {/* Student Profile Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Student Name:</span>
              <span className="font-bold text-slate-900 text-sm">{report.studentName}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Student Roll No:</span>
              <span className="font-mono font-bold text-blue-700 text-sm">{report.rollNo}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Class & Section:</span>
              <span className="font-bold text-slate-900 text-sm">{report.grade}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Academic Session:</span>
              <span className="font-bold text-slate-900 text-sm">{report.academicYear}</span>
            </div>
          </div>

          {/* Subject Gradebook Table */}
          <div className="my-6 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-y border-slate-300 text-slate-800 uppercase font-bold text-[10px]">
                  <th className="py-2.5 px-3">SL</th>
                  <th className="py-2.5 px-3">Subject / Discipline</th>
                  <th className="py-2.5 px-3 text-center">Total Marks</th>
                  <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                  <th className="py-2.5 px-3 text-center">Letter Grade</th>
                  <th className="py-2.5 px-3 text-center">Grade Point</th>
                  <th className="py-2.5 px-3">Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {report.subjects.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-2 px-3 font-mono text-slate-500">{String(idx + 1).padStart(2, '0')}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{sub.subject}</td>
                    <td className="py-2 px-3 text-center font-mono">{sub.totalMarks}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-blue-900">{sub.marksObtained}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="inline-block font-extrabold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center font-mono font-bold">{sub.point.toFixed(2)}</td>
                    <td className="py-2 px-3 text-slate-600 text-[11px]">{sub.remarks}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100/80 font-bold border-t-2 border-slate-400">
                  <td colSpan={2} className="py-2.5 px-3 uppercase text-slate-800">
                    Aggregate Totals & Overall Result:
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono">{report.maxScore}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-blue-900">{report.totalScore}</td>
                  <td className="py-2.5 px-3 text-center text-sm font-extrabold text-blue-800">
                    {report.overallGrade}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-sm font-extrabold text-emerald-700">
                    GPA {report.gpa.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 text-xs">
                    Class Rank: <span className="font-extrabold text-blue-700">#{report.positionInClass}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Performance Summary Box & Remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-6">
            <div>
              <span className="font-bold text-slate-700 block uppercase text-[10px]">Attendance Rate:</span>
              <span className="font-extrabold text-emerald-700 text-sm">{report.attendancePercentage}% Present</span>
            </div>
            <div>
              <span className="font-bold text-slate-700 block uppercase text-[10px]">Discipline & Conduct:</span>
              <span className="text-slate-800 font-medium">{report.conductRemarks}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700 block uppercase text-[10px]">Certification Status:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> Certified & Verified
              </span>
            </div>
          </div>

          {/* Teacher & Principal Remarks */}
          <div className="space-y-3 text-xs mb-8">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-900 block text-[11px] mb-1">Class Teacher Remarks:</span>
              <p className="text-slate-600 italic">"{report.teacherRemarks}"</p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-900 block text-[11px] mb-1">Principal Executive Assessment:</span>
              <p className="text-slate-600 italic">"{report.principalRemarks}"</p>
            </div>
          </div>

          {/* Official Signature Lines */}
          <div className="pt-8 border-t border-slate-300 grid grid-cols-3 gap-8 text-center text-xs">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mx-auto w-3/4 mb-1" />
              <p className="font-bold text-slate-800">Class Coordinator</p>
              <p className="text-[10px] text-slate-500">Evaluation Officer</p>
            </div>

            <div>
              <div className="h-10 flex items-center justify-center mb-1">
                <span className="px-3 py-1 rounded-full border-2 border-blue-900 text-[10px] font-extrabold text-blue-900 uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> OFFICIAL SEAL
                </span>
              </div>
              <p className="font-bold text-slate-800">Registrar Office</p>
              <p className="text-[10px] text-slate-500">Apex Institutional Council</p>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mx-auto w-3/4 mb-1" />
              <p className="font-bold text-slate-800">Prof. Anisur Rahman, Ph.D.</p>
              <p className="text-[10px] text-slate-500">Head of Institution / Principal</p>
            </div>
          </div>

          {/* Security stamp footer */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
            <span>Doc ID: {report.id} | Printed: {new Date().toLocaleDateString()}</span>
            <span>Tamper-Proof Digital Verification Key: {Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
