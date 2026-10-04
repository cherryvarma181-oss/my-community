import React from 'react';
import { Home, Navigation, Bookmark, User } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab?: 'HOME' | 'LIVE' | 'SAVED' | 'PROFILE';
  onNavigate?: (tab: 'HOME' | 'LIVE' | 'SAVED' | 'PROFILE') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab = 'HOME',
  onNavigate
}) => {
  return (
    <div className="bg-white/95 backdrop-blur border-t border-slate-200 px-4 py-2 flex items-center justify-between shrink-0 shadow-xs z-30">
      <button
        onClick={() => onNavigate && onNavigate('HOME')}
        className={`flex flex-col items-center space-y-0.5 text-[9.5px] font-bold transition ${
          activeTab === 'HOME' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>

      <button
        onClick={() => onNavigate && onNavigate('LIVE')}
        className={`flex flex-col items-center space-y-0.5 text-[9.5px] font-bold transition ${
          activeTab === 'LIVE' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Navigation className="w-4 h-4" />
        <span>Live Buses</span>
      </button>

      <button
        onClick={() => onNavigate && onNavigate('SAVED')}
        className={`flex flex-col items-center space-y-0.5 text-[9.5px] font-bold transition ${
          activeTab === 'SAVED' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Bookmark className="w-4 h-4" />
        <span>Saved</span>
      </button>

      <button
        onClick={() => onNavigate && onNavigate('PROFILE')}
        className={`flex flex-col items-center space-y-0.5 text-[9.5px] font-bold transition ${
          activeTab === 'PROFILE' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <User className="w-4 h-4" />
        <span>Profile</span>
      </button>
    </div>
  );
};
