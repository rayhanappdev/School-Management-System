import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Role } from '../types';
import { translations } from '../utils/translations';
import {
  School,
  Shield,
  Briefcase,
  UserCheck,
  GraduationCap,
  Bell,
  Globe,
  LogIn,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Sparkles,
  Phone,
  Mail,
  RotateCcw,
  Check,
  CheckCheck
} from 'lucide-react';

interface NavbarProps {
  onOpenLogin?: (role?: Role) => void;
  onNavigateToPortal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, onNavigateToPortal }) => {
  const {
    currentUser,
    currentRole,
    language,
    setLanguage,
    logout,
    activeView,
    setActiveView,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    loginAsRole,
    openLoginForRole,
    resetAllData,
  } = useSchool();

  const handleOpenLogin = (role?: Role) => {
    if (onOpenLogin) {
      onOpenLogin(role);
    } else {
      openLoginForRole(role);
    }
  };

  const t = translations[language];
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.read);

  const roleMeta: Record<
    Role,
    { label: string; bengaliLabel: string; icon: React.ComponentType<{ className?: string }>; color: string }
  > = {
    admin: { label: 'Administrator', bengaliLabel: 'অ্যাডমিন', icon: Shield, color: 'bg-indigo-600' },
    principal: { label: 'Principal', bengaliLabel: 'অধ্যক্ষ', icon: Briefcase, color: 'bg-purple-600' },
    teacher: { label: 'Teacher', bengaliLabel: 'শিক্ষক', icon: UserCheck, color: 'bg-emerald-600' },
    student: { label: 'Student', bengaliLabel: 'শিক্ষার্থী', icon: GraduationCap, color: 'bg-blue-600' },
  };

  const navLinks = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.academics, href: '#academics' },
    { label: t.nav.admissions, href: '#admissions' },
    { label: t.nav.notices, href: '#notices' },
    { label: t.nav.events, href: '#events' },
    { label: t.nav.faculty, href: '#faculty' },
    { label: t.nav.contact, href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Institutional Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Contact and accreditation */}
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-blue-400" /> +880 2-9884501
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-blue-400" /> admissions@apexacademy.edu
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-amber-300 font-medium">
              ★ Cambridge & National Curriculum Accredited
            </span>
          </div>

          {/* Quick Demo Switcher & Language Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 transition-colors"
                title="Quickly test any role's separate portal"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{language === 'bn' ? 'পোর্টাল ডেমো সুইচ' : 'Role Demo Switcher'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showRoleSwitcher && (
                <div className="absolute right-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-2 z-50 text-xs">
                  <div className="px-2 py-1 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    {language === 'bn' ? 'সরাসরি পোর্টাল প্রবেশ করুন:' : 'Direct Login As:'}
                  </div>
                  {(['admin', 'principal', 'teacher', 'student'] as Role[]).map((r) => {
                    const meta = roleMeta[r];
                    const Icon = meta.icon;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          loginAsRole(r);
                          setShowRoleSwitcher(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 transition-colors ${
                          currentUser?.role === r ? 'bg-slate-800/80 text-blue-400 font-semibold' : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded ${meta.color} text-white`}>
                            <Icon className="w-3 h-3" />
                          </div>
                          <span>{language === 'bn' ? meta.bengaliLabel : meta.label}</span>
                        </div>
                        {currentUser?.role === r && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </button>
                    );
                  })}
                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        resetAllData();
                        setShowRoleSwitcher(false);
                      }}
                      className="w-full flex items-center gap-1.5 p-1.5 text-[11px] text-rose-400 hover:bg-rose-950/30 rounded"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Demo Data
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition-colors"
            >
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={() => setActiveView('website')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform">
            <School className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 font-serif">
                Apex International
              </span>
              <span className="hidden sm:inline px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 rounded">
                Academy
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
              {language === 'bn' ? t.schoolTagline : 'School & Management Portal System'}
            </p>
          </div>
        </div>

        {/* Public Website Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setActiveView('website')}
              className="hover:text-blue-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Section: View Switcher, Notifications & Auth Card */}
        <div className="flex items-center gap-3">
          {/* Notifications Flyout */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-bold text-slate-900">
                      {language === 'bn' ? 'নোটিফিকেশন ও বার্তা' : 'Broadcasts & Alerts'}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded-full">
                      {unreadNotifications.length} new
                    </span>
                  </div>
                  {unreadNotifications.length > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 mt-2 space-y-1">
                  {notifications.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markNotificationAsRead(item.id)}
                      className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                        item.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 leading-snug">{item.title}</span>
                        {!item.read && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{item.content}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                        <span className="font-medium text-slate-500">{item.senderName}</span>
                        <span>{item.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Toggle between Website and Management Portal */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveView(activeView === 'portal' ? 'website' : 'portal')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                  activeView === 'portal'
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{activeView === 'portal' ? 'View Public Site' : 'My Management Portal'}</span>
              </button>

              {/* User Avatar Badge & Logout */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-300"
                />
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </p>
                  <span
                    className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded text-white ${
                      roleMeta[currentUser.role]?.color || 'bg-slate-700'
                    }`}
                  >
                    {roleMeta[currentUser.role]?.label || currentUser.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleOpenLogin()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 flex items-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>{language === 'bn' ? 'পোর্টাল লগইন' : 'Portal Login'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
