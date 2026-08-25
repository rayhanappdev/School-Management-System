import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { AdminPortal } from './AdminPortal';
import { PrincipalPortal } from './PrincipalPortal';
import { TeacherPortal } from './TeacherPortal';
import { StudentPortal } from './StudentPortal';
import {
  ShieldAlert,
  ArrowLeft,
  UserCheck,
  School,
  Lock,
  LogOut,
  Sparkles
} from 'lucide-react';

interface PortalDashboardProps {
  onBackToWebsite: () => void;
}

export const PortalDashboard: React.FC<PortalDashboardProps> = ({ onBackToWebsite }) => {
  const { currentUser, logout, setLoginModalOpen, openLoginForRole } = useSchool();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-900 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-900/20">
            <School className="w-8 h-8 text-blue-300" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 font-serif">Unified School Portal</h2>
            <p className="text-xs text-slate-500 mt-1">
              Please sign in with your role credentials to access your management dashboard.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-bold">
            <button
              onClick={() => openLoginForRole('admin')}
              className="p-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl border border-indigo-200 transition-all text-left"
            >
              <span className="block text-[10px] text-indigo-600 uppercase">System</span>
              Admin Desk
            </button>

            <button
              onClick={() => openLoginForRole('principal')}
              className="p-3.5 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-xl border border-purple-200 transition-all text-left"
            >
              <span className="block text-[10px] text-purple-600 uppercase">Executive</span>
              Principal Desk
            </button>

            <button
              onClick={() => openLoginForRole('teacher')}
              className="p-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl border border-emerald-200 transition-all text-left"
            >
              <span className="block text-[10px] text-emerald-600 uppercase">Faculty</span>
              Teacher Portal
            </button>

            <button
              onClick={() => openLoginForRole('student')}
              className="p-3.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl border border-blue-200 transition-all text-left"
            >
              <span className="block text-[10px] text-blue-600 uppercase">Learner</span>
              Student Portal
            </button>
          </div>

          <button
            onClick={onBackToWebsite}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Public School Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col">
      {/* Portal Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Website
            </button>

            <div className="h-5 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center">
                <School className="w-4 h-4 text-blue-300" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-slate-900 text-xs block font-serif">Apex International Academy</span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">
                  {currentUser.role.toUpperCase()} PORTAL
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Active User Chip */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border"
              />
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 font-semibold capitalize">{currentUser.role}</p>
              </div>
            </div>

            {/* Role switchers for easy testing */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => openLoginForRole('admin')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  currentUser.role === 'admin' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => openLoginForRole('principal')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  currentUser.role === 'principal' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Principal
              </button>
              <button
                onClick={() => openLoginForRole('teacher')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  currentUser.role === 'teacher' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Teacher
              </button>
              <button
                onClick={() => openLoginForRole('student')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  currentUser.role === 'student' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Portal Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {currentUser.role === 'admin' && <AdminPortal />}
        {currentUser.role === 'principal' && <PrincipalPortal />}
        {currentUser.role === 'teacher' && <TeacherPortal />}
        {currentUser.role === 'student' && <StudentPortal />}
      </main>
    </div>
  );
};
