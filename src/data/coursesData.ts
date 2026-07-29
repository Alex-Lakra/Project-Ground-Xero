import { Course, Discipline, Lesson } from '../types/course';

/**
 * HELPER FACTORY FUNCTION: createCourse
 * 
 * Allows creating a new course in a beginner-friendly way with minimal boilerplate.
 * Automatically handles sequential video ordering, module grouping, and unique ID creation.
 */
export function createCourse(config: {
  id: string;
  title: string;
  discipline: Discipline;
  description: string;
  thumbnail: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  rating?: number;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  videos: Array<{
    title: string;
    description: string;
    durationSeconds: number;
    videoUrl: string;
    moduleName?: string;
  }>;
}): Course {
  // Group videos by module name or fallback to a single default module
  const modulesMap = new Map<string, Lesson[]>();

  config.videos.forEach((vid, index) => {
    const modName = vid.moduleName || 'Module 1: Course Lectures';
    if (!modulesMap.has(modName)) {
      modulesMap.set(modName, []);
    }

    const lesson: Lesson = {
      id: `${config.id}-lesson-${index + 1}`,
      order: index + 1,
      title: vid.title,
      description: vid.description,
      durationSeconds: vid.durationSeconds,
      videoUrl: vid.videoUrl,
      moduleName: modName,
    };

    modulesMap.get(modName)!.push(lesson);
  });

  const modules = Array.from(modulesMap.entries()).map(([title, lessons], modIndex) => ({
    id: `${config.id}-mod-${modIndex + 1}`,
    title,
    lessons,
  }));

  return {
    id: config.id,
    title: config.title,
    discipline: config.discipline,
    description: config.description,
    thumbnail: config.thumbnail,
    level: config.level || 'Beginner',
    rating: config.rating || 5.0,
    instructor: config.instructor,
    modules,
  };
}

/**
 * MASTER COURSES DATA STORE
 * Scalable collection of all courses across disciplines.
 * The entire website automatically renders any course added to this array!
 */
export const MOCK_COURSES: Course[] = [
  // --------------------------------------------------------------------------
  // 1. WEB DEVELOPMENT COURSE
  // --------------------------------------------------------------------------
  createCourse({
    id: 'course-react-19',
    title: 'React 19 Deep Dive & Server Components',
    discipline: 'Web',
    description: 'Master React 19 from ground zero. Learn Actions, useActionState, useOptimistic, Server Components, and modern state patterns.',
    level: 'Intermediate',
    rating: 4.95,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Sarah Drasner',
      role: 'Principal Web Architect',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
    videos: [
      {
        title: '01. Introduction to React 19 & Compiler',
        description: 'Overview of React 19 features, auto-memoization compiler, and project setup.',
        durationSeconds: 596,
        videoUrl: '/videos/web-development/react-19/lesson-1.mp4',
        moduleName: 'Module 1: React 19 Core Paradigm Shifts',
      },
      {
        title: '02. Actions & useActionState Hook',
        description: 'Handling async form submissions and transitions effortlessly with React Actions.',
        durationSeconds: 60,
        videoUrl: '/videos/web-development/react-19/lesson-2.mp4',
        moduleName: 'Module 1: React 19 Core Paradigm Shifts',
      },
      {
        title: '03. Instant UI Feedback with useOptimistic',
        description: 'Implementing optimistic state updates for real-time user experiences.',
        durationSeconds: 15,
        videoUrl: '/videos/web-development/react-19/lesson-3.mp4',
        moduleName: 'Module 1: React 19 Core Paradigm Shifts',
      },
      {
        title: '04. React Server Components Architecture',
        description: 'Deep dive into server/client component boundaries and zero-bundle-size rendering.',
        durationSeconds: 15,
        videoUrl: '/videos/web-development/react-19/lesson-4.mp4',
        moduleName: 'Module 2: Server Components & Suspense',
      },
      {
        title: '05. Streaming HTML & Suspense Boundaries',
        description: 'Stream slow data chunks directly from server to client with progressive hydration.',
        durationSeconds: 653,
        videoUrl: '/videos/web-development/react-19/lesson-5.mp4',
        moduleName: 'Module 2: Server Components & Suspense',
      },
    ],
  }),

  // --------------------------------------------------------------------------
  // 2. PROGRAMMING / CP COURSE
  // --------------------------------------------------------------------------
  createCourse({
    id: 'course-cp-dsa',
    title: 'Competitive Programming & DSA Masterclass',
    discipline: 'CP',
    description: 'Master advanced algorithms, dynamic programming, segment trees, graph theory, and conquer LeetCode & Codeforces contests.',
    level: 'Advanced',
    rating: 4.96,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Hitesh Choudhary',
      role: 'Grandmaster & CP Coach',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    videos: [
      {
        title: '01. 1D to 2D DP State Transitions',
        description: 'Deconstructing recurrence relations, memoization vs bottom-up tabulation.',
        durationSeconds: 596,
        videoUrl: '/videos/programming/competitive-programming/lesson-1.mp4',
        moduleName: 'Module 1: Dynamic Programming & Graphs',
      },
      {
        title: '02. Digit DP & Bitmask DP Patterns',
        description: 'Solving hard combinatorics and graph TSP problems using bitmask states.',
        durationSeconds: 60,
        videoUrl: '/videos/programming/competitive-programming/lesson-2.mp4',
        moduleName: 'Module 1: Dynamic Programming & Graphs',
      },
      {
        title: '03. Graph Shortest Paths & Dijkstra Optimization',
        description: 'Optimizing Graph Traversals using Priority Queues and Segment Trees.',
        durationSeconds: 15,
        videoUrl: '/videos/programming/competitive-programming/lesson-3.mp4',
        moduleName: 'Module 1: Dynamic Programming & Graphs',
      },
    ],
  }),

  // --------------------------------------------------------------------------
  // 3. AI / ML COURSE
  // --------------------------------------------------------------------------
  createCourse({
    id: 'course-ai-ml',
    title: 'Generative AI & LLM Engineering',
    discipline: 'AI/ML',
    description: 'Build enterprise AI applications with LLMs, RAG (Retrieval Augmented Generation), vector embeddings, and LangChain.',
    level: 'Advanced',
    rating: 4.98,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Dr. Alan Vance',
      role: 'AI Research Director',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    videos: [
      {
        title: '01. Transformer Architectures & Attention Mechanism',
        description: 'Mathematical intuition behind attention layers, tokens, and context windows.',
        durationSeconds: 596,
        videoUrl: '/videos/ai-ml/generative-ai/lesson-1.mp4',
        moduleName: 'Module 1: LLM Foundations & Embeddings',
      },
      {
        title: '02. Vector Stores & Semantic Search',
        description: 'Indexing data into vector databases using embeddings for fast cosine similarity search.',
        durationSeconds: 60,
        videoUrl: '/videos/ai-ml/generative-ai/lesson-2.mp4',
        moduleName: 'Module 1: LLM Foundations & Embeddings',
      },
      {
        title: '03. RAG Pipelines & Hybrid Retrieval',
        description: 'Combining keyword BM25 retrieval with dense vector retrieval for high accuracy.',
        durationSeconds: 15,
        videoUrl: '/videos/ai-ml/generative-ai/lesson-3.mp4',
        moduleName: 'Module 1: LLM Foundations & Embeddings',
      },
    ],
  }),

  // --------------------------------------------------------------------------
  // 4. DATA SCIENCE COURSE
  // --------------------------------------------------------------------------
  createCourse({
    id: 'course-sql-ds',
    title: 'Advanced SQL & Data Engineering',
    discipline: 'Data Science',
    description: 'Query optimization, indexing strategies, window functions, and building high-scale analytics data pipelines.',
    level: 'Intermediate',
    rating: 4.92,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Elena Rostova',
      role: 'Lead Data Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    videos: [
      {
        title: '01. ROW_NUMBER, RANK, and DENSE_RANK',
        description: 'Master analytical queries, running totals, and partition clauses in PostgreSQL.',
        durationSeconds: 596,
        videoUrl: '/videos/data-science/advanced-sql/lesson-1.mp4',
        moduleName: 'Module 1: Window Functions & Analytics',
      },
      {
        title: '02. Query Execution Plans & Index Tuning',
        description: 'Analyze EXPLAIN ANALYZE output, B-Tree vs Hash vs GIN indexes.',
        durationSeconds: 60,
        videoUrl: '/videos/data-science/advanced-sql/lesson-2.mp4',
        moduleName: 'Module 1: Window Functions & Analytics',
      },
      {
        title: '03. ETL Pipeline Orchestration',
        description: 'Building automated data pipelines using Apache Airflow and dbt.',
        durationSeconds: 15,
        videoUrl: '/videos/data-science/advanced-sql/lesson-3.mp4',
        moduleName: 'Module 1: Window Functions & Analytics',
      },
    ],
  }),

  // --------------------------------------------------------------------------
  // 5. DEVOPS COURSE
  // --------------------------------------------------------------------------
  createCourse({
    id: 'course-cloud-devops',
    title: 'Cloud Native Architecture & Kubernetes',
    discipline: 'DevOps',
    description: 'Container orchestration with Kubernetes, Docker security, CI/CD automation, and Terraform infrastructure as code.',
    level: 'Intermediate',
    rating: 4.94,
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Kelsey Hightower',
      role: 'Cloud Native Evangelist',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    },
    videos: [
      {
        title: '01. Pods, Deployments & ReplicaSets',
        description: 'Declarative YAML specifications, rolling updates, and self-healing pods.',
        durationSeconds: 596,
        videoUrl: '/videos/devops/kubernetes/lesson-1.mp4',
        moduleName: 'Module 1: Kubernetes Core Primitives',
      },
      {
        title: '02. Ingress Controllers & Service Mesh',
        description: 'Configuring NGINX Ingress, TLS termination, and Istio traffic management.',
        durationSeconds: 60,
        videoUrl: '/videos/devops/kubernetes/lesson-2.mp4',
        moduleName: 'Module 1: Kubernetes Core Primitives',
      },
      {
        title: '03. CI/CD Automation with GitHub Actions',
        description: 'Automating build, test, and release workflows for containerized applications.',
        durationSeconds: 15,
        videoUrl: '/videos/devops/kubernetes/lesson-3.mp4',
        moduleName: 'Module 1: Kubernetes Core Primitives',
      },
    ],
  }),

  // --------------------------------------------------------------------------
  // 6. CYBERSECURITY COURSE
  // --------------------------------------------------------------------------
  createCourse({
    id: 'course-cyber-security',
    title: 'Security-First Development & PenTesting',
    discipline: 'Cyber',
    description: 'OWASP Top 10 vulnerabilities, secure coding practices, zero-trust architecture, and hands-on penetration testing.',
    level: 'Beginner',
    rating: 4.91,
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Marcus Vance',
      role: 'Chief Information Security Officer',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    },
    videos: [
      {
        title: '01. SQL Injection & Parameterized Queries',
        description: 'Understanding how SQLi exploits payload execution and securing backend ORMs.',
        durationSeconds: 596,
        videoUrl: '/videos/cyber/security-pentesting/lesson-1.mp4',
        moduleName: 'Module 1: OWASP Web Vulnerabilities',
      },
      {
        title: '02. Cross-Site Scripting (XSS) Prevention',
        description: 'Reflected, Stored, and DOM-based XSS attack vectors and CSP headers.',
        durationSeconds: 60,
        videoUrl: '/videos/cyber/security-pentesting/lesson-2.mp4',
        moduleName: 'Module 1: OWASP Web Vulnerabilities',
      },
      {
        title: '03. Authentication & JWT Hardening',
        description: 'Implementing secure cookie-based storage, token rotation, and MFA flows.',
        durationSeconds: 15,
        videoUrl: '/videos/cyber/security-pentesting/lesson-3.mp4',
        moduleName: 'Module 1: OWASP Web Vulnerabilities',
      },
    ],
  }),

  // --------------------------------------------------------------------------
  // 7. MOBILE COURSE
  // --------------------------------------------------------------------------
  createCourse({
    id: 'course-flutter-mobile',
    title: 'Cross-Platform App Dev with Flutter 3',
    discipline: 'Mobile',
    description: 'Build native iOS and Android apps with Dart, Flutter 3, Riverpod state management, and Firebase backend integration.',
    level: 'Beginner',
    rating: 4.89,
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Maya Lin',
      role: 'Senior Mobile Engineer',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    },
    videos: [
      {
        title: '01. Building Complex UIs with Flex & Grid',
        description: 'Stateless vs Stateful widgets, widget tree rendering pipeline, and custom painters.',
        durationSeconds: 596,
        videoUrl: '/videos/mobile/flutter-3/lesson-1.mp4',
        moduleName: 'Module 1: Flutter Layouts & Widgets',
      },
      {
        title: '02. State Management with Riverpod',
        description: 'Managing app state cleanly using reactive providers and async state notifications.',
        durationSeconds: 60,
        videoUrl: '/videos/mobile/flutter-3/lesson-2.mp4',
        moduleName: 'Module 1: Flutter Layouts & Widgets',
      },
      {
        title: '03. Native Device APIs & Push Notifications',
        description: 'Accessing camera, geolocation, and Firebase Cloud Messaging on iOS and Android.',
        durationSeconds: 15,
        videoUrl: '/videos/mobile/flutter-3/lesson-3.mp4',
        moduleName: 'Module 1: Flutter Layouts & Widgets',
      },
    ],
  }),

  // --------------------------------------------------------------------------
  // 8. UI/UX COURSE
  // --------------------------------------------------------------------------
  createCourse({
    id: 'course-uiux-design',
    title: 'UI/UX Design Systems & Figma Mastery',
    discipline: 'UI/UX',
    description: 'Design accessible, high-conversion user interfaces with design tokens, auto layout 5.0, and interactive prototyping.',
    level: 'Beginner',
    rating: 4.97,
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Chloe Bennett',
      role: 'Design System Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    videos: [
      {
        title: '01. Building Modular Design Tokens in Figma',
        description: 'Setting up color palettes, typography scales, spacing variables, and dark mode toggles.',
        durationSeconds: 596,
        videoUrl: '/videos/ui-ux/figma-mastery/lesson-1.mp4',
        moduleName: 'Module 1: Design Tokens & Typography',
      },
      {
        title: '02. Auto-Layout 5.0 & Responsive Components',
        description: 'Mastering flex layouts, wrapping, and component variants in Figma.',
        durationSeconds: 60,
        videoUrl: '/videos/ui-ux/figma-mastery/lesson-2.mp4',
        moduleName: 'Module 1: Design Tokens & Typography',
      },
      {
        title: '03. User Research & High-Fidelity Prototyping',
        description: 'Conducting usability testing and creating interactive micro-interaction prototypes.',
        durationSeconds: 15,
        videoUrl: '/videos/ui-ux/figma-mastery/lesson-3.mp4',
        moduleName: 'Module 1: Design Tokens & Typography',
      },
    ],
  }),
];

/**
 * QUERY HELPER UTILITIES
 */
export function getCourseById(courseId: string): Course | undefined {
  return MOCK_COURSES.find((c) => c.id === courseId);
}

export function getCoursesByDiscipline(discipline: Discipline): Course[] {
  return MOCK_COURSES.filter((c) => c.discipline === discipline);
}

export function getAllCourses(): Course[] {
  return MOCK_COURSES;
}
