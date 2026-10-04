import React, { useState } from 'react';
import { ArrowLeft, Search, MapPin, Bus, ChevronRight } from 'lucide-react';
import { MobileBottomNav } from './MobileBottomNav';

interface Screen8NearbyStopsProps {
  onBack?: () => void;
  onSelectStop?: (stopName: string) => void;
  onNavigate?: (tab: 'HOME' | 'LIVE' | 'SAVED' | 'PROFILE') => void;
}

export const Screen8NearbyStops: React.FC<Screen8NearbyStopsProps> = ({
  onBack,
  onSelectStop,
  onNavigate
}) => {
  const [query, setQuery] = useState('');

  const stops = [
    { name: 'Madhurawada', distance: '0.3 km', busesCount: 4, walkingTime: '4 min walk' },
    { name: 'PM Palem', distance: '1.2 km', busesCount: 3, walkingTime: '14 min walk' },
    { name: 'Hanumanthawaka', distance: '2.5 km', busesCount: 5, walkingTime: 'NH16 Junction' },
    { name: 'Maddilapalem', distance: '3.8 km', busesCount: 6, walkingTime: 'Bus Station' },
  ];

  const filtered = stops.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-900 overflow-hidden justify-between">
      
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 p-3.5 flex items-center space-x-2 shrink-0">
        <button
          onClick={onBack}
          className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-xs font-black text-slate-900">Nearby Bus Stops</h2>
      </div>

      <div className="p-3.5 space-y-3.5 overflow-y-auto scrollbar-none flex-1">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stop"
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
          />
        </div>

        {/* Stops List */}
        <div className="space-y-2">
          {filtered.map((stop, idx) => (
            <div
              key={idx}
              onClick={() => onSelectStop && onSelectStop(stop.name)}
              className="bg-white rounded-2xl p-3 border border-slate-200/90 hover:border-blue-400 shadow-2xs cursor-pointer flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{stop.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {stop.distance} • {stop.walkingTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-100">
                  {stop.busesCount} buses
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Nav */}
      <MobileBottomNav activeTab="HOME" onNavigate={onNavigate} />

    </div>
  );
};
