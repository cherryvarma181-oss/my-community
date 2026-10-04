import React, { useState } from 'react';
import { Bus, Lock, Mail, ArrowRight, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface LoginPageProps {
  setActiveTab: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setActiveTab }) => {
  const { login, loginAsRole } = useAuth();
  const [email, setEmail] = useState('admin@apsmart.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      if (email.includes('admin')) setActiveTab('admin-dashboard');
      else if (email.includes('surveyor')) setActiveTab('field-survey');
      else setActiveTab('passenger-home');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleQuickDemo = (role: UserRole, tab: string) => {
    loginAsRole(role);
    setActiveTab(tab);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-600/30">
          <Bus className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Sign In to APSMART</h1>
        <p className="text-xs text-slate-400">APSRTC Bus Route Intelligence & Mobility Portal</p>
      </div>

      {/* Demo Credentials Quick Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider text-center">Quick Demo Role Login</p>
        
        <div className="space-y-2">
          <button
            onClick={() => handleQuickDemo('PASSENGER', 'passenger-home')}
            className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-white flex items-center justify-between transition"
          >
            <span>🚌 Login as Passenger</span>
            <span className="text-[10px] text-blue-400 font-mono">passenger@apsmart.com</span>
          </button>

          <button
            onClick={() => handleQuickDemo('FIELD_SURVEYOR', 'field-survey')}
            className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-white flex items-center justify-between transition"
          >
            <span>📋 Login as Field Surveyor</span>
            <span className="text-[10px] text-amber-400 font-mono">surveyor@apsmart.com</span>
          </button>

          <button
            onClick={() => handleQuickDemo('TRANSPORT_ADMIN', 'admin-dashboard')}
            className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-white flex items-center justify-between transition"
          >
            <span>📊 Login as Transport Admin</span>
            <span className="text-[10px] text-cyan-400 font-mono">admin@apsmart.com</span>
          </button>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        {error && <p className="text-xs text-rose-400 font-semibold text-center">{error}</p>}

        <div className="space-y-1 text-xs">
          <label className="font-semibold text-slate-300">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <label className="font-semibold text-slate-300">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-1.5"
        >
          <span>Sign In</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
