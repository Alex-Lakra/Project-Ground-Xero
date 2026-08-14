import { useState, useEffect, useCallback } from 'react';
import { firebaseDb } from './firebaseDb';

// ==========================================
// Data Schema Interfaces
// ==========================================

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  videoId: string;
  videoThumbnail?: string;
  overview: {
    description: string;
    takeaways: string[];
  };
}

export interface Resource {
  id: string;
  title: string;
  size: string;
  type: string;
}

export interface DiscussionComment {
  id: string;
  author: string;
  avatar: string;
  time: string;
  comment: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  difficulty?: string;
  duration: string;
  lessonsCount: string;
  price: string;
  image: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  lessons: Lesson[];
  resources: Resource[];
  discussions: DiscussionComment[];
}

// ==========================================
// Initial Seed Courses Dataset (including CP Striver A2Z Suite)
// ==========================================

export const INITIAL_COURSES_SEED: Course[] = [
  {
    id: 'c-cp-a2z',
    title: 'A2Z Data Structures & Competitive Programming Suite',
    category: 'CP',
    difficulty: 'Advanced',
    duration: '45h 30m',
    lessonsCount: '8 Modules • 25 Lessons',
    price: 'FREE',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Striver (take U forward)',
      role: 'Competitive Programming Legend',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    resources: [
      { id: 'r1', title: 'Striver-A2Z-DSA-Sheet.pdf', size: '3.4 MB', type: 'PDF Document' },
      { id: 'r2', title: 'CP-Template-C++.cpp', size: '1.2 KB', type: 'C++ Source Code' },
      { id: 'r3', title: 'Time-Space-Complexity-Cheat-Sheet.png', size: '2.1 MB', type: 'Image' },
    ],
    discussions: [
      {
        id: 'd1',
        author: 'MatrixCoder_99',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        time: '1 hour ago',
        comment: 'Striver A2Z sheet is the absolute gold standard for mastering DSA and cracking competitive programming rounds!',
      },
    ],
    lessons: [
      {
        id: 'l-cp-1',
        title: '1. Time & Space Complexity Analysis in CP',
        duration: '24:15',
        completed: false,
        videoId: 'CYtO1q6zfgA',
        videoThumbnail: 'https://i.ytimg.com/vi/CYtO1q6zfgA/hqdefault.jpg',
        overview: {
          description: 'Master Big-O notation, worst-case vs average-case time bounds, memory limits, and operation limits for 1s execution in CP platforms.',
          takeaways: [
            'Understanding 10^8 operations per second rule on Codeforces/LeetCode.',
            'Calculating space complexity for recursive stacks and auxiliary arrays.',
            'Identifying bottleneck sub-routines in competitive solutions.',
          ],
        },
      },
      {
        id: 'l-cp-2',
        title: '2. C++ STL Primitives: Vectors, Sets, Maps & Priority Queues',
        duration: '38:20',
        completed: false,
        videoId: '0bHoB3etf1U',
        videoThumbnail: 'https://i.ytimg.com/vi/0bHoB3etf1U/hqdefault.jpg',
        overview: {
          description: 'Comprehensive guide to C++ Standard Template Library containers, iterators, custom comparator functions, and fast I/O optimizations.',
          takeaways: [
            'Mastering std::vector, std::set, std::unordered_map, and std::priority_queue.',
            'Writing custom comparators for min-heaps and sorting struct objects.',
            'Fast I/O speedups with ios_base::sync_with_stdio(false).',
          ],
        },
      },
      {
        id: 'l-cp-3',
        title: '3. Selection Sort, Bubble Sort & Insertion Sort Deep Dive',
        duration: '28:45',
        completed: false,
        videoId: '37E9ckMDdTk',
        videoThumbnail: 'https://i.ytimg.com/vi/37E9ckMDdTk/hqdefault.jpg',
        overview: {
          description: 'Step-by-step trace and implementation of elementary O(N^2) sorting algorithms with inner loop invariant proofs.',
          takeaways: [
            'Understanding Selection Sort minimum element swap strategy.',
            'Optimizing Bubble Sort with early termination flags.',
            'Insertion Sort placement logic for online array sorting.',
          ],
        },
      },
      {
        id: 'l-cp-4',
        title: '4. Merge Sort & Divide and Conquer Pattern',
        duration: '32:10',
        completed: false,
        videoId: '1tq16TqY7gM',
        videoThumbnail: 'https://i.ytimg.com/vi/1tq16TqY7gM/hqdefault.jpg',
        overview: {
          description: 'Implementation of O(N log N) stable Merge Sort using divide-and-conquer recursion and auxiliary array merging.',
          takeaways: [
            'Recurrence relation analysis T(N) = 2T(N/2) + O(N).',
            'In-place vs auxiliary array merge strategies.',
            'Counting inversions in an array using Merge Sort.',
          ],
        },
      },
      {
        id: 'l-cp-5',
        title: '5. Quick Sort & Randomized Pivot Selection',
        duration: '30:00',
        completed: false,
        videoId: '0eS-w0k5yqA',
        videoThumbnail: 'https://i.ytimg.com/vi/0eS-w0k5yqA/hqdefault.jpg',
        overview: {
          description: 'Partitioning routines (Hoare vs Lomuto) for Quick Sort and mitigating worst-case O(N^2) behavior using randomized pivots.',
          takeaways: [
            'Understanding Lomuto & Hoare array partitioning.',
            'Randomized pivot selection for worst-case mitigation.',
            'Space complexity of quicksort call stack.',
          ],
        },
      },
      {
        id: 'l-cp-6',
        title: '6. Binary Search on Arrays & Search Space Optimization',
        duration: '35:40',
        completed: false,
        videoId: 'xXklV3D_a-c',
        videoThumbnail: 'https://i.ytimg.com/vi/xXklV3D_a-c/hqdefault.jpg',
        overview: {
          description: 'Mastering binary search boundaries, lower_bound, upper_bound, and binary searching on monotonic answer spaces.',
          takeaways: [
            'Avoiding integer overflow in mid = low + (high - low) / 2.',
            'Implementing lower_bound and upper_bound from scratch.',
            'Solving "Binary Search on Answers" optimization problems.',
          ],
        },
      },
      {
        id: 'l-cp-7',
        title: '7. Graph Traversal: BFS, DFS & Connected Components',
        duration: '42:15',
        completed: false,
        videoId: '6ZFu5o6XvYw',
        videoThumbnail: 'https://i.ytimg.com/vi/6ZFu5o6XvYw/hqdefault.jpg',
        overview: {
          description: 'Breadth-First Search (queue-based) and Depth-First Search (stack/recursion) for directed and undirected graph topologies.',
          takeaways: [
            'Adjacency list vs matrix representations.',
            'BFS shortest path on unweighted graphs.',
            'Detecting cycles in directed and undirected graphs.',
          ],
        },
      },
      {
        id: 'l-cp-8',
        title: '8. Dynamic Programming: 1D DP & Memoization Patterns',
        duration: '40:50',
        completed: false,
        videoId: 'b7AYbpM5YrE',
        videoThumbnail: 'https://i.ytimg.com/vi/b7AYbpM5YrE/hqdefault.jpg',
        overview: {
          description: 'Transitioning from recursive subproblems to top-down memoization and bottom-up space-optimized tabulation.',
          takeaways: [
            'Identifying optimal substructure & overlapping subproblems.',
            'Climbing stairs, frog jump, and maximum sum non-adjacent elements.',
            'Space optimization from O(N) array to O(1) state variables.',
          ],
        },
      },
    ],
  },
  {
    id: 'c1',
    title: 'Microservices with Go: Implementing gRPC & Protocol Buffers',
    category: 'DevOps',
    difficulty: 'Intermediate',
    duration: '15h 20m',
    lessonsCount: '12 Lessons',
    price: '$89.00',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Alex Chen',
      role: 'Senior Go Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    resources: [
      { id: 'r1', title: 'gRPC-Service-Boilerplate.zip', size: '2.4 MB', type: 'Archive' },
      { id: 'r2', title: 'Protocol-Buffers-Cheatsheet.pdf', size: '1.1 MB', type: 'PDF Document' },
      { id: 'r3', title: 'Go-Microservices-Architecture-Diagram.png', size: '3.8 MB', type: 'Image' },
    ],
    discussions: [
      {
        id: 'd1',
        author: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        time: '2 hours ago',
        comment: 'Great explanation on protoc code generation! How do we handle dynamic load balancing with etcd in production?',
      },
    ],
    lessons: [
      {
        id: 'l1',
        title: '1. Introduction to Microservices Architecture',
        duration: '15:20',
        completed: true,
        videoId: 'CYtO1q6zfgA',
        videoThumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        overview: {
          description: 'An overview of microservices patterns vs monolithic architecture, service discovery, and inter-service communication primitives.',
          takeaways: [
            'Understanding monolithic vs microservices tradeoffs.',
            'Decoupling business logic with isolated domain services.',
            'REST vs gRPC latency comparison under high concurrency.',
          ],
        },
      },
      {
        id: 'l2',
        title: '2. Setting up the Go Workspace & Tooling',
        duration: '22:45',
        completed: true,
        videoId: 'CYtO1q6zfgA',
        videoThumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
        overview: {
          description: 'Configuring Go modules, protoc compiler plugins, and development environment tools for automated building.',
          takeaways: [
            'Installing protoc compiler and Go protoc plugins.',
            'Setting up Go module paths and directory layout.',
            'Automating stub compilation with Makefile targets.',
          ],
        },
      },
      {
        id: 'l3',
        title: '3. Protocol Buffers Crash Course & Proto Schema Design',
        duration: '18:30',
        completed: true,
        videoId: 'CYtO1q6zfgA',
        videoThumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80',
        overview: {
          description: 'Designing proto3 schemas, message field tags, scalar types, enums, and nested definitions.',
          takeaways: [
            'Writing clean `.proto` files for service definitions.',
            'Backward and forward schema compatibility guidelines.',
            'Efficient binary serialization mechanics.',
          ],
        },
      },
      {
        id: 'l4',
        title: '4. Implementing gRPC Server & Client Handlers',
        duration: '28:15',
        completed: false,
        videoId: 'CYtO1q6zfgA',
        videoThumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        overview: {
          description: 'In this lesson, we dive deep into implementing gRPC in our Go microservices architecture. We will cover defining Protocol Buffers, generating Go code, and setting up the gRPC server and client.',
          takeaways: [
            'Writing clean `.proto` files for service definitions.',
            'Using `protoc` to generate Go stubs.',
            'Implementing server interfaces.',
            'Handling errors and metadata in gRPC.',
          ],
        },
      },
    ],
  },
  {
    id: 'c2',
    title: 'React 19 Deep Dive & Server Actions',
    category: 'Web',
    difficulty: 'Intermediate',
    duration: '12h 45m',
    lessonsCount: '18 Lessons',
    price: '$89.00',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Sarah Drasner',
      role: 'Principal UI Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    resources: [
      { id: 'r1', title: 'React-19-Cheat-Sheet.pdf', size: '1.8 MB', type: 'PDF' },
    ],
    discussions: [],
    lessons: [
      {
        id: 'l1',
        title: '1. React 19 Compiler & Auto-Memoization',
        duration: '14:20',
        completed: true,
        videoId: 'CYtO1q6zfgA',
        videoThumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
        overview: {
          description: 'Deep dive into the automatic memoization compiler in React 19 eliminating manual useMemo & useCallback.',
          takeaways: [
            'How React Compiler analyzes component AST.',
            'Eliminating unnecessary re-renders automatically.',
            'Migration path for existing React codebases.',
          ],
        },
      },
      {
        id: 'l2',
        title: '2. Server Actions & Optimistic Form Updates',
        duration: '21:00',
        completed: false,
        videoId: 'CYtO1q6zfgA',
        videoThumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        overview: {
          description: 'Building zero-JS form submissions, useActionState, useOptimistic, and pending status indicators.',
          takeaways: [
            'Defining async server actions safely.',
            'Instant UI updates using useOptimistic hook.',
            'Handling mutation errors and toast feedback.',
          ],
        },
      },
    ],
  },
  {
    id: 'c3',
    title: 'Advanced SQL Query Performance & Indexing',
    category: 'Data Science',
    difficulty: 'Advanced',
    duration: '15h 20m',
    lessonsCount: '24 Lessons',
    price: '$75.00',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Hitesh Choudhary',
      role: 'Database Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    resources: [],
    discussions: [],
    lessons: [
      {
        id: 'l1',
        title: '1. B-Tree & Hash Index Internals',
        duration: '18:10',
        completed: true,
        videoId: 'CYtO1q6zfgA',
        videoThumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
        overview: {
          description: 'Understanding disk page layouts, index scan types, composite index column order, and query execution plans.',
          takeaways: [
            'Reading EXPLAIN ANALYZE tree outputs.',
            'Index sequential scan vs bitmap index scan.',
            'Avoiding index bloat and redundant indexes.',
          ],
        },
      },
    ],
  },
  {
    id: 'c4',
    title: 'Security-First Cyber Warfare & Matrix Penetration',
    category: 'Cyber',
    difficulty: 'Advanced',
    duration: '10h 30m',
    lessonsCount: '14 Lessons',
    price: '$99.00',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Kelsey Hightower',
      role: 'Security Director',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
    },
    resources: [],
    discussions: [],
    lessons: [
      {
        id: 'l1',
        title: '1. Zero-Day Vulnerability Scanning & Payload Design',
        duration: '22:15',
        completed: true,
        videoId: 'CYtO1q6zfgA',
        videoThumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        overview: {
          description: 'Scanning exposed subnets, analyzing memory dumps, and constructing shellcode payloads.',
          takeaways: [
            'Subnet reconnaissance techniques.',
            'Analyzing binary targets with Ghidra.',
            'Constructing non-null byte shellcode payloads.',
          ],
        },
      },
    ],
  },
];

