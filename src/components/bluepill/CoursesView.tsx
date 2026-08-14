import React, { useState } from 'react';
import {
  Play,
  Pause,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  RotateCw,
  Shield,
  Cpu,
  Layers,
  Terminal,
  Star,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bookmark,
  History,
  Award,
  Check,
  User
} from 'lucide-react';

// ==========================================
// Types Definitions
// ==========================================

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  summary: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  category: 'Security' | 'AI & ML' | 'Architecture' | 'Low-Level';
  instructor: {
    name: string;
    role: string;
    avatar: string;
    rating: string;
  };
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  description: string;
  image: string;
  modules: Module[];
}

// ==========================================
// Initial Courses Data
// ==========================================

const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Matrix Kernel Intrusion & Zero-Day Security',
    category: 'Security',
    difficulty: 'Advanced',
    duration: '12h 45m',
    description: 'Master low-level kernel memory exploitation, buffer overflow analysis, and intrusion bypass techniques inside hardened virtual mainframe constructs.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Sarah Drasner',
      role: 'Lead Security Researcher',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: '4.98',
    },
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Memory Corruption & Stack Exploits',
        lessons: [
          {
            id: 'l1',
            title: '1.1 Fundamentals of X86 Memory Layout',
            duration: '14:20',
            completed: true,
            summary: 'Understanding process memory maps, stack frames, base pointers, and instruction pointer registers under Linux kernels.',
          },
          {
            id: 'l2',
            title: '1.2 Crafting Buffer Overflow Payloads',
            duration: '18:45',
            completed: true,
            summary: 'Step-by-step construction of NOP sleds, shellcode injection, and overwriting return addresses.',
          },
          {
            id: 'l3',
            title: '1.3 Bypassing ASLR & DEP Protection',
            duration: '22:10',
            completed: false,
            summary: 'Advanced Return-Oriented Programming (ROP) chain generation to bypass Data Execution Prevention and Address Space Layout Randomization.',
          },
        ],
      },
      {
        id: 'm2',
        title: 'Module 2: Kernel Hooking & Rootkits',
        lessons: [
          {
            id: 'l4',
            title: '2.1 Loadable Kernel Module (LKM) Injection',
            duration: '16:05',
            completed: false,
            summary: 'Writing custom kernel modules to intercept system calls and manipulate process tables in real-time.',
          },
          {
            id: 'l5',
            title: '2.2 Evasion of Sentinel Intrusion Monitors',
            duration: '20:30',
            completed: false,
            summary: 'Techniques for suppressing kernel audit logs, obfuscating hooks, and maintaining stealth persistence.',
          },
        ],
      },
    ],
  },
  {
    id: 'c2',
    title: 'Neural Matrix & Autonomous Agent Architecture',
    category: 'AI & ML',
    difficulty: 'Intermediate',
    duration: '15h 20m',
    description: 'Build state-of-the-art Transformer models, multi-agent orchestrators, and autonomous reasoning loops tailored for complex digital constructs.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Dr. Evelyn Vance',
      role: 'AI Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      rating: '4.95',
    },
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Transformer Model Foundations',
        lessons: [
          {
            id: 'l1',
            title: '1.1 Multi-Head Self-Attention Mechanics',
            duration: '15:10',
            completed: true,
            summary: 'Mathematical breakdown and PyTorch implementation of Query, Key, and Value projection matrices.',
          },
          {
            id: 'l2',
            title: '1.2 Positional Encodings & Context Windows',
            duration: '19:40',
            completed: false,
            summary: 'Comparing Rotary Position Embeddings (RoPE) and ALiBi for extending context window scalability.',
          },
        ],
      },
      {
        id: 'm2',
        title: 'Module 2: Autonomous Agent Swarms',
        lessons: [
          {
            id: 'l3',
            title: '2.1 ReAct Prompting & Tool Invocation',
            duration: '21:15',
            completed: false,
            summary: 'Designing dynamic execution loops allowing autonomous models to run CLI commands and API calls.',
          },
          {
            id: 'l4',
            title: '2.2 Multi-Agent Consensus & Debate Loops',
            duration: '24:50',
            completed: false,
            summary: 'Orchestrating agent swarms with designated roles (Planner, Executor, Evaluator) for zero-error execution.',
          },
        ],
      },
    ],
  },
  {
    id: 'c3',
    title: 'Cloud Native Distributed Systems & Consensus',
    category: 'Architecture',
    difficulty: 'Intermediate',
    duration: '22h 10m',
    description: 'Design ultra-resilient distributed architectures using Raft consensus, gRPC streaming, microservices, and Kubernetes operator patterns.',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Kelsey Hightower',
      role: 'Principal Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
      rating: '4.92',
    },
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Distributed Consensus & Raft Protocol',
        lessons: [
          {
            id: 'l1',
            title: '1.1 Leader Election & Term Transitions',
            duration: '17:30',
            completed: true,
            summary: 'Understanding Raft RPC heartbeats, election timeouts, and split-vote mitigation.',
          },
          {
            id: 'l2',
            title: '1.2 Log Replication & State Machine Safety',
            duration: '25:00',
            completed: true,
            summary: 'Ensuring atomic log commit indices and handling network partitions cleanly.',
          },
        ],
      },
      {
        id: 'm2',
        title: 'Module 2: High-Throughput gRPC Streaming',
        lessons: [
          {
            id: 'l3',
            title: '2.1 Protocol Buffers Schema Design',
            duration: '14:45',
            completed: false,
            summary: 'Defining optimal proto3 schemas with backwards compatibility and efficient binary serialization.',
          },
          {
            id: 'l4',
            title: '2.2 Bidirectional Streaming Pipelines',
            duration: '28:10',
            completed: false,
            summary: 'Implementing multiplexed streaming connections with backpressure control.',
          },
        ],
      },
    ],
  },
  {
    id: 'c4',
    title: 'Low-Level Rust & Custom OS Kernel Drivers',
    category: 'Low-Level',
    difficulty: 'Advanced',
    duration: '18h 40m',
    description: 'Write bare-metal operating system drivers, inline assembly routines, and memory-safe hardware abstraction layers in Systems Rust.',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Hitesh Choudhary',
      role: 'Kernel Systems Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: '4.96',
    },
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Bare-Metal Rust Initialization',
        lessons: [
          {
            id: 'l1',
            title: '1.1 Building no_std Binaries for Bare Metal',
            duration: '16:40',
            completed: true,
            summary: 'Disabling standard library allocations, implementing panic handlers, and configuring target specification JSON files.',
          },
          {
            id: 'l2',
            title: '1.2 Writing a VGA Text Buffer Driver',
            duration: '21:15',
            completed: false,
            summary: 'Direct memory mapping to 0xb8000 to output colored text directly to hardware framebuffers.',
          },
        ],
      },
      {
        id: 'm2',
        title: 'Module 2: Interrupt Handler & Page Tables',
        lessons: [
          {
            id: 'l3',
            title: '2.1 Global Descriptor Table (GDT) Setup',
            duration: '19:50',
            completed: false,
            summary: 'Configuring code and data segments for 64-bit long mode switching.',
          },
          {
            id: 'l4',
            title: '2.2 Handling CPU Exceptions & Double Faults',
            duration: '23:30',
            completed: false,
            summary: 'Implementing Interrupt Descriptor Tables (IDT) and Interrupt Service Routines in Rust.',
          },
        ],
      },
    ],
  },
];

