import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: 'Too many requests' }
});
app.use(limiter);

// Services configuration
const SERVICES = {
  'auth': 'http://auth-service:3001',
  'matchmaking': 'http://matchmaking-service:3002',
  'mmr': 'http://mmr-service:3003',
  'leaderboard': 'http://leaderboard-service:3004',
  'tournament': 'http://tournament-service:3005',
  'clan': 'http://clan-service:3006',
  'analytics': 'http://analytics-service:3007',
  'notification': 'http://notification-service:3008',
  'chat': 'http://chat-service:3009'
};

// Proxy routes
Object.entries(SERVICES).forEach(([name, url]) => {
  app.use(`/api/v1/${name}`, createProxyMiddleware({
    target: url,
    changeOrigin: true,
    pathRewrite: { [`^/api/v1/${name}`]: '' }
  }));
});

// Health check
app.get('/health', (_, res) => res.json({ status: 'healthy', timestamp: new Date() }));

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API Gateway running on port ${PORT}`));

export default app;