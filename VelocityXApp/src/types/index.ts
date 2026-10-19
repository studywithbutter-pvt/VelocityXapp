export type Subject = 
  | 'Physics' 
  | 'Mathematics' 
  | 'Biology' 
  | 'History' 
  | 'Computer Science' 
  | 'General Study' 
  | string;

export interface Rocket {
  id: string;
  name: string;
  variant: string;
  description: string;
  price: number;
  unlocked: boolean;
  color: string;
  flameColor: string;
  stats: {
    thrust: number;
    efficiency: number;
    shields: number;
  };
}

export type MissionOutcome = 'success' | 'forfeited';

export interface MissionRecord {
  id: string;
  rocketId: string;
  rocketName: string;
  subject: Subject;
  title: string;
  targetDuration: number; // minutes
  actualDuration: number; // minutes
  outcome: MissionOutcome;
  timestamp: number;
  gridX: number;
  gridY: number;
  coinsEarned: number;
}

export interface UserStats {
  coins: number;
  totalFocusMinutes: number;
  completedMissions: number;
  forfeitedMissions: number;
  streakDays: number;
  lastActiveDate: string;
}

export type ViewMode = 'pomox' | 'rocketx' | 'store' | 'insights';
export type MainTab = 'velocity' | 'prism';

export type MissionStatus = 
  | 'idle' 
  | 'countdown' 
  | 'launching' 
  | 'flying' 
  | 'paused' 
  | 'success' 
  | 'forfeited';

export interface ActiveSession {
  rocketId: string;
  subject: Subject;
  title: string;
  targetDuration: number; // minutes
  elapsedSeconds: number;
  startTimestamp: number;
  isPaused: boolean;
  status: MissionStatus;
}

