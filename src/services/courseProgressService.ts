import { Course, CourseOverallProgress, CourseProgressMap, VideoProgress } from '../types/course';

const STORAGE_KEY = 'ground_xero_course_progress_v1';

/**
 * Returns a unique storage key string for a given course ID and video ID.
 */
export function getVideoProgressStorageKey(courseId: string, videoId: string): string {
  return `${STORAGE_KEY}:${courseId}:${videoId}`;
}

/**
 * Retrieves the full course progress map from localStorage.
 */
export function getCourseProgressMap(): CourseProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read course progress from localStorage:', err);
    return {};
  }
}

/**
 * Saves the full course progress map to localStorage.
 */
function saveProgressMap(map: CourseProgressMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.error('Failed to save course progress to localStorage:', err);
  }
}

/**
 * Gets progress data for a specific video within a course.
 */
export function getVideoProgress(courseId: string, videoId: string): VideoProgress | null {
  if (!courseId || !videoId) return null;
  const map = getCourseProgressMap();
  return map[courseId]?.[videoId] || null;
}

/**
 * Saves or updates playback position, percentage watched, and completion status for a video.
 */
export function saveVideoProgress(
  courseId: string,
  videoId: string,
  watchedSeconds: number,
  durationSeconds: number,
  forceComplete?: boolean
): VideoProgress {
  if (!courseId || !videoId) {
    throw new Error('Both courseId and videoId are required to save video progress.');
  }

  const map = getCourseProgressMap();
  if (!map[courseId]) {
    map[courseId] = {};
  }

  const existing = map[courseId][videoId] || {
    watchedSeconds: 0,
    maxWatchedSeconds: 0,
    durationSeconds: durationSeconds || 0,
    percentageWatched: 0,
    isCompleted: false,
    lastUpdated: Date.now(),
  };

  const validDuration = durationSeconds > 0 ? durationSeconds : existing.durationSeconds;
  const newWatched = Math.max(0, Math.min(watchedSeconds, validDuration > 0 ? validDuration : watchedSeconds));
  const newMaxWatched = Math.max(existing.maxWatchedSeconds, newWatched);

  // Calculate percentage watched (0 to 100)
  const calculatedPercentage = validDuration > 0
    ? Math.min(100, Math.round((newMaxWatched / validDuration) * 100))
    : 0;

  // Completion criteria: 90%+ playback reached OR explicit forceComplete OR previously completed
  const isCompleted =
    forceComplete === true ||
    existing.isCompleted ||
    (validDuration > 0 && (newMaxWatched / validDuration >= 0.9 || newWatched / validDuration >= 0.9));

  // Once completed, lock percentage display to 100%
  const finalPercentage = isCompleted ? 100 : calculatedPercentage;

  const updated: VideoProgress = {
    watchedSeconds: Number(newWatched.toFixed(2)),
    maxWatchedSeconds: Number(newMaxWatched.toFixed(2)),
    durationSeconds: Number(validDuration.toFixed(2)),
    percentageWatched: finalPercentage,
    isCompleted,
    lastUpdated: Date.now(),
  };

  map[courseId][videoId] = updated;
  saveProgressMap(map);

  return updated;
}

/**
 * Toggles completion status manually for a video (e.g. clicking 'Mark Complete').
 */
export function toggleVideoCompletion(
  courseId: string,
  videoId: string,
  currentWatchedSec: number = 0,
  totalDurationSec: number = 0
): VideoProgress {
  const existing = getVideoProgress(courseId, videoId);
  const isCurrentlyCompleted = existing?.isCompleted || false;
  const nextCompletedState = !isCurrentlyCompleted;

  const map = getCourseProgressMap();
  if (!map[courseId]) map[courseId] = {};

  const duration = totalDurationSec > 0 ? totalDurationSec : (existing?.durationSeconds || 0);
  const watched = currentWatchedSec > 0 ? currentWatchedSec : (existing?.watchedSeconds || 0);

  const updated: VideoProgress = {
    watchedSeconds: watched,
    maxWatchedSeconds: nextCompletedState ? (duration > 0 ? duration : watched) : watched,
    durationSeconds: duration,
    percentageWatched: nextCompletedState ? 100 : (duration > 0 ? Math.round((watched / duration) * 100) : 0),
    isCompleted: nextCompletedState,
    lastUpdated: Date.now(),
  };

  map[courseId][videoId] = updated;
  saveProgressMap(map);

  return updated;
}

/**
 * Computes overall course progress as the average progress percentage of all videos in the course.
 *
 * Formula:
 * CourseProgress = Math.min(100, Math.round( Sum(VideoProgress_i) / TotalVideos ))
 *
 * Example:
 * Video 1 = 100%
 * Video 2 = 50%
 * Video 3 = 0%
 * Course Progress = (100 + 50 + 0) / 3 = 50%
 */
export function getCourseOverallProgress(course: Course): CourseOverallProgress {
  const map = getCourseProgressMap();
  const courseData = map[course.id] || {};

  let totalLessons = 0;
  let completedCount = 0;
  let totalPercentageSum = 0;

  course.modules.forEach((mod) => {
    mod.lessons.forEach((lesson) => {
      totalLessons++;
      const lessonProgress = courseData[lesson.id];

      if (lessonProgress) {
        if (lessonProgress.isCompleted) {
          completedCount++;
          totalPercentageSum += 100;
        } else {
          const videoPercent = Math.min(100, Math.max(0, lessonProgress.percentageWatched || 0));
          totalPercentageSum += videoPercent;
        }
      }
    });
  });

  // Calculate overall average progress rounded sensibly
  const progressPercentage = totalLessons > 0
    ? Math.min(100, Math.max(0, Math.round(totalPercentageSum / totalLessons)))
    : 0;

  return {
    completedLessonsCount: completedCount,
    totalLessonsCount: totalLessons,
    progressPercentage,
  };
}
