import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trophy, Users, Clock } from 'lucide-react';
import { tournamentApi } from '../services/api';

const mockTournaments = [
  {
    tournamentId: 't1',
    name: 'MLBB Аялалын Лиг',
    description: 'Дэлхий даяарын шилдэг багуудын уралдаан',
    format: 'Давхар Уралдаан',
    status: 'Live',
    maxTeams: 16,
    registeredTeams: 14,
    prizePool: '$50,000',
    startDate: '2024-01-15',
    endDate: '2024-01-30',
    region: 'Global',
  },
  {
    tournamentId: 't2',
    name: 'Хаврын Чempионшип',
    description: 'Олон улсын тэмцээнд оролцох шалгаруулалт',
    format: 'Ганц Уралдаан',
    status: 'Registration',
    maxTeams: 32,
    registeredTeams: 18,
    prizePool: '$25,000',
    startDate: '2024-02-01',
    endDate: '2024-02-15',
    region: 'Americas',
  },
  {
    tournamentId: 't3',
    name: 'Азийн Про Лиг',
    description: 'Азийн багуудын дээд түвшин',
    format: 'Бүх Багттай Тоглоом',
    status: 'Upcoming',
    maxTeams: 8,
    registeredTeams: 6,
    prizePool: '$30,000',
    startDate: '2024-02-20',
    endDate: '2024-03-10',
    region: 'Asia',
  },
];

export default function Tournaments() {
  const [tournaments, setTournaments] = useState(mockTournaments);
  const [filter, setFilter] = useState('all');


  useEffect(() => {
    const fetchTournaments = async () => {
      // setLoading(true);
      try {
        const res = await tournamentApi.getAll({ status: filter === 'all' ? undefined : filter });
        setTournaments(res.data.tournaments || mockTournaments);
      } catch {
        setTournaments(mockTournaments);
      }
      // setLoading(false);
    };
    fetchTournaments();
  }, [filter]);

  const statusColors: Record<string, string> = {
    Live: 'bg-cyber-red',
    Registration: 'bg-cyber-green',
    Upcoming: 'bg-cyber-blue',
    Completed: 'bg-gray-500',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-orbitron text-3xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-yellow to-cyber-orange">
              🏆 ТЭМЦЭЭНҮҮД
            </span>
          </h1>
          <p className="text-gray-400 mt-2">Профессонал esports тэмцээнүүдэд оролцоорой</p>
        </div>

        <div className="flex gap-2">
          {['all', 'Live', 'Registration', 'Upcoming'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-cyber-purple text-white'
                  : 'bg-[#0f0f1a] text-gray-400 hover:text-white'
              }`}
            >
              {status === 'all' ? 'Бүгд' : status === 'Live' ? 'Идэвхтэй' : status === 'Registration' ? 'Бүртгэл' : 'Удахгүй'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Featured Tournament */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(249, 115, 22, 0.1) 100%)',
          border: '1px solid rgba(234, 179, 8, 0.3)',
        }}
      >
        <div className="absolute inset-0 bg-cyber-grid opacity-20" />
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-cyber-yellow/20 text-cyber-yellow text-sm font-bold">
                  FEATURED
                </span>
                <span className="px-3 py-1 rounded-full bg-cyber-red/20 text-cyber-red text-sm font-semibold">
                  LIVE NOW
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-2">{mockTournaments[0].name}</h2>
              <p className="text-gray-300 max-w-xl">{mockTournaments[0].description}</p>
              <div className="flex flex-wrap gap-4 mt-4">
                <span className="flex items-center gap-2 text-sm text-gray-400">
                  <Trophy className="text-cyber-yellow" size={16} />
                  {mockTournaments[0].prizePool}
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="text-cyber-purple" size={16} />
                  {mockTournaments[0].registeredTeams}/{mockTournaments[0].maxTeams} Teams
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="text-cyber-cyan" size={16} />
                  Jan 15 - Jan 30, 2024
                </span>
              </div>
            </div>
            <button className="cyber-button flex items-center gap-2">
              <Trophy size={20} />
              Watch Live
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tournament Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament, idx) => (
          <motion.div
            key={tournament.tournamentId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="cyber-card overflow-hidden group hover:scale-105 transition-transform"
          >
            {/* Card Header */}
            <div
              className="h-32 relative flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${
                  tournament.status === 'Live'
                    ? 'rgba(239, 68, 68, 0.3)'
                    : tournament.status === 'Registration'
                    ? 'rgba(16, 185, 129, 0.3)'
                    : 'rgba(59, 130, 246, 0.3)'
                }, transparent)`,
              }}
            >
              <div className="text-6xl opacity-50 group-hover:scale-110 transition-transform">
                🏆
              </div>
              <div className="absolute top-3 right-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    statusColors[tournament.status]
                  } text-white`}
                >
                  {tournament.status}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2 group-hover:text-cyber-purple transition-colors">
                {tournament.name}
              </h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{tournament.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Format</span>
                  <span className="font-medium">{tournament.format}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Teams</span>
                  <span className="font-medium">
                    {tournament.registeredTeams}/{tournament.maxTeams}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Prize Pool</span>
                  <span className="font-bold text-cyber-yellow">{tournament.prizePool}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-2 rounded-full bg-[#0f0f1a] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(tournament.registeredTeams / tournament.maxTeams) * 100}%`,
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-cyber-purple to-cyber-cyan"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {tournament.maxTeams - tournament.registeredTeams} spots remaining
                </p>
              </div>

              <button className="w-full mt-4 cyber-button-secondary text-sm">
                {tournament.status === 'Registration' ? 'Register Now' : 'View Details'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tournament Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cyber-card p-6"
      >
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Clock className="text-cyber-cyan" size={20} />
          Upcoming Matches
        </h2>

        <div className="space-y-4">
          {[
            { time: '14:00', match: 'Semi Finals', team1: 'Team Alpha', team2: 'Team Beta', status: 'Starting in 30m' },
            { time: '16:00', match: 'Quarter Finals', team1: 'Team Gamma', team2: 'Team Delta', status: 'Starting in 2h' },
            { time: '18:00', match: 'Group Stage', team1: 'Team Epsilon', team2: 'Team Zeta', status: 'Starting in 4h' },
          ].map((match, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 rounded-xl bg-[#0f0f1a] hover:bg-[#0f0f1a]/80 transition-colors"
            >
              <div className="text-center min-w-[60px]">
                <p className="text-lg font-bold text-cyber-purple">{match.time}</p>
                <p className="text-xs text-gray-500">GMT+8</p>
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div className="flex-1 text-right">
                  <p className="font-bold">{match.team1}</p>
                </div>
                <div className="px-4 py-2 rounded-lg bg-cyber-purple/20 text-center">
                  <p className="text-xs text-gray-400">vs</p>
                  <p className="font-bold text-cyber-purple">{match.match}</p>
                </div>
                <div className="flex-1">
                  <p className="font-bold">{match.team2}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-cyber-yellow">{match.status}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}