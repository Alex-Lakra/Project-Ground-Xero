import React, { useState, useEffect } from 'react';
import { useCourses, Course, Lesson, Resource, DiscussionComment } from '../../services/courseService';
import { firebaseDb } from '../../services/firebaseDb';

export type { Course, Lesson, Resource, DiscussionComment };

export default function CoursesView() {
  // ==========================================
  // Data Access Hook (Dynamic Courses & Category Filter)
  // ==========================================
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const {
    courses,
    filteredCourses,
    savedCourseIds,
    toggleLessonComplete,
    toggleSaveCourse,
    isSavedCourse,
    getCourseProgress,
  } = useCourses(activeCategory, 'root');

  // Playback Navigation State (null = Catalog View, Course = Video Playback View)
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string>('');
  
  // Video Player HUD Controls State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(70);

  // Video Playback Content Active Tab: 'overview' | 'resources' | 'discussion'
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'discussion'>('overview');

  // New Comment Input state
  const [newComment, setNewComment] = useState<string>('');

  // Synchronize activeCourse reference when courses list updates in background
  useEffect(() => {
    if (activeCourse) {
      const updated = courses.find(c => c.id === activeCourse.id);
      if (updated) {
        setActiveCourse(updated);
      }
    }
  }, [courses]);

  // Find active lesson object
  const activeLesson: Lesson | undefined = activeCourse?.lessons.find(l => l.id === activeLessonId) || activeCourse?.lessons[0];

  // Automatically fetch video metadata from YouTube oEmbed & save/cache to Firebase DB
  useEffect(() => {
    if (!activeCourse || !activeLesson) return;
    let isMounted = true;

    async function autoFetchAndSaveVideoMeta() {
      const vid = activeLesson?.videoId || 'CYtO1q6zfgA';
      const meta = await firebaseDb.fetchAndSaveVideoMetadata(vid);
      if (meta && meta.title && isMounted) {
        setActiveCourse(prev => {
          if (!prev) return null;
          const updatedLessons = prev.lessons.map(l =>
            l.id === activeLessonId ? { ...l, title: meta.title } : l
          );
          return {
            ...prev,
            instructor: {
              ...prev.instructor,
              name: meta.authorName || prev.instructor.name,
            },
            lessons: updatedLessons,
          };
        });
      }
    }

    autoFetchAndSaveVideoMeta();
    return () => {
      isMounted = false;
    };
  }, [activeCourse?.id, activeLessonId, activeLesson?.videoId]);

  // Switch to Video Playback view
  const handleOpenPlayback = (course: Course, lessonId?: string) => {
    setActiveCourse(course);
    const targetLesson = lessonId || course.lessons.find(l => !l.completed)?.id || course.lessons[0]?.id || '';
    setActiveLessonId(targetLesson);
    setIsPlaying(true);
    setActiveTab('overview');
  };

  // Return to Catalog View
  const handleBackToCatalog = () => {
    setActiveCourse(null);
    setIsPlaying(false);
  };

  // Toggle completion status of active or specific lesson
  const handleToggleLessonComplete = (courseId: string, lessonId: string) => {
    toggleLessonComplete(courseId, lessonId);
  };

  // Toggle saving/bookmarking a course
  const handleToggleSaveCourse = (courseId: string) => {
    toggleSaveCourse(courseId);
  };

  // Post a new comment to active course discussion
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activeCourse) return;

    const commentObj: DiscussionComment = {
      id: Date.now().toString(),
      author: 'You (Citizen Operator)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      time: 'Just now',
      comment: newComment.trim(),
    };

    const updatedDiscussions = [commentObj, ...(activeCourse.discussions || [])];
    
    setActiveCourse(prev => prev ? { ...prev, discussions: updatedDiscussions } : null);
    setNewComment('');
  };

  // ==========================================
  // VIEW STATE 2: VIDEO PLAYBACK PAGE VIEW
  // ==========================================
  if (activeCourse && activeLesson) {
    const completedCount = activeCourse.lessons.filter(l => l.completed).length;
    const totalLessons = activeCourse.lessons.length;
    const isCurrentLessonCompleted = activeLesson.completed;
    const currentVideoId = activeLesson.videoId || 'CYtO1q6zfgA';

    return (
      <div className="bg-[#0F1117] min-h-screen text-[#dfe2ed] font-body-md antialiased select-none pb-12">
        
        {/* Top Breadcrumb & Quick Action Bar */}
        <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-4 pb-2">
          <button
            onClick={handleBackToCatalog}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-medium cursor-pointer group"
          >
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform" data-icon="arrow_back">arrow_back</span>
            <span>Return to Course Catalog</span>
          </button>
        </div>

        {/* Main Content Area: Left Column (Video & Tabs) + Right Column (Playlist) */}
        <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex flex-col lg:flex-row gap-gutter">
          
          {/* Left Column: Video & Details (lg:w-2/3) */}
          <div className="flex-grow flex flex-col gap-gutter lg:w-2/3">
            
            {/* Video Player Box with YouTube No-Cookie Embed */}
            <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-lg relative group video-container aspect-video">
              {isPlaying ? (
                <iframe
                  title={activeLesson.title}
                  src={`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&enablejsapi=1&rel=0`}
                  className="w-full h-full aspect-video border-0 rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <>
                  <img
                    alt={activeLesson.title}
                    className="w-full h-full object-cover"
                    src={activeLesson.videoThumbnail || `https://i.ytimg.com/vi/${currentVideoId}/hqdefault.jpg`}
                  />
                  
                  {/* Play / Pause Centered Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div
                      onClick={() => setIsPlaying(true)}
                      className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center cursor-pointer pointer-events-auto hover:bg-primary transition-colors shadow-lg"
                    >
                      <span
                        className="material-symbols-outlined text-on-primary-container text-4xl ml-0.5 select-none"
                        data-icon="play_arrow"
                      >
                        play_arrow
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Controls Bar */}
              <div className="video-controls opacity-0 transition-opacity duration-300 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col gap-2 z-10">
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-surface-variant rounded-full cursor-pointer relative overflow-hidden group/progress">
                  <div className="absolute top-0 left-0 h-full bg-primary progress-filled group-hover/progress:bg-primary-fixed transition-colors"></div>
                </div>
                
                <div className="flex justify-between items-center text-on-surface">
                  <div className="flex items-center gap-4">
                    <span
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors text-2xl"
                      data-icon={isPlaying ? 'pause' : 'play_arrow'}
                    >
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                    
                    {/* Volume Slider & Toggle */}
                    <div className="flex items-center gap-2 group/volume cursor-pointer">
                      <span
                        onClick={() => setIsMuted(!isMuted)}
                        className="material-symbols-outlined hover:text-primary transition-colors"
                        data-icon={isMuted ? 'volume_off' : 'volume_up'}
                      >
                        {isMuted ? 'volume_off' : 'volume_up'}
                      </span>
                      <div className="w-0 group-hover/volume:w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden transition-all duration-300 relative">
                        <div
                          className="absolute top-0 left-0 h-full bg-primary"
                          style={{ width: isMuted ? '0%' : `${volume}%` }}
                        />
                      </div>
                    </div>

                    <span className="font-mono-code text-mono-code text-on-surface-variant ml-2">
                      04:15 / {activeLesson.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-label-sm text-label-sm font-bold bg-surface-variant px-1.5 py-0.5 rounded text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors">
                      1080p
                    </span>
                    <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors" data-icon="closed_caption">
                      closed_caption
                    </span>
                    <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors" data-icon="fullscreen">
                      fullscreen
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Title & Action Buttons Bar */}
            <div className="flex flex-col gap-4 pb-6 border-b border-outline-variant">
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                {activeCourse.title}: {activeLesson.title}
              </h1>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img
                    alt={activeCourse.instructor.name}
                    className="w-10 h-10 rounded-full border border-outline-variant object-cover"
                    src={activeCourse.instructor.avatar}
                  />
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm text-on-surface font-medium">
                      {activeCourse.instructor.name}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {activeCourse.instructor.role}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {/* Save Button */}
                  <button
                    onClick={() => handleToggleSaveCourse(activeCourse.id)}
                    className={`font-label-md text-label-md px-4 py-2 rounded-lg border border-outline-variant transition-colors flex items-center gap-2 cursor-pointer ${
                      isSavedCourse(activeCourse.id) ? 'bg-primary-container text-on-primary-container border-primary' : 'bg-surface-variant hover:bg-surface-bright text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm" data-icon={isSavedCourse(activeCourse.id) ? 'bookmark_added' : 'bookmark'}>
                      {isSavedCourse(activeCourse.id) ? 'bookmark_added' : 'bookmark'}
                    </span>
                    <span>{isSavedCourse(activeCourse.id) ? 'Saved' : 'Save'}</span>
                  </button>

                  {/* Mark Complete Button */}
                  <button
                    onClick={() => handleToggleLessonComplete(activeCourse.id, activeLesson.id)}
                    className={`font-label-md text-label-md px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm ${
                      isCurrentLessonCompleted
                        ? 'bg-secondary hover:bg-secondary-fixed text-on-secondary font-bold'
                        : 'bg-primary hover:bg-primary-fixed text-on-primary font-medium'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm" data-icon="check_circle">
                      check_circle
                    </span>
                    <span>{isCurrentLessonCompleted ? 'Completed' : 'Mark Complete'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content Tabs Header & View Panel */}
            <div className="flex flex-col gap-6">
              
              {/* Tab Header Buttons */}
              <div className="flex gap-6 border-b border-outline-variant">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`font-label-md text-label-md pb-2 font-medium transition-colors cursor-pointer ${
                    activeTab === 'overview'
                      ? 'text-primary border-b-2 border-primary font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`font-label-md text-label-md pb-2 transition-colors cursor-pointer ${
                    activeTab === 'resources'
                      ? 'text-primary border-b-2 border-primary font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Resources ({(activeCourse.resources || []).length})
                </button>
                <button
                  onClick={() => setActiveTab('discussion')}
                  className={`font-label-md text-label-md pb-2 transition-colors cursor-pointer ${
                    activeTab === 'discussion'
                      ? 'text-primary border-b-2 border-primary font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Discussion ({(activeCourse.discussions || []).length})
                </button>
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="prose prose-invert max-w-none font-body-sm text-body-sm text-on-surface-variant flex flex-col gap-4">
                  <p>{activeLesson.overview?.description}</p>
                  
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mt-2 font-bold">Key Takeaways:</h3>
                  <ul className="list-disc pl-5 flex flex-col gap-2">
                    {(activeLesson.overview?.takeaways || []).map((takeaway, idx) => (
                      <li key={idx}>{takeaway}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* TAB 2: RESOURCES */}
              {activeTab === 'resources' && (
                <div className="flex flex-col gap-3">
                  {(activeCourse.resources || []).length > 0 ? (
                    activeCourse.resources.map(res => (
                      <div key={res.id} className="bg-surface-container-low border border-outline-variant p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary text-2xl" data-icon="description">description</span>
                          <div>
                            <span className="font-body-sm text-body-sm font-medium text-on-surface block">{res.title}</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">{res.type} • {res.size}</span>
                          </div>
                        </div>
                        <button className="bg-surface-variant hover:bg-surface-bright text-primary font-label-sm text-label-sm px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm" data-icon="download">download</span> Download
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-on-surface-variant text-sm py-4">No additional downloadable resources attached to this course module.</p>
                  )}
                </div>
              )}

              {/* TAB 3: DISCUSSION */}
              {activeTab === 'discussion' && (
                <div className="flex flex-col gap-6">
                  {/* New Comment Input */}
                  <form onSubmit={handleAddComment} className="flex flex-col gap-3 bg-surface-container-low border border-outline-variant p-4 rounded-xl">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Ask a technical question or share insights about this lesson..."
                      rows={3}
                      className="bg-surface-variant text-on-surface border border-outline-variant p-3 rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="bg-primary hover:bg-primary-fixed text-on-primary disabled:opacity-50 font-label-md text-label-md px-4 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        Post Comment
                      </button>
                    </div>
                  </form>

                  {/* Comment List */}
                  <div className="flex flex-col gap-4">
                    {(activeCourse.discussions || []).length > 0 ? (
                      activeCourse.discussions.map(disc => (
                        <div key={disc.id} className="bg-surface-container-low border border-outline-variant p-4 rounded-xl flex gap-3">
                          <img src={disc.avatar} alt={disc.author} className="w-9 h-9 rounded-full object-cover border border-outline-variant" />
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-body-sm text-body-sm text-on-surface font-semibold">{disc.author}</span>
                              <span className="font-label-sm text-label-sm text-on-surface-variant">• {disc.time}</span>
                            </div>
                            <p className="text-sm text-on-surface-variant leading-relaxed">{disc.comment}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-on-surface-variant text-sm py-2">No discussions yet. Be the first citizen to comment!</p>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Playlist (lg:w-1/3) */}
          <aside className="lg:w-1/3 flex flex-col gap-4">
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col h-[calc(100vh-10rem)] sticky top-24">
              
              {/* Playlist Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline-md text-headline-md text-on-surface">Course Content</h2>
                <span className="font-label-sm text-label-sm bg-surface-variant px-2 py-1 rounded-full text-on-surface-variant font-mono-code">
                  {completedCount}/{totalLessons} Completed
                </span>
              </div>

              {/* Playlist Items List */}
              <div className="overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-2">
                {activeCourse.lessons.map(lesson => {
                  const isCurrent = lesson.id === activeLessonId;
                  const isCompleted = lesson.completed;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => {
                        setActiveLessonId(lesson.id);
                        setIsPlaying(true);
                      }}
                      className={`flex gap-3 p-3 rounded-lg transition-colors cursor-pointer group ${
                        isCurrent
                          ? 'bg-surface-variant border border-outline-variant'
                          : 'hover:bg-surface-variant border border-transparent'
                      }`}
                    >
                      {/* Left Icon Indicator */}
                      <div className="flex-shrink-0 mt-1">
                        {isCompleted ? (
                          <span
                            className="material-symbols-outlined text-lg text-secondary"
                            data-icon="check_circle"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            check_circle
                          </span>
                        ) : isCurrent ? (
                          <span
                            className="material-symbols-outlined text-lg text-primary"
                            data-icon="play_circle"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            play_circle
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-lg text-on-surface-variant" data-icon="lock">
                            lock
                          </span>
                        )}
                      </div>

                      {/* Lesson Details */}
                      <div className="flex flex-col">
                        <span
                          className={`font-body-sm text-body-sm transition-colors ${
                            isCurrent
                              ? 'text-primary font-medium'
                              : 'text-on-surface group-hover:text-primary'
                          }`}
                        >
                          {lesson.title}
                        </span>

                        <span
                          className={`font-label-sm text-label-sm flex items-center gap-1 mt-1 ${
                            isCurrent ? 'text-primary-fixed-dim' : 'text-on-surface-variant'
                          }`}
                        >
                          {isCurrent ? (
                            <>
                              <span className="material-symbols-outlined text-[14px]" data-icon="equalizer">
                                equalizer
                              </span>
                              <span>Playing • {lesson.duration}</span>
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-[14px]" data-icon="schedule">
                                schedule
                              </span>
                              <span>{lesson.duration}</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </aside>

        </main>
      </div>
    );
  }

  // ==========================================
  // VIEW STATE 1: COURSE CATALOG PAGE VIEW
  // ==========================================
  return (
    <div className="py-8 px-6 md:px-8 max-w-[1200px] mx-auto text-[#dfe2ed]">
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Sidebar: My Learning */}
        <aside className="col-span-12 xl:col-span-3 space-y-6">
          <div className="bg-[#181c24] border border-[#434752] rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#dfe2ed] mb-6">My Learning</h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-mono text-[#8d909d] uppercase mb-3 font-bold tracking-wider">
                  Continue Watching
                </p>
                <div
                  onClick={() => handleOpenPlayback(courses[0], courses[0].lessons[0]?.id)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-3 border border-[#434752]">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={courses[0].title}
                      src={courses[0].image}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white text-4xl">play_circle</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors line-clamp-1">
                    {courses[0].title}
                  </h4>
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-[#c3c6d4] mb-1 font-mono">
                      <span>{getCourseProgress(courses[0])}% Complete</span>
                      <span>{courses[0].lessons.filter(l => l.completed).length}/{courses[0].lessons.length} Lessons</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#31353d] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#aec6ff]"
                        style={{ width: `${getCourseProgress(courses[0])}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#434752]">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-[#c3c6d4] hover:text-[#aec6ff] transition-colors cursor-pointer text-sm">
                    <span className="material-symbols-outlined text-[20px]">bookmark</span>
                    <span>Saved Courses ({savedCourseIds.length})</span>
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
              <button onClick={() => setActiveCategory(null)} className="text-[#aec6ff] text-xs font-medium hover:underline cursor-pointer">
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
              <h3 className="text-xl font-bold text-[#dfe2ed]">
                {activeCategory ? `${activeCategory} Curriculums` : 'Latest for You'}
              </h3>
              <a className="text-[#aec6ff] text-sm font-medium hover:underline" href="#">View all</a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map(course => (
                <div
                  key={course.id}
                  onClick={() => handleOpenPlayback(course)}
                  className="bg-[#181c24] border border-[#434752] rounded-xl overflow-hidden group cursor-pointer transition-all hover:border-[#aec6ff]/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={course.image}
                        alt={course.title}
                      />
                      <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-white font-medium">
                        {course.lessonsCount}
                      </div>
                      <div className="absolute top-3 left-3 px-2 py-1 bg-[#628fea]/90 backdrop-blur-md rounded text-[10px] text-white font-bold font-mono">
                        {course.category}
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-base font-bold text-[#dfe2ed] mb-2 group-hover:text-[#aec6ff] transition-colors line-clamp-2 leading-snug">
                        {course.title}
                      </h4>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-[#c3c6d4]">
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          <span className="text-xs font-mono">{course.duration}</span>
                        </div>
                        <span className="text-[#aec6ff] font-bold text-sm">{course.price}</span>
                      </div>
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
                { name: 'Striver (take U forward)', rating: '4.99', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
                { name: 'Sarah Drasner', rating: '4.98', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
                { name: 'Hitesh Choudhary', rating: '4.95', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
                { name: 'Kelsey Hightower', rating: '4.92', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80' }
              ].map(mentor => (
                <div key={mentor.name} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <img className="w-8 h-8 rounded-full object-cover border border-[#434752]" src={mentor.avatar} alt={mentor.name} />
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
