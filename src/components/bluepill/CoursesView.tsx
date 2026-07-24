import React, { useState } from 'react';

export default function CoursesView() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const courses = [
    {
      id: 1,
      title: 'React 19 Deep Dive',
      lessons: '18 Lessons',
      duration: '12h 45m',
      price: '$89.00',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
      category: 'Web'
    },
    {
      id: 2,
      title: 'Advanced SQL Performance',
      lessons: '24 Lessons',
      duration: '15h 20m',
      price: '$75.00',
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
      category: 'Data Science'
    },
    {
      id: 3,
      title: 'Cloud Native Architecture',
      lessons: '32 Lessons',
      duration: '22h 10m',
      price: '$120.00',
      image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80',
      category: 'DevOps'
    },
    {
      id: 4,
      title: 'Security-First Development',
      lessons: '14 Lessons',
      duration: '10h 30m',
      price: '$99.00',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
      category: 'Cyber'
    }
  ];

  return (
    <div className="py-8 px-6 md:px-8 max-w-[1200px] mx-auto text-[#dfe2ed]">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar: My Learning */}
        <aside className="col-span-12 xl:col-span-3 space-y-6">
          <div className="bg-[#181c24] border border-[#434752] rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#dfe2ed] mb-6">My Learning</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-mono text-[#8d909d] uppercase mb-3">Continue Watching</p>
                <div className="group cursor-pointer">
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-3 border border-[#434752]">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt="Microservices with Go"
                      src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white text-4xl">play_circle</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors">
                    Microservices with Go
                  </h4>
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-[#c3c6d4] mb-1 font-mono">
                      <span>45% Complete</span>
                      <span>12/28 Lessons</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#31353d] rounded-full overflow-hidden">
                      <div className="h-full bg-[#aec6ff]" style={{ width: '45%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#434752]">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-[#c3c6d4] hover:text-[#aec6ff] transition-colors cursor-pointer text-sm">
                    <span className="material-symbols-outlined text-[20px]">bookmark</span>
                    <span>Saved Courses</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#c3c6d4] hover:text-[#aec6ff] transition-colors cursor-pointer text-sm">
                    <span className="material-symbols-outlined text-[20px]">history</span>
                    <span>Learning History</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#c3c6d4] hover:text-[#aec6ff] transition-colors cursor-pointer text-sm">
                    <span className="material-symbols-outlined text-[20px]">verified</span>
                    <span>Certifications</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-[#628fea]/10 p-4 rounded-lg border border-[#628fea]/20 space-y-1">
              <p className="text-xs font-bold text-[#aec6ff]">PRO TIP</p>
              <p className="text-xs text-[#c3c6d4] leading-relaxed">
                Complete your weekly goal of 5 hours to unlock the 'Systems Architect' badge.
              </p>
            </div>
          </div>
        </aside>

        {/* Center Column: Course Discovery */}
        <section className="col-span-12 xl:col-span-6 space-y-8">
          {/* Explore Disciplines */}
          <div className="bg-[#181c24] border border-[#434752] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase font-bold text-[#dfe2ed] tracking-wider">Explore Disciplines</h3>
              <button onClick={() => setActiveCategory(null)} className="text-[#aec6ff] text-xs font-medium hover:underline">
                View All
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'Web', icon: 'language', color: 'text-[#3b82f6]' },
                { name: 'AI/ML', icon: 'psychology', color: 'text-[#a855f7]' },
                { name: 'CP', icon: 'code_blocks', color: 'text-[#f97316]' },
                { name: 'Mobile', icon: 'smartphone', color: 'text-[#22c55e]' },
                { name: 'Cyber', icon: 'shield', color: 'text-[#ef4444]' },
                { name: 'UI/UX', icon: 'palette', color: 'text-[#ec4899]' },
                { name: 'Data Science', icon: 'database', color: 'text-[#0ea5e9]' },
                { name: 'DevOps', icon: 'terminal', color: 'text-[#10b981]' }
              ].map(disc => (
                <div
                  key={disc.name}
                  onClick={() => setActiveCategory(activeCategory === disc.name ? null : disc.name)}
                  className={`flex flex-col items-center justify-center aspect-square rounded-lg transition-colors cursor-pointer group border border-[#434752]/50 p-2 w-full mx-auto ${
                    activeCategory === disc.name ? 'bg-[#628fea]/20 border-[#aec6ff]' : 'bg-[#31353d] hover:bg-[#628fea]/10'
                  }`}
                >
                  <span className={`material-symbols-outlined ${disc.color} mb-1 text-[20px]`}>{disc.icon}</span>
                  <span className="text-[11px] font-medium text-[#c3c6d4] group-hover:text-[#aec6ff]">{disc.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Latest for You */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#dfe2ed]">Latest for You</h3>
              <a className="text-[#aec6ff] text-sm font-medium hover:underline" href="#">View all</a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses
                .filter(c => !activeCategory || c.category === activeCategory)
                .map(course => (
                  <div
                    key={course.id}
                    className="bg-[#181c24] border border-[#434752] rounded-xl overflow-hidden group cursor-pointer transition-all hover:border-[#aec6ff]/50"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={course.image}
                        alt={course.title}
                      />
                      <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-white font-medium">
                        {course.lessons}
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-base font-bold text-[#dfe2ed] mb-2 group-hover:text-[#aec6ff] transition-colors">
                        {course.title}
                      </h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#c3c6d4]">
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          <span className="text-xs font-mono">{course.duration}</span>
                        </div>
                        <span className="text-[#aec6ff] font-bold text-sm">{course.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Right Sidebar: Mentors */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-[#181c24] border border-[#434752] rounded-xl p-6">
            <h3 className="text-xs font-bold mb-4 text-[#dfe2ed] uppercase tracking-wider">Mentors</h3>
            <div className="space-y-4">
              {[
                { name: 'Sarah Drasner', rating: '4.98', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRX2JhuTYZPRRIGmy1hEg6P9faNRSLGzv66IInrDcb2IZXzR7Eeu6IzGFbuYc40jNZ6gRnqX3eT6d0ebVeBH-wVadSRfH4nPh1KcypYUOdKHjGErZ91A87sgPn01Q3WE2sP8c2VMgF3PMos1v0OB06OgIsX2dKVSF57PZ1A0j0t3ABL2aZOsnJIC6oeSPyCpCCTJHpUOPwq3ZrvduLDdzb_LHwBnfN58cdJb-iEK2-WB3F6WEKT19IdDLTzpn-nuZyjalM_lfjmuc' },
                { name: 'Hitesh Choudhary', rating: '4.95', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsIm8zQUcnZvFyWoTS2tOHj356JHIeW1JgDDscLLRhv82BlAHh1wNMqQyw5HDxNfm8EinsiQ4kPSf4m8R2NA4jfpf--TrL8XAugnXqdBTLdTd2SVTaKeKqUtsINe4Kr00V7Eq7q9yIODpo8S4_J1YR2l2GcPeSHUSc33_nnBqKRAHZaCe9VRm3OlzzfPxj-mxRoEkrlFyuLyTBb2iTtIM4Ico-pGypeyYpItNROsPWxRSbLGzUZP0eX5VcsVKvHoqaLzhL1PLVs1A' },
                { name: 'Kelsey Hightower', rating: '4.92', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeb8P8_iz7PlatQEhuq1kwAnev_qQXtr-SwCfNDeZNOefR6kTDBpgGCqw66PCnqACLw1m56nqw-3nQURLOQHN9Z-SUmcjGGX9GaHAZ44k2Xw-j3HVM4b08bpARfLaYhUBp4VckKzccc_EEC_2WgSsNKDn-cM88paTUrrf9bA464wTt1lvAzbw2lolLpkzSKa8a1E25n37QGRuoeZpXM2kPRBe3uvC56qRf8-HrgDRAK6nz8fFIGJ8NWvJUrVRlZu6U96PIv0wrs0U' }
              ].map(mentor => (
                <div key={mentor.name} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <img className="w-8 h-8 rounded-full object-cover" src={mentor.avatar} alt={mentor.name} />
                    <span className="text-xs text-[#c3c6d4] group-hover:text-[#aec6ff] transition-colors">{mentor.name}</span>
                  </div>
                  <span className="text-[#aec6ff] text-xs font-bold font-mono">{mentor.rating}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 border border-[#434752] rounded-lg text-xs font-bold text-[#c3c6d4] hover:bg-[#31353d] transition-colors cursor-pointer">
              View Directory
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
