import React, { useState } from 'react';

export default function CommunitiesView() {
  const [joinedCommunities, setJoinedCommunities] = useState<Record<string, boolean>>({
    'Fullstack Collective': false,
    'AI/ML Hub': false,
    'Open Source Contributors': false
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [communityName, setCommunityName] = useState('');
  const [communityDesc, setCommunityDesc] = useState('');

  const toggleJoin = (name: string) => {
    setJoinedCommunities(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="pt-8 pb-16 px-6 md:px-8 max-w-[1200px] mx-auto text-[#dfe2ed]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#dfe2ed] mb-2 font-inter">Communities</h1>
          <p className="text-[#c3c6d4] text-base">Connect with fellow developers, share knowledge, and build together.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c3c6d4]">group</span>
            <input
              className="w-full bg-[#181c24] border border-[#434752] rounded-lg pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-[#aec6ff] text-[#dfe2ed] placeholder-[#8d909d]"
              placeholder="Find a community..."
              type="text"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#181c24] border border-[#434752] rounded-lg px-4 py-1.5 text-sm font-medium flex items-center gap-2 hover:bg-[#262a32] transition-colors text-[#c3c6d4] hover:text-[#dfe2ed] cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Create Community</span>
          </button>
        </div>
      </div>

      {/* Three-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* LEFT COLUMN: My Communities */}
        <aside className="md:col-span-3 flex flex-col gap-6">
          <section className="rounded-xl p-6 bg-[#181c24] border border-[#434752]">
            <h2 className="text-xs font-mono text-[#c3c6d4] uppercase tracking-wider mb-4 font-bold">
              My Communities
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-[#628fea]/20 flex items-center justify-center text-[#aec6ff]">
                  <span className="material-symbols-outlined">code</span>
                </div>
                <div className="flex-1">
                  <div className="text-[#dfe2ed] text-sm font-semibold group-hover:text-[#aec6ff] transition-colors">
                    React Enthusiasts
                  </div>
                  <div className="text-[#c3c6d4] text-[12px] font-mono">12.4k members</div>
                </div>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-[#005e06]/20 flex items-center justify-center text-[#85da76]">
                  <span className="material-symbols-outlined">hub</span>
                </div>
                <div className="flex-1">
                  <div className="text-[#dfe2ed] text-sm font-semibold group-hover:text-[#aec6ff] transition-colors">
                    System Design Prep
                  </div>
                  <div className="text-[#c3c6d4] text-[12px] font-mono">8.1k members</div>
                </div>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-[#ca801f]/20 flex items-center justify-center text-[#ffb86a]">
                  <span className="material-symbols-outlined">terminal</span>
                </div>
                <div className="flex-1">
                  <div className="text-[#dfe2ed] text-sm font-semibold group-hover:text-[#aec6ff] transition-colors">
                    Rustaceans
                  </div>
                  <div className="text-[#c3c6d4] text-[12px] font-mono">5.2k members</div>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 text-[#aec6ff] text-xs font-mono flex items-center justify-center gap-1 hover:underline cursor-pointer">
              View all <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </section>
        </aside>

        {/* CENTER COLUMN: Featured Communities */}
        <div className="md:col-span-6 flex flex-col gap-6">
          <h2 className="text-xl text-[#dfe2ed] flex items-center gap-2 font-bold">
            <span className="material-symbols-outlined text-[#aec6ff]">auto_awesome</span>
            Featured Communities
          </h2>

          {/* Community Card 1 */}
          <article className="rounded-xl overflow-hidden group bg-[#181c24] border border-[#434752]">
            <div className="p-6 flex gap-6 items-start">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-[#434752]">
                <img
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80"
                  alt="Fullstack Collective"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-[#dfe2ed]">Fullstack Collective</h3>
                  <button
                    onClick={() => toggleJoin('Fullstack Collective')}
                    className={`border rounded-lg px-4 py-1.5 text-xs font-medium min-w-[90px] transition-colors cursor-pointer ${
                      joinedCommunities['Fullstack Collective']
                        ? 'bg-[#005e06] border-[#82d672] text-white'
                        : 'bg-[#181c24] border-[#434752] text-[#c3c6d4] hover:bg-[#262a32]'
                    }`}
                  >
                    {joinedCommunities['Fullstack Collective'] ? 'Joined ✓' : 'Join'}
                  </button>
                </div>
                <p className="text-[#c3c6d4] text-xs leading-relaxed line-clamp-2">
                  The ultimate hub for developers mastering both front and back-end. Weekly workshops and peer code reviews.
                </p>
                <div className="flex items-center gap-4 text-[#c3c6d4] pt-2 text-xs font-mono">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">group</span>
                    <span>42.8k</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">forum</span>
                    <span>1.2k active</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Community Card 2 */}
          <article className="rounded-xl overflow-hidden group bg-[#181c24] border border-[#434752]">
            <div className="p-6 flex gap-6 items-start">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-[#434752]">
                <img
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80"
                  alt="AI/ML Hub"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-[#dfe2ed]">AI/ML Hub</h3>
                  <button
                    onClick={() => toggleJoin('AI/ML Hub')}
                    className={`border rounded-lg px-4 py-1.5 text-xs font-medium min-w-[90px] transition-colors cursor-pointer ${
                      joinedCommunities['AI/ML Hub']
                        ? 'bg-[#005e06] border-[#82d672] text-white'
                        : 'bg-[#181c24] border-[#434752] text-[#c3c6d4] hover:bg-[#262a32]'
                    }`}
                  >
                    {joinedCommunities['AI/ML Hub'] ? 'Joined ✓' : 'Join'}
                  </button>
                </div>
                <p className="text-[#c3c6d4] text-xs leading-relaxed line-clamp-2">
                  Exploring the boundaries of intelligence. Discuss the latest papers and share model optimizations.
                </p>
                <div className="flex items-center gap-4 text-[#c3c6d4] pt-2 text-xs font-mono">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">group</span>
                    <span>28.5k</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">forum</span>
                    <span>856 active</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Community Card 3 */}
          <article className="rounded-xl overflow-hidden group bg-[#181c24] border border-[#434752]">
            <div className="p-6 flex gap-6 items-start">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-[#434752]">
                <img
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80"
                  alt="Open Source Contributors"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-[#dfe2ed]">Open Source Contributors</h3>
                  <button
                    onClick={() => toggleJoin('Open Source Contributors')}
                    className={`border rounded-lg px-4 py-1.5 text-xs font-medium min-w-[90px] transition-colors cursor-pointer ${
                      joinedCommunities['Open Source Contributors']
                        ? 'bg-[#005e06] border-[#82d672] text-white'
                        : 'bg-[#181c24] border-[#434752] text-[#c3c6d4] hover:bg-[#262a32]'
                    }`}
                  >
                    {joinedCommunities['Open Source Contributors'] ? 'Joined ✓' : 'Join'}
                  </button>
                </div>
                <p className="text-[#c3c6d4] text-xs leading-relaxed line-clamp-2">
                  Bridging the gap between maintainers and contributors. Find projects to support and learn the ropes of OSS.
                </p>
                <div className="flex items-center gap-4 text-[#c3c6d4] pt-2 text-xs font-mono">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">group</span>
                    <span>15.9k</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">forum</span>
                    <span>432 active</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* RIGHT COLUMN: Trending Discussions */}
        <aside className="md:col-span-3 flex flex-col gap-6">
          <section className="rounded-xl p-6 bg-[#0a0e16] border border-[#434752]">
            <h2 className="text-xs font-mono text-[#c3c6d4] uppercase tracking-wider mb-6 flex items-center justify-between font-bold">
              Trending Discussions
              <span className="material-symbols-outlined text-[18px] text-[#85da76]">trending_up</span>
            </h2>
            <div className="space-y-6">
              <div className="group cursor-pointer">
                <h4 className="text-[#dfe2ed] text-xs font-semibold group-hover:text-[#aec6ff] transition-colors leading-snug">
                  The future of Serverless in 2026: Predictions and Pitfalls
                </h4>
                <div className="flex items-center gap-4 mt-2 font-mono text-[11px] text-[#8d909d]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">chat_bubble</span> 156
                  </span>
                  <span>4h ago</span>
                </div>
              </div>

              <div className="group cursor-pointer">
                <h4 className="text-[#dfe2ed] text-xs font-semibold group-hover:text-[#aec6ff] transition-colors leading-snug">
                  Why I'm switching from TypeScript back to JSDoc for some projects
                </h4>
                <div className="flex items-center gap-4 mt-2 font-mono text-[11px] text-[#8d909d]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">chat_bubble</span> 89
                  </span>
                  <span>2h ago</span>
                </div>
              </div>

              <div className="group cursor-pointer">
                <h4 className="text-[#dfe2ed] text-xs font-semibold group-hover:text-[#aec6ff] transition-colors leading-snug">
                  Best practices for securing microservices in a Kubernetes cluster
                </h4>
                <div className="flex items-center gap-4 mt-2 font-mono text-[11px] text-[#8d909d]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">chat_bubble</span> 42
                  </span>
                  <span>8h ago</span>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={e => {
              e.preventDefault();
              setShowCreateModal(false);
              setCommunityName('');
              setCommunityDesc('');
            }}
            className="bg-[#181c24] border border-[#434752] rounded-2xl max-w-md w-full p-6 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-[#434752] pb-2">
              <h3 className="text-lg font-bold text-[#dfe2ed]">Create New Community</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-[#8d909d]">✕</button>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#8d909d]">Community Name</label>
              <input
                type="text"
                placeholder="e.g., Kubernetes Architects"
                value={communityName}
                onChange={e => setCommunityName(e.target.value)}
                className="w-full bg-[#0f131b] border border-[#434752] text-[#dfe2ed] text-xs rounded-lg p-2.5 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#8d909d]">Description</label>
              <textarea
                placeholder="Describe your community focus..."
                value={communityDesc}
                onChange={e => setCommunityDesc(e.target.value)}
                className="w-full h-24 bg-[#0f131b] border border-[#434752] text-[#dfe2ed] text-xs rounded-lg p-2.5 focus:outline-none resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#628fea] text-white font-bold text-xs cursor-pointer"
            >
              Launch Community
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
