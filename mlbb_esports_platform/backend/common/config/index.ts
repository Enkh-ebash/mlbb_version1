export interface DatabaseConfig {
  uri: string;
  options: object;
}

export interface RedisConfig {
  url: string;
  password?: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface ServiceConfig {
  name: string;
  port: number;
  env: string;
}

export const RANK_TIERS = {
  WARRIOR: { min: 0, max: 999, name: 'Warrior', color: '#8B5CF6', icon: '⚔️' },
  ELITE: { min: 1000, max: 1999, name: 'Elite', color: '#3B82F6', icon: '🛡️' },
  MASTER: { min: 2000, max: 2999, name: 'Master', color: '#06B6D4', icon: '⭐' },
  GRANDMASTER: { min: 3000, max: 3999, name: 'Grandmaster', color: '#F59E0B', icon: '🌟' },
  EPIC: { min: 4000, max: 4999, name: 'Epic', color: '#EF4444', icon: '💎' },
  LEGEND: { min: 5000, max: 5999, name: 'Legend', color: '#EC4899', icon: '👑' },
  MYTHIC: { min: 6000, max: 6999, name: 'Mythic', color: '#F97316', icon: '🔥' },
  MYTHIC_GLORY: { min: 7000, max: 7999, name: 'Mythical Glory', color: '#DC2626', icon: '🏆' },
  MYTHICAL_HONOR: { min: 8000, max: 8999, name: 'Mythical Honor', color: '#7C3AED', icon: '⚡' },
  MYTHICAL_SOVEREIGN: { min: 9000, max: 9999, name: 'Mythical Sovereign', color: '#FFD700', icon: '👑' },
  ASCENDANT: { min: 10000, max: 10999, name: 'Ascendant', color: '#FF006E', icon: '🚀' },
  GUARDIAN: { min: 11000, max: 11999, name: 'Guardian', color: '#00D4FF', icon: '🛡️' },
  CHAMPION: { min: 12000, max: 12999, name: 'Champion', color: '#8338EC', icon: '🎖️' },
  LEGENDARY: { min: 13000, max: 13999, name: 'Legendary', color: '#FF4D4D', icon: '💫' },
  IMMORTAL: { min: 14000, max: 14999, name: 'Immortal', color: '#FF0000', icon: '🌟' },
  TITAN: { min: 15000, max: 15999, name: 'Titan', color: '#00FFFF', icon: '⚡' },
  CELESTIAL: { min: 16000, max: Infinity, name: 'Celestial', color: '#FFD700', icon: '✨' }
};

export const REGIONS = ['Global', 'Americas', 'Europe', 'Asia', 'Southeast Asia'];

export const MATCH_QUEUE_TYPES = [
  'RANKED_SOLO',
  'RANKED_TEAM',
  'CLASSIC',
  'CUSTOM',
  'TOURNAMENT'
];