import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Swords, Eye, Zap, Star, ArrowUpRight, ArrowDownRight, Shield, Calendar } from 'lucide-react';
import { useLeaderboardStore, RANK_TIERS } from '../store';

const mockActivityFeed = [
  { id: 1, type: 'match', user: 'DragonSlayer', action: ' рангийн тоглолт яллаа', mmr: '+24', time: '2 мин' },
  { id: 2, type: 'rank', user: 'PhoenixKing', action: ' Mythic рангт хүрлээ', mmr: '', time: '5 мин' },
  { id: 3, type: 'tournament', user: 'Team Mongolia', action: ' Тэмцээнд бүртгүүллээ', mmr: '', time: '8 мин' },
  { id: 4, type: 'match', user: 'ShadowStrike', action: ' 15 алдаж MVP боллоо', mmr: '+32', time: '12 мин' },
  { id: 5, type: 'clan', user: 'Sky Warriors', action: ' Grandmaster рангт хүрлээ', mmr: '', time: '15 мин' },
];

const mockTrendingHeroes = [
  { name: 'Fanny', picks: 12540, winRate: 51.2, trend: 'up' },
  { name: 'Ling', picks: 11230, winRate: 49.8, trend: 'up' },
  { name: 'Joy', picks: 9870, winRate: 52.1, trend: 'up' },
  { name: 'Hayabusa', picks: 8540, winRate: 48.5, trend: 'down' },
  { name: 'Aamon', picks: 7230, winRate: 50.3, trend: 'stable' },
];

const mockMMRDistribution = [
  { tier: 'Warrior', count: 12500, color: '#8B5CF6' },
  { tier: 'Elite', count: 10200, color: '#3B82F6' },
  { tier: 'Master', count: 8500, color: '#06B6D4' },
  { tier: 'Grandmaster', count: 6200, color: '#F59E0B' },
  { tier: 'Epic', count: 4100, color: '#EF4444' },
  { tier: 'Legend', count: 2800, color: '#EC4899' },
  { tier: 'Mythic', count: 1500, color: '#F97316' },
  { tier: 'Mythical+', count: 320, color: '#7C3AED' },
];

export default function Dashboard() {
  const { trending, setTrending } = useLeaderboardStore();
  const [stats] = useState({
    totalPlayers: 128547,
    activeNow: 45231,
    matchesToday: 8234,
    avgMMR: 2450,
  });
  const [liveActivity] = useState(mockActivityFeed);

  useEffect(() => {
    // setTopThree is unused in this Dashboard variant
    setTrending([
      {
        odyseeId: '1',
        username: 'DragonSlayer',
        avatar: '',
        rank: 1,
        mmr: 15680,
        rankTier: 'CELESTIAL',
        rankPoints: 680,
        region: 'Global',
        winRate: 68.5,
        totalMatches: 1520,
        trend: 'stable',
      },
      {
        odyseeId: '2',
        username: 'PhoenixKing',
        avatar: '',
        rank: 2,
        mmr: 15420,
        rankTier: 'CELESTIAL',
        rankPoints: 420,
        region: 'Global',
        winRate: 66.2,
        totalMatches: 1480,
        trend: 'up',
      },
      {
        odyseeId: '3',
        username: 'ShadowMaster',
        avatar: '',
        rank: 3,
        mmr: 15100,
        rankTier: 'TITAN',
        rankPoints: 100,
        region: 'Global',
        winRate: 64.8,
        totalMatches: 1390,
        trend: 'down',
      },
    ]);
  }, []);

  const statCards = [
    { label: 'Нийт Тамирчид', value: stats.totalPlayers.toLocaleString(), icon: Users, color: 'from-cyber-purple to-cyber-blue', change: '+2.4%' },
    { label: 'Одоо Тоглож Байна', value: stats.activeNow.toLocaleString(), icon: Eye, color: 'from-cyber-cyan to-cyber-green', change: '+12%' },
    { label: 'Өнөөдрийн Тоглолт', value: stats.matchesToday.toLocaleString(), icon: Swords, color: 'from-cyber-orange to-cyber-red', change: '+8.1%' },
    { label: 'Дундаж MMR', value: stats.avgMMR.toLocaleString(), icon: Trophy, color: 'from-cyber-yellow to-cyber-orange', change: '+0.8%' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl py-12 px-8"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.1) 50%, rgba(236, 72, 153, 0.15) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="font-orbitron text-3xl lg:text-4xl font-bold mb-4"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-purple via-cyber-cyan to-cyber-pink">
                👑 ШАГНАР ГЭДЭГ УНШИГЧА 🏆
              </span>
            </motion.h1>
            <p className="text-gray-300 text-lg max-w-xl">
              Мянга мянган тамирчидтай уралдан, өөрийн хүчээ сориорой.
              Рангийн тоглолтууд, лидерборд, MLBB esports-ийн хамгийн өндөр түвшинд.
            </p>
            <div className="flex flex-wrap gap-4 mt-6 justify-center lg:justify-start">
              <a href="/matchmaking" className="cyber-button flex items-center gap-2">
                <Swords size={20} />
                Тоглох
              </a>
              <a href="/leaderboard" className="cyber-button-secondary flex items-center gap-2">
                <Trophy size={20} />
                Рангийн Хүснэгт
              </a>
            </div>
          </div>

          {/* Podium Preview */}
          <div className="flex items-end gap-4">
            {[1, 0, 2].map((idx) => (
              <motion.div
                key={idx}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.2 }}
                className="relative flex flex-col items-center"
              >
                <div
                  className={`${
                    idx === 0 ? 'w-28 h-28 -mb-4' : idx === 1 ? 'w-24 h-24 -mb-2' : 'w-20 h-20'
                  } rounded-2xl bg-gradient-to-br from-cyber-${
                    idx === 0 ? 'yellow' : idx === 1 ? 'purple' : 'orange'
                  } to-transparent flex items-center justify-center`}
                  style={{
                    boxShadow: `0 0 ${idx === 0 ? '60px' : idx === 1 ? '40px' : '30px'} rgba(${idx === 0 ? '234, 179, 8' : idx === 1 ? '139, 92, 246' : '249, 115, 22'}, 0.5)`,
                  }}
                >
                  <span className="text-4xl">{idx === 0 ? '👑' : idx === 1 ? '🥈' : '🥉'}</span>
                </div>
                <div className={`cyber-card p-3 text-center ${idx === 0 ? 'min-w-[140px]' : 'min-w-[120px]'}`}>
                  <p className="font-bold truncate">{['PhoenixKing', 'DragonSlayer', 'ShadowMaster'][idx]}</p>
                  <p className={`text-sm ${idx === 0 ? 'text-cyber-yellow' : idx === 1 ? 'text-cyber-purple' : 'text-cyber-orange'}`}>
                    #{idx + 1} • {[15100, 15680, 15420][idx]} MMR
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Live Activity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="overflow-hidden rounded-xl bg-[#0f0f1a]/80 border border-cyber-purple/20"
      >
        <div className="flex items-center gap-4 px-4 py-3 border-b border-cyber-purple/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
            <span className="text-sm font-semibold text-cyber-green">🔥 ЖИВХ ҮЙЛДЭЛ</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee flex gap-8 whitespace-nowrap">
              {[...liveActivity, ...liveActivity].map((item, idx) => (
                <span key={idx} className="text-sm text-gray-400">
                  <span className="text-cyber-purple">{item.user}</span> {item.action}
                  {item.mmr && <span className={item.mmr.startsWith('+') ? 'text-cyber-green' : 'text-cyber-red'}>{item.mmr}</span>}
                  <span className="text-gray-500 ml-2">{item.time}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="cyber-card p-6 group hover:scale-105 transition-transform"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${stat.change.startsWith('+') ? 'text-cyber-green' : 'text-cyber-red'}`}>
                  {stat.change.startsWith('+') ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {stat.change}
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trending Players */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 cyber-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Star className="text-cyber-yellow" size={20} />
              ⭐ ХАМГИЙН ИХ ӨСӨЛТТЭЙ ТАМИРЧИД
            </h2>
            <a href="/leaderboard" className="text-sm text-cyber-purple hover:underline">Бүгд →</a>
          </div>

          <div className="space-y-4">
            {((trending.length > 0 ? trending : mockTrendingHeroes.slice(0, 3)) as any[]).map((player, idx) => (
              <div
                key={player.odyseeId || idx}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#0f0f1a]/50 hover:bg-[#0f0f1a] transition-colors group"
              >
                <div className={`relative ${idx === 0 ? 'w-14 h-14' : 'w-12 h-12'}`}>
                  <div className={`w-full h-full rounded-xl bg-gradient-to-br ${
                    idx === 0 ? 'from-cyber-yellow to-cyber-orange' :
                    idx === 1 ? 'from-cyber-purple to-cyber-pink' :
                    'from-cyber-cyan to-cyber-blue'
                  } flex items-center justify-center text-2xl`}>
                    {player.avatar ? (
                      <img src={player.avatar} alt={player.username} className="w-full h-full rounded-xl object-cover" />
                    ) : (
                      '🎮'
                    )}
                  </div>
                  {idx < 3 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyber-yellow flex items-center justify-center text-xs font-bold text-black">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold group-hover:text-cyber-purple transition-colors">{player.username}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="rank-badge" style={{ backgroundColor: `${RANK_TIERS[player.rankTier as keyof typeof RANK_TIERS]?.color}20`, color: RANK_TIERS[player.rankTier as keyof typeof RANK_TIERS]?.color }}>
                      {RANK_TIERS[player.rankTier as keyof typeof RANK_TIERS]?.name || player.rankTier}
                    </span>
                    <span>•</span>
                      {player.picks} сонголт
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{player.winRate}%</p>
                  <p className="text-xs text-gray-500">Ялтат</p>
                </div>
                {player.trend === 'up' ? <ArrowUpRight className="text-cyber-green" size={20} /> : null}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rank Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="cyber-card p-6"
        >
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <Zap className="text-cyber-cyan" size={20} />
            📊 Рангийн Т分布
          </h2>

          <div className="space-y-3">
            {mockMMRDistribution.map((tier) => (
              <div key={tier.tier} className="flex items-center gap-3">
                <span className="w-20 text-sm text-gray-400">{tier.tier}</span>
                <div className="flex-1 h-6 rounded-full bg-[#0f0f1a] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(tier.count / 12500) * 100}%` }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: tier.color }}
                  />
                </div>
                <span className="w-16 text-right text-sm font-mono">{tier.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Trending Heroes & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cyber-card p-6"
        >
          <h2 className="text-xl font-bold mb-6">🔥 Meta Герлиуд</h2>
          <div className="space-y-4">
            {mockTrendingHeroes.map((hero) => (
              <div key={hero.name} className="flex items-center gap-4 p-3 rounded-xl bg-[#0f0f1a]/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-red to-cyber-orange flex items-center justify-center text-2xl">
                  ⚔️
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{hero.name}</p>
                  <p className="text-sm text-gray-400">{hero.picks.toLocaleString()} сонголт</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${hero.winRate >= 50 ? 'text-cyber-green' : 'text-cyber-red'}`}>
                    {hero.winRate}%
                  </p>
                  <p className="text-xs text-gray-500">Ялтат</p>
                </div>
                {hero.trend === 'up' ? <ArrowUpRight className="text-cyber-green" size={16} /> : <ArrowDownRight className="text-cyber-red" size={16} />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cyber-card p-6"
        >
          <h2 className="text-xl font-bold mb-6">⚡ Түргэн Холбоосууд</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/matchmaking" className="p-6 rounded-xl bg-gradient-to-br from-cyber-purple/20 to-cyber-purple/5 border border-cyber-purple/30 hover:scale-105 transition-transform">
              <Swords className="text-cyber-purple mb-2" size={32} />
              <p className="font-bold">Рангийн тоглоом</p>
              <p className="text-sm text-gray-400">Өөрийн хүчээ сориорой</p>
            </a>
            <a href="/tournaments" className="p-6 rounded-xl bg-gradient-to-br from-cyber-yellow/20 to-cyber-yellow/5 border border-cyber-yellow/30 hover:scale-105 transition-transform">
              <Calendar className="text-cyber-yellow mb-2" size={32} />
              <p className="font-bold">Тэмцээнүүд</p>
              <p className="text-sm text-gray-400">Профессонал тэмцээн</p>
            </a>
            <a href="/clans" className="p-6 rounded-xl bg-gradient-to-br from-cyber-cyan/20 to-cyber-cyan/5 border border-cyber-cyan/30 hover:scale-105 transition-transform">
              <Shield className="text-cyber-cyan mb-2" size={32} />
              <p className="font-bold">Кланууд</p>
              <p className="text-sm text-gray-400">Багтаа нэгдээрэй</p>
            </a>
            <a href="/profile" className="p-6 rounded-xl bg-gradient-to-br from-cyber-pink/20 to-cyber-pink/5 border border-cyber-pink/30 hover:scale-105 transition-transform">
              <Users className="text-cyber-pink mb-2" size={32} />
              <p className="font-bold">Миний Профайл</p>
              <p className="text-sm text-gray-400">Статистик үзэх</p>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}