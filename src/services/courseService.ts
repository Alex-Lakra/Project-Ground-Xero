import { useState, useEffect, useCallback } from 'react';
import {
  Course,
  Lesson,
  Resource,
  DiscussionComment,
  CourseDataManager,
  MASTER_COURSES_FRAMEWORK
} from './courseFramework';

export type { Course, Lesson, Resource, DiscussionComment };
export { CourseDataManager, MASTER_COURSES_FRAMEWORK };

export function useCourses(selectedCategory: string | null = null, username: string = 'root') {
  const [courses, setCourses] = useState<Course[]>(MASTER_COURSES_FRAMEWORK);
  const [savedCourseIds, setSavedCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync user course progress & bookmarks from CourseDataManager / Firebase on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const data = await CourseDataManager.getCourses(null, username);
        if (isMounted) {
          setCourses(data);
        }
      } catch (err) {
        console.warn('[useCourses] Load error', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [username]);

  // Toggle completion status of active or specific lesson and sync with background framework
  const toggleLessonComplete = useCallback(async (courseId: string, lessonId: string) => {
    const updated = await CourseDataManager.updateLessonProgress(courseId, lessonId, username);
    setCourses(updated);
  }, [username]);

  // Toggle saving/bookmarking a course and sync with background framework
  const toggleSaveCourse = useCallback(async (courseId: string) => {
    const nextSaved = await CourseDataManager.toggleBookmark(courseId, username);
    setSavedCourseIds(nextSaved);
  }, [username]);

  // Filtered courses based on selected category tab
  const filteredCourses = selectedCategory
    ? courses.filter(c => c.category === selectedCategory)
    : courses;

  return {
    courses,
    filteredCourses,
    savedCourseIds,
    loading,
    toggleLessonComplete,
    toggleSaveCourse,
    isSavedCourse: (courseId: string) => savedCourseIds.includes(courseId),
    getCourseProgress: (course: Course) => {
      const total = course.lessons.length;
      if (total === 0) return 0;
      const completed = course.lessons.filter(l => l.completed).length;
      return Math.round((completed / total) * 100);
    },
  };
}
