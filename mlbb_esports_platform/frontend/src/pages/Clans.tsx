import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Search, Plus, Star, Crown, Swords } from 'lucide-react';



const mockClans = [
  { clanId: 'c1', name: 'Phoenix Rising', tag: 'PHX', leaderName: 'ShadowStrike', members: [{ odyseeId: '1', username: 'ShadowStrike', role: 'Leader' }, { odyseeId: '2', username: 'IceQueen', role: 'Officer' }], memberCount: 28, averageMMR: 8450, wins: 156, losses: 44, region: 'Global', description: 'Elite competitive gaming community' },
  { clanId: 'c2', name: 'Dragon Killers', tag: 'DRG', leaderName: 'BlazeFury', members: [{ odyseeId: '3', username: 'BlazeFury', role: 'Leader' }], memberCount: 25, averageMMR: 7820, wins: 134, losses: 51, region: 'Americas', description: 'Legends are born here' },
  { clanId: 'c3', name: 'Shadow Legion', tag: 'SHD', leaderName: 'NightRaven', members: [{ odyseeId: '4', username: 'NightRaven', role: 'Leader' }], memberCount: 30, averageMMR: 8150, wins: 178, losses: 62, region: 'Europe', description: 'Striking from the shadows' },
  { clanId: 'c4', name: 'Highland Warriors', tag: 'THK', leaderName: 'StormBreaker', members: [{ odyseeId: '5', username: 'StormBreaker', role: 'Leader' }], memberCount: 22, averageMMR: 7340, wins: 112, losses: 38, region: 'Asia', description: 'Swift as legend, dangerous as storm' },
];

export default function Clans() {
  const [clans] = useState(mockClans);
  const [search, setSearch] = useState('');

  const filteredClans = clans.filter(


    c => c.name.toLowerCase().includes(search.toLowerCase()) || c.tag.toLowerCase().includes(search.toLowerCase())
  );

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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-purple to-cyber-pink">
              ⚔️ CLANS
            </span>
          </h1>
          <p className="text-gray-400 mt-2">Join a team and compete together in esports</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search clans..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="cyber-input pl-10 w-64"
            />
          </div>
          <button className="cyber-button flex items-center gap-2" type="button">
            <Plus size={20} />
            Create Clan
          </button>
        </div>
      </motion.div>

      {/* Top Clans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClans.slice(0, 2).map((clan, idx) => (
          <motion.div
            key={clan.clanId}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="cyber-card overflow-hidden group"
          >
            <div
              className="h-32 relative flex items-center justify-center"
              style={{
                background: idx === 0
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.2))'
                  : 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(234, 179, 8, 0.2))',
              }}
            >
              <span className="text-7xl opacity-50 group-hover:scale-110 transition-transform">⚔️</span>
              {idx === 0 && (
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Crown className="text-cyber-yellow" size={20} />
                  <span className="text-sm font-bold text-cyber-yellow">TOP CLAN</span>
                </div>
              )}
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-cyber-purple/30 text-sm font-bold">
                {clan.tag}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold group-hover:text-cyber-purple transition-colors">{clan.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">Led by {clan.leaderName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-cyber-yellow">{clan.averageMMR.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Avg MMR</p>
                </div>
              </div>

              <p className="text-sm text-gray-300 mt-3">{clan.description}</p>

              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <Users className="mx-auto text-gray-400" size={18} />
                  <p className="font-bold mt-1">{clan.memberCount}</p>
                  <p className="text-xs text-gray-500">Members</p>
                </div>
                <div className="text-center">
                  <Trophy className="mx-auto text-cyber-yellow" size={18} />
                  <p className="font-bold mt-1">{clan.wins}</p>
                  <p className="text-xs text-gray-500">Wins</p>
                </div>
                <div className="text-center">
                  <Swords className="mx-auto text-cyber-red" size={18} />
                  <p className="font-bold mt-1">{clan.losses}</p>
                  <p className="text-xs text-gray-500">Losses</p>
                </div>
                <div className="text-center">
                  <Star className="mx-auto text-cyber-green" size={18} />
                  <p className="font-bold mt-1">{((clan.wins / (clan.wins + clan.losses)) * 100).toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">Win Rate</p>
                </div>
              </div>

              <button className="w-full mt-4 cyber-button-secondary">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* All Clans Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cyber-card overflow-hidden"
      >
        <div className="p-6 border-b border-cyber-purple/20">
          <h2 className="text-xl font-bold">All Clans</h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-cyber-purple/20">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Rank</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Clan</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Leader</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Members</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Avg MMR</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Record</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {filteredClans.map((clan, idx) => (
              <motion.tr
                key={clan.clanId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-cyber-purple/10 hover:bg-cyber-purple/5 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <span className={`font-bold ${
                    idx === 0 ? 'text-cyber-yellow' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-400'
                  }`}>
                    #{idx + 1}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-purple to-cyber-cyan flex items-center justify-center font-bold">
                      {clan.tag}
                    </div>
                    <div>
                      <p className="font-semibold hover:text-cyber-purple transition-colors">{clan.name}</p>
                      <p className="text-xs text-gray-500">[{clan.tag}] • {clan.region}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300">{clan.leaderName}</td>
                <td className="px-6 py-4 text-gray-300">{clan.memberCount}/30</td>
                <td className="px-6 py-4">
                  <span className="font-mono font-bold text-cyber-cyan">{clan.averageMMR.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {clan.wins}W - {clan.losses}L
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 rounded-full bg-[#0f0f1a] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(clan.wins / (clan.wins + clan.losses)) * 100}%`,
                          backgroundColor: (clan.wins / (clan.wins + clan.losses)) >= 0.6 ? '#10B981' : '#F59E0B',
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold">
                      {((clan.wins / (clan.wins + clan.losses)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}