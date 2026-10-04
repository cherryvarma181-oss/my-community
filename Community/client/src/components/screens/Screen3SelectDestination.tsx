import React, { useState } from 'react';
import { ArrowLeft, Search, MapPin, Clock, ChevronRight } from 'lucide-react';

interface Screen3SelectDestinationProps {
  onBack?: () => void;
  onSelectDestination?: (dest: string) => void;
}

export const Screen3SelectDestination: React.FC<Screen3SelectDestinationProps> = ({
  onBack,
  onSelectDestination
}) => {
  const [query, setQuery] = useState('');

  const popular = [
    { name: 'RTC Complex', dist: '1.8 km', area: 'Central Hub' },
    { name: 'Maddilapalem', dist: '3.2 km', area: 'NH16 Corridor' },
    { name: 'Gajuwaka', dist: '5.4 km', area: 'Industrial Belt' },
    { name: 'Dwaraka Nagar', dist: '4.1 km', area: 'Commercial Center' },
    { name: 'Beach Road', dist: '6.8 km', area: 'RK Beach Promenade' },
  ];

  const filtered = popular.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 p-3.5 flex items-center space-x-2.5 shrink-0">
        <button
          onClick={onBack}
          className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-extrabold text-slate-900">Where do you want to go?</h2>
      </div>

      <div className="p-3.5 space-y-4 overflow-y-auto scrollbar-none flex-1">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destination"
            autoFocus
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
          />
        </div>

        {/* Popular Destinations List */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Popular Destinations
          </p>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {filtered.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectDestination && onSelectDestination(item.name)}
                className="p-3 flex items-center justify-between hover:bg-blue-50/60 cursor-pointer transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{item.area}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold text-slate-500">{item.dist}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
