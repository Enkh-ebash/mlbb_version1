import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus, Crown, Medal, Trophy, Target, Globe, Zap } from 'lucide-react';
import { useLeaderboardStore, RANK_TIERS } from '../store';

const regions = ['Global', 'Americas', 'Europe', 'Asia', 'SE Asia'];

export default function Leaderboard() {
  const {
    entries, topThree, selectedRegion, searchQuery, currentPage, totalPages,
    setEntries, setTopThree, setRegion, setSearch, setPage, setTotalPages, setLoading,
  } = useLeaderboardStore();

  const [compareMode, setCompareMode] = useState(false);
  const [comparePlayers, setComparePlayers] = useState<string[]>([]);

  const mockLeaderboardData = Array.from({ length: 100 }, (_, i) => ({
    odyseeId: `player_${i + 1}`,
    username: ['DragonSlayer', 'PhoenixKing', 'ShadowMaster', 'IceBreaker', 'FireStorm', 'ThunderGod', 'DarkWizard', 'LightKnight', 'StormBringer', 'FrostBite'][i % 10] + (i > 9 ? i : ''),
    avatar: '',
    rank: i + 1,
    mmr: 16000 - i * 35 + Math.floor(Math.random() * 30),
    rankTier: Object.keys(RANK_TIERS)[Math.min(Math.floor(i / 12), 16)] as keyof typeof RANK_TIERS,
    rankPoints: 1500 - i * 10,
    region: selectedRegion,
    winRate: 60 + Math.random() * 30,
    totalMatches: 500 + Math.floor(Math.random() * 1500),
    trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
  }));

  const loadLeaderboard = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setEntries(mockLeaderboardData);
      setTotalPages(2);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => { loadLeaderboard(); }, [loadLeaderboard]);

  useEffect(() => {
    setTopThree(mockLeaderboardData.slice(0, 3));
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const toggleCompare = (odyseeId: string) => {
    if (comparePlayers.includes(odyseeId)) {
      setComparePlayers(comparePlayers.filter(id => id !== odyseeId));
    } else if (comparePlayers.length < 2) {
      setComparePlayers([...comparePlayers, odyseeId]);
    }
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
              🏆 ЛИДЕРОБОРД
            </span>
          </h1>
          <p className="text-gray-400 mt-2">Цалингийн өөрчлөлт 30 секунд тутамд шинэчлэгдэнэ</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-cyber-cyan" />
            <select value={selectedRegion} onChange={(e) => setRegion(e.target.value)} className="cyber-input w-40 py-2">
              {regions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Хайх..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="cyber-input pl-10"
            />
          </div>

          <button onClick={() => setCompareMode(!compareMode)} className={`cyber-button-secondary flex items-center gap-2 ${compareMode ? 'bg-cyber-purple/20' : ''}`}>
            <Target size={18} />
            Харьцуулах
          </button>
        </div>
      </motion.div>

      {/* Podium */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative py-12 rounded-3xl overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at center, rgba(234, 179, 8, 0.15) 0%, transparent 70%)' }}
      >
        <div className="absolute inset-0 bg-cyber-grid opacity-30" />

        <div className="relative z-10">
          <h2 className="text-center text-xl font-bold mb-8 flex items-center justify-center gap-3">
            <Trophy className="text-cyber-yellow" size={24} />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-yellow to-cyber-orange">
              🥇 TOP 3 ПОДИУМ 🥇
            </span>
            <Trophy className="text-cyber-yellow" size={24} />
          </h2>

          <div className="flex items-end justify-center gap-4 lg:gap-8">
            {/* 2nd */}
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center" style={{ boxShadow: '0 0 40px rgba(192, 192, 192, 0.4)' }}>
                <Medal size={48} className="text-gray-200" />
              </div>
              <div className="mt-4 text-center">
                <p className="font-bold text-lg">{topThree[1]?.username || 'PhoenixKing'}</p>
                <p className="text-gray-400 text-sm">{topThree[1]?.mmr?.toLocaleString() || '15,420'} MMR</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gray-400/20 text-xs font-semibold text-gray-300">#2 • Grandmaster</span>
              </div>
              <div className="w-24 lg:w-32 h-24 lg:h-24 rounded-t-2xl mt-4 flex items-end justify-center pb-2 bg-gradient-to-b from-gray-400/30 to-transparent border border-gray-400/30">
                <span className="text-4xl">🥈</span>
              </div>
            </motion.div>

            {/* 1st */}
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col items-center">
              <motion.div animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="relative">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl bg-gradient-to-br from-cyber-yellow via-cyber-orange to-cyber-yellow flex items-center justify-center" style={{ boxShadow: '0 0 60px rgba(234, 179, 8, 0.6)' }}>
                  <Crown size={64} className="text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyber-yellow text-black text-xs font-bold">#1 АНХИЛ</div>
              </motion.div>
              <div className="mt-4 text-center">
                <p className="font-bold text-xl">{topThree[0]?.username || 'DragonSlayer'}</p>
                <p className="text-cyber-yellow font-semibold">{topThree[0]?.mmr?.toLocaleString() || '15,680'} MMR</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-cyber-yellow/20 text-xs font-semibold text-cyber-yellow">Celestial</span>
              </div>
              <div className="w-32 lg:w-40 h-32 lg:h-32 rounded-t-3xl mt-4 flex items-end justify-center pb-2 bg-gradient-to-b from-cyber-yellow/40 to-cyber-yellow/15 border-2 border-cyber-yellow/50" style={{ boxShadow: '0 0 30px rgba(234, 179, 8, 0.3)' }}>
                <span className="text-5xl">👑</span>
              </div>
            </motion.div>

            {/* 3rd */}
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-col items-center">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center" style={{ boxShadow: '0 0 40px rgba(205, 127, 50, 0.4)' }}>
                <Medal size={48} className="text-orange-200" />
              </div>
              <div className="mt-4 text-center">
                <p className="font-bold text-lg">{topThree[2]?.username || 'ShadowMaster'}</p>
                <p className="text-orange-400 text-sm">{topThree[2]?.mmr?.toLocaleString() || '15,100'} MMR</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-orange-400/20 text-xs font-semibold text-orange-300">#3 • Titan</span>
              </div>
              <div className="w-24 lg:w-32 h-20 lg:h-20 rounded-t-2xl mt-4 flex items-end justify-center pb-2 bg-gradient-to-b from-orange-400/30 to-transparent border border-orange-400/30">
                <span className="text-4xl">🥉</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Compare Panel */}
      <AnimatePresence>
        {comparePlayers.length === 2 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="cyber-card p-6">
            <h3 className="font-bold flex items-center gap-2 mb-4"><Target className="text-cyber-purple" size={20} />Тамирчин Харьцуулалт</h3>
            <div className="grid grid-cols-2 gap-8">
              {comparePlayers.map((id) => {
                const player = entries.find(e => e.odyseeId === id);
                if (!player) return null;
                return (
                  <div key={id} className="space-y-2">
                    <div className="flex justify-between"><span className="font-semibold">{player.username}</span><span className="text-cyber-cyan">{player.mmr} MMR</span></div>
                    <div className="h-4 rounded-full bg-[#0f0f1a] overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(player.mmr / 17000) * 100}%` }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${RANK_TIERS[player.rankTier as keyof typeof RANK_TIERS]?.color}, ${RANK_TIERS[player.rankTier as keyof typeof RANK_TIERS]?.color}88)` }} />
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Ялтат: {player.winRate}%</span><span>Тоглолт: {player.totalMatches}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="cyber-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyber-purple/20">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">#</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Тамирчин</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Ранг</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">MMR</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Ялтат</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Тоглолт</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Чиг</th>
                {compareMode && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Харьцуулах</th>}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {(entries.length > 0 ? entries : mockLeaderboardData).slice(0, 50).map((entry, idx) => (
                  <motion.tr key={entry.odyseeId} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: idx * 0.02 }} className={`border-b border-cyber-purple/10 hover:bg-cyber-purple/5 transition-colors cursor-pointer ${entry.rank <= 3 ? 'bg-cyber-purple/10' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${entry.rank === 1 ? 'text-cyber-yellow' : entry.rank === 2 ? 'text-gray-300' : entry.rank === 3 ? 'text-orange-400' : 'text-gray-400'}`}>{entry.rank}</span>
                        {entry.rank <= 3 && <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>{entry.rank === 1 ? '👑' : entry.rank === 2 ? '🥈' : '🥉'}</motion.span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: entry.rank <= 3 ? `linear-gradient(135deg, ${RANK_TIERS[entry.rankTier as keyof typeof RANK_TIERS]?.color}40, transparent)` : '#0f0f1a' }}>
                          {entry.avatar ? <img src={entry.avatar} alt="" className="w-full h-full rounded-lg object-cover" /> : '🎮'}
                        </div>
                        <div>
                          <p className="font-semibold hover:text-cyber-purple transition-colors">{entry.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <motion.span whileHover={{ scale: 1.05 }} className="rank-badge" style={{ backgroundColor: `${RANK_TIERS[entry.rankTier as keyof typeof RANK_TIERS]?.color}20`, color: RANK_TIERS[entry.rankTier as keyof typeof RANK_TIERS]?.color }}>
                        {RANK_TIERS[entry.rankTier as keyof typeof RANK_TIERS]?.icon} {RANK_TIERS[entry.rankTier as keyof typeof RANK_TIERS]?.name}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyber-cyan">{entry.mmr.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">({entry.rankPoints})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-[#0f0f1a] overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${entry.winRate}%` }} className={`h-full rounded-full ${entry.winRate >= 55 ? 'bg-cyber-green' : entry.winRate >= 45 ? 'bg-cyber-yellow' : 'bg-cyber-red'}`} />
                        </div>
                        <span className="text-sm font-semibold">{entry.winRate.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{entry.totalMatches.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1 ${entry.trend === 'up' ? 'text-cyber-green' : entry.trend === 'down' ? 'text-cyber-red' : 'text-gray-400'}`}>
                        {entry.trend === 'up' ? <TrendingUp size={18} /> : entry.trend === 'down' ? <TrendingDown size={18} /> : <Minus size={18} />}
                        <span className="text-sm">{entry.trend === 'up' ? '⬆️' : entry.trend === 'down' ? '⬇️' : '➡️'}</span>
                      </div>
                    </td>
                    {compareMode && (
                      <td className="px-6 py-4">
                        <button onClick={() => toggleCompare(entry.odyseeId)} className={`w-6 h-6 rounded border-2 transition-all ${comparePlayers.includes(entry.odyseeId) ? 'border-cyber-purple bg-cyber-purple' : 'border-gray-500 hover:border-cyber-purple'}`}>
                          {comparePlayers.includes(entry.odyseeId) && <Zap size={14} className="mx-auto" />}
                        </button>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-cyber-purple/20">
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-cyber-purple/20 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-400">Хуудас {currentPage} / {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-cyber-purple/20 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight size={20} />
            </button>
          </div>
          <span className="text-sm text-gray-400">{entries.length} тамирчин</span>
        </div>
      </motion.div>
    </div>
  );
}