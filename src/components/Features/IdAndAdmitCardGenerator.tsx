import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { User } from '../../types';
import {
  CreditCard,
  QrCode,
  Printer,
  Download,
  School,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  Share2,
  BadgeCheck
} from 'lucide-react';

interface IdAndAdmitCardGeneratorProps {
  onClose?: () => void;
  defaultStudentId?: string;
}

export const IdAndAdmitCardGenerator: React.FC<IdAndAdmitCardGeneratorProps> = ({
  onClose,
  defaultStudentId,
}) => {
  const { users, currentUser, examRoutines } = useSchool();

  const [cardType, setCardType] = useState<'id_card' | 'admit_card'>('id_card');
  const students = users.filter((u) => u.role === 'student');

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    currentUser?.role === 'student'
      ? currentUser.id
      : defaultStudentId || students[0]?.id || 'usr_student_1'
  );

  const [selectedExamTerm, setSelectedExamTerm] = useState<string>('Annual Evaluation 2026');
  const [selectedSide, setSelectedSide] = useState<'front' | 'back'>('front');

  const selectedStudent = users.find((u) => u.id === selectedStudentId) || students[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-5xl mx-auto my-4 text-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-400/30">
                Institutional Credentials Engine
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> High-Resolution PDF Ready
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1">
              Digital Student ID & Exam Admit Card Generator
            </h2>
            <p className="text-xs text-slate-300">
              One-click instant generation with QR Code verification and institutional security stamps.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Control Navigation & Student Selector */}
      <div className="p-6 bg-slate-50/80 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl">
          <button
            onClick={() => setCardType('id_card')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              cardType === 'id_card'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Digital Student ID Card</span>
          </button>

          <button
            onClick={() => setCardType('admit_card')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              cardType === 'admit_card'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Official Exam Admit Card</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {currentUser?.role !== 'student' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Student:</span>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNo || s.grade})
                  </option>
                ))}
              </select>
            </div>
          )}

          {cardType === 'admit_card' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Exam:</span>
              <select
                value={selectedExamTerm}
                onChange={(e) => setSelectedExamTerm(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="Annual Evaluation 2026">Annual Evaluation 2026</option>
                <option value="Final Term 2026">Final Board & Term 2026</option>
                <option value="Midterm 2026">Midterm Assessment 2026</option>
              </select>
            </div>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Document</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="p-6 sm:p-10 flex flex-col items-center justify-center bg-slate-100/50">
        {/* ======================= ID CARD VIEW ======================= */}
        {cardType === 'id_card' && selectedStudent && (
          <div className="space-y-6 flex flex-col items-center">
            {/* Toggle Front / Back */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs text-xs">
              <button
                onClick={() => setSelectedSide('front')}
                className={`px-3 py-1 rounded-full font-bold transition-colors ${
                  selectedSide === 'front' ? 'bg-blue-900 text-white' : 'text-slate-600'
                }`}
              >
                Card Front
              </button>
              <button
                onClick={() => setSelectedSide('back')}
                className={`px-3 py-1 rounded-full font-bold transition-colors ${
                  selectedSide === 'back' ? 'bg-blue-900 text-white' : 'text-slate-600'
                }`}
              >
                Card Back
              </button>
            </div>

            {/* FRONT SIDE */}
            {selectedSide === 'front' && (
              <div className="w-[340px] sm:w-[380px] h-[540px] bg-white rounded-3xl overflow-hidden border border-slate-300 shadow-2xl relative flex flex-col justify-between p-6 print:border-none print:shadow-none">
                {/* ID Header Curve */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-800 text-white p-5 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-amber-400">
                      <School className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs tracking-tight">Apex International Academy</h4>
                      <span className="text-[9px] text-blue-200 block uppercase tracking-wider">
                        Dhaka Campus • Est. 1998
                      </span>
                    </div>
                  </div>
                  <span className="text-[8px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded tracking-wider uppercase">
                    STUDENT
                  </span>
                </div>

                {/* Photo & Badge */}
                <div className="relative mt-12 flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={selectedStudent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                      alt={selectedStudent.name}
                      className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs">
                      <BadgeCheck className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 font-serif mt-3 text-center">
                    {selectedStudent.name}
                  </h3>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full mt-0.5">
                    Class: {selectedStudent.grade || 'Grade 10-A'}
                  </span>
                </div>

                {/* Details Table */}
                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200 text-xs space-y-1.5 my-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Roll Number:</span>
                    <strong className="font-mono text-slate-900">{selectedStudent.rollNo || '2026-1001'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Guardian Name:</span>
                    <strong className="text-slate-800">{selectedStudent.guardianName || 'Fazlul Rahman'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Blood Group:</span>
                    <strong className="text-red-700 font-black">{selectedStudent.bloodGroup || 'B+ (Positive)'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Valid Until:</span>
                    <strong className="text-slate-800 font-mono">31 DEC 2026</strong>
                  </div>
                </div>

                {/* Card Footer with QR Code & Barcode */}
                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold block">Institutional Auth</span>
                    <div className="font-serif italic text-xs font-bold text-slate-800">Anisur Rahman</div>
                    <span className="text-[8px] text-slate-400 block">Principal Signature</span>
                  </div>

                  {/* QR Simulator */}
                  <div className="w-14 h-14 bg-slate-900 p-1.5 rounded-xl flex items-center justify-center text-white shadow-xs">
                    <QrCode className="w-full h-full text-blue-300" />
                  </div>
                </div>
              </div>
            )}

            {/* BACK SIDE */}
            {selectedSide === 'back' && (
              <div className="w-[340px] sm:w-[380px] h-[540px] bg-white rounded-3xl overflow-hidden border border-slate-300 shadow-2xl p-6 flex flex-col justify-between print:border-none print:shadow-none">
                <div className="text-center border-b border-slate-200 pb-3">
                  <h4 className="font-serif font-bold text-xs text-slate-900">Apex International Academy</h4>
                  <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Card Terms & Emergency Hotline</span>
                </div>

                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-[10px] font-bold uppercase text-amber-800 block">Emergency Contacts:</span>
                    <p className="text-xs font-mono text-slate-800 mt-1">
                      Guardian: {selectedStudent.guardianPhone || '+880 1811-556677'}
                    </p>
                    <p className="text-xs font-mono text-slate-800">
                      Campus Dispatch: +880 2-9887766
                    </p>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-500">
                    <p>1. This card is non-transferable and remains property of Apex Academy.</p>
                    <p>2. Loss of card must be immediately reported to the Administration Office.</p>
                    <p>3. Compulsory for campus entrance, exams, library borrowing & transport.</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block">Residential Address on File:</span>
                    <strong className="text-xs text-slate-800">{selectedStudent.address}</strong>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="text-center pt-2 border-t border-slate-200">
                  <div className="h-10 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-md flex items-center justify-center text-white tracking-[0.4em] font-mono text-xs font-bold">
                    |||| || ||||| ||| ||||
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 mt-1 block">
                    AUTH-ID: {selectedStudent.id.toUpperCase()}-2026
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================= EXAM ADMIT CARD VIEW ======================= */}
        {cardType === 'admit_card' && selectedStudent && (
          <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-300 shadow-2xl p-6 sm:p-10 space-y-6 print:border-none print:shadow-none">
            {/* Admit Card Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-md">
                  <School className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif text-slate-900">Apex International Academy</h2>
                  <p className="text-xs text-slate-600">
                    Registered by Ministry of Education & Cambridge Assessment International
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block bg-blue-900 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                  OFFICIAL ADMIT CARD
                </span>
                <span className="block text-[11px] font-bold text-slate-700 mt-1">{selectedExamTerm}</span>
              </div>
            </div>

            {/* Student & Exam Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div className="sm:col-span-3 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 text-[11px] block">Candidate Name</span>
                  <strong className="text-sm text-slate-900 font-serif">{selectedStudent.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Roll Number</span>
                  <strong className="text-sm font-mono text-blue-700">{selectedStudent.rollNo || '2026-1001'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Class / Section</span>
                  <strong className="text-slate-800">{selectedStudent.grade || 'Grade 10-A'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Registration No</span>
                  <strong className="font-mono text-slate-800">REG-2026-{selectedStudent.id.substring(4, 9).toUpperCase()}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Examination Center</span>
                  <strong className="text-slate-800">Main Campus Exam Hall A</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Assigned Seat Number</span>
                  <strong className="text-emerald-700 font-bold font-mono">SEAT #A-24 (Row 3)</strong>
                </div>
              </div>

              {/* Candidate Avatar & QR */}
              <div className="flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
                <img
                  src={selectedStudent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={selectedStudent.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-slate-300 shadow-xs mb-1.5"
                />
                <div className="w-8 h-8 text-slate-800">
                  <QrCode className="w-full h-full text-slate-800" />
                </div>
              </div>
            </div>

            {/* Examination Schedule Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Certified Examination Routine & Subject List
              </h4>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Time</th>
                      <th className="p-2.5">Subject & Paper</th>
                      <th className="p-2.5">Room</th>
                      <th className="p-2.5 text-right">Invigilator Sign</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {examRoutines.map((routine) => (
                      <tr key={routine.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">{routine.date}</td>
                        <td className="p-2.5 text-slate-600 font-mono text-[11px]">{routine.time}</td>
                        <td className="p-2.5 font-semibold text-slate-800">{routine.subject}</td>
                        <td className="p-2.5 text-slate-600">{routine.room}</td>
                        <td className="p-2.5 text-right font-serif text-[11px] text-slate-300 italic">
                          _______________
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Candidate Rules & Verification Signatures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-slate-500 border-t border-slate-200 pt-4">
              <div className="space-y-1">
                <strong className="text-slate-800 block text-xs">Exam Instructions for Candidate:</strong>
                <p>1. Must bring this Admit Card and Student ID card to every exam hall.</p>
                <p>2. Enter hall at least 15 minutes before exam commencement.</p>
                <p>3. Electronic devices and unauthorized papers are strictly prohibited.</p>
              </div>

              <div className="flex items-end justify-between pt-6 sm:pt-0">
                <div className="text-center">
                  <div className="font-serif italic font-bold text-xs text-slate-900">Prof. M. Alam</div>
                  <div className="w-24 h-0.5 bg-slate-900 my-1 mx-auto" />
                  <span className="text-[10px] text-slate-500">Exam Controller</span>
                </div>

                <div className="text-center">
                  <div className="font-serif italic font-bold text-xs text-slate-900">Dr. Anisur Rahman</div>
                  <div className="w-24 h-0.5 bg-slate-900 my-1 mx-auto" />
                  <span className="text-[10px] text-slate-500">Principal & Head</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
