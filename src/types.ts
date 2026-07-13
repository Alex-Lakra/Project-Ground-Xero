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

// Diagnostic readout rows for the mainframe bypass tools
export interface DiagnosticsItem {
  name: string;
  status: 'active' | 'warning' | 'error' | 'pending';
  value: string;
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

// Scrambled logs for the text packet decryptor CLI utilities
export interface DecryptionLog {
  id: string;
  original: string;
  decrypted: string;
  progress: number; // 0-100% scale
  timestamp: string;
  status: 'decrypting' | 'completed' | 'failed';
}

// Main custom configurations parameters governed by the settings panel
export interface SystemSettings {
  scanlineOpacity: number; // CRT raster opacity limit
  terminalSpeed: 'fast' | 'normal' | 'slow'; // startup diagnostics speed
  digitalRainDensity: number; // rain frequency multipliers
  retroFont: boolean; // toggle JetBrains Mono monospace font overlay
}

// Custom theme for the terminal
export interface TerminalTheme {
  name: string;
  background: string; // Hex code or URL for image
  text: string; // Hex code
  imageFit?: 'cover' | 'contain' | 'fill' | 'stretch'; // Sizing option if background is an image
  rainColor?: string; // Optional rain color for this theme
}
