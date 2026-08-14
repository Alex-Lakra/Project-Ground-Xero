import React, { useState, useMemo } from 'react';
import {
  Play,
  Pause,
  CheckCircle2,
  Circle,
  Clock,
  ArrowLeft,
  BookOpen,
  Shield,
  Cpu,
  Layers,
  Terminal,
  User,
  Star,
  Award,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Volume2,
  VolumeX,
  Maximize2,
  Search,
  Check
} from 'lucide-react';

// ==========================================
// Data Types & Interfaces
// ==========================================

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  summary: string;
  completed: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  category: 'Security' | 'AI & ML' | 'Architecture' | 'Low-Level';
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  image: string;
  mentor: {
    name: string;
    role: string;
    avatar: string;
    rating: number;
  };
  modules: CourseModule[];
}

// ==========================================
// Mock Data — Cyberpunk Courses Suite
// ==========================================

const SAMPLE_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Matrix Kernel Exploitation & Low-Level Security',
    category: 'Low-Level',
    description: 'Master binary memory analysis, buffer overflow mitigation, and zero-day kernel intrusion techniques in virtual mainframe kernels.',
    difficulty: 'Advanced',
    duration: '14h 30m',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Alex_Lakra',
      role: 'Root Systems Architect',
      avatar: 'https://lh3.googleusercontent.com/d/1j0nNw_HFwqT3bm1I24g96UF7hsvhn9Xr',
      rating: 4.98,
    },
    modules: [
      {
        id: 'm1_1',
        title: 'Module 01 // Memory Subsystems & Registers',
        lessons: [
          {
            id: 'l1_1',
            title: '1.1 Assembly Basics & Instruction Pointers',
            duration: '18m 40s',
            summary: 'Understanding x86_64 CPU register allocation, stack frame creation, and instruction pointer manipulation.',
            completed: true,
          },
          {
            id: 'l1_2',
            title: '1.2 Stack Buffer Overflows & Shellcode Injection',
            duration: '24m 15s',
            summary: 'Crafting custom NOP sleds and injecting non-null byte payload shellcode into vulnerable binary targets.',
            completed: true,
          },
          {
            id: 'l1_3',
            title: '1.3 Bypassing ASLR & DEP Mitigation Protections',
            duration: '32m 10s',
            summary: 'Constructing Return-Oriented Programming (ROP) chains to execute arbitrary machine code bypassing stack execution flags.',
            completed: false,
          },
        ],
      },
      {
        id: 'm1_2',
        title: 'Module 02 // Mainframe Kernel Exploitation',
        lessons: [
          {
            id: 'l1_4',
            title: '2.1 Kernel Ring 0 Privilege Escalation',
            duration: '28m 50s',
            summary: 'Analyzing kernel drivers, heap spraying primitives, and escalating process tokens to root operator status.',
            completed: false,
          },
          {
            id: 'l1_5',
            title: '2.2 Real-time Memory Forensics & Sentinel Evasion',
            duration: '35m 00s',
            summary: 'Evading automated Sentinel heuristic detectors by obfuscating syscall signatures during live intrusion payloads.',
            completed: false,
          },
        ],
      },
    ],
  },
  {
    id: 'c2',
    title: 'Quantum Neural Networks & AI Construct Design',
    category: 'AI & ML',
    description: 'Build self-adapting neural constructs, quantum tensor transformers, and synthetic cognition models in low-latency environments.',
    difficulty: 'Intermediate',
    duration: '18h 45m',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Dr. Sarah Vance',
      role: 'Quantum Cognition Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 4.95,
    },
    modules: [
      {
        id: 'm2_1',
        title: 'Module 01 // Foundations of Synthetic Intelligence',
        lessons: [
          {
            id: 'l2_1',
            title: '1.1 Multi-Dimensional Tensor Spaces',
            duration: '22m 10s',
            summary: 'Mathematical foundations of multi-dimensional latent vectors and quantum superposition tensor calculations.',
            completed: true,
          },
          {
            id: 'l2_2',
            title: '1.2 Self-Attending Construct Transformers',
            duration: '29m 45s',
            summary: 'Designing sparse attention heads capable of context processing across gigabyte-scale memory streams.',
            completed: false,
          },
        ],
      },
      {
        id: 'm2_2',
        title: 'Module 02 // Autonomous Decision Agents',
        lessons: [
          {
            id: 'l2_3',
            title: '2.1 Reinforcement Learning in Adversarial Environments',
            duration: '31m 20s',
            summary: 'Training RL models to adapt to dynamic network topology shifts under live simulated cyber threat conditions.',
            completed: false,
          },
        ],
      },
    ],
  },
  {
    id: 'c3',
    title: 'Cloud-Native Distributed Infrastructure & Mesh',
    category: 'Architecture',
    description: 'Design zero-trust microservice meshes, auto-healing container clusters, and global distributed data pipelines.',
    difficulty: 'Intermediate',
    duration: '12h 15m',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Kelsey Hightower',
      role: 'Distro Systems Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 4.92,
    },
    modules: [
      {
        id: 'm3_1',
        title: 'Module 01 // Zero-Trust Microservice Mesh',
        lessons: [
          {
            id: 'l3_1',
            title: '1.1 mTLS Service Identity & Envoy Sidecars',
            duration: '25m 30s',
            summary: 'Configuring cryptographically secure mutual TLS authentication between microservice endpoints in transit.',
            completed: true,
          },
          {
            id: 'l3_2',
            title: '1.2 Auto-Scaling Sub-Channel Nodes',
            duration: '20m 15s',
            summary: 'Implementing horizontal pod auto-scalers based on custom Prometheus network metrics.',
            completed: false,
          },
        ],
      },
    ],
  },
  {
    id: 'c4',
    title: 'Offensive Cyber Intrusion & Sentinel Bypass',
    category: 'Security',
    description: 'Advanced penetration testing, automated vulnerability scanning, and real-time defense evasion methodologies.',
    difficulty: 'Advanced',
    duration: '16h 00m',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Cypher_X',
      role: 'Intrusion Specialist',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      rating: 4.99,
    },
    modules: [
      {
        id: 'm4_1',
        title: 'Module 01 // Network Intrusion Vectors',
        lessons: [
          {
            id: 'l4_1',
            title: '1.1 Port Scanning & Service Fingerprinting',
            duration: '19m 40s',
            summary: 'Stealth SYN scanning, OS detection, and Banner grabbing without triggering network IDS alerts.',
            completed: false,
          },
          {
            id: 'l4_2',
            title: '1.2 Command Injection & Lateral Movement',
            duration: '27m 50s',
            summary: 'Pivoting through compromised gateways to gain domain access across internal network subnets.',
            completed: false,
          },
        ],
      },
    ],
  },
];

