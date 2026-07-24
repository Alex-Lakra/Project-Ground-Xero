import React, { useState } from 'react';

export default function ProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState(
    'Junior Developer @ Stanford | Building open-source tools. Passionate about low-level optimization and distributed systems. Currently exploring the intersection of Rust and WebAssembly.'
  );

  return (
    <div className="py-8 px-6 md:px-8 max-w-[1200px] mx-auto text-[#dfe2ed]">
      {/* User Header Section */}
      <section className="flex flex-col md:flex-row items-start gap-8 mb-12">
        <div className="relative group">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-2 border-[#31353d] bg-[#1c2028] shadow-xl">
            <img
              className="w-full h-full object-cover"
              alt="Alex Rivera Avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNJjdAcaD3_vXCJSBAanE4ZJmI3q49pSCANdVk8Pqg5TovP-ZnN8Upbs_5gLPDcVDM16V3QVI-Irwem3lHDT-6GbMWLRzevE-Azi7o1B2BQcofXjcwfGjIkOJ76GRcVpPuvSam-xv0oYl-tYDR8ImZ0KsyKzE_NtcG1NdQN5ycDrdjYglpmhPuV4QzspdYk66V2y9rg3_FXufZPn4VOZiX1ElFyDkzLAlEdnQfC65svlUfDBENg82HHF6p4eitxKkWMairpDsYUzI"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#85da76] p-1.5 rounded-lg border-4 border-[#0f131b] shadow-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-[#003a02] text-[20px]">verified</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#dfe2ed]">Alex Rivera</h1>
              <p className="text-sm font-mono text-[#aec6ff]">@rivera_codes</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mt-4 font-mono text-xs">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#8d909d]">Full Name</span>
                  <span className="text-[#dfe2ed]">Alex Rivera</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#8d909d]">Gender</span>
                  <span className="text-[#dfe2ed]">Male</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#8d909d]">Current CGPA</span>
                  <span className="text-[#85da76] font-bold">3.85 / 4.0</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#8d909d]">Semester</span>
                  <span className="text-[#dfe2ed]">6th Semester</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#8d909d]">Academic Year</span>
                  <span className="text-[#dfe2ed]">Junior Year</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#8d909d]">Email</span>
                  <span className="text-[#dfe2ed]">alex.rivera@stanford.edu</span>
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

          <div className="flex flex-wrap gap-3 pt-2 font-mono text-xs">
            <a className="flex items-center gap-2 px-4 py-2 bg-[#181c24] border border-[#31353d] rounded-full text-[#c3c6d4] hover:text-[#aec6ff] hover:border-[#aec6ff] transition-all" href="#">
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              <span>GitHub</span>
            </a>
            <a className="flex items-center gap-2 px-4 py-2 bg-[#181c24] border border-[#31353d] rounded-full text-[#c3c6d4] hover:text-[#aec6ff] hover:border-[#aec6ff] transition-all" href="#">
              <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
              <span>Twitter</span>
            </a>
            <a className="flex items-center gap-2 px-4 py-2 bg-[#181c24] border border-[#31353d] rounded-full text-[#c3c6d4] hover:text-[#aec6ff] hover:border-[#aec6ff] transition-all" href="#">
              <span className="material-symbols-outlined text-[18px]">work</span>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

      {/* Projects & Tech Stack / Achievements Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-xl font-bold text-[#dfe2ed]">Recent Projects</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#181c24] border border-[#31353d] rounded-xl p-5 space-y-4 hover:border-[#aec6ff]/50 transition-all group">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="px-2.5 py-0.5 bg-[#31353d] text-[#c3c6d4] rounded">source</span>
                <span className="material-symbols-outlined text-[#8d909d] group-hover:text-[#aec6ff]">open_in_new</span>
              </div>
              <h4 className="text-base font-bold text-[#dfe2ed]">Hermes Queue</h4>
              <p className="text-xs text-[#c3c6d4] leading-relaxed">
                A lightweight, distributed message broker written in Rust for high-throughput microservices.
              </p>
              <div className="flex gap-1.5 font-mono text-[10px]">
                <span className="px-2 py-0.5 bg-[#31353d] text-[#c3c6d4] rounded">RUST</span>
                <span className="px-2 py-0.5 bg-[#31353d] text-[#c3c6d4] rounded">GRPC</span>
              </div>
            </div>

            <div className="bg-[#181c24] border border-[#31353d] rounded-xl p-5 space-y-4 hover:border-[#aec6ff]/50 transition-all group">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="px-2.5 py-0.5 bg-[#85da76]/20 text-[#85da76] rounded">analytics</span>
                <span className="material-symbols-outlined text-[#8d909d] group-hover:text-[#aec6ff]">open_in_new</span>
              </div>
              <h4 className="text-base font-bold text-[#dfe2ed]">DevMetrics Dashboard</h4>
              <p className="text-xs text-[#c3c6d4] leading-relaxed">
                Real-time developer productivity visualization with TypeScript and D3.js integration.
              </p>
              <div className="flex gap-1.5 font-mono text-[10px]">
                <span className="px-2 py-0.5 bg-[#31353d] text-[#c3c6d4] rounded">TYPESCRIPT</span>
                <span className="px-2 py-0.5 bg-[#31353d] text-[#c3c6d4] rounded">REACT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack & Achievements */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tech Stack */}
          <div className="bg-[#181c24] border border-[#31353d] rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[#dfe2ed]">Tech Stack</h3>
            <div className="grid grid-cols-3 gap-3 font-mono text-center">
              {[
                { name: 'REACT', icon: 'deployed_code' },
                { name: 'TS', icon: 'code' },
                { name: 'GO', icon: 'api' },
                { name: 'RUST', icon: 'settings_slow' },
                { name: 'POSTGRES', icon: 'database' },
                { name: 'DOCKER', icon: 'circle' }
              ].map(tech => (
                <div key={tech.name} className="p-3 bg-[#0f131b] border border-[#31353d] rounded-lg flex flex-col items-center justify-center space-y-1">
                  <span className="material-symbols-outlined text-[#aec6ff] text-[20px]">{tech.icon}</span>
                  <span className="text-[10px] text-[#c3c6d4]">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-[#181c24] border border-[#31353d] rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[#dfe2ed]">Achievements</h3>
            <div className="space-y-3">
              <div className="p-3 bg-[#0f131b] border border-[#31353d] rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-[#aec6ff] text-2xl">workspace_premium</span>
                <div>
                  <h5 className="text-xs font-bold text-[#dfe2ed]">Top Contributor</h5>
                  <p className="text-[10px] text-[#8d909d] font-mono">2024</p>
                </div>
              </div>

              <div className="p-3 bg-[#0f131b] border border-[#31353d] rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-[#85da76] text-2xl">bug_report</span>
                <div>
                  <h5 className="text-xs font-bold text-[#dfe2ed]">Beta Tester</h5>
                  <p className="text-[10px] text-[#8d909d] font-mono">Project X Core Team</p>
                </div>
              </div>

              <div className="p-3 bg-[#0f131b] border border-[#31353d] rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-[#ffb86a] text-2xl">local_fire_department</span>
                <div>
                  <h5 className="text-xs font-bold text-[#dfe2ed]">7 Day Streak</h5>
                  <p className="text-[10px] text-[#8d909d] font-mono">Habits</p>
                </div>
              </div>
            </div>

            <button className="w-full py-2 border border-[#31353d] text-[#c3c6d4] text-xs font-bold rounded-lg hover:bg-[#262a32] transition-colors cursor-pointer">
              View All 12 Badges
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
