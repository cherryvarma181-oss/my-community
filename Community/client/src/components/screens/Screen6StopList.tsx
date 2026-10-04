import React from 'react';
import { ArrowLeft, MapPin, CheckCircle, Navigation } from 'lucide-react';

interface Screen6StopListProps {
  onBack?: () => void;
  onOpenMap?: () => void;
}

export const Screen6StopList: React.FC<Screen6StopListProps> = ({
  onBack,
  onOpenMap
}) => {
  const stops = [
    { name: 'Madhurawada (Your Stop)', isUserStop: true, time: '8:15 AM' },
    { name: 'PM Palem', isUserStop: false, time: '8:21 AM' },
    { name: 'Hanumanthawaka', isUserStop: false, time: '8:28 AM' },
    { name: 'Maddilapalem', isUserStop: false, time: '8:35 AM' },
    { name: 'Gopalapatnam', isUserStop: false, time: '8:41 AM' },
    { name: 'RTC Complex (Destination)', isDestination: true, time: '8:48 AM' },
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
        <div>
          <h2 className="text-xs font-black text-slate-900">Route 28 – All Stops</h2>
          <p className="text-[10px] text-slate-400 font-medium">Complete Stop Sequence</p>
        </div>
      </div>

      {/* Corridor Summary Strip */}
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center justify-between text-[11px] font-bold text-blue-900 shrink-0">
        <span>6.3 km</span>
        <span>•</span>
        <span>28 min</span>
        <span>•</span>
        <span className="text-blue-700 font-extrabold">City Ordinary</span>
      </div>

      {/* Stop Sequence Timeline */}
      <div className="p-4 space-y-4 overflow-y-auto scrollbar-none flex-1">
        <div className="relative pl-6 space-y-5">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[11px] top-2 bottom-3 w-0.5 bg-slate-300"></div>

          {stops.map((stop, i) => (
            <div key={i} className="relative flex items-start justify-between">
              {/* Bullet Node */}
              <div
                className={`absolute -left-[19px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  stop.isUserStop
                    ? 'border-blue-600 bg-white ring-4 ring-blue-100'
                    : stop.isDestination
                    ? 'border-red-500 bg-red-500'
                    : 'border-slate-400 bg-white'
                }`}
              >
                {stop.isUserStop && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                {stop.isDestination && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
              </div>

              <div>
                <p className={`text-xs ${
                  stop.isUserStop
                    ? 'font-black text-blue-700'
                    : stop.isDestination
                    ? 'font-black text-slate-900'
                    : 'font-semibold text-slate-700'
                }`}>
                  {stop.name}
                </p>
                <p className="text-[10px] text-slate-400">Stop #{i + 1}</p>
              </div>

              <span className="text-[10px] font-mono font-bold text-slate-400">
                {stop.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-600 shrink-0">
        <span>Total stops: 12</span>
        <span className="text-slate-400">•</span>
        <span className="text-slate-700">Last bus: 9:10 PM</span>
      </div>

    </div>
  );
};
