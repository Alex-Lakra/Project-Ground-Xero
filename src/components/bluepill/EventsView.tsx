import React, { useState, useEffect } from 'react';
import { PublishedEvent } from './AdminConsoleView';

export function getFallbackEventBanner(category: string, title: string = 'Event'): string {
  const gradients: Record<string, [string, string]> = {
    Hackathon: ['#1e1b4b', '#4f46e5'],
    Workshop: ['#064e3b', '#10b981'],
    Meetup: ['#701a75', '#d946ef'],
    Webinar: ['#1e293b', '#3b82f6'],
  };
  const [bg1, bg2] = gradients[category] || ['#1e293b', '#628fea'];
  const label = (category || 'EVENT').toUpperCase();
  const shortTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}"/>
        <stop offset="100%" stop-color="${bg2}"/>
      </linearGradient>
    </defs>
    <rect width="300" height="200" fill="url(#g)"/>
    <circle cx="250" cy="40" r="80" fill="#ffffff" opacity="0.08"/>
    <circle cx="30" cy="170" r="60" fill="#ffffff" opacity="0.05"/>
    <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">${label}</text>
    <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="11" opacity="0.8">${shortTitle}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function EventsView() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [eventsList, setEventsList] = useState<PublishedEvent[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem('xero_events');
      if (storedEvents) {
        setEventsList(JSON.parse(storedEvents));
      } else {
        setEventsList([]);
      }
    } catch (e) {
      setEventsList([]);
    }
  }, []);

  const toggleRegister = (id: string) => {
    setRegisteredEvents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredEvents = eventsList.filter(ev => {
    if (activeFilter === 'All') return true;
    return ev.category === activeFilter || (ev.category + 's') === activeFilter;
  });

  return (
    <div className="py-8 px-6 md:px-8 max-w-[1200px] mx-auto text-[#dfe2ed]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: My Events & Calendar */}
        <aside className="lg:col-span-3 space-y-6">
          {/* My Events Card */}
          <section className="bg-[#181c24] border border-[#434752] rounded-2xl p-6 space-y-6">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#8d909d]">My Events</h2>
            <div className="space-y-4">
              {eventsList.filter(e => registeredEvents[e.id]).length === 0 ? (
                <p className="text-xs text-[#8d909d] italic">No registered events yet.</p>
              ) : (
                eventsList.filter(e => registeredEvents[e.id]).map(ev => (
                  <div key={ev.id} className="group cursor-pointer">
                    <p className="text-[11px] text-[#aec6ff] font-mono font-bold mb-0.5">{ev.date}</p>
                    <h3 className="text-sm font-bold text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-[#8d909d]">{ev.location}</p>
                  </div>
                ))
              )}
            </div>

            <button className="w-full mt-2 py-2 border border-[#434752] rounded-lg text-xs font-bold text-[#dfe2ed] hover:bg-[#262a32] transition-all cursor-pointer">
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
            {['All', 'Hackathons', 'Workshops', 'Meetups'].map(type => (
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
            {filteredEvents.length === 0 ? (
              <div className="bg-[#181c24] border border-[#434752] rounded-2xl p-10 text-center space-y-4 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-[#262e3d] text-[#aec6ff] border border-[#3b4963] flex items-center justify-center mx-auto shadow-inner">
                  <span className="material-symbols-outlined text-3xl">event_busy</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#dfe2ed]">No Upcoming Events Available</h3>
                  <p className="text-xs text-[#c3c6d4] max-w-md mx-auto leading-relaxed mt-1">
                    There are currently no scheduled events available. Check back soon or log in as Admin to post new hackathons, workshops, and webinars!
                  </p>
                </div>
              </div>
            ) : (
              filteredEvents.map(ev => (
                <div key={ev.id} className="bg-[#181c24] border border-[#434752] rounded-2xl p-6 space-y-4 hover:border-[#aec6ff]/50 transition-all shadow-md">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#434752] flex-shrink-0">
                        <img
                          className="w-full h-full object-cover"
                          src={ev.imageUrl || getFallbackEventBanner(ev.category, ev.title)}
                          alt={ev.title}
                          onError={(e) => {
                            e.currentTarget.src = getFallbackEventBanner(ev.category, ev.title);
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-[#a8dadc] bg-[#1d3557] px-2 py-0.5 rounded font-bold uppercase">
                          {ev.category}
                        </span>
                        <h3 className="text-base font-bold text-[#dfe2ed] mt-1">{ev.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#8d909d] mt-0.5 font-mono">
                          <span>📅 {ev.date}</span>
                          <span>📍 {ev.location}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleRegister(ev.id)}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        registeredEvents[ev.id]
                          ? 'bg-[#005e06] border border-[#82d672] text-white'
                          : 'bg-[#181c24] border border-[#434752] text-[#dfe2ed] hover:bg-[#262a32]'
                      }`}
                    >
                      {registeredEvents[ev.id] ? 'Registered ✓' : 'Register'}
                    </button>
                  </div>

                  <p className="text-xs text-[#c3c6d4] leading-relaxed">
                    {ev.description}
                  </p>
                </div>
              ))
            )}
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
