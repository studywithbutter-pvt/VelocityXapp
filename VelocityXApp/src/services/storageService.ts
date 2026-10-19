import { Rocket, MissionRecord, UserStats, ActiveSession } from '../types';

export const INITIAL_ROCKETS: Rocket[] = [
  {
    id: 'astra-1',
    name: 'Astra-1',
    variant: 'Orbital Pioneer',
    description: 'The standard issue atmospheric orbital booster. Agile and lightweight.',
    price: 0,
    unlocked: true,
    color: '#06b6d4',
    flameColor: '#38bdf8',
    stats: { thrust: 82, efficiency: 90, shields: 75 }
  },
  {
    id: 'vanguard-mk2',
    name: 'Vanguard MK-II',
    variant: 'Deep Space Explorer',
    description: 'Reinforced carbon hull designed for prolonged deep space focus expeditions.',
    price: 150,
    unlocked: false,
    color: '#a855f7',
    flameColor: '#c084fc',
    stats: { thrust: 94, efficiency: 85, shields: 88 }
  },
  {
    id: 'nebula-drifter',
    name: 'Nebula Drifter',
    variant: 'Solar Sail Corvette',
    description: 'Equipped with ionic thrusters for serene, silent orbital cruising.',
    price: 300,
    unlocked: false,
    color: '#3b82f6',
    flameColor: '#60a5fa',
    stats: { thrust: 88, efficiency: 98, shields: 80 }
  },
  {
    id: 'titan-chrono',
    name: 'Titan Chrono',
    variant: 'Heavy Void Cruiser',
    description: 'Heavyweight mission flagship built to endure 90+ minute marathon study sessions.',
    price: 600,
    unlocked: false,
    color: '#f59e0b',
    flameColor: '#fbbf24',
    stats: { thrust: 99, efficiency: 82, shields: 99 }
  }
];

const STORAGE_KEYS = {
  STATS: 'velocity_stats_v1',
  MISSIONS: 'velocity_missions_v1',
  ROCKETS: 'velocity_rockets_v1',
  SELECTED_ROCKET: 'velocity_selected_rocket_v1',
  ACTIVE_SESSION: 'velocity_active_session_v1',
};

export const getSavedStats = (): UserStats => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stats', e);
  }
  return {
    coins: 100,
    totalFocusMinutes: 0,
    completedMissions: 0,
    forfeitedMissions: 0,
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
  };
};

export const saveStats = (stats: UserStats) => {
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
};

export const getSavedMissions = (): MissionRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MISSIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load missions', e);
  }
  return [];
};

export const saveMission = (mission: MissionRecord) => {
  const missions = getSavedMissions();
  missions.unshift(mission);
  localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
};

export const getSavedRockets = (): Rocket[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROCKETS);
    if (raw) {
      const parsed: Rocket[] = JSON.parse(raw);
      return INITIAL_ROCKETS.map(initial => {
        const found = parsed.find(p => p.id === initial.id);
        return found ? { ...initial, unlocked: found.unlocked } : initial;
      });
    }
  } catch (e) {
    console.error('Failed to load rockets', e);
  }
  return INITIAL_ROCKETS;
};

export const saveRockets = (rockets: Rocket[]) => {
  localStorage.setItem(STORAGE_KEYS.ROCKETS, JSON.stringify(rockets));
};

export const getSelectedRocketId = (): string => {
  return localStorage.getItem(STORAGE_KEYS.SELECTED_ROCKET) || 'astra-1';
};

export const saveSelectedRocketId = (id: string) => {
  localStorage.setItem(STORAGE_KEYS.SELECTED_ROCKET, id);
};

export const getActiveSession = (): ActiveSession | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse active session', e);
  }
  return null;
};

export const saveActiveSession = (session: ActiveSession | null) => {
  if (session) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  }
};

