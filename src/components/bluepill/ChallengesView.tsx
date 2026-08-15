import React, { useState, useEffect } from 'react';
import { scrapeUpcomingContests, Contest } from '../../../Scrapper';

export default function ChallengesView() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showTakeModal, setShowTakeModal] = useState(false);
  const [selectedChallengeTitle, setSelectedChallengeTitle] = useState('System Design: Scalable Architecture');
  const [selectedChallengeXp, setSelectedChallengeXp] = useState('+1000 XP');
  const [selectedChallengeLink, setSelectedChallengeLink] = useState<string | null>(null);

  // Live Contests State (LeetCode & Codeforces)
  const [contests, setContests] = useState<Contest[]>([]);
  const [loadingContests, setLoadingContests] = useState(true);

  // Fetch live LeetCode & Codeforces contest data on mount
  useEffect(() => {
    let isMounted = true;

    async function loadContestsData() {
      try {
        setLoadingContests(true);
        // Attempt fetching via /api/contests server route, fallback to direct scraper
        const res = await fetch('/api/contests');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.contests) && isMounted) {
            setContests(json.contests);
            setLoadingContests(false);
            return;
          }
        }
      } catch (err) {
        console.warn('API contest fetch warning, calling fallback scraper:', err);
      }

      try {
        const liveData = await scrapeUpcomingContests();
        if (isMounted) {
          setContests(liveData);
        }
      } catch (err) {
        console.warn('Direct contest scraper error:', err);
      } finally {
        if (isMounted) setLoadingContests(false);
      }
    }

    loadContestsData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenChallengeModal = (title: string, xp: string, link?: string) => {
    setSelectedChallengeTitle(title);
    setSelectedChallengeXp(xp);
    setSelectedChallengeLink(link || null);
    setShowTakeModal(true);
  };

  // Filter contests or challenges based on selected category tab
  const displayContests = contests.slice(0, 4);

  return (
    <div className="py-8 px-6 md:px-8 max-w-[1200px] mx-auto text-[#dfe2ed]">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Progress & Prizes */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          {/* Progress Card */}
          <section className="bg-[#181c24] border border-[#434752] rounded-xl p-6">
            <h2 className="text-xl font-bold text-[#dfe2ed] mb-6 text-center">Progress</h2>

            <div className="flex flex-col items-center mb-6">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#31353d" strokeWidth="6" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#85da76" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset="212" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ffb86a" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset="240" strokeLinecap="round" className="rotate-45 origin-center" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ffb4ab" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset="250" strokeLinecap="round" className="rotate-90 origin-center" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold text-[#dfe2ed] leading-none">76</span>
                  <div className="w-12 h-px bg-[#434752] my-1" />
                  <span className="text-xs text-[#8d909d] font-mono">1121</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#85da76]" />
                <span className="text-[#c3c6d4]">Easy <span className="text-[#dfe2ed]">58/374</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffb86a]" />
                <span className="text-[#c3c6d4]">Medium <span className="text-[#dfe2ed]">17/477</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab]" />
                <span className="text-[#c3c6d4]">Hard <span className="text-[#dfe2ed]">1/253</span></span>
              </div>
            </div>
          </section>

          {/* Recently Unlocked Badges */}
          <section className="bg-[#181c24] border border-[#434752] rounded-xl p-6 space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-widest text-[#8d909d]">Recently Unlocked</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square bg-[#31353d] rounded border border-[#434752] flex items-center justify-center group cursor-pointer" title="Algorithm Ace">
                <span className="material-symbols-outlined text-[#aec6ff] group-hover:scale-110 transition-transform">terminal</span>
              </div>
              <div className="aspect-square bg-[#31353d] rounded border border-[#434752] flex items-center justify-center group cursor-pointer" title="Clean Coder">
                <span className="material-symbols-outlined text-[#85da76] group-hover:scale-110 transition-transform">cleaning_services</span>
              </div>
              <div className="aspect-square bg-[#31353d] rounded border border-[#434752] flex items-center justify-center group cursor-pointer" title="Bug Hunter">
                <span className="material-symbols-outlined text-[#ffb4ab] group-hover:scale-110 transition-transform">pest_control</span>
              </div>
            </div>
          </section>

          {/* Prize Pool Card */}
          <section className="bg-[#181c24] border border-[#434752] rounded-xl p-6 space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-widest text-[#8d909d] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffb86a] text-[20px]">card_giftcard</span>
              Prize Pool
            </h3>
            <div className="space-y-3">
              <div className="bg-[#262a32] p-3 rounded-lg border border-[#434752] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#dfe2ed]">
                  <span className="material-symbols-outlined text-[#85da76] text-[18px]">workspace_premium</span>
                  Project X Pro
                </div>
                <p className="text-[11px] text-[#8d909d]">Top 10 finishers get 3 months of premium subscription access.</p>
              </div>
              <div className="bg-[#262a32] p-3 rounded-lg border border-[#434752] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#dfe2ed]">
                  <span className="material-symbols-outlined text-[#aec6ff] text-[18px]">token</span>
                  1,000 $X-Tokens
                </div>
                <p className="text-[11px] text-[#8d909d]">Redeemable for exclusive community perks and merch.</p>
              </div>
            </div>
            <button className="w-full py-2.5 bg-[#31353d] text-[#dfe2ed] border border-[#434752] rounded-lg text-xs font-bold hover:bg-[#353942] transition-all cursor-pointer">
              View All Rewards
            </button>
          </section>
        </aside>

        {/* Center Column: Challenges List & Live Contests */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            {['All', 'Contests', 'Algorithms', 'Frontend', 'Backend'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  activeCategory === cat
                    ? 'bg-[#628fea] text-white border-[#628fea]'
                    : 'bg-[#181c24] border-[#434752] text-[#c3c6d4] hover:border-[#aec6ff]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Live & Upcoming Contests (LeetCode & Codeforces) */}
          {(activeCategory === 'All' || activeCategory === 'Contests') && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase font-mono tracking-widest text-[#8d909d] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#85da76] animate-pulse" />
                  Live & Upcoming Contests
                </h3>
                <span className="text-[11px] font-mono text-[#aec6ff]">LeetCode • Codeforces</span>
              </div>

              {loadingContests ? (
                <div className="bg-[#181c24] border border-[#434752] rounded-xl p-6 text-center text-xs text-[#8d909d]">
                  Loading live contest feeds...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayContests.map(c => (
                    <div
                      key={c.id}
                      className="bg-[#181c24] border border-[#434752] rounded-xl p-5 space-y-3 hover:border-[#aec6ff]/60 transition-all group flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                              c.platform === 'LeetCode'
                                ? 'bg-[#ffb86a]/10 text-[#ffb86a] border-[#ffb86a]/30'
                                : 'bg-[#aec6ff]/10 text-[#aec6ff] border-[#aec6ff]/30'
                            }`}
                          >
                            {c.platform.toUpperCase()}
                          </span>
                          <span className="text-[#85da76] text-xs font-mono font-bold">{c.xpReward}</span>
                        </div>

                        <h4 className="text-sm font-bold text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors line-clamp-2">
                          {c.title}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-[#434752]/60 space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#c3c6d4]">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            {c.startTimeFormatted}
                          </span>
                          <span className="text-[#8d909d]">Duration: {c.duration}</span>
                        </div>

                        <button
                          onClick={() => window.open(c.url, '_blank', 'noopener,noreferrer')}
                          className="w-full py-2 bg-[#31353d] hover:bg-[#628fea] hover:text-white text-[#aec6ff] border border-[#434752] rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Register & Enter</span>
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Highlighted Challenges Header */}
          {(activeCategory === 'All' || activeCategory === 'Algorithms') && (
            <div className="space-y-4">
              <h3 className="text-xs uppercase font-mono tracking-widest text-[#8d909d]">Highlighted Challenges</h3>
              <div className="bg-[#181c24] border border-[#aec6ff]/30 rounded-xl p-6 space-y-4 relative overflow-hidden group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20 px-3 py-0.5 rounded text-xs font-bold font-mono">
                        EXPERT
                      </span>
                      <span className="text-[#ffb86a] text-xs font-mono font-bold">+1000 XP</span>
                    </div>
                    <h2 className="text-xl font-bold text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors">
                      System Design: Scalable Architecture
                    </h2>
                    <p className="text-xs text-[#c3c6d4] leading-relaxed max-w-xl">
                      Design a globally distributed, fault-tolerant system capable of handling 100k+ requests per second with sub-100ms latency. Focus on database sharding and caching strategies.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenChallengeModal('System Design: Scalable Architecture', '+1000 XP')}
                    className="bg-[#aec6ff] text-[#002e6b] hover:bg-[#628fea] hover:text-white px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-md"
                  >
                    Take Challenge
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onClick={() => handleOpenChallengeModal('Dynamic Programming Master', '+450 XP')}
              className="bg-[#181c24] border border-[#434752] rounded-xl p-6 space-y-4 hover:border-[#aec6ff]/50 transition-colors group cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <span className="bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20 px-2 py-0.5 rounded text-xs font-bold font-mono">HARD</span>
                <span className="text-[#ffb86a] text-xs font-mono font-bold">+450 XP</span>
              </div>
              <h4 className="text-base font-bold text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors">
                Dynamic Programming Master
              </h4>
              <p className="text-xs text-[#c3c6d4] leading-relaxed">
                Solve complex optimization problems using advanced memoization techniques.
              </p>
              <div className="flex justify-between items-center border-t border-[#434752] pt-4 text-xs font-mono text-[#8d909d]">
                <span>312 attempted</span>
                <span className="material-symbols-outlined group-hover:text-[#aec6ff] group-hover:translate-x-1 transition-all">arrow_forward</span>
              </div>
            </div>

            <div
              onClick={() => handleOpenChallengeModal('React Hook Optimization', '+180 XP')}
              className="bg-[#181c24] border border-[#434752] rounded-xl p-6 space-y-4 hover:border-[#aec6ff]/50 transition-colors group cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <span className="bg-[#ffb86a]/10 text-[#ffb86a] border border-[#ffb86a]/20 px-2 py-0.5 rounded text-xs font-bold font-mono">MEDIUM</span>
                <span className="text-[#ffb86a] text-xs font-mono font-bold">+180 XP</span>
              </div>
              <h4 className="text-base font-bold text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors">
                React Hook Optimization
              </h4>
              <p className="text-xs text-[#c3c6d4] leading-relaxed">
                Refactor a heavy component to minimize re-renders using useMemo and useCallback.
              </p>
              <div className="flex justify-between items-center border-t border-[#434752] pt-4 text-xs font-mono text-[#8d909d]">
                <span>954 attempted</span>
                <span className="material-symbols-outlined group-hover:text-[#aec6ff] group-hover:translate-x-1 transition-all">arrow_forward</span>
              </div>
            </div>

            <div
              onClick={() => handleOpenChallengeModal('SQL Performance Tuning', '+200 XP')}
              className="bg-[#181c24] border border-[#434752] rounded-xl p-6 space-y-4 hover:border-[#aec6ff]/50 transition-colors group cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <span className="bg-[#ffb86a]/10 text-[#ffb86a] border border-[#ffb86a]/20 px-2 py-0.5 rounded text-xs font-bold font-mono">MEDIUM</span>
                <span className="text-[#ffb86a] text-xs font-mono font-bold">+200 XP</span>
              </div>
              <h4 className="text-base font-bold text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors">
                SQL Performance Tuning
              </h4>
              <p className="text-xs text-[#c3c6d4] leading-relaxed">
                Optimize slow-running queries by analyzing execution plans and adding indexes.
              </p>
              <div className="flex justify-between items-center border-t border-[#434752] pt-4 text-xs font-mono text-[#8d909d]">
                <span>621 attempted</span>
                <span className="material-symbols-outlined group-hover:text-[#aec6ff] group-hover:translate-x-1 transition-all">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          <section className="bg-[#181c24] border border-[#434752] rounded-xl overflow-hidden">
            <div className="p-6 border-b border-[#434752] flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#dfe2ed]">Leaderboard</h3>
              <span className="text-xs text-[#aec6ff] font-bold uppercase font-mono">WEEKLY</span>
            </div>
            <div className="divide-y divide-[#434752] text-xs font-mono">
              {[
                { rank: 1, name: 'dev_master', score: '12,450' },
                { rank: 2, name: 'pixel_knight', score: '11,200' },
                { rank: 3, name: 'stack_guru', score: '10,890' },
                { rank: 4, name: 'node_ninja', score: '9,420' },
                { rank: 5, name: 'rust_ace', score: '8,100' }
              ].map(item => (
                <div key={item.rank} className="p-4 flex items-center justify-between hover:bg-[#1c2028]">
                  <div className="flex items-center gap-3">
                    <span className={`w-5 text-center font-bold ${item.rank === 1 ? 'text-[#ffb86a]' : 'text-[#8d909d]'}`}>
                      {item.rank}
                    </span>
                    <span className="text-[#dfe2ed]">{item.name}</span>
                  </div>
                  <span className="text-[#c3c6d4]">{item.score}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-[#1c2028] text-center border-t border-[#434752]">
              <button className="text-xs font-bold text-[#aec6ff] hover:underline cursor-pointer">
                View All Rankings
              </button>
            </div>
          </section>
        </aside>
      </div>

      {/* Take Challenge Modal */}
      {showTakeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181c24] border border-[#434752] rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#434752] pb-2">
              <h3 className="text-lg font-bold text-[#dfe2ed]">{selectedChallengeTitle}</h3>
              <button onClick={() => setShowTakeModal(false)} className="text-[#8d909d] hover:text-[#dfe2ed]">✕</button>
            </div>
            <p className="text-xs text-[#c3c6d4] leading-relaxed">
              You are about to start a competitive challenge. Allocated time: 90 minutes. Reward: {selectedChallengeXp}.
            </p>
            <div className="p-3 bg-[#0f131b] border border-[#434752] rounded-xl text-xs font-mono text-[#85da76]">
              ✓ Live contest environment provisioned cleanly. Ready to proceed.
            </div>
            <button
              onClick={() => {
                setShowTakeModal(false);
                if (selectedChallengeLink) {
                  window.open(selectedChallengeLink, '_blank', 'noopener,noreferrer');
                }
              }}
              className="w-full py-2.5 rounded-xl bg-[#628fea] hover:bg-[#aec6ff] hover:text-[#002e6b] text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Start Challenge Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
