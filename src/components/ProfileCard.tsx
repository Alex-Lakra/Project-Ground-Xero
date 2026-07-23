import React, { useState, useEffect } from 'react';
import { SSHUser } from '../services/firebaseDb';
import { X } from 'lucide-react';

interface ProfileCardProps {
  user: SSHUser | null;
  onClose?: () => void;
}

export default function ProfileCard({ user, onClose }: ProfileCardProps) {
  // Live uptime counter for the rich presence activity card
  const [uptimeSeconds, setUptimeSeconds] = useState(15154); // default ~4:12:34

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

  // Profile data values with fallbacks to match provided default HTML
  const displayName = user?.displayName || user?.username || 'Alex_The_Gamer';
  const statusBubble = user?.statusBubble || '> Compiling kernel...';
  const bioLink = user?.bioLink || 'https://github.com/AlexTheCoder/projects';
  const avatarUrl = user?.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6GitQ1FgotQ3ZRvpwtA7OqLnbSM252dmUg6zl6vacllhND-FyKowiKAvD-KfIxqHPTZusmImpUcMM1zyjLPrMIu3X0Sg4K8-YMGLjSFmCf-Ydkd-Ns8lMotlwgkFYjL6eyuVEDUU86zsPW2XaTj2XG2e4kgiqwNLkcoChnDEnvzybiRiCOWTYWaY1LsW7fEv1THKeamH1MreFDxqSojSNVDIsg4I4plkwXMfGVUQ7CaVxaBXanodGmOdz642Fqw48UnHYE84PtV77';
  const techStack = user?.techStack && user.techStack.length > 0 ? user.techStack : ['TS', 'REACT', 'NODE'];
  const pronouns = user?.pronouns || 'he/him';
  const uid = user?.uid || '25UCOMP008';
  const role = user?.username === 'root' ? 'SYSADMIN' : 'OPERATOR';

  return (
    <main className="profile-card relative pb-4 w-full max-w-sm border border-[#ff0000] bg-black text-[#ff0000] font-mono shadow-[0_0_20px_rgba(255,0,0,0.25)] rounded-none overflow-hidden select-text">
      {/* Scanline Overlay */}
      <div className="scanlines pointer-events-none absolute inset-0 z-20"></div>

      {/* Top Bar with Close Button */}
      <div className="flex justify-between items-center bg-[#110000] border-b border-[#ff0000] px-3 py-1.5 z-30 relative">
        <span className="text-[11px] font-bold tracking-widest uppercase terminal-text">
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
        {/* Profile Banner */}
        <div className="banner h-24 bg-gradient-to-b from-[#440000] to-black border-b border-dashed border-[#ff0000] relative"></div>

        {/* Avatar Section */}
        <div className="avatar-wrapper absolute top-10 left-4 z-10">
          <div className="relative">
            <img
              alt={displayName}
              className="avatar w-[72px] h-[72px] object-cover border-2 border-[#ff0000] shadow-[0_0_12px_rgba(255,0,0,0.6)] bg-black"
              src={avatarUrl}
              onError={(e) => {
                // Fallback avatar if user image breaks
                (e.target as HTMLImageElement).src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6GitQ1FgotQ3ZRvpwtA7OqLnbSM252dmUg6zl6vacllhND-FyKowiKAvD-KfIxqHPTZusmImpUcMM1zyjLPrMIu3X0Sg4K8-YMGLjSFmCf-Ydkd-Ns8lMotlwgkFYjL6eyuVEDUU86zsPW2XaTj2XG2e4kgiqwNLkcoChnDEnvzybiRiCOWTYWaY1LsW7fEv1THKeamH1MreFDxqSojSNVDIsg4I4plkwXMfGVUQ7CaVxaBXanodGmOdz642Fqw48UnHYE84PtV77';
              }}
            />
            {/* Status Indicator (Online Red Glow) */}
            <div className="status-indicator absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#ff0000] border-2 border-black rounded-full shadow-[0_0_8px_#ff0000]"></div>
          </div>
        </div>

        {/* Custom Status Bubble */}
        <div className="status-bubble absolute top-12 left-28 right-4 bg-black/90 border border-[#ff0000] p-2 z-10 shadow-[0_0_10px_rgba(255,0,0,0.2)]">
          <span className="text-xs italic terminal-text truncate block">
            {statusBubble.startsWith('>') ? statusBubble : `> ${statusBubble}`}
          </span>
        </div>
      </header>
      {/* END: Banner & Header */}

      {/* BEGIN: Profile Info */}
      <section className="mt-[42px] px-4 relative z-10">
        {/* Name and Pronouns */}
        <h1 className="text-[20px] font-bold leading-tight terminal-text truncate">
          root:~ $ {displayName}
        </h1>
        <div className="flex items-center gap-2 mt-1 mb-3 flex-wrap">
          <span className="terminal-text-dim text-xs font-medium">UID: {uid}</span>
          <span className="terminal-text-dim text-xs font-medium">|</span>
          <span className="terminal-text-dim text-xs font-medium">{pronouns}</span>
          <div className="tag border border-[#ff0000] bg-[#ff0000]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#ff0000] flex items-center gap-1">
            <span>&gt;_</span> {role}
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2 mb-4">
          <div className="w-[22px] h-[22px] bg-black border border-[#ff0000] flex items-center justify-center text-[#ff0000] text-xs font-bold shadow-[0_0_5px_rgba(255,0,0,0.4)]">
            [A]
          </div>
          <div className="w-[22px] h-[22px] bg-black border border-[#ff0000] flex items-center justify-center text-[#ff0000] text-xs font-bold shadow-[0_0_5px_rgba(255,0,0,0.4)]">
            [L]
          </div>
          <div className="w-[22px] h-[22px] bg-black border border-[#ff0000] flex items-center justify-center text-[#ff0000] text-xs font-bold shadow-[0_0_5px_rgba(255,0,0,0.4)]">
            [X]
          </div>
        </div>

        {/* Bio Links */}
        <div className="mb-4 border-b border-dashed border-[#ff0000] pb-3">
          <a
            className="terminal-text hover:bg-[#ff0000] hover:text-black transition-colors text-xs break-all inline-block px-1 py-0.5 border border-transparent hover:border-[#ff0000]"
            href={bioLink.startsWith('http') ? bioLink : `https://${bioLink}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            &gt; {bioLink}
          </a>
        </div>
      </section>
      {/* END: Profile Info */}

      {/* BEGIN: Activity Sections */}
      <section className="px-4 relative z-10 space-y-4">
        {/* Tech Stack Collapsible */}
        <div className="bg-black border border-[#ff0000] p-2.5 flex justify-between items-center hover:bg-[#110000] transition-colors">
          <span className="text-xs font-bold terminal-text">[SYSTEM]: TECH_STACK</span>
          {/* Tech Icons */}
          <div className="flex gap-1.5 flex-wrap justify-end">
            {techStack.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 bg-black border border-[#ff0000] text-[#ff0000] text-[10px] font-bold uppercase"
              >
                {item}
              </span>
            ))}
            {techStack.length > 3 && (
              <span className="px-1.5 py-0.5 bg-black border border-[#ff0000] text-[#ff0000] text-[10px] font-bold">
                +{techStack.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Rich Presence Activity (Developing) */}
        <div className="activity-card bg-black border border-dashed border-[#ff0000] p-3 relative">
          <div className="flex justify-between items-center mb-2.5 border-b border-[#880000] pb-1">
            <span className="text-[11px] font-bold uppercase terminal-text">PROCESS: DEVELOPING</span>
            <span className="text-[10px] terminal-text-dim">PID: 8492</span>
          </div>
          <div className="flex gap-3 items-center">
            {/* Large Image & Small Image */}
            <div className="relative flex-shrink-0">
              <div className="w-[52px] h-[52px] bg-black border border-[#ff0000] flex items-center justify-center text-[#ff0000] font-bold text-xs text-center p-1 overflow-hidden">
                <span>VS_CODE</span>
              </div>
              {/* Small Icon Overlay */}
              <div className="absolute -bottom-1 -right-1 w-[22px] h-[22px] bg-black border border-[#ff0000] flex items-center justify-center text-[9px] font-bold text-[#ff0000]">
                {techStack[0] || 'TS'}
              </div>
            </div>
            {/* Activity Details */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold terminal-text truncate leading-tight">
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
