import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import { LeaderboardEntryModel } from '../../common/models/schemas';
import { RANK_TIERS, REGIONS } from '../../common/config';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/leaderboard_db';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Initialize Redis for live updates
const redis = new Redis(REDIS_URL);
const publisher = new Redis(REDIS_URL);

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Leaderboard Service connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Cache key generators
const getLeaderboardKey = (region: string, page: number) => `leaderboard:${region}:${page}`;
const getPlayerRankKey = (odyseeId: string) => `player_rank:${odyseeId}`;

// Get global leaderboard with pagination
app.get('/leaderboard', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const region = req.query.region as string || 'Global';
    const search = req.query.search as string;

    let query: any = { region };

    if (search) {
      query.username = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    // Try cache first
    const cachedData = await redis.get(getLeaderboardKey(region, page));
    if (cachedData && !search) {
      return res.json(JSON.parse(cachedData));
    }

    const [entries, total] = await Promise.all([
      LeaderboardEntryModel.find(query).sort({ mmr: -1 }).skip(skip).limit(limit),
      LeaderboardEntryModel.countDocuments(query)
    ]);

    const response = {
      entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      timestamp: new Date()
    };

    // Cache for 30 seconds (live updates every 30s)
    if (!search) {
      await redis.setex(getLeaderboardKey(region, page), 30, JSON.stringify(response));
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get player's current rank
app.get('/rank/:odyseeId', async (req, res) => {
  try {
    const { odyseeId } = req.params;

    // Try cache first
    const cachedRank = await redis.get(getPlayerRankKey(odyseeId));
    if (cachedRank) {
      return res.json(JSON.parse(cachedRank));
    }

    const player = await LeaderboardEntryModel.findOne({ odyseeId });
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Get rivals (players with similar MMR)
    const rivals = await LeaderboardEntryModel.find({
      mmr: { $gte: player.mmr - 200, $lte: player.mmr + 200 },
      odyseeId: { $ne: odyseeId }
    }).limit(5);

    const rankData = { player, rivals };
    await redis.setex(getPlayerRankKey(odyseeId), 60, JSON.stringify(rankData));

    res.json(rankData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rank' });
  }
});

// Set/update player ranking
app.post('/rank', async (req, res) => {
  try {
    const { odyseeId, username, avatar, mmr, region, winRate, totalMatches } = req.body;

    const rankTier = Object.entries(RANK_TIERS).find(
      ([_, tier]) => mmr >= tier.min && mmr <= tier.max
    )?.[0] || 'WARRIOR';

    // Calculate global rank
    const higherMMRCount = await LeaderboardEntryModel.countDocuments({ mmr: { $gt: mmr } });
    const rank = higherMMRCount + 1;

    const entry = await LeaderboardEntryModel.findOneAndUpdate(
      { odyseeId },
      {
        odyseeId,
        username,
        avatar,
        mmr,
        rankTier,
        rankPoints: mmr % 1000,
        region,
        winRate,
        totalMatches,
        rank,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    // Invalidate cache
    await redis.del(getLeaderboardKey(region, Math.ceil(rank / 50)));
    await redis.del(getPlayerRankKey(odyseeId));

    // Publish update for live WebSocket clients
    await publisher.publish('leaderboard_updates', JSON.stringify({
      type: 'RANK_UPDATE',
      odyseeId,
      rank,
      mmr,
      rankTier,
      timestamp: new Date()
    }));

    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update rank' });
  }
});

// Compare two players
app.get('/compare/:odyseeId1/:odyseeId2', async (req, res) => {
  try {
    const { odyseeId1, odyseeId2 } = req.params;

    const [player1, player2] = await Promise.all([
      LeaderboardEntryModel.findOne({ odyseeId: odyseeId1 }),
      LeaderboardEntryModel.findOne({ odyseeId: odyseeId2 })
    ]);

    if (!player1 || !player2) {
      return res.status(404).json({ error: 'One or both players not found' });
    }

    res.json({
      player1: { rank: player1.rank, mmr: player1.mmr, winRate: player1.winRate },
      player2: { rank: player2.rank, mmr: player2.mmr, winRate: player2.winRate },
      comparison: {
        rankDiff: player1.rank - player2.rank,
        mmrDiff: player1.mmr - player2.mmr,
        winRateDiff: player1.winRate - player2.winRate
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to compare players' });
  }
});

// Get top 3 podium
app.get('/podium', async (req, res) => {
  try {
    const region = req.query.region as string || 'Global';

    const podium = await LeaderboardEntryModel.find({ region })
      .sort({ mmr: -1 })
      .limit(3);

    res.json({
      podium,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch podium' });
  }
});

// Get trending players (recent rank changes)
app.get('/trending', async (req, res) => {
  try {
    const region = req.query.region as string || 'Global';
    const limit = parseInt(req.query.limit as string) || 10;

    const trending = await LeaderboardEntryModel.find({ region, trend: 'up' })
      .sort({ lastUpdated: -1 })
      .limit(limit);

    res.json({ trending, timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending players' });
  }
});

// Subscribe to live updates (SSE endpoint)
app.get('/live', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const subscriber = new Redis(REDIS_URL);

  subscriber.subscribe('leaderboard_updates', (err) => {
    if (err) console.error('Redis subscribe error:', err);
  });

  subscriber.on('message', (_channel, message) => {
    res.write(`data: ${message}\n\n`);
  });

  req.on('close', () => {
    subscriber.unsubscribe();
    subscriber.quit();
  });
});

// Bulk update rankings (admin)
app.post('/bulk-update', async (req, res) => {
  try {
    const { updates } = req.body; // Array of { odyseeId, mmr, ... }

    const bulkOps = updates.map((update: any) => {
      const rankTier = Object.entries(RANK_TIERS).find(
        ([_, tier]) => update.mmr >= tier.min && update.mmr <= tier.max
      )?.[0] || 'WARRIOR';

      return {
        updateOne: {
          filter: { odyseeId: update.odyseeId },
          update: {
            $set: {
              ...update,
              rankTier,
              rankPoints: update.mmr % 1000,
              lastUpdated: new Date()
            }
          },
          upsert: true
        }
      };
    });

    await LeaderboardEntryModel.bulkWrite(bulkOps);

    // Invalidate all caches
    const keys = await redis.keys('leaderboard:*');
    if (keys.length > 0) await redis.del(...keys);

    res.json({ message: 'Bulk update successful', count: updates.length });
  } catch (error) {
    res.status(500).json({ error: 'Bulk update failed' });
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`🏆 Leaderboard Service running on port ${PORT}`));