// ==========================================
// Application Core Types & Interfaces
// ==========================================

// Defines the chosen reality path ('none' = selector construct, 'red' = mainframe CLI, 'blue' = cozy construct)
export type PillChoice = 'none' | 'red' | 'blue';

// Message format for standard interactive chatbot channels
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}



// Cozy calendar tasks for the Blue Pill environment
export interface ComfortableTask {
  id: string;
  text: string;
  completed: boolean;
  time: string;
}

// Subconscious dream records stored in the cozy Citizen construct
export interface DreamRecord {
  id: string;
  title: string;
  content: string;
  date: string;
  pleasantness: number; // 1-5 stars scale
}



// Main custom configurations parameters governed by the settings panel
export interface SystemSettings {
  scanlineOpacity: number; // CRT raster opacity limit
  terminalSpeed: 'fast' | 'normal' | 'slow'; // startup diagnostics speed
  digitalRainDensity: number; // rain frequency multipliers
  retroFont: boolean; // toggle JetBrains Mono monospace font overlay
}