// CATEGORIES FILTER OPTIONS
const CATEGORIES = ['All', 'Security', 'AI & ML', 'Architecture', 'Low-Level'] as const;

export default function CoursesView() {
  // ==========================================
  // View State Management
  // ==========================================
  const [coursesData, setCoursesData] = useState<Course[]>(SAMPLE_COURSES);
  const [viewMode, setViewMode] = useState<'catalog' | 'player'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Player Active States
  const [selectedCourseId, setSelectedCourseId] = useState<string>(SAMPLE_COURSES[0].id);
  const [activeLessonId, setActiveLessonId] = useState<string>(SAMPLE_COURSES[0].modules[0].lessons[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // ==========================================
  // Derived State & Computations
  // ==========================================

  // Active selected course object
  const activeCourse = useMemo(() => {
    return coursesData.find((c) => c.id === selectedCourseId) || coursesData[0];
  }, [coursesData, selectedCourseId]);

  // Active selected lesson object
  const activeLesson = useMemo(() => {
    for (const mod of activeCourse.modules) {
      const found = mod.lessons.find((l) => l.id === activeLessonId);
      if (found) return found;
    }
    return activeCourse.modules[0]?.lessons[0];
  }, [activeCourse, activeLessonId]);

  // Automatic Course Progress Calculation (% completed)
  const calculateCourseProgress = (course: Course): number => {
    let total = 0;
    let completed = 0;
    course.modules.forEach((m) => {
      m.lessons.forEach((l) => {
        total++;
        if (l.completed) completed++;
      });
    });
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  // Filtered courses for Catalog view
  const filteredCourses = useMemo(() => {
    return coursesData.filter((course) => {
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [coursesData, selectedCategory, searchQuery]);

  // ==========================================
  // Handlers & Actions
  // ==========================================

  // Open course player
  const handleLaunchCourse = (courseId: string, lessonId?: string) => {
    const course = coursesData.find((c) => c.id === courseId) || coursesData[0];
    setSelectedCourseId(courseId);
    if (lessonId) {
      setActiveLessonId(lessonId);
    } else {
      // Pick first lesson or first uncompleted lesson
      let firstUncompleted: string | null = null;
      for (const mod of course.modules) {
        for (const les of mod.lessons) {
          if (!les.completed && !firstUncompleted) {
            firstUncompleted = les.id;
          }
        }
      }
      setActiveLessonId(firstUncompleted || course.modules[0]?.lessons[0]?.id || '');
    }
    setViewMode('player');
    setIsPlaying(true);
  };

  // Toggle active lesson completion state
  const handleToggleLessonComplete = (lessonId: string) => {
    setCoursesData((prevCourses) =>
      prevCourses.map((course) => {
        if (course.id !== activeCourse.id) return course;
        return {
          ...course,
          modules: course.modules.map((mod) => ({
            ...mod,
            lessons: mod.lessons.map((les) => {
              if (les.id === lessonId) {
                return { ...les, completed: !les.completed };
              }
              return les;
            }),
          })),
        };
      })
    );
  };

  // ==========================================
  // RENDER: ACTIVE PLAYER VIEW
  // ==========================================
  if (viewMode === 'player') {
    const activeProgress = calculateCourseProgress(activeCourse);

    return (
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6 select-none animate-fadeIn">
        {/* Top Breadcrumb & Return Button */}
        <div className="flex items-center justify-between border-b border-[#434752] pb-4">
          <button
            onClick={() => setViewMode('catalog')}
            className="inline-flex items-center space-x-2 font-mono text-xs text-[#aec6ff] hover:text-white border border-[#434752] hover:border-[#aec6ff] px-3.5 py-2 rounded-lg bg-[#181c24] transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Learning Hub</span>
          </button>
          <div className="flex items-center space-x-3 text-xs font-mono text-[#8d909d]">
            <span className="hidden md:inline text-[#c3c6d4]">COURSES // SECTOR 07</span>
            <span>&gt;</span>
            <span className="text-[#aec6ff] font-bold truncate max-w-[200px] md:max-w-xs">{activeCourse.title}</span>
          </div>
        </div>

        {/* Responsive 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ==================================================== */}
          {/* LEFT COLUMN (8 Cols): Video Player HUD & Lesson Info */}
          {/* ==================================================== */}
          <div className="lg:col-span-8 space-y-6">
            {/* Cyberpunk Video Player Container */}
            <div className="relative bg-black border border-[#434752] rounded-xl overflow-hidden shadow-2xl group">
              {/* Video Frame Simulation Aspect Ratio (16:9) */}
              <div className="relative aspect-video bg-[#05070a] flex items-center justify-center overflow-hidden">
                {/* Background Course Image with Dark Overlay */}
                <img
                  src={activeCourse.image}
                  alt={activeCourse.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isPlaying ? 'scale-105 filter brightness-[0.4] contrast-125' : 'filter brightness-[0.3]'
                  }`}
                />

                {/* Cyberpunk CRT Scanline Layer */}
                <div className="absolute inset-0 scanline-overlay opacity-20 pointer-events-none" />

                {/* Matrix HUD Overlay Grid */}
                <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 font-mono text-[10px] uppercase text-[#aec6ff] bg-black/80 px-2.5 py-1 border border-[#aec6ff]/30 rounded">
                  <span className="w-2 h-2 rounded-full bg-[#85da76] animate-ping" />
                  <span>FEED: LIVE_ENCRYPTED // 1080P_HQ</span>
                </div>

                <div className="absolute top-4 right-4 z-20 font-mono text-[10px] text-[#8d909d] bg-black/80 px-2.5 py-1 border border-[#434752] rounded">
                  {activeLesson.duration}
                </div>

                {/* Center Big Play/Pause Action Indicator */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute z-30 w-16 h-16 rounded-full bg-[#aec6ff]/20 border-2 border-[#aec6ff] text-[#aec6ff] flex items-center justify-center hover:scale-110 hover:bg-[#aec6ff] hover:text-black transition-all cursor-pointer shadow-[0_0_20px_rgba(174,198,255,0.4)]"
                  aria-label={isPlaying ? 'Pause Lesson' : 'Play Lesson'}
                >
                  {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>

                {/* Bottom Video Controls HUD Bar */}
                <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex flex-col space-y-2">
                  {/* Timeline Bar */}
                  <div className="w-full bg-[#31353d] h-1.5 rounded-full overflow-hidden cursor-pointer group/line">
                    <div
                      className="bg-[#aec6ff] h-full transition-all duration-300 relative"
                      style={{ width: isPlaying ? '64%' : '30%' }}
                    />
                  </div>

                  {/* Controls Row */}
                  <div className="flex items-center justify-between text-xs font-mono text-[#c3c6d4] pt-1">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-[#ffb4ab]" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <span className="text-[11px] text-[#8d909d]">
                        {isPlaying ? '12:45' : '05:10'} / {activeLesson.duration}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[10px] text-[#aec6ff] uppercase font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-[#ffb86a]" />
                      <span>{activeCourse.category}</span>
                      <Maximize2 className="w-3.5 h-3.5 ml-2 cursor-pointer hover:text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Info Header & Action Control Bar */}
            <div className="bg-[#181c24] border border-[#434752] rounded-xl p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#434752] pb-4">
                <div>
                  <span className="font-mono text-[10px] text-[#aec6ff] font-bold uppercase tracking-widest bg-[#aec6ff]/10 border border-[#aec6ff]/20 px-2.5 py-0.5 rounded">
                    CURRENT LESSON
                  </span>
                  <h1 className="text-xl md:text-2xl font-bold text-[#dfe2ed] mt-2 leading-snug">
                    {activeLesson.title}
                  </h1>
                </div>

                {/* Mark Complete Toggle Button */}
                <button
                  onClick={() => handleToggleLessonComplete(activeLesson.id)}
                  className={`inline-flex items-center space-x-2 font-mono text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg border transition-all cursor-pointer select-none ${
                    activeLesson.completed
                      ? 'bg-[#85da76]/15 border-[#85da76] text-[#85da76] hover:bg-[#85da76]/25'
                      : 'bg-[#31353d] border-[#434752] text-[#c3c6d4] hover:border-[#aec6ff] hover:text-white'
                  }`}
                >
                  {activeLesson.completed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#85da76]" />
                      <span>COMPLETED</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4" />
                      <span>MARK COMPLETE</span>
                    </>
                  )}
                </button>
              </div>

              {/* Lesson Summary & Key Concepts */}
              <div className="space-y-3">
                <h3 className="font-mono text-xs uppercase font-bold text-[#8d909d] tracking-wider">
                  Lesson Overview & Objectives
                </h3>
                <p className="text-sm text-[#c3c6d4] leading-relaxed font-sans">
                  {activeLesson.summary}
                </p>
              </div>

              {/* Instructor Metadata Card */}
              <div className="pt-4 border-t border-[#434752] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={activeCourse.mentor.avatar}
                    alt={activeCourse.mentor.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#aec6ff]"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#dfe2ed]">{activeCourse.mentor.name}</h4>
                    <p className="text-xs text-[#8d909d] font-mono">{activeCourse.mentor.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 bg-[#ffb86a]/10 border border-[#ffb86a]/30 px-2.5 py-1 rounded text-xs font-mono text-[#ffb86a]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold">{activeCourse.mentor.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN (4 Cols): Course Curriculum Sidebar & Playlist */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#181c24] border border-[#434752] rounded-xl p-5 space-y-5 sticky top-6">
              {/* Header & Course Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#dfe2ed]">
                    COURSE CURRICULUM
                  </h3>
                  <span className="font-mono text-xs font-bold text-[#aec6ff]">{activeProgress}% COMPLETE</span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-[#31353d] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#628fea] to-[#aec6ff] transition-all duration-500"
                    style={{ width: `${activeProgress}%` }}
                  />
                </div>
              </div>

              {/* Modules & Lessons Playlist Accordion */}
              <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 no-scrollbar">
                {activeCourse.modules.map((module, mIdx) => (
                  <div key={module.id} className="border border-[#434752] rounded-lg bg-[#14171f] overflow-hidden">
                    {/* Module Title Header */}
                    <div className="bg-[#1c2028] px-3.5 py-2.5 border-b border-[#434752] flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#aec6ff] truncate">
                        {module.title}
                      </span>
                      <span className="text-[10px] font-mono text-[#8d909d]">
                        {module.lessons.length} LESSONS
                      </span>
                    </div>

                    {/* Lesson Items Playlist */}
                    <div className="divide-y divide-[#434752]/50">
                      {module.lessons.map((lesson) => {
                        const isActive = lesson.id === activeLesson.id;
                        return (
                          <div
                            key={lesson.id}
                            onClick={() => {
                              setActiveLessonId(lesson.id);
                              setIsPlaying(true);
                            }}
                            className={`px-3.5 py-3 flex items-start justify-between cursor-pointer transition-colors group ${
                              isActive
                                ? 'bg-[#628fea]/15 text-white font-medium border-l-2 border-[#aec6ff]'
                                : 'hover:bg-[#31353d]/50 text-[#c3c6d4]'
                            }`}
                          >
                            <div className="flex items-start space-x-2.5 min-w-0 pr-2">
                              {/* Completion or Active Playing Indicator */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleLessonComplete(lesson.id);
                                }}
                                className="mt-0.5 text-[#8d909d] hover:text-[#85da76] transition-colors cursor-pointer"
                              >
                                {lesson.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-[#85da76]" />
                                ) : isActive ? (
                                  <Play className="w-4 h-4 text-[#aec6ff] fill-current animate-pulse" />
                                ) : (
                                  <Circle className="w-4 h-4" />
                                )}
                              </button>

                              <div>
                                <h4
                                  className={`text-xs leading-snug line-clamp-2 ${
                                    isActive ? 'text-[#aec6ff] font-bold' : 'group-hover:text-white'
                                  }`}
                                >
                                  {lesson.title}
                                </h4>
                                <div className="flex items-center space-x-2 text-[10px] font-mono text-[#8d909d] mt-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{lesson.duration}</span>
                                </div>
                              </div>
                            </div>

                            {lesson.completed && (
                              <span className="text-[10px] font-mono font-bold text-[#85da76] uppercase">DONE</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: CATALOG VIEW
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-8 select-none animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="bg-[#181c24] border border-[#434752] rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-[#aec6ff] text-black font-mono text-[10px] px-3 py-1 font-bold uppercase tracking-widest rounded-bl-lg">
          SECTOR 07 // LEARNING HUB
        </div>
        <div className="max-w-2xl space-y-2">
          <span className="font-mono text-xs text-[#aec6ff] tracking-[0.2em] font-bold uppercase">
            CYBERPUNK ACADEMY
          </span>
          <h1 className="text-3xl md:text-4xl font-anton text-white tracking-wide uppercase">
            LEARNING DISCIPLINES & COURSES
          </h1>
          <p className="font-sans text-sm text-[#c3c6d4] leading-relaxed">
            Acquire specialized technical skills across Low-Level Kernel Exploitation, Quantum AI Constructs, Zero-Trust Cloud Architecture, and Cyber Defense.
          </p>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`font-mono text-xs font-bold uppercase px-3.5 py-2 rounded-lg border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#aec6ff] border-[#aec6ff] text-black shadow-[0_0_12px_rgba(174,198,255,0.4)]'
                  : 'bg-[#181c24] border-[#434752] text-[#c3c6d4] hover:border-[#aec6ff] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8d909d]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses or modules..."
            className="w-full bg-[#181c24] border border-[#434752] focus:border-[#aec6ff] rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-[#dfe2ed] placeholder-[#8d909d] outline-none transition-colors"
          />
        </div>
      </div>

      {/* 3. Main Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => {
          const progress = calculateCourseProgress(course);
          const isStarted = progress > 0;

          return (
            <div
              key={course.id}
              className="bg-[#181c24] border border-[#434752] rounded-xl overflow-hidden flex flex-col justify-between group hover:border-[#aec6ff]/60 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(174,198,255,0.15)]"
            >
              <div>
                {/* Course Card Cover Image & Badges */}
                <div className="relative aspect-video overflow-hidden bg-black">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-black/80 border border-[#aec6ff]/40 text-[#aec6ff] rounded">
                      {course.category}
                    </span>
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-black/80 border border-[#434752] text-[#8d909d] rounded">
                      {course.difficulty}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 font-mono text-[10px] text-white bg-black/80 px-2 py-1 rounded border border-[#434752] flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-[#aec6ff]" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Course Content Details */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[#c3c6d4] line-clamp-2 leading-relaxed font-sans">
                    {course.description}
                  </p>

                  {/* Mentor Info Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#434752]/50">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={course.mentor.avatar}
                        alt={course.mentor.name}
                        className="w-7 h-7 rounded-full object-cover border border-[#434752]"
                      />
                      <div className="text-xs font-mono">
                        <span className="text-[#dfe2ed] font-semibold block">{course.mentor.name}</span>
                        <span className="text-[10px] text-[#8d909d]">{course.mentor.role}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 font-mono text-xs text-[#ffb86a]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold">{course.mentor.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Progress & Action Button */}
              <div className="p-5 pt-0 space-y-3">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-[#8d909d] mb-1">
                    <span>PROGRESS</span>
                    <span className="text-[#aec6ff] font-bold">{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#31353d] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#aec6ff] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Launch Button */}
                <button
                  onClick={() => handleLaunchCourse(course.id)}
                  className="w-full bg-[#31353d] hover:bg-[#aec6ff] text-[#dfe2ed] hover:text-black font-mono text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg border border-[#434752] hover:border-[#aec6ff] transition-all flex items-center justify-center space-x-2 cursor-pointer group/btn shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current group-hover/btn:text-black" />
                  <span>{isStarted ? 'RESUME COURSE' : 'LAUNCH COURSE'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Empty State Filter Result Fallback */}
      {filteredCourses.length === 0 && (
        <div className="bg-[#181c24] border border-[#434752] rounded-xl p-12 text-center space-y-3 font-mono">
          <BookOpen className="w-12 h-12 text-[#8d909d] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-white uppercase">No Courses Found</h3>
          <p className="text-xs text-[#8d909d]">No learning modules matched your current filter criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-2 text-xs text-[#aec6ff] underline hover:text-white cursor-pointer"
          >
            Reset Catalog Filters
          </button>
        </div>
      )}
    </div>
  );
}
