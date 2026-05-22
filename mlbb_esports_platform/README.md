# MLBB Esports Platform

A professional-grade esports platform for Mobile Legends: Bang Bang (MLBB) featuring scalable microservice architecture, real-time leaderboards, and competitive matchmaking similar to FACEIT, Riot Games, and Valve services.

## Features

### Backend Microservices
- **API Gateway** - Unified entry point with rate limiting, security headers
- **Auth Service** - JWT-based authentication, user management
- **Matchmaking Service** - ELO-based matchmaking queue with Redis
- **MMR Service** - ELO rating calculation with performance modifiers
- **Leaderboard Service** - Real-time rankings with live updates via Redis Pub/Sub
- **Tournament Service** - Tournament management and bracket generation
- **Clan Service** - Guild/clan management
- **Analytics Service** - Hero meta analytics, player statistics
- **Notification Service** - Real-time notifications via WebSocket/SSE
- **Chat Service** - Global, clan, and whisper chat channels

### Frontend Features
- **Cyberpunk Esports Dashboard** - Live activity ticker, match feed
- **Animated Leaderboard** - Neon rank transitions, glowing podium top 3
- **Player Comparison** - Rank/MMR comparison graphs
- **Live Updates** - Real-time rank changes via Server-Sent Events
- **Regional Filters** - Filter by Americas, Europe, Asia, Southeast Asia
- **Infinite Scroll** - Paginated leaderboard with smooth loading
- **Trending Players** - Rising stars section
- **Match History** - Detailed match statistics

### MLBB Hero Database
All 100+ MLBB heroes included across roles:
- Tank, Fighter, Assassin, Mage, Marksman, Support

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (persistent), Redis (cache/pub-sub)
- **Frontend**: React, TypeScript, TailwindCSS, Framer Motion, Recharts
- **Containers**: Docker, Docker Compose
- **Orchestration**: Kubernetes-ready

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)

### Development (Docker)
```bash
cd backend
docker-compose up --build
```

### Development (Local)
```bash
# Backend
cd backend
npm install
docker-compose up mongodb redis
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Production Deployment
```bash
docker-compose -f docker-compose.yml up -d
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (Port 3000)                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐ ┌───────────┐ ┌────────┐ ┌───────────┐         │
│  │   Auth   │ │Matchmaking│ │  MMR   │ │Leaderboard│         │
│  │  (:3001) │ │  (:3002)  │ │(:3003) │ │  (:3004)  │         │
│  └──────────┘ └───────────┘ └────────┘ └───────────┘         │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ���─────────┐         │
│  │Tournament│ │   Clan   │ │ Analytics │ │Notifica │         │
│  │  (:3005) │ │  (:3006) │ │  (:3007)  │ │tion(:30)│         │
│  └──────────┘ └──────────┘ └───────────┘ └─────────┘         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    │               │
               ┌────┴────┐    ┌────┴────┐
               │  MongoDB │    │  Redis   │
               └─────────┘    └─────────┘
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | JWT signing secret | super-secret-key |
| `JWT_EXPIRES_IN` | Token expiration | 7d |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017 |
| `REDIS_URL` | Redis connection string | redis://localhost:6379 |

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/verify` - Verify token

### Leaderboard
- `GET /api/v1/leaderboard/leaderboard` - Get leaderboard
- `GET /api/v1/leaderboard/rank/:odyseeId` - Get player rank
- `POST /api/v1/leaderboard/rank` - Update rank
- `GET /api/v1/leaderboard/podium` - Get top 3
- `GET /api/v1/leaderboard/trending` - Get trending players
- `GET /api/v1/leaderboard/live` - SSE for live updates

### Matchmaking
- `POST /api/v1/matchmaking/queue/join` - Join queue
- `POST /api/v1/matchmaking/match/find` - Find match
- `POST /api/v1/matchmaking/match/accept` - Accept match

### MMR Calculation
- `POST /api/mmr/calculate` - Calculate MMR change
- `GET /api/mmr/history/:odyseeId` - Get MMR history
- `GET /api/mmr/distribution` - Rank distribution

## MLBB Heroes Database

The platform includes all ~100+ MLBB heroes organized by role:

**Tank Heroes**
- Tanksworth, Grock, Hylos, Johnson, Minotau
- Thamuz, Fredrinn, Chip, Barats, Lolita

**Fighter Heroes**
- Balmond, Alucard, Zilong, Freya, Chou
- Jawhead, Leomord, Lapu, Masha, Fanny, Hayabusa

**Assassin Heroes**
- Saber, Natalia, Ling, Joy, Aamon, Selena
- Gusion, Harith, Lancelot, Kimmy, Hanzo

**Mage Heroes**
- Cyclops, Eudora, Bruno, Liliana, Chang'e, Vale
- Lunox, Esmeralda, Valir, Pharsa, Aurora, Kagura

**Marksman Heroes**
- Miya, Layla, Karrie, Clint, Moskov
- Yi Sun-shin, Beatrix, Natan, Popol, Brody

**Support Heroes**
- Angela, Estes, Mathilda, Rafaela, Floryn
- Pearl, Diggie, Carmilla

## Adding Hero Images

To add hero images:
1. Place images in `backend/db/images/heroes/`
2. Name format: `{hero_id}.png` (e.g., `fighter_001.png`)
3. Update hero database entries with image paths

## License

MIT - Built for competitive esports excellence.