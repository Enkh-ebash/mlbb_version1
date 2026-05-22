import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { UserModel } from '../../common/models/schemas';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_db';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Auth Service connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth Routes
app.post('/register', async (req, res) => {
  try {
    const { odyseeId, username, email, password, country, region } = req.body;

    const existingUser = await UserModel.findOne({ $or: [{ odyseeId }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = new UserModel({
      odyseeId,
      username,
      email,
      passwordHash,
      country,
      region,
      mmr: 1000,
      rankTier: 'WARRIOR',
      rankPoints: 0
    });

    await user.save();

    const token = jwt.sign({ odyseeId: user.odyseeId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({
      user: {
        odyseeId: user.odyseeId,
        username: user.username,
        email: user.email,
        mmr: user.mmr,
        rankTier: user.rankTier
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    user.lastActive = new Date();
    user.isOnline = true;
    await user.save();

    const token = jwt.sign({ odyseeId: user.odyseeId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      user: {
        odyseeId: user.odyseeId,
        username: user.username,
        email: user.email,
        mmr: user.mmr,
        rankTier: user.rankTier,
        avatar: user.avatar
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/logout', async (req, res) => {
  try {
    const { odyseeId } = req.body;
    await UserModel.findOneAndUpdate({ odyseeId }, { isOnline: false });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

app.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { odyseeId: string };
    const user = await UserModel.findOne({ odyseeId: decoded.odyseeId });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({ user: { odyseeId: user.odyseeId, username: user.username, mmr: user.mmr } });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/user/:odyseeId', async (req, res) => {
  try {
    const user = await UserModel.findOne({ odyseeId: req.params.odyseeId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.put('/user/:odyseeId', async (req, res) => {
  try {
    const updates = req.body;
    const user = await UserModel.findOneAndUpdate(
      { odyseeId: req.params.odyseeId },
      updates,
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🔐 Auth Service running on port ${PORT}`));