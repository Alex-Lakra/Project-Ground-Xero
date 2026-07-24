import React, { useState } from 'react';
import HeaderNav, { NavTab } from './HeaderNav';
import DashboardView from './DashboardView';
import CoursesView from './CoursesView';
import ChallengesView from './ChallengesView';
import CommunitiesView from './CommunitiesView';
import EventsView from './EventsView';
import ProfileView from './ProfileView';
import AdminConsoleView from './AdminConsoleView';

interface EnterpriseDashboardProps {
  userEmail?: string | null;
  userRole?: 'student' | 'admin';
  onLogout?: () => void;
}

export default function EnterpriseDashboard({ userEmail, userRole, onLogout }: EnterpriseDashboardProps = {}) {
  const [activeTab, setActiveTab] = useState<NavTab>(userRole === 'admin' ? 'admin' : 'dashboard');

  return (
    <div className="min-h-screen bg-[#0f131b] text-[#dfe2ed] font-sans antialiased flex flex-col justify-between">
      <div>
        {/* Top Header Navigation */}
        <HeaderNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          userEmail={userEmail}
          userRole={userRole}
          onLogout={onLogout}
        />

        {/* Tab View Router */}
        <main className="w-full">
          {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
          {activeTab === 'communities' && <CommunitiesView />}
          {activeTab === 'courses' && <CoursesView />}
          {activeTab === 'challenges' && <ChallengesView />}
          {activeTab === 'events' && <EventsView />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'admin' && <AdminConsoleView />}
        </main>
      </div>

      {/* Shared Footer */}
      <footer className="w-full border-t border-[#434752] bg-[#0f131b] mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center py-8 px-6 md:px-8 max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
            <span
              onClick={() => setActiveTab('dashboard')}
              className="text-sm font-bold text-[#dfe2ed] cursor-pointer hover:text-[#aec6ff]"
            >
              Xero
            </span>
            <span className="text-xs text-[#c3c6d4]">© 2026 Xero. All rights reserved.</span>
          </div>
          <div className="flex gap-6 items-center text-xs text-[#c3c6d4]">
            <a className="hover:text-[#dfe2ed] transition-colors" href="#">Terms</a>
            <a className="hover:text-[#dfe2ed] transition-colors" href="#">Privacy</a>
            <a className="hover:text-[#dfe2ed] transition-colors" href="#">Support</a>
            <a className="hover:text-[#dfe2ed] transition-colors" href="#">API</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
