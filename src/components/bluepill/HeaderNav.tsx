import React from 'react';
import { LogOut } from 'lucide-react';

export type NavTab = 'dashboard' | 'communities' | 'courses' | 'challenges' | 'events' | 'profile';

interface HeaderNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userEmail?: string | null;
  onLogout?: () => void;
}

export default function HeaderNav({ activeTab, setActiveTab, userEmail, onLogout }: HeaderNavProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#0f131b] border-b border-[#434752] w-full">
      <div className="flex justify-between items-center px-6 md:px-8 h-16 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <span
            onClick={() => setActiveTab('dashboard')}
            className="text-2xl font-bold text-[#dfe2ed] cursor-pointer hover:text-[#aec6ff] transition-colors select-none"
          >
            Project X
          </span>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`text-base transition-colors duration-200 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'text-[#aec6ff] font-bold border-b-2 border-[#aec6ff] pb-1'
                  : 'text-[#c3c6d4] hover:text-[#aec6ff]'
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('communities')}
              className={`text-base transition-colors duration-200 cursor-pointer ${
                activeTab === 'communities'
                  ? 'text-[#aec6ff] font-bold border-b-2 border-[#aec6ff] pb-1'
                  : 'text-[#c3c6d4] hover:text-[#aec6ff]'
              }`}
            >
              Communities
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`text-base transition-colors duration-200 cursor-pointer ${
                activeTab === 'courses'
                  ? 'text-[#aec6ff] font-bold border-b-2 border-[#aec6ff] pb-1'
                  : 'text-[#c3c6d4] hover:text-[#aec6ff]'
              }`}
            >
              Courses
            </button>

            <button
              onClick={() => setActiveTab('challenges')}
              className={`text-base transition-colors duration-200 cursor-pointer ${
                activeTab === 'challenges'
                  ? 'text-[#aec6ff] font-bold border-b-2 border-[#aec6ff] pb-1'
                  : 'text-[#c3c6d4] hover:text-[#aec6ff]'
              }`}
            >
              Challenges
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`text-base transition-colors duration-200 cursor-pointer ${
                activeTab === 'events'
                  ? 'text-[#aec6ff] font-bold border-b-2 border-[#aec6ff] pb-1'
                  : 'text-[#c3c6d4] hover:text-[#aec6ff]'
              }`}
            >
              Events
            </button>
          </nav>
        </div>

        {/* Header Action Items */}
        <div className="flex items-center gap-4">
          {userEmail && (
            <span className="hidden lg:inline-block text-xs font-mono text-[#aec6ff] bg-[#182030] px-2.5 py-1 rounded border border-[#2b3954]">
              {userEmail}
            </span>
          )}

          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8d909d] text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#181c24] border border-[#434752] rounded-lg pl-10 pr-4 py-1.5 text-sm text-[#dfe2ed] focus:outline-none focus:border-[#aec6ff] transition-all w-56 placeholder-[#8d909d]"
            />
          </div>

          <button className="p-2 text-[#c3c6d4] hover:text-[#aec6ff] transition-colors cursor-pointer relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#ffb4ab] rounded-full" />
          </button>

          <button className="p-2 text-[#c3c6d4] hover:text-[#aec6ff] transition-colors cursor-pointer">
            <span className="material-symbols-outlined">settings</span>
          </button>

          {/* User Profile Avatar */}
          <div
            onClick={() => setActiveTab('profile')}
            className="w-8 h-8 rounded-full bg-[#1c2028] overflow-hidden border border-[#434752] cursor-pointer hover:border-[#aec6ff] transition-all"
            title="View Student Profile"
          >
            <img
              className="w-full h-full object-cover"
              alt="Alex Rivera Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBc6mf_cYWQ4fag9mWs39WZKDi73FMgWK8W5icg4bLpW0CtOdnqTeUjDDY9j5MAIm39N--yVS5S-ATTEkc1nGywJDMnHsq45A8e0HJrR1qXoru0Z6W44IbW7rKBSHeHEPpUTnz5y8WcGDdLQLAvP2kvDd2QouLWvnX56na6NjGHV4gfH7IXh1x_mgiQPJua8Vrky2UpoLHHBrZhz31lNwls2H1aLdlUI1sb0s8oaz0w5F62_g3NyXF4rJhHwJRsmquJqlq-IgLMnE"
            />
          </div>

          {/* Log Out / Lock Session */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 text-[#c3c6d4] hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
              title="Lock Session / Log Out to Login Page"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
