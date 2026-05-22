import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, Swords, TrendingUp, Award, Target, Clock, Edit2, Save, Camera } from 'lucide-react';
import { useAuthStore, RANK_TIERS } from '../store';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

const mockStats = {
  totalMatches: 1247,
  winRate: 58.4,
  avgKDA: { kills: 6.2, deaths: 3.1, assists: 8.4 },
  mvpRate: 23.5,
  bestHero: 'Fanny',
  hoursPlayed: 856,
};

const mockMMRHistory = [
  { match: 1, mmr: 4200 },
  { match: 50, mmr: 4450 },
  { match: 100, mmr: 4700 },
  { match: 200, mmr: 5100 },
  { match: 400, mmr: 5800 },
  { match: 600, mmr: 6500 },
  { match: 800, mmr: 7200 },
  { match: 1000, mmr: 7900 },
  { match: 1200, mmr: 8400 },
];

const mockHeroPerformance = [
  { name: 'Fanny', kda: 4.8, winRate: 62, matches: 145 },
  { name: 'Ling', kda: 4.2, winRate: 58, matches: 98 },
  { name: 'Joy', kda: 3.9, winRate: 55, matches: 87 },
  { name: 'Hayabusa', kda: 3.6, winRate: 52, matches: 76 },
  { name: 'Aamon', kda: 3.4, winRate: 54, matches: 65 },
];

const mockRecentMatches = [
  { id: 1, result: 'WIN', hero: 'Fanny', kda: '8/2/12', mmrChange: '+28', duration: '14:32' },
  { id: 2, result: 'WIN', hero: 'Ling', kda: '12/1/8', mmrChange: '+32', duration: '16:45' },
  { id: 3, result: 'LOSS', hero: 'Joy', kda: '4/5/9', mmrChange: '-15', duration: '18:21' },
  { id: 4, result: 'WIN', hero: 'Hayabusa', kda: '10/3/6', mmrChange: '+24', duration: '12:58' },
  { id: 5, result: 'WIN', hero: 'Fanny', kda: '9/2/11', mmrChange: '+26', duration: '13:15' },
];

export default function Profile() {
  const { user, isAuthenticated } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: user?.username || 'ProPlayer',
    bio: 'Competitive MLBB player. Fanny main.',
    country: 'Singapore',
    timezone: 'GMT+8',
  });

  const currentUser = {
    odyseeId: user?.odyseeId || 'player_001',
    username: profile.username,
    mmr: user?.mmr || 8420,
    rankTier: user?.rankTier || 'MYTHICAL_HONOR',
    rankPoints: user?.mmr ? user.mmr % 1000 : 420,
    avatar: user?.avatar || '',
    region: user?.region || 'Southeast Asia',
    stats: mockStats,
  };

  const tierInfo = RANK_TIERS[currentUser.rankTier as keyof typeof RANK_TIERS] || RANK_TIERS.WARRIOR;

  const kdaData = [
    { name: 'Kills', value: currentUser.stats.avgKDA.kills, fill: '#10B981' },
    { name: 'Deaths', value: currentUser.stats.avgKDA.deaths, fill: '#EF4444' },
    { name: 'Assists', value: currentUser.stats.avgKDA.assists, fill: '#3B82F6' },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cyber-card p-8"
      >
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Avatar */}
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${tierInfo.color}40, transparent)`,
                boxShadow: `0 0 40px ${tierInfo.color}40`,
              }}
            >
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-cyber-purple to-cyber-pink">
                  🎮
                </div>
              )}
            </motion.div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-cyber-purple flex items-center justify-center hover:scale-110 transition-transform">
              <Camera size={18} />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{currentUser.username}</h1>
                  <span
                    className="px-4 py-1 rounded-full text-sm font-bold"
                    style={{
                      backgroundColor: `${tierInfo.color}20`,
                      color: tierInfo.color,
                      boxShadow: `0 0 20px ${tierInfo.color}40`,
                    }}
                  >
                    {tierInfo.icon} {tierInfo.name}
                  </span>
                </div>
                <p className="text-gray-400 mt-2">@{currentUser.odyseeId} • {currentUser.region}</p>
                <p className="text-sm text-gray-500 mt-1">Member since January 2024</p>
              </div>

              <button
                onClick={() => setEditing(!editing)}
                className="cyber-button-secondary flex items-center gap-2"
              >
                {editing ? <Save size={18} /> : <Edit2 size={18} />}
                {editing ? 'Save' : 'Edit Profile'}
              </button>
            </div>

            {editing ? (
              <div className="mt-4 space-y-4">
                <input
                  type="text"
                  value={profile.username}
                  onChange={e => setProfile({ ...profile, username: e.target.value })}
                  className="cyber-input"
                  placeholder="Username"
                />
                <textarea
                  value={profile.bio}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  className="cyber-input resize-none"
                  rows={2}
                  placeholder="Bio"
                />
              </div>
            ) : (
              <p className="text-gray-300 mt-3">{profile.bio}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* MMR Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="cyber-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyber-purple to-cyber-blue">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">MMR Rating</p>
              <p className="text-3xl font-bold" style={{ color: tierInfo.color }}>
                {currentUser.mmr.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-2 flex-1 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${tierInfo.color}, ${tierInfo.color}88)`,
                width: `${(currentUser.rankPoints / 1000) * 100}%`,
              }}
            />
            <span className="text-sm text-gray-400">{currentUser.rankPoints}/1000</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Points to next tier</p>
        </motion.div>

        {/* Win Rate Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyber-green to-cyber-cyan">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Win Rate</p>
              <p className="text-3xl font-bold text-cyber-green">{currentUser.stats.winRate}%</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {Math.round(currentUser.stats.totalMatches * currentUser.stats.winRate / 100)}W / {currentUser.stats.totalMatches - Math.round(currentUser.stats.totalMatches * currentUser.stats.winRate / 100)}L
          </p>
        </motion.div>

        {/* KDA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="cyber-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyber-yellow to-cyber-orange">
              <Target size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg KDA</p>
              <p className="text-3xl font-bold text-cyber-yellow">
                {currentUser.stats.avgKDA.kills}/{currentUser.stats.avgKDA.deaths}/{currentUser.stats.avgKDA.assists}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {((currentUser.stats.avgKDA.kills + currentUser.stats.avgKDA.assists * 0.5) / Math.max(currentUser.stats.avgKDA.deaths, 1)).toFixed(2)} KDA Ratio
          </p>
        </motion.div>

        {/* MVP Rate Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cyber-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyber-pink to-cyber-red">
              <Award size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">MVP Rate</p>
              <p className="text-3xl font-bold text-cyber-pink">{currentUser.stats.mvpRate}%</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {Math.round(currentUser.stats.totalMatches * currentUser.stats.mvpRate / 100)} MVP awards
          </p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* MMR History Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="cyber-card p-6"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="text-cyber-cyan" size={20} />
            MMR Progression
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockMMRHistory}>
              <XAxis dataKey="match" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f0f1a',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="mmr"
                stroke="url(#gradient)"
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Hero Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="cyber-card p-6"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Swords className="text-cyber-red" size={20} />
            Top Heroes
          </h3>
          <div className="space-y-3">
            {mockHeroPerformance.map((hero, idx) => (
              <div key={hero.name} className="flex items-center gap-4">
                <span className="w-8 text-center font-bold text-gray-500">#{idx + 1}</span>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyber-red to-orange-600 flex items-center justify-center text-xl">
                  ⚔️
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{hero.name}</span>
                    <span className="text-sm text-gray-400">{hero.matches} games</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 flex-1 rounded-full bg-[#0f0f1a] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${hero.winRate}%`,
                          backgroundColor: hero.winRate >= 55 ? '#10B981' : '#F59E0B',
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold">{hero.winRate}% WR</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Matches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="cyber-card overflow-hidden"
      >
        <div className="p-6 border-b border-cyber-purple/20">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Clock className="text-cyber-purple" size={20} />
            Recent Matches
          </h3>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-cyber-purple/20">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Result</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Hero</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">KDA</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">MMR</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Duration</th>
            </tr>
          </thead>
          <tbody>
            {mockRecentMatches.map((match) => (
              <tr key={match.id} className="border-b border-cyber-purple/10 hover:bg-cyber-purple/5 transition-colors">
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded text-sm font-bold ${
                      match.result === 'WIN' ? 'bg-cyber-green/20 text-cyber-green' : 'bg-cyber-red/20 text-cyber-red'
                    }`}
                  >
                    {match.result}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚔️</span>
                    <span className="font-medium">{match.hero}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono">{match.kda}</td>
                <td className="px-6 py-4">
                  <span className={match.mmrChange.startsWith('+') ? 'text-cyber-green' : 'text-cyber-red'}>
                    {match.mmrChange}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">{match.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}