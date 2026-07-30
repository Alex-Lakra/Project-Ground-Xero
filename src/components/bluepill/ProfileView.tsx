import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LinkedAccountsSection from './LinkedAccountsSection';

export default function ProfileView() {
  const { currentUser, userRole, isAnonymous } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState(
    'Enterprise Developer | Building scalable applications with modern cloud infrastructure and unified 1 User = 1 Firebase Account architecture.'
  );

  const displayName = isAnonymous
    ? 'Guest User'
    : currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Enterprise User';
  const email = isAnonymous
    ? 'Anonymous Session (Unlinked)'
    : currentUser?.email || 'unspecified@enterprise.io';
  const emailVerified = currentUser?.emailVerified;

  const linkedProviders = (currentUser?.providerData || []).map(p => p.providerId);

  return (
    <div className="py-8 px-6 md:px-8 max-w-[1200px] mx-auto text-[#dfe2ed] space-y-10">
      {/* User Header Section */}
      <section className="flex flex-col md:flex-row items-start gap-8">
        <div className="relative group">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-2 border-[#31353d] bg-[#1c2028] shadow-xl flex items-center justify-center">
            {currentUser?.photoURL ? (
              <img
                className="w-full h-full object-cover"
                alt="User Avatar"
                src={currentUser.photoURL}
              />
            ) : (
              <div className={`w-full h-full text-white flex items-center justify-center font-bold text-4xl uppercase ${
                isAnonymous ? 'bg-amber-700' : 'bg-[#2563eb]'
              }`}>
                {isAnonymous ? 'G' : displayName.charAt(0)}
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#85da76] p-1.5 rounded-lg border-4 border-[#0f131b] shadow-lg flex items-center justify-center" title="Firebase Authenticated Account">
            <span className="material-symbols-outlined text-[#003a02] text-[20px]">verified</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#dfe2ed]">{displayName}</h1>
              <p className="text-sm font-mono text-[#aec6ff]">
                {isAnonymous ? 'guest_session' : `@${email.split('@')[0]}`}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mt-4 font-mono text-xs">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#8d909d]">Account Role</span>
                  <span className="text-[#dfe2ed] uppercase font-bold text-blue-400">{userRole}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#8d909d]">Email Status</span>
                  <span className={emailVerified ? 'text-emerald-400 font-bold' : isAnonymous ? 'text-amber-400 font-bold' : 'text-amber-400 font-bold'}>
                    {isAnonymous ? 'Anonymous Session' : emailVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#8d909d]">Firebase UID</span>
                  <span className="text-[#85da76] font-bold truncate max-w-[120px]" title={currentUser?.uid || ''}>
                    {currentUser?.uid || 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-[#8d909d]">Linked Providers</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {linkedProviders.length > 0 ? (
                      linkedProviders.map(p => (
                        <span key={p} className="text-[10px] bg-[#1e2738] border border-[#3b4c6e] px-1.5 py-0.2 rounded text-[#a8dadc]">
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-amber-300">Anonymous</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2 border border-[#31353d] rounded-xl text-xs font-bold text-[#dfe2ed] hover:bg-[#262a32] hover:border-[#8d909d] transition-all cursor-pointer whitespace-nowrap self-start"
            >
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <textarea
              value={bioText}
              onChange={e => setBioText(e.target.value)}
              className="w-full bg-[#181c24] border border-[#434752] rounded-lg p-2.5 text-xs text-[#dfe2ed] focus:outline-none"
            />
          ) : (
            <p className="text-sm text-[#c3c6d4] max-w-2xl leading-relaxed">{bioText}</p>
          )}
        </div>
      </section>

      {/* Linked Accounts Section */}
      <LinkedAccountsSection />

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#181c24] border border-[#31353d] p-6 rounded-xl space-y-2">
          <p className="text-xs text-[#c3c6d4] font-mono">Total XP</p>
          <h3 className="text-2xl font-bold text-[#aec6ff]">12.4k</h3>
          <div className="mt-2 h-1.5 w-full bg-[#31353d] rounded-full overflow-hidden">
            <div className="h-full bg-[#aec6ff] w-[75%]" />
          </div>
        </div>

        <div className="bg-[#181c24] border border-[#31353d] p-6 rounded-xl space-y-2">
          <p className="text-xs text-[#c3c6d4] font-mono">Challenges Solved</p>
          <h3 className="text-2xl font-bold text-[#85da76]">342</h3>
          <p className="text-xs text-[#85da76] flex items-center gap-1 font-mono">
            <span className="material-symbols-outlined text-[14px]">trending_up</span> Top 5% this month
          </p>
        </div>

        <div className="bg-[#181c24] border border-[#31353d] p-6 rounded-xl space-y-2">
          <p className="text-xs text-[#c3c6d4] font-mono">7-Day Streak</p>
          <h3 className="text-2xl font-bold text-[#ffb86a]">Active</h3>
          <div className="flex gap-1 mt-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="w-full h-1.5 bg-[#ffb86a] rounded-full" />
            ))}
          </div>
        </div>

        <div className="bg-[#181c24] border border-[#31353d] p-6 rounded-xl space-y-2">
          <p className="text-xs text-[#c3c6d4] font-mono">Rank</p>
          <h3 className="text-2xl font-bold text-[#dfe2ed]">#1,204</h3>
          <p className="text-xs text-[#8d909d] font-mono">out of 45k+ members</p>
        </div>
      </section>
    </div>
  );
}
