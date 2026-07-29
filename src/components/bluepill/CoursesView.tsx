import React, { useState } from 'react';
import { Discipline, Course } from '../../types/course';
import { MOCK_COURSES } from '../../data/coursesData';
import { getCourseOverallProgress } from '../../services/courseProgressService';
import CourseCard from './CourseCard';
import CoursePlayerView from './CoursePlayerView';
import {
  Code,
  Brain,
  Terminal,
  Smartphone,
  Shield,
  Palette,
  Database,
  Layers,
  PlayCircle,
  Bookmark,
  History,
  Award,
  Sparkles,
} from 'lucide-react';

export default function CoursesView() {
  // Discipline Category Filter State ('All' or specific discipline)
  const [activeCategory, setActiveCategory] = useState<Discipline | 'All'>('All');

  // Currently Selected Course for Video Player View
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // List of disciplines with icons and labels
  const disciplines: { name: Discipline; label: string; icon: React.ReactNode; color: string }[] = [
    { name: 'Web', label: 'Web Dev', icon: <Code className="w-5 h-5" />, color: 'text-blue-400' },
    { name: 'AI/ML', label: 'AI & ML', icon: <Brain className="w-5 h-5" />, color: 'text-purple-400' },
    { name: 'CP', label: 'Comp. Prog', icon: <Terminal className="w-5 h-5" />, color: 'text-orange-400' },
    { name: 'Mobile', label: 'Mobile App', icon: <Smartphone className="w-5 h-5" />, color: 'text-emerald-400' },
    { name: 'Cyber', label: 'Cyber Sec', icon: <Shield className="w-5 h-5" />, color: 'text-red-400' },
    { name: 'UI/UX', label: 'UI & UX', icon: <Palette className="w-5 h-5" />, color: 'text-pink-400' },
    { name: 'Data Science', label: 'Data Sci', icon: <Database className="w-5 h-5" />, color: 'text-sky-400' },
    { name: 'DevOps', label: 'DevOps & Cloud', icon: <Layers className="w-5 h-5" />, color: 'text-teal-400' },
  ];

  // Filter courses by active category
  const filteredCourses =
    activeCategory === 'All'
      ? MOCK_COURSES
      : MOCK_COURSES.filter((c) => c.discipline === activeCategory);

  // Filter courses that have progress started for "Continue Watching" sidebar
  const inProgressCourses = MOCK_COURSES.map((c) => ({
    course: c,
    progress: getCourseOverallProgress(c),
  })).filter((item) => item.progress.progressPercentage > 0);

  // If a course is selected, render the Coaching Institute Video Learning View
  if (selectedCourse) {
    return (
      <CoursePlayerView
        course={selectedCourse}
        onBackToCatalog={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <div className="py-8 px-4 md:px-8 max-w-[1400px] mx-auto text-[#dfe2ed] space-y-8">
      {/* Header Banner */}
      <div className="bg-[#181c24] border border-[#434752] rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#aec6ff] uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#aec6ff]" />
            <span>Coaching-Institute Video Learning Hub</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Master Software Engineering Disciplines
          </h1>
          <p className="text-xs md:text-sm text-[#9ea3b5] leading-relaxed">
            Select a discipline below to explore video courses, track your watched progress automatically, and resume video playback anytime.
          </p>
        </div>

        {/* Quick Progress Badge */}
        <div className="bg-[#141820] border border-[#434752] p-4 rounded-xl flex items-center gap-4 shrink-0 relative z-10">
          <div className="w-12 h-12 rounded-full bg-[#aec6ff]/20 text-[#aec6ff] flex items-center justify-center font-mono font-bold text-sm border border-[#aec6ff]/40">
            {inProgressCourses.length}
          </div>
          <div>
            <div className="text-xs font-bold text-white">Active Courses</div>
            <div className="text-[11px] font-mono text-[#8d909d]">In Progress</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left / Main Section: Disciplines Filter & Course Cards */}
        <section className="col-span-12 xl:col-span-9 space-y-8">
          {/* Discipline Navigation Bar */}
          <div className="bg-[#181c24] border border-[#434752] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-bold text-[#dfe2ed] tracking-wider font-mono">
                Filter by Discipline
              </h3>
              {activeCategory !== 'All' && (
                <button
                  onClick={() => setActiveCategory('All')}
                  className="text-[#aec6ff] text-xs font-mono font-bold hover:underline cursor-pointer"
                >
                  Show All ({MOCK_COURSES.length})
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {disciplines.map((disc) => {
                const isActive = activeCategory === disc.name;
                return (
                  <button
                    key={disc.name}
                    onClick={() => setActiveCategory(isActive ? 'All' : disc.name)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-[#aec6ff]/20 border-[#aec6ff] text-white shadow-md'
                        : 'bg-[#141820] border-[#434752]/60 hover:border-[#aec6ff]/50 hover:bg-[#1e2430] text-[#c3c6d4]'
                    }`}
                  >
                    <div className={`${disc.color} mb-1.5 transition-transform group-hover:scale-110`}>
                      {disc.icon}
                    </div>
                    <span className="text-xs font-semibold text-center truncate w-full">
                      {disc.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Courses List Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{activeCategory === 'All' ? 'All Video Courses' : `${activeCategory} Courses`}</span>
                <span className="text-xs font-mono text-[#8d909d] px-2 py-0.5 bg-[#181c24] border border-[#434752] rounded-full">
                  {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'}
                </span>
              </h2>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onSelectCourse={(c) => setSelectedCourse(c)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Right Sidebar: My Learning & Progress Summary */}
        <aside className="col-span-12 xl:col-span-3 space-y-6">
          <div className="bg-[#181c24] border border-[#434752] rounded-xl p-6 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-[#aec6ff]" />
              <span>My Learning</span>
            </h3>

            {/* Continue Watching Section */}
            <div className="space-y-4">
              <p className="text-[11px] font-mono text-[#8d909d] uppercase tracking-wider">
                In Progress Courses
              </p>

              {inProgressCourses.length > 0 ? (
                <div className="space-y-4">
                  {inProgressCourses.map(({ course, progress }) => (
                    <div
                      key={course.id}
                      onClick={() => setSelectedCourse(course)}
                      className="group cursor-pointer p-3 bg-[#141820] hover:bg-[#1f2430] border border-[#434752] hover:border-[#aec6ff]/50 rounded-lg transition-all space-y-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-12 h-12 rounded-md object-cover border border-[#434752] group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-[#dfe2ed] group-hover:text-[#aec6ff] truncate transition-colors">
                            {course.title}
                          </h4>
                          <p className="text-[10px] font-mono text-[#8d909d]">
                            {course.discipline}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-[#c3c6d4] font-mono">
                          <span>
                            {progress.completedLessonsCount}/{progress.totalLessonsCount} Completed
                          </span>
                          <span className="text-[#aec6ff] font-bold">
                            {progress.progressPercentage}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-[#31353d] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#aec6ff] rounded-full"
                            style={{ width: `${progress.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-[#141820] border border-[#434752]/50 rounded-lg text-center space-y-1">
                  <p className="text-xs text-[#c3c6d4] font-medium">No active courses yet</p>
                  <p className="text-[11px] text-[#8d909d]">
                    Pick any course to start watching videos and tracking progress.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Links List */}
            <div className="pt-4 border-t border-[#434752]">
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-[#c3c6d4] hover:text-[#aec6ff] transition-colors cursor-pointer text-xs font-semibold">
                  <Bookmark className="w-4 h-4 text-[#aec6ff]" />
                  <span>Saved Playlists</span>
                </li>
                <li className="flex items-center gap-3 text-[#c3c6d4] hover:text-[#aec6ff] transition-colors cursor-pointer text-xs font-semibold">
                  <History className="w-4 h-4 text-[#aec6ff]" />
                  <span>Video Watch History</span>
                </li>
                <li className="flex items-center gap-3 text-[#c3c6d4] hover:text-[#aec6ff] transition-colors cursor-pointer text-xs font-semibold">
                  <Award className="w-4 h-4 text-[#aec6ff]" />
                  <span>Certifications</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#aec6ff]/10 p-4 rounded-lg border border-[#aec6ff]/20 space-y-1">
              <p className="text-xs font-bold text-[#aec6ff]">PRO TIP</p>
              <p className="text-xs text-[#c3c6d4] leading-relaxed">
                Your video playback timestamp is saved automatically. Resume playback from any device seamlessly.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
