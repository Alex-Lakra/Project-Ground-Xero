export type PillChoice = 'none' | 'red' | 'blue';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  id: string;
}

export interface DiagnosticsItem {
  name: string;
  status: 'active' | 'warning' | 'error' | 'pending';
  value: string;
}

export interface ComfortableTask {
  id: string;
  text: string;
  completed: boolean;
  time: string;
}

export interface DreamRecord {
  id: string;
  title: string;
  content: string;
  date: string;
  pleasantness: number; // 1-5 scale
}

export interface DecryptionLog {
  id: string;
  original: string;
  decrypted: string;
  progress: number; // 0-100
  timestamp: string;
  status: 'decrypting' | 'completed' | 'failed';
}

export interface SystemSettings {
  scanlineOpacity: number;
  terminalSpeed: 'fast' | 'normal' | 'slow';
  digitalRainDensity: number;
  retroFont: boolean;
}
