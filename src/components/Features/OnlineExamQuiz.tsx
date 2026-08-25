import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { BookOpen, Clock3, FileQuestion, GraduationCap, Plus, Send } from 'lucide-react';

export const OnlineExamQuiz: React.FC = () => {
  const { quizzes, createQuiz, currentUser } = useSchool();
  const [title, setTitle] = useState('Physics Chapter Test');
  const [subject, setSubject] = useState('Physics');
  const [grade, setGrade] = useState('Grade 10-A');
  const [durationMinutes, setDurationMinutes] = useState(20);

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();

    createQuiz({
      title,
      subject,
      grade,
      durationMinutes,
      totalMarks: 20,
      passingMarks: 10,
      teacherName: currentUser?.name || 'Apex Teacher',
      status: 'active',
      questions: [
        {
          id: 'demo-q-1',
          question: 'Which quantity is measured in newtons?',
          options: ['Mass', 'Force', 'Energy', 'Pressure'],
          correctAnswerIndex: 1,
          explanation: 'Force is measured in newtons (N).',
          marks: 5,
        },
      ],
      instructions: 'Use the full allotted time and submit once completed.',
    });

    setTitle('');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-6xl mx-auto my-4 text-slate-900">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-400/30">
                Online Assessment Hub
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Clock3 className="w-3.5 h-3.5" /> Live Quiz Portal
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1">Online Exam & Quiz Center</h2>
            <p className="text-xs text-slate-300">Create, publish, and review classroom quizzes for students.</p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleCreateQuiz} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-2 text-slate-900">
            <Plus className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-bold font-serif">Create New Quiz</h3>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Quiz Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
              placeholder="Enter quiz title"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
              >
                <option value="Physics">Physics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
              >
                <option value="Grade 10-A">Grade 10-A</option>
                <option value="Grade 9-B">Grade 9-B</option>
                <option value="Grade 11">Grade 11</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value) || 20)}
              min={10}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Publish Quiz
          </button>
        </form>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 text-slate-900">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-bold font-serif">Published Quizzes</h3>
          </div>

          {quizzes.length === 0 ? (
            <p className="text-xs text-slate-500">No quizzes published yet.</p>
          ) : (
            <div className="space-y-3">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{quiz.title}</p>
                      <p className="text-[10px] text-slate-500">{quiz.subject} • {quiz.grade}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                      {quiz.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500">
                    <BookOpen className="w-3 h-3" /> {quiz.durationMinutes} min
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
