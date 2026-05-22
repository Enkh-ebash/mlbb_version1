import { create } from 'zustand';

interface User {
  odyseeId: string;
  username: string;
  email: string;
  avatar?: string;
  mmr: number;
  rankTier: string;
  region: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  setLoading: (loading) => set({ isLoading: loading }),
}))

interface LeaderboardEntry {
  odyseeId: string;
  username: string;
  avatar: string;
  rank: number;
  mmr: number;
  rankTier: string;
  rankPoints: number;
  region: string;
  winRate: number;
  totalMatches: number;
  trend: 'up' | 'down' | 'stable';
}

interface LeaderboardState {
  entries: LeaderboardEntry[];
  topThree: LeaderboardEntry[];
  trending: LeaderboardEntry[];
  selectedRegion: string;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  setEntries: (entries: LeaderboardEntry[]) => void;
  setTopThree: (entries: LeaderboardEntry[]) => void;
  setTrending: (entries: LeaderboardEntry[]) => void;
  setRegion: (region: string) => void;
  setSearch: (query: string) => void;
  setPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  entries: [],
  topThree: [],
  trending: [],
  selectedRegion: 'Global',
  searchQuery: '',
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  setEntries: (entries) => set({ entries }),
  setTopThree: (entries) => set({ topThree: entries }),
  setTrending: (entries) => set({ trending: entries }),
  setRegion: (region) => set({ selectedRegion: region, currentPage: 1 }),
  setSearch: (query) => set({ searchQuery: query }),
  setPage: (page) => set({ currentPage: page }),
  setTotalPages: (total) => set({ totalPages: total }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notif: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setUnreadCount: (count: number) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notif) => set((state) => ({
    notifications: [notif, ...state.notifications],
    unreadCount: state.unreadCount + 1,
  })),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
    unreadCount: 0,
  })),
  setUnreadCount: (count) => set({ unreadCount: count }),
}));

export const RANK_TIERS = {
  WARRIOR: { name: 'Warrior', color: '#6B7280', icon: '⚔️', order: 1 },
  ELITE: { name: 'Elite', color: '#3B82F6', icon: '🛡️', order: 2 },
  MASTER: { name: 'Master', color: '#06B6D4', icon: '⭐', order: 3 },
  GRANDMASTER: { name: 'Grandmaster', color: '#F59E0B', icon: '🌟', order: 4 },
  EPIC: { name: 'Epic', color: '#EF4444', icon: '💎', order: 5 },
  LEGEND: { name: 'Legend', color: '#EC4899', icon: '👑', order: 6 },
  MYTHIC: { name: 'Mythic', color: '#F97316', icon: '🔥', order: 7 },
  MYTHICAL_HONOR: { name: 'Mythical Honor', color: '#7C3AED', icon: '⚡', order: 8 },
  MYTHICAL_GLORY: { name: 'Mythical Glory', color: '#DC2626', icon: '🏆', order: 9 },
} as const;

export const RANK_ORDER = Object.keys(RANK_TIERS);