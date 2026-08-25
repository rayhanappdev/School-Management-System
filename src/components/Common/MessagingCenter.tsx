import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { MessageNotification, Role } from '../../types';
import {
  Send,
  Bell,
  MessageSquare,
  Sparkles,
  Users,
  AlertTriangle,
  FileCheck,
  CheckCircle,
  Clock,
  Radio,
  Filter
} from 'lucide-react';

export const MessagingCenter: React.FC = () => {
  const { notifications, currentUser, sendMessage, markNotificationAsRead, markAllNotificationsAsRead, users } =
    useSchool();

  const [recipientType, setRecipientType] = useState<MessageNotification['recipientType']>('all');
  const [recipientTarget, setRecipientTarget] = useState<string>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<MessageNotification['category']>('general');
  const [priority, setPriority] = useState<MessageNotification['priority']>('normal');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [successNotice, setSuccessNotice] = useState(false);

  const canBroadcast = currentUser?.role === 'admin' || currentUser?.role === 'principal' || currentUser?.role === 'teacher';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    let targetName = undefined;
    if (recipientType === 'individual' && recipientTarget) {
      const u = users.find((x) => x.id === recipientTarget);
      targetName = u?.name;
    }

    sendMessage({
      senderId: currentUser?.id || 'usr_admin',
      senderName: currentUser?.name || 'School Authority',
      senderRole: currentUser?.role || 'admin',
      recipientType,
      recipientTarget: recipientTarget || undefined,
      recipientName: targetName,
      title,
      content,
      category,
      priority,
      isAutomated: false,
    });

    setTitle('');
    setContent('');
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 4000);
  };

  // Filter messages for current user perspective
  const visibleMessages = notifications.filter((m) => {
    if (filterCategory !== 'all' && m.category !== filterCategory) return false;
    if (!currentUser) return true;
    if (currentUser.role === 'admin' || currentUser.role === 'principal') return true;
    if (m.recipientType === 'all') return true;
    if (m.recipientType === 'students' && currentUser.role === 'student') return true;
    if (m.recipientType === 'teachers' && currentUser.role === 'teacher') return true;
    if (m.recipientType === 'grade' && currentUser.grade && m.recipientTarget === currentUser.grade) return true;
    if (m.recipientType === 'individual' && m.recipientTarget === currentUser.id) return true;
    if (m.senderId === currentUser.id) return true;
    return false;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Real-Time Automated Messaging Gateway</span>
          </div>
          <h2 className="text-2xl font-bold font-serif">Instant Broadcasts & Notification Logs</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Automated SMS & in-app alerts dispatched for attendance marks, published grade transcripts, tuition reminders, and principal notices.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllNotificationsAsRead}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shrink-0"
        >
          Mark All As Read
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Compose Broadcast (For Admin/Principal/Teacher) */}
        {canBroadcast && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                <span>Compose Broadcast Notice / Alert</span>
              </h3>
            </div>

            {successNotice && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Message dispatched successfully to targeted recipients!</span>
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Audience Target *
                  </label>
                  <select
                    value={recipientType}
                    onChange={(e) => setRecipientType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Entire Institution (All)</option>
                    <option value="students">All Enrolled Students</option>
                    <option value="teachers">All Faculty Members</option>
                    <option value="grade">Specific Class / Grade</option>
                    <option value="individual">Individual User</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General Circular</option>
                    <option value="emergency_circular">Emergency / Important</option>
                    <option value="attendance_alert">Attendance Notice</option>
                    <option value="grade_published">Grading / Exam Report</option>
                    <option value="fee_reminder">Tuition Fee Notice</option>
                    <option value="assignment">Assignment / Coursework</option>
                  </select>
                </div>
              </div>

              {recipientType === 'grade' && (
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Select Target Grade
                  </label>
                  <select
                    value={recipientTarget}
                    onChange={(e) => setRecipientTarget(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="">Choose Class</option>
                    <option value="Grade 10-A">Grade 10-A</option>
                    <option value="Grade 10-B">Grade 10-B</option>
                    <option value="Grade 9-A">Grade 9-A</option>
                    <option value="Grade 8-A">Grade 8-A</option>
                  </select>
                </div>
              )}

              {recipientType === 'individual' && (
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Select Recipient Student / Staff
                  </label>
                  <select
                    value={recipientTarget}
                    onChange={(e) => setRecipientTarget(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="">Select User</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role.toUpperCase()} - {u.grade || u.designation || u.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Message Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandatory Lab Session or Exam Schedule"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Notice Content / Message Body *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type official notification message here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={priority === 'urgent'}
                    onChange={(e) => setPriority(e.target.checked ? 'urgent' : 'normal')}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span className="font-semibold text-rose-700">Mark as High Priority / Urgent</span>
                </label>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Broadcast Now
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Right / Full Width: Real-time Message Stream */}
        <div className={`${canBroadcast ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filter Feed:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['all', 'attendance_alert', 'grade_published', 'emergency_circular', 'fee_reminder', 'assignment'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                      filterCategory === cat
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.replace(/_/g, ' ')}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Feed List */}
          <div className="space-y-3">
            {visibleMessages.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
                No notifications found in this category.
              </div>
            ) : (
              visibleMessages.map((msg) => {
                return (
                  <div
                    key={msg.id}
                    onClick={() => markNotificationAsRead(msg.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      msg.priority === 'urgent'
                        ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
                        : msg.isAutomated
                        ? 'bg-blue-50/40 border-blue-200/80 hover:border-blue-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            msg.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-800'
                              : msg.isAutomated
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {msg.isAutomated ? '🤖 Automated System' : msg.category.replace(/_/g, ' ')}
                        </span>
                        {msg.priority === 'urgent' && (
                          <span className="text-[10px] font-extrabold text-rose-600 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> URGENT
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">Target: {msg.recipientType.toUpperCase()} {msg.recipientTarget ? `(${msg.recipientTarget})` : ''}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{msg.createdAt}</span>
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base mb-1">{msg.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{msg.content}</p>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-medium text-slate-600">
                        Sender: <strong className="text-slate-800">{msg.senderName}</strong> ({msg.senderRole.toUpperCase()})
                      </span>
                      {!msg.read && <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">New</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
