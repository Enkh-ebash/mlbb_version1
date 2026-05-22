import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Account created! Please sign in.');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-[#8888aa]">Join MLBB Mongolia today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f0f23] border border-[#2d2d44] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed]"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f0f23] border border-[#2d2d44] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f0f23] border border-[#2d2d44] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed]"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-[#8888aa] text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#7c3aed] hover:text-[#a855f7]">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}