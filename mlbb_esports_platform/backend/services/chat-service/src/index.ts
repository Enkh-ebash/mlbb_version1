import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import Redis from 'ioredis';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat_db';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Chat Service connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const redis = new Redis(REDIS_URL);

interface Message {
  id: string;
  type: 'global' | 'clan' | 'party' | 'whisper';
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

// Global chat
app.post('/global/send', async (req, res) => {
  try {
    const { senderId, senderName, content } = req.body;

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'global',
      senderId,
      senderName,
      content,
      timestamp: new Date()
    };

    await redis.lpush('chat:global', JSON.stringify(message));
    await redis.ltrim('chat:global', 0, 499); // Keep last 500
    await redis.publish('chat_global', JSON.stringify(message));

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.get('/global/history', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const messages = await redis.lrange('chat:global', 0, Number(limit) - 1);
    res.json({ messages: messages.map(m => JSON.parse(m)) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Clan chat
app.post('/clan/:clanId/send', async (req, res) => {
  try {
    const { clanId } = req.params;
    const { senderId, senderName, content } = req.body;

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'clan',
      senderId,
      senderName,
      content,
      timestamp: new Date()
    };

    const channel = `chat:clan:${clanId}`;
    await redis.lpush(channel, JSON.stringify(message));
    await redis.ltrim(channel, 0, 499);
    await redis.publish(channel, JSON.stringify(message));

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.get('/clan/:clanId/history', async (req, res) => {
  try {
    const { clanId } = req.params;
    const { limit = 50 } = req.query;
    const messages = await redis.lrange(`chat:clan:${clanId}`, 0, Number(limit) - 1);
    res.json({ messages: messages.map(m => JSON.parse(m)) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Party chat
app.post('/party/:partyId/send', async (req, res) => {
  try {
    const { partyId } = req.params;
    const { senderId, senderName, content } = req.body;

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'party',
      senderId,
      senderName,
      content,
      timestamp: new Date()
    };

    const channel = `chat:party:${partyId}`;
    await redis.lpush(channel, JSON.stringify(message));
    await redis.ltrim(channel, 0, 99);
    await redis.publish(channel, JSON.stringify(message));

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Whisper (direct message)
app.post('/whisper/send', async (req, res) => {
  try {
    const { fromId, fromName, toId, content } = req.body;

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'whisper',
      senderId: fromId,
      senderName: fromName,
      content,
      timestamp: new Date()
    };

    // Store for both users
    const channel1 = `chat:whisper:${fromId}:${toId}`;
    const channel2 = `chat:whisper:${toId}:${fromId}`;

    await redis.lpush(channel1, JSON.stringify(message));
    await redis.ltrim(channel1, 0, 49);
    await redis.lpush(channel2, JSON.stringify(message));
    await redis.ltrim(channel2, 0, 49);
    await redis.publish(`chat_whisper:${toId}`, JSON.stringify(message));

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send whisper' });
  }
});

app.get('/whisper/:userId/:friendId/history', async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    const { limit = 50 } = req.query;
    const channel = `chat:whisper:${userId}:${friendId}`;
    const messages = await redis.lrange(channel, 0, Number(limit) - 1);
    res.json({ messages: messages.map(m => JSON.parse(m)) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch whisper history' });
  }
});

// Live chat subscription (SSE)
app.get('/channel/:channel/live', async (req, res) => {
  const { channel } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const subscriber = new Redis(REDIS_URL);

  let redisChannel = 'chat_global';
  if (channel.startsWith('clan:')) redisChannel = `chat:${channel}`;
  else if (channel.startsWith('party:')) redisChannel = `chat:${channel}`;
  else if (channel.startsWith('whisper:')) redisChannel = `chat_whisper:${channel.split(':')[1]}`;

  subscriber.subscribe(redisChannel, (err) => {
    if (err) console.error('Subscribe error:', err);
  });

  subscriber.on('message', (_ch, message) => {
    res.write(`data: ${message}\n\n`);
  });

  req.on('close', () => {
    subscriber.unsubscribe();
    subscriber.quit();
  });
});

const PORT = process.env.PORT || 3009;
app.listen(PORT, () => console.log(`💬 Chat Service running on port ${PORT}`));