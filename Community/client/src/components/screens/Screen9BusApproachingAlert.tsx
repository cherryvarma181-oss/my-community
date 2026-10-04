import React from 'react';
import { Bell, Navigation, X } from 'lucide-react';

interface Screen9BusApproachingAlertProps {
  onViewMap?: () => void;
  onDismiss?: () => void;
}

export const Screen9BusApproachingAlert: React.FC<Screen9BusApproachingAlertProps> = ({
  onViewMap,
  onDismiss
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between items-center text-center p-6 bg-slate-950 text-white relative overflow-hidden select-none">
      
      {/* Top Dismiss Button */}
      <div className="w-full flex justify-end pt-1">
        <button
          onClick={onDismiss}
          className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Alert Card Center */}
      <div className="my-auto space-y-5">
        
        {/* Glowing Bell Icon */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full bg-blue-600/30 border-2 border-blue-500/50 flex items-center justify-center animate-pulse">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Bell className="w-7 h-7 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-white tracking-tight">
            Your bus is approaching!
          </h2>
          <p className="text-sm font-bold text-blue-400">
            Route 28 – City Ordinary
          </p>
        </div>

        {/* ETA Highlight */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-1">
          <p className="text-2xl font-black text-emerald-400">
            ETA: 2 minutes
          </p>
          <p className="text-xs text-slate-400 font-medium">
            (at PM Palem Stop)
          </p>
        </div>

      </div>

      {/* Bottom Action Button */}
      <div className="w-full space-y-3 pb-2">
        <button
          onClick={onViewMap}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition"
        >
          <Navigation className="w-4 h-4" />
          <span>View on Map</span>
        </button>

        <p
          onClick={onDismiss}
          className="text-[11px] text-slate-500 hover:text-slate-300 font-medium cursor-pointer"
        >
          Swipe to dismiss
        </p>
      </div>

    </div>
  );
};
