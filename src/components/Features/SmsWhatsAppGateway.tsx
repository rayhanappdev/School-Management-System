import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { BroadcastMessageLog } from '../../types';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Users,
  AlertCircle,
  Clock,
  Sparkles,
  Phone,
  ShieldCheck,
  Check,
  X,
  FileText
} from 'lucide-react';

interface SmsWhatsAppGatewayProps {
  onClose?: () => void;
}

export const SmsWhatsAppGateway: React.FC<SmsWhatsAppGatewayProps> = ({ onClose }) => {
  const {
    currentUser,
    users,
    broadcastLogs,
    sendBroadcastMessage,
    attendance,
  } = useSchool();

  const [channelType, setChannelType] = useState<'sms' | 'whatsapp'>('sms');
  const [recipientCategory, setRecipientCategory] = useState<BroadcastMessageLog['category']>('emergency_circular');
  const [recipientGroup, setRecipientGroup] = useState<string>('All Parents (Grade 6 - Grade 12)');
  const [customMessage, setCustomMessage] = useState<string>(
    'Apex Academy Notice: Dear Guardian, the campus will remain closed on Sunday due to scheduled government holiday. Classes resume Monday on regular timetable.'
  );

  const [isSending, setIsSending] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Template Quick Picker
  const templates: { title: string; category: BroadcastMessageLog['category']; text: string }[] = [
    {
      title: 'Daily Absentee Alert',
      category: 'attendance_alert',
      text: 'Apex Academy Alert: Dear Guardian, your ward was recorded ABSENT today without prior leave notice. Please contact class teacher immediately.',
    },
    {
      title: 'Exam Result Published',
      category: 'exam_result',
      text: 'Apex Academy Exam Cell: Term assessment results are now live on student portal. Log in to check subject grades and download transcript.',
    },
    {
      title: 'Tuition Fee Due Reminder',
      category: 'fee_reminder',
      text: 'Apex Academy Accounts: Monthly tuition fee due date is approaching. Please pay online via bKash/Nagad on the portal to avoid late fine.',
    },
    {
      title: 'School Closed / Emergency Notice',
      category: 'emergency_closure',
      text: 'Apex Academy Notice: Due to heavy inclement weather, tomorrow classes will be held online via Zoom. Join as per regular class routine.',
    },
  ];

  const students = users.filter((u) => u.role === 'student');
  const characterCount = customMessage.length;
  const smsCreditCount = Math.ceil(characterCount / 160) || 1;

  const handleApplyTemplate = (tmpl: typeof templates[0]) => {
    setRecipientCategory(tmpl.category);
    setCustomMessage(tmpl.text);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) return;

    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      const recipientCount =
        recipientGroup.includes('All') ? students.length : Math.max(1, Math.floor(students.length / 3));

      sendBroadcastMessage(channelType, recipientCategory, recipientGroup, recipientCount, customMessage);
      setShowSuccessToast(true);

      setTimeout(() => setShowSuccessToast(false), 4000);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-6xl mx-auto my-4 text-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-inner">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/30">
                Bulk Messaging Telephony
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> High-Priority Carrier Routes
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1">
              SMS & WhatsApp Broadcast Notification System
            </h2>
            <p className="text-xs text-slate-300">
              Instant alerts for student attendance, exam result publications, fee reminders, & emergency circulars.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Broadcast Composer */}
        <div className="lg:col-span-2 space-y-6">
          {showSuccessToast && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs shadow-xs animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Broadcast Dispatched!</strong> Messages sent successfully through carrier SMS gateway to {recipientGroup}.
              </div>
            </div>
          )}

          {/* Channel Selector */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setChannelType('sms')}
              className={`flex-1 p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                channelType === 'sms'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Bulk GSM SMS (Masking: APEX-ACADEMY)</span>
            </button>

            <button
              type="button"
              onClick={() => setChannelType('whatsapp')}
              className={`flex-1 p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                channelType === 'whatsapp'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Official Business Broadcast</span>
            </button>
          </div>

          {/* Quick Template Selector */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block mb-2">
              Quick Preset Templates
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {templates.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-xs space-y-1 transition-all"
                >
                  <strong className="text-slate-900 text-[11px] block">{tmpl.title}</strong>
                  <span className="text-[10px] text-slate-400 capitalize">{tmpl.category.replace('_', ' ')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Broadcast Form */}
          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Recipient Group</label>
                <select
                  value={recipientGroup}
                  onChange={(e) => setRecipientGroup(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="All Parents (Grade 6 - Grade 12)">All Registered Guardians (All Classes)</option>
                  <option value="Grade 10 Guardians Only">Grade 10 Guardians Only</option>
                  <option value="Grade 9 Guardians Only">Grade 9 Guardians Only</option>
                  <option value="Today's Absentee Guardians">Today's Absentee Guardians Only</option>
                  <option value="Fee Defaulter Guardians">Overdue Fee Defaulter Guardians</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Message Category</label>
                <select
                  value={recipientCategory}
                  onChange={(e) => setRecipientCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="emergency_circular">Emergency School Circular</option>
                  <option value="attendance_alert">Daily Attendance Alert</option>
                  <option value="exam_result">Exam Result & GPA Publication</option>
                  <option value="fee_reminder">Fee Collection Reminder</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-xs text-slate-700">Message Content (Unicode Supported)</label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {characterCount} chars • {smsCreditCount} SMS Part(s)
                </span>
              </div>
              <textarea
                rows={4}
                required
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Type SMS or circular announcement here..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all"
            >
              {isSending ? 'Transmitting to Telecom Carriers...' : `Broadcast ${channelType.toUpperCase()} Alert Now`}
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Col: Live Delivery Logs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recent Broadcast Delivery Logs
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
          </div>

          <div className="space-y-3">
            {broadcastLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    {log.type.toUpperCase()} • {log.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400">{log.sentAt}</span>
                </div>

                <p className="text-slate-800 font-medium text-[11px] line-clamp-2">{log.message}</p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200 pt-1.5">
                  <span>To: <strong>{log.recipientGroup}</strong></span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {log.recipientCount} Delivered
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
