import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import Redis from 'ioredis';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/matchmaking_db';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Matchmaking Service connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const redis = new Redis(REDIS_URL);

interface QueuedPlayer {
  odyseeId: string;
  username: string;
  mmr: number;
  region: string;
  queueType: string;
  queuedAt: number;
}

interface MatchTicket {
  ticketId: string;
  players: QueuedPlayer[];
  status: 'forming' | 'ready' | 'matched';
  createdAt: number;
}

// MMR tolerance based on rank
function getMMRTolerance(mmr: number): number {
  if (mmr < 1000) return 200;
  if (mmr < 2000) return 250;
  if (mmr < 3000) return 300;
  if (mmr < 4000) return 350;
  if (mmr < 5000) return 400;
  return 450;
}

// Join queue
app.post('/queue/join', async (req, res) => {
  try {
    const { odyseeId, username, mmr, region, queueType } = req.body;

    const player: QueuedPlayer = {
      odyseeId,
      username,
      mmr,
      region,
      queueType,
      queuedAt: Date.now()
    };

    const queueKey = `queue:${region}:${queueType}`;
    const playerKey = `player:${odyseeId}`;

    // Check if already in queue
    const existing = await redis.get(playerKey);
    if (existing) {
      return res.status(400).json({ error: 'Already in queue' });
    }

    // Add to queue
    await redis.lpush(queueKey, JSON.stringify(player));
    await redis.setex(playerKey, 3600, queueKey); // 1 hour TTL

    res.json({ success: true, message: 'Joined queue', position: await redis.llen(queueKey) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to join queue' });
  }
});

// Leave queue
app.post('/queue/leave', async (req, res) => {
  try {
    const { odyseeId } = req.body;

    const queueKey = await redis.get(`player:${odyseeId}`);
    if (!queueKey) {
      return res.status(400).json({ error: 'Not in queue' });
    }

    // Remove from queue (simplified - in production would need Lua script for atomicity)
    await redis.del(`player:${odyseeId}`);
    await redis.del(queueKey.split(':').pop()!);

    res.json({ success: true, message: 'Left queue' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to leave queue' });
  }
});

// Get queue status
app.get('/queue/status/:odyseeId', async (req, res) => {
  try {
    const { odyseeId } = req.params;

    const queueKey = await redis.get(`player:${odyseeId}`);
    if (!queueKey) {
      return res.json({ inQueue: false });
    }

    const position = await redis.lpos(queueKey, JSON.stringify({ odyseeId }));
    const queueLength = await redis.llen(queueKey);

    res.json({
      inQueue: true,
      position: position ?? -1,
      queueLength,
      queueKey
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get queue status' });
  }
});

// Find match (simplified matching algorithm)
app.post('/match/find', async (req, res) => {
  try {
    const { region, queueType } = req.body;

    const queueKey = `queue:${region}:${queueType}`;
    const playersRaw = await redis.lrange(queueKey, 0, -1);

    if (playersRaw.length < 10) {
      return res.json({ matched: false, message: 'Waiting for more players...' });
    }

    const players: QueuedPlayer[] = playersRaw.map(p => JSON.parse(p));

    // Sort by MMR and group into teams
    players.sort((a, b) => a.mmr - b.mmr);

    const team1: QueuedPlayer[] = [];
    const team2: QueuedPlayer[] = [];

    for (let i = 0; i < players.length; i++) {
      if (i % 2 === 0) {
        team1.push(players[i]);
      } else {
        team2.push(players[i]);
      }
    }

    // Calculate team averages (should be balanced)
    const team1Avg = team1.reduce((sum, p) => sum + p.mmr, 0) / team1.length;
    const team2Avg = team2.reduce((sum, p) => sum + p.mmr, 0) / team2.length;

    if (Math.abs(team1Avg - team2Avg) > 100) {
      return res.json({ matched: false, message: 'Cannot balance teams' });
    }

    // Create match ticket
    const ticket: MatchTicket = {
      ticketId: `match_${Date.now()}`,
      players: [...team1, ...team2],
      status: 'matched',
      createdAt: Date.now()
    };

    // Store match ticket
    await redis.setex(`match:${ticket.ticketId}`, 3600, JSON.stringify(ticket));

    // Clear matched players from queue
    for (const player of ticket.players) {
      await redis.del(`player:${player.odyseeId}`);
    }
    await redis.del(queueKey);

    res.json({
      matched: true,
      ticket
    });
  } catch (error) {
    res.status(500).json({ error: 'Match finding failed' });
  }
});

// Accept match
app.post('/match/accept', async (req, res) => {
  try {
    const { ticketId, odyseeId } = req.body;

    const acceptKey = `accept:${ticketId}`;
    await redis.sadd(acceptKey, odyseeId);
    await redis.expire(acceptKey, 300); // 5 minute TTL

    // Check if all players accepted
    const matchRaw = await redis.get(`match:${ticketId}`);
    if (!matchRaw) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const match: MatchTicket = JSON.parse(matchRaw);
    const acceptedCount = await redis.scard(acceptKey);

    res.json({
      accepted: true,
      acceptedCount,
      requiredCount: match.players.length,
      ready: acceptedCount >= match.players.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept match' });
  }
});

// Get match history
app.get('/matches/:odyseeId', async (req, res) => {
  try {
    const { odyseeId } = req.params;
    const matches = await redis.lrange(`history:${odyseeId}`, 0, 19);

    res.json({ matches: matches.map(m => JSON.parse(m)) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch match history' });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`⚔️ Matchmaking Service running on port ${PORT}`));