import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import { HeroStatsModel, UserModel } from '../../common/models/schemas';
import heroes from '../../../db/mongodb/init';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/analytics_db';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Analytics Service connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const redis = new Redis(REDIS_URL);

// Get hero meta analytics
app.get('/heroes/meta', async (req, res) => {
  try {
    const { region, limit = 20 } = req.query;

    // Try cache first
    const cacheKey = `meta:${region || 'Global'}:${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const heroStats = await HeroStatsModel.find()
      .sort({ pickRate: -1 })
      .limit(Number(limit));

    // Calculate tier list
    const tiers = {
      S: heroStats.filter(h => h.winRate > 52 && h.pickRate > 20),
      A: heroStats.filter(h => h.winRate > 50 && h.pickRate > 10),
      B: heroStats.filter(h => h.winRate > 48),
      C: heroStats.filter(h => h.winRate <= 48)
    };

    const response = { heroStats, tiers };

    await redis.setex(cacheKey, 300, JSON.stringify(response)); // 5 min cache

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meta analytics' });
  }
});

// Get hero trends
app.get('/heroes/:heroId/trends', async (req, res) => {
  try {
    const { heroId } = req.params;
    const { days = 30 } = req.query;

    const hero = await HeroStatsModel.findOne({ heroId });
    if (!hero) {
      return res.status(404).json({ error: 'Hero not found' });
    }

    const cutoffDate = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000);
    const trends = hero.trends.filter(t => t.date >= cutoffDate);

    res.json({ heroId, heroName: hero.name, trends });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// Get match analytics
app.get('/matches/analytics', async (req, res) => {
  try {
    const { region } = req.query;

    const cacheKey = `match_analytics:${region || 'Global'}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const analytics = {
      averageGameDuration: 920, // 15:20 in seconds
      averageKillsPerGame: 28,
      averageDeathsPerGame: 30,
      averageAssistsPerGame: 45,
      firstBloodRate: 52,
      highestMMR: 16500,
      totalActivePlayers: 125000,
      peakConcurrentPlayers: 45000,
      mostPopularRole: 'Marksman',
      fastestMatch: { duration: 480, winner: 'Team A' },
      longestMatch: { duration: 2400, winner: 'Team B' }
    };

    await redis.setex(cacheKey, 300, JSON.stringify(analytics));

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch match analytics' });
  }
});

// Get player statistics
app.get('/players/:odyseeId/stats', async (req, res) => {
  try {
    const { odyseeId } = req.params;

    const user = await UserModel.findOne({ odyseeId });
    if (!user) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const stats = {
      odyseeId: user.odyseeId,
      username: user.username,
      mmr: user.mmr,
      rankTier: user.rankTier,
      winRate: user.winRate,
      totalMatches: user.totalMatches,
      avgKDA: {
        kills: Math.round(user.stats.kills / user.totalMatches * 10) / 10,
        deaths: Math.round(user.stats.deaths / user.totalMatches * 10) / 10,
        assists: Math.round(user.stats.assists / user.totalMatches * 10) / 10
      },
      mvpRate: Math.round(user.stats.mvpRate * 100 * 10) / 10,
      region: user.region
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
});

// Get regional statistics
app.get('/regions/:region/stats', async (req, res) => {
  try {
    const { region } = req.params;

    const [playerCount, avgMMR, topPlayers] = await Promise.all([
      UserModel.countDocuments({ region }),
      UserModel.aggregate([
        { $match: { region } },
        { $group: { _id: null, avgMMR: { $avg: '$mmr' } } }
      ]),
      UserModel.find({ region }).sort({ mmr: -1 }).limit(10)
    ]);

    res.json({
      region,
      playerCount,
      averageMMR: Math.round(topPlayers[0]?.mmr || 0),
      topPlayers
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch regional stats' });
  }
});

// Post match for analytics processing
app.post('/matches/process', async (req, res) => {
  try {
    const { matchId, players } = req.body;

    // Update hero statistics
    for (const player of players) {
      const heroStats = await HeroStatsModel.findOne({ heroId: player.heroId });
      if (heroStats) {
        const win = player.isWinner ? 1 : 0;
        const newPickRate = ((heroStats.pickRate * 0.9) + 10) / 2;
        const newWinRate = ((heroStats.winRate * 0.9) + (win ? 100 : 0)) / 2;

        await HeroStatsModel.findOneAndUpdate(
          { heroId: player.heroId },
          {
            pickRate: newPickRate,
            winRate: Math.round(newWinRate * 100) / 100,
            averageKDA: {
              kills: (heroStats.averageKDA.kills + player.kills) / 2,
              deaths: (heroStats.averageKDA.deaths + player.deaths) / 2,
              assists: (heroStats.averageKDA.assists + player.assists) / 2
            },
            $push: {
              trends: {
                date: new Date(),
                pickRate: newPickRate,
                winRate: Math.round(newWinRate * 100) / 100
              }
            }
          }
        );
      }
    }

    res.json({ success: true, matchId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process match' });
  }
});

// Initialize heroes database
app.post('/heroes/init', async (req, res) => {
  try {
    for (const hero of heroes) {
      await HeroStatsModel.findOneAndUpdate(
        { heroId: hero.id },
        {
          heroId: hero.id,
          name: hero.name,
          role: hero.role,
          pickRate: Math.random() * 30,
          banRate: Math.random() * 15,
          winRate: 45 + Math.random() * 10,
          averageKDA: {
            kills: Math.round(3 + Math.random() * 4),
            deaths: Math.round(3 + Math.random() * 3),
            assists: Math.round(5 + Math.random() * 5)
          },
          trends: []
        },
        { upsert: true }
      );
    }

    res.json({ success: true, heroCount: heroes.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize heroes' });
  }
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => console.log(`📈 Analytics Service running on port ${PORT}`));