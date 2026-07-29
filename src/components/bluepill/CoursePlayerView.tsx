import React, { useState } from 'react';
import { Course, Lesson } from '../../types/course';
import {
  getVideoProgress,
  saveVideoProgress,
  toggleVideoCompletion,
  getCourseOverallProgress,
} from '../../services/courseProgressService';
import VideoPlaylistSidebar from './VideoPlaylistSidebar';
import CustomVideoPlayer from './CustomVideoPlayer';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  UserCheck,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface CoursePlayerViewProps {
  course: Course;
  onBackToCatalog: () => void;
}

export default function CoursePlayerView({ course, onBackToCatalog }: CoursePlayerViewProps) {
  // Flatten all video lessons across modules for sequential navigation
  const allLessons: Lesson[] = course.modules.flatMap((m) => m.lessons);

  // Active video lesson state (defaults to first video)
  const [currentLesson, setCurrentLesson] = useState<Lesson>(allLessons[0] || null);
  const [resumeNotice, setResumeNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes'>('overview');

  // Overall course completion progress state
  const [courseProgress, setCourseProgress] = useState(() => getCourseOverallProgress(course));

  // Current lesson progress stored in localStorage
  const currentProgress = currentLesson ? getVideoProgress(course.id, currentLesson.id) : null;

  // Refresh overall progress statistics
  const refreshProgress = () => {
    setCourseProgress(getCourseOverallProgress(course));
  };

  // Switch active lesson (Requirement 5: Save departing video's progress before changing)
  const handleSelectLesson = (newLesson: Lesson) => {
    if (currentLesson && currentLesson.id !== newLesson.id) {
      const saved = getVideoProgress(course.id, currentLesson.id);
      if (saved) {
        saveVideoProgress(
          course.id,
          currentLesson.id,
          saved.watchedSeconds,
          saved.durationSeconds
        );
      }
    }
    setCurrentLesson(newLesson);
    setResumeNotice(null);
    refreshProgress();
  };

  // Handle Time Update from CustomVideoPlayer
  const handleTimeUpdate = (now: number, duration: number) => {
    if (!currentLesson) return;
    if (duration > 0) {
      saveVideoProgress(course.id, currentLesson.id, now, duration);
      refreshProgress();
    }
  };

  // Requirement 1 & 2: Prev / Next Navigation calculations
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  // Requirement 1: Load previous video
  const handlePrevLesson = () => {
    if (hasPrev) {
      handleSelectLesson(allLessons[currentIndex - 1]);
    }
  };

  // Requirement 2: Load next video
  const handleNextLesson = () => {
    if (hasNext) {
      handleSelectLesson(allLessons[currentIndex + 1]);
    }
  };

  // Handle Video Completion (When video finishes playing)
  const handleVideoEnded = () => {
    if (!currentLesson) return;
    const progress = getVideoProgress(course.id, currentLesson.id);
    const duration = progress?.durationSeconds || currentLesson.durationSeconds || 10;
    saveVideoProgress(course.id, currentLesson.id, duration, duration, true);
    refreshProgress();

    // Natural non-jarring auto-advance to next video if available
    if (hasNext) {
      setResumeNotice('Lesson Completed! Auto-advancing to next video in 3s...');
      setTimeout(() => {
        handleNextLesson();
      }, 3000);
    }
  };

  // Handle Loaded Metadata from CustomVideoPlayer (Requirement 6: Restore position)
  const handleLoadedMetadata = (dur: number) => {
    if (!currentLesson) return;
    const saved = getVideoProgress(course.id, currentLesson.id);
    if (saved && saved.watchedSeconds > 3 && saved.watchedSeconds < dur - 5) {
      const mins = Math.floor(saved.watchedSeconds / 60);
      const secs = Math.floor(saved.watchedSeconds % 60);
      const formatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      setResumeNotice(`Resumed playback at ${formatted}`);
      setTimeout(() => setResumeNotice(null), 4000);
    }
  };

  // Manual completion toggle
  const handleToggleComplete = () => {
    if (!currentLesson) return;
    const watched = currentProgress?.watchedSeconds || 0;
    const duration = currentProgress?.durationSeconds || currentLesson.durationSeconds || 10;
    toggleVideoCompletion(course.id, currentLesson.id, watched, duration);
    refreshProgress();
  };

  return (
    <div className="py-6 px-4 md:px-8 max-w-[1400px] mx-auto text-[#dfe2ed] space-y-6">
      {/* Top Header Banner */}
      <div className="bg-[#181c24] border border-[#434752] rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start gap-4">
          <button
            onClick={onBackToCatalog}
            className="p-2.5 bg-[#232936] hover:bg-[#aec6ff] hover:text-[#0f131b] text-[#c3c6d4] rounded-lg transition-colors cursor-pointer flex items-center gap-2 text-xs font-bold shrink-0 mt-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Courses</span>
          </button>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#aec6ff]/15 text-[#aec6ff] border border-[#aec6ff]/30 text-[10px] font-mono font-bold rounded uppercase">
                {course.discipline}
              </span>
              <span className="text-xs text-[#8d909d]">• {course.level}</span>
            </div>

            {/* Requirement 8: Update video & course info */}
            <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
              {course.title}
            </h1>

            <p className="text-xs md:text-sm text-[#9ea3b5] leading-relaxed max-w-3xl">
              {course.description}
            </p>
          </div>
        </div>

        {/* Requirement 10: Overall Course Progress Widget */}
        <div className="w-full md:w-72 bg-[#141820] p-4 rounded-xl border border-[#434752] space-y-2 shrink-0">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#c3c6d4] font-medium">Overall Progress</span>
            <span className="text-[#aec6ff] font-mono font-bold">
              {courseProgress.progressPercentage}%
            </span>
          </div>
          <div className="h-2.5 w-full bg-[#31353d] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#aec6ff] transition-all duration-500 rounded-full"
              style={{ width: `${courseProgress.progressPercentage}%` }}
            />
          </div>
          <p className="text-[10px] font-mono text-[#8d909d] text-right">
            {courseProgress.completedLessonsCount} of {courseProgress.totalLessonsCount} lessons completed
          </p>
        </div>
      </div>

      {/* Main Content Responsive Grid */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left Column: Video Player Area & Controls */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="bg-[#181c24] border border-[#434752] rounded-xl overflow-hidden shadow-2xl relative">
            {/* Resume / Auto-Advance Toast Notice Banner */}
            {resumeNotice && (
              <div className="absolute top-4 left-4 z-40 bg-[#aec6ff] text-[#0f131b] px-3 py-1.5 rounded-md font-mono text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
                <Sparkles className="w-4 h-4 text-indigo-900" />
                <span>{resumeNotice}</span>
              </div>
            )}

            {/* Custom Video Player */}
            {currentLesson && (
              <CustomVideoPlayer
                lesson={currentLesson}
                hasPrev={hasPrev}
                hasNext={hasNext}
                onPrevLesson={handlePrevLesson}
                onNextLesson={handleNextLesson}
                onTimeUpdate={handleTimeUpdate}
                onVideoEnded={handleVideoEnded}
                onLoadedMetadata={handleLoadedMetadata}
                initialTime={currentProgress?.watchedSeconds || 0}
              />
            )}

            {/* Video Header & Controls Row */}
            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#434752]">
              <div>
                <p className="text-xs font-mono text-[#8d909d] uppercase mb-1">
                  {currentLesson?.moduleName}
                </p>

                {/* Requirement 8: Update video title */}
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  {currentLesson?.title}
                  {currentProgress?.isCompleted && (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-xs px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Completed</span>
                    </span>
                  )}
                </h2>
              </div>

              {/* Requirement 1, 2, 3, 4: Navigation Controls */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Requirement 1 & 3: Previous Video Button (Disabled on video 1) */}
                <button
                  onClick={handlePrevLesson}
                  disabled={!hasPrev}
                  className="px-3.5 py-2 bg-[#232936] hover:bg-[#313848] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-xs font-bold text-[#c3c6d4] hover:text-white flex items-center gap-1 cursor-pointer transition-colors border border-[#434752]/50"
                  title={hasPrev ? 'Play Previous Video' : 'First video in course'}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {/* Mark Complete Toggle */}
                <button
                  onClick={handleToggleComplete}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    currentProgress?.isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-[#232936] text-[#c3c6d4] border-[#434752] hover:border-[#aec6ff] hover:text-[#aec6ff]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{currentProgress?.isCompleted ? 'Completed' : 'Mark Complete'}</span>
                </button>

                {/* Requirement 2 & 4: Next Video Button (Disabled on final video) */}
                <button
                  onClick={handleNextLesson}
                  disabled={!hasNext}
                  className="px-3.5 py-2 bg-[#aec6ff] hover:bg-[#92b3ff] text-[#0f131b] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow"
                  title={hasNext ? 'Play Next Video' : 'Last video in course'}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lesson Overview & Notes Tabs */}
            <div className="p-5 space-y-4">
              <div className="flex gap-4 border-b border-[#434752] pb-3 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 -mb-3 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'overview'
                      ? 'text-[#aec6ff] border-b-2 border-[#aec6ff]'
                      : 'text-[#8d909d] hover:text-[#c3c6d4]'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Lesson Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-3 -mb-3 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'notes'
                      ? 'text-[#aec6ff] border-b-2 border-[#aec6ff]'
                      : 'text-[#8d909d] hover:text-[#c3c6d4]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Keyboard Shortcuts & Notes</span>
                </button>
              </div>

              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <p className="text-sm text-[#c3c6d4] leading-relaxed">
                    {currentLesson?.description}
                  </p>

                  <div className="pt-4 border-t border-[#434752]/50 flex items-center gap-3">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#434752]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1">
                        {course.instructor.name}
                        <UserCheck className="w-3.5 h-3.5 text-[#aec6ff]" />
                      </h4>
                      <p className="text-[11px] text-[#8d909d]">{course.instructor.role}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#aec6ff]">Keyboard Shortcuts:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-[11px]">
                    <div className="bg-[#141820] p-2 rounded border border-[#434752]">
                      <span className="text-white font-bold">Space / K</span>: Play/Pause
                    </div>
                    <div className="bg-[#141820] p-2 rounded border border-[#434752]">
                      <span className="text-white font-bold">Left / J</span>: -5 Sec
                    </div>
                    <div className="bg-[#141820] p-2 rounded border border-[#434752]">
                      <span className="text-white font-bold">Right / L</span>: +5 Sec
                    </div>
                    <div className="bg-[#141820] p-2 rounded border border-[#434752]">
                      <span className="text-white font-bold">Up / Down</span>: Volume
                    </div>
                    <div className="bg-[#141820] p-2 rounded border border-[#434752]">
                      <span className="text-white font-bold">M</span>: Mute/Unmute
                    </div>
                    <div className="bg-[#141820] p-2 rounded border border-[#434752]">
                      <span className="text-white font-bold">F</span>: Fullscreen
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Requirement 7: Active playlist item update */}
        <div className="col-span-12 lg:col-span-4 h-[750px] lg:sticky lg:top-20">
          <VideoPlaylistSidebar
            course={course}
            currentLessonId={currentLesson?.id || ''}
            onSelectLesson={handleSelectLesson}
          />
        </div>
      </div>
    </div>
  );
}
