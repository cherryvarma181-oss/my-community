import React from 'react';
import { ArrowLeft, Bookmark, Bus, ChevronRight, Star } from 'lucide-react';
import { MobileBottomNav } from './MobileBottomNav';

interface Screen13SavedRoutesProps {
  onBack?: () => void;
  onSelectRoute?: (route: string) => void;
  onNavigate?: (tab: 'HOME' | 'LIVE' | 'SAVED' | 'PROFILE') => void;
}

export const Screen13SavedRoutes: React.FC<Screen13SavedRoutesProps> = ({
  onBack,
  onSelectRoute,
  onNavigate
}) => {
  const savedList = [
    {
      corridor: 'Madhurawada → RTC Complex',
      types: 'City Ordinary / Metro',
      busesCount: '2 Buses',
      tagColor: 'text-blue-600 bg-blue-50'
    },
    {
      corridor: 'Gajuwaka → Dwaraka Nagar',
      types: 'Metro Express',
      busesCount: '3 Buses',
      tagColor: 'text-emerald-600 bg-emerald-50'
    },
    {
      corridor: 'Visakhapatnam → Gajuwaka',
      types: 'Palle Velugu',
      busesCount: '2 Buses',
      tagColor: 'text-amber-700 bg-amber-50'
    },
    {
      corridor: 'College Road → Beach Road',
      types: 'City Ordinary',
      busesCount: '1 Bus',
      tagColor: 'text-blue-600 bg-blue-50'
    }
  ];

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
        <h2 className="text-xs font-black text-slate-900">My Saved Routes</h2>
      </div>

      <div className="p-3.5 space-y-3 overflow-y-auto scrollbar-none flex-1">
        {savedList.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onSelectRoute && onSelectRoute(item.corridor)}
            className="bg-white rounded-2xl p-3.5 border border-slate-200/90 hover:border-blue-400 shadow-2xs cursor-pointer flex items-center justify-between transition"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Bookmark className="w-4 h-4 fill-blue-600" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-black text-slate-900">{item.corridor}</p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {item.types} • <strong className="text-slate-600">{item.busesCount}</strong>
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <MobileBottomNav activeTab="SAVED" onNavigate={onNavigate} />

    </div>
  );
};
