import React, { useState, useEffect } from 'react';
import { NavTab } from './HeaderNav';
import leetCodeLogo from '../../assets/LeetCode_logo.png';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
}

interface LeetCodeDailyQuestion {
  questionId: string;
  title: string;
  difficulty: string;
  tags: string[];
  description: string;
  link: string;
  date: string;
}

/**
 * Helper to calculate the latest LeetCode Daily Question reset timestamp.
 * LeetCode resets questions at 00:00:00 UTC = 05:30:00 AM IST.
 */
function getLatestLeetCodeResetTimestamp(now = new Date()): number {
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0);
}

function isDailyCacheStale(lastFetchedMs: number, now = new Date()): boolean {
  if (!lastFetchedMs) return true;
  return lastFetchedMs < getLatestLeetCodeResetTimestamp(now);
}

const INSTANT_LEETCODE_DAILY: LeetCodeDailyQuestion = {
  questionId: "3513",
  title: "Number of Unique XOR Triplets I",
  difficulty: "Medium",
  tags: ["Array", "Math", "Bit Manipulation"],
  description: "You are given an integer array nums of length n, where nums is a permutation of the numbers in the range [1, n]. A XOR triplet is defined as the XOR of three elements nums[i] XOR nums[j] XOR nums[k] where i <= j <= k. Return the number of unique XOR triplet values from all possible triplets (i, j, k).",
  link: "https://leetcode.com/problems/number-of-unique-xor-triplets-i/",
  date: new Date().toISOString().split('T')[0]
};

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  // LeetCode Daily Question State
  const [dailyQuestion, setDailyQuestion] = useState<LeetCodeDailyQuestion>(INSTANT_LEETCODE_DAILY);
  const [isLoadingDaily, setIsLoadingDaily] = useState(false);
  const [showReadMoreModal, setShowReadMoreModal] = useState(false);

  useEffect(() => {
    async function fetchDailyQuestion() {
      // 1. Check local storage cache
      try {
        const rawCache = localStorage.getItem('leetcode_daily_cache');
        if (rawCache) {
          const parsed = JSON.parse(rawCache);
          if (parsed && parsed.question && !isDailyCacheStale(parsed.fetchedAt)) {
            setDailyQuestion(parsed.question);
            return; // Cache is fresh (fetched after today's 05:30 AM IST reset)
          }
        }
      } catch (err) {
        console.warn('Error reading local daily cache:', err);
      }

      setIsLoadingDaily(true);
      let loadedQuestion: LeetCodeDailyQuestion | null = null;

      // 2. Fetch fresh question if cache is stale (or post 05:30 AM IST)
      try {
        const res = await fetch('/api/leetcode-daily?force=true');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.question) {
            loadedQuestion = data.question;
          }
        }
      } catch (err) {
        console.warn('Local API /api/leetcode-daily unreachable, attempting client fallback:', err);
      }

      // 3. Fallback direct to public API if needed
      if (!loadedQuestion) {
        try {
          const res = await fetch('https://alfa-leetcode-api.onrender.com/daily');
          if (res.ok) {
            const data = await res.json();
            if (data && data.questionTitle) {
              const cleanDesc = (data.question || '')
                .replace(/<[^>]+>/g, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&amp;/g, '&')
                .trim();

              const tags = Array.isArray(data.topicTags) 
                ? data.topicTags.map((t: any) => t.name)
                : ['Data Structures & Algorithms'];

              loadedQuestion = {
                questionId: data.questionFrontendId || '3513',
                title: data.questionTitle,
                difficulty: data.difficulty || 'Medium',
                tags: tags.length > 0 ? tags : ['Algorithms'],
                description: cleanDesc,
                link: data.questionLink || 'https://leetcode.com',
                date: data.date || new Date().toISOString().split('T')[0]
              };
            }
          }
        } catch (fallbackErr) {
          console.error('Failed client fallback for LeetCode daily question:', fallbackErr);
        }
      }

      if (loadedQuestion) {
        setDailyQuestion(loadedQuestion);
        try {
          localStorage.setItem('leetcode_daily_cache', JSON.stringify({
            question: loadedQuestion,
            fetchedAt: Date.now()
          }));
        } catch (e) {
          console.warn('Failed saving to localStorage:', e);
        }
      }

      setIsLoadingDaily(false);
    }

    fetchDailyQuestion();
  }, []);

  return (
    <div className="pt-6 pb-12 px-6 md:px-8 max-w-[1200px] mx-auto text-[#dfe2ed]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Leaderboard */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#181c24] border border-[#434752] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#dfe2ed]">Leaderboard</h3>
              <button
                onClick={() => onNavigate('challenges')}
                className="text-sm text-[#aec6ff] hover:underline font-medium cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1c2028] overflow-hidden border border-[#434752]">
                    <img
                      alt="User 1"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBc6mf_cYWQ4fag9mWs39WZKDi73FMgWK8W5icg4bLpW0CtOdnqTeUjDDY9j5MAIm39N--yVS5S-ATTEkc1nGywJDMnHsq45A8e0HJrR1qXoru0Z6W44IbW7rKBSHeHEPpUTnz5y8WcGDdLQLAvP2kvDd2QouLWvnX56na6NjGHV4gfH7IXh1x_mgiQPJua8Vrky2UpoLHHBrZhz31lNwls2H1aLdlUI1sb0s8oaz0w5F62_g3NyXF4rJhHwJRsmquJqlq-IgLMnE"
                    />
                  </div>
                  <span className="text-sm text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors font-medium">
                    Sarah Chen
                  </span>
                </div>
                <span className="text-xs text-[#aec6ff] font-bold">12.4k XP</span>
              </div>

              <div className="flex items-center justify-between group cursor-pointer" onClick={() => onNavigate('profile')}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1c2028] overflow-hidden border border-[#434752]">
                    <img
                      alt="User 2"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL_dJvRqJwVVWn5reKnZAd6ktKkiwEAtqlTG21kTradcEBr-ERjp_eAkJgjgeKIubcI21ckRDqvoqJ9pKzYC7UGLPpOgM5d_1lVbapt96PdTSHGUzrKeNFgvJlX3vfO_zkVcVkJe2L_14OLgou3gidsvorMhn4XuTMWDMa03WRkZQFvR8gkcWKoXUk7hxSgl4L9bVUfLaky0C8MFCi9GQJ3JSKDfG0Nnpp-fJRAYc7CaFx_49fYTHxMewkfdrzlm2yv8TPDJOU4tQ"
                    />
                  </div>
                  <span className="text-sm text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors font-medium">
                    Alex Rivera
                  </span>
                </div>
                <span className="text-xs text-[#c3c6d4]">11.8k XP</span>
              </div>

              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1c2028] overflow-hidden border border-[#434752] flex items-center justify-center text-[#c3c6d4] text-xs font-bold font-mono">
                    JD
                  </div>
                  <span className="text-sm text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors font-medium">
                    Jordan Doe
                  </span>
                </div>
                <span className="text-xs text-[#c3c6d4]">10.2k XP</span>
              </div>

              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1c2028] overflow-hidden border border-[#434752] flex items-center justify-center text-[#c3c6d4] text-xs font-bold font-mono">
                    MK
                  </div>
                  <span className="text-sm text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors font-medium">
                    Maya Kim
                  </span>
                </div>
                <span className="text-xs text-[#c3c6d4]">9.5k XP</span>
              </div>

              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1c2028] overflow-hidden border border-[#434752] flex items-center justify-center text-[#c3c6d4] text-xs font-bold font-mono">
                    LW
                  </div>
                  <span className="text-sm text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors font-medium">
                    Leo Wong
                  </span>
                </div>
                <span className="text-xs text-[#c3c6d4]">8.9k XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Coding Activity & Daily Question */}
        <div className="lg:col-span-6 space-y-6">
          {/* Coding Activity Card */}
          <div className="bg-[#181c24] border border-[#434752] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#dfe2ed]">Coding Activity</h3>
              <select className="bg-[#0f131b] border border-[#434752] text-[#dfe2ed] text-xs rounded-lg px-3 py-1 focus:outline-none focus:border-[#aec6ff]">
                <option>Year 2026</option>
                <option>Year 2025</option>
              </select>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="flex gap-1 items-start min-w-[500px]">
                <div className="flex flex-col gap-2 text-[10px] text-[#c3c6d4] pr-2 pt-6 font-mono">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] text-[#c3c6d4] mb-2 font-mono">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
                    <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                    <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                  </div>
                  <div className="grid grid-flow-col grid-rows-7 gap-1">
                    {Array.from({ length: 364 }).map((_, i) => {
                      const colors = [
                        'bg-[#31353d]',
                        'bg-[#85da76]/20',
                        'bg-[#85da76]/40',
                        'bg-[#85da76]/70',
                        'bg-[#85da76]'
                      ];
                      const idx = (i * 13 + 7) % 5;
                      return (
                        <div
                          key={i}
                          className={`w-2.5 h-2.5 rounded-[1px] ${colors[idx]} hover:ring-1 hover:ring-[#aec6ff] transition-all cursor-pointer`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Question Card */}
          <div className="bg-[#181c24] border border-[#434752] rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-[#dfe2ed]">Daily Question</h3>
                <span className="text-xs text-[#c3c6d4]">
                  {isLoadingDaily ? 'Fetching from LeetCode...' : dailyQuestion ? `Question ${dailyQuestion.questionId}` : 'Question 1'}
                </span>
              </div>
              <a
                href="https://leetcode.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity flex items-center shrink-0"
                title="Go to LeetCode.com"
              >
                <img
                  src={leetCodeLogo}
                  alt="LeetCode Logo"
                  className="w-7 h-7 object-contain"
                />
              </a>
            </div>

            {isLoadingDaily ? (
              <div className="space-y-3 py-4 animate-pulse">
                <div className="h-6 bg-[#31353d] rounded w-3/4" />
                <div className="h-4 bg-[#31353d] rounded w-1/2" />
                <div className="h-12 bg-[#31353d] rounded w-full" />
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-[#dfe2ed]">
                    {dailyQuestion ? `${dailyQuestion.questionId}. ${dailyQuestion.title}` : 'Number of Unique XOR Triplets I'}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                      dailyQuestion?.difficulty === 'Hard'
                        ? 'bg-[#ffb4ab]/10 text-[#ffb4ab]'
                        : dailyQuestion?.difficulty === 'Medium'
                        ? 'bg-[#ffb86a]/10 text-[#ffb86a]'
                        : 'bg-[#85da76]/10 text-[#85da76]'
                    }`}>
                      {dailyQuestion?.difficulty || 'MEDIUM'}
                    </span>
                    <span className="text-xs text-[#c3c6d4]">
                      Topic: {dailyQuestion?.tags?.join(', ') || 'Data Structures & Algorithms'} • <span className="text-[#aec6ff] font-bold">100 XP</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#c3c6d4] leading-relaxed line-clamp-3">
                  {dailyQuestion?.description || 'You are given an integer array nums of length n...'}
                </p>

                <div className="flex justify-between items-center pt-2">
                  <a
                    href={dailyQuestion?.link || 'https://leetcode.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1f283a] border border-[#3b4b6b] text-[#aec6ff] hover:text-white font-medium text-xs rounded-full shadow-sm hover:scale-105 hover:bg-[#283650] hover:border-[#526a99] transition-all duration-200 cursor-pointer"
                  >
                    <span>View on LeetCode</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </a>
                  <button
                    onClick={() => setShowReadMoreModal(true)}
                    className="bg-[#aec6ff] text-[#002e6b] hover:bg-[#628fea] hover:text-white px-6 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-md"
                  >
                    Read More
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Recent Projects Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#dfe2ed]">Recent Projects</h3>
              <a href="#" className="text-sm text-[#aec6ff] hover:underline font-medium">View All</a>
            </div>

            {/* Project Card 1 */}
            <div className="bg-[#181c24] border border-[#434752] rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-start">
              <div className="w-full md:w-40 h-28 rounded-xl overflow-hidden border border-[#434752] flex-shrink-0">
                <img
                  className="w-full h-full object-cover"
                  alt="Nebula Cloud Engine"
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="text-base font-bold text-[#dfe2ed]">Nebula Cloud Engine</h4>
                  <span className="text-xs text-[#c3c6d4] font-mono">2 days ago</span>
                </div>
                <p className="text-xs text-[#c3c6d4] leading-relaxed line-clamp-2">
                  A high-performance distributed systems orchestration tool built with Go and Rust. Features automatic load balancing.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 bg-[#31353d] text-[#c3c6d4] rounded text-[11px] font-mono">React</span>
                  <span className="px-2 py-0.5 bg-[#31353d] text-[#c3c6d4] rounded text-[11px] font-mono">Go</span>
                  <span className="px-2 py-0.5 bg-[#31353d] text-[#c3c6d4] rounded text-[11px] font-mono">gRPC</span>
                </div>
                <div className="flex gap-4 pt-2 text-xs">
                  <button className="flex items-center gap-1 text-[#c3c6d4] hover:text-[#aec6ff] cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">code</span> GitHub
                  </button>
                  <button className="flex items-center gap-1 text-[#c3c6d4] hover:text-[#aec6ff] cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span> Demo
                  </button>
                </div>
              </div>
            </div>

            {/* Project Card 2 */}
            <div className="bg-[#181c24] border border-[#434752] rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-start">
              <div className="w-full md:w-40 h-28 rounded-xl overflow-hidden border border-[#434752] flex-shrink-0">
                <img
                  className="w-full h-full object-cover"
                  alt="Pulse ML visualizer"
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="text-base font-bold text-[#dfe2ed]">Pulse ML visualizer</h4>
                  <span className="text-xs text-[#c3c6d4] font-mono">1 week ago</span>
                </div>
                <p className="text-xs text-[#c3c6d4] leading-relaxed line-clamp-2">
                  Real-time visualization library for neural network training cycles. Interactive node-link diagrams for weight analysis.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 bg-[#31353d] text-[#c3c6d4] rounded text-[11px] font-mono">Python</span>
                  <span className="px-2 py-0.5 bg-[#31353d] text-[#c3c6d4] rounded text-[11px] font-mono">D3.js</span>
                  <span className="px-2 py-0.5 bg-[#31353d] text-[#c3c6d4] rounded text-[11px] font-mono">FastAPI</span>
                </div>
                <div className="flex gap-4 pt-2 text-xs">
                  <button className="flex items-center gap-1 text-[#c3c6d4] hover:text-[#aec6ff] cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">code</span> GitHub
                  </button>
                  <button className="flex items-center gap-1 text-[#c3c6d4] hover:text-[#aec6ff] cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span> Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Progress & Stats */}
        <div className="lg:col-span-3 space-y-6">
          {/* Upcoming Events */}
          <div className="bg-[#181c24] border border-[#434752] rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-[#dfe2ed]">Upcoming Events</h3>
            <div className="space-y-3">
              <div className="p-3 border border-[#434752] rounded-xl bg-[#1c2028] hover:bg-[#262a32] transition-all group cursor-pointer" onClick={() => onNavigate('events')}>
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-[#85da76]/10 text-[#85da76] text-[10px] font-bold px-2 py-0.5 rounded uppercase">Hackathon</span>
                  <span className="material-symbols-outlined text-[#8d909d] group-hover:text-[#aec6ff]">arrow_forward</span>
                </div>
                <h5 className="text-sm font-bold text-[#dfe2ed]">Global Algo-Trade '26</h5>
                <p className="text-xs text-[#c3c6d4]">Oct 14 • Tech Hub 4</p>
              </div>

              <div className="p-3 border border-[#434752] rounded-xl bg-[#1c2028] hover:bg-[#262a32] transition-all group cursor-pointer" onClick={() => onNavigate('events')}>
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-[#ffb86a]/10 text-[#ffb86a] text-[10px] font-bold px-2 py-0.5 rounded uppercase">Workshop</span>
                  <span className="material-symbols-outlined text-[#8d909d] group-hover:text-[#aec6ff]">arrow_forward</span>
                </div>
                <h5 className="text-sm font-bold text-[#dfe2ed]">Advanced Rust Internals</h5>
                <p className="text-xs text-[#c3c6d4]">Oct 21 • Virtual (Zoom)</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="w-full py-2 border border-[#434752] rounded-lg text-xs font-bold text-[#dfe2ed] hover:bg-[#1c2028] transition-colors cursor-pointer"
            >
              View All Events
            </button>
          </div>

          {/* Coding Progress Card (DSA Progress Wheel) */}
          <div className="bg-[#181c24] border border-[#434752] rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#dfe2ed]">DSA Progress</h3>
              <div className="flex bg-[#1c2028] rounded-full p-1 border border-[#434752]">
                <button className="px-3 py-0.5 bg-[#353942] text-[#dfe2ed] rounded-full text-xs font-bold">TUF</button>
                <button className="px-3 py-0.5 text-[#c3c6d4] hover:text-[#dfe2ed] text-xs font-bold">LeetCode</button>
              </div>
            </div>

            {/* Circular Progress Wheel */}
            <div className="relative flex justify-center items-center">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle className="text-[#31353d]" cx="72" cy="72" fill="transparent" r="60" stroke="currentColor" strokeWidth="8" />
                <circle cx="72" cy="72" fill="transparent" r="60" stroke="#85da76" strokeDasharray="376" strokeDashoffset="310" strokeLinecap="round" strokeWidth="8" />
                <circle className="transform rotate-45 origin-center" cx="72" cy="72" fill="transparent" r="60" stroke="#ffb86a" strokeDasharray="376" strokeDashoffset="350" strokeLinecap="round" strokeWidth="8" />
                <circle className="transform rotate-90 origin-center" cx="72" cy="72" fill="transparent" r="60" stroke="#ffb4ab" strokeDasharray="376" strokeDashoffset="365" strokeLinecap="round" strokeWidth="8" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#dfe2ed]">76</span>
                <div className="w-10 h-px bg-[#434752] my-1" />
                <span className="text-xs text-[#c3c6d4] font-mono">1121</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-[#c3c6d4]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#85da76]" />
                <span>Easy <strong className="text-[#dfe2ed]">58/374</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffb86a]" />
                <span>Med <strong className="text-[#dfe2ed]">17/477</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab]" />
                <span>Hard <strong className="text-[#dfe2ed]">1/253</strong></span>
              </div>
            </div>
          </div>

          {/* GitHub Stats Card */}
          <div className="bg-[#181c24] border border-[#434752] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#dfe2ed]">GitHub Stats</h3>
              <span className="material-symbols-outlined text-[#8d909d]">monitoring</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <p className="text-[#8d909d] text-[10px] uppercase">Repos</p>
                <p className="text-sm font-bold text-[#dfe2ed]">124</p>
              </div>
              <div>
                <p className="text-[#8d909d] text-[10px] uppercase">Commits</p>
                <p className="text-sm font-bold text-[#dfe2ed]">2,482</p>
              </div>
              <div>
                <p className="text-[#8d909d] text-[10px] uppercase">PRs</p>
                <p className="text-sm font-bold text-[#dfe2ed]">342</p>
              </div>
              <div>
                <p className="text-[#8d909d] text-[10px] uppercase">Stars</p>
                <p className="text-sm font-bold text-[#dfe2ed]">8.2k</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-[11px] text-[#8d909d]">Commit Activity (Last 30 Days)</p>
              <div className="flex items-end gap-1 h-12 w-full">
                <div className="flex-1 bg-[#aec6ff]/20 h-[30%] rounded-t-sm" />
                <div className="flex-1 bg-[#aec6ff]/30 h-[45%] rounded-t-sm" />
                <div className="flex-1 bg-[#aec6ff]/40 h-[60%] rounded-t-sm" />
                <div className="flex-1 bg-[#aec6ff]/20 h-[25%] rounded-t-sm" />
                <div className="flex-1 bg-[#aec6ff]/50 h-[80%] rounded-t-sm" />
                <div className="flex-1 bg-[#aec6ff]/30 h-[40%] rounded-t-sm" />
                <div className="flex-1 bg-[#aec6ff]/70 h-[90%] rounded-t-sm" />
                <div className="flex-1 bg-[#aec6ff]/40 h-[50%] rounded-t-sm" />
                <div className="flex-1 bg-[#aec6ff]/20 h-[20%] rounded-t-sm" />
                <div className="flex-1 bg-[#aec6ff]/60 h-[75%] rounded-t-sm" />
                <div className="flex-1 bg-[#aec6ff]/40 h-[55%] rounded-t-sm" />
                <div className="flex-1 bg-[#aec6ff] h-[100%] rounded-t-sm" />
              </div>
            </div>

            <button
              onClick={() => onNavigate('profile')}
              className="w-full py-2 border border-[#434752] text-[#dfe2ed] font-medium text-xs rounded-lg hover:bg-[#1c2028] transition-colors cursor-pointer"
            >
              View GitHub Profile
            </button>
          </div>
        </div>
      </div>

      {/* Read More Problem Details Modal */}
      {showReadMoreModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181c24] border border-[#434752] rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#434752] pb-3">
              <div>
                <span className={`text-xs font-mono uppercase font-bold ${
                  dailyQuestion?.difficulty === 'Hard' ? 'text-[#ffb4ab]' :
                  dailyQuestion?.difficulty === 'Medium' ? 'text-[#ffb86a]' :
                  'text-[#85da76]'
                }`}>
                  {dailyQuestion?.difficulty || 'MEDIUM'} • 100 XP
                </span>
                <h3 className="text-xl font-bold text-[#dfe2ed]">
                  {dailyQuestion ? `${dailyQuestion.questionId}. ${dailyQuestion.title}` : 'LeetCode Daily Question'}
                </h3>
              </div>
              <button
                onClick={() => setShowReadMoreModal(false)}
                className="text-[#8d909d] hover:text-white font-bold text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-[#8d909d] font-mono">Topics:</span>
              {dailyQuestion?.tags?.map(t => (
                <span key={t} className="px-2 py-0.5 bg-[#31353d] text-[#c3c6d4] rounded text-[11px] font-mono">
                  {t}
                </span>
              ))}
            </div>

            <div className="bg-[#0a0e16] p-4 rounded-xl border border-[#434752] max-h-80 overflow-y-auto">
              <p className="text-xs text-[#c3c6d4] leading-relaxed whitespace-pre-wrap">
                {dailyQuestion?.description}
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setShowReadMoreModal(false)}
                className="px-5 py-2 border border-[#434752] rounded-xl text-xs font-bold text-[#dfe2ed] hover:bg-[#262a32] cursor-pointer"
              >
                Close
              </button>
              <a
                href={dailyQuestion?.link || 'https://leetcode.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-[#628fea] hover:bg-[#295bb3] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                Solve on LeetCode <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
