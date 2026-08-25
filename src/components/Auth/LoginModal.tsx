import React, { useState } from 'react';
import { Role, User } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { translations } from '../../utils/translations';
import {
  Shield,
  GraduationCap,
  Briefcase,
  UserCheck,
  Lock,
  Mail,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  School,
  X
} from 'lucide-react';

interface LoginModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultRole?: Role;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  defaultRole,
}) => {
  const {
    users,
    login,
    language,
    isLoginModalOpen,
    closeLoginModal,
    loginModalRole,
  } = useSchool();
  const t = translations[language];

  const effectiveIsOpen = propIsOpen !== undefined ? propIsOpen : isLoginModalOpen;
  const effectiveOnClose = propOnClose || closeLoginModal;
  const initialRole = defaultRole || loginModalRole || 'student';

  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState('');

  // Synchronize role when opened for a specific role
  React.useEffect(() => {
    if (loginModalRole) {
      setSelectedRole(loginModalRole);
      const matched = users.find((u) => u.role === loginModalRole);
      if (matched) {
        setEmail(matched.email);
      }
    }
  }, [loginModalRole, users]);

  if (!effectiveIsOpen) return null;

  const rolePortals: {
    role: Role;
    title: string;
    bengaliTitle: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    bgColor: string;
    borderColor: string;
    demoUser: User | undefined;
  }[] = [
    {
      role: 'admin',
      title: 'Administrator Portal',
      bengaliTitle: 'অ্যাডমিন পোর্টাল',
      desc: 'Institutional controls, staff directories, fee logs & system automations.',
      icon: Shield,
      accentColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50/70 hover:bg-indigo-50',
      borderColor: 'border-indigo-200',
      demoUser: users.find((u) => u.role === 'admin'),
    },
    {
      role: 'principal',
      title: 'Principal Executive Portal',
      bengaliTitle: 'অধ্যক্ষ / প্রিন্সিপাল পোর্টাল',
      desc: 'Institutional analytics, teacher performance reviews, circular broadcasts & grade audits.',
      icon: Briefcase,
      accentColor: 'text-purple-600',
      bgColor: 'bg-purple-50/70 hover:bg-purple-50',
      borderColor: 'border-purple-200',
      demoUser: users.find((u) => u.role === 'principal'),
    },
    {
      role: 'teacher',
      title: 'Teacher & Faculty Portal',
      bengaliTitle: 'শিক্ষক ও ফ্যাকাল্টি পোর্টাল',
      desc: 'Class attendance register, interactive gradebook, GPA calculation & lesson dispatch.',
      icon: UserCheck,
      accentColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/70 hover:bg-emerald-50',
      borderColor: 'border-emerald-200',
      demoUser: users.find((u) => u.role === 'teacher'),
    },
    {
      role: 'student',
      title: 'Student & Parent Portal',
      bengaliTitle: 'শিক্ষার্থী ও অভিভাবক পোর্টাল',
      desc: 'Printable certified report cards, attendance timeline, fee payment & homework.',
      icon: GraduationCap,
      accentColor: 'text-blue-600',
      bgColor: 'bg-blue-50/70 hover:bg-blue-50',
      borderColor: 'border-blue-200',
      demoUser: users.find((u) => u.role === 'student'),
    },
  ];

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setError('');
    const matched = users.find((u) => u.role === role);
    if (matched) {
      setEmail(matched.email);
    }
  };

  const handleQuickLogin = (targetUser: User) => {
    login(targetUser);
    effectiveOnClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (foundUser) {
      login(foundUser);
      effectiveOnClose();
    } else {
      // If student not found by email, try matching by rollNo or name
      const studentMatch = users.find(
        (u) => u.rollNo?.toLowerCase() === cleanEmail || u.name.toLowerCase().includes(cleanEmail)
      );
      if (studentMatch) {
        login(studentMatch);
        effectiveOnClose();
      } else {
        setError('No user account found with this email/ID. Please use one of the Demo Accounts below.');
      }
    }
  };

  const currentPortalMeta = rolePortals.find((p) => p.role === selectedRole)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={effectiveOnClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Role Selector Tabs */}
          <div className="md:col-span-5 bg-slate-900 text-white p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                  <School className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-snug">Apex Academy</h3>
                  <p className="text-xs text-slate-400">Integrated School Management</p>
                </div>
              </div>

              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Select Your Dedicated Portal:
              </p>

              <div className="space-y-2.5">
                {rolePortals.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedRole === item.role;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => handleRoleSelect(item.role)}
                      className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 flex items-start gap-3 border ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg mt-0.5 ${
                          isSelected ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold truncate">{item.title}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.bengaliTitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Encrypted
              </span>
              <span className="text-[11px] text-slate-400 font-mono">v2.6 Enterprise</span>
            </div>
          </div>

          {/* Right Column: Portal Login Form & Quick Preset */}
          <div className="md:col-span-7 p-6 md:p-8 bg-white flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  {language === 'bn' ? currentPortalMeta.bengaliTitle : currentPortalMeta.title}
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {language === 'bn' ? 'সুরক্ষিত লগইন' : 'Authorized Portal Access'}
                </h2>
                <p className="text-sm text-slate-600 mt-1">{currentPortalMeta.desc}</p>
              </div>

              {/* Quick One-Click Preset Button */}
              {currentPortalMeta.demoUser && (
                <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      One-Click Demo Account:
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Pre-authenticated
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={currentPortalMeta.demoUser.avatar}
                        alt={currentPortalMeta.demoUser.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{currentPortalMeta.demoUser.name}</p>
                        <p className="text-xs text-slate-500 truncate">{currentPortalMeta.demoUser.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin(currentPortalMeta.demoUser!)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 shrink-0"
                    >
                      Instant Enter <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Standard Credentials Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Institutional Email / Student ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={currentPortalMeta.demoUser?.email || 'name@apexacademy.edu'}
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Security Password / PIN
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
                    Remember this workstation
                  </label>
                  <button type="button" className="text-blue-600 hover:underline">
                    Reset Portal Key?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Lock className="w-4 h-4" />
                  {language === 'bn' ? `${currentPortalMeta.bengaliTitle}-এ প্রবেশ করুন` : `Sign In to ${currentPortalMeta.title}`}
                </button>
              </form>
            </div>

            <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-100 pt-4">
              Need admission first?{' '}
              <button
                onClick={effectiveOnClose}
                className="text-blue-600 font-semibold hover:underline"
              >
                Apply Online on Public Website
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
