import React from 'react';
import { ArrowLeft, Bus, Navigation, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

interface Screen5BusDetailsProps {
  onBack?: () => void;
  onViewFullRoute?: () => void;
  onOpenMap?: () => void;
}

export const Screen5BusDetails: React.FC<Screen5BusDetailsProps> = ({
  onBack,
  onViewFullRoute,
  onOpenMap
}) => {
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
        <div>
          <h2 className="text-xs font-black text-slate-900">Route 28 – City Ordinary</h2>
          <p className="text-[10px] text-slate-400 font-medium">Madhurawada → RTC Complex</p>
        </div>
      </div>

      <div className="p-3.5 space-y-3.5 overflow-y-auto scrollbar-none flex-1">
        
        {/* Status Pill Card */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center space-x-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Currently in service • Bus No: AP 39 Z 3487</span>
          </div>

          {/* Big ETA Callout */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-3 text-white text-center shadow-sm">
            <p className="text-[11px] font-medium text-blue-100">Arriving at your stop in</p>
            <p className="text-2xl font-black tracking-tight mt-0.5">5 min</p>
            <p className="text-[10px] text-blue-200 font-semibold">(1.2 km away)</p>
          </div>
        </div>

        {/* Live Route Graphic Card */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
            <span>Live Route Position</span>
            <button
              onClick={onOpenMap}
              className="text-blue-600 hover:underline flex items-center space-x-1 text-[10px]"
            >
              <Navigation className="w-3 h-3" />
              <span>Live Location</span>
            </button>
          </div>

          {/* Mini Stop Progress Line */}
          <div className="relative py-4 px-2">
            <div className="h-1.5 bg-slate-200 rounded-full w-full relative">
              <div className="h-1.5 bg-blue-600 rounded-full w-2/5"></div>
              
              {/* Bus Pin moving on line */}
              <div className="absolute left-[40%] -top-3 -translate-x-1/2 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md animate-bounce">
                  <Bus className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <div className="flex justify-between text-[9px] font-bold text-slate-500 mt-3">
              <span>Madhurawada</span>
              <span className="text-blue-700 font-extrabold">PM Palem</span>
              <span>RTC Complex</span>
            </div>
          </div>

          {/* Next Stop Box */}
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <p className="text-[10px] font-semibold text-slate-400">Next stop:</p>
              <p className="font-extrabold text-slate-900">PM Palem (2 min)</p>
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-md">
              Approaching
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Button */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <button
          onClick={onViewFullRoute}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center space-x-1.5 transition"
        >
          <span>View Full Route</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
