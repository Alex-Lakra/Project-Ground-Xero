import React from 'react';
import { Course, Lesson } from '../../types/course';
import { getVideoProgress } from '../../services/courseProgressService';
import { CheckCircle2, PlayCircle, ChevronDown, Video } from 'lucide-react';

interface VideoPlaylistSidebarProps {
  course: Course;
  currentLessonId: string;
  onSelectLesson: (lesson: Lesson) => void;
}

export default function VideoPlaylistSidebar({
  course,
  currentLessonId,
  onSelectLesson,
}: VideoPlaylistSidebarProps) {
  const totalVideos = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);

  return (
    <div className="bg-[#181c24] border border-[#434752] rounded-xl overflow-hidden flex flex-col h-full shadow-xl">
      {/* Playlist Header */}
      <div className="p-4 border-b border-[#434752] bg-[#141820] flex items-center justify-between">
        <div>
          <h3 className="text-xs uppercase font-bold text-[#dfe2ed] tracking-wider font-mono">
            Course Playlist
          </h3>
          <p className="text-[11px] font-mono text-[#8d909d] mt-0.5">
            {course.modules.length} {course.modules.length === 1 ? 'Module' : 'Modules'} • {totalVideos} {totalVideos === 1 ? 'Video' : 'Videos'}
          </p>
        </div>
      </div>

      {/* Accordion / Modules & Video Items List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#434752]/40 custom-scrollbar p-2.5 space-y-3">
        {course.modules.map((mod) => (
          <div key={mod.id} className="space-y-1.5">
            {/* Module Title Header */}
            <div className="px-3 py-2 text-[11px] font-bold text-[#aec6ff] uppercase tracking-wider bg-[#1c222e] rounded-md flex items-center justify-between font-mono border border-[#434752]/40">
              <span className="truncate">{mod.title}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8d909d]" />
            </div>

            {/* Video Items */}
            <div className="space-y-1.5 pl-0.5">
              {mod.lessons.map((lesson) => {
                // 1. Currently selected state check
                const isCurrent = lesson.id === currentLessonId;

                // 2. Fetch progress from localStorage
                const progress = getVideoProgress(course.id, lesson.id);

                const isCompleted = progress?.isCompleted || false;
                const watchedSec = progress?.maxWatchedSeconds || progress?.watchedSeconds || 0;
                const durationSec = lesson.durationSeconds || progress?.durationSeconds || 1;

                // Calculate percentage watched (0 to 100%)
                const calcPercent = Math.min(100, Math.round((watchedSec / durationSec) * 100));
                const watchedPercent = isCompleted ? 100 : calcPercent;

                // Format video order number (e.g. 01, 02, 03)
                const videoNumber = String(lesson.order || 1).padStart(2, '0');

                // Format video duration
                const minutes = Math.floor(lesson.durationSeconds / 60);
                const seconds = lesson.durationSeconds % 60;
                const durationFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson)}
                    className={`w-full text-left p-3 rounded-lg transition-all cursor-pointer flex flex-col space-y-2 border relative group ${
                      isCurrent
                        ? 'bg-[#aec6ff]/15 border-[#aec6ff] text-white shadow-md ring-1 ring-[#aec6ff]/40'
                        : 'bg-[#181c24] hover:bg-[#232936] border-[#434752]/40 text-[#c3c6d4]'
                    }`}
                  >
                    {/* Top Row: Icon, Video Number, Title, NOW PLAYING Badge, Duration */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        {/* Status Icon */}
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : isCurrent ? (
                          <PlayCircle className="w-4 h-4 text-[#aec6ff] shrink-0 mt-0.5 animate-pulse" />
                        ) : (
                          <Video className="w-4 h-4 text-[#8d909d] shrink-0 mt-0.5" />
                        )}

                        {/* Video Order Number Badge */}
                        <span className={`text-[11px] font-mono font-bold shrink-0 mt-0.5 px-1.5 py-0.2 rounded ${
                          isCurrent
                            ? 'bg-[#aec6ff] text-[#0f131b]'
                            : 'bg-[#232936] text-[#8d909d] border border-[#434752]/50'
                        }`}>
                          {videoNumber}
                        </span>

                        {/* Video Title */}
                        <span
                          className={`text-xs font-semibold leading-tight truncate ${
                            isCurrent ? 'text-white font-bold' : 'text-[#dfe2ed] group-hover:text-white'
                          }`}
                        >
                          {lesson.title}
                        </span>
                      </div>

                      {/* Right Badge / Duration */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 bg-[#aec6ff] text-[#0f131b] font-mono text-[9px] font-bold rounded uppercase tracking-wider shadow">
                            NOW PLAYING
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-[#8d909d]">
                          {durationFormatted}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Visual Watched-Progress Bar & Percentage */}
                    <div className="w-full flex items-center gap-2 pt-0.5">
                      {/* Unwatched Neutral Track */}
                      <div className="h-1.5 flex-1 bg-[#2b303c] rounded-full overflow-hidden border border-[#434752]/40 relative">
                        {/* Watched Progress Fill Bar */}
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]'
                              : 'bg-[#aec6ff] shadow-[0_0_6px_rgba(174,198,255,0.4)]'
                          }`}
                          style={{ width: `${watchedPercent}%` }}
                        />
                      </div>

                      {/* Watched Percentage Label */}
                      <span className={`text-[10px] font-mono font-bold shrink-0 ${
                        isCompleted ? 'text-emerald-400' : watchedPercent > 0 ? 'text-[#aec6ff]' : 'text-[#8d909d]'
                      }`}>
                        {watchedPercent}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
