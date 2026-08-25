import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Award, Mail, Phone, GraduationCap, Sparkles } from 'lucide-react';

export const FacultySection: React.FC = () => {
  const { language, users } = useSchool();

  const teachers = users.filter((u) => u.role === 'teacher' || u.role === 'principal');

  return (
    <section id="faculty" className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            {language === 'bn' ? 'আমাদের বিজ্ঞ শিক্ষক ও অনুষদ' : 'Distinguished Faculty & Mentors'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
            {language === 'bn' ? 'অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষক মণ্ডলী' : 'Guided by Passionate Educators'}
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            {language === 'bn'
              ? 'আন্তর্জাতিক মানের ডিগ্রিধারী, নিবেদিতপ্রাণ শিক্ষকমণ্ডলীর তত্ত্বাবধানে পরিচালিত পাঠদান কার্যক্রম।'
              : 'Our faculty members hold advanced degrees from world-renowned universities and are devoted to shaping young minds.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col items-center text-center hover:shadow-lg hover:border-blue-300 transition-all group"
            >
              <div className="relative mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 ring-2 ring-blue-100 group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full text-[10px] shadow">
                  <Award className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 leading-tight">{t.name}</h3>
              <p className="text-xs text-blue-600 font-semibold mt-1">{t.designation || 'Senior Faculty'}</p>
              <p className="text-xs text-slate-400 mt-0.5">{t.department || 'Academic Council'}</p>

              <div className="w-full mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center justify-center gap-1.5 truncate">
                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{t.email}</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{t.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
