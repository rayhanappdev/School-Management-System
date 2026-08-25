import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { School, Shield, Phone, Mail, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language } = useSchool();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: School Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
                <School className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white text-base font-serif">Apex International Academy</span>
                <p className="text-[11px] text-blue-400 font-medium">Cambridge & National Curriculum</p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Fostering academic excellence, moral leadership, and scientific research through modern digital management and world-class faculty.
            </p>

            <div className="pt-2 text-[11px] text-slate-500">
              Approved by Ministry of Education & Affiliated with Cambridge Assessment International Education (CAIE).
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Institutional Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-white transition-colors">About & History</a></li>
              <li><a href="#academics" className="hover:text-white transition-colors">Curriculum & Wings</a></li>
              <li><a href="#admissions" className="hover:text-white transition-colors">Admissions 2026</a></li>
              <li><a href="#notices" className="hover:text-white transition-colors">Notice Board & Circulars</a></li>
              <li><a href="#faculty" className="hover:text-white transition-colors">Faculty Directory</a></li>
            </ul>
          </div>

          {/* Col 4: SMS Portals */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Management Portals</h4>
            <ul className="space-y-2">
              <li><span className="text-indigo-400">Admin Control Center</span></li>
              <li><span className="text-purple-400">Principal Executive Desk</span></li>
              <li><span className="text-emerald-400">Teacher & Gradebook Portal</span></li>
              <li><span className="text-blue-400">Student & Guardian Portal</span></li>
              <li><span className="text-slate-400">Automated SMS Gateway</span></li>
            </ul>
          </div>

          {/* Col 5: Security & Support */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Security & Systems</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Enforced</li>
              <li>Automated Attendance Alerts</li>
              <li>Official Certified Transcripts</li>
              <li>Online Invoicing & Receipts</li>
              <li>Version 2.6 Enterprise</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Apex International Academy. All rights reserved. Foolcodertechnologies</p>
        </div>
      </div>
    </footer>
  );
};
