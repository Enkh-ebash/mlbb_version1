import axios from 'axios';

const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: { odyseeId: string; username: string; email: string; password: string; country?: string; region?: string }) =>
    api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  verify: () => api.get('/auth/verify'),
  getUser: (odyseeId: string) => api.get(`/auth/user/${odyseeId}`),
  updateUser: (odyseeId: string, data: any) => api.put(`/auth/user/${odyseeId}`, data),
};

// Leaderboard API
export const leaderboardApi = {
  getLeaderboard: (params: { page?: number; limit?: number; region?: string; search?: string }) =>
    api.get('/leaderboard/leaderboard', { params }),
  getRank: (odyseeId: string) => api.get(`/leaderboard/rank/${odyseeId}`),
  updateRank: (data: { odyseeId: string; username: string; avatar?: string; mmr: number; region: string; winRate: number; totalMatches: number }) =>
    api.post('/leaderboard/rank', data),
  getCompare: (odyseeId1: string, odyseeId2: string) =>
    api.get(`/leaderboard/compare/${odyseeId1}/${odyseeId2}`),
  getPodium: (region?: string) => api.get('/leaderboard/podium', { params: { region } }),
  getTrending: (region?: string) => api.get('/leaderboard/trending', { params: { region } }),
};

// Matchmaking API
export const matchmakingApi = {
  joinQueue: (data: { odyseeId: string; username: string; mmr: number; region: string; queueType: string }) =>
    api.post('/matchmaking/queue/join', data),
  leaveQueue: (odyseeId: string) => api.post('/matchmaking/queue/leave', { odyseeId }),
  getQueueStatus: (odyseeId: string) => api.get(`/matchmaking/queue/status/${odyseeId}`),
  findMatch: (data: { region: string; queueType: string }) =>
    api.post('/matchmaking/match/find', data),
  acceptMatch: (ticketId: string, odyseeId: string) =>
    api.post('/matchmaking/match/accept', { ticketId, odyseeId }),
};

// MMR API
export const mmrApi = {
  calculate: (data: { matchId: string; winnerTeam: string; teams: any[] }) =>
    api.post('/mmr/calculate', data),
  getHistory: (odyseeId: string, limit?: number) =>
    api.get(`/mmr/history/${odyseeId}`, { params: { limit } }),
  getDistribution: (region?: string) => api.get('/mmr/distribution', { params: { region } }),
  estimate: (odyseeId: string, opponentMMR: number, isWin: boolean) =>
    api.get(`/mmr/estimate/${odyseeId}`, { params: { opponentMMR, isWin } }),
};

// Tournament API
export const tournamentApi = {
  getAll: (params?: { region?: string; status?: string; page?: number; limit?: number }) =>
    api.get('/tournament/', { params }),
  getOne: (tournamentId: string) => api.get(`/tournament/${tournamentId}`),
  create: (data: any) => api.post('/tournament/', data),
  register: (tournamentId: string, data: { clanId: string; teamName: string; captainId: string }) =>
    api.post(`/tournament/${tournamentId}/register`, data),
  updateBracket: (tournamentId: string, bracket: any) =>
    api.put(`/tournament/${tournamentId}/bracket`, { bracket }),
};

// Clan API
export const clanApi = {
  getAll: (params?: { region?: string; page?: number; limit?: number; search?: string }) =>
    api.get('/clan/', { params }),
  getOne: (clanId: string) => api.get(`/clan/${clanId}`),
  create: (data: any) => api.post('/clan/', data),
  update: (clanId: string, data: any) => api.put(`/clan/${clanId}`, data),
  addMember: (clanId: string, data: { odyseeId: string; username: string; role?: string }) =>
    api.post(`/clan/${clanId}/members`, data),
  removeMember: (clanId: string, odyseeId: string) =>
    api.delete(`/clan/${clanId}/members/${odyseeId}`),
  getRankings: (region?: string, limit?: number) =>
    api.get('/clan/rankings/top', { params: { region, limit } }),
};

// Analytics API
export const analyticsApi = {
  getHeroMeta: (region?: string, limit?: number) =>
    api.get('/analytics/heroes/meta', { params: { region, limit } }),
  getHeroTrends: (heroId: string, days?: number) =>
    api.get(`/analytics/heroes/${heroId}/trends`, { params: { days } }),
  getMatchAnalytics: (region?: string) =>
    api.get('/analytics/matches/analytics', { params: { region } }),
  getPlayerStats: (odyseeId: string) => api.get(`/analytics/players/${odyseeId}/stats`),
  getRegionalStats: (region: string) => api.get(`/analytics/regions/${region}/stats`),
};

// Notification API
export const notificationApi = {
  send: (data: { odyseeId: string; type: string; title: string; message: string; data?: any }) =>
    api.post('/notification/', data),
  getAll: (odyseeId: string, params?: { unreadOnly?: boolean; limit?: number; offset?: number }) =>
    api.get(`/notification/${odyseeId}`, { params }),
  markAsRead: (odyseeId: string, notificationId: string) =>
    api.put(`/notification/${odyseeId}/${notificationId}/read`),
  markAllAsRead: (odyseeId: string) => api.put(`/notification/${odyseeId}/read-all`),
  getUnreadCount: (odyseeId: string) => api.get(`/notification/${odyseeId}/unread-count`),
};

// Chat API
export const chatApi = {
  sendGlobal: (data: { senderId: string; senderName: string; content: string }) =>
    api.post('/chat/global/send', data),
  getGlobalHistory: (limit?: number) => api.get('/chat/global/history', { params: { limit } }),
  sendClan: (clanId: string, data: { senderId: string; senderName: string; content: string }) =>
    api.post(`/chat/clan/${clanId}/send`, data),
  getClanHistory: (clanId: string, limit?: number) =>
    api.get(`/chat/clan/${clanId}/history`, { params: { limit } }),
  sendWhisper: (data: { fromId: string; fromName: string; toId: string; content: string }) =>
    api.post('/chat/whisper/send', data),
  getWhisperHistory: (userId: string, friendId: string, limit?: number) =>
    api.get(`/chat/whisper/${userId}/${friendId}/history`, { params: { limit } }),
};

export default api;