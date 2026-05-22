import { useState } from 'react';
import { motion } from 'framer-motion';
import { Swords, Clock, Users, Zap, Play, X, Radio } from 'lucide-react';
import { matchmakingApi } from '../services/api';
import { useAuthStore } from '../store';

const queueTypes = [
  { id: 'RANKED_SOLO', name: 'Ranked Solo', description: 'Prove your skills alone', icon: '🎮' },
  { id: 'RANKED_TEAM', name: 'Ranked Team', description: 'Play with your team', icon: '👥' },
  { id: 'CLASSIC', name: 'Classic', description: 'Casual match', icon: '🎯' },
];

export default function Matchmaking() {
  const { user } = useAuthStore();
  const [selectedQueue, setSelectedQueue] = useState<string | null>(null);
  const [inQueue, setInQueue] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [queueTime, setQueueTime] = useState(0);
  const [matchFound, setMatchFound] = useState(false);
  const [matchTicket, setMatchTicket] = useState<any>(null);

  const handleJoinQueue = async () => {
    if (!user || !selectedQueue) return;

    setInQueue(true);
    setQueueTime(0);
    setQueuePosition(Math.floor(Math.random() * 50) + 10);

    try {
      await matchmakingApi.joinQueue({
        odyseeId: user.odyseeId,
        username: user.username,
        mmr: user.mmr,
        region: user.region,
        queueType: selectedQueue,
      });
    } catch (error) {
      // Silent fail - queue simulation
    }

    // Simulate queue updates
    const timer = setInterval(() => {
      setQueueTime(t => t + 1);
      setQueuePosition(p => Math.max(1, p - Math.floor(Math.random() * 3)));
    }, 3000);

    // Wait for match
    setTimeout(() => {
      clearInterval(timer);
      setMatchFound(true);
      setMatchTicket({
        ticketId: `match_${Date.now()}`,
        estimatedWait: '~30 seconds',
      });
    }, 15000);
  };

  const handleLeaveQueue = async () => {
    if (user) {
      try {
        await matchmakingApi.leaveQueue(user.odyseeId);
      } catch {}
    }
    setInQueue(false);
    setMatchFound(false);
    setQueueTime(0);
  };

  const handleAcceptMatch = async () => {
    if (matchTicket && user) {
      try {
        await matchmakingApi.acceptMatch(matchTicket.ticketId, user.odyseeId);
      } catch {}
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-orbitron text-3xl font-bold mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-red to-cyber-orange">
            ⚔️ MATCHMAKING
          </span>
        </h1>
        <p className="text-gray-400">Find a match that suits your skill level</p>
      </motion.div>

      {!inQueue ? (
        /* Queue Selection */
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {queueTypes.map((queue, idx) => (
              <motion.div
                key={queue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedQueue(queue.id)}
                className={`cyber-card p-6 cursor-pointer transition-all ${
                  selectedQueue === queue.id
                    ? 'ring-2 ring-cyber-purple glow-purple'
                    : 'hover:scale-105'
                }`}
              >
                <div className="text-5xl mb-4">{queue.icon}</div>
                <h3 className="text-xl font-bold">{queue.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{queue.description}</p>
                {selectedQueue === queue.id && (
                  <motion.div
                    layoutId="queue-indicator"
                    className="mt-4 flex items-center gap-2 text-cyber-purple"
                  >
                    <Zap size={16} />
                    <span className="text-sm font-semibold">Selected</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!selectedQueue}
              onClick={handleJoinQueue}
              className={`cyber-button flex items-center gap-3 text-lg ${
                !selectedQueue ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Play size={24} />
              {selectedQueue ? 'FIND MATCH' : 'SELECT A GAME MODE'}
            </motion.button>
          </motion.div>
        </>
      ) : (
        /* Queue View */
        <div className="max-w-2xl mx-auto">
          {!matchFound ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="cyber-card p-8 text-center"
            >
              <div className="relative w-32 h-32 mx-auto mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyber-purple"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2 rounded-full border-4 border-transparent border-b-cyber-cyan"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Radio className="text-cyber-purple" size={40} />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-2">Searching for Match...</h2>
              <p className="text-gray-400 mb-6">
                Looking for a match that suits your skill level...
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-[#0f0f1a]">
                  <Clock className="mx-auto text-cyber-cyan mb-2" size={24} />
                  <p className="text-2xl font-bold">{formatTime(queueTime)}</p>
                  <p className="text-xs text-gray-500">Duration</p>
                </div>
                <div className="p-4 rounded-xl bg-[#0f0f1a]">
                  <Users className="mx-auto text-cyber-purple mb-2" size={24} />
                  <p className="text-2xl font-bold">{queuePosition}</p>
                  <p className="text-xs text-gray-500">Position</p>
                </div>
                <div className="p-4 rounded-xl bg-[#0f0f1a]">
                  <Zap className="mx-auto text-cyber-yellow mb-2" size={24} />
                  <p className="text-2xl font-bold">{user?.mmr || 1000}</p>
                  <p className="text-xs text-gray-500">Your MMR</p>
                </div>
              </div>

              <button
                onClick={handleLeaveQueue}
                className="cyber-button-secondary flex items-center gap-2 mx-auto"
              >
                <X size={20} />
                LEAVE QUEUE
              </button>
            </motion.div>
          ) : (
            /* Match Found */
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="cyber-card p-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyber-green to-cyber-cyan flex items-center justify-center"
              >
                <Swords size={40} />
              </motion.div>

              <h2 className="text-2xl font-bold mb-2 text-cyber-green">🎉 MATCH FOUND!</h2>
              <p className="text-gray-400 mb-6">
                A suitable match was found. The game will start if you accept!
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleAcceptMatch}
                  className="cyber-button flex items-center gap-2"
                >
                  <Play size={20} />
                  ACCEPT
                </button>
                <button
                  onClick={handleLeaveQueue}
                  className="cyber-button-secondary flex items-center gap-2"
                >
                  <X size={20} />
                  DECLINE
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="cyber-card p-6"
      >
        <h2 className="text-xl font-bold mb-4">📡 Current Queue Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { region: 'Global', players: 12453, queue: 'RANKED_SOLO' },
            { region: 'Americas', players: 4521, queue: 'RANKED_SOLO' },
            { region: 'Europe', players: 3892, queue: 'RANKED_TEAM' },
            { region: 'Asia', players: 5671, queue: 'CLASSIC' },
          ].map((status) => (
            <div key={status.region} className="p-4 rounded-xl bg-[#0f0f1a]">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
                <span className="text-sm font-semibold">{status.region}</span>
              </div>
              <p className="text-2xl font-bold">{status.players.toLocaleString()}</p>
              <p className="text-xs text-gray-500">in queue</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}