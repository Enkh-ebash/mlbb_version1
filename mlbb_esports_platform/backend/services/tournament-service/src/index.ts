import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { TournamentModel } from '../../common/models/schemas';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tournament_db';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Tournament Service connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create tournament
app.post('/', async (req, res) => {
  try {
    const tournament = new TournamentModel({
      ...req.body,
      tournamentId: `tournament_${Date.now()}`
    });
    await tournament.save();
    res.status(201).json(tournament);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tournament' });
  }
});

// Get all tournaments with filters
app.get('/', async (req, res) => {
  try {
    const { region, status, page = 1, limit = 20 } = req.query;
    const query: any = {};

    if (region) query.region = region;
    if (status) query.status = status;

    const tournaments = await TournamentModel.find(query)
      .sort({ startDate: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await TournamentModel.countDocuments(query);

    res.json({
      tournaments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
});

// Get single tournament
app.get('/:tournamentId', async (req, res) => {
  try {
    const tournament = await TournamentModel.findOne({ tournamentId: req.params.tournamentId });
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tournament' });
  }
});

// Register team
app.post('/:tournamentId/register', async (req, res) => {
  try {
    const { clanId, teamName, captainId } = req.body;
    const tournament = await TournamentModel.findOneAndUpdate(
      { tournamentId: req.params.tournamentId },
      {
        $inc: { registeredTeams: 1 },
        $push: {
          registeredTeams: { clanId, teamName, captainId, registeredAt: new Date() }
        }
      },
      { new: true }
    );

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register team' });
  }
});

// Update bracket
app.put('/:tournamentId/bracket', async (req, res) => {
  try {
    const tournament = await TournamentModel.findOneAndUpdate(
      { tournamentId: req.params.tournamentId },
      { bracket: req.body.bracket },
      { new: true }
    );

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bracket' });
  }
});

// Update tournament status
app.put('/:tournamentId/status', async (req, res) => {
  try {
    const tournament = await TournamentModel.findOneAndUpdate(
      { tournamentId: req.params.tournamentId },
      { status: req.body.status },
      { new: true }
    );

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`🏆 Tournament Service running on port ${PORT}`));