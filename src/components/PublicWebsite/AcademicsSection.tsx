import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  BookOpen,
  Cpu,
  FlaskConical,
  Palette,
  Calculator,
  Languages,
  CheckCircle2,
  Layers,
  Sparkles
} from 'lucide-react';

export const AcademicsSection: React.FC = () => {
  const { language } = useSchool();
  const [activeTab, setActiveTab] = useState<'curriculum' | 'labs' | 'clubs'>('curriculum');

  const divisions = [
    {
      level: 'Primary Wing',
      grades: 'Grades 1 – 5',
      bengaliLevel: 'প্রাথমিক বিভাগ',
      desc: 'Inquiry-based foundational learning focusing on literacy, computational thinking, social skills, and creative play.',
      features: ['Singapore Math Framework', 'Phonics & Multi-language Immersion', 'Junior STEM Discovery Kits', 'Creative Arts & Music'],
    },
    {
      level: 'Middle School',
      grades: 'Grades 6 – 8',
      bengaliLevel: 'মাধ্যমিক বিভাগ',
      desc: 'Deep conceptual understanding across sciences, advanced mathematics, social sciences, and coding fundamentals.',
      features: ['Integrated Science Labs', 'Python & Robotics Workshops', 'Debating & Model United Nations', 'Physical Education & Athletics'],
    },
    {
      level: 'Senior Secondary & College',
      grades: 'Grades 9 – 12',
      bengaliLevel: 'উচ্চ মাধ্যমিক ও কলেজ শাখা',
      desc: 'Rigorous preparation for Cambridge IGCSE, A-Levels, and National Board Examinations with university career counseling.',
      features: ['STEM / Commerce / Humanities Tracks', 'Pre-University Research Projects', 'SAT / IELTS / Olympiad Training', 'Dedicated Career Advisory Bureau'],
    },
  ];

  const labs = [
    {
      name: 'AI & Robotics Innovation Hub',
      desc: 'Equipped with Arduino, Raspberry Pi, 3D printers, and sensor arrays for autonomous hardware & software projects.',
      icon: Cpu,
      img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Advanced Chemistry & Molecular Lab',
      desc: 'Fume-hood enclosed specialized workstations adhering to international OSHA lab safety guidelines.',
      icon: FlaskConical,
      img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Digital Multimedia & Graphic Studio',
      desc: 'High-performance Apple workstations for digital animation, video editing, UI design, and audio production.',
      icon: Palette,
      img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section id="academics" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'bn' ? 'একাডেমিক পাঠ্যক্রম ও সুবিধাসমূহ' : 'Curriculum, Labs & Research'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
            {language === 'bn' ? 'বিশ্বমানের একাডেমিক সুযোগ-সুবিধা' : 'World-Class Learning Infrastructure'}
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            {language === 'bn'
              ? 'প্রাথমিক থেকে উচ্চ মাধ্যমিক পর্যন্ত প্রতিটি স্তরে আধুনিক বিজ্ঞানভিত্তিক পাঠদান পদ্ধতি।'
              : 'Holistic curriculum aligned with global pedagogical benchmarks and rigorous laboratory research.'}
          </p>

          {/* Sub-tabs */}
          <div className="flex justify-center mt-8 gap-2 p-1.5 bg-slate-100 rounded-xl w-fit mx-auto">
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'curriculum' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Academic Divisions
            </button>
            <button
              onClick={() => setActiveTab('labs')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'labs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Specialized Labs
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'curriculum' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {divisions.map((div, i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 sm:p-8 flex flex-col justify-between hover:shadow-lg hover:border-blue-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                      {div.grades}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Tier 0{i + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{div.level}</h3>
                  <p className="text-xs text-blue-600 font-medium mb-3">{div.bengaliLevel}</p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{div.desc}</p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-200">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Key Highlights:</p>
                    {div.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'labs' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {labs.map((lab, i) => {
              const Icon = lab.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200/80 overflow-hidden bg-white shadow-xs hover:shadow-md transition-all group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={lab.img}
                      alt={lab.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white p-2 rounded-xl">
                      <Icon className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{lab.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{lab.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
