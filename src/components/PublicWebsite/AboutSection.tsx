import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ShieldCheck, Target, HeartHandshake, Compass, Award, Quote } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { language } = useSchool();

  const values = [
    {
      icon: Target,
      title: language === 'bn' ? 'একাডেমিক শ্রেষ্ঠত্ব' : 'Academic Rigor',
      desc: language === 'bn' ? 'আন্তর্জাতিক মানদণ্ড এবং কড়া পর্যবেক্ষণ ভিত্তিক শিক্ষাদান।' : 'Challenging curriculum designed to inspire critical thinking and research-driven innovation.',
    },
    {
      icon: ShieldCheck,
      title: language === 'bn' ? 'নৈতিক ও মানবিক মূল্যবোধ' : 'Moral Character',
      desc: language === 'bn' ? 'সততা, পরোপকার ও দায়িত্বশীল নাগরিক হিসেবে গড়ে তোলা।' : 'Instilling integrity, social empathy, and environmental stewardship across all student houses.',
    },
    {
      icon: Compass,
      title: language === 'bn' ? 'প্রযুক্তি ও ভবিষ্যৎ জ্ঞান' : 'Future-Proof STEM',
      desc: language === 'bn' ? 'রোবোটিক্স, এআই এবং কম্পিউটার কোডিং সমৃদ্ধ আধুনিক পাঠ্যক্রম।' : 'Hands-on laboratories with robotics kits, digital microscopes, and algorithmic learning.',
    },
    {
      icon: HeartHandshake,
      title: language === 'bn' ? 'অন্তর্ভুক্তিমূলক পরিবেশ' : 'Holistic Development',
      desc: language === 'bn' ? 'খেলাধুলা, বিতর্ক ও সাংস্কৃতিক কর্মকাণ্ডে শিক্ষার্থীদের উৎসাহ।' : 'Vibrant athletics, debate societies, performing arts, and global exchange initiatives.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-3">
            <Award className="w-3.5 h-3.5" />
            {language === 'bn' ? 'আমাদের ইতিহাস ও লক্ষ্য' : 'Institutional Heritage & Vision'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
            {language === 'bn' ? 'একটি শ্রেষ্ঠ আগামী নির্মাণের পথপ্রদর্শক' : 'Pioneering Educational Distinction Since 2004'}
          </h2>
          <p className="text-slate-600 mt-4 text-base leading-relaxed">
            {language === 'bn'
              ? 'দুই দশকেরও বেশি সময় ধরে এপেক্স একাডেমি মেধা, সৃজনশীলতা এবং নেতৃত্বের মেলবন্ধনে তৈরি করছে আগামীর যোগ্য প্রজন্ম।'
              : 'Combining classical academic discipline with contemporary technological mastery to cultivate compassionate, resilient, and visionary global leaders.'}
          </p>
        </div>

        {/* Principal Welcome Message Block */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 shadow-sm mb-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 text-center">
              <div className="relative inline-block">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
                  alt="Principal"
                  className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl object-cover shadow-md mx-auto border-4 border-white ring-1 ring-slate-200"
                />
                <div className="absolute -bottom-3 -right-3 bg-blue-600 text-white p-2.5 rounded-xl shadow-lg">
                  <Quote className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-4">Prof. Anisur Rahman, Ph.D.</h3>
              <p className="text-xs text-blue-600 font-semibold">Head of Institution & Principal</p>
              <p className="text-xs text-slate-400">Former Dean, Faculty of Science</p>
            </div>

            <div className="md:col-span-8 space-y-4">
              <h4 className="text-2xl font-bold text-slate-900 font-serif">
                {language === 'bn' ? 'অধ্যক্ষের বাণী' : "Principal's Welcome Address"}
              </h4>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                "Welcome to Apex International Academy. Education here is not merely about syllabus completion; it is a transformative journey of intellect, moral compass, and creative confidence. With our integrated digital School Management System, parents, teachers, and administration collaborate seamlessly in real-time."
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                "Our state-of-the-art STEM laboratories, arts studios, and athletic arenas offer every child the platform to explore their highest human potential."
              </p>
              <div className="pt-2 flex items-center gap-6">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accreditation</p>
                  <p className="text-sm font-bold text-slate-800">Cambridge CAIE & National Board</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Campus Size</p>
                  <p className="text-sm font-bold text-slate-800">6.5 Acres Lush Green Facility</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition-all hover:shadow-md group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
