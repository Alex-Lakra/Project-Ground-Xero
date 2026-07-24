import React, { useState } from 'react';
import HeaderNav, { NavTab } from './HeaderNav';
import DashboardView from './DashboardView';
import CoursesView from './CoursesView';
import ChallengesView from './ChallengesView';
import CommunitiesView from './CommunitiesView';
import EventsView from './EventsView';
import ProfileView from './ProfileView';

interface EnterpriseDashboardProps {
  userEmail?: string | null;
  onLogout?: () => void;
}

export default function EnterpriseDashboard({ userEmail, onLogout }: EnterpriseDashboardProps = {}) {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  return (
    <div className="min-h-screen bg-[#0f131b] text-[#dfe2ed] font-sans antialiased flex flex-col justify-between">
      <div>
        {/* Top Header Navigation */}
        <HeaderNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          userEmail={userEmail}
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
              Project X
            </span>
            <span className="text-xs text-[#c3c6d4]">© 2026 Project X. All rights reserved.</span>
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
