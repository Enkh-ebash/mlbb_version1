// MLBB Mongolia - Backend Server
// Express server with MongoDB integration

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Mock data for when DB is not connected
const mockLeaderboard = [
  { id: 1, username: 'DragonSlayer', mmr: 15890, rank: 'CELESTIAL', winRate: 72.4, wins: 1245, losses: 476, matches: 1721, region: 'Mongolia' },
  { id: 2, username: 'PhoenixRising', mmr: 15420, rank: 'CELESTIAL', winRate: 68.2, wins: 1089, losses: 508, matches: 1597, region: 'Mongolia' },
  { id: 3, username: 'ShadowStrike', mmr: 15100, rank: 'MYTHICAL_HONOR', winRate: 65.8, wins: 956, losses: 497, matches: 1453, region: 'Asia' },
  { id: 4, username: 'IceBreaker', mmr: 14850, rank: 'MYTHICAL_HONOR', winRate: 63.4, wins: 892, losses: 515, matches: 1407, region: 'Americas' },
  { id: 5, username: 'BlazeFury', mmr: 14560, rank: 'MYTHICAL_GLORY', winRate: 61.2, wins: 845, losses: 537, matches: 1382, region: 'Europe' },
];

const mockTournaments = [
  { id: 1, name: 'MLBB Mongolia Championship 2024', prizePool: 50000000, type: 'Pro League', status: 'registration', startDate: '2024-06-15', slots: 16, registered: 8 },
  { id: 2, name: 'Spring Cup Series', prizePool: 10000000, type: 'Open', status: 'in_progress', startDate: '2024-05-01', slots: 32, registered: 32 },
  { id: 3, name: 'Community Clash', prizePool: 5000000, type: 'Amateur', status: 'registration', startDate: '2024-06-20', slots: 64, registered: 24 },
  { id: 4, name: 'Grand Master Tournament', prizePool: 20000000, type: 'Invitational', status: 'completed', startDate: '2024-04-01', slots: 8, registered: 8 },
];

const mockStats = {
  totalPlayers: 128459,
  activePlayers: 24567,
  matchesToday: 89432,
  tournamentsActive: 12,
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const { region = 'Global' } = req.query;
    // In production, query MongoDB
    // For now, return mock data
    res.json({ users: mockLeaderboard, region });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    res.json(mockStats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/tournaments', async (req, res) => {
  try {
    res.json(mockTournaments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  // Mock login - in production, verify against MongoDB
  if (username && password) {
    const user = {
      id: 'mock_user_id',
      username,
      email: `${username}@mlbb.mn`,
      mmr: 8500 + Math.floor(Math.random() * 1000),
      rank: Math.floor(Math.random() * 1000) + 1,
      region: 'Mongolia',
      rankTier: 'MYTHICAL_HONOR'
    };
    res.json({ success: true, user, token: 'mock_jwt_token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  // Mock registration
  if (username && email && password) {
    const user = {
      id: 'new_user_id',
      username,
      email,
      mmr: 1000,
      rank: 999999,
      region: 'Mongolia',
      rankTier: 'WARRIOR'
    };
    res.json({ success: true, user, token: 'mock_jwt_token' });
  } else {
    res.status(400).json({ error: 'Missing fields' });
  }
});

// Matchmaking routes
app.post('/api/matchmaking/join', async (req, res) => {
  const { queueType, userId } = req.body;
  res.json({
    success: true,
    queueId: `queue_${Date.now()}`,
    estimatedWait: 45,
    position: Math.floor(Math.random() * 50) + 1
  });
});

app.delete('/api/matchmaking/leave', async (req, res) => {
  res.json({ success: true });
});

// MongoDB Connection (optional - app works without it)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mlbb_mongolia';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.log('⚠️ MongoDB not connected - using mock data');
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║   MLBB Mongolia Backend Server             ║
║   Running on port ${PORT}                     ║
║   API: http://localhost:${PORT}/api          ║
╚═══════════════════════════════════════════╝
  `);
});

module.exports = app;