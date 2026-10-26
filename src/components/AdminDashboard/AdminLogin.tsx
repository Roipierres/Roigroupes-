import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, ArrowRight, ArrowLeft } from 'lucide-react';
import { AdminCredentials } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: (admin: AdminCredentials) => void;
  onBackToPortal: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToPortal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFillDemoCredentials = () => {
    setEmail('admin@aetherops.io');
    setPassword('admin123');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success && data.admin) {
        onLoginSuccess(data.admin);
      } else {
        setError(data.error || 'Invalid admin credentials');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-950 text-white">
      <div className="w-full max-w-md space-y-6">
        
        {/* Back link */}
        <button
          onClick={onBackToPortal}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Return to Public Portal</span>
        </button>

        {/* Card */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck size={26} />
            </div>
            <h2 className="text-2xl font-bold">Admin Portal Login</h2>
            <p className="text-xs text-slate-400">
              Protected authentication required to manage apps, download counts, and subscriptions.
            </p>
          </div>

          {/* Demo Fill Helper Box */}
          <div className="p-3.5 rounded-2xl bg-blue-950/50 border border-blue-800/50 text-xs flex items-center justify-between">
            <div>
              <span className="text-cyan-300 font-bold block">Demo Superadmin Credentials</span>
              <span className="text-slate-400 font-mono text-[11px]">admin@roigroupes.io / admin123</span>
            </div>
            <button
              onClick={handleFillDemoCredentials}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] whitespace-nowrap"
            >
              Fill Demo
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Admin Email</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aetherops.io"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-500 transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight size={16} />
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};
