import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { NoticeItem, SchoolEvent } from '../../types';
import {
  BellRing,
  Calendar,
  Clock,
  MapPin,
  Download,
  FileText,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Tag
} from 'lucide-react';

export const NoticesEventsSection: React.FC = () => {
  const { notices, events, language } = useSchool();
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  return (
    <section id="notices" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-3">
            <BellRing className="w-3.5 h-3.5" />
            {language === 'bn' ? 'বিজ্ঞপ্তি ও ক্যালেন্ডার' : 'Notices, Circulars & Events'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
            {language === 'bn' ? 'স্কুল সার্কুলার ও আসন্ন ইভেন্টস' : 'Official Circulars & Campus Events'}
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            {language === 'bn'
              ? 'স্কুলের সকল প্রাতিষ্ঠানিক ঘোষণা, পরীক্ষার সময়সূচি ও ক্রীড়া উৎসবের সর্বশেষ আপডেট।'
              : 'Stay up-to-date with official academic circulars, exam schedules, and upcoming co-curricular fixtures.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Official Notices / Circulars */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Recent Notices & Circulars</span>
              </h3>
              <span className="text-xs text-slate-500">{notices.length} active updates</span>
            </div>

            <div className="space-y-3">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => setSelectedNotice(notice)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    notice.isImportant
                      ? 'bg-amber-50/40 border-amber-200 hover:border-amber-400'
                      : 'bg-slate-50/70 border-slate-200/80 hover:border-blue-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                        {notice.category}
                      </span>
                      {notice.isImportant && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800 flex items-center gap-1">
                          ★ High Priority
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-slate-400" /> {notice.date}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base mb-1.5 hover:text-blue-600 transition-colors">
                    {notice.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {notice.summary}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium">Published by: {notice.publishedBy}</span>
                    <span className="text-blue-600 font-semibold flex items-center gap-1">
                      Read Circular <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Upcoming Events & Fixtures */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>Upcoming Events</span>
              </h3>
              <span className="text-xs text-slate-500">Academic Year 2026</span>
            </div>

            <div className="space-y-4">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-5 rounded-2xl bg-slate-900 text-white shadow-md border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      {evt.category}
                    </span>
                    <span className="text-xs font-mono text-amber-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {evt.time}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-white">{evt.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" /> {evt.date}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" /> {evt.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notice Reader Modal */}
        {selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="px-2.5 py-1 rounded text-xs font-bold uppercase bg-blue-100 text-blue-800">
                  {selectedNotice.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">{selectedNotice.date}</span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-4 mb-2">{selectedNotice.title}</h3>
              <p className="text-xs font-semibold text-blue-600 mb-4">{selectedNotice.publishedBy}</p>

              <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-700 leading-relaxed space-y-3 border border-slate-200">
                <p>{selectedNotice.content}</p>
              </div>

              {selectedNotice.attachmentName && (
                <div className="mt-4 p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-rose-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{selectedNotice.attachmentName}</p>
                      <p className="text-[10px] text-slate-400">Official Certified PDF Document</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 text-right">
                <button
                  type="button"
                  onClick={() => setSelectedNotice(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
                >
                  Close Notice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
