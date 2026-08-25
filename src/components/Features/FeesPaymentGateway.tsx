import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { FeeInvoice } from '../../types';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Search,
  Plus,
  Send,
  ShieldCheck,
  Building2,
  Calendar,
  DollarSign,
  Receipt,
  Sparkles,
  ArrowRight,
  X,
  Clock,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FeesPaymentGatewayProps {
  onClose?: () => void;
  defaultStudentId?: string;
}

export const FeesPaymentGateway: React.FC<FeesPaymentGatewayProps> = ({ onClose, defaultStudentId }) => {
  const {
    currentUser,
    users,
    invoices,
    payInvoice,
    generateInvoice,
    sendMessage,
    sendBroadcastMessage,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'pay' | 'invoices' | 'defaulters' | 'create_bill'>('pay');
  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoice | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Card'>('bKash');
  
  // Payment Flow States
  const [paymentStep, setPaymentStep] = useState<'select' | 'details' | 'otp' | 'success'>('select');
  const [accountNumber, setAccountNumber] = useState('');
  const [pinOrOtp, setPinOrOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<{ id: string; amount: number; method: string; date: string } | null>(null);

  // Filter/Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // New Invoice Form
  const [newBillData, setNewBillData] = useState({
    studentId: users.find(u => u.role === 'student')?.id || '',
    month: 'September 2026',
    amount: 12500,
    dueDate: '2026-09-28',
    tuitionFee: 8000,
    examFee: 2500,
    labFee: 1500,
    libraryFee: 500,
  });

  const students = users.filter((u) => u.role === 'student');

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesStudent =
      currentUser?.role === 'student'
        ? inv.studentId === currentUser.id || inv.rollNo === currentUser.rollNo
        : defaultStudentId
        ? inv.studentId === defaultStudentId
        : true;

    const matchesSearch =
      inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = selectedGrade === 'all' || inv.grade.includes(selectedGrade);
    const matchesMonth = selectedMonth === 'all' || inv.month.toLowerCase().includes(selectedMonth.toLowerCase());

    return matchesStudent && matchesSearch && matchesGrade && matchesMonth;
  });

  const unpaidInvoices = filteredInvoices.filter((i) => i.status !== 'paid');
  const paidInvoices = filteredInvoices.filter((i) => i.status === 'paid');
  const defaulterInvoices = invoices.filter((i) => i.status === 'overdue' || (i.status === 'unpaid' && new Date(i.dueDate) < new Date()));

  const totalDueAmount = unpaidInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalCollected = paidInvoices.reduce((sum, i) => sum + i.amount, 0);

  const handleStartPayment = (invoice: FeeInvoice) => {
    setSelectedInvoice(invoice);
    setPaymentStep('details');
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep('otp');
    }, 1200);
  };

  const handleVerifyAndConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      payInvoice(selectedInvoice.id, selectedMethod);
      const txnId = `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;
      setCompletedTxn({
        id: txnId,
        amount: selectedInvoice.amount,
        method: selectedMethod,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      });
      setPaymentStep('success');

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore if not loaded
      }
    }, 1500);
  };

  const handleSendDueReminder = (invoice: FeeInvoice) => {
    const student = users.find(u => u.id === invoice.studentId);
    sendMessage({
      senderId: 'sys_accounts',
      senderName: 'Apex Accounts Department',
      senderRole: 'admin',
      recipientType: 'individual',
      recipientTarget: invoice.studentId,
      recipientName: invoice.studentName,
      title: `⚠️ Urgent Fee Payment Reminder: ${invoice.month}`,
      content: `Dear Guardian of ${invoice.studentName} (Roll: ${invoice.rollNo}), your fee of ${invoice.amount} BDT for ${invoice.month} is due on ${invoice.dueDate}. Please clear online to prevent late fine.`,
      category: 'fee_reminder',
      priority: 'urgent',
      isAutomated: true,
    });

    sendBroadcastMessage(
      'sms',
      'fee_reminder',
      `${invoice.studentName} Guardian (${student?.guardianPhone || '+880 1811-000000'})`,
      1,
      `Apex Academy: Fee reminder for ${invoice.studentName}. Total Due: ${invoice.amount} BDT. Pay online via bKash/Nagad at apex-portal.`
    );

    alert(`Automated SMS & Portal notification sent to guardian of ${invoice.studentName}!`);
  };

  const handleSendAllDefaulterReminders = () => {
    defaulterInvoices.forEach((inv) => {
      const student = users.find(u => u.id === inv.studentId);
      sendMessage({
        senderId: 'sys_accounts',
        senderName: 'Apex Accounts Department',
        senderRole: 'admin',
        recipientType: 'individual',
        recipientTarget: inv.studentId,
        recipientName: inv.studentName,
        title: `⚠️ Fee Reminder: Overdue Bill for ${inv.month}`,
        content: `Outstanding balance of ${inv.amount} BDT for ${inv.studentName} (${inv.rollNo}). Please pay via student portal.`,
        category: 'fee_reminder',
        priority: 'urgent',
        isAutomated: true,
      });
    });

    sendBroadcastMessage(
      'sms',
      'fee_reminder',
      `All Overdue Fee Guardians (${defaulterInvoices.length} Students)`,
      defaulterInvoices.length,
      `Apex Academy Notice: Please clear overdue institutional fees for ${defaulterInvoices.length} accounts to keep enrollment in good standing.`
    );

    alert(`Broadcast SMS reminders successfully sent to all ${defaulterInvoices.length} overdue accounts!`);
  };

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    const student = users.find((u) => u.id === newBillData.studentId);
    if (!student) return;

    generateInvoice({
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo || '2026-1001',
      grade: student.grade || 'Grade 10-A',
      month: newBillData.month,
      amount: Number(newBillData.amount),
      dueDate: newBillData.dueDate,
      status: 'unpaid',
    });

    alert(`New fee invoice generated successfully for ${student.name}!`);
    setActiveTab('invoices');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-6xl mx-auto my-4 text-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-inner">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-md border border-blue-400/30">
                Direct Gateway v2.4
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1">
              Online Fees Collection & Payment Gateway
            </h2>
            <p className="text-xs text-slate-300">
              Instant tuition fee payment via bKash, Nagad, Rocket, & Cards with verifiable digital money receipts.
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

      {/* Tabs */}
      <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 bg-slate-50/70 overflow-x-auto">
        <button
          onClick={() => { setActiveTab('pay'); setPaymentStep('select'); }}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'pay'
              ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4 text-blue-600" />
          <span>Pay Online (bKash/Nagad/Cards)</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'invoices'
              ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4 text-indigo-600" />
          <span>All Invoices & Receipts ({invoices.length})</span>
        </button>

        {currentUser?.role !== 'student' && (
          <>
            <button
              onClick={() => setActiveTab('defaulters')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'defaulters'
                  ? 'border-red-600 text-red-700 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>Due Reminders & Defaulters ({defaulterInvoices.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('create_bill')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'create_bill'
                  ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Generate Fee Bill</span>
            </button>
          </>
        )}
      </div>

      {/* Main Content Body */}
      <div className="p-6 sm:p-8">
        {/* TAB 1: PAY ONLINE GATEWAY */}
        {activeTab === 'pay' && (
          <div className="space-y-6">
            {paymentStep === 'select' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Unpaid Invoices */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-serif">Select Pending Invoice to Pay</h3>
                      <p className="text-xs text-slate-500">Choose any monthly fee or exam fee invoice to checkout</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
                      Total Due: <strong>{totalDueAmount.toLocaleString()} BDT</strong>
                    </span>
                  </div>

                  {unpaidInvoices.length === 0 ? (
                    <div className="p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-emerald-900">All Fees Cleared!</h4>
                      <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                        There are no outstanding tuition or exam invoices due for this account.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {unpaidInvoices.map((inv) => (
                        <div
                          key={inv.id}
                          className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                {inv.id}
                              </span>
                              <span className="text-xs font-bold text-slate-900">{inv.month} Fee</span>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                inv.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {inv.status}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600">
                              Student: <strong>{inv.studentName}</strong> ({inv.rollNo}) • {inv.grade}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Due Date: {inv.dueDate}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center">
                            <div className="text-right">
                              <div className="text-base font-black text-slate-900">{inv.amount.toLocaleString()} BDT</div>
                              <span className="text-[10px] text-slate-400">Inclusive of VAT</span>
                            </div>

                            <button
                              onClick={() => handleStartPayment(inv)}
                              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all"
                            >
                              <span>Pay Now</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Col: Supported Gateways Info */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Official Payment Partners</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl text-center">
                      <span className="font-bold text-pink-700 text-xs block">bKash Merchant</span>
                      <span className="text-[10px] text-pink-600">01700-000000</span>
                    </div>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-center">
                      <span className="font-bold text-orange-700 text-xs block">Nagad Direct</span>
                      <span className="text-[10px] text-orange-600">01900-000000</span>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-center">
                      <span className="font-bold text-purple-700 text-xs block">DBBL Rocket</span>
                      <span className="text-[10px] text-purple-600">01800-000000-8</span>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                      <span className="font-bold text-blue-700 text-xs block">Visa / Master</span>
                      <span className="text-[10px] text-blue-600">Debit & Credit</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Instant Processing
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Receipts with verifiable QR codes are generated immediately and stored on the student portal.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ENTER PAYMENT DETAILS */}
            {paymentStep === 'details' && selectedInvoice && (
              <div className="max-w-xl mx-auto bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-serif">Checkout Payment Gateway</h3>
                    <p className="text-xs text-slate-500">Invoice: {selectedInvoice.id} ({selectedInvoice.month})</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-blue-700">{selectedInvoice.amount.toLocaleString()} BDT</div>
                    <span className="text-[10px] text-slate-400">Total Payable</span>
                  </div>
                </div>

                {/* Gateway Method Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Select Payment Method</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['bKash', 'Nagad', 'Rocket', 'Card'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setSelectedMethod(method)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                          selectedMethod === method
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleProcessPayment} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {selectedMethod === 'Card' ? 'Card Number (16 Digits)' : `${selectedMethod} Mobile Account Number`}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={selectedMethod === 'Card' ? '4111 2222 3333 4444' : '017XXXXXXXX'}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setPaymentStep('select')}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md"
                    >
                      {isProcessing ? 'Connecting Gateway...' : `Proceed with ${selectedMethod}`}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: ENTER OTP / PIN */}
            {paymentStep === 'otp' && selectedInvoice && (
              <div className="max-w-md mx-auto bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 mx-auto flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif">Enter Verification PIN / OTP</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    A test security verification code was requested for <strong>{accountNumber || '017XXXXXXXX'}</strong>
                  </p>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800">
                  Total Charge: <strong>{selectedInvoice.amount} BDT</strong> • Gateway: <strong>{selectedMethod}</strong>
                </div>

                <form onSubmit={handleVerifyAndConfirm} className="space-y-4 text-left">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {selectedMethod === 'Card' ? 'CVV / 3D Secure OTP' : 'Account PIN (Any 4-5 digits for test)'}
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      required
                      placeholder="••••"
                      value={pinOrOtp}
                      onChange={(e) => setPinOrOtp(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-center text-lg font-mono tracking-widest focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
                  >
                    {isProcessing ? 'Authorizing Transaction...' : 'Confirm & Complete Payment'}
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* STEP 4: PAYMENT SUCCESS RECEIPT */}
            {paymentStep === 'success' && completedTxn && selectedInvoice && (
              <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-lg space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif">Payment Completed Successfully!</h3>
                  <p className="text-xs text-slate-500">
                    Official Money Receipt has been authenticated and deposited to school ledger.
                  </p>
                </div>

                {/* Printable Digital Receipt Card */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-900" />
                      <div>
                        <h4 className="font-serif font-bold text-xs text-slate-900">Apex International Academy</h4>
                        <span className="text-[10px] text-slate-400">Institutional Accounts Department</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-full">
                      PAID / CONFIRMED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Transaction ID</span>
                      <strong className="font-mono text-blue-700">{completedTxn.id}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Payment Method</span>
                      <strong className="text-slate-900">{completedTxn.method}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Paid Date</span>
                      <strong className="text-slate-900">{completedTxn.date}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Amount Paid</span>
                      <strong className="text-emerald-700 font-bold">{completedTxn.amount.toLocaleString()} BDT</strong>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-3 text-xs text-slate-600">
                    Student: <strong>{selectedInvoice.studentName}</strong> (Roll: {selectedInvoice.rollNo}) • {selectedInvoice.grade}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Receipt</span>
                  </button>

                  <button
                    onClick={() => {
                      setPaymentStep('select');
                      setSelectedInvoice(null);
                    }}
                    className="px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold"
                  >
                    Done / Return
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL INVOICES & VERIFIABLE RECEIPTS */}
        {activeTab === 'invoices' && (
          <div className="space-y-4">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search invoice number, student name, roll..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  <option value="all">All Classes</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 8">Grade 8</option>
                </select>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Invoice ID</th>
                    <th className="p-3.5">Student Details</th>
                    <th className="p-3.5">Billing Month</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Due Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-blue-700">{inv.id}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block">{inv.studentName}</span>
                        <span className="text-[11px] text-slate-400">Roll: {inv.rollNo} • {inv.grade}</span>
                      </td>
                      <td className="p-3.5 font-medium">{inv.month}</td>
                      <td className="p-3.5 font-bold text-slate-900">{inv.amount.toLocaleString()} BDT</td>
                      <td className="p-3.5 text-slate-500">{inv.dueDate}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          inv.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {inv.status === 'paid' ? (
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setCompletedTxn({
                                id: inv.transactionId || 'TXN-PAID-001',
                                amount: inv.amount,
                                method: inv.paymentMethod || 'Online Gateway',
                                date: inv.paidDate || '2026-08-25',
                              });
                              setPaymentStep('success');
                              setActiveTab('pay');
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] inline-flex items-center gap-1"
                          >
                            <Receipt className="w-3 h-3" /> View Receipt
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setPaymentStep('details');
                              setActiveTab('pay');
                            }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] inline-flex items-center gap-1"
                          >
                            <CreditCard className="w-3 h-3" /> Pay Online
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DEFAULTER & DUE REMINDERS */}
        {activeTab === 'defaulters' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-red-50 rounded-2xl border border-red-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-900">Outstanding Overdue Accounts ({defaulterInvoices.length})</h4>
                  <p className="text-xs text-red-700">
                    Send single or bulk SMS reminder alerts directly to registered guardian mobile phones.
                  </p>
                </div>
              </div>

              <button
                onClick={handleSendAllDefaulterReminders}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast SMS to All Defaulters</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {defaulterInvoices.map((inv) => (
                <div key={inv.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{inv.studentName}</span>
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        Overdue: {inv.amount} BDT
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block">Roll: {inv.rollNo} • {inv.grade} • Due: {inv.dueDate}</span>
                  </div>

                  <button
                    onClick={() => handleSendDueReminder(inv)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" /> Send SMS
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GENERATE BILL */}
        {activeTab === 'create_bill' && (
          <div className="max-w-xl mx-auto bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">Create Individual Student Fee Invoice</h3>
              <p className="text-xs text-slate-500">Add an institutional billing record with customized line items</p>
            </div>

            <form onSubmit={handleCreateBill} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Student</label>
                <select
                  value={newBillData.studentId}
                  onChange={(e) => setNewBillData({ ...newBillData, studentId: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNo} - {s.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Billing Month / Title</label>
                  <input
                    type="text"
                    value={newBillData.month}
                    onChange={(e) => setNewBillData({ ...newBillData, month: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Total Payable (BDT)</label>
                  <input
                    type="number"
                    value={newBillData.amount}
                    onChange={(e) => setNewBillData({ ...newBillData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment Due Date</label>
                <input
                  type="date"
                  value={newBillData.dueDate}
                  onChange={(e) => setNewBillData({ ...newBillData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Generate Official Invoice
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
