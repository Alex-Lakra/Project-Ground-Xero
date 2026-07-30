import React from 'react';
import { LogOut, ShieldCheck, User, UserCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export type NavTab = 'dashboard' | 'communities' | 'courses' | 'challenges' | 'events' | 'profile' | 'admin';

interface HeaderNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export default function HeaderNav({ activeTab, setActiveTab }: HeaderNavProps) {
  const { currentUser, userRole, isAnonymous, logout } = useAuth();

  const displayName = isAnonymous
    ? 'Guest User'
    : currentUser?.displayName || currentUser?.email || 'Authenticated User';

  return (
    <header className="sticky top-0 z-50 bg-[#0f131b] border-b border-[#434752] w-full">
      <div className="flex justify-between items-center px-6 md:px-8 h-16 w-full">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <span
            onClick={() => setActiveTab('dashboard')}
            className="text-2xl font-bold text-[#dfe2ed] cursor-pointer hover:text-[#aec6ff] transition-colors select-none tracking-tight flex items-center gap-2"
          >
            Xero
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

            {userRole === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`text-xs px-2.5 py-1 rounded-lg border font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                    : 'bg-[#181f2c] text-amber-400 border-amber-800/40 hover:bg-amber-950/40'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>ADMIN CONSOLE</span>
              </button>
            )}
          </nav>
        </div>

        {/* Header Action Items */}
        <div className="flex items-center gap-4">
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

          {/* User Email / Display Name badge */}
          <div className={`hidden lg:flex items-center gap-2 border px-2.5 py-1 rounded-lg text-xs font-mono ${
            isAnonymous 
              ? 'bg-amber-950/40 border-amber-800/50 text-amber-300' 
              : 'bg-[#171d28] border-[#2e374d] text-[#a8dadc]'
          }`}>
            {isAnonymous ? (
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <User className="w-3.5 h-3.5 text-[#60a5fa]" />
            )}
            <span className="max-w-[150px] truncate" title={currentUser?.email || 'Anonymous Guest'}>
              {isAnonymous ? 'Guest User' : displayName}
            </span>
          </div>

          {/* User Profile Avatar */}
          <div
            onClick={() => setActiveTab('profile')}
            className="w-8 h-8 rounded-full bg-[#1c2028] overflow-hidden border border-[#434752] cursor-pointer hover:border-[#aec6ff] transition-all flex items-center justify-center"
            title={`View profile for ${displayName}`}
          >
            {currentUser?.photoURL ? (
              <img
                className="w-full h-full object-cover"
                alt="User Profile"
                src={currentUser.photoURL}
              />
            ) : (
              <div className={`w-full h-full text-white flex items-center justify-center font-bold text-xs uppercase ${
                isAnonymous ? 'bg-amber-700' : 'bg-[#2563eb]'
              }`}>
                {isAnonymous ? 'G' : displayName.charAt(0)}
              </div>
            )}
          </div>

          {/* Firebase Sign Out / Logout */}
          <button
            onClick={logout}
            className="p-2 text-[#c3c6d4] hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
            title="Sign Out of Firebase Account"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
