import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../services/api';
import { useAuthStore } from '../store';

export default function Login() {
  const { login } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    odyseeId: '',
    username: '',
    email: '',
    password: '',
    country: 'Mongolia',
    region: 'Southeast Asia'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await authApi.login(formData.email, formData.password);
        login(res.data.user, res.data.token);
      } else {
        const res = await authApi.register(formData);
        login(res.data.user, res.data.token);
      }
      window.location.href = '/';
    } catch (error) {
      alert(isLogin ? 'Invalid username or password' : 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-purple via-cyber-cyan to-cyber-pink">
            🎮 MLBB ESPORTS
          </h1>
          <p className="text-gray-400 mt-2">Professional Mobile Legends Player</p>
        </div>

        <div className="cyber-card p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? 'SIGN IN' : 'REGISTER'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Odysee ID</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="text"
                      value={formData.odyseeId}
                      onChange={(e) => setFormData({ ...formData, odyseeId: e.target.value })}
                      className="cyber-input pl-10"
                      placeholder="your_id"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="cyber-input pl-10"
                      placeholder="Player"
                      required
                    />
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="cyber-input pl-10"
                  placeholder="example@mail.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="cyber-input pl-10 pr-10"
                  placeholder="********"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full cyber-button flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  {isLogin ? 'SIGN IN' : 'REGISTER'}
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-cyber-purple hover:underline"
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}