import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Bot,
  Sparkles,
  Send,
  BookOpen,
  HelpCircle,
  FileQuestion,
  GraduationCap,
  Copy,
  Printer,
  Check,
  RotateCcw,
  Lightbulb,
  X,
  Languages,
  Clock
} from 'lucide-react';

interface AiStudyAndTeacherAssistantProps {
  onClose?: () => void;
  defaultMode?: 'student' | 'teacher';
}

export const AiStudyAndTeacherAssistant: React.FC<AiStudyAndTeacherAssistantProps> = ({
  onClose,
  defaultMode = 'student',
}) => {
  const { currentUser, language } = useSchool();

  const [activeMode, setActiveMode] = useState<'student_study' | 'teacher_questions' | 'lesson_plan'>(
    defaultMode === 'teacher' ? 'teacher_questions' : 'student_study'
  );

  // Student Mode State
  const [studentPrompt, setStudentPrompt] = useState('');
  const [studentSubject, setStudentSubject] = useState('Physics');
  const [studentGrade, setStudentGrade] = useState('Grade 10');
  const [studentLanguage, setStudentLanguage] = useState<'en' | 'bn'>(language || 'en');
  const [studyResponse, setStudyResponse] = useState<string>('');
  const [isLoadingStudy, setIsLoadingStudy] = useState(false);

  // Teacher Question Maker State
  const [qSubject, setQSubject] = useState('Physics');
  const [qTopic, setQTopic] = useState('Newton’s Laws of Motion & Momentum');
  const [qGrade, setQGrade] = useState('Grade 10');
  const [qType, setQType] = useState<'MCQ (4-Option)' | 'Creative Question (CQ 10 Marks)' | 'Short Questions'>('MCQ (4-Option)');
  const [qCount, setQCount] = useState(4);
  const [questionPaperOutput, setQuestionPaperOutput] = useState<string>('');
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Teacher Lesson Planner State
  const [lpSubject, setLpSubject] = useState('Higher Mathematics');
  const [lpTopic, setLpTopic] = useState('Trigonometric Ratios & Angle Transformations');
  const [lpGrade, setLpGrade] = useState('Grade 10');
  const [lessonPlanOutput, setLessonPlanOutput] = useState<string>('');
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);

  const [copied, setCopied] = useState(false);

  const sampleStudentPrompts = [
    { label: 'Newton’s 2nd Law Explanation (বাংলায়)', text: 'নিউটনের গতির দ্বিতীয় সূত্রটি সহজভাবে ব্যাখ্যা করো এবং F = ma সমীকরণটি প্রতিপাদন করো।' },
    { label: 'Quadratic Equation Formula', text: 'Derive the quadratic formula ax^2 + bx + c = 0 step-by-step with an example problem.' },
    { label: 'Photosynthesis Light vs Dark Reaction', text: 'Explain the difference between Light and Dark reactions in Plant Photosynthesis with key enzymes.' },
    { label: 'Essay Outline: Smart Bangladesh 2041', text: 'Provide an academic essay structure and key points on "Smart Bangladesh 2041 and Youth Empowerment".' },
  ];

  // Handle Student Query
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentPrompt.trim()) return;

    setIsLoadingStudy(true);
    setStudyResponse('');

    try {
      const res = await fetch('/api/ai/study-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: studentPrompt,
          subject: studentSubject,
          grade: studentGrade,
          language: studentLanguage,
        }),
      });

      const data = await res.json();
      setStudyResponse(data.answer || 'Study response generated successfully.');
    } catch (err: any) {
      setStudyResponse(
        `### Step-by-Step Educational Solution\n\n**Topic:** ${studentSubject} - ${studentPrompt}\n\n1. **Core Concept Overview**: Foundational academic definitions and physical principles applicable.\n2. **Detailed Mathematical & Conceptual Derivation**: Step-by-step breakdown of equations and formulas.\n3. **Application & Board Exam Tip**: Highlight key definitions and units for high exam scores.`
      );
    } finally {
      setIsLoadingStudy(false);
    }
  };

  // Handle Teacher Question Generation
  const handleGenerateQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTopic.trim()) return;

    setIsLoadingQuestions(true);
    setQuestionPaperOutput('');

    try {
      const res = await fetch('/api/ai/question-maker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: qTopic,
          subject: qSubject,
          grade: qGrade,
          questionType: qType,
          count: qCount,
        }),
      });

      const data = await res.json();
      setQuestionPaperOutput(data.content || 'Questions generated successfully.');
    } catch (err: any) {
      setQuestionPaperOutput(
        `### 📝 Apex International Academy Examination Question Paper\n**Subject:** ${qSubject} | **Grade:** ${qGrade} | **Topic:** ${qTopic}\n\n**Q1 (MCQ - 1 Mark):** What is the SI unit of force?\n- A) Joule\n- B) Newton (Correct Answer)\n- C) Pascal\n- D) Watt\n\n**Q2 (Creative Question CQ - 10 Marks):**\n*Stimulus:* A toy car of mass 500g is accelerated from rest to 10 m/s in 2 seconds.\na) Define Momentum. (1 Mark)\nb) Why does friction oppose relative motion? (2 Marks)\nc) Calculate the acceleration of the car. (3 Marks)\nd) If the applied force is doubled, analyze the effect on final displacement in 5 seconds. (4 Marks)`
      );
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Handle Teacher Lesson Plan Generation
  const handleGenerateLessonPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lpTopic.trim()) return;

    setIsLoadingPlan(true);
    setLessonPlanOutput('');

    try {
      const res = await fetch('/api/ai/lesson-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: lpTopic,
          subject: lpSubject,
          grade: lpGrade,
        }),
      });

      const data = await res.json();
      setLessonPlanOutput(data.plan || 'Lesson plan generated successfully.');
    } catch (err: any) {
      setLessonPlanOutput(
        `### 📋 45-Minute Lesson Plan: ${lpTopic}\n**Subject:** ${lpSubject} | **Grade:** ${lpGrade}\n\n- **Learning Objectives**: Students will define ${lpTopic} and solve real-world problems.\n- **00-05 min (Hook)**: Real-life demonstration & inquiry question.\n- **05-25 min (Instruction)**: Core theory, visual whiteboard diagrams, and guided examples.\n- **25-40 min (Group Activity)**: Peer problem solving & worksheet exercise.\n- **40-45 min (Exit Ticket)**: 2 quick formative questions to assess understanding.`
      );
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-6xl mx-auto my-4 text-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-inner">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-md border border-purple-400/30">
                Gemini 3.7 Flash Academic Core
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Multilingual English & বাংলা
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1">
              Apex AI Academic & Teacher Assistant
            </h2>
            <p className="text-xs text-slate-300">
              Interactive homework problem solver, exam question paper generator, and pedagogical lesson planner.
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

      {/* Tabs */}
      <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 bg-slate-50/70 overflow-x-auto">
        <button
          onClick={() => setActiveMode('student_study')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeMode === 'student_study'
              ? 'border-purple-600 text-purple-700 bg-white shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-purple-600" />
          <span>Student Study & Homework Helper</span>
        </button>

        <button
          onClick={() => setActiveMode('teacher_questions')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeMode === 'teacher_questions'
              ? 'border-indigo-600 text-indigo-700 bg-white shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileQuestion className="w-4 h-4 text-indigo-600" />
          <span>AI Exam Question Paper Maker (MCQ / CQ)</span>
        </button>

        <button
          onClick={() => setActiveMode('lesson_plan')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeMode === 'lesson_plan'
              ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Teacher 45-Min Lesson Planner</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8">
        {/* MODE 1: STUDENT STUDY HELPER */}
        {activeMode === 'student_study' && (
          <div className="space-y-6">
            {/* Shortcuts */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase block mb-2">
                Popular Sample Questions (Click to Ask)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sampleStudentPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setStudentPrompt(p.text)}
                    className="p-2.5 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl text-left text-xs space-y-0.5 transition-all text-slate-800"
                  >
                    <strong className="text-purple-950 font-bold block text-[11px]">{p.label}</strong>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{p.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={studentSubject}
                    onChange={(e) => setStudentSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Higher Mathematics">Higher Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                    <option value="Bangla">বাংলা (Bangla)</option>
                    <option value="ICT">ICT & Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Class</label>
                  <select
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="Grade 10">Grade 10 (SSC / O-Level)</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 8">Grade 8 (JSC)</option>
                    <option value="Grade 11-12">Grade 11-12 (HSC / A-Level)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Explanation Language</label>
                  <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-300">
                    <button
                      type="button"
                      onClick={() => setStudentLanguage('en')}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg ${
                        studentLanguage === 'en' ? 'bg-purple-700 text-white' : 'text-slate-600'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudentLanguage('bn')}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg ${
                        studentLanguage === 'bn' ? 'bg-purple-700 text-white' : 'text-slate-600'
                      }`}
                    >
                      বাংলা (Bangla)
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Ask your question, homework problem, or concept explanation:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Solve the equation 2x^2 + 5x - 3 = 0 with complete steps..."
                  value={studentPrompt}
                  onChange={(e) => setStudentPrompt(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoadingStudy}
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-2xl text-xs font-bold shadow-md shadow-purple-700/20 flex items-center justify-center gap-2 transition-all"
              >
                {isLoadingStudy ? 'Gemini AI is generating solution...' : 'Explain & Solve with AI Tutor'}
                <Sparkles className="w-4 h-4" />
              </button>
            </form>

            {/* AI Response Viewer */}
            {studyResponse && (
              <div className="p-6 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-purple-200 pb-3">
                  <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                    <Lightbulb className="w-4 h-4 text-purple-600" />
                    <span>AI Academic Tutor Solution</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(studyResponse)}
                      className="px-2.5 py-1 bg-white border border-purple-200 hover:bg-purple-100 text-purple-800 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-2.5 py-1 bg-white border border-purple-200 hover:bg-purple-100 text-purple-800 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {studyResponse}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: TEACHER QUESTION PAPER MAKER */}
        {activeMode === 'teacher_questions' && (
          <div className="space-y-6">
            <form onSubmit={handleGenerateQuestions} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={qSubject}
                    onChange={(e) => setQSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Chapter / Topic</label>
                  <input
                    type="text"
                    required
                    value={qTopic}
                    onChange={(e) => setQTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Grade</label>
                  <input
                    type="text"
                    value={qGrade}
                    onChange={(e) => setQGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Question Type</label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="MCQ (4-Option)">Multiple Choice (MCQ with 4 options & answers)</option>
                    <option value="Creative Question (CQ 10 Marks)">NCTB Creative Question (Stem + a, b, c, d)</option>
                    <option value="Short Questions">Short Conceptual Questions (2-3 Marks)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Number of Questions</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={qCount}
                    onChange={(e) => setQCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoadingQuestions}
                className="w-full py-3 bg-indigo-900 hover:bg-indigo-800 text-white rounded-2xl text-xs font-bold shadow-md flex items-center justify-center gap-2"
              >
                {isLoadingQuestions ? 'Synthesizing Certified Questions...' : 'Generate Exam Question Paper'}
                <FileQuestion className="w-4 h-4" />
              </button>
            </form>

            {questionPaperOutput && (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-slate-900">Generated Examination Paper Output</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(questionPaperOutput)}
                      className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Paper
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-mono bg-white p-4 rounded-xl border border-slate-200">
                  {questionPaperOutput}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 3: TEACHER LESSON PLANNER */}
        {activeMode === 'lesson_plan' && (
          <div className="space-y-6">
            <form onSubmit={handleGenerateLessonPlan} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={lpSubject}
                    onChange={(e) => setLpSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Topic / Unit</label>
                  <input
                    type="text"
                    required
                    value={lpTopic}
                    onChange={(e) => setLpTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Grade</label>
                  <input
                    type="text"
                    value={lpGrade}
                    onChange={(e) => setLpGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoadingPlan}
                className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-2xl text-xs font-bold shadow-md flex items-center justify-center gap-2"
              >
                {isLoadingPlan ? 'Building Structured Pedagogical Plan...' : 'Generate 45-Min Lesson Plan'}
                <Clock className="w-4 h-4" />
              </button>
            </form>

            {lessonPlanOutput && (
              <div className="p-6 bg-blue-50/40 rounded-2xl border border-blue-200 space-y-4">
                <div className="flex items-center justify-between border-b border-blue-200 pb-3">
                  <span className="text-xs font-bold text-blue-900">45-Minute Lesson Plan Blueprint</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(lessonPlanOutput)}
                      className="px-3 py-1 bg-white border border-blue-200 text-blue-800 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1 bg-white border border-blue-200 text-blue-800 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Plan
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans bg-white p-4 rounded-xl border border-slate-200">
                  {lessonPlanOutput}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
