import React from 'react';
import { Course } from '../../types/course';
import { getCourseOverallProgress } from '../../services/courseProgressService';
import { PlayCircle, Clock, BookOpen, Star } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onSelectCourse: (course: Course) => void;
}

export default function CourseCard({ course, onSelectCourse }: CourseCardProps) {
  const progress = getCourseOverallProgress(course);

  // Count total lessons
  const totalLessons = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);

  // Calculate total duration formatted
  const totalSeconds = course.modules.reduce(
    (sum, mod) => sum + mod.lessons.reduce((lSum, l) => lSum + l.durationSeconds, 0),
    0
  );
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <div
      onClick={() => onSelectCourse(course)}
      className="bg-[#181c24] border border-[#434752] rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 hover:border-[#aec6ff]/60 hover:shadow-xl flex flex-col justify-between"
    >
      <div>
        {/* Thumbnail Image Header */}
        <div className="aspect-video relative overflow-hidden bg-[#11141c]">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={course.thumbnail}
            alt={course.title}
          />

          {/* Discipline Badge Overlay */}
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-md text-[11px] font-mono font-bold text-[#aec6ff] border border-[#aec6ff]/30 uppercase tracking-wider">
            {course.discipline}
          </div>

          {/* Level Badge Overlay */}
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#181c24]/90 backdrop-blur-md rounded-md text-[10px] font-mono text-[#c3c6d4] border border-[#434752]">
            {course.level}
          </div>

          {/* Play Overlay Hover Effect */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-[#aec6ff] text-[#0f131b] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <PlayCircle className="w-7 h-7 fill-current" />
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-[#8d909d] mb-1.5 font-mono">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#aec6ff]" />
                {totalLessons} {totalLessons === 1 ? 'Lesson' : 'Lessons'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#8d909d]" />
                {durationText}
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                {course.rating.toFixed(2)}
              </span>
            </div>

            <h4 className="text-base font-bold text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors leading-snug line-clamp-2">
              {course.title}
            </h4>
          </div>

          <p className="text-xs text-[#9ea3b5] leading-relaxed line-clamp-2">
            {course.description}
          </p>
        </div>
      </div>

      {/* Footer & Progress Section */}
      <div className="px-5 pb-5 pt-2 border-t border-[#434752]/40 bg-[#141820]/40">
        <div className="space-y-2 mb-3">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-[#c3c6d4]">
              {progress.progressPercentage > 0 ? `${progress.completedLessonsCount}/${totalLessons} Completed` : 'Not Started'}
            </span>
            <span className="text-[#aec6ff] font-bold">{progress.progressPercentage}%</span>
          </div>

          {/* Visual Course Progress Bar */}
          <div className="h-1.5 w-full bg-[#31353d] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#aec6ff] transition-all duration-500 rounded-full"
              style={{ width: `${progress.progressPercentage}%` }}
            />
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectCourse(course);
          }}
          className="w-full py-2 px-3 rounded-lg border border-[#434752] group-hover:border-[#aec6ff] bg-[#1f2430] group-hover:bg-[#628fea]/15 text-xs font-bold text-[#dfe2ed] group-hover:text-[#aec6ff] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <PlayCircle className="w-4 h-4 text-[#aec6ff]" />
          <span>
            {progress.progressPercentage === 100
              ? 'Review Course'
              : progress.progressPercentage > 0
              ? 'Continue Learning'
              : 'Start Course'}
          </span>
        </button>
      </div>
    </div>
  );
}
