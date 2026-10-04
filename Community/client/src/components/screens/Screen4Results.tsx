import React, { useState } from 'react';
import { ArrowLeft, Clock, Bus, ChevronRight, SlidersHorizontal } from 'lucide-react';

interface Screen4ResultsProps {
  onBack?: () => void;
  onSelectBusCard?: (bus: any) => void;
}

export const Screen4Results: React.FC<Screen4ResultsProps> = ({
  onBack,
  onSelectBusCard
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ORDINARY' | 'METRO' | 'PALLE'>('ALL');

  const busesList = [
    {
      routeNumber: '28',
      type: 'City Ordinary',
      typeCode: 'ORDINARY',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      frequency: 'Every 8 min',
      eta: '5 min',
      distance: '1.2 km',
      busNo: 'AP 39 Z 3487',
      isNearest: true
    },
    {
      routeNumber: '32',
      type: 'Metro Express',
      typeCode: 'METRO',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      frequency: 'Every 15 min',
      eta: '12 min',
      distance: '3.5 km',
      busNo: 'AP 31 Z 3202'
    },
    {
      routeNumber: '45',
      type: 'City Ordinary',
      typeCode: 'ORDINARY',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      frequency: 'Every 22 min',
      eta: '18 min',
      distance: '4.7 km',
      busNo: 'AP 31 Z 4501'
    },
    {
      routeNumber: '77',
      type: 'Palle Velugu',
      typeCode: 'PALLE',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      frequency: 'Every 30 min',
      eta: '26 min',
      distance: '6.8 km',
      busNo: 'AP 31 Z 7701'
    },
    {
      routeNumber: '102',
      type: 'Metro Liner',
      typeCode: 'METRO',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      frequency: 'Every 40 min',
      eta: '34 min',
      distance: '8.6 km',
      busNo: 'AP 31 Z 1021'
    }
  ];

  const filtered = busesList.filter(b => {
    if (filter === 'ALL') return true;
    return b.typeCode === filter;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 p-3.5 space-y-1 shrink-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xs font-black text-slate-900 leading-tight">
              Madhurawada → RTC Complex
            </h2>
            <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>5 buses available now</span>
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-2 text-[10px] font-bold">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded-lg transition ${
              filter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('ORDINARY')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filter === 'ORDINARY' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            City Ordinary
          </button>
          <button
            onClick={() => setFilter('METRO')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filter === 'METRO' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Metro Express
          </button>
          <button
            onClick={() => setFilter('PALLE')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filter === 'PALLE' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Palle Velugu
          </button>
        </div>
      </div>

      {/* Bus Cards List */}
      <div className="p-3.5 space-y-2.5 overflow-y-auto scrollbar-none flex-1">
        {filtered.map((bus, idx) => (
          <div
            key={idx}
            onClick={() => onSelectBusCard && onSelectBusCard(bus)}
            className="bg-white rounded-2xl p-3 border border-slate-200/90 hover:border-blue-400 shadow-2xs cursor-pointer transition flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className={`px-2 py-0.5 rounded-md text-[9.5px] font-extrabold border ${bus.badgeColor}`}>
                {bus.type}
              </span>
              <p className="text-sm font-extrabold text-slate-900">
                Route {bus.routeNumber}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                {bus.frequency}
              </p>
            </div>

            <div className="text-right space-y-0.5">
              <p className="text-sm font-black text-emerald-600">
                {bus.eta}
              </p>
              <p className="text-[10px] font-semibold text-slate-400">
                {bus.distance}
              </p>
              <span className="inline-block text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                Track Live →
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
