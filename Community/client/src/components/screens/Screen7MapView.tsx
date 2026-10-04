import React from 'react';
import { ArrowLeft, Bus, Navigation, MapPin } from 'lucide-react';

interface Screen7MapViewProps {
  onBack?: () => void;
  onSelectApproachingAlert?: () => void;
}

export const Screen7MapView: React.FC<Screen7MapViewProps> = ({
  onBack,
  onSelectApproachingAlert
}) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-100 text-slate-900 overflow-hidden justify-between relative">
      
      {/* Top Header */}
      <div className="bg-white/95 backdrop-blur border-b border-slate-200 p-3.5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xs font-black text-slate-900">Route 28 – Live Tracking</h2>
            <p className="text-[10px] text-slate-400 font-medium">Madhurawada → RTC Complex</p>
          </div>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="bg-white/90 backdrop-blur border-b border-slate-200/80 px-3 py-1.5 flex items-center justify-between text-[9px] font-bold text-slate-600 shrink-0 z-20">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>Bus location</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full border-2 border-blue-600 bg-white"></span>
          <span>Your stop</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-blue-500"></span>
          <span>Route line</span>
        </span>
      </div>

      {/* Map Graphics Canvas */}
      <div className="flex-1 relative bg-slate-200 overflow-hidden flex items-center justify-center">
        {/* Subtle grid pattern for map */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Curved Route Polyline SVG */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 60 70 Q 120 120 90 200 T 180 320"
            fill="none"
            stroke="#2563EB"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>

        {/* Stop 1: Madhurawada */}
        <div className="absolute top-14 left-10 flex items-center space-x-1.5 z-10">
          <div className="w-3 h-3 rounded-full bg-white border-2 border-blue-600 shadow-xs"></div>
          <span className="text-[9px] font-extrabold text-slate-800 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs">
            Madhurawada
          </span>
        </div>

        {/* Stop 2: PM Palem + Live Bus Pin */}
        <div className="absolute top-[180px] left-[70px] z-20 flex flex-col items-center">
          {/* Animated Bus Icon Pin */}
          <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white text-white flex items-center justify-center shadow-lg animate-bounce">
            <Bus className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-black text-white bg-blue-700 px-2 py-0.5 rounded-full shadow-xs mt-1">
            PM Palem
          </span>
        </div>

        {/* Stop 3: Hanumanthawaka */}
        <div className="absolute top-[250px] left-[130px] flex items-center space-x-1.5 z-10">
          <div className="w-3 h-3 rounded-full bg-white border-2 border-slate-600 shadow-xs"></div>
          <span className="text-[9px] font-bold text-slate-700 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs">
            Hanumanthawaka
          </span>
        </div>

        {/* Stop 4: RTC Complex */}
        <div className="absolute top-[310px] left-[160px] flex items-center space-x-1.5 z-10">
          <div className="w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white shadow-xs"></div>
          <span className="text-[9px] font-black text-red-700 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs">
            RTC Complex
          </span>
        </div>
      </div>

      {/* Bottom Floating Next Bus Card */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0 z-20 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900">
                Next bus: <span className="text-emerald-600">5 min</span> (1.2 km)
              </p>
              <p className="text-[10px] text-slate-400 font-semibold">Bus No: AP 39 Z 3487</p>
            </div>
          </div>

          {onSelectApproachingAlert && (
            <button
              onClick={onSelectApproachingAlert}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-[10px] rounded-lg shadow-xs transition"
            >
              Simulate Alert
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
