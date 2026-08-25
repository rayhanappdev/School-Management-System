import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Role } from '../../types';
import {
  Shield,
  Briefcase,
  UserCheck,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  Users,
  CheckCircle,
  Play
} from 'lucide-react';

interface HeroSectionProps {
  onOpenLogin?: (role?: Role) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenLogin }) => {
  const { language, loginAsRole, openLoginForRole } = useSchool();

  const handleOpenLogin = (role?: Role) => {
    if (onOpenLogin) {
      onOpenLogin(role);
    } else {
      openLoginForRole(role);
    }
  };

  const quickPortals: {
    role: Role;
    title: string;
    bengaliTitle: string;
    sub: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    borderHover: string;
  }[] = [
    {
      role: 'admin',
      title: 'Administrator',
      bengaliTitle: 'অ্যাডমিন পোর্টাল',
      sub: 'System control & records',
      icon: Shield,
      accentColor: 'from-indigo-600 to-indigo-700 text-white',
      borderHover: 'hover:border-indigo-400',
    },
    {
      role: 'principal',
      title: 'Principal Office',
      bengaliTitle: 'অধ্যক্ষ পোর্টাল',
      sub: 'Executive metrics & notices',
      icon: Briefcase,
      accentColor: 'from-purple-600 to-purple-700 text-white',
      borderHover: 'hover:border-purple-400',
    },
    {
      role: 'teacher',
      title: 'Faculty & Teacher',
      bengaliTitle: 'শিক্ষক পোর্টাল',
      sub: 'Attendance & gradebook',
      icon: UserCheck,
      accentColor: 'from-emerald-600 to-emerald-700 text-white',
      borderHover: 'hover:border-emerald-400',
    },
    {
      role: 'student',
      title: 'Student & Parent',
      bengaliTitle: 'শিক্ষার্থী পোর্টাল',
      sub: 'Report cards & schedule',
      icon: GraduationCap,
      accentColor: 'from-blue-600 to-blue-700 text-white',
      borderHover: 'hover:border-blue-400',
    },
  ];

  return (
    <section id="home" className="relative overflow-hidden bg-radial from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Subtle grid background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Glowing atmospheric orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Headline & Intro */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-400/30 text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {language === 'bn'
                  ? 'ভর্তি কার্যক্রম শুরু ২০২৬-২০২৭ শিক্ষাবর্ষ'
                  : 'Admissions Open for Academic Session 2026-2027'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] font-serif">
              {language === 'bn' ? (
                <>
                  জ্ঞান, নেতৃত্ব ও <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">ভবিষ্যতের শ্রেষ্ঠত্ব</span>
                </>
              ) : (
                <>
                  Nurturing Leaders, Innovators &{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
                    Global Citizens
                  </span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {language === 'bn'
                ? 'এপেক্স ইন্টারন্যাশনাল একাডেমি একটি সমন্বিত শিক্ষা প্রতিষ্ঠান। আধুনিক বিজ্ঞান ল্যাব, রোবোটিক্স স্টুডিও, এবং পূর্ণাঙ্গ ক্লাউড ম্যানেজমেন্ট সিস্টেমের মাধ্যমে শিক্ষার্থীদের ভবিষ্যৎ নেতৃত্ব উপযোগী গড়ে তোলা হয়।'
                : 'Empowering curious minds through world-class STEM education, humanistic values, and a unified digital management system with dedicated portals for Students, Teachers, Principals, and Admins.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#admissions"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 group"
              >
                <span>{language === 'bn' ? 'অনলাইন ভর্তি আবেদন' : 'Apply for Admission'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                type="button"
                onClick={() => handleOpenLogin()}
                className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-all flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-blue-400" />
                <span>{language === 'bn' ? 'স্কুল পোর্টাল লগইন' : 'Open Portal Login'}</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">99.8%</div>
                <div className="text-xs text-slate-400 mt-0.5">Board Exam Distinction</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">1:12</div>
                <div className="text-xs text-slate-400 mt-0.5">Teacher to Student Ratio</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">Automated SMS & Attendance</div>
              </div>
            </div>
          </div>

          {/* Right Column: Instant Portal Gateways */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/80 p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/60">
                <div>
                  <h3 className="font-bold text-white text-base">
                    {language === 'bn' ? 'পৃথক পোর্টাল লগইন গেইটওয়ে' : 'Dedicated Portal Access'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'bn'
                      ? 'প্রতিটি রোলের জন্য আলাদা সিকিউর ড্যাশবোর্ড'
                      : 'Separate secure workspace for each role'}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live System
                </span>
              </div>

              <div className="space-y-3">
                {quickPortals.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.role}
                      onClick={() => loginAsRole(p.role)}
                      className={`p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-between gap-3 group ${p.borderHover}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2.5 rounded-lg bg-gradient-to-br ${p.accentColor}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-100 group-hover:text-blue-400 transition-colors">
                            {language === 'bn' ? p.bengaliTitle : p.title}
                          </h4>
                          <p className="text-xs text-slate-400">{p.sub}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                        <span>Enter</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-400" /> Auto GPA & SMS Gateway
                </span>
                <span className="text-slate-400 font-mono text-[11px]">Instant Demo Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
