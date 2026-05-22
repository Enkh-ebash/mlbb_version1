import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import Redis from 'ioredis';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notification_db';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Notification Service connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const redis = new Redis(REDIS_URL);

interface Notification {
  id: string;
  odyseeId: string;
  type: 'MATCH_FOUND' | 'MATCH_READY' | 'RANK_UPDATE' | 'TOURNAMENT' | 'CLAN' | 'SYSTEM';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

// Send notification
app.post('/', async (req, res) => {
  try {
    const { odyseeId, type, title, message, data } = req.body;

    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      odyseeId,
      type,
      title,
      message,
      data,
      read: false,
      createdAt: new Date()
    };

    // Store in Redis for quick access
    await redis.lpush(`notifications:${odyseeId}`, JSON.stringify(notification));
    await redis.ltrim(`notifications:${odyseeId}`, 0, 99); // Keep last 100

    // Publish for real-time delivery
    await redis.publish(`user_notifications:${odyseeId}`, JSON.stringify(notification));

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Get user notifications
app.get('/:odyseeId', async (req, res) => {
  try {
    const { odyseeId } = req.params;
    const { unreadOnly, limit = 20, offset = 0 } = req.query;

    const rawNotifications = await redis.lrange(
      `notifications:${odyseeId}`,
      Number(offset),
      Number(offset) + Number(limit) - 1
    );

    let notifications = rawNotifications.map(n => JSON.parse(n));

    if (unreadOnly === 'true') {
      notifications = notifications.filter((n: Notification) => !n.read);
    }

    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark as read
app.put('/:odyseeId/:notificationId/read', async (req, res) => {
  try {
    const { odyseeId, notificationId } = req.params;

    const notifications = await redis.lrange(`notifications:${odyseeId}`, 0, -1);
    let found = false;

    for (let i = 0; i < notifications.length; i++) {
      const notif: Notification = JSON.parse(notifications[i]);
      if (notif.id === notificationId) {
        notif.read = true;
        await redis.lset(`notifications:${odyseeId}`, i, JSON.stringify(notif));
        found = true;
        break;
      }
    }

    if (!found) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// Mark all as read
app.put('/:odyseeId/read-all', async (req, res) => {
  try {
    const { odyseeId } = req.params;

    const notifications = await redis.lrange(`notifications:${odyseeId}`, 0, -1);

    for (let i = 0; i < notifications.length; i++) {
      const notif: Notification = JSON.parse(notifications[i]);
      notif.read = true;
      await redis.lset(`notifications:${odyseeId}`, i, JSON.stringify(notif));
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

// Get unread count
app.get('/:odyseeId/unread-count', async (req, res) => {
  try {
    const { odyseeId } = req.params;

    const notifications = await redis.lrange(`notifications:${odyseeId}`, 0, -1);
    const unreadCount = notifications.filter((n: string) => !JSON.parse(n).read).length;

    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// Subscribe to real-time notifications (SSE)
app.get('/:odyseeId/live', async (req, res) => {
  const { odyseeId } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const subscriber = new Redis(REDIS_URL);

  subscriber.subscribe(`user_notifications:${odyseeId}`, (err) => {
    if (err) console.error('Subscribe error:', err);
  });

  subscriber.on('message', (_channel, message) => {
    res.write(`data: ${message}\n\n`);
  });

  req.on('close', () => {
    subscriber.unsubscribe();
    subscriber.quit();
  });
});

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => console.log(`🔔 Notification Service running on port ${PORT}`));