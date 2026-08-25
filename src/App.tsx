import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/PublicWebsite/HeroSection';
import { AboutSection } from './components/PublicWebsite/AboutSection';
import { AcademicsSection } from './components/PublicWebsite/AcademicsSection';
import { AdmissionsSection } from './components/PublicWebsite/AdmissionsSection';
import { NoticesEventsSection } from './components/PublicWebsite/NoticesEventsSection';
import { FacultySection } from './components/PublicWebsite/FacultySection';
import { GalleryContactSection } from './components/PublicWebsite/GalleryContactSection';
import { Footer } from './components/PublicWebsite/Footer';
import { PortalDashboard } from './components/Portals/PortalDashboard';
import { LoginModal } from './components/Auth/LoginModal';

const MainApp: React.FC = () => {
  const { currentView, setCurrentView } = useSchool();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {currentView === 'website' ? (
        <>
          <Navbar onNavigateToPortal={() => setCurrentView('portal')} />
          <main className="flex-1">
            <HeroSection />
            <AboutSection />
            <AcademicsSection />
            <AdmissionsSection />
            <NoticesEventsSection />
            <FacultySection />
            <GalleryContactSection />
          </main>
          <Footer />
        </>
      ) : (
        <PortalDashboard onBackToWebsite={() => setCurrentView('website')} />
      )}

      {/* Global Role-Based Login Modal */}
      <LoginModal />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainApp />
    </SchoolProvider>
  );
}