// ==========================================
// Custom Hook: useCourses
// ==========================================

export function useCourses(selectedCategory: string | null = null, username: string = 'root') {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES_SEED);
  const [savedCourseIds, setSavedCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync user course progress & bookmarks from Firebase on mount
  useEffect(() => {
    let isMounted = true;
    async function loadProgressAndCourses() {
      setLoading(true);
      try {
        const data = await firebaseDb.getUserProgress(username);
        if (isMounted) {
          if (data && data.completedLessons) {
            setCourses(prevCourses =>
              prevCourses.map(course => {
                const completedIds = data.completedLessons[course.id];
                if (!completedIds) return course;
                return {
                  ...course,
                  lessons: course.lessons.map(lesson => ({
                    ...lesson,
                    completed: completedIds.includes(lesson.id),
                  })),
                };
              })
            );
          }
          if (data && data.savedCourses) {
            setSavedCourseIds(data.savedCourses);
          }
        }
      } catch (err) {
        console.warn('[useCourses] Progress load error', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProgressAndCourses();
    return () => {
      isMounted = false;
    };
  }, [username]);

  // Toggle completion status of active or specific lesson and sync with Firebase
  const toggleLessonComplete = useCallback((courseId: string, lessonId: string) => {
    setCourses(prevCourses => {
      const nextCourses = prevCourses.map(c => {
        if (c.id !== courseId) return c;
        const updatedLessons = c.lessons.map(l =>
          l.id === lessonId ? { ...l, completed: !l.completed } : l
        );
        return { ...c, lessons: updatedLessons };
      });

      // Construct completedLessons map and push to Firebase/LocalStorage background sync
      const completedMap: Record<string, string[]> = {};
      nextCourses.forEach(c => {
        completedMap[c.id] = c.lessons.filter(l => l.completed).map(l => l.id);
      });

      firebaseDb.saveUserProgress({
        username,
        completedLessons: completedMap,
        savedCourses: savedCourseIds,
      });

      return nextCourses;
    });
  }, [savedCourseIds, username]);

  // Toggle saving/bookmarking a course and sync with Firebase
  const toggleSaveCourse = useCallback((courseId: string) => {
    setSavedCourseIds(prevSaved => {
      const isCurrentlySaved = prevSaved.includes(courseId);
      const nextSaved = isCurrentlySaved
        ? prevSaved.filter(id => id !== courseId)
        : [...prevSaved, courseId];

      const completedMap: Record<string, string[]> = {};
      courses.forEach(c => {
        completedMap[c.id] = c.lessons.filter(l => l.completed).map(l => l.id);
      });

      firebaseDb.saveUserProgress({
        username,
        completedLessons: completedMap,
        savedCourses: nextSaved,
      });

      return nextSaved;
    });
  }, [courses, username]);

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
