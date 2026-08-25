import React from 'react';
import { FeeInvoice } from '../../types';
import { School, Printer, X, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  invoice: FeeInvoice | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 print:m-0 print:shadow-none print:border-none">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <span className="font-bold text-sm">Official Electronic Payment Receipt</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print Receipt
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 sm:p-10 bg-white text-slate-900">
          <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center">
                <School className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <h2 className="font-bold text-base font-serif uppercase">Apex International Academy</h2>
                <p className="text-[10px] text-slate-500">Accounts & Student Billing Division</p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase">
                {invoice.status}
              </span>
              <p className="text-[11px] font-mono text-slate-500 mt-1">{invoice.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200">
            <div>
              <p className="text-slate-500 uppercase text-[10px] font-semibold">Billed To:</p>
              <p className="font-bold text-slate-900 text-sm">{invoice.studentName}</p>
              <p className="text-slate-600">Roll: {invoice.rollNo} | {invoice.grade}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 uppercase text-[10px] font-semibold">Payment Details:</p>
              <p className="font-bold text-slate-900">{invoice.paymentMethod || 'Online Gateway'}</p>
              <p className="text-slate-600 font-mono text-[11px]">{invoice.transactionId || 'TXN-PENDING'}</p>
              <p className="text-slate-500 text-[10px]">Date: {invoice.paidDate || new Date().toISOString().split('T')[0]}</p>
            </div>
          </div>

          {/* Fee Itemization Table */}
          <div className="my-4">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 uppercase text-[10px] text-slate-700 font-bold border-b border-slate-300">
                  <th className="p-2">Description</th>
                  <th className="p-2 text-right">Period</th>
                  <th className="p-2 text-right">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2 font-medium">Standard Tuition & Laboratory Facility Fee</td>
                  <td className="p-2 text-right text-slate-600">{invoice.month}</td>
                  <td className="p-2 text-right font-mono font-bold">{invoice.amount.toLocaleString()} ৳</td>
                </tr>
                <tr>
                  <td className="p-2 text-slate-500">Digital Portal & Cloud LMS Maintenance</td>
                  <td className="p-2 text-right text-slate-500">Included</td>
                  <td className="p-2 text-right font-mono text-slate-500">0 ৳</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-900 font-bold bg-slate-50 text-sm">
                  <td className="p-2 uppercase">Total Amount Paid</td>
                  <td className="p-2 text-right text-xs text-emerald-700">PAID IN FULL</td>
                  <td className="p-2 text-right font-mono text-blue-900 font-extrabold">
                    {invoice.amount.toLocaleString()} BDT
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Digital transaction verified by Apex Accounts Clearance Gateway.</span>
          </div>

          <div className="pt-8 mt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
            <div>
              <p className="font-bold text-slate-700 text-[11px]">Accounts Officer Signature</p>
              <div className="h-6 border-b border-slate-300 w-32 mt-1" />
            </div>
            <div className="text-right">
              <ShieldCheck className="w-6 h-6 text-blue-800 ml-auto mb-0.5" />
              <p className="text-[10px]">Verified Electronic Receipt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
