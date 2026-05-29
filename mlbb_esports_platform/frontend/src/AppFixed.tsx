import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Matchmaking from './pages/Matchmaking';
import Tournaments from './pages/Tournaments';
import Clans from './pages/Clans';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { useAuthStore } from './store';

function Heroes() {
  // Keep the existing simple filter UI but avoid heavy inline state pollution.
  const allHeroes = useMemo(
    () => [
      { id: 1, name: 'Fredrin', role: 'Tank', tier: 'S', winRate: 52.8, pickRate: 7200, img: '/img/fredrin neo.jpg' },
      { id: 2, name: 'Tigreal', role: 'Tank', tier: 'A', winRate: 50.1, pickRate: 5400, img: '/img/fredrin neo.jpg' },
      { id: 3, name: 'Akai', role: 'Tank', tier: 'A', winRate: 51.3, pickRate: 4800, img: '/img/fredrin neo.jpg' },
      { id: 4, name: 'Franco', role: 'Tank', tier: 'B', winRate: 49.5, pickRate: 3800, img: '/img/fredrin neo.jpg' },
      { id: 5, name: 'Minotaur', role: 'Tank', tier: 'S', winRate: 52.8, pickRate: 7200, img: '/img/fredrin neo.jpg' },
      { id: 6, name: 'Lolita', role: 'Tank', tier: 'A', winRate: 50.5, pickRate: 5100, img: '/img/fredrin neo.jpg' },
      { id: 7, name: 'Grock', role: 'Tank', tier: 'A', winRate: 51.2, pickRate: 5600, img: '/img/fredrin neo.jpg' },
      { id: 8, name: 'Ling', role: 'Assassin', tier: 'S', winRate: 56.8, pickRate: 11200, img: '/img/ling neo.jpg' },
      { id: 9, name: 'Granger', role: 'Assassin', tier: 'S', winRate: 56.8, pickRate: 12400, img: '/img/granger leg.jpg' },
      { id: 10, name: 'Pharsa', role: 'Mage', tier: 'A', winRate: 51.5, pickRate: 8600, img: '/img/pharsa neo.jpg' },
      { id: 11, name: 'Brody', role: 'Marksman', tier: 'A', winRate: 52.8, pickRate: 10500, img: '/img/brody neo.jpg' },
      { id: 12, name: 'Balmond', role: 'Fighter', tier: 'B', winRate: 48.2, pickRate: 3200, img: '/img/fredrin neo.jpg' },
      { id: 13, name: 'Angela', role: 'Support', tier: 'S', winRate: 54.3, pickRate: 10800, img: '/img/granger leg.jpg' },
      { id: 14, name: 'Estes', role: 'Support', tier: 'A', winRate: 52.1, pickRate: 6500, img: '/img/fredrin neo.jpg' },
    ],
    []
  );

  const [role, setRole] = useState('All');
  const [tier, setTier] = useState('All');
  const [search, setSearch] = useState('');

  const roles = ['All', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];
  const tierColors: Record<string, string> = { S: '#F59E0B', A: '#7c3aed', B: '#06b6d4' };
  const tierBg: Record<string, string> = {
    S: 'rgba(245,158,11,0.15)',
    A: 'rgba(124,58,237,0.15)',
    B: 'rgba(6,182,212,0.15)',
  };

  const filtered = allHeroes.filter(
    (h) =>
      (role === 'All' || h.role === role) &&
      (tier === 'All' || h.tier === tier) &&
      (!search || h.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Heroes ({allHeroes.length})</h1>
          <input
            type="text"
            placeholder="Search hero..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-[#1a1a2e] border border-[#2d2d44] rounded-lg text-white w-60 focus:outline-none focus:border-[#7c3aed]"
          />
        </div>
        <div className="flex gap-3 mb-6 flex-wrap">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={
                'px-4 py-2 rounded-lg text-sm font-medium transition-all ' +
                (role === r
                  ? 'bg-[#7c3aed] text-white'
                  : 'bg-[#1a1a2e] text-[#8888aa] hover:bg-[#2d2d44]')
              }
            >
              {r}
            </button>
          ))}
          <select
            title="Tier filter"
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="px-4 py-2 bg-[#1a1a2e] border border-[#2d2d44] rounded-lg text-white text-sm"
          >
            <option value="All">All Tiers</option>
            <option value="S">S Tier</option>
            <option value="A">A Tier</option>
            <option value="B">B Tier</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((h) => (
            <div
              key={h.id}
              className="bg-[#1a1a2e] border border-[#2d2d44] rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
              style={{ background: tierBg[h.tier] }}
            >
              <div
                className="h-28 bg-cover bg-center rounded-t-xl"
                style={{
                  backgroundImage: `linear-gradient(to bottom, transparent 50%, #1a1a2e 100%), url(${h.img || '/img/home.jpg'})`,
                }}
              />
              <div className="p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm">{h.name}</span>
                  <span
                    className="text-xs font-bold px-2 py-1 rounded"
                    style={{ color: tierColors[h.tier], background: `${tierColors[h.tier]}20` }}
                  >
                    {h.tier}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#8888aa]">
                  <span>{h.role}</span>
                  <span className="text-[#10B981]">{h.winRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Header({ user, onLogout }: { user: any; onLogout: () => void }) {
  const l = useLocation();
  const links = [
    { p: '/', l: 'Dashboard' },
    { p: '/leaderboard', l: 'Leaderboard' },
    { p: '/matchmaking', l: 'Matchmaking' },
    { p: '/tournaments', l: 'Tournaments' },
    { p: '/clans', l: 'Clans' },
    { p: '/heroes', l: 'Heroes' },
    { p: '/profile', l: 'Profile' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#1a1a2e]/95 backdrop-blur-xl border-b border-[#2d2d44]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/img/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg text-white">MLBB Mongolia</span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((x) => (
            <Link
              key={x.p}
              to={x.p}
              className={
                'px-4 py-2 rounded-lg text-sm font-medium transition-all ' +
                (l.pathname === x.p
                  ? 'bg-[#7c3aed]/15 text-white'
                  : 'text-[#8888aa] hover:text-white')
              }
            >
              {x.l}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/profile"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                {user.username}
              </Link>
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-[#7c3aed] text-[#7c3aed] hover:bg-[#7c3aed]/10 transition-all"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default function AppFixed() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Ensure initial render always shows something (even if auth storage is empty)
  const [bootUser, setBootUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem('mlbb_user');
    if (saved) {
      try {
        setBootUser(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const effectiveUser = user ?? bootUser;

  const handleLogout = () => {
    logout();
    localStorage.removeItem('mlbb_user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Header user={effectiveUser} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/matchmaking" element={<Matchmaking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/clans" element={<Clans />} />
        <Route path="/heroes" element={<Heroes />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppFixed />
    </BrowserRouter>
  );
}

