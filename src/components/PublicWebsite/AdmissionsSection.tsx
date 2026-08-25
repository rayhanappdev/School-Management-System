import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import confetti from 'canvas-confetti';
import {
  FileText,
  UserCheck,
  CheckCircle,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Search
} from 'lucide-react';

export const AdmissionsSection: React.FC = () => {
  const { language, submitEnrollmentApplication, enrollments } = useSchool();

  const [formData, setFormData] = useState({
    applicantName: '',
    dob: '',
    gender: 'male' as 'male' | 'female' | 'other',
    applyingForGrade: 'Grade 9',
    previousSchool: '',
    previousGpa: '',
    guardianName: '',
    guardianRelation: 'Father',
    guardianPhone: '',
    guardianEmail: '',
    address: '',
  });

  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [searchTrackingId, setSearchTrackingId] = useState('');
  const [trackedResult, setTrackedResult] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.guardianPhone) return;

    const appId = submitEnrollmentApplication({
      applicantName: formData.applicantName,
      dob: formData.dob || '2011-05-15',
      gender: formData.gender,
      applyingForGrade: formData.applyingForGrade,
      previousSchool: formData.previousSchool || 'Green Valley Academy',
      previousGpa: formData.previousGpa || '3.90',
      guardianName: formData.guardianName,
      guardianRelation: formData.guardianRelation,
      guardianPhone: formData.guardianPhone,
      guardianEmail: formData.guardianEmail || 'guardian@gmail.com',
      address: formData.address || 'Dhaka, Bangladesh',
    });

    setSubmittedAppId(appId);

    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleTrackApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = searchTrackingId.trim();
    const found = enrollments.find(
      (app) => app.id.toLowerCase() === cleanId.toLowerCase() || app.applicantName.toLowerCase().includes(cleanId.toLowerCase())
    );
    setTrackedResult(found || 'not_found');
  };

  return (
    <section id="admissions" className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-3">
            <FileText className="w-3.5 h-3.5" />
            {language === 'bn' ? 'অনলাইন ভর্তি কার্যক্রম ২০২৬' : 'Online Admissions 2026-2027'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
            {language === 'bn' ? 'আপনার সন্তানের উজ্জ্বল ভবিষ্যতের সূচনা করুন' : 'Step Into a World of Limitless Learning'}
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            {language === 'bn'
              ? 'সহজ তিন ধাপে অনলাইন আবেদন সম্পন্ন করুন। আমাদের অ্যাডমিশন ডেস্ক ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবে।'
              : 'Complete the digital enrollment form in minutes. Certified entrance test dates and merit scholarship grants available.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Admission Form or Success Banner */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
            {submittedAppId ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Application Submitted Successfully!</h3>
                <p className="text-slate-600 max-w-md mx-auto text-sm">
                  Your admission application has been registered into the Apex Academy Management System. The Principal and Admissions Committee have been notified.
                </p>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl inline-block text-left my-4">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Official Tracking ID:</p>
                  <p className="text-lg font-mono font-bold text-blue-600 select-all">{submittedAppId}</p>
                  <p className="text-xs text-slate-500 mt-1">Applicant: {formData.applicantName} ({formData.applyingForGrade})</p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedAppId(null);
                      setFormData({
                        applicantName: '',
                        dob: '',
                        gender: 'male',
                        applyingForGrade: 'Grade 9',
                        previousSchool: '',
                        previousGpa: '',
                        guardianName: '',
                        guardianRelation: 'Father',
                        guardianPhone: '',
                        guardianEmail: '',
                        address: '',
                      });
                    }}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  <span>Student & Academic Profile</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Legal Name of Student *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.applicantName}
                      onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                      placeholder="e.g. Rayeed Mahbub"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Applying for Grade Level *
                    </label>
                    <select
                      value={formData.applyingForGrade}
                      onChange={(e) => setFormData({ ...formData, applyingForGrade: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Grade 6">Grade 6 (Middle Wing)</option>
                      <option value="Grade 7">Grade 7 (Middle Wing)</option>
                      <option value="Grade 8">Grade 8 (Middle Wing)</option>
                      <option value="Grade 9">Grade 9 (Senior High - Science/Business)</option>
                      <option value="Grade 10">Grade 10 (Senior High)</option>
                      <option value="Grade 11">Grade 11 (College / A-Levels)</option>
                      <option value="Grade 12">Grade 12 (College / A-Levels)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Previous School GPA / Grade
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3.95 / A+"
                      value={formData.previousGpa}
                      onChange={(e) => setFormData({ ...formData, previousGpa: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 pt-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  <span>Parent / Guardian Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Guardian Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mahbubul Alam"
                      value={formData.guardianName}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Relationship to Student
                    </label>
                    <select
                      value={formData.guardianRelation}
                      onChange={(e) => setFormData({ ...formData, guardianRelation: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Legal Guardian">Legal Guardian</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Guardian Primary Contact Phone * (For SMS)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+880 1711-000000"
                      value={formData.guardianPhone}
                      onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Guardian Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="parent@example.com"
                      value={formData.guardianEmail}
                      onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    placeholder="House, Road, Area, Dhaka"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Admission Application (Free Online Processing)</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Track Application & Admission Criteria */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Track Box */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <h4 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                <span>Track Existing Application</span>
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Enter your Application ID or Applicant Name to check review & scholarship status:
              </p>

              <form onSubmit={handleTrackApplication} className="space-y-3">
                <input
                  type="text"
                  placeholder="e.g. app_2026_01 or Rayeed"
                  value={searchTrackingId}
                  onChange={(e) => setSearchTrackingId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
                >
                  Check Application Status
                </button>
              </form>

              {trackedResult && trackedResult !== 'not_found' && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{trackedResult.applicantName}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        trackedResult.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : trackedResult.status === 'enrolled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {trackedResult.status}
                    </span>
                  </div>
                  <p className="text-slate-600">Grade: {trackedResult.applyingForGrade}</p>
                  {trackedResult.assignedRollNo && (
                    <p className="text-emerald-700 font-semibold">Assigned Roll No: {trackedResult.assignedRollNo}</p>
                  )}
                  {trackedResult.notes && <p className="text-slate-500 italic">Notes: {trackedResult.notes}</p>}
                </div>
              )}

              {trackedResult === 'not_found' && (
                <p className="mt-3 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg">
                  No application found. Please verify the ID or submit a new application.
                </p>
              )}
            </div>

            {/* Admission Timeline Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
              <h4 className="font-bold text-base text-amber-300">Important Dates 2026</h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">August 30, 2026</p>
                    <p className="text-slate-400">Batch 1 Online Application Deadline</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">September 05, 2026</p>
                    <p className="text-slate-400">Merit Scholarship Entrance Evaluation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">September 15, 2026</p>
                    <p className="text-slate-400">Final Enrollment & Class Roll Allotment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
