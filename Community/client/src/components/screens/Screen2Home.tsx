import React, { useState } from 'react';
import { MapPin, ArrowUpDown, Search, Navigation, Bus, Ticket, Home, Briefcase, GraduationCap, Plus } from 'lucide-react';
import { MobileBottomNav } from './MobileBottomNav';

interface Screen2HomeProps {
  onFindBuses?: (from: string, to: string) => void;
  onOpenDestination?: () => void;
  onOpenNearby?: () => void;
  onOpenLive?: () => void;
  onNavigate?: (tab: 'HOME' | 'LIVE' | 'SAVED' | 'PROFILE') => void;
}

export const Screen2Home: React.FC<Screen2HomeProps> = ({
  onFindBuses,
  onOpenDestination,
  onOpenNearby,
  onOpenLive,
  onNavigate
}) => {
  const [from, setFrom] = useState('Madhurawada');
  const [to, setTo] = useState('RTC Complex');

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 text-slate-900 overflow-hidden">
      <div className="p-4 space-y-4 overflow-y-auto scrollbar-none flex-1">
        
        {/* User Greeting */}
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
            <span>Good Morning, Sneha</span>
            <span>👋</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Plan your journey</p>
        </div>

        {/* Journey Planner Form Card */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm space-y-3">
          
          <div className="flex items-center space-x-2.5">
            {/* Left stop dots */}
            <div className="flex flex-col items-center justify-between h-14 py-1 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="w-0.5 h-6 bg-slate-200"></span>
              <span className="w-2.5 h-2.5 rounded-full border-2 border-red-500 bg-white"></span>
            </div>

            {/* Inputs */}
            <div className="flex-1 space-y-2 text-xs">
              <div>
                <p className="text-[10px] font-semibold text-slate-400">From</p>
                <div
                  onClick={onOpenDestination}
                  className="font-bold text-slate-800 truncate cursor-pointer hover:text-blue-600"
                >
                  {from}
                </div>
              </div>
              <div className="border-t border-slate-100 pt-1.5">
                <p className="text-[10px] font-semibold text-slate-400">To</p>
                <div
                  onClick={onOpenDestination}
                  className="font-bold text-slate-800 truncate cursor-pointer hover:text-blue-600"
                >
                  {to}
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 transition"
              title="Swap From and To"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* Big Blue Button: Find Buses */}
          <button
            onClick={() => onFindBuses && onFindBuses(from, to)}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center space-x-1.5 transition"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find Buses</span>
          </button>

        </div>

        {/* 4 Quick Action Icons Grid */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div
            onClick={onOpenNearby}
            className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs hover:border-blue-400 cursor-pointer flex flex-col items-center space-y-1 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 leading-tight">Nearby Stops</span>
          </div>

          <div
            onClick={onOpenLive}
            className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs hover:border-blue-400 cursor-pointer flex flex-col items-center space-y-1 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 leading-tight">Live Tracking</span>
          </div>

          <div
            onClick={() => onFindBuses && onFindBuses(from, to)}
            className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs hover:border-blue-400 cursor-pointer flex flex-col items-center space-y-1 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bus className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 leading-tight">Bus Types</span>
          </div>

          <div
            onClick={() => onNavigate && onNavigate('SAVED')}
            className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs hover:border-blue-400 cursor-pointer flex flex-col items-center space-y-1 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 leading-tight">My Trips</span>
          </div>
        </div>

        {/* Quick Access List */}
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Quick Access</p>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            <button
              onClick={() => onFindBuses && onFindBuses('Madhurawada', 'Home')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center space-x-1.5 shadow-2xs shrink-0 hover:bg-slate-50 transition"
            >
              <Home className="w-3.5 h-3.5 text-blue-600" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onFindBuses && onFindBuses('Madhurawada', 'Work')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center space-x-1.5 shadow-2xs shrink-0 hover:bg-slate-50 transition"
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>Work</span>
            </button>

            <button
              onClick={() => onFindBuses && onFindBuses('Madhurawada', 'College')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center space-x-1.5 shadow-2xs shrink-0 hover:bg-slate-50 transition"
            >
              <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
              <span>College</span>
            </button>

            <button className="px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-500 flex items-center space-x-1 shrink-0 hover:bg-slate-200 transition">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav activeTab="HOME" onNavigate={onNavigate} />
    </div>
  );
};
