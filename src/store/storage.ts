export interface AppSettings {
  familyName: string;
  pinHash: string;
  pinSalt: string;
  setupComplete: boolean;
}

export interface Kid {
  id: string;
  name: string;
  avatarEmoji: string;
  color: string;
  createdAt: string;
}

export interface Chore {
  id: string;
  title: string;
  description?: string;
  points: number;
  assignedKidIds: string[];
  recurrence: 'daily' | 'weekly' | 'monthly' | 'once';
  weekdays?: number[];
  monthDay?: number;
  createdAt: string;
  active: boolean;
}

export interface ChoreCompletion {
  id: string;
  choreId: string;
  kidId: string;
  completedDate: string;
  pointsEarned: number;
}

export interface Reward {
  id: string;
  title: string;
  pointCost: number;
  description?: string;
  imageEmoji?: string;
  active: boolean;
  assignedKidIds?: string[];
}

export interface Redemption {
  id: string;
  rewardId: string;
  kidId: string;
  redeemedAt: string;
  pointsSpent: number;
  markedByParent: boolean;
}

const KEYS = {
  settings: 'fta:settings',
  kids: 'fta:kids',
  chores: 'fta:chores',
  completions: 'fta:completions',
  rewards: 'fta:rewards',
  redemptions: 'fta:redemptions',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getSettings: () => read<AppSettings | null>(KEYS.settings, null),
  setSettings: (s: AppSettings) => write(KEYS.settings, s),

  getKids: () => read<Kid[]>(KEYS.kids, []),
  setKids: (kids: Kid[]) => write(KEYS.kids, kids),

  getChores: () => read<Chore[]>(KEYS.chores, []),
  setChores: (chores: Chore[]) => write(KEYS.chores, chores),

  getCompletions: () => read<ChoreCompletion[]>(KEYS.completions, []),
  setCompletions: (c: ChoreCompletion[]) => write(KEYS.completions, c),

  getRewards: () => read<Reward[]>(KEYS.rewards, []),
  setRewards: (r: Reward[]) => write(KEYS.rewards, r),

  getRedemptions: () => read<Redemption[]>(KEYS.redemptions, []),
  setRedemptions: (r: Redemption[]) => write(KEYS.redemptions, r),

  clearSettings: () => localStorage.removeItem(KEYS.settings),

  getAvailablePoints: (kidId: string): number => {
    const completions = read<ChoreCompletion[]>(KEYS.completions, []);
    const redemptions = read<Redemption[]>(KEYS.redemptions, []);
    const earned = completions
      .filter((c) => c.kidId === kidId)
      .reduce((sum, c) => sum + c.pointsEarned, 0);
    const spent = redemptions
      .filter((r) => r.kidId === kidId && r.markedByParent)
      .reduce((sum, r) => sum + r.pointsSpent, 0);
    return earned - spent;
  },
};

export function generateId(): string {
  return crypto.randomUUID();
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
