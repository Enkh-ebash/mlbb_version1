import mongoose, { Schema, Document } from 'mongoose';

// User Model
export interface IUser extends Document {
  odyseeId: string;
  username: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  country: string;
  region: string;
  mmr: number;
  rankTier: string;
  rankPoints: number;
  totalMatches: number;
  winRate: number;
  favoriteHeroes: string[];
  clanId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;
  isOnline: boolean;
  stats: {
    kills: number;
    deaths: number;
    assists: number;
    mvpRate: number;
  };
}

export const UserSchema = new Schema({
  odyseeId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  avatar: { type: String },
  country: { type: String, default: 'Unknown' },
  region: { type: String, enum: ['Global', 'Americas', 'Europe', 'Asia', 'Southeast Asia'], default: 'Global' },
  mmr: { type: Number, default: 1000 },
  rankTier: { type: String, default: 'WARRIOR' },
  rankPoints: { type: Number, default: 0 },
  totalMatches: { type: Number, default: 0 },
  winRate: { type: Number, default: 50 },
  favoriteHeroes: [{ type: String }],
  clanId: { type: Schema.Types.ObjectId, ref: 'Clan' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  isOnline: { type: Boolean, default: false },
  stats: {
    kills: { type: Number, default: 0 },
    deaths: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    mvpRate: { type: Number, default: 0 }
  }
});

// Match Model
export interface IMatch extends Document {
  matchId: string;
  queueType: string;
  mapId: number;
  gameMode: string;
  duration: number;
  winnerTeam: string;
  teams: [{
    teamId: string;
    players: [{
      odyseeId: string;
      heroId: string;
      mmrBefore: number;
      mmrAfter: number;
      mmrChange: number;
      kills: number;
      deaths: number;
      assists: number;
      damage: number;
      heal: number;
      isMVP: boolean;
    }]
  }];
  region: string;
  playedAt: Date;
}

export const MatchSchema = new Schema({
  matchId: { type: String, required: true, unique: true },
  queueType: { type: String, enum: ['RANKED_SOLO', 'RANKED_TEAM', 'CLASSIC', 'CUSTOM', 'TOURNAMENT'] },
  mapId: { type: Number, default: 1 },
  gameMode: { type: String, default: '5v5' },
  duration: { type: Number, required: true },
  winnerTeam: { type: String, required: true },
  teams: [{
    teamId: String,
    players: [{
      odyseeId: String,
      heroId: String,
      mmrBefore: Number,
      mmrAfter: Number,
      mmrChange: Number,
      kills: Number,
      deaths: Number,
      assists: Number,
      damage: Number,
      heal: Number,
      isMVP: Boolean
    }]
  }],
  region: { type: String, default: 'Global' },
  playedAt: { type: Date, default: Date.now }
});

// Leaderboard Entry Model
export interface ILeaderboardEntry extends Document {
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
  rivalId?: string;
  lastUpdated: Date;
}

export const LeaderboardEntrySchema = new Schema({
  odyseeId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  avatar: { type: String },
  rank: { type: Number, required: true },
  mmr: { type: Number, required: true },
  rankTier: { type: String, required: true },
  rankPoints: { type: Number, required: true },
  region: { type: String, required: true },
  winRate: { type: Number, default: 50 },
  totalMatches: { type: Number, default: 0 },
  trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
  rivalId: { type: String },
  lastUpdated: { type: Date, default: Date.now }
});

// Tournament Model
export interface ITournament extends Document {
  tournamentId: string;
  name: string;
  description: string;
  gameMode: string;
  format: string;
  maxTeams: number;
  registeredTeams: number;
  prizePool: string;
  status: string;
  startDate: Date;
  endDate: Date;
  region: string;
  organizer: {
    odyseeId: string;
    name: string;
  };
  bracket: object;
  createdAt: Date;
}

export const TournamentSchema = new Schema({
  tournamentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  gameMode: { type: String, default: '5v5' },
  format: { type: String, enum: ['Single Elimination', 'Double Elimination', 'Round Robin', 'Swiss'], default: 'Single Elimination' },
  maxTeams: { type: Number, default: 16 },
  registeredTeams: { type: Number, default: 0 },
  prizePool: { type: String, default: '$0' },
  status: { type: String, enum: ['Upcoming', 'Registration', 'Live', 'Completed'], default: 'Upcoming' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  region: { type: String, default: 'Global' },
  organizer: {
    odyseeId: String,
    name: String
  },
  bracket: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

// Clan Model
export interface IClan extends Document {
  clanId: string;
  name: string;
  tag: string;
  logo: string;
  banner: string;
  description: string;
  leaderId: string;
  leaderName: string;
  members: [{
    odyseeId: string;
    username: string;
    role: string;
    joinedAt: Date;
  }];
  region: string;
  totalMMR: number;
  averageMMR: number;
  wins: number;
  losses: number;
  createdAt: Date;
}

export const ClanSchema = new Schema({
  clanId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tag: { type: String, required: true },
  logo: { type: String },
  banner: { type: String },
  description: { type: String },
  leaderId: { type: String, required: true },
  leaderName: { type: String, required: true },
  members: [{
    odyseeId: String,
    username: String,
    role: { type: String, enum: ['Leader', 'Officer', 'Member'] },
    joinedAt: { type: Date, default: Date.now }
  }],
  region: { type: String, default: 'Global' },
  totalMMR: { type: Number, default: 0 },
  averageMMR: { type: Number, default: 1000 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Hero Stats Model
export interface IHeroStats extends Document {
  heroId: string;
  name: string;
  role: string;
  pickRate: number;
  banRate: number;
  winRate: number;
  averageKDA: {
    kills: number;
    deaths: number;
    assists: number;
  };
  trends: [{
    date: Date;
    pickRate: number;
    winRate: number;
  }];
}

export const HeroStatsSchema = new Schema({
  heroId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  pickRate: { type: Number, default: 0 },
  banRate: { type: Number, default: 0 },
  winRate: { type: Number, default: 50 },
  averageKDA: {
    kills: { type: Number, default: 0 },
    deaths: { type: Number, default: 0 },
    assists: { type: Number, default: 0 }
  },
  trends: [{
    date: Date,
    pickRate: Number,
    winRate: Number
  }]
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
export const MatchModel = mongoose.model<IMatch>('Match', MatchSchema);
export const LeaderboardEntryModel = mongoose.model<ILeaderboardEntry>('LeaderboardEntry', LeaderboardEntrySchema);
export const TournamentModel = mongoose.model<ITournament>('Tournament', TournamentSchema);
export const ClanModel = mongoose.model<IClan>('Clan', ClanSchema);
export const HeroStatsModel = mongoose.model<IHeroStats>('HeroStats', HeroStatsSchema);