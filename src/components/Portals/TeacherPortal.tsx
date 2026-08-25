import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { AttendanceStatus, GradeReport, SubjectGrade, User } from '../../types';
import { ReportCardModal } from '../Common/ReportCardModal';
import { MessagingCenter } from '../Common/MessagingCenter';
import { OnlineExamQuiz } from '../Features/OnlineExamQuiz';
import { AiStudyAndTeacherAssistant } from '../Features/AiStudyAndTeacherAssistant';
import { ClassRoutineAndExamSchedule } from '../Features/ClassRoutineAndExamSchedule';
import { SmsWhatsAppGateway } from '../Features/SmsWhatsAppGateway';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  BookOpen,
  Send,
  Plus,
  Save,
  Printer,
  Sparkles,
  Users,
  CheckCheck,
  AlertCircle,
  FileCheck,
  Bot,
  MessageSquare
} from 'lucide-react';

export const TeacherPortal: React.FC = () => {
  const {
    currentUser,
    users,
    attendance,
    markBatchAttendance,
    gradeReports,
    saveGradeReport,
    calculateGpa,
    schedules,
    sendMessage,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<
    | 'attendance'
    | 'gradebook'
    | 'schedule'
    | 'ai_assistant'
    | 'quiz_creator'
    | 'routine_maker'
    | 'sms_alerts'
    | 'assignments'
    | 'messaging'
  >('attendance');

  // Attendance Register State
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedGrade, setSelectedGrade] = useState<string>('Grade 10');
  const [selectedSection, setSelectedSection] = useState<string>('A');

  // Filter students for selected grade/section
  const classStudents = users.filter((u) => u.role === 'student' && (u.grade?.startsWith(selectedGrade) || u.grade === `${selectedGrade}-${selectedSection}`));

  // In-memory student attendance map for the selected date
  const [studentStatuses, setStudentStatuses] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});
  const [attendanceSavedMessage, setAttendanceSavedMessage] = useState(false);

  // Initialize status map from existing attendance or default to 'present'
  React.useEffect(() => {
    const existing = attendance.filter((a) => a.date === selectedDate && a.grade === selectedGrade);
    const initialMap: Record<string, { status: AttendanceStatus; remarks: string }> = {};

    classStudents.forEach((student) => {
      const match = existing.find((a) => a.studentId === student.id);
      if (match) {
        initialMap[student.id] = { status: match.status, remarks: match.remarks || '' };
      } else {
        initialMap[student.id] = { status: 'present', remarks: '' };
      }
    });

    setStudentStatuses(initialMap);
  }, [selectedDate, selectedGrade, selectedSection]);

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    classStudents.forEach((st) => {
      updated[st.id] = { status, remarks: '' };
    });
    setStudentStatuses(updated);
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
  };

  const handleRemarkChange = (studentId: string, remarks: string) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks },
    }));
  };

  const handleSaveAttendance = () => {
    const batchList = classStudents.map((st) => ({
      studentId: st.id,
      status: studentStatuses[st.id]?.status || 'present',
      remarks: studentStatuses[st.id]?.remarks,
    }));

    markBatchAttendance(
      selectedDate,
      selectedGrade,
      selectedSection,
      batchList,
      currentUser?.name || 'Class Teacher'
    );

    setAttendanceSavedMessage(true);
    setTimeout(() => setAttendanceSavedMessage(false), 4000);
  };

  // Gradebook State
  const [selectedStudentForGrading, setSelectedStudentForGrading] = useState<string>(classStudents[0]?.id || '');
  const [selectedTerm, setSelectedTerm] = useState<GradeReport['term']>('Midterm 2026');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2025-2026');
  const [gradeSubjects, setGradeSubjects] = useState<SubjectGrade[]>([
    { subject: 'Advanced Physics', marksObtained: 92, totalMarks: 100, grade: 'A+', point: 4.0, remarks: 'Excellent lab performance' },
    { subject: 'Pure Mathematics', marksObtained: 95, totalMarks: 100, grade: 'A+', point: 4.0, remarks: 'Superb problem solving' },
    { subject: 'Chemistry & Lab', marksObtained: 88, totalMarks: 100, grade: 'A', point: 3.75, remarks: 'Good analytical precision' },
    { subject: 'English Literature', marksObtained: 90, totalMarks: 100, grade: 'A+', point: 4.0, remarks: 'Creative essays' },
    { subject: 'Computer Science', marksObtained: 97, totalMarks: 100, grade: 'A+', point: 4.0, remarks: 'High coding proficiency' },
  ]);
  const [teacherRemarksInput, setTeacherRemarksInput] = useState('Diligent student with superior academic focus.');
  const [selectedReportCardPreview, setSelectedReportCardPreview] = useState<GradeReport | null>(null);

  // Dynamic calculation
  const calculated = calculateGpa(gradeSubjects);

  const handleSubjectScoreChange = (index: number, marks: number) => {
    const next = [...gradeSubjects];
    const item = next[index];
    item.marksObtained = marks;

    if (marks >= 90) {
      item.grade = 'A+';
      item.point = 4.0;
    } else if (marks >= 80) {
      item.grade = 'A';
      item.point = 3.75;
    } else if (marks >= 70) {
      item.grade = 'B+';
      item.point = 3.25;
    } else if (marks >= 60) {
      item.grade = 'B';
      item.point = 3.0;
    } else if (marks >= 50) {
      item.grade = 'C';
      item.point = 2.5;
    } else {
      item.grade = 'F';
      item.point = 0.0;
    }

    setGradeSubjects(next);
  };

  const handleSaveGradebook = () => {
    const student = users.find((u) => u.id === selectedStudentForGrading);
    if (!student) return;

    const report: Omit<GradeReport, 'id'> = {
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo || '2026-N/A',
      grade: student.grade || `${selectedGrade}-${selectedSection}`,
      term: selectedTerm,
      academicYear: selectedAcademicYear,
      subjects: gradeSubjects,
      totalScore: calculated.totalScore,
      maxScore: gradeSubjects.length * 100,
      gpa: calculated.gpa,
      overallGrade: calculated.overallGrade,
      positionInClass: Math.floor(1 + Math.random() * 5),
      attendancePercentage: 96.5,
      conductRemarks: 'Exemplary classroom conduct and peer support.',
      teacherRemarks: teacherRemarksInput,
      principalRemarks: 'Commended for consistent academic progress and dedication.',
      publishedDate: new Date().toISOString().split('T')[0],
      isPublished: true,
    };

    saveGradeReport(report);
    alert(`Grade Report for ${student.name} saved and certified!`);
  };

  // Assignment Dispatch State
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDetails, setAssignmentDetails] = useState('');
  const [assignmentGrade, setAssignmentGrade] = useState('Grade 10-A');
  const [assignmentDueDate, setAssignmentDueDate] = useState('2026-08-30');

  const handleDispatchAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentTitle) return;

    sendMessage({
      senderId: currentUser?.id || 'usr_teacher_1',
      senderName: currentUser?.name || 'Faculty Member',
      senderRole: 'teacher',
      recipientType: 'grade',
      recipientTarget: assignmentGrade,
      title: `📚 Assignment Notice: ${assignmentTitle}`,
      content: `${assignmentDetails}. Due Date: ${assignmentDueDate}. Please submit through the portal assignment desk.`,
      category: 'assignment',
      priority: 'normal',
      isAutomated: false,
    });

    setAssignmentTitle('');
    setAssignmentDetails('');
    alert(`Assignment broadcasted to all students in ${assignmentGrade}!`);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
            Faculty Teaching Workspace
          </span>
          <h2 className="text-2xl font-bold font-serif mt-1">Class Attendance & Gradebook Register</h2>
          <p className="text-xs text-emerald-100 mt-0.5">
            Logged in as <strong>{currentUser?.name || 'Ms. Sarah Mitchell'}</strong> ({currentUser?.designation || 'Senior Science Lead'})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" /> Mark Today's Register
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
        {[
          { id: 'attendance', label: '📋 Daily Attendance' },
          { id: 'gradebook', label: '📊 Gradebook & Exam Entry' },
          { id: 'ai_assistant', label: '🤖 AI Question & Lesson Planner' },
          { id: 'quiz_creator', label: '📝 Online Exam / Quiz Creator' },
          { id: 'routine_maker', label: '🗓️ Class Routine & Timetable' },
          { id: 'sms_alerts', label: '📱 Absence SMS & Alerts' },
          { id: 'assignments', label: '📤 Dispatch Assignments' },
          { id: 'messaging', label: '💬 Messages & Notices' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Attendance Register */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Attendance Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Grade</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold"
                >
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 8">Grade 8</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleMarkAll('present')}
                className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <CheckCheck className="w-4 h-4 text-emerald-700" /> Mark All Present
              </button>
            </div>
          </div>

          {attendanceSavedMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Attendance register for {selectedDate} saved! Automated SMS/Alerts dispatched for absent/late students.
              </span>
            </div>
          )}

          {/* Student Register Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold uppercase border-y border-slate-200">
                  <th className="p-3">Roll & Name</th>
                  <th className="p-3">Guardian Contact</th>
                  <th className="p-3 text-center">Status Toggle</th>
                  <th className="p-3">Teacher Note / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((st) => {
                  const currentStatus = studentStatuses[st.id]?.status || 'present';
                  return (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img src={st.avatar} alt={st.name} className="w-8 h-8 rounded-full object-cover border" />
                          <div>
                            <p className="font-bold text-slate-900">{st.name}</p>
                            <p className="text-blue-700 font-mono text-[11px] font-semibold">{st.rollNo || '2026-N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="text-slate-700">{st.guardianName || 'Guardian on record'}</p>
                        <p className="text-slate-400 font-mono text-[10px]">{st.guardianPhone || st.phone}</p>
                      </td>
                      <td className="p-3 text-center">
                        <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl gap-1">
                          {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map((stKey) => {
                            const isSelected = currentStatus === stKey;
                            let activeClass = '';
                            if (isSelected) {
                              if (stKey === 'present') activeClass = 'bg-emerald-600 text-white shadow-xs';
                              if (stKey === 'absent') activeClass = 'bg-rose-600 text-white shadow-xs';
                              if (stKey === 'late') activeClass = 'bg-amber-500 text-white shadow-xs';
                              if (stKey === 'excused') activeClass = 'bg-blue-600 text-white shadow-xs';
                            } else {
                              activeClass = 'text-slate-600 hover:text-slate-900';
                            }
                            return (
                              <button
                                key={stKey}
                                type="button"
                                onClick={() => handleStatusChange(st.id, stKey)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${activeClass}`}
                              >
                                {stKey}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          placeholder="Optional note (e.g. bus delay, sick leave)"
                          value={studentStatuses[st.id]?.remarks || ''}
                          onChange={(e) => handleRemarkChange(st.id, e.target.value)}
                          className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              * Saving will automatically trigger SMS & portal alert to guardians of absent students.
            </span>
            <button
              type="button"
              onClick={handleSaveAttendance}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Attendance Register
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Gradebook & Exam Entry */}
      {activeTab === 'gradebook' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Input Marks Form */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Exam Mark Entry & GPA Calculator</h3>
                <p className="text-xs text-slate-500">Enter marks obtained out of 100 for each curriculum subject.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Student</label>
                <select
                  value={selectedStudentForGrading}
                  onChange={(e) => setSelectedStudentForGrading(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  {classStudents.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Examination Term</label>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Midterm 2026">Midterm 2026</option>
                  <option value="Final Term 2026">Final Term 2026</option>
                  <option value="Term 1 Assessment">Term 1 Assessment</option>
                  <option value="Annual Evaluation">Annual Evaluation</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Academic Year</label>
                <input
                  type="text"
                  value={selectedAcademicYear}
                  onChange={(e) => setSelectedAcademicYear(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold font-mono"
                />
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Subject Scores:</h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {gradeSubjects.map((sub, idx) => (
                  <div key={idx} className="p-3 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="w-48">
                      <p className="font-bold text-slate-900">{sub.subject}</p>
                      <span className="text-[10px] text-slate-400">Total Marks: {sub.totalMarks}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-semibold">Marks:</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={sub.marksObtained}
                        onChange={(e) => handleSubjectScoreChange(idx, Number(e.target.value))}
                        className="w-16 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono font-bold text-blue-900"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-extrabold text-xs">
                        Grade: {sub.grade}
                      </span>
                      <span className="font-mono text-emerald-700 font-bold text-xs">Point: {sub.point.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">
                Class Teacher Academic Remarks *
              </label>
              <textarea
                rows={2}
                value={teacherRemarksInput}
                onChange={(e) => setTeacherRemarksInput(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleSaveGradebook}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save & Certify Grade Report
              </button>
            </div>
          </div>

          {/* Right: Real-time Calculated Summary Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase text-amber-300">Live Calculated Outcome</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>

              <div>
                <p className="text-xs text-slate-400">Total Aggregate Score</p>
                <h3 className="text-3xl font-extrabold font-mono text-white">
                  {calculated.totalScore} / {gradeSubjects.length * 100}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Cumulative GPA</p>
                  <p className="text-2xl font-bold font-mono text-emerald-400">{calculated.gpa.toFixed(2)}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Overall Grade</p>
                  <p className="text-2xl font-bold text-blue-400">{calculated.overallGrade}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 pt-2 leading-relaxed">
                Report will be permanently archived and made accessible to students and parents once certified.
              </p>
            </div>

            {/* List of Published Reports for this class */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Existing Transcripts:
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {gradeReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{rep.studentName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">GPA: {rep.gpa} ({rep.term})</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedReportCardPreview(rep)}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-semibold text-blue-600 flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" /> Print
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Timetable */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schedules.map((sch) => (
            <div key={sch.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-slate-900 text-base">{sch.day} Schedule</span>
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

      {/* Tab 4: Dispatch Assignments */}
      {activeTab === 'assignments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-2xl space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Broadcast Assignment or Course Material</h3>
            <p className="text-xs text-slate-500">
              Dispatches instant task instructions to the student portal and guardian alerts.
            </p>
          </div>

          <form onSubmit={handleDispatchAssignment} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">Target Class</label>
              <select
                value={assignmentGrade}
                onChange={(e) => setAssignmentGrade(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              >
                <option value="Grade 10-A">Grade 10-A</option>
                <option value="Grade 10-B">Grade 10-B</option>
                <option value="Grade 9-A">Grade 9-A</option>
                <option value="Grade 8-A">Grade 8-A</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">Assignment Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Physics Chapter 4: Thermodynamics Simulation Worksheet"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">Submission Due Date</label>
              <input
                type="date"
                value={assignmentDueDate}
                onChange={(e) => setAssignmentDueDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">Instructions & Rubric</label>
              <textarea
                rows={4}
                required
                placeholder="Provide detailed instructions, question numbers, and submission guidelines..."
                value={assignmentDetails}
                onChange={(e) => setAssignmentDetails(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Dispatch Assignment to Class
            </button>
          </form>
        </div>
      )}

      {/* Tab 5: AI Assistant */}
      {activeTab === 'ai_assistant' && <AiStudyAndTeacherAssistant defaultMode="teacher" />}

      {/* Tab 6: Online Quiz Creator */}
      {activeTab === 'quiz_creator' && <OnlineExamQuiz />}

      {/* Tab 7: Routine & Timetable */}
      {activeTab === 'routine_maker' && <ClassRoutineAndExamSchedule />}

      {/* Tab 8: SMS & Broadcast Alerts */}
      {activeTab === 'sms_alerts' && <SmsWhatsAppGateway />}

      {/* Tab 9: Messaging */}
      {activeTab === 'messaging' && <MessagingCenter />}

      {/* Transcript Preview Modal */}
      {selectedReportCardPreview && (
        <ReportCardModal report={selectedReportCardPreview} onClose={() => setSelectedReportCardPreview(null)} />
      )}
    </div>
  );
};
