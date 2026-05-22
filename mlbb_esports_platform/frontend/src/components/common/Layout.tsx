import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Users,
  Swords,
  Calendar,
  Shield,
  User,
  Bell,
  Menu,
  X,
  Search
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore, useNotificationStore } from '../../store';

const navItems = [
  { path: '/', label: 'Нүүр', icon: Trophy },
  { path: '/leaderboard', label: 'Лидерборд', icon: Users },
  { path: '/matchmaking', label: 'Матчмайкинг', icon: Swords },
  { path: '/tournaments', label: 'Тэмцээнүүд', icon: Calendar },
  { path: '/clans', label: 'Кланууд', icon: Shield },
  { path: '/profile', label: 'Профайл', icon: User },
];

export function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-cyber-purple/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-purple to-cyber-blue flex items-center justify-center">
                <span className="text-xl">🎮</span>
              </div>
              <span className="font-orbitron font-bold text-lg hidden sm:block">
                <span className="text-cyber-purple">MLBB</span>
                <span className="text-cyber-cyan"> ESPORTS</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`relative px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    location.pathname === path
                      ? 'bg-cyber-purple/20 text-cyber-purple'
                      : 'hover:bg-white/5 text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{label}</span>
                  {location.pathname === path && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-purple"
                      style={{ borderRadius: '2px' }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Search size={20} className="text-gray-400" />
              </button>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Bell size={20} className="text-gray-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyber-red flex items-center justify-center text-xs font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* User Avatar */}
              {user ? (
                <Link to="/profile" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-pink flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold">{user.username[0]}</span>
                    )}
                  </div>
                </Link>
              ) : (
                <Link to="/login" className="cyber-button text-sm py-2 px-4">
                  🔐 Нэвтрэх
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-cyber-purple/20 py-4 px-4"
          >
            <nav className="flex flex-col gap-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                    location.pathname === path
                      ? 'bg-cyber-purple/20 text-cyber-purple'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-purple/20 py-8 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-purple to-cyber-blue flex items-center justify-center">
                <span className="text-sm">🎮</span>
              </div>
              <span className="font-orbitron font-semibold text-sm">
                <span className="text-cyber-purple">MLBB</span> ESPORTS
              </span>
            </div>
            <div className="text-gray-500 text-sm">
              © 2024 MLBB Esports Platform. Built for competitive excellence.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}