import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Swords, TrendingUp, Award, Target, Clock, Edit2, Save, MapPin, Calendar, Flame, Shield, Zap, ChevronRight } from 'lucide-react';
import { useAuthStore, RANK_TIERS, RANK_ORDER } from '../store';

const mockStats = {
  totalMatches: 847,
  winRate: 62.3,
  avgKDA: { kills: 7.2, deaths: 2.8, assists: 9.1 },
  mvpRate: 28.4,
  bestHero: 'Fanny',
  hoursPlayed: 512,
};

const mockRecentMatches = [
  { id: 1, result: 'WIN', hero: 'Fanny', kda: '8/2/12', mmrChange: '+28', duration: '14:32', map: 'Land of Dawn', eloBefore: 8380, eloAfter: 8408 },
  { id: 2, result: 'WIN', hero: 'Ling', kda: '12/1/8', mmrChange: '+32', duration: '16:45', map: 'Land of Dawn', eloBefore: 8348, eloAfter: 8380 },
  { id: 3, result: 'LOSS', hero: 'Joy', kda: '4/5/9', mmrChange: '-15', duration: '18:21', map: "Emperor's Shield", eloBefore: 8363, eloAfter: 8348 },
  { id: 4, result: 'WIN', hero: 'Hayabusa', kda: '10/3/6', mmrChange: '+24', duration: '12:58', map: 'Land of Dawn', eloBefore: 8339, eloAfter: 8363 },
  { id: 5, result: 'WIN', hero: 'Fanny', kda: '9/2/11', mmrChange: '+26', duration: '13:15', map: 'Northern Vale', eloBefore: 8313, eloAfter: 8339 },
  { id: 6, result: 'LOSS', hero: 'Granger', kda: '5/6/7', mmrChange: '-18', duration: '15:20', map: 'Land of Dawn', eloBefore: 8331, eloAfter: 8313 },
];

const mockHeroStats = [
  { name: 'Fanny', img: '/img/fredrin neo.jpg', winRate: 68, matches: 156, kda: 5.2, kills: 8.1, deaths: 2.4, assists: 7.8 },
  { name: 'Ling', img: '/img/ling neo.jpg', winRate: 64, matches: 98, kda: 4.8, kills: 7.5, deaths: 2.1, assists: 6.2 },
  { name: 'Granger', img: '/img/granger leg.jpg', winRate: 58, matches: 76, kda: 4.1, kills: 9.2, deaths: 3.1, assists: 4.8 },
  { name: 'Brody', img: '/img/brody neo.jpg', winRate: 55, matches: 65, kda: 3.9, kills: 8.4, deaths: 3.5, assists: 3.2 },
  { name: 'Pharsa', img: '/img/pharsa neo.jpg', winRate: 61, matches: 54, kda: 4.5, kills: 6.8, deaths: 2.2, assists: 9.1 },
];

export default function Profile() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'heroes' | 'matches'>('overview');

  const currentUser = {
    odyseeId: user?.odyseeId || 'dragon_slayer_xx',
    username: user?.username || 'Krytych',
    mmr: user?.mmr || 8408,
    rankTier: user?.rankTier || 'MYTHICAL_HONOR',
    rankPoints: user?.mmr ? user.mmr % 1000 : 408,
    avatar: user?.avatar || '/img/ai.jpg',
    region: user?.region || 'Russia,Tomsk',
    country: 'Mongolia',
    joinedDate: 'Jan 2024',
    stats: mockStats,
  };

  const tierInfo = RANK_TIERS[currentUser.rankTier as keyof typeof RANK_TIERS] || RANK_TIERS.WARRIOR;
  const currentTierIndex = RANK_ORDER.indexOf(currentUser.rankTier);

  const wins = Math.round(currentUser.stats.totalMatches * currentUser.stats.winRate / 100);
  const losses = currentUser.stats.totalMatches - wins;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Banner */}
      <div className="relative h-48 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] overflow-hidden">
        <img src="/img/ai.jpg" alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(6, 182, 212, 0.4) 0%, transparent 50%)',
        }} />
        {/* Level Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-[#0f0f1a]/80 backdrop-blur border border-[#3d3d5c]">
          <span className="text-sm text-gray-400">Level</span>
          <span className="text-xl font-bold text-cyber-purple">42</span>
        </div>
      </div>

      {/* Profile Card - Overlapping */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative -mt-20 mb-8 flex flex-col lg:flex-row items-start lg:items-end gap-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative"
          >
            <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-[#1a1a2e] shadow-2xl" style={{ boxShadow: `0 0 60px ${tierInfo.color}60` }}>
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-[#1a1a2e] to-[#0f0f23]">
                  🎮
                </div>
              )}
            </div>
            {/* Online Status */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-cyber-green border-4 border-[#0a0a0f] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </motion.div>

          {/* Info */}
          <div className="flex-1 pt-4 lg:pt-0">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-4 flex-wrap">
                  <h1 className="text-4xl font-bold text-white">{currentUser.username}</h1>
                  {/* Rank Badge */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: `${tierInfo.color}20`, border: `1px solid ${tierInfo.color}40` }}>
                    <span className="text-2xl">{tierInfo.icon}</span>
                    <div>
                      <p className="font-bold text-sm" style={{ color: tierInfo.color }}>{tierInfo.name}</p>
                      <p className="text-xs text-gray-400">MMR: {currentUser.mmr.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 text-gray-400 text-sm flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {currentUser.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Joined {currentUser.joinedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield size={14} />
                    {currentUser.region}
                  </span>
                </div>
              </div>
              <button className="px-6 py-2 rounded-xl bg-[#1a1a2e] hover:bg-[#2d2d44] border border-[#3d3d5c] text-white font-semibold transition-all flex items-center gap-2">
                <Edit2 size={16} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Main Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="col-span-2 lg:col-span-1 cyber-card p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${tierInfo.color}40, ${tierInfo.color}20)` }}>
              <Trophy size={28} style={{ color: tierInfo.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{currentUser.mmr.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Elo Rating</p>
            </div>
          </div>

          <div className="cyber-card p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyber-green to-emerald-600 flex items-center justify-center">
              <TrendingUp size={28} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{currentUser.stats.winRate}%</p>
              <p className="text-sm text-gray-400">Win Rate</p>
            </div>
          </div>

          <div className="cyber-card p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyber-blue to-cyan-600 flex items-center justify-center">
              <Target size={28} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{currentUser.stats.avgKDA.kills}/{currentUser.stats.avgKDA.deaths}/{currentUser.stats.avgKDA.assists}</p>
              <p className="text-sm text-gray-400">Avg KDA</p>
            </div>
          </div>

          <div className="cyber-card p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyber-orange to-red-600 flex items-center justify-center">
              <Award size={28} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{currentUser.stats.mvpRate}%</p>
              <p className="text-sm text-gray-400">MVP Rate</p>
            </div>
          </div>

          <div className="cyber-card p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyber-purple to-violet-600 flex items-center justify-center">
              <Swords size={28} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{currentUser.stats.totalMatches.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Matches</p>
            </div>
          </div>
        </div>

        {/* Rank Progress */}
        <div className="cyber-card p-6 mb-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Flame className="text-cyber-orange" size={20} />
            Rank Progression
          </h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {RANK_ORDER.map((tier, idx) => {
              const info = RANK_TIERS[tier as keyof typeof RANK_TIERS];
              const isActive = tier === currentUser.rankTier;
              const isPast = idx < currentTierIndex;
              return (
                <div key={tier} className={`flex flex-col items-center min-w-[80px] ${isActive ? 'scale-110' : ''} transition-transform`}>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isActive ? 'ring-2 ring-offset-2 ring-offset-[#0f0f1a]' : ''}`} style={{
                    background: isPast ? `${info.color}40` : isActive ? `${info.color}30` : '#1a1a2e',
                    ringColor: isActive ? info.color : 'transparent',
                  }}>
                    <span className="text-2xl">{info.icon}</span>
                  </div>
                  <span className="text-xs mt-2 font-medium text-center" style={{ color: isPast || isActive ? info.color : '#6b7280' }}>{info.name}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 h-3 rounded-full bg-[#1a1a2e] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentTierIndex / (RANK_ORDER.length - 1)) * 100}%` }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${RANK_TIERS[RANK_ORDER[0] as keyof typeof RANK_TIERS].color}, ${tierInfo.color})` }}
              />
            </div>
            <span className="text-sm text-gray-400 font-mono">{currentTierIndex + 1}/{RANK_ORDER.length} tiers</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#1a1a2e]">
          {(['overview', 'heroes', 'matches'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold capitalize transition-all relative ${activeTab === tab ? 'text-cyber-purple' : 'text-gray-400 hover:text-white'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-purple" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Win/Loss */}
            <div className="cyber-card p-6">
              <h3 className="text-lg font-bold mb-4">Win / Loss Breakdown</h3>
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1a2e" strokeWidth="12" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#winGradient)"
                      strokeWidth="12"
                      strokeDasharray={`${currentUser.stats.winRate * 2.51} 251`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="winGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-cyber-green">{currentUser.stats.winRate}%</span>
                    <span className="text-xs text-gray-400">Winrate</span>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a2e]/50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyber-green" />
                      <span className="text-gray-300">Wins</span>
                    </div>
                    <span className="font-bold text-cyber-green">{wins.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a2e]/50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyber-red" />
                      <span className="text-gray-300">Losses</span>
                    </div>
                    <span className="font-bold text-cyber-red">{losses.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a2e]/50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyber-yellow" />
                      <span className="text-gray-300">Streak</span>
                    </div>
                    <span className="font-bold text-cyber-yellow">🔥 3W</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="cyber-card p-6">
              <h3 className="text-lg font-bold mb-4">Performance Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Avg K/D/A</span>
                  <span className="font-bold text-lg">{currentUser.stats.avgKDA.kills.toFixed(1)} / {currentUser.stats.avgKDA.deaths.toFixed(1)} / {currentUser.stats.avgKDA.assists.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">KDA Ratio</span>
                  <span className="font-bold text-lg text-cyber-green">{((currentUser.stats.avgKDA.kills + currentUser.stats.avgKDA.assists * 0.5) / Math.max(currentUser.stats.avgKDA.deaths, 1)).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Hours Played</span>
                  <span className="font-bold text-lg">{currentUser.stats.hoursPlayed}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Best Hero</span>
                  <span className="font-bold text-lg text-cyber-purple">{currentUser.stats.bestHero}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Peak Elo</span>
                  <span className="font-bold text-lg text-cyber-yellow">{currentUser.mmr + 150}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'heroes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {mockHeroStats.map((hero) => (
              <motion.div
                key={hero.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="cyber-card p-4 hover:scale-[1.02] transition-transform cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1a1a2e]">
                    {hero.img ? (
                      <img src={hero.img} alt={hero.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">⚔️</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white">{hero.name}</h4>
                      <span className={`text-sm font-bold ${hero.winRate >= 55 ? 'text-cyber-green' : 'text-cyber-yellow'}`}>
                        {hero.winRate}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{hero.matches} matches</p>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <span className="text-gray-500">KDA:</span>
                      <span className="font-mono text-cyber-cyan">{hero.kda.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="cyber-card overflow-hidden mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a2e] bg-[#0f0f1a]/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Result</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Map</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Hero</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">KDA</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Elo Change</th>
                </tr>
              </thead>
              <tbody>
                {mockRecentMatches.map((match) => (
                  <tr key={match.id} className="border-b border-[#1a1a2e]/50 hover:bg-[#1a1a2e]/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold ${match.result === 'WIN' ? 'bg-cyber-green/20 text-cyber-green' : 'bg-cyber-red/20 text-cyber-red'}`}>
                        {match.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{match.map}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-white">{match.hero}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-gray-300">{match.kda}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{match.duration}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${match.mmrChange.startsWith('+') ? 'text-cyber-green' : 'text-cyber-red'}`}>
                          {match.mmrChange}
                        </span>
                        <ChevronRight size={16} className="text-gray-600" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}