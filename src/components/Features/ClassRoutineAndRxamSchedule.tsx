import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ExamRoutineItem } from '../../types';
import {
  Calendar,
  Clock,
  Printer,
  Plus,
  Search,
  BookOpen,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  X,
  FileSpreadsheet
} from 'lucide-react';

interface ClassRoutineAndExamScheduleProps {
  onClose?: () => void;
  defaultTab?: 'class_routine' | 'exam_routine';
}

export const ClassRoutineAndExamSchedule: React.FC<ClassRoutineAndExamScheduleProps> = ({
  onClose,
  defaultTab = 'class_routine',
}) => {
  const {
    currentUser,
    schedules,
    examRoutines,
    addExamRoutine,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'class_routine' | 'exam_routine' | 'add_exam'>(defaultTab);
  const [selectedGrade, setSelectedGrade] = useState<string>('Grade 10-A');
  const [selectedDay, setSelectedDay] = useState<string>('Sunday');

  // New Exam Routine Form
  const [newExam, setNewExam] = useState({
    term: 'Annual Evaluation',
    examName: 'Final Examination',
    grade: 'Grade 10',
    subject: 'Physics',
    date: '2026-09-10',
    time: '10:00 AM - 01:00 PM',
    room: 'Hall A (Row 1-5)',
    totalMarks: 100,
    syllabus: 'Chapters 1 to 6 (Full Syllabus)',
  });

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  // Static mock weekly schedule table for rich visual schedule view
  const weeklyRoutineData: Record<string, { period: string; time: string; subject: string; teacher: string; room: string; color: string }[]> = {
    Sunday: [
      { period: 'Period 1', time: '08:30 - 09:15 AM', subject: 'Higher Mathematics', teacher: 'Dr. R. Huq', room: 'Room 301', color: 'blue' },
      { period: 'Period 2', time: '09:15 - 10:00 AM', subject: 'Physics Lab', teacher: 'Prof. M. Alam', room: 'Physics Lab A', color: 'indigo' },
      { period: 'Period 3', time: '10:00 - 10:45 AM', subject: 'English Literature', teacher: 'Ms. Sarah Jones', room: 'Room 301', color: 'purple' },
      { period: 'Tiffin Break', time: '10:45 - 11:15 AM', subject: 'Break / Snacks', teacher: 'Campus Cafeteria', room: 'Cafeteria', color: 'amber' },
      { period: 'Period 4', time: '11:15 - 12:00 PM', subject: 'Chemistry', teacher: 'Dr. Anisur Rahman', room: 'Chem Lab 2', color: 'teal' },
      { period: 'Period 5', time: '12:00 - 12:45 PM', subject: 'Bangla 1st Paper', teacher: 'Mrs. F. Begum', room: 'Room 301', color: 'emerald' },
      { period: 'Period 6', time: '12:45 - 01:30 PM', subject: 'ICT & Coding', teacher: 'Mr. Tanvir H.', room: 'Computer Lab 1', color: 'cyan' },
    ],
    Monday: [
      { period: 'Period 1', time: '08:30 - 09:15 AM', subject: 'Bangla 2nd Paper', teacher: 'Mrs. F. Begum', room: 'Room 301', color: 'emerald' },
      { period: 'Period 2', time: '09:15 - 10:00 AM', subject: 'Higher Mathematics', teacher: 'Dr. R. Huq', room: 'Room 301', color: 'blue' },
      { period: 'Period 3', time: '10:00 - 10:45 AM', subject: 'Biology', teacher: 'Dr. Shampa Sen', room: 'Biology Lab', color: 'rose' },
      { period: 'Tiffin Break', time: '10:45 - 11:15 AM', subject: 'Break / Refreshment', teacher: 'Campus Ground', room: 'Ground', color: 'amber' },
      { period: 'Period 4', time: '11:15 - 12:00 PM', subject: 'English Language', teacher: 'Ms. Sarah Jones', room: 'Room 301', color: 'purple' },
      { period: 'Period 5', time: '12:00 - 12:45 PM', subject: 'Physics Theory', teacher: 'Prof. M. Alam', room: 'Room 301', color: 'indigo' },
      { period: 'Period 6', time: '12:45 - 01:30 PM', subject: 'Physical Education', teacher: 'Coach Kabir', room: 'Gymnasium', color: 'amber' },
    ],
    Tuesday: [
      { period: 'Period 1', time: '08:30 - 09:15 AM', subject: 'Chemistry Theory', teacher: 'Dr. Anisur Rahman', room: 'Room 301', color: 'teal' },
      { period: 'Period 2', time: '09:15 - 10:00 AM', subject: 'English Writing', teacher: 'Ms. Sarah Jones', room: 'Room 301', color: 'purple' },
      { period: 'Period 3', time: '10:00 - 10:45 AM', subject: 'Higher Mathematics', teacher: 'Dr. R. Huq', room: 'Room 301', color: 'blue' },
      { period: 'Tiffin Break', time: '10:45 - 11:15 AM', subject: 'Break / Lunch', teacher: 'Cafeteria', room: 'Cafeteria', color: 'amber' },
      { period: 'Period 4', time: '11:15 - 12:00 PM', subject: 'Social Science / BGS', teacher: 'Mr. K. Hasan', room: 'Room 301', color: 'emerald' },
      { period: 'Period 5', time: '12:00 - 12:45 PM', subject: 'ICT Lab', teacher: 'Mr. Tanvir H.', room: 'Lab 1', color: 'cyan' },
      { period: 'Period 6', time: '12:45 - 01:30 PM', subject: 'Library & Reading', teacher: 'Central Librarian', room: 'Library', color: 'teal' },
    ],
    Wednesday: [
      { period: 'Period 1', time: '08:30 - 09:15 AM', subject: 'Physics Problem Solving', teacher: 'Prof. M. Alam', room: 'Room 301', color: 'indigo' },
      { period: 'Period 2', time: '09:15 - 10:00 AM', subject: 'Biology Lab', teacher: 'Dr. Shampa Sen', room: 'Bio Lab', color: 'rose' },
      { period: 'Period 3', time: '10:00 - 10:45 AM', subject: 'Bangla Grammar', teacher: 'Mrs. F. Begum', room: 'Room 301', color: 'emerald' },
      { period: 'Tiffin Break', time: '10:45 - 11:15 AM', subject: 'Break', teacher: 'Campus', room: 'Ground', color: 'amber' },
      { period: 'Period 4', time: '11:15 - 12:00 PM', subject: 'Higher Mathematics', teacher: 'Dr. R. Huq', room: 'Room 301', color: 'blue' },
      { period: 'Period 5', time: '12:00 - 12:45 PM', subject: 'Religion & Ethics', teacher: 'Moulana Qadir', room: 'Room 301', color: 'teal' },
      { period: 'Period 6', time: '12:45 - 01:30 PM', subject: 'Club Activity / Debate', teacher: 'Club Moderators', room: 'Auditorium', color: 'indigo' },
    ],
    Thursday: [
      { period: 'Period 1', time: '08:30 - 09:15 AM', subject: 'Higher Mathematics Test', teacher: 'Dr. R. Huq', room: 'Room 301', color: 'blue' },
      { period: 'Period 2', time: '09:15 - 10:00 AM', subject: 'English Speed Test', teacher: 'Ms. Sarah Jones', room: 'Room 301', color: 'purple' },
      { period: 'Period 3', time: '10:00 - 10:45 AM', subject: 'Chemistry Lab Work', teacher: 'Dr. Anisur Rahman', room: 'Chem Lab 2', color: 'teal' },
      { period: 'Tiffin Break', time: '10:45 - 11:15 AM', subject: 'Break', teacher: 'Cafeteria', room: 'Cafeteria', color: 'amber' },
      { period: 'Period 4', time: '11:15 - 12:00 PM', subject: 'General Science / Physics', teacher: 'Prof. M. Alam', room: 'Room 301', color: 'indigo' },
      { period: 'Period 5', time: '12:00 - 12:45 PM', subject: 'Art & Cultural', teacher: 'Ms. N. Chowdhury', room: 'Art Studio', color: 'rose' },
      { period: 'Period 6', time: '12:45 - 01:30 PM', subject: 'Weekly Assembly & Review', teacher: 'Class Teacher', room: 'Auditorium', color: 'slate' },
    ],
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    addExamRoutine({
      term: newExam.term,
      examName: newExam.examName,
      grade: newExam.grade,
      subject: newExam.subject,
      date: newExam.date,
      time: newExam.time,
      room: newExam.room,
      totalMarks: Number(newExam.totalMarks),
      syllabus: newExam.syllabus,
    });

    alert('New Examination Schedule Item added successfully!');
    setActiveTab('exam_routine');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-6xl mx-auto my-4 text-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-400/30">
                Academic Time Management
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Certified Routine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1">
              Class Routine & Exam Schedule Maker
            </h2>
            <p className="text-xs text-slate-300">
              Interactive 6-day period timetables, room assignments, and official board examination schedules.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Timetable</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between px-6 pt-4 border-b border-slate-200 bg-slate-50/70 overflow-x-auto gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('class_routine')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'class_routine'
                ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Weekly Class Timetable</span>
          </button>

          <button
            onClick={() => setActiveTab('exam_routine')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'exam_routine'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
            <span>Exam Schedule Routine ({examRoutines.length} Papers)</span>
          </button>
        </div>

        {currentUser?.role !== 'student' && (
          <button
            onClick={() => setActiveTab('add_exam')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'add_exam'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Add Exam Paper</span>
          </button>
        )}
      </div>

      {/* Main Content Body */}
      <div className="p-6 sm:p-8">
        {/* TAB 1: WEEKLY CLASS ROUTINE */}
        {activeTab === 'class_routine' && (
          <div className="space-y-6">
            {/* Filter Bar: Select Grade & Select Day */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Select Grade:</span>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="Grade 10-A">Grade 10 - Section A (Science)</option>
                  <option value="Grade 10-B">Grade 10 - Section B (Business)</option>
                  <option value="Grade 9-A">Grade 9 - Section A</option>
                  <option value="Grade 8-A">Grade 8 - Section A</option>
                </select>
              </div>

              {/* Day Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedDay === day
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Periods Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 font-serif">
                  {selectedDay} Schedule for {selectedGrade}
                </h4>
                <span className="text-xs text-slate-400">Total 6 Periods + 1 Tiffin Break</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(weeklyRoutineData[selectedDay] || weeklyRoutineData['Sunday']).map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border ${
                      item.color === 'amber'
                        ? 'bg-amber-50/70 border-amber-200'
                        : 'bg-white border-slate-200 hover:border-blue-300 shadow-xs'
                    } space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        item.color === 'amber' ? 'bg-amber-200 text-amber-900' : 'bg-blue-50 text-blue-800'
                      }`}>
                        {item.period}
                      </span>
                      <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.time}
                      </span>
                    </div>

                    <div>
                      <h5 className="text-sm font-bold text-slate-900 font-serif">{item.subject}</h5>
                      <p className="text-xs text-slate-500 mt-0.5">Faculty: <strong>{item.teacher}</strong></p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-400" /> {item.room}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Scheduled</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXAM SCHEDULE & TIMETABLE ROUTINE */}
        {activeTab === 'exam_routine' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">Official Examination Routine (2026)</h3>
                <p className="text-xs text-slate-500">Board certified dates, hall allocations, and comprehensive syllabus breakdown</p>
              </div>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-bold">
                Grade 10 Assessment
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Exam Date</th>
                    <th className="p-3.5">Subject & Code</th>
                    <th className="p-3.5">Time Slot</th>
                    <th className="p-3.5">Exam Hall</th>
                    <th className="p-3.5">Marks</th>
                    <th className="p-3.5">Syllabus Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {examRoutines.map((routine) => (
                    <tr key={routine.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          <span>{routine.date}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 font-serif">
                        {routine.subject} ({routine.grade})
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">{routine.time}</td>
                      <td className="p-3.5 font-semibold text-indigo-700">{routine.room}</td>
                      <td className="p-3.5 font-bold text-emerald-700">{routine.totalMarks} Marks</td>
                      <td className="p-3.5 text-slate-600 max-w-xs">{routine.syllabus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ADD EXAM PAPER */}
        {activeTab === 'add_exam' && (
          <form onSubmit={handleCreateExam} className="max-w-xl mx-auto bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-4 text-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">Add New Exam Paper to Routine</h3>
              <p className="text-xs text-slate-500">Enter examination timings, room allocation, and syllabus</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Grade</label>
                <input
                  type="text"
                  value={newExam.grade}
                  onChange={(e) => setNewExam({ ...newExam, grade: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Higher Mathematics"
                  value={newExam.subject}
                  onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Exam Date</label>
                <input
                  type="date"
                  required
                  value={newExam.date}
                  onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Time Slot</label>
                <input
                  type="text"
                  value={newExam.time}
                  onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Exam Hall / Room</label>
                <input
                  type="text"
                  value={newExam.room}
                  onChange={(e) => setNewExam({ ...newExam, room: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Total Marks</label>
                <input
                  type="number"
                  value={newExam.totalMarks}
                  onChange={(e) => setNewExam({ ...newExam, totalMarks: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Syllabus Scope</label>
              <textarea
                rows={3}
                value={newExam.syllabus}
                onChange={(e) => setNewExam({ ...newExam, syllabus: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Save Exam Routine Schedule
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
