export type Discipline = 
  | 'Web' 
  | 'AI/ML' 
  | 'CP' 
  | 'Mobile' 
  | 'Cyber' 
  | 'UI/UX' 
  | 'Data Science' 
  | 'DevOps';

/**
 * Interface representing an individual video lesson in a course.
 * Can also be referenced using the `Video` type alias.
 */
export interface Lesson {
  id: string;             // Unique video ID (e.g. 'video-web-101')
  order: number;          // Sequential video position in course (e.g. 1, 2, 3...)
  title: string;          // Video title
  description: string;    // Detailed video description / notes
  videoUrl: string;       // Working MP4 video file URL or local path
  durationSeconds: number;// Duration in seconds (e.g. 300 = 5 minutes)
  moduleName: string;     // Module or section title this video belongs to
}

// Type alias so `Video` and `Lesson` can be used interchangeably
export type Video = Lesson;

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Instructor {
  name: string;
  role: string;
  avatar: string;
}

export interface Course {
  id: string;
  title: string;
  discipline: Discipline;
  description: string;
  instructor: Instructor;
  thumbnail: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  modules: CourseModule[];
}

export interface VideoProgress {
  watchedSeconds: number;     // Current playback timestamp position
  maxWatchedSeconds: number;  // Max timestamp reached during playback
  durationSeconds: number;    // Total duration of the video in seconds
  percentageWatched: number;  // Percentage watched (0 to 100)
  isCompleted: boolean;       // True if >= 90% watched or manually marked complete
  lastUpdated: number;        // Epoch timestamp (Date.now())
}

export interface CourseProgressMap {
  [courseId: string]: {
    [lessonId: string]: VideoProgress;
  };
}

export interface CourseOverallProgress {
  completedLessonsCount: number;
  totalLessonsCount: number;
  progressPercentage: number;
}
