import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

// MLBB Mongolia - Professional Esports Platform
// Realistic implementation with live data

const C = {
  primary: '#7c3aed',
  primaryLight: '#a855f7',
  cyan: '#06b6d4',
  green: '#10b981',
  red: '#ef4444',
  yellow: '#f59e0b',
  bg: '#0f0f23',
  bg2: '#1a1a2e',
  bg3: '#16213e',
  border: '#2d2d44',
  text: '#ffffff',
  textDim: '#8888aa',
};

const st = {
  wrap: {
    fontFamily: "'Inter', sans-serif",
    background: `linear-gradient(180deg, rgba(15,15,35,0.95) 0%, rgba(15,15,35,0.85) 100%), url(/img/home.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    color: C.text,
    minHeight: '100vh',
    margin: 0
  },
  container: { maxWidth: '1280px', margin: '0 auto', padding: '0 24px' },
  header: { background: `rgba(26,26,46,0.95)`, borderBottom: `1px solid ${C.border}`, position: 'sticky' as const, top: 0, zIndex: 100, backdropFilter: 'blur(10px)' },
  navInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' },
  logo: { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: C.text },
  logoBox: { width: '32px', height: '32px', background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`, borderRadius: '8px' },
  logoText: { fontWeight: 700, fontSize: '18px' },
  nav: { display: 'flex', alignItems: 'center', gap: '2px' },
  navBtn: { padding: '8px 14px', color: C.textDim, textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' },
  navBtnAct: { color: C.text, background: 'rgba(124,58,237,0.15)' },
  btn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 600, border: 'none', borderRadius: '10px', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s' },
  btnP: { background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: C.text, boxShadow: `0 4px 15px rgba(124,58,237,0.3)` },
  btnO: { background: 'transparent', color: C.primary, border: `2px solid ${C.primary}` },
  hero: {
    background: `linear-gradient(135deg, rgba(15,15,35,0.92) 0%, rgba(26,26,46,0.88) 50%, rgba(124,58,237,0.15) 100%), url(/img/home.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '100px 0',
    marginBottom: '40px',
    borderBottom: `1px solid ${C.border}`
  },
  heroInner: { textAlign: 'center' as const },
  heroTitle: { fontSize: '48px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-1.5px', background: `linear-gradient(135deg, ${C.text} 30%, ${C.primaryLight} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroSub: { fontSize: '17px', color: C.textDim, marginBottom: '32px', maxWidth: '560px', margin: '0 auto 32px', lineHeight: 1.6 },
  heroBtns: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' },
  stat: { background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '20px 24px', textAlign: 'center' as const },
  statVal: { fontSize: '28px', fontWeight: 700, color: C.primary, marginBottom: '4px' },
  statLbl: { fontSize: '11px', color: C.textDim, textTransform: 'uppercase' as const, letterSpacing: '1.5px' },
  sec: { marginBottom: '40px' },
  secHdr: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  secTitle: { fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px' },
  card: { background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '14px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left' as const, color: C.textDim, fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '1px', borderBottom: `1px solid ${C.border}` },
  td: { padding: '14px 16px', borderBottom: `1px solid ${C.border}`, fontSize: '14px' },
  rank1: { color: C.yellow, fontWeight: 700 },
  rank2: { color: '#aaaaaa', fontWeight: 700 },
  rank3: { color: '#cd7f32', fontWeight: 700 },
  tGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  tCard: { background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '14px', overflow: 'hidden', transition: 'transform 0.2s' },
  tBadge: { display: 'inline-block', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.5px' },
  tBadgeS: { background: 'rgba(16,185,129,0.15)', color: C.green },
  tBadgeW: { background: 'rgba(245,158,11,0.15)', color: C.yellow },
  tBody: { padding: '20px' },
  tPrize: { fontSize: '16px', fontWeight: 700, marginBottom: '2px' },
  tName: { fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: C.textDim },
  tInfo: { display: 'flex', gap: '12px', color: C.textDim, fontSize: '12px', marginBottom: '12px' },
  lbTab: { display: 'flex', gap: '4px', marginBottom: '16px' },
  lbTabBtn: { padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', border: 'none', background: C.bg, color: C.textDim, transition: 'all 0.2s' },
  lbTabBtnAct: { background: C.primary, color: C.text },
  auth: { maxWidth: '400px', margin: '80px auto' },
  authCard: { background: C.bg2, padding: '40px', borderRadius: '20px', border: `1px solid ${C.border}` },
  input: { width: '100%', padding: '14px 16px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, fontSize: '15px', marginBottom: '14px', outline: 'none', transition: 'border 0.2s' },
  divider: { height: '1px', background: C.border, margin: '24px 0' },
  footer: { background: `rgba(26,26,46,0.95)`, borderTop: `1px solid ${C.border}`, padding: '40px 0', marginTop: '60px', backdropFilter: 'blur(10px)' },
  search: { padding: '10px 16px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '8px', color: C.text, fontSize: '14px', width: '240px', outline: 'none' },
  filter: { padding: '10px 14px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '8px', color: C.text, fontSize: '14px', cursor: 'pointer' },
};

// ========== LIVE API CALLS (Realistic) ==========
const API_URL = 'http://localhost:4000';

async function fetchLeaderboard(region = 'Global') {
  try {
    const res = await fetch(`${API_URL}/api/users/leaderboard?region=${region}&limit=50`);
    if (res.ok) return res.json();
  } catch {}
  return null;
}

async function fetchStats() {
  try {
    const res = await fetch(`${API_URL}/api/stats`);
    if (res.ok) return res.json();
  } catch {}
  return null;
}

async function fetchTournaments() {
  try {
    const res = await fetch(`${API_URL}/api/tournaments`);
    if (res.ok) return res.json();
  } catch {}
  return null;
}

// ========== MOCK DATA (Fallback when API unavailable) ==========
const mockPlayers = [
  { rank: 1, odyseeId: 'dragon_slayer', username: 'DragonSlayer', mmr: 15680, ignot: 245000, winRate: 68.5, matches: 1480, region: 'Mongolia', rankTier: 'CELESTIAL' },
  { rank: 2, odyseeId: 'phoenix_king', username: 'PhoenixKing', mmr: 15420, ignot: 198000, winRate: 66.2, matches: 1420, region: 'Mongolia', rankTier: 'CELESTIAL' },
  { rank: 3, odyseeId: 'shadow_master', username: 'ShadowMaster', mmr: 15100, ignot: 167000, winRate: 64.8, matches: 1390, region: 'USA', rankTier: 'TITAN' },
  { rank: 4, odyseeId: 'ice_breaker', username: 'IceBreaker', mmr: 14890, ignot: 145000, winRate: 62.1, matches: 1256, region: 'Germany', rankTier: 'TITAN' },
  { rank: 5, odyseeId: 'fire_storm', username: 'FireStorm', mmr: 14650, ignot: 132000, winRate: 61.4, matches: 1189, region: 'Japan', rankTier: 'MYTHICAL_HONOR' },
  { rank: 6, odyseeId: 'thunder_god', username: 'ThunderGod', mmr: 14420, ignot: 118000, winRate: 60.8, matches: 1098, region: 'Korea', rankTier: 'MYTHICAL_HONOR' },
  { rank: 7, odyseeId: 'dark_wizard', username: 'DarkWizard', mmr: 14200, ignot: 105000, winRate: 60.2, matches: 1023, region: 'France', rankTier: 'MYTHICAL_SOVEREIGN' },
  { rank: 8, odyseeId: 'light_knight', username: 'LightKnight', mmr: 13980, ignot: 94000, winRate: 59.4, matches: 956, region: 'Brazil', rankTier: 'MYTHICAL_SOVEREIGN' },
  { rank: 9, odyseeId: 'storm_bringer', username: 'StormBringer', mmr: 13750, ignot: 82000, winRate: 58.7, matches: 887, region: 'UK', rankTier: 'MYTHICAL_GLORY' },
  { rank: 10, odyseeId: 'frost_bite', username: 'FrostBite', mmr: 13520, ignot: 71000, winRate: 57.9, matches: 812, region: 'China', rankTier: 'MYTHICAL_GLORY' },
  { rank: 11, odyseeId: 'iron_fist', username: 'IronFist', mmr: 13300, ignot: 65000, winRate: 57.2, matches: 756, region: 'Australia', rankTier: 'MYTHICAL_GLORY' },
  { rank: 12, odyseeId: 'crimson_blade', username: 'CrimsonBlade', mmr: 13080, ignot: 58000, winRate: 56.5, matches: 701, region: 'Canada', rankTier: 'LEGEND' },
];

const mockStats = { totalPlayers: 12847, totalMatches: 45892, totalTournaments: 156, activeMatches: 324, systemStatus: 'Operational' };

const mockTourneys = [
  { id: 't1', name: 'MLBB Champions League', prizePool: 50000000, type: 'Double Elimination', startDate: '2024-02-15', currentTeams: 12, maxTeams: 16, status: 'registration', region: 'Global' },
  { id: 't2', name: 'Spring Championship Series', prizePool: 25000000, type: 'Single Elimination', startDate: '2024-03-01', currentTeams: 8, maxTeams: 8, status: 'in_progress', region: 'Americas' },
  { id: 't3', name: 'Asia Pro League', prizePool: 100000000, type: 'Round Robin', startDate: '2024-03-20', currentTeams: 5, maxTeams: 8, status: 'registration', region: 'Asia' },
];

const regionsLB = ['Global', 'Americas', 'Europe', 'Asia Pacific'];

// ========== RANK TIER COLORS ==========
const tierColors: Record<string, string> = {
  CELESTIAL: C.yellow,
  TITAN: C.red,
  MYTHICAL_HONOR: C.primary,
  MYTHICAL_SOVEREIGN: C.primaryLight,
  MYTHICAL_GLORY: C.cyan,
  LEGEND: C.green,
  EPIC: '#8b5cf6',
  GRANDMASTER: C.yellow,
  MASTER: C.cyan,
  ELITE: C.green,
  WARRIOR: C.textDim,
};

// ========== HEADER ==========
function Header({ user, onLogout }: { user?: any; onLogout?: () => void }) {
  const l = useLocation();
  const links = [
    { p: '/', l: 'Home' },
    { p: '/leaderboard', l: 'Leaderboard' },
    { p: '/duel', l: 'Duel' },
    { p: '/tournaments', l: 'Tournaments' },
    { p: '/teams', l: 'Teams' },
    { p: '/heroes', l: 'Heroes' },
  ];

  return (
    <header style={st.header}>
      <div style={st.container}>
        <div style={st.navInner}>
          <Link to="/" style={st.logo}>
            <div style={st.logoBox} />
            <span style={st.logoText}>MLBB Mongolia</span>
          </Link>
          <nav style={st.nav}>
            {links.map(x => (
              <Link key={x.p} to={x.p} style={{ ...st.navBtn, ...(l.pathname === x.p ? st.navBtnAct : {}) }}>
                {x.l}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/profile" style={{ ...st.navBtn, color: C.primary, fontWeight: 600 }}>
                  👤 {user.username}
                </Link>
                <button onClick={onLogout} style={{ ...st.btn, ...st.btnO, padding: '8px 16px', marginLeft: '8px', fontSize: '13px' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" style={{ ...st.btn, ...st.btnP, padding: '8px 18px', marginLeft: '8px', fontSize: '13px' }}>
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

// ========== HOME ==========
function Home() {
  const [stats, setStats] = useState(mockStats);
  const [players, setPlayers] = useState(mockPlayers.slice(0, 5));
  const [tourneys, setTourneys] = useState(mockTourneys);

  useEffect(() => {
    fetchStats().then(d => d && setStats(d));
    fetchLeaderboard().then(d => d?.users && setPlayers(d.users.slice(0, 5)));
    fetchTournaments().then(d => d && setTourneys(d.slice(0, 3)));
  }, []);

  return (
    <div style={st.wrap}>
            <div style={st.container}>
        <section style={st.hero}>
          <div style={st.heroInner}>
            <h1 style={st.heroTitle}>COMPETE AT THE HIGHEST LEVEL</h1>
            <p style={st.heroSub}>Join the premier Mobile Legends esports platform. Rank up, compete in tournaments, and prove you're the best.</p>
            <div style={st.heroBtns}>
              <Link to="/duel" style={{ ...st.btn, ...st.btnP }}>StartCompeting</Link>
              <Link to="/tournaments" style={{ ...st.btn, ...st.btnO }}>View Tournaments</Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div style={st.stats}>
          {[
            { v: stats.totalPlayers?.toLocaleString() || '12,847', l: 'Registered Players' },
            { v: stats.totalMatches?.toLocaleString() || '45,892', l: 'Matches Played' },
            { v: stats.totalTournaments || '156', l: 'Tournaments' },
            { v: stats.systemStatus || '24/7', l: 'System Status' },
          ].map((x, i) => (
            <div key={i} style={st.stat}>
              <div style={st.statVal}>{x.v}</div>
              <div style={st.statLbl}>{x.l}</div>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <section style={st.sec}>
          <div style={st.secHdr}>
            <h2 style={st.secTitle}>Top Players</h2>
            <Link to="/leaderboard" style={{ ...st.btn, ...st.btnO, padding: '8px 16px', fontSize: '13px' }}>View All</Link>
          </div>
          <div style={st.card}>
            <table style={st.table}>
              <thead>
                <tr>
                  <th style={st.th}>#</th>
                  <th style={st.th}>Player</th>
                  <th style={st.th}>MMR</th>
                  <th style={st.th}>Win Rate</th>
                  <th style={st.th}>Matches</th>
                  <th style={st.th}>Region</th>
                </tr>
              </thead>
              <tbody>
                {players.map(p => (
                  <tr key={p.odysseeld || p.rank}>
                    <td style={{ ...st.td, width: '50px', ...(p.rank === 1 ? st.rank1 : p.rank === 2 ? st.rank2 : p.rank === 3 ? st.rank3 : {}) }}>{p.rank}</td>
                    <td style={st.td}>
                      <span style={{ color: tierColors[p.rankTier] || C.primaryLight, fontWeight: 600 }}>{p.username}</span>
                    </td>
                    <td style={st.td}>{p.mmr.toLocaleString()}</td>
                    <td style={st.td}>{p.winRate}%</td>
                    <td style={st.td}>{p.matches?.toLocaleString() || '0'}</td>
                    <td style={st.td}>{p.region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tournaments */}
        <section style={st.sec}>
          <div style={st.secHdr}>
            <h2 style={st.secTitle}>Active Tournaments</h2>
            <Link to="/tournaments" style={{ ...st.btn, ...st.btnO, padding: '8px 16px', fontSize: '13px' }}>View All</Link>
          </div>
          <div style={st.tGrid}>
            {tourneys.map(t => (
              <div key={t.id} style={st.tCard}>
                <div style={{ padding: '14px 20px', background: `linear-gradient(135deg, ${C.primary}15, ${C.cyan}08)` }}>
                  <span style={{ ...st.tBadge, ...(t.status === 'registration' ? st.tBadgeS : st.tBadgeW) }}>{t.status.replace('_', ' ')}</span>
                </div>
                <div style={st.tBody}>
                  <div style={st.tPrize}>{t.prizePool?.toLocaleString() || t.prizePool} MNT</div>
                  <div style={st.tName}>{t.name}</div>
                  <div style={st.tInfo}>
                    <span>{t.type}</span>
                    <span>{t.startDate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: C.textDim, fontSize: '12px' }}>{t.currentTeams}/{t.maxTeams} Teams</span>
                    <Link to={`/tournaments/${t.id}`} style={{ ...st.btn, ...st.btnP, padding: '6px 14px', fontSize: '12px' }}>Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer style={st.footer}>
        <div style={st.container}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={st.logoBox} />
              <span style={st.logoText}>MLBB Mongolia</span>
            </div>
            <div style={{ color: C.textDim, fontSize: '13px' }}>2024 MLBB Mongolia. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ========== LEADERBOARD (Full Features) ==========
function Leaderboard() {
  const [players, setPlayers] = useState(mockPlayers);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState('Global');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('mmr');

  useEffect(() => {
    setLoading(true);
    fetchLeaderboard(region).then(d => {
      if (d?.users) setPlayers(d.users);
      else setPlayers(mockPlayers);
      setLoading(false);
    });
  }, [region]);

  const filtered = players.filter(p =>
    p.username.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'mmr') return b.mmr - a.mmr;
    if (sortBy === 'winRate') return b.winRate - a.winRate;
    return b.matches - a.matches;
  });

  return (
    <div style={st.wrap}>
            <div style={st.container}>
        <section style={{ padding: '40px 0' }}>
          <div style={st.secHdr}>
            <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Leaderboard</h1>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search player..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={st.search}
            />
            <select value={region} onChange={e => setRegion(e.target.value)} style={st.filter}>
              {regionsLB.map(r => <option key={r}>{r}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={st.filter}>
              <option value="mmr">Sort by MMR</option>
              <option value="winRate">Sort by Win Rate</option>
              <option value="matches">Sort by Matches</option>
            </select>
          </div>

          {/* Region Tabs */}
          <div style={st.lbTab}>
            {regionsLB.map(r => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                style={{ ...st.lbTabBtn, ...(region === r ? st.lbTabBtnAct : {}) }}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Table */}
          <div style={st.card}>
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: C.textDim }}>Loading...</div>
            ) : (
              <table style={st.table}>
                <thead>
                  <tr>
                    <th style={st.th}>#</th>
                    <th style={st.th}>Player</th>
                    <th style={st.th}>Rank Tier</th>
                    <th style={st.th}>MMR</th>
                    <th style={st.th}>Win Rate</th>
                    <th style={st.th}>Matches</th>
                    <th style={st.th}>Region</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr key={p.odysseeld || i} style={{ background: p.rank <= 3 ? `${C.primary}08` : 'transparent' }}>
                      <td style={{ ...st.td, width: '50px', fontWeight: 600, ...(p.rank === 1 ? st.rank1 : p.rank === 2 ? st.rank2 : p.rank === 3 ? st.rank3 : {}) }}>
                        {p.rank}
                      </td>
                      <td style={st.td}>
                        <Link to={`/profile/${p.odysseeld || p.username}`} style={{ color: C.primaryLight, fontWeight: 600 }}>
                          {p.username}
                        </Link>
                      </td>
                      <td style={st.td}>
                        <span style={{ color: tierColors[p.rankTier] || C.textDim, fontWeight: 600, fontSize: '12px' }}>
                          {p.rankTier?.replace('_', ' ') || 'WARRIOR'}
                        </span>
                      </td>
                      <td style={st.td}>{p.mmr.toLocaleString()}</td>
                      <td style={st.td}>{p.winRate}%</td>
                      <td style={st.td}>{p.matches?.toLocaleString() || '0'}</td>
                      <td style={st.td}>{p.region}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination hint */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '8px' }}>
            {Array.from({ length: 5 }, (_, i) => (
              <button key={i} style={{ width: '36px', height: '36px', borderRadius: '8px', border: `1px solid ${C.border}`, background: i === 0 ? C.primary : 'transparent', color: i === 0 ? C.text : C.textDim, cursor: 'pointer', fontSize: '13px' }}>
                {i + 1}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// ========== TOURNAMENTS ==========
function Tournaments() {
  const [tourneys, setTourneys] = useState(mockTourneys);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTournaments().then(d => d && setTourneys(d));
  }, []);

  return (
    <div style={st.wrap}>
      <div style={{
        position: 'fixed',
        left: '5%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '300px',
        height: '400px',
        background: `linear-gradient(180deg, transparent 40%, ${C.bg2} 100%), url(/img/pharsa neo.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        opacity: 0.4,
        pointerEvents: 'none',
        zIndex: 0,
        borderRadius: '20px'
      }} />
            <div style={st.container}>
        <section style={{ padding: '40px 0', position: 'relative', zIndex: 1 }}>
          <div style={st.secHdr}>
            <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Tournaments</h1>
            <Link to="/tournaments/create" style={{ ...st.btn, ...st.btnP }}>Create Tournament</Link>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {['all', 'registration', 'in_progress', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{ ...st.lbTabBtn, ...(filter === f ? st.lbTabBtnAct : {}) }}
              >
                {f === 'all' ? 'All' : f.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div style={st.tGrid}>
            {tourneys.filter(t => filter === 'all' || t.status === filter).map((t, i) => (
              <div key={t.id} style={st.tCard}>
                <div style={{ height: '140px', background: `linear-gradient(180deg, transparent 30%, ${C.bg2} 100%), url(/img/pharsa neo.jpg)`, backgroundSize: 'cover', backgroundPosition: `${i % 2 === 0 ? 'center top' : 'center 30%'}`, position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '12px', right: '12px', ...st.tBadge, ...(t.status === 'registration' ? st.tBadgeS : st.tBadgeW) }}>{t.status.replace('_', ' ')}</span>
                </div>
                <div style={st.tBody}>
                  <div style={st.tPrize}>{t.prizePool?.toLocaleString() || t.prizePool} MNT</div>
                  <div style={st.tName}>{t.name}</div>
                  <div style={st.tInfo}>
                    <span>{t.type}</span>
                    <span>{t.startDate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: C.textDim, fontSize: '12px' }}>{t.currentTeams}/{t.maxTeams} Teams</span>
                    <Link to={`/tournaments/${t.id}`} style={{ ...st.btn, ...st.btnP, padding: '6px 14px', fontSize: '12px' }}>Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// ========== LOGIN ==========
function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    onLogin({
      username,
      email: `${username}@mlbb.mn`,
      mmr: 8500 + Math.floor(Math.random() * 1000),
      rank: Math.floor(Math.random() * 1000) + 1,
      region: 'Mongolia',
      rankTier: 'MYTHICAL_HONOR'
    });
  };

  return (
    <div style={st.wrap}>
      <div style={st.auth}>
        <div style={st.authCard}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Sign In</h1>
          <p style={{ color: C.textDim, textAlign: 'center', marginBottom: '28px' }}>Welcome back to MLBB Mongolia</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={st.input}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={st.input}
            />
            {error && <p style={{ color: C.red, fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>{error}</p>}
            <button type="submit" style={{ ...st.btn, ...st.btnP, width: '100%', justifyContent: 'center', padding: '14px' }}>
              Sign In
            </button>
          </form>
          <div style={st.divider} />
          <p style={{ textAlign: 'center', color: C.textDim, fontSize: '14px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: C.primary }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ========== DUEL PAGE ==========
function Duel() {
  const [queueType, setQueueType] = useState('RANKED_SOLO');
  const [searching, setSearching] = useState(false);
  const [opponent, setOpponent] = useState<any>(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (searching) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [searching]);

  const startSearch = () => {
    setSearching(true);
    setTimer(0);
    setTimeout(() => {
      setOpponent({ username: 'Challenger_' + Math.floor(Math.random() * 9999), mmr: 8200 + Math.floor(Math.random() * 1000), winRate: 55 + Math.floor(Math.random() * 20) });
    }, 3000);
  };

  const cancelSearch = () => { setSearching(false); setOpponent(null); setTimer(0); };
  const acceptDuel = () => { alert('Duel accepted! Starting match...'); setSearching(false); };

  return (
    <div style={st.wrap}>
      <div style={{
        position: 'fixed',
        right: '5%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '300px',
        height: '400px',
        background: `linear-gradient(180deg, transparent 40%, ${C.bg2} 100%), url(/img/brody neo.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        opacity: 0.4,
        pointerEvents: 'none',
        zIndex: 0,
        borderRadius: '20px'
      }} />
            <div style={st.container}>
        <section style={{ padding: '40px 0', maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '32px' }}>Find Duel</h1>

          {!searching ? (
            <div style={{ ...st.card, padding: '32px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', background: `linear-gradient(180deg, rgba(124,58,237,0.15) 0%, transparent 100%), url(/img/brody neo.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center top', borderRadius: '14px 14px 0 0', margin: '-32px -32px 20px -32px' }} />
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Select Queue Type</h2>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' as const }}>
                {['RANKED_SOLO', 'RANKED_TEAM', 'CLASSIC'].map(type => (
                  <button key={type} onClick={() => setQueueType(type)} style={{ ...st.lbTabBtn, padding: '10px 20px', ...(queueType === type ? st.lbTabBtnAct : {}) }}>
                    {type.replace('_', ' ')}
                  </button>
                ))}
              </div>
              <button onClick={startSearch} style={{ ...st.btn, ...st.btnP, width: '100%', justifyContent: 'center', padding: '16px', fontSize: '16px' }}>
                Find Opponent
              </button>
            </div>
          ) : !opponent ? (
            <div style={{ ...st.card, padding: '48px', textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '150px', background: `linear-gradient(180deg, rgba(6,182,212,0.2) 0%, transparent 100%), url(/img/brody neo.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center top', borderRadius: '14px 14px 0 0', margin: '-48px -48px 30px -48px' }} />
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: `4px solid ${C.primary}`, borderTopColor: 'transparent', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Searching for opponent...</h2>
              <p style={{ color: C.textDim, marginBottom: '16px' }}>Time: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</p>
              <button onClick={cancelSearch} style={{ ...st.btn, ...st.btnO, padding: '10px 24px' }}>Cancel</button>
            </div>
          ) : (
            <div style={{ ...st.card, padding: '32px', textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', background: `linear-gradient(180deg, rgba(16,185,129,0.2) 0%, transparent 100%), url(/img/brody neo.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center top', borderRadius: '14px 14px 0 0', margin: '-32px -32px 20px -32px' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: C.green, marginBottom: '24px' }}>Opponent Found</h2>
              <div style={{ background: C.bg, padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
                <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{opponent.username}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', color: C.textDim, fontSize: '14px' }}>
                  <span>MMR: {opponent.mmr}</span>
                  <span>Win Rate: {opponent.winRate}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={acceptDuel} style={{ ...st.btn, ...st.btnP, padding: '12px 32px' }}>Accept</button>
                <button onClick={cancelSearch} style={{ ...st.btn, ...st.btnO, padding: '12px 32px' }}>Decline</button>
              </div>
            </div>
          )}

          {/* Recent Duels */}
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Recent Duel Activity</h2>
            <div style={st.card}>
              {[
                { p1: 'DragonSlayer', p2: 'PhoenixKing', result: 'WIN', mmr: '+28' },
                { p1: 'You', p2: 'ShadowMaster', result: 'LOSS', mmr: '-15' },
                { p1: 'You', p2: 'IceBreaker', result: 'WIN', mmr: '+24' },
              ].map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                  <div style={{ fontSize: '14px' }}>{d.p1} vs {d.p2}</div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ color: d.result === 'WIN' ? C.green : C.red, fontSize: '12px', fontWeight: 600 }}>{d.result}</span>
                    <span style={{ color: d.mmr.startsWith('+') ? C.green : C.red, fontSize: '13px' }}>{d.mmr}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// ========== TEAMS PAGE ==========
function Teams() {
  const [teams, setTeams] = useState([
    { id: 't1', name: 'Phoenix Rising', tag: 'PHX', leader: 'ShadowStrike', members: 28, mmr: 8450, winRate: 66, region: 'Global' },
    { id: 't2', name: 'Dragon Slayers', tag: 'DRG', leader: 'BlazeFury', members: 25, mmr: 7820, winRate: 62, region: 'Americas' },
    { id: 't3', name: 'Shadow Legion', tag: 'SHD', leader: 'NightRaven', members: 30, mmr: 8150, winRate: 64, region: 'Europe' },
    { id: 't4', name: 'Thunder Hawks', tag: 'THK', leader: 'StormBreaker', members: 22, mmr: 7340, winRate: 58, region: 'Asia' },
  ]);

  return (
    <div style={st.wrap}>
            <div style={st.container}>
        <section style={{ padding: '40px 0' }}>
          <div style={st.secHdr}>
            <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Teams</h1>
            <Link to="/teams/create" style={{ ...st.btn, ...st.btnP }}>Create Team</Link>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input type="text" placeholder="Search teams..." style={{ ...st.search, flex: 1 }} />
            <select style={st.filter}><option>All Regions</option><option>Mongolia</option><option>Americas</option><option>Europe</option></select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {teams.map(t => (
              <div key={t.id} style={st.card, { padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700 }}>{t.name}</div>
                    <div style={{ color: C.textDim, fontSize: '13px' }}>[{t.tag}]</div>
                  </div>
                  <span style={{ ...st.tBadge, ...st.tBadgeS, fontSize: '10px' }}>{t.region}</span>
                </div>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '12px', fontSize: '13px', color: C.textDim }}>
                  <span>Leader: {t.leader}</span>
                  <span>Members: {t.members}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '14px' }}>
                    <span style={{ color: C.primary, fontWeight: 600 }}>MMR {t.mmr}</span>
                    <span style={{ color: C.textDim, marginLeft: '12px' }}>{t.winRate}% Win Rate</span>
                  </div>
                  <Link to={`/teams/${t.id}`} style={{ ...st.btn, ...st.btnO, padding: '6px 14px', fontSize: '12px' }}>View</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// ========== HEROES PAGE ==========
function Heroes() {
  const [role, setRole] = useState('All');
  const [tier, setTier] = useState('All');
  const [search, setSearch] = useState('');

  const allHeroes = [
    // Tank
    { id: 1, name: 'Balmond', role: 'Tank', tier: 'B', winRate: 48.2, pickRate: 3200 },
    { id: 2, name: 'Tigreal', role: 'Tank', tier: 'A', winRate: 50.1, pickRate: 5400 },
    { id: 3, name: 'Akai', role: 'Tank', tier: 'A', winRate: 51.3, pickRate: 4800 },
    { id: 4, name: 'Franco', role: 'Tank', tier: 'B', winRate: 49.5, pickRate: 3800 },
    { id: 5, name: 'Minotaur', role: 'Tank', tier: 'S', winRate: 52.8, pickRate: 7200 },
    { id: 6, name: 'Lolita', role: 'Tank', tier: 'A', winRate: 50.5, pickRate: 5100 },
    { id: 7, name: 'Grock', role: 'Tank', tier: 'A', winRate: 51.2, pickRate: 5600 },
    { id: 8, name: 'Gatotkaca', role: 'Tank', tier: 'B', winRate: 48.9, pickRate: 2900 },
    { id: 9, name: 'Hilda', role: 'Tank', tier: 'B', winRate: 49.1, pickRate: 3400 },
    { id: 10, name: 'Uranus', role: 'Tank', tier: 'B', winRate: 47.8, pickRate: 2100 },
    { id: 11, name: 'Khufra', role: 'Tank', tier: 'A', winRate: 50.8, pickRate: 4900 },
    { id: 12, name: 'Barats', role: 'Tank', tier: 'B', winRate: 48.5, pickRate: 2800 },
    { id: 13, name: 'Atlas', role: 'Tank', tier: 'A', winRate: 50.3, pickRate: 4400 },
    { id: 14, name: 'Fredrinn', role: 'Tank', tier: 'S', winRate: 54.2, pickRate: 9800, img: '/img/fredrin neo.jpg' },
    // Fighter
    { id: 15, name: 'Freya', role: 'Fighter', tier: 'B', winRate: 49.2, pickRate: 3600 },
    { id: 16, name: 'Alucard', role: 'Fighter', tier: 'B', winRate: 48.7, pickRate: 3100 },
    { id: 17, name: 'Zilong', role: 'Fighter', tier: 'B', winRate: 47.5, pickRate: 2400 },
    { id: 18, name: 'Chou', role: 'Fighter', tier: 'S', winRate: 54.9, pickRate: 10200, img: '/img/home.jpg' },
    { id: 19, name: 'Sun', role: 'Fighter', tier: 'B', winRate: 46.8, pickRate: 1800 },
    { id: 20, name: 'Alpha', role: 'Fighter', tier: 'B', winRate: 48.1, pickRate: 2700 },
    { id: 21, name: 'Ruby', role: 'Fighter', tier: 'A', winRate: 52.1, pickRate: 6300 },
    { id: 22, name: 'Lapu-Lapu', role: 'Fighter', tier: 'A', winRate: 51.4, pickRate: 5700 },
    { id: 23, name: 'Roger', role: 'Fighter', tier: 'B', winRate: 47.9, pickRate: 2200 },
    { id: 24, name: 'Martis', role: 'Fighter', tier: 'A', winRate: 51.8, pickRate: 5800 },
    { id: 25, name: 'Aldous', role: 'Fighter', tier: 'A', winRate: 50.6, pickRate: 5200 },
    { id: 26, name: 'Leomord', role: 'Fighter', tier: 'A', winRate: 51.1, pickRate: 5500 },
    { id: 27, name: 'Kaja', role: 'Fighter', tier: 'B', winRate: 48.3, pickRate: 3000 },
    { id: 28, name: 'Thamuz', role: 'Fighter', tier: 'A', winRate: 50.9, pickRate: 5300 },
    { id: 29, name: 'Minsitthar', role: 'Fighter', tier: 'B', winRate: 47.2, pickRate: 1600 },
    { id: 30, name: 'Badang', role: 'Fighter', tier: 'B', winRate: 48.6, pickRate: 3300 },
    { id: 31, name: 'Khaleed', role: 'Fighter', tier: 'A', winRate: 51.6, pickRate: 5900 },
    { id: 32, name: 'Dyrroth', role: 'Fighter', tier: 'A', winRate: 50.4, pickRate: 4800 },
    { id: 33, name: 'Baxia', role: 'Fighter', tier: 'B', winRate: 47.6, pickRate: 1900 },
    { id: 34, name: 'Masha', role: 'Fighter', tier: 'B', winRate: 48.4, pickRate: 2800 },
    { id: 35, name: 'Julian', role: 'Fighter', tier: 'A', winRate: 53.2, pickRate: 8900, img: '/img/home.jpg' },
    { id: 36, name: 'Arlott', role: 'Fighter', tier: 'A', winRate: 50.7, pickRate: 5100 },
    { id: 37, name: 'Floryn', role: 'Fighter', tier: 'B', winRate: 48.8, pickRate: 3200 },
    { id: 38, name: 'Aulus', role: 'Fighter', tier: 'B', winRate: 46.9, pickRate: 1500 },
    { id: 39, name: 'Fredrinn', role: 'Fighter', tier: 'S', winRate: 54.2, pickRate: 9800, img: '/img/fredrin neo.jpg' },
    // Assassin
    { id: 40, name: 'Saber', role: 'Assassin', tier: 'A', winRate: 52.3, pickRate: 6800 },
    { id: 41, name: 'Fanny', role: 'Assassin', tier: 'S', winRate: 56.8, pickRate: 12400 },
    { id: 42, name: 'Layla', role: 'Assassin', tier: 'B', winRate: 46.5, pickRate: 1400 },
    { id: 43, name: 'Natalia', role: 'Assassin', tier: 'A', winRate: 51.9, pickRate: 6100 },
    { id: 44, name: 'Hayabusa', role: 'Assassin', tier: 'S', winRate: 52.1, pickRate: 8700 },
    { id: 45, name: 'Helcurt', role: 'Assassin', tier: 'A', winRate: 50.2, pickRate: 4600 },
    { id: 46, name: 'Lancelot', role: 'Assassin', tier: 'S', winRate: 53.5, pickRate: 9500 },
    { id: 47, name: 'Gusion', role: 'Assassin', tier: 'S', winRate: 52.8, pickRate: 9100 },
    { id: 48, name: 'Selena', role: 'Assassin', tier: 'A', winRate: 50.5, pickRate: 4700 },
    { id: 49, name: 'Hanzo', role: 'Assassin', tier: 'A', winRate: 51.3, pickRate: 5300 },
    { id: 50, name: 'Ling', role: 'Assassin', tier: 'S', winRate: 56.8, pickRate: 11200, img: '/img/ling neo.jpg' },
    { id: 51, name: 'Joy', role: 'Assassin', tier: 'S', winRate: 55.4, pickRate: 10800, img: '/img/home.jpg' },
    { id: 52, name: 'Aamon', role: 'Assassin', tier: 'A', winRate: 52.1, pickRate: 7600 },
    { id: 53, name: 'Nolan', role: 'Assassin', tier: 'A', winRate: 51.7, pickRate: 6400 },
    { id: 54, name: 'Yi Sun-shin', role: 'Assassin', tier: 'A', winRate: 50.8, pickRate: 5500 },
    // Mage
    { id: 55, name: 'Alice', role: 'Mage', tier: 'B', winRate: 48.2, pickRate: 3500 },
    { id: 56, name: 'Nana', role: 'Mage', tier: 'A', winRate: 52.4, pickRate: 7100 },
    { id: 57, name: 'Eudora', role: 'Mage', tier: 'A', winRate: 51.6, pickRate: 6200 },
    { id: 58, name: 'Gord', role: 'Mage', tier: 'B', winRate: 49.1, pickRate: 3800 },
    { id: 59, name: 'Kagura', role: 'Mage', tier: 'A', winRate: 52.9, pickRate: 7800 },
    { id: 60, name: 'Cyclops', role: 'Mage', tier: 'A', winRate: 51.4, pickRate: 5900 },
    { id: 61, name: 'Aurora', role: 'Mage', tier: 'A', winRate: 50.7, pickRate: 5100 },
    { id: 62, name: 'Vexana', role: 'Mage', tier: 'B', winRate: 48.5, pickRate: 3200 },
    { id: 63, name: 'Harley', role: 'Mage', tier: 'A', winRate: 51.2, pickRate: 5600 },
    { id: 64, name: 'Chang\'e', role: 'Mage', tier: 'A', winRate: 52.6, pickRate: 7300 },
    { id: 65, name: 'Lunox', role: 'Mage', tier: 'S', winRate: 54.8, pickRate: 10600 },
    { id: 66, name: 'Vale', role: 'Mage', tier: 'A', winRate: 50.3, pickRate: 4800 },
    { id: 67, name: 'Valir', role: 'Mage', tier: 'A', winRate: 51.8, pickRate: 6000 },
    { id: 68, name: 'Esmeralda', role: 'Mage', tier: 'A', winRate: 52.1, pickRate: 6400 },
    { id: 69, name: 'Cecilion', role: 'Mage', tier: 'A', winRate: 51.5, pickRate: 5700 },
    { id: 70, name: 'Luo Yi', role: 'Mage', tier: 'B', winRate: 48.9, pickRate: 3400 },
    { id: 71, name: 'Pharsa', role: 'Mage', tier: 'A', winRate: 51.5, pickRate: 8600, img: '/img/pharsa neo.jpg' },
    { id: 72, name: 'Valentina', role: 'Mage', tier: 'A', winRate: 50.9, pickRate: 5400 },
    { id: 73, name: 'Novaria', role: 'Mage', tier: 'A', winRate: 51.3, pickRate: 5800 },
    { id: 74, name: 'Zhuxin', role: 'Mage', tier: 'A', winRate: 52.1, pickRate: 6200 },
    { id: 75, name: 'Xavier', role: 'Mage', tier: 'S', winRate: 53.8, pickRate: 9200, img: '/img/home.jpg' },
    // Marksman
    { id: 76, name: 'Miya', role: 'Marksman', tier: 'B', winRate: 47.8, pickRate: 1800 },
    { id: 77, name: 'Bane', role: 'Marksman', tier: 'B', winRate: 48.1, pickRate: 2600 },
    { id: 78, name: 'Bruno', role: 'Marksman', tier: 'A', winRate: 51.7, pickRate: 6100 },
    { id: 79, name: 'Clint', role: 'Marksman', tier: 'B', winRate: 48.4, pickRate: 3100 },
    { id: 80, name: 'Rafaela', role: 'Marksman', tier: 'B', winRate: 47.2, pickRate: 1400 },
    { id: 81, name: 'Moskov', role: 'Marksman', tier: 'A', winRate: 51.4, pickRate: 5600 },
    { id: 82, name: 'Irithel', role: 'Marksman', tier: 'B', winRate: 49.3, pickRate: 3900 },
    { id: 83, name: 'Hanabi', role: 'Marksman', tier: 'B', winRate: 48.7, pickRate: 3400 },
    { id: 84, name: 'Kimmy', role: 'Marksman', tier: 'A', winRate: 51.9, pickRate: 6500 },
    { id: 85, name: 'Karrie', role: 'Marksman', tier: 'S', winRate: 55.1, pickRate: 11400 },
    { id: 86, name: 'Claude', role: 'Marksman', tier: 'A', winRate: 52.3, pickRate: 7200 },
    { id: 87, name: 'Granger', role: 'Marksman', tier: 'A', winRate: 51.8, pickRate: 6700 },
    { id: 88, name: 'Lesley', role: 'Marksman', tier: 'A', winRate: 50.6, pickRate: 5400 },
    { id: 89, name: 'Wanwan', role: 'Marksman', tier: 'S', winRate: 54.5, pickRate: 9900 },
    { id: 90, name: 'Brody', role: 'Marksman', tier: 'A', winRate: 52.8, pickRate: 10500, img: '/img/brody neo.jpg' },
    { id: 91, name: 'Beatrix', role: 'Marksman', tier: 'S', winRate: 55.6, pickRate: 12100 },
    { id: 92, name: 'Natan', role: 'Marksman', tier: 'S', winRate: 53.9, pickRate: 9600 },
    { id: 93, name: 'Melissa', role: 'Marksman', tier: 'A', winRate: 51.2, pickRate: 5800 },
    { id: 94, name: 'Ixia', role: 'Marksman', tier: 'A', winRate: 50.8, pickRate: 5200 },
    { id: 95, name: 'Cici', role: 'Marksman', tier: 'B', winRate: 49.1, pickRate: 4100 },
    // Support
    { id: 96, name: 'Estes', role: 'Support', tier: 'A', winRate: 52.1, pickRate: 6500 },
    { id: 97, name: 'Rafaela', role: 'Support', tier: 'B', winRate: 49.8, pickRate: 4200 },
    { id: 98, name: 'Diggie', role: 'Support', tier: 'B', winRate: 48.5, pickRate: 3600 },
    { id: 99, name: 'Angela', role: 'Support', tier: 'S', winRate: 54.3, pickRate: 10800 },
    { id: 100, name: 'Popol and Kupa', role: 'Support', tier: 'A', winRate: 51.6, pickRate: 6200 },
    { id: 101, name: 'Carmilla', role: 'Support', tier: 'A', winRate: 51.9, pickRate: 6400 },
    { id: 102, name: 'Edith', role: 'Support', tier: 'A', winRate: 52.4, pickRate: 6800 },
    // Additional heroes
    { id: 103, name: 'Yi Sun-shin', role: 'Marksman', tier: 'A', winRate: 51.3, pickRate: 5600 },
    { id: 104, name: 'Irithel', role: 'Marksman', tier: 'B', winRate: 49.1, pickRate: 3800 },
    { id: 105, name: 'Masha', role: 'Fighter', tier: 'B', winRate: 48.2, pickRate: 2600 },
    { id: 106, name: 'Baxia', role: 'Fighter', tier: 'B', winRate: 47.5, pickRate: 1800 },
    { id: 107, name: 'Aulus', role: 'Fighter', tier: 'B', winRate: 46.8, pickRate: 1400 },
    { id: 108, name: 'Yve', role: 'Mage', tier: 'B', winRate: 48.7, pickRate: 3400 },
    { id: 109, name: 'Gloo', role: 'Tank', tier: 'B', winRate: 48.1, pickRate: 2900 },
    { id: 110, name: 'Phoveus', role: 'Fighter', tier: 'A', winRate: 50.4, pickRate: 4900 },
    { id: 111, name: 'Mathilda', role: 'Assassin', tier: 'A', winRate: 51.8, pickRate: 6300 },
    { id: 112, name: 'Paquito', role: 'Fighter', tier: 'A', winRate: 52.1, pickRate: 6600 },
    { id: 113, name: 'Yin', role: 'Fighter', tier: 'A', winRate: 51.5, pickRate: 6000 },
    { id: 114, name: 'Silvanna', role: 'Fighter', tier: 'A', winRate: 51.9, pickRate: 6200 },
    { id: 115, name: 'Benedetta', role: 'Fighter', tier: 'A', winRate: 52.3, pickRate: 6700 },
    { id: 116, name: 'Yu Zhong', role: 'Fighter', tier: 'A', winRate: 50.7, pickRate: 5300 },
    { id: 117, name: 'Masha', role: 'Fighter', tier: 'B', winRate: 48.3, pickRate: 2800 },
    { id: 118, name: 'Lukas', role: 'Fighter', tier: 'B', winRate: 47.9, pickRate: 2200 },
    { id: 119, name: 'Chip', role: 'Marksman', tier: 'B', winRate: 48.2, pickRate: 2500 },
    { id: 120, name: 'Suyou', role: 'Assassin', tier: 'A', winRate: 51.4, pickRate: 5700 },
    { id: 121, name: 'Hirara', role: 'Assassin', tier: 'B', winRate: 49.5, pickRate: 4000 },
    { id: 122, name: 'Sora', role: 'Mage', tier: 'B', winRate: 48.9, pickRate: 3500 },
    { id: 123, name: 'Marcel', role: 'Tank', tier: 'B', winRate: 47.8, pickRate: 2000 },
    { id: 124, name: 'Odette', role: 'Mage', tier: 'B', winRate: 48.6, pickRate: 3200 },
    { id: 125, name: 'Roger', role: 'Fighter', tier: 'B', winRate: 48.1, pickRate: 2700 },
    { id: 126, name: 'Argus', role: 'Fighter', tier: 'B', winRate: 47.4, pickRate: 1500 },
    { id: 127, name: 'Belerick', role: 'Tank', tier: 'B', winRate: 48.9, pickRate: 3700 },
    { id: 128, name: 'Johnson', role: 'Tank', tier: 'A', winRate: 50.2, pickRate: 4500 },
    { id: 129, name: 'Lylia', role: 'Mage', tier: 'A', winRate: 51.7, pickRate: 6100 },
    { id: 130, name: 'Suyou', role: 'Fighter', tier: 'A', winRate: 51.1, pickRate: 5600 },
    { id: 131, name: 'Kadita', role: 'Mage', tier: 'A', winRate: 51.4, pickRate: 5900 },
    { id: 132, name: 'Faramis', role: 'Support', tier: 'B', winRate: 49.2, pickRate: 4100 },
  ];

  const roles = ['All', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];
  const tierColors: Record<string, string> = { S: C.yellow, A: C.primary, B: C.cyan, C: C.textDim };
  const tierBg: Record<string, string> = { S: `${C.yellow}15`, A: `${C.primary}15`, B: `${C.cyan}15`, C: 'transparent' };

  const filtered = allHeroes.filter(h =>
    (role === 'All' || h.role === role) &&
    (tier === 'All' || h.tier === tier) &&
    (!search || h.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={st.wrap}>
            <div style={st.container}>
        <section style={{ padding: '40px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Heroes ({allHeroes.length})</h1>
            <input
              type="text"
              placeholder="Search hero..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={st.search}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' as const }}>
              {roles.map(r => (
                <button key={r} onClick={() => setRole(r)} style={{ ...st.lbTabBtn, padding: '8px 14px', ...(role === r ? st.lbTabBtnAct : {}) }}>{r}</button>
              ))}
            </div>
            <select value={tier} onChange={e => setTier(e.target.value)} style={st.filter}>
              <option value="All">All Tiers</option>
              <option value="S">S Tier</option>
              <option value="A">A Tier</option>
              <option value="B">B Tier</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {filtered.map(h => (
              <div key={`${h.id}-${h.name}`} style={{ ...st.card, background: tierBg[h.tier], transition: 'transform 0.2s', cursor: 'pointer' }}>
                <div style={{ height: '120px', background: `linear-gradient(180deg, transparent 50%, ${C.bg2} 100%), url(${h.img || '/img/home.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center top', borderRadius: '14px 14px 0 0' }} />
                <div style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700 }}>{h.name}</span>
                    <span style={{ ...st.tBadge, color: tierColors[h.tier], background: `${tierColors[h.tier]}20`, fontSize: '10px', padding: '2px 8px' }}>{h.tier}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: C.textDim }}>
                    <span>{h.role}</span>
                    <span style={{ color: C.green }}>{h.winRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// ========== REGISTER ==========
function Register() {
  return (
    <div style={st.wrap}>
      <div style={st.auth}>
        <div style={st.authCard}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Create Account</h1>
          <p style={{ color: C.textDim, textAlign: 'center', marginBottom: '28px' }}>Join MLBB Mongolia today</p>
          <form onSubmit={e => { e.preventDefault(); alert('Account created!'); }}>
            <input type="text" placeholder="Username" style={st.input} />
            <input type="email" placeholder="Email" style={st.input} />
            <input type="password" placeholder="Password" style={st.input} />
            <input type="password" placeholder="Confirm Password" style={st.input} />
            <button type="submit" style={{ ...st.btn, ...st.btnP, width: '100%', justifyContent: 'center', padding: '14px' }}>
              Create Account
            </button>
          </form>
          <div style={st.divider} />
          <p style={{ textAlign: 'center', color: C.textDim, fontSize: '14px' }}>
            Already have an account? <Link to="/login" style={{ color: C.primary }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ========== PROFILE PAGE ==========
function Profile({ user: propUser }: { user?: any }) {
  const defaultUser = { username: 'DragonSlayer', mmr: 15680, rank: 1, wins: 1024, losses: 456, winRate: 69.2, matches: 1480, region: 'Mongolia', rankTier: 'CELESTIAL', ignot: 245000, hoursPlayed: 856 };
  const user = propUser || defaultUser;
  const [heroStats] = useState([
    { hero: 'Ling', games: 245, winRate: 62, kda: 4.8, img: '/img/ling neo.jpg' },
    { hero: 'Fredrinn', games: 189, winRate: 58, kda: 4.2, img: '/img/fredrin neo.jpg' },
    { hero: 'Brody', games: 156, winRate: 55, kda: 3.9, img: '/img/brody neo.jpg' },
    { hero: 'Pharsa', games: 134, winRate: 52, kda: 3.6, img: '/img/pharsa neo.jpg' },
  ]);

  return (
    <div style={st.wrap}>
            <div style={{
        height: '200px',
        background: `linear-gradient(180deg, rgba(15,15,35,0.3) 0%, ${C.bg} 100%), url(/img/home.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginBottom: '-60px'
      }} />
      <div style={st.container}>
        <section style={{ padding: '40px 0' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '20px', background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`, border: `4px solid ${C.bg}`, boxShadow: `0 4px 20px rgba(124,58,237,0.4)` }} />
            <div style={{ paddingBottom: '10px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>{user.username}</h1>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ color: tierColors[user.rankTier] || C.yellow, fontSize: '13px', fontWeight: 600 }}>{user.rankTier}</span>
                <span style={{ color: C.textDim, fontSize: '13px' }}>Rank #{user.rank} Global</span>
                <span style={{ color: C.textDim, fontSize: '13px' }}>{user.region}</span>
              </div>
            </div>
          </div>

          <div style={st.stats}>
            {[
              { v: user.mmr.toLocaleString(), l: 'MMR' },
              { v: user.winRate + '%', l: 'Win Rate' },
              { v: user.wins.toLocaleString(), l: 'Wins' },
              { v: user.losses.toLocaleString(), l: 'Losses' },
            ].map((x, i) => (
              <div key={i} style={st.stat}>
                <div style={st.statVal}>{x.v}</div>
                <div style={st.statLbl}>{x.l}</div>
              </div>
            ))}
          </div>

          <div style={st.card, { marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Hero Stats</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {heroStats.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', background: C.bg, borderRadius: '12px', alignItems: 'center' }}>
                  <img src={h.img} alt={h.hero} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '2px' }}>{h.hero}</div>
                    <div style={{ fontSize: '12px', color: C.textDim }}>{h.games} games - {h.winRate}% WR</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={st.card, { padding: '20px' }}>
            <div style={{ display: 'flex', gap: '32px', fontSize: '14px', color: C.textDim }}>
              <span>Total Ignot: {user.ignot.toLocaleString()}</span>
              <span>Hours Played: {user.hoursPlayed}</span>
              <span>Total Matches: {user.matches}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// ========== PLACEHOLDER ==========
function Placeholder({ t }: { t: string }) {
  return (
    <div style={st.wrap}>
            <div style={{ ...st.container, textAlign: 'center', padding: '80px 0' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>{t}</h1>
        <p style={{ color: C.textDim, marginBottom: '28px' }}>This feature is coming soon.</p>
        <Link to="/" style={{ ...st.btn, ...st.btnP }}>Back to Home</Link>
      </div>
    </div>
  );
}

// ========== APP ==========
export default function App() {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('mlbb_user');
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('mlbb_user', JSON.stringify(userData));
    navigate('/');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mlbb_user');
    navigate('/');
  };

  return (
    <BrowserRouter>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/duel" element={<Duel />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/tournaments/:id" element={<Placeholder t="Tournament Details" />} />
        <Route path="/tournaments/create" element={<Placeholder t="Create Tournament" />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/heroes" element={<Heroes />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/profile/:name" element={<Profile user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}