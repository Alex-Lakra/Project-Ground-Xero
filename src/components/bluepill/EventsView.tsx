import React, { useState } from 'react';

export default function EventsView() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({
    'Edge Computing Summit 2026': false,
    'Advanced Patterns in React 19': false,
    'DevOps & Chill: SF Chapter': false
  });

  const toggleRegister = (title: string) => {
    setRegisteredEvents(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="py-8 px-6 md:px-8 max-w-[1200px] mx-auto text-[#dfe2ed]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: My Events & Calendar */}
        <aside className="lg:col-span-3 space-y-6">
          {/* My Events Card */}
          <section className="bg-[#181c24] border border-[#434752] rounded-2xl p-6 space-y-6">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#8d909d]">My Events</h2>
            <div className="space-y-6">
              <div className="group cursor-pointer">
                <p className="text-[11px] text-[#aec6ff] font-mono font-bold mb-1">OCT 24, 2026</p>
                <h3 className="text-sm font-bold text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors">
                  Global AI Hackathon
                </h3>
                <p className="text-xs text-[#8d909d]">Virtual • 10:00 AM</p>
              </div>

              <div className="group cursor-pointer">
                <p className="text-[11px] text-[#aec6ff] font-mono font-bold mb-1">OCT 28, 2026</p>
                <h3 className="text-sm font-bold text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors">
                  React 19 Workshop
                </h3>
                <p className="text-xs text-[#8d909d]">Tech Hub 4 • 2:00 PM</p>
              </div>
            </div>

            <button className="w-full mt-4 py-2 border border-[#434752] rounded-lg text-xs font-bold text-[#dfe2ed] hover:bg-[#262a32] transition-all cursor-pointer">
              View All Registered
            </button>
          </section>

          {/* Calendar Widget */}
          <section className="bg-[#181c24] border border-[#434752] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#8d909d]">October 2026</h2>
              <div className="flex gap-2">
                <span className="material-symbols-outlined text-[#8d909d] cursor-pointer hover:text-[#aec6ff] text-[18px]">
                  chevron_left
                </span>
                <span className="material-symbols-outlined text-[#8d909d] cursor-pointer hover:text-[#aec6ff] text-[18px]">
                  chevron_right
                </span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
              <div className="text-[10px] font-bold text-[#8d909d]/50 pb-2">S</div>
              <div className="text-[10px] font-bold text-[#8d909d]/50 pb-2">M</div>
              <div className="text-[10px] font-bold text-[#8d909d]/50 pb-2">T</div>
              <div className="text-[10px] font-bold text-[#8d909d]/50 pb-2">W</div>
              <div className="text-[10px] font-bold text-[#8d909d]/50 pb-2">T</div>
              <div className="text-[10px] font-bold text-[#8d909d]/50 pb-2">F</div>
              <div className="text-[10px] font-bold text-[#8d909d]/50 pb-2">S</div>

              <div className="py-1 text-[#8d909d]/30">29</div>
              <div className="py-1 text-[#8d909d]/30">30</div>
              <div className="py-1">1</div>
              <div className="py-1">2</div>
              <div className="py-1">3</div>
              <div className="py-1">4</div>
              <div className="py-1">5</div>
              <div className="py-1">6</div>
              <div className="py-1">7</div>
              <div className="py-1">8</div>
              <div className="py-1">9</div>
              <div className="py-1">10</div>
              <div className="py-1">11</div>
              <div className="py-1">12</div>
              <div className="py-1">13</div>
              <div className="py-1">14</div>
              <div className="py-1">15</div>
              <div className="py-1">16</div>
              <div className="py-1">17</div>
              <div className="py-1">18</div>
              <div className="py-1">19</div>
              <div className="py-1">20</div>
              <div className="py-1">21</div>
              <div className="py-1">22</div>
              <div className="py-1">23</div>
              <div className="relative py-1 font-bold text-[#aec6ff]">
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-6 h-6 border border-[#aec6ff]/40 rounded-full" />
                </span>
                24
              </div>
              <div className="py-1">25</div>
              <div className="py-1">26</div>
              <div className="py-1">27</div>
              <div className="relative py-1 font-bold text-[#aec6ff]">
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-6 h-6 border border-[#aec6ff]/40 rounded-full" />
                </span>
                28
              </div>
              <div className="py-1">29</div>
              <div className="py-1">30</div>
              <div className="py-1">31</div>
            </div>
          </section>
        </aside>

        {/* CENTER COLUMN: Upcoming Events Feed */}
        <article className="lg:col-span-6 space-y-6">
          <header className="flex gap-2">
            {['All', 'Hackathons', 'Workshops'].map(type => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                  activeFilter === type
                    ? 'bg-[#628fea] text-white border-[#628fea]'
                    : 'bg-[#181c24] border-[#434752] text-[#c3c6d4] hover:border-[#aec6ff]'
                }`}
              >
                {type}
              </button>
            ))}
          </header>

          <div className="space-y-6">
            {/* Event 1 */}
            <div className="bg-[#181c24] border border-[#434752] rounded-2xl p-6 space-y-4 hover:border-[#aec6ff]/50 transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#434752] flex-shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=300&q=80"
                      alt="Edge Computing Summit"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#dfe2ed]">Edge Computing Summit 2026</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#8d909d] mt-1 font-mono">
                      <span>📅 Nov 12–14</span>
                      <span>📍 Tech Hub 4, SF</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleRegister('Edge Computing Summit 2026')}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    registeredEvents['Edge Computing Summit 2026']
                      ? 'bg-[#005e06] border border-[#82d672] text-white'
                      : 'bg-[#181c24] border border-[#434752] text-[#dfe2ed] hover:bg-[#262a32]'
                  }`}
                >
                  {registeredEvents['Edge Computing Summit 2026'] ? 'Registered ✓' : 'Register'}
                </button>
              </div>

              <p className="text-xs text-[#c3c6d4] leading-relaxed">
                Join 500+ developers for 48 hours of intense building focused on low-latency edge architectures.
              </p>
            </div>

            {/* Event 2 */}
            <div className="bg-[#181c24] border border-[#434752] rounded-2xl p-6 space-y-4 hover:border-[#aec6ff]/50 transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#434752] flex-shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=300&q=80"
                      alt="React 19 Workshop"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#dfe2ed]">Advanced Patterns in React 19</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#8d909d] mt-1 font-mono">
                      <span>📅 Nov 18, 2026</span>
                      <span>💻 Virtual Workshop</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleRegister('Advanced Patterns in React 19')}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    registeredEvents['Advanced Patterns in React 19']
                      ? 'bg-[#005e06] border border-[#82d672] text-white'
                      : 'bg-[#181c24] border border-[#434752] text-[#dfe2ed] hover:bg-[#262a32]'
                  }`}
                >
                  {registeredEvents['Advanced Patterns in React 19'] ? 'Registered ✓' : 'Register'}
                </button>
              </div>

              <p className="text-xs text-[#c3c6d4] leading-relaxed">
                A deep dive into the new Compiler, Server Actions, and architectural shifts in React 19.
              </p>
            </div>

            {/* Event 3 */}
            <div className="bg-[#181c24] border border-[#434752] rounded-2xl p-6 space-y-4 hover:border-[#aec6ff]/50 transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#434752] flex-shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=300&q=80"
                      alt="DevOps & Chill"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#dfe2ed]">DevOps & Chill: SF Chapter</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#8d909d] mt-1 font-mono">
                      <span>📅 Dec 01, 2026</span>
                      <span>📍 Sky Lounge, SF</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleRegister('DevOps & Chill: SF Chapter')}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    registeredEvents['DevOps & Chill: SF Chapter']
                      ? 'bg-[#005e06] border border-[#82d672] text-white'
                      : 'bg-[#181c24] border border-[#434752] text-[#dfe2ed] hover:bg-[#262a32]'
                  }`}
                >
                  {registeredEvents['DevOps & Chill: SF Chapter'] ? 'Registered ✓' : 'Register'}
                </button>
              </div>

              <p className="text-xs text-[#c3c6d4] leading-relaxed">
                Monthly informal gathering for DevOps engineers and SREs. No talks, just networking and drinks.
              </p>
            </div>
          </div>
        </article>

        {/* RIGHT COLUMN: Host CTA */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-[#181c24] border border-[#434752] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[#dfe2ed]">Host your own event?</h3>
            <p className="text-xs text-[#c3c6d4] leading-relaxed">
              Get access to our community of 50k+ developers worldwide.
            </p>
            <button className="w-full py-2.5 bg-[#181c24] border border-[#434752] text-[#dfe2ed] rounded-xl text-xs font-bold hover:bg-[#262a32] transition-colors cursor-pointer">
              Apply Now
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
