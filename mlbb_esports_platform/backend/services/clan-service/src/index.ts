import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { ClanModel } from '../../common/models/schemas';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clan_db';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Clan Service connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create clan
app.post('/', async (req, res) => {
  try {
    const clan = new ClanModel({
      ...req.body,
      clanId: `clan_${Date.now()}`
    });
    await clan.save();
    res.status(201).json(clan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create clan' });
  }
});

// Get all clans with filters
app.get('/', async (req, res) => {
  try {
    const { region, page = 1, limit = 20, search } = req.query;
    const query: any = {};

    if (region) query.region = region;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tag: { $regex: search, $options: 'i' } }
      ];
    }

    const clans = await ClanModel.find(query)
      .sort({ averageMMR: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await ClanModel.countDocuments(query);

    res.json({
      clans,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clans' });
  }
});

// Get single clan
app.get('/:clanId', async (req, res) => {
  try {
    const clan = await ClanModel.findOne({ clanId: req.params.clanId });
    if (!clan) {
      return res.status(404).json({ error: 'Clan not found' });
    }
    res.json(clan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clan' });
  }
});

// Update clan
app.put('/:clanId', async (req, res) => {
  try {
    const clan = await ClanModel.findOneAndUpdate(
      { clanId: req.params.clanId },
      req.body,
      { new: true }
    );

    if (!clan) {
      return res.status(404).json({ error: 'Clan not found' });
    }

    res.json(clan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update clan' });
  }
});

// Add member
app.post('/:clanId/members', async (req, res) => {
  try {
    const { odyseeId, username, role = 'Member' } = req.body;

    const clan = await ClanModel.findOneAndUpdate(
      { clanId: req.params.clanId },
      {
        $push: {
          members: { odyseeId, username, role, joinedAt: new Date() }
        }
      },
      { new: true }
    );

    if (!clan) {
      return res.status(404).json({ error: 'Clan not found' });
    }

    res.json(clan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add member' });
  }
});

// Remove member
app.delete('/:clanId/members/:odyseeId', async (req, res) => {
  try {
    const clan = await ClanModel.findOneAndUpdate(
      { clanId: req.params.clanId },
      {
        $pull: {
          members: { odyseeId: req.params.odyseeId }
        }
      },
      { new: true }
    );

    if (!clan) {
      return res.status(404).json({ error: 'Clan not found' });
    }

    res.json(clan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

// Get clan rankings
app.get('/rankings/top', async (req, res) => {
  try {
    const { region, limit = 50 } = req.query;

    const query: any = {};
    if (region) query.region = region;

    const clans = await ClanModel.find(query)
      .sort({ averageMMR: -1 })
      .limit(Number(limit));

    res.json({ clans });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rankings' });
  }
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => console.log(`⚔️ Clan Service running on port ${PORT}`));