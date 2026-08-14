import { firebaseDb } from './firebaseDb';
import scrapedCPData from './scrapedPlaylists.json';

// ==========================================
// Data Framework Schema Definitions
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
  category: 'CP' | 'Web' | 'DevOps' | 'Cyber' | 'Data Science' | 'AI/ML' | 'Mobile' | 'UI/UX';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
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

export interface UserProgressState {
  username: string;
  completedLessons: Record<string, string[]>; // courseId -> lessonId[]
  savedCourses: string[]; // courseId[]
}

// ==========================================
// Authentic Master Course Datasets & Playlists
// ==========================================

const cpScrapedLessons: Lesson[] = (scrapedCPData?.lessons as Lesson[]) || [];

export const MASTER_COURSES_FRAMEWORK: Course[] = [
  // 1. Competitive Programming (Striver A2Z DSA Scraped Playlist)
  {
    id: 'c-cp-a2z',
    title: scrapedCPData?.title || 'Strivers A2Z-DSA Course | DSA Playlist | Placements',
    category: 'CP',
    difficulty: 'Advanced',
    duration: '45h 30m',
    lessonsCount: `${cpScrapedLessons.length || 15} Lessons`,
    price: 'FREE',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: scrapedCPData?.instructor || 'take U forward (Striver)',
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
    lessons: cpScrapedLessons.length > 0 ? cpScrapedLessons : [
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

  // 2. Web Category: React 19 & Next.js Full Playlist
  {
    id: 'c-web-react',
    title: 'React 19 & Next.js Full Stack Architecture',
    category: 'Web',
    difficulty: 'Intermediate',
    duration: '14h 20m',
    lessonsCount: '5 Lessons',
    price: '$89.00',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Sarah Drasner',
      role: 'Principal UI Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    resources: [
      { id: 'r1', title: 'React-19-Cheat-Sheet.pdf', size: '1.8 MB', type: 'PDF Document' },
      { id: 'r2', title: 'Server-Actions-Starter.zip', size: '3.1 MB', type: 'Archive' },
    ],
    discussions: [],
    lessons: [
      {
        id: 'l-web-1',
        title: '1. React 19 Fundamentals & Automatic Memoization Compiler',
        duration: '18:40',
        completed: false,
        videoId: '8pDqJVdNa44',
        videoThumbnail: 'https://i.ytimg.com/vi/8pDqJVdNa44/hqdefault.jpg',
        overview: {
          description: 'Deep dive into the React 19 Compiler, automatic memoization AST transformations, and removing useMemo / useCallback boilerplate.',
          takeaways: [
            'How React Compiler optimizes re-render paths automatically.',
            'Eliminating unnecessary memoization hooks.',
            'Migration path for large-scale React codebases.',
          ],
        },
      },
      {
        id: 'l-web-2',
        title: '2. React Server Components (RSC) & Server Actions',
        duration: '24:15',
        completed: false,
        videoId: 'd5x00snACrU',
        videoThumbnail: 'https://i.ytimg.com/vi/d5x00snACrU/hqdefault.jpg',
        overview: {
          description: 'Building zero-JS form submissions using useActionState, useOptimistic, and Server Actions in modern React.',
          takeaways: [
            'Defining async server actions safely.',
            'Instant UI updates using useOptimistic hook.',
            'Handling mutation errors and pending indicators.',
          ],
        },
      },
      {
        id: 'l-web-3',
        title: '3. Next.js App Router Architecture & Parallel Routes',
        duration: '31:50',
        completed: false,
        videoId: 'wm5gMKCOsXg',
        videoThumbnail: 'https://i.ytimg.com/vi/wm5gMKCOsXg/hqdefault.jpg',
        overview: {
          description: 'Architecting high-scale web apps using Next.js App Router, layout caching, intercepting routes, and streaming SSR with Suspense.',
          takeaways: [
            'Layout hierarchies and nested route caching.',
            'Streaming HTML response chunks with React Suspense.',
            'Intercepting and parallel modal routing patterns.',
          ],
        },
      },
      {
        id: 'l-web-4',
        title: '4. State Management with Zustand & React Query',
        duration: '22:10',
        completed: false,
        videoId: 'KCr-UNsM3vA',
        videoThumbnail: 'https://i.ytimg.com/vi/KCr-UNsM3vA/hqdefault.jpg',
        overview: {
          description: 'Decoupling client component state with atomic Zustand stores and server-cache invalidation using TanStack React Query.',
          takeaways: [
            'Creating immutable Zustand store slices.',
            'Optimistic cache updates with React Query.',
            'Persisting state to LocalStorage seamlessly.',
          ],
        },
      },
      {
        id: 'l-web-5',
        title: '5. Tailwind CSS v4 & High-Performance Micro-Animations',
        duration: '19:30',
        completed: false,
        videoId: 'tS7upsfU21w',
        videoThumbnail: 'https://i.ytimg.com/vi/tS7upsfU21w/hqdefault.jpg',
        overview: {
          description: 'Mastering Tailwind CSS v4 `@theme` variables, CSS container queries, and 60fps hardware-accelerated animations.',
          takeaways: [
            'Configuring `@theme` design tokens in CSS.',
            'Container queries for ultra-responsive component layouts.',
            'Hardware-accelerated transform & opacity animations.',
          ],
        },
      },
    ],
  },

  // 3. DevOps Category: Go Microservices & Docker/K8s Playlist
  {
    id: 'c-devops-go',
    title: 'Go Microservices, Docker & Kubernetes Engineering',
    category: 'DevOps',
    difficulty: 'Intermediate',
    duration: '18h 10m',
    lessonsCount: '4 Lessons',
    price: '$99.00',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Alex Chen',
      role: 'Senior Go Systems Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    resources: [
      { id: 'r1', title: 'gRPC-Golang-Starter.zip', size: '2.5 MB', type: 'Archive' },
      { id: 'r2', title: 'K8s-Deployment-Manifests.yaml', size: '14 KB', type: 'YAML Manifest' },
    ],
    discussions: [],
    lessons: [
      {
        id: 'l-devops-1',
        title: '1. Go Language Fundamentals & Concurrency Primitives',
        duration: '26:40',
        completed: false,
        videoId: 'YS4e4q9oBaU',
        videoThumbnail: 'https://i.ytimg.com/vi/YS4e4q9oBaU/hqdefault.jpg',
        overview: {
          description: 'Mastering Go goroutines, channels, worker pools, mutex locks, and context cancellation patterns under high concurrency.',
          takeaways: [
            'Goroutine scheduler mechanics (M:N thread multiplexing).',
            'Buffered vs unbuffered channels for thread communication.',
            'Preventing race conditions with sync.Mutex and atomic ops.',
          ],
        },
      },
      {
        id: 'l-devops-2',
        title: '2. Implementing High-Performance gRPC Services in Go',
        duration: '34:10',
        completed: false,
        videoId: 'B6ZuuG6M9Qo',
        videoThumbnail: 'https://i.ytimg.com/vi/B6ZuuG6M9Qo/hqdefault.jpg',
        overview: {
          description: 'Writing Protocol Buffer schemas, generating Go stubs with protoc, and setting up unary & streaming gRPC handlers.',
          takeaways: [
            'Defining proto3 messages and gRPC service methods.',
            'Implementing server interfaces and interceptor middleware.',
            'Handling error codes and gRPC metadata headers.',
          ],
        },
      },
      {
        id: 'l-devops-3',
        title: '3. Multi-Stage Docker Builds & Minimal Container Security',
        duration: '22:30',
        completed: false,
        videoId: 'fqMOX6JJhGo',
        videoThumbnail: 'https://i.ytimg.com/vi/fqMOX6JJhGo/hqdefault.jpg',
        overview: {
          description: 'Building zero-vulnerability scratch and alpine Docker images for Go binaries with minimal layer caching.',
          takeaways: [
            'Writing multi-stage Dockerfiles for compiled languages.',
            'Reducing container image size from 800MB to 15MB.',
            'Non-root user execution and security hardening.',
          ],
        },
      },
      {
        id: 'l-devops-4',
        title: '4. Kubernetes Operator Pattern & Production Deployments',
        duration: '41:15',
        completed: false,
        videoId: 'X48VuDVv0do',
        videoThumbnail: 'https://i.ytimg.com/vi/X48VuDVv0do/hqdefault.jpg',
        overview: {
          description: 'Writing custom Kubernetes controllers in Go using client-go to automate container lifecycle management and scaling.',
          takeaways: [
            'Understanding Custom Resource Definitions (CRDs).',
            'Implementing reconciliation loops with client-go.',
            'Deploying production StatefulSets & Deployments.',
          ],
        },
      },
    ],
  },

  // 4. Cyber Category: Penetration Testing & Ethical Hacking Playlist
  {
    id: 'c-cyber-hack',
    title: 'Ethical Hacking & Network Security Operations',
    category: 'Cyber',
    difficulty: 'Advanced',
    duration: '16h 45m',
    lessonsCount: '4 Lessons',
    price: '$99.00',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Kelsey Hightower',
      role: 'Security Operations Lead',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
    },
    resources: [
      { id: 'r1', title: 'Ethical-Hacking-Lab-Setup.pdf', size: '2.2 MB', type: 'PDF' },
    ],
    discussions: [],
    lessons: [
      {
        id: 'l-cyber-1',
        title: '1. Ethical Hacking & Cybersecurity Fundamentals',
        duration: '28:10',
        completed: false,
        videoId: '3Kq1MIfTWCE',
        videoThumbnail: 'https://i.ytimg.com/vi/3Kq1MIfTWCE/hqdefault.jpg',
        overview: {
          description: 'Introduction to information security principles, threat modeling, reconnaissance methodology, and legal compliance.',
          takeaways: [
            'Understanding the CIA Triad (Confidentiality, Integrity, Availability).',
            'Passive vs active reconnaissance techniques.',
            'Setting up isolated penetration testing labs.',
          ],
        },
      },
      {
        id: 'l-cyber-2',
        title: '2. Linux Command Line & Bash Automation for Penetration Testers',
        duration: '35:20',
        completed: false,
        videoId: 'ZtqB5MRGJ5E',
        videoThumbnail: 'https://i.ytimg.com/vi/ZtqB5MRGJ5E/hqdefault.jpg',
        overview: {
          description: 'Mastering Linux file permissions, process management, regex searching with grep/awk, and writing automated bash scanners.',
          takeaways: [
            'Essential Linux administration and privilege escalation basics.',
            'Automating port scans and log analysis with bash scripts.',
            'Understanding environment variables and process injection.',
          ],
        },
      },
      {
        id: 'l-cyber-3',
        title: '3. Network Traffic Analysis & Wireshark Packet Inspection',
        duration: '31:45',
        completed: false,
        videoId: 'qiQR5rTSshw',
        videoThumbnail: 'https://i.ytimg.com/vi/qiQR5rTSshw/hqdefault.jpg',
        overview: {
          description: 'Analyzing TCP/IP handshakes, Wireshark display filters, packet dissection, and detecting malicious traffic signatures.',
          takeaways: [
            'Understanding TCP 3-way handshake and packet headers.',
            'Writing custom Wireshark display and capture filters.',
            'Detecting port scans and unencrypted credential transmission.',
          ],
        },
      },
      {
        id: 'l-cyber-4',
        title: '4. Web Application Penetration Testing & OWASP Top 10',
        duration: '39:00',
        completed: false,
        videoId: 'WnN6dbosJ0A',
        videoThumbnail: 'https://i.ytimg.com/vi/WnN6dbosJ0A/hqdefault.jpg',
        overview: {
          description: 'Exploiting SQL Injection, Cross-Site Scripting (XSS), CSRF, and Broken Access Control vulnerabilities safely in sandbox labs.',
          takeaways: [
            'Auditing web endpoints against OWASP Top 10 vulnerabilities.',
            'Constructing SQLi payloads and XSS proof-of-concepts.',
            'Remediating web application security flaws.',
          ],
        },
      },
    ],
  },

  // 5. Data Science Category: SQL Optimization & Indexing
  {
    id: 'c-data-sql',
    title: 'SQL Query Optimization & Database Indexing Internals',
    category: 'Data Science',
    difficulty: 'Advanced',
    duration: '12h 30m',
    lessonsCount: '3 Lessons',
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
        id: 'l-sql-1',
        title: '1. SQL Performance Tuning & Query Execution Plans',
        duration: '29:40',
        completed: false,
        videoId: 'HXV3zeQKqGY',
        videoThumbnail: 'https://i.ytimg.com/vi/HXV3zeQKqGY/hqdefault.jpg',
        overview: {
          description: 'Analyzing PostgreSQL & MySQL query planner outputs, EXPLAIN ANALYZE node costs, and identifying slow queries.',
          takeaways: [
            'Reading query execution plan nodes and cost estimates.',
            'Identifying full table scans vs index range scans.',
            'Optimizing JOIN orders and subquery expressions.',
          ],
        },
      },
      {
        id: 'l-sql-2',
        title: '2. Database Indexing Internals & B-Tree Page Storage',
        duration: '33:15',
        completed: false,
        videoId: 'clringp_MmA',
        videoThumbnail: 'https://i.ytimg.com/vi/clringp_MmA/hqdefault.jpg',
        overview: {
          description: 'Deep dive into B-Tree index page splitting, composite index column ordering, covering indexes, and index bloat maintenance.',
          takeaways: [
            'Understanding B-Tree depth and disk page I/O reduction.',
            'Designing covering indexes to avoid table lookups.',
            'Reindexing and maintaining healthy index statistics.',
          ],
        },
      },
      {
        id: 'l-sql-3',
        title: '3. Python for High-Performance Data Analysis & Pandas',
        duration: '37:50',
        completed: false,
        videoId: 'lhdREGzNFzE',
        videoThumbnail: 'https://i.ytimg.com/vi/lhdREGzNFzE/hqdefault.jpg',
        overview: {
          description: 'Using Python NumPy & Pandas vectorization to manipulate millions of data rows efficiently without Python loop overhead.',
          takeaways: [
            'Vectorized array operations vs Python loops.',
            'Memory optimization for large CSV & Parquet files.',
            'Merging and aggregating multi-gigabyte datasets.',
          ],
        },
      },
    ],
  },

  // 6. AI/ML Category: Neural Networks & Deep Learning
  {
    id: 'c-aiml-nn',
    title: 'Neural Networks, PyTorch & Transformer Architecture',
    category: 'AI/ML',
    difficulty: 'Intermediate',
    duration: '15h 45m',
    lessonsCount: '3 Lessons',
    price: '$110.00',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Dr. Evelyn Vance',
      role: 'AI Research Scientist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    resources: [],
    discussions: [],
    lessons: [
      {
        id: 'l-aiml-1',
        title: '1. Neural Networks & Backpropagation Math Visualized',
        duration: '21:00',
        completed: false,
        videoId: 'aircAruvnKk',
        videoThumbnail: 'https://i.ytimg.com/vi/aircAruvnKk/hqdefault.jpg',
        overview: {
          description: 'Mathematical intuition behind artificial neural networks, activation functions, gradient descent, and backpropagation via the chain rule.',
          takeaways: [
            'Understanding forward pass matrix multiplications.',
            'Deriving backpropagation gradients step-by-step.',
            'Stochastic Gradient Descent (SGD) & Adam optimizers.',
          ],
        },
      },
      {
        id: 'l-aiml-2',
        title: '2. Deep Learning with PyTorch & Convolutional Networks',
        duration: '36:10',
        completed: false,
        videoId: 'V_xro1bcAuA',
        videoThumbnail: 'https://i.ytimg.com/vi/V_xro1bcAuA/hqdefault.jpg',
        overview: {
          description: 'Writing custom PyTorch nn.Module classes, autograd Tensors, DataLoader pipelines, and GPU acceleration.',
          takeaways: [
            'Building custom PyTorch model architectures.',
            'Understanding GPU CUDA tensor allocations.',
            'Training loops with loss computation & validation metrics.',
          ],
        },
      },
      {
        id: 'l-aiml-3',
        title: '3. Transformer Models & Attention Mechanism from Scratch',
        duration: '44:30',
        completed: false,
        videoId: 'zjkBMFhNj_g',
        videoThumbnail: 'https://i.ytimg.com/vi/zjkBMFhNj_g/hqdefault.jpg',
        overview: {
          description: 'Building a Generative Pre-trained Transformer (GPT) language model from scratch in PyTorch following the Attention Is All You Need paper.',
          takeaways: [
            'Implementing Query, Key, and Value self-attention matrices.',
            'Causal masking for autoregressive language generation.',
            'Positional encodings and multi-head attention blocks.',
          ],
        },
      },
    ],
  },
];

// ==========================================
// Centralized Background Data Framework Manager
// ==========================================

export class CourseDataManager {
  private static cachedCourses: Course[] | null = null;

  /**
   * Retrieves all master courses, enriched with completed progress & saved state for user
   */
  public static async getCourses(category?: string | null, username: string = 'root'): Promise<Course[]> {
    let baseCourses = this.cachedCourses || MASTER_COURSES_FRAMEWORK;
    this.cachedCourses = baseCourses;

    // Fetch user progress from Firebase / LocalStorage
    try {
      const userProgress = await firebaseDb.getUserProgress(username);
      if (userProgress && userProgress.completedLessons) {
        baseCourses = baseCourses.map(course => {
          const completedIds = userProgress.completedLessons[course.id] || [];
          return {
            ...course,
            lessons: course.lessons.map(lesson => ({
              ...lesson,
              completed: completedIds.includes(lesson.id),
            })),
          };
        });
      }
    } catch (e) {
      console.warn('[CourseDataManager] User progress fetch error', e);
    }

    if (!category) return baseCourses;
    return baseCourses.filter(c => c.category === category);
  }

  /**
   * Returns a single course by ID
   */
  public static async getCourse(courseId: string, username: string = 'root'): Promise<Course | null> {
    const courses = await this.getCourses(null, username);
    return courses.find(c => c.id === courseId) || null;
  }

  /**
   * Automatically updates lesson completion and syncs background persistence
   */
  public static async updateLessonProgress(
    courseId: string,
    lessonId: string,
    username: string = 'root'
  ): Promise<Course[]> {
    const currentCourses = this.cachedCourses || MASTER_COURSES_FRAMEWORK;
    
    // Toggle lesson completed state
    const updatedCourses = currentCourses.map(c => {
      if (c.id !== courseId) return c;
      return {
        ...c,
        lessons: c.lessons.map(l => (l.id === lessonId ? { ...l, completed: !l.completed } : l)),
      };
    });

    this.cachedCourses = updatedCourses;

    // Construct completedLessons map
    const completedMap: Record<string, string[]> = {};
    updatedCourses.forEach(c => {
      completedMap[c.id] = c.lessons.filter(l => l.completed).map(l => l.id);
    });

    // Get current saved courses
    const currentProgress = await firebaseDb.getUserProgress(username);
    const savedCourses = currentProgress.savedCourses || [];

    // Background push to Firebase & LocalStorage
    await firebaseDb.saveUserProgress({
      username,
      completedLessons: completedMap,
      savedCourses,
    });

    return updatedCourses;
  }

  /**
   * Toggles course saved bookmark state
   */
  public static async toggleBookmark(courseId: string, username: string = 'root'): Promise<string[]> {
    const currentProgress = await firebaseDb.getUserProgress(username);
    const prevSaved = currentProgress.savedCourses || [];
    const isSaved = prevSaved.includes(courseId);
    
    const nextSaved = isSaved
      ? prevSaved.filter(id => id !== courseId)
      : [...prevSaved, courseId];

    await firebaseDb.saveUserProgress({
      username,
      completedLessons: currentProgress.completedLessons || {},
      savedCourses: nextSaved,
    });

    return nextSaved;
  }

  /**
   * Helper to format youtube-nocookie embed URL for any lesson video ID
   */
  public static getLessonVideoUrl(videoId?: string): string {
    const id = (videoId || 'CYtO1q6zfgA').trim();
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&enablejsapi=1&rel=0`;
  }
}
