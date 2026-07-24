// ==========================================
// Application Core Types & Interfaces
// ==========================================

// Defines the chosen reality path ('none' = selector construct, 'red' = mainframe CLI, 'blue' = enterprise dashboard construct)
export type PillChoice = 'none' | 'red' | 'blue';

// Active Tab navigation inside the Enterprise Dashboard
export type EnterpriseTab = 'dashboard' | 'courses' | 'challenges' | 'communities' | 'events' | 'profile';

// Message format for standard interactive chatbot channels
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

// Enterprise Code Editor / Problem Model
export interface DailyProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  xp: number;
  tags: string[];
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: Record<string, string>;
  testCases: { input: string; expected: string }[];
}

// Enterprise Course Catalog Model
export interface CourseItem {
  id: string;
  title: string;
  category: 'Web Dev' | 'Algorithms' | 'System Design' | 'AI/ML' | 'Mobile';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  duration: string;
  modulesCount: number;
  progressPercent: number;
  tags: string[];
  image: string;
  enrolled: boolean;
}

// Enterprise Coding Challenge Model
export interface ChallengeItem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  category: 'Algorithms' | 'Frontend' | 'Backend' | 'System Design';
  xp: number;
  attempted: number;
  description: string;
  isFeatured?: boolean;
}

// Enterprise Community Discussion Post
export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  body: string;
  channel: 'General' | 'React' | 'System Design' | 'Rust' | 'AI/ML';
  upvotes: number;
  commentsCount: number;
  timeAgo: string;
  userUpvoted?: boolean;
}

// Enterprise Event Item
export interface EventItem {
  id: string;
  title: string;
  type: 'Workshop' | 'AMA' | 'Hackathon' | 'Webinar';
  date: string;
  time: string;
  location: string;
  speaker: string;
  attendeesCount: number;
  isRsvped: boolean;
}

// Main custom configurations parameters governed by the settings panel
export interface SystemSettings {
  scanlineOpacity: number; // CRT raster opacity limit
  terminalSpeed: 'fast' | 'normal' | 'slow'; // startup diagnostics speed
  digitalRainDensity: number; // rain frequency multipliers
  retroFont: boolean; // toggle JetBrains Mono monospace font overlay
}
