import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import { MatchModel, UserModel } from '../../common/models/schemas';
import { RANK_TIERS } from '../../common/config';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mmr_db';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MMR Service connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const redis = new Redis(REDIS_URL);

// ELO-based MMR calculation constants
const K_FACTOR = 32; // Base K-factor
const K_FACTOR_RATED = 40; // Higher for rated games
const PERFORMANCE_WEIGHT = 0.3;
const WIN_STREAK_BONUS = 0.1;
const HERO_MASTERY_BONUS = 0.05;

// Calculate expected score using ELO formula
function calculateExpectedScore(playerRating: number, opponentRating: number): number {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

// Adjust K-factor based on games played
function getKFactor(gamesPlayed: number, isRated: boolean): number {
  let k = isRated ? K_FACTOR_RATED : K_FACTOR;

  // Reduce K-factor for experienced players (they gain less from new players)
  if (gamesPlayed > 100) k *= 0.8;
  else if (gamesPlayed > 500) k *= 0.6;
  else if (gamesPlayed > 1000) k *= 0.4;

  return k;
}

// Process MMR change from a match
app.post('/calculate', async (req, res) => {
  try {
    const { matchId, winnerTeam, teams } = req.body;

    const mmrChanges: Map<string, number> = new Map();
    const allPlayers = teams.flatMap((t: any) => t.players);

    // Group players by team and calculate team MMR
    const team1AvgMMR = teams[0].players.reduce((sum: number, p: any) => sum + p.mmrBefore, 0) / teams[0].players.length;
    const team2AvgMMR = teams[1].players.reduce((sum: number, p: any) => sum + p.mmrBefore, 0) / teams[1].players.length;

    // Calculate new MMR for each player
    for (const player of allPlayers) {
      const user = await UserModel.findOne({ odyseeId: player.odyseeId });
      if (!user) continue;

      const gamesPlayed = user.totalMatches;
      const k = getKFactor(gamesPlayed, true);

      // Determine if player won
      const teamIndex = teams[0].players.some((p: any) => p.odyseeId === player.odyseeId) ? 0 : 1;
      const won = (teams[teamIndex].teamId === winnerTeam);

      // Calculate team opponent rating
      const opponentTeamAvg = teamIndex === 0 ? team2AvgMMR : team1AvgMMR;

      // Expected score
      const expected = calculateExpectedScore(player.mmrBefore, opponentTeamAvg);
      const actual = won ? 1 : 0;

      // Performance modifier (based on KDA)
      const kda = (player.kills * 0.4 + player.assists * 0.3) / Math.max(player.deaths, 1);
      const performanceMod = 1 + (kda > 3 ? PERFORMANCE_WEIGHT : kda < 0.5 ? -PERFORMANCE_WEIGHT : 0);

      // Win streak bonus
      const streakKey = `streak:${player.odyseeId}`;
      const currentStreak = await redis.get(streakKey) || '0';
      let streakMod = 1;
      if (won) {
        const newStreak = parseInt(currentStreak) + 1;
        await redis.setex(streakKey, 86400, newStreak.toString());
        if (newStreak >= 3) streakMod += WIN_STREAK_BONUS;
      } else {
        await redis.del(streakKey);
      }

      // Calculate MMR change
      let mmrChange = k * (actual - expected) * performanceMod * streakMod;

      // Clamp changes
      mmrChange = Math.max(-50, Math.min(50, Math.round(mmrChange)));

      // Apply hero mastery bonus
      if (user.favoriteHeroes.includes(player.heroId)) {
        mmrChange *= (1 + HERO_MASTERY_BONUS);
      }

      const newMMR = Math.max(0, player.mmrBefore + mmrChange);

      mmrChanges.set(player.odyseeId, {
        oldMMR: player.mmrBefore,
        newMMR,
        change: Math.round(mmrChange)
      });

      // Update user document
      const isWinner = won ? 1 : 0;
      const newWinRate = ((user.winRate * user.totalMatches) + isWinner) / (user.totalMatches + 1);

      await UserModel.findOneAndUpdate(
        { odyseeId: player.odyseeId },
        {
          mmr: newMMR,
          rankTier: getRankTier(newMMR),
          rankPoints: newMMR % 1000,
          totalMatches: gamesPlayed + 1,
          winRate: Math.round(newWinRate * 100) / 100,
          stats: {
            kills: user.stats.kills + player.kills,
            deaths: user.stats.deaths + player.deaths,
            assists: user.stats.assists + player.assists,
            mvpRate: player.isMVP ? (user.stats.mvpRate + 1) / (gamesPlayed + 1) : user.stats.mvpRate
          },
          lastActive: new Date()
        }
      );
    }

    // Save match record
    const match = new MatchModel({
      matchId,
      winnerTeam,
      teams,
      playedAt: new Date()
    });
    await match.save();

    res.json({
      success: true,
      mmrChanges: Object.fromEntries(mmrChanges),
      matchId
    });
  } catch (error) {
    console.error('MMR calculation error:', error);
    res.status(500).json({ error: 'MMR calculation failed' });
  }
});

// Get MMR history
app.get('/history/:odyseeId', async (req, res) => {
  try {
    const { odyseeId } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;

    const matches = await MatchModel.find({
      'teams.players.odyseeId': odyseeId
    })
      .sort({ playedAt: -1 })
      .limit(limit);

    const history = matches.map(match => {
      const playerData = match.teams
        .flatMap(t => t.players)
        .find(p => p.odyseeId === odyseeId);

      return {
        matchId: match.matchId,
        mmrBefore: playerData?.mmrBefore,
        mmrAfter: playerData?.mmrAfter,
        mmrChange: playerData?.mmrChange,
        playedAt: match.playedAt
      };
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch MMR history' });
  }
});

// Get rank distribution
app.get('/distribution', async (req, res) => {
  try {
    const distribution: Record<string, number> = {};
    const region = req.query.region as string || 'Global';

    for (const [tier, config] of Object.entries(RANK_TIERS)) {
      const count = await UserModel.countDocuments({
        region,
        mmr: { $gte: config.min, $lt: typeof config.max === 'number' ? config.max : 999999999 }
      });
      distribution[tier] = count;
    }

    res.json(distribution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch distribution' });
  }
});

// Helper to determine rank tier
function getRankTier(mmr: number): string {
  for (const [tier, config] of Object.entries(RANK_TIERS)) {
    if (mmr >= config.min && mmr <= config.max) {
      return tier;
    }
  }
  return 'WARRIOR';
}

// Estimate MMR after win/loss
app.get('/estimate/:odyseeId', async (req, res) => {
  try {
    const { odyseeId } = req.params;
    const { opponentMMR, isWin } = req.query;

    const user = await UserModel.findOne({ odyseeId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const oppMMR = parseInt(opponentMMR as string) || 1500;
    const win = isWin === 'true';

    const k = getKFactor(user.totalMatches, true);
    const expected = calculateExpectedScore(user.mmr, oppMMR);
    const actual = win ? 1 : 0;
    const estimatedChange = Math.round(k * (actual - expected));

    res.json({
      currentMMR: user.mmr,
      estimatedMMR: Math.max(0, user.mmr + estimatedChange),
      change: estimatedChange,
      winChance: Math.round(expected * 100)
    });
  } catch (error) {
    res.status(500).json({ error: 'Estimation failed' });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`📊 MMR Service running on port ${PORT}`));