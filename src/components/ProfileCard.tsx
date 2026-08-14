import React, { useState, useEffect } from 'react';
import { SSHUser, DEFAULT_GHOST_AVATAR, formatImageUrl } from '../services/firebaseDb';
import { X } from 'lucide-react';

interface ProfileCardProps {
  user: SSHUser | null;
  onClose?: () => void;
}

export default function ProfileCard({ user, onClose }: ProfileCardProps) {
  // Live uptime counter for the rich presence activity card
  const [uptimeSeconds, setUptimeSeconds] = useState(15154); // default ~4:12:34
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Profile data values loaded directly from active authenticated user account
  const displayName = user?.displayName || user?.username || 'ANONYMOUS_OPERATOR';
  const statusBubble = user?.statusBubble || '';
  const bioLink = user?.bioLink || '';
  const avatarUrl = formatImageUrl(user?.avatarUrl);
  const techStack = user?.techStack || [];
  const pronouns = user?.pronouns || 'he/him';
  const uid = user?.uid || (user?.username ? `UID_${user.username.toUpperCase()}` : '25UCOMP008');
  const role = user?.username === 'root' ? 'SYSADMIN' : 'OPERATOR';

  return (
    <main className="profile-card animate-cyber-card-enter relative pb-4 w-full max-w-sm border border-[#ff0000] bg-black text-[#ff0000] font-mono shadow-[0_0_20px_rgba(255,0,0,0.25)] rounded-none overflow-hidden select-text transition-all hover:shadow-[0_0_30px_rgba(255,0,0,0.45)]">
      {/* Scanline Overlay */}
      <div className="scanlines pointer-events-none absolute inset-0 z-20"></div>

      {/* Top Bar with Close Button */}
      <div className="flex justify-between items-center bg-[#110000] border-b border-[#ff0000] px-3 py-1.5 z-30 relative">
        <span className="text-[11px] font-bold tracking-widest uppercase terminal-text flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#ff0000] rounded-full animate-ping inline-block"></span>
          [MAINFRAME_OPERATOR_CARD]
        </span>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close Profile Card"
            className="text-[#ff0000] hover:bg-[#ff0000] hover:text-black p-0.5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* BEGIN: Banner & Header */}
      <header className="relative">
        {/* Profile Banner with Laser Scanner Beam */}
        <div className="banner h-24 bg-gradient-to-b from-[#440000] to-black border-b border-dashed border-[#ff0000] relative overflow-hidden">
          <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff0000] to-transparent shadow-[0_0_8px_#ff0000] animate-laser-scan pointer-events-none" />
        </div>

        {/* Avatar Section with Hover Hologram Effect & Status Beacon */}
        <div className="avatar-wrapper absolute top-10 left-4 z-10 group cursor-pointer">
          <div className="relative">
            <img
              alt={displayName}
              className="avatar w-[72px] h-[72px] object-cover border-2 border-[#ff0000] shadow-[0_0_12px_rgba(255,0,0,0.6)] bg-black transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_22px_rgba(255,0,0,0.9)] group-hover:border-white"
              src={avatarUrl || DEFAULT_GHOST_AVATAR}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== DEFAULT_GHOST_AVATAR) {
                  target.src = DEFAULT_GHOST_AVATAR;
                }
              }}
            />
            {/* Status Indicator (Online Red Glow & Radar Wave) */}
            <div className="relative">
              <div className="status-indicator absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#ff0000] border-2 border-black rounded-full shadow-[0_0_8px_#ff0000] animate-status-beacon z-10"></div>
              <div className="absolute -bottom-1.5 -right-1.5 w-4.5 h-4.5 bg-[#ff0000] rounded-full border border-[#ff0000] animate-radar-pulse pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Custom Status Bubble / Floating Add About */}
        {statusBubble && statusBubble.trim().length > 0 ? (
          <div className="status-bubble absolute top-12 left-28 right-4 bg-black/90 border border-[#ff0000] p-2 z-10 shadow-[0_0_10px_rgba(255,0,0,0.2)] animate-float-slow hover:border-white hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all">
            <span className="text-xs italic terminal-text truncate block">
              {statusBubble.startsWith('>') ? statusBubble : `> ${statusBubble}`}
            </span>
          </div>
        ) : (
          <div 
            className="status-bubble absolute top-12 left-28 right-4 bg-[#1a0000]/95 border border-dashed border-[#ff0000] p-2 z-10 shadow-[0_0_12px_rgba(255,0,0,0.4)] animate-float-slow cursor-pointer group hover:bg-[#ff0000]/20 hover:border-solid hover:border-white transition-all"
            title="Run command 'about <text>' in terminal to set your bio"
          >
            <span className="text-xs font-bold text-[#ff0000] flex items-center justify-between terminal-text">
              <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                <span className="text-sm font-bold leading-none animate-pulse">+</span> ADD ABOUT
              </span>
              <span className="text-[9px] font-mono text-[#ffaaaa] font-normal italic group-hover:underline">
                (about &lt;text&gt;)
              </span>
            </span>
          </div>
        )}
      </header>
      {/* END: Banner & Header */}

      {/* BEGIN: Profile Info */}
      <section className="mt-[42px] px-4 relative z-10">
        {/* Name and Pronouns */}
        <h1 className="text-[20px] font-bold leading-tight terminal-text truncate hover:text-white transition-colors">
          {user?.username || 'root'}:~ $ {displayName}
        </h1>
        {user?.email && (
          <div className="text-[12px] text-[#ffaaaa] font-mono mb-1 truncate">
            &lt;{user.email}&gt;
          </div>
        )}
        <div className="flex items-center gap-2 mt-1 mb-3 flex-wrap">
          <span className="terminal-text-dim text-xs font-medium">UID: {uid}</span>
          <span className="terminal-text-dim text-xs font-medium">|</span>
          <span className="terminal-text-dim text-xs font-medium">{pronouns}</span>
          <div className="tag border border-[#ff0000] bg-[#ff0000]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#ff0000] flex items-center gap-1 hover:bg-[#ff0000] hover:text-black transition-colors cursor-default">
            <span>&gt;_</span> {role}
          </div>
        </div>

        {/* Badges with Micro-Hover Animations */}
        <div className="flex gap-2 mb-4">
          <div 
            title="ACCESS LEVEL: ADMIN AUTHORIZED"
            className="w-[22px] h-[22px] bg-black border border-[#ff0000] flex items-center justify-center text-[#ff0000] text-xs font-bold shadow-[0_0_5px_rgba(255,0,0,0.4)] transition-all duration-200 hover:scale-110 hover:bg-[#ff0000] hover:text-black hover:rotate-6 cursor-pointer"
          >
            [A]
          </div>
          <div 
            title="LINK STATUS: ENCRYPTED ACTIVE"
            className="w-[22px] h-[22px] bg-black border border-[#ff0000] flex items-center justify-center text-[#ff0000] text-xs font-bold shadow-[0_0_5px_rgba(255,0,0,0.4)] transition-all duration-200 hover:scale-110 hover:bg-[#ff0000] hover:text-black hover:-rotate-6 cursor-pointer"
          >
            [L]
          </div>
          <div 
            title="SECURITY CLEARANCE: LEVEL X"
            className="w-[22px] h-[22px] bg-black border border-[#ff0000] flex items-center justify-center text-[#ff0000] text-xs font-bold shadow-[0_0_5px_rgba(255,0,0,0.4)] transition-all duration-200 hover:scale-110 hover:bg-[#ff0000] hover:text-black hover:rotate-6 cursor-pointer"
          >
            [X]
          </div>
        </div>

        {/* Bio Links */}
        <div className="mb-4 border-b border-dashed border-[#ff0000] pb-3">
          {bioLink ? (
            <a
              className="terminal-text hover:bg-[#ff0000] hover:text-black transition-colors text-xs break-all inline-block px-1 py-0.5 border border-transparent hover:border-[#ff0000]"
              href={bioLink.startsWith('http') ? bioLink : `https://${bioLink}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              &gt; {bioLink}
            </a>
          ) : (
            <span className="terminal-text-dim text-xs italic">
              &gt; No repository link set (use 'repo &lt;url&gt;')
            </span>
          )}
        </div>
      </section>
      {/* END: Profile Info */}

      {/* BEGIN: Activity Sections */}
      <section className="px-4 relative z-10 space-y-4">
        {/* Tech Stack / Skills Section with Micro-Animations */}
        {techStack.length === 0 ? (
          <div className="bg-black border border-dashed border-[#660000] p-2.5 flex justify-between items-center transition-all hover:border-[#ff0000]">
            <span className="text-xs font-bold terminal-text-dim">[SYSTEM]: TECH_STACK</span>
            <span className="text-[10px] text-[#ff6666] italic font-mono">[EMPTY - NO SKILLS ADDED]</span>
          </div>
        ) : (
          <div className="bg-black border border-[#ff0000] p-2.5 transition-all hover:shadow-[0_0_12px_rgba(255,0,0,0.3)]">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold terminal-text">
                [SYSTEM]: TECH_STACK {techStack.length > 3 && `(${techStack.length})`}
              </span>

              <div className="flex gap-1.5 flex-wrap justify-end items-center">
                {!isSkillsExpanded && techStack.length > 3 ? (
                  <>
                    {techStack.slice(0, 3).map((item, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 bg-black border border-[#ff0000] text-[#ff0000] text-[10px] font-bold uppercase transition-all duration-200 hover:scale-110 hover:bg-[#ff0000] hover:text-black hover:shadow-[0_0_8px_#ff0000] cursor-default select-none"
                      >
                        {item}
                      </span>
                    ))}
                    <button
                      onClick={() => setIsSkillsExpanded(true)}
                      title="Click to expand all skills"
                      className="px-1.5 py-0.5 bg-[#ff0000] text-black border border-[#ff0000] text-[10px] font-bold hover:bg-[#ff4444] hover:scale-110 transition-all cursor-pointer animate-pulse shadow-[0_0_8px_#ff0000]"
                    >
                      +{techStack.length - 3}
                    </button>
                  </>
                ) : (
                  <>
                    {techStack.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 bg-black border border-[#ff0000] text-[#ff0000] text-[10px] font-bold uppercase transition-all duration-200 hover:scale-110 hover:bg-[#ff0000] hover:text-black hover:shadow-[0_0_8px_#ff0000] cursor-default select-none"
                      >
                        {item}
                      </span>
                    ))}
                    {techStack.length > 3 && isSkillsExpanded && (
                      <button
                        onClick={() => setIsSkillsExpanded(false)}
                        title="Click to collapse skills"
                        className="px-1.5 py-0.5 bg-black border border-[#ff0000] text-[#ff0000] text-[10px] font-bold hover:bg-[#ff0000] hover:text-black transition-colors cursor-pointer ml-1"
                      >
                        [LESS]
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Rich Presence Activity (Developing) */}
        <div className="activity-card bg-black border border-dashed border-[#ff0000] p-3 relative group hover:border-solid hover:shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all">
          <div className="flex justify-between items-center mb-2.5 border-b border-[#880000] pb-1">
            <span className="text-[11px] font-bold uppercase terminal-text flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff0000] animate-ping inline-block"></span>
              PROCESS: DEVELOPING
            </span>
            <span className="text-[10px] terminal-text-dim">PID: 8492</span>
          </div>
          <div className="flex gap-3 items-center">
            {/* Large Image & Small Image */}
            <div className="relative flex-shrink-0">
              <div className="w-[52px] h-[52px] bg-black border border-[#ff0000] flex items-center justify-center text-[#ff0000] font-bold text-xs text-center p-1 overflow-hidden group-hover:border-white transition-colors">
                <span>VS_CODE</span>
              </div>
              {/* Small Icon Overlay */}
              <div className="absolute -bottom-1 -right-1 w-[22px] h-[22px] bg-black border border-[#ff0000] flex items-center justify-center text-[9px] font-bold text-[#ff0000]">
                {techStack[0] || 'DEV'}
              </div>
            </div>
            {/* Activity Details */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold terminal-text truncate leading-tight group-hover:text-white transition-colors">
                Visual Studio Code
              </h4>
              <div className="terminal-text-dim text-[11px] truncate leading-tight mt-1">
                &gt; Editing: NeuralNetworkCore.ts
              </div>
              <div className="terminal-text-dim text-[11px] truncate leading-tight mt-[2px]">
                &gt; Workspace: PROJECT-GROUND-XERO
              </div>
              <div className="flex items-center gap-1 text-[#ff0000] text-[11px] font-medium mt-1">
                <span className="animate-pulse">_</span>
                <span>UPTIME: {formatUptime(uptimeSeconds)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: Activity */}
    </main>
  );
}