export default function CoursesView() {
  // ==========================================
  // State Definitions
  // ==========================================
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Navigation / View State: null = Catalog View, Course = Active Player View
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string>('');
  
  // Player Controls State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<string>('1.0x');
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});

  // Categories list
  const categories = ['All', 'Security', 'AI & ML', 'Architecture', 'Low-Level'];

  // ==========================================
  // Helper Calculations
  // ==========================================

  const calculateCourseProgress = (course: Course): number => {
    let total = 0;
    let completed = 0;
    course.modules.forEach(m => {
      m.lessons.forEach(l => {
        total++;
        if (l.completed) completed++;
      });
    });
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const getFilteredCourses = () => {
    if (selectedCategory === 'All') return courses;
    return courses.filter(c => c.category === selectedCategory);
  };

  // ==========================================
  // Action Handlers
  // ==========================================

  const handleLaunchCourse = (course: Course, targetLessonId?: string) => {
    setActiveCourse(course);
    setIsPlaying(true);
    
    // Default to target lesson or first lesson
    if (targetLessonId) {
      setActiveLessonId(targetLessonId);
    } else {
      const firstLesson = course.modules[0]?.lessons[0]?.id || '';
      setActiveLessonId(firstLesson);
    }
  };

  const handleExitPlayer = () => {
    setActiveCourse(null);
    setIsPlaying(false);
  };

  const handleToggleLessonComplete = (courseId: string, lessonId: string) => {
    setCourses(prevCourses =>
      prevCourses.map(course => {
        if (course.id !== courseId) return course;

        const updatedModules = course.modules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson =>
            lesson.id === lessonId ? { ...lesson, completed: !lesson.completed } : lesson
          ),
        }));

        return { ...course, modules: updatedModules };
      })
    );

    // Update active course state in real time
    if (activeCourse && activeCourse.id === courseId) {
      setActiveCourse(prev => {
        if (!prev) return null;
        const updatedModules = prev.modules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson =>
            lesson.id === lessonId ? { ...lesson, completed: !lesson.completed } : lesson
          ),
        }));
        return { ...prev, modules: updatedModules };
      });
    }
  };

  const toggleModuleCollapse = (moduleId: string) => {
    setCollapsedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  // Find currently playing active lesson object
  const getActiveLesson = (): Lesson | null => {
    if (!activeCourse) return null;
    for (const mod of activeCourse.modules) {
      for (const les of mod.lessons) {
        if (les.id === activeLessonId) return les;
      }
    }
    return activeCourse.modules[0]?.lessons[0] || null;
  };

  const activeLesson = getActiveLesson();

  // ==========================================
  // RENDER VIEW STATE 2: ACTIVE PLAYER VIEW
  // ==========================================
  if (activeCourse) {
    const progressPercent = calculateCourseProgress(activeCourse);
    const isCurrentCompleted = activeLesson?.completed || false;

    return (
      <div className="py-6 px-4 md:px-8 max-w-[1400px] mx-auto text-[#dfe2ed] select-none space-y-6">
        
        {/* Top Breadcrumb Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#181c24] border border-[#434752] rounded-xl p-4">
          <button
            onClick={handleExitPlayer}
            className="flex items-center gap-2 text-xs font-mono font-bold text-[#aec6ff] hover:text-white bg-[#628fea]/10 hover:bg-[#628fea]/20 border border-[#628fea]/30 px-3.5 py-2 rounded-lg transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Learning Hub</span>
          </button>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-mono text-[#8d909d] uppercase block">ACTIVE COURSE</span>
              <span className="text-xs font-bold text-[#dfe2ed] truncate max-w-[280px] block">
                {activeCourse.title}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-[#31353d] px-3 py-1.5 rounded-lg border border-[#434752]">
              <div className="w-16 h-2 bg-[#181c24] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#85da76] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-[#85da76]">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-12 gap-6 items-start">
          
          {/* Left Column (8 cols): Video Player HUD & Meta */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {/* Cyberpunk Video Player HUD Window */}
            <div className="bg-black border-2 border-[#434752] rounded-xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.8)] relative group">
              
              {/* Scanline Overlay */}
              <div className="scanline-overlay opacity-30 pointer-events-none" />

              {/* Video Player Display Area */}
              <div className="relative aspect-video bg-[#0a0e16] flex items-center justify-center overflow-hidden">
                
                {/* Background Image / Stream Placeholder */}
                <img
                  src={activeCourse.image}
                  alt={activeCourse.title}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    isPlaying ? 'brightness-90 scale-102' : 'brightness-50 blur-[1px]'
                  }`}
                />

                {/* HUD Overlay Screen Effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                {/* HUD Top Corner Badges */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <span className="bg-[#ff0033]/90 text-white font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded flex items-center gap-1.5 shadow-[0_0_10px_#ff0033]">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    LIVE HUD STREAM
                  </span>
                  <span className="bg-black/80 border border-[#434752] text-[#aec6ff] font-mono text-[10px] px-2 py-1 rounded">
                    {activeCourse.category}
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-20 font-mono text-[10px] text-[#8d909d] bg-black/80 border border-[#434752] px-2.5 py-1 rounded">
                  RES: 1080P // 60FPS
                </div>

                {/* Big Center Play/Pause Trigger */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute z-20 w-16 h-16 rounded-full bg-[#628fea]/90 hover:bg-[#628fea] text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-[0_0_20px_#628fea] cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>

                {/* HUD Bottom Player Controls Toolbar */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black via-black/90 to-transparent space-y-2">
                  
                  {/* Seeker / Time Progress Bar */}
                  <div className="w-full h-1.5 bg-[#31353d] hover:h-2 rounded-full overflow-hidden cursor-pointer transition-all">
                    <div className="h-full bg-[#aec6ff] shadow-[0_0_10px_#aec6ff]" style={{ width: '42%' }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    
                    {/* Controls Left Group */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-white hover:text-[#aec6ff] transition-colors cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button className="text-[#8d909d] hover:text-white transition-colors cursor-pointer" title="Rewind 10s">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button className="text-[#8d909d] hover:text-white transition-colors cursor-pointer" title="Forward 10s">
                        <RotateCw className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2 ml-2">
                        <button onClick={() => setIsMuted(!isMuted)} className="text-[#8d909d] hover:text-white transition-colors cursor-pointer">
                          {isMuted ? <VolumeX className="w-4 h-4 text-[#ffb4ab]" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <span className="text-[11px] text-[#8d909d]">04:15 / {activeLesson?.duration || '15:00'}</span>
                      </div>
                    </div>

                    {/* Controls Right Group */}
                    <div className="flex items-center gap-3">
                      
                      {/* Playback Speed Switcher */}
                      <select
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(e.target.value)}
                        className="bg-[#181c24] border border-[#434752] text-[#aec6ff] text-[11px] font-mono rounded px-2 py-0.5 outline-none cursor-pointer"
                      >
                        <option value="0.75x">0.75x</option>
                        <option value="1.0x">1.0x</option>
                        <option value="1.25x">1.25x</option>
                        <option value="1.5x">1.5x</option>
                        <option value="2.0x">2.0x</option>
                      </select>

                      <button className="text-[#8d909d] hover:text-white transition-colors cursor-pointer">
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Active Lesson Meta & Completion Toggle */}
            <div className="bg-[#181c24] border border-[#434752] rounded-xl p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#434752]">
                <div>
                  <span className="text-[10px] font-mono text-[#aec6ff] uppercase font-bold tracking-widest block mb-1">
                    CURRENT LESSON
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-wide">
                    {activeLesson?.title || 'Selected Lesson'}
                  </h2>
                </div>

                {/* Mark Complete Toggle Button */}
                <button
                  onClick={() => activeLesson && handleToggleLessonComplete(activeCourse.id, activeLesson.id)}
                  className={`flex items-center gap-2 font-mono text-xs font-bold px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${
                    isCurrentCompleted
                      ? 'bg-[#85da76]/15 border-[#85da76] text-[#85da76] hover:bg-[#85da76]/25'
                      : 'bg-[#31353d] border-[#434752] text-[#c3c6d4] hover:bg-[#434752] hover:text-white'
                  }`}
                >
                  {isCurrentCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#85da76]" />
                      <span>LESSON COMPLETED</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4" />
                      <span>MARK AS COMPLETE</span>
                    </>
                  )}
                </button>
              </div>

              {/* Lesson Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-[#8d909d] uppercase font-bold tracking-wider">
                  Lesson Summary & Core Objectives
                </h4>
                <p className="text-sm text-[#c3c6d4] leading-relaxed">
                  {activeLesson?.summary || 'No summary available for this lesson.'}
                </p>
              </div>

              {/* Instructor Information Card */}
              <div className="pt-4 border-t border-[#434752] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={activeCourse.instructor.avatar}
                    alt={activeCourse.instructor.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#aec6ff]"
                  />
                  <div>
                    <span className="text-sm font-bold text-white block">{activeCourse.instructor.name}</span>
                    <span className="text-xs text-[#8d909d] block">{activeCourse.instructor.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-[#31353d] px-3 py-1.5 rounded-lg border border-[#434752]">
                  <Star className="w-3.5 h-3.5 fill-[#ffb86a] text-[#ffb86a]" />
                  <span className="text-xs font-mono font-bold text-[#aec6ff]">{activeCourse.instructor.rating}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column (4 cols): Course Curriculum Playlist */}
          <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-6">
            <div className="bg-[#181c24] border border-[#434752] rounded-xl p-6 space-y-4">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#434752]">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#aec6ff]" />
                  <span>Curriculum Playlist</span>
                </h3>
                <span className="text-xs font-mono text-[#8d909d]">
                  {progressPercent}% Done
                </span>
              </div>

              {/* Modules Accordion Playlist */}
              <div className="space-y-4 max-h-[calc(100vh-240px)] overflow-y-auto pr-1 no-scrollbar">
                {activeCourse.modules.map(module => {
                  const isCollapsed = collapsedModules[module.id];
                  const moduleCompletedCount = module.lessons.filter(l => l.completed).length;

                  return (
                    <div key={module.id} className="border border-[#434752] rounded-lg overflow-hidden bg-[#0c0f0f]">
                      
                      {/* Module Header */}
                      <button
                        onClick={() => toggleModuleCollapse(module.id)}
                        className="w-full p-3.5 bg-[#1c2028] hover:bg-[#31353d] flex items-center justify-between text-left transition-colors cursor-pointer border-b border-[#434752]/50"
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-[#dfe2ed] block leading-snug">
                            {module.title}
                          </span>
                          <span className="text-[10px] font-mono text-[#8d909d]">
                            {moduleCompletedCount}/{module.lessons.length} Completed
                          </span>
                        </div>
                        {isCollapsed ? <ChevronDown className="w-4 h-4 text-[#8d909d]" /> : <ChevronUp className="w-4 h-4 text-[#8d909d]" />}
                      </button>

                      {/* Module Lessons List */}
                      {!isCollapsed && (
                        <div className="divide-y divide-[#434752]/30">
                          {module.lessons.map(lesson => {
                            const isActive = lesson.id === activeLessonId;

                            return (
                              <div
                                key={lesson.id}
                                onClick={() => {
                                  setActiveLessonId(lesson.id);
                                  setIsPlaying(true);
                                }}
                                className={`p-3 flex items-start justify-between gap-3 transition-colors cursor-pointer group ${
                                  isActive
                                    ? 'bg-[#628fea]/15 border-l-4 border-l-[#aec6ff]'
                                    : 'hover:bg-[#181c24]'
                                }`}
                              >
                                <div className="flex items-start gap-2.5 min-w-0">
                                  {/* Status Icon */}
                                  <div className="mt-0.5 flex-shrink-0">
                                    {lesson.completed ? (
                                      <CheckCircle2 className="w-4 h-4 text-[#85da76]" />
                                    ) : isActive ? (
                                      <Play className="w-4 h-4 text-[#aec6ff] fill-current animate-pulse" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-[#434752] group-hover:text-[#8d909d]" />
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <span
                                      className={`text-xs block truncate ${
                                        isActive ? 'font-bold text-[#aec6ff]' : 'text-[#c3c6d4] group-hover:text-white'
                                      }`}
                                    >
                                      {lesson.title}
                                    </span>
                                  </div>
                                </div>

                                {/* Duration Badge */}
                                <div className="flex items-center gap-1 text-[10px] font-mono text-[#8d909d] flex-shrink-0">
                                  <Clock className="w-3 h-3" />
                                  <span>{lesson.duration}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER VIEW STATE 1: CATALOG VIEW
  // ==========================================
  return (
    <div className="py-8 px-6 md:px-8 max-w-[1200px] mx-auto text-[#dfe2ed] select-none space-y-8">
      
      {/* Catalog Header Banner */}
      <div className="bg-[#181c24] border border-[#434752] rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl z-10">
          <span className="text-xs font-mono text-[#aec6ff] uppercase font-bold tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#aec6ff]" />
            COZY CITIZEN LEARNING HUB
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
            Cyberpunk Technical Disciplines
          </h1>
          <p className="text-xs md:text-sm text-[#c3c6d4] leading-relaxed">
            Upgrade your neural skill tree. Select a specialized discipline below to launch your interactive active learning stream.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-4 z-10">
          <div className="bg-[#31353d] border border-[#434752] p-3 rounded-lg text-center min-w-[90px]">
            <span className="text-lg font-mono font-bold text-[#aec6ff] block">{courses.length}</span>
            <span className="text-[10px] text-[#8d909d] uppercase block">COURSES</span>
          </div>
          <div className="bg-[#31353d] border border-[#434752] p-3 rounded-lg text-center min-w-[90px]">
            <span className="text-lg font-mono font-bold text-[#85da76] block">4.95</span>
            <span className="text-[10px] text-[#8d909d] uppercase block">RATING</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Sidebar: My Progress & Shortcuts */}
        <aside className="col-span-12 xl:col-span-3 space-y-6">
          <div className="bg-[#181c24] border border-[#434752] rounded-xl p-6">
            <h3 className="text-base font-bold text-[#dfe2ed] mb-6 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#aec6ff]" />
              <span>My Learning</span>
            </h3>
            
            <div className="space-y-6">
              {/* Continue Watching Focus Box */}
              <div>
                <p className="text-[11px] font-mono text-[#8d909d] uppercase mb-3 font-bold tracking-wider">
                  Continue Watching
                </p>
                <div
                  onClick={() => handleLaunchCourse(courses[0])}
                  className="group cursor-pointer bg-[#0c0f0f] p-3 rounded-xl border border-[#434752] hover:border-[#aec6ff]/60 transition-all"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-3 border border-[#434752]">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={courses[0].title}
                      src={courses[0].image}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-[#628fea] text-white flex items-center justify-center shadow-[0_0_15px_#628fea]">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xs font-semibold text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors truncate">
                    {courses[0].title}
                  </h4>
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-[#c3c6d4] mb-1 font-mono">
                      <span>{calculateCourseProgress(courses[0])}% Complete</span>
                      <span>2/5 Lessons</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#31353d] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#aec6ff]"
                        style={{ width: `${calculateCourseProgress(courses[0])}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Shortcuts */}
              <div className="pt-4 border-t border-[#434752]">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-[#c3c6d4] hover:text-[#aec6ff] transition-colors cursor-pointer text-xs font-medium">
                    <Bookmark className="w-4 h-4 text-[#aec6ff]" />
                    <span>Saved Courses</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#c3c6d4] hover:text-[#aec6ff] transition-colors cursor-pointer text-xs font-medium">
                    <History className="w-4 h-4 text-[#85da76]" />
                    <span>Learning History</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#c3c6d4] hover:text-[#aec6ff] transition-colors cursor-pointer text-xs font-medium">
                    <Award className="w-4 h-4 text-[#ffb86a]" />
                    <span>Certifications</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[#434752] bg-[#628fea]/10 p-4 rounded-lg border border-[#628fea]/20 space-y-1">
                <p className="text-xs font-bold text-[#aec6ff]">NEURAL PRO TIP</p>
                <p className="text-xs text-[#c3c6d4] leading-relaxed">
                  Complete 5 lessons this week to earn the 'Systems Architect' badge.
                </p>
              </div>

            </div>
          </div>
        </aside>

        {/* Center Column: Course Catalog & Category Filters */}
        <section className="col-span-12 xl:col-span-6 space-y-6">
          
          {/* Category Filter Tabs */}
          <div className="bg-[#181c24] border border-[#434752] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs uppercase font-bold text-[#dfe2ed] tracking-wider font-mono">
                Filter by Discipline
              </h3>
              <span className="text-[11px] font-mono text-[#8d909d]">
                Showing {getFilteredCourses().length} Courses
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map(cat => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#628fea] text-white shadow-[0_0_12px_rgba(98,143,234,0.5)]'
                        : 'bg-[#31353d] text-[#c3c6d4] hover:bg-[#434752] hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Courses Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#dfe2ed]">Available Curriculums</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getFilteredCourses().map(course => {
                const progress = calculateCourseProgress(course);

                return (
                  <div
                    key={course.id}
                    onClick={() => handleLaunchCourse(course)}
                    className="bg-[#181c24] border border-[#434752] rounded-xl overflow-hidden group cursor-pointer transition-all hover:border-[#aec6ff]/70 hover:shadow-[0_0_20px_rgba(174,198,255,0.15)] flex flex-col justify-between"
                  >
                    <div>
                      {/* Course Image Header */}
                      <div className="aspect-video relative overflow-hidden bg-black">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src={course.image}
                          alt={course.title}
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded text-[10px] text-[#aec6ff] font-mono font-bold uppercase border border-[#434752]">
                          {course.category}
                        </div>
                        <div className="absolute top-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[10px] text-white font-mono">
                          {course.difficulty}
                        </div>
                      </div>

                      {/* Course Details Body */}
                      <div className="p-5 space-y-3">
                        <h4 className="text-base font-bold text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors leading-snug">
                          {course.title}
                        </h4>

                        <p className="text-xs text-[#8d909d] line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>

                        <div className="flex items-center justify-between pt-2 text-xs text-[#c3c6d4]">
                          <div className="flex items-center gap-1.5 font-mono">
                            <Clock className="w-3.5 h-3.5 text-[#8d909d]" />
                            <span>{course.duration}</span>
                          </div>
                          <span className="text-[#85da76] font-mono font-bold">
                            {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Progress & Action Button */}
                    <div className="p-5 pt-0 border-t border-[#434752]/40 mt-3 space-y-3">
                      <div className="space-y-1 pt-3">
                        <div className="flex justify-between text-[10px] font-mono text-[#8d909d]">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#31353d] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#85da76]"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchCourse(course);
                        }}
                        className="w-full bg-[#31353d] group-hover:bg-[#628fea] text-[#dfe2ed] group-hover:text-white font-mono text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{progress > 0 ? 'Resume / Launch' : 'Start Course'}</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right Sidebar: Top Mentors */}
        <aside className="col-span-12 xl:col-span-3 space-y-6">
          <div className="bg-[#181c24] border border-[#434752] rounded-xl p-6">
            <h3 className="text-xs font-bold mb-4 text-[#dfe2ed] uppercase tracking-wider font-mono flex items-center gap-2">
              <User className="w-4 h-4 text-[#aec6ff]" />
              <span>Instructors & Mentors</span>
            </h3>

            <div className="space-y-4">
              {[
                {
                  name: 'Sarah Drasner',
                  role: 'Lead Security Engineer',
                  rating: '4.98',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                },
                {
                  name: 'Dr. Evelyn Vance',
                  role: 'AI Systems Director',
                  rating: '4.95',
                  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
                },
                {
                  name: 'Kelsey Hightower',
                  role: 'Principal Systems Architect',
                  rating: '4.92',
                  avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
                },
                {
                  name: 'Hitesh Choudhary',
                  role: 'Kernel Systems Engineer',
                  rating: '4.96',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                },
              ].map(mentor => (
                <div key={mentor.name} className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-[#31353d]/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <img className="w-9 h-9 rounded-full object-cover border border-[#434752]" src={mentor.avatar} alt={mentor.name} />
                    <div>
                      <span className="text-xs font-bold text-[#dfe2ed] group-hover:text-[#aec6ff] transition-colors block">{mentor.name}</span>
                      <span className="text-[10px] text-[#8d909d] block truncate max-w-[110px]">{mentor.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#ffb86a] text-[#ffb86a]" />
                    <span className="text-[#aec6ff] text-xs font-bold font-mono">{mentor.rating}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-2.5 border border-[#434752] rounded-lg text-xs font-mono font-bold text-[#c3c6d4] hover:bg-[#31353d] hover:text-white transition-colors cursor-pointer">
              View Mentor Directory
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}
