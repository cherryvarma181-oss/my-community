import React from 'react';
import { ArrowLeft, AlertCircle, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Screen12DelaysSkippedProps {
  onBack?: () => void;
}

export const Screen12DelaysSkipped: React.FC<Screen12DelaysSkippedProps> = ({
  onBack
}) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-900 overflow-hidden justify-between p-4">
      
      {/* Top Header */}
      <div className="flex items-center space-x-2 pb-3 border-b border-slate-200 shrink-0">
        <button
          onClick={onBack}
          className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xs font-black text-slate-900">Route 32 – Metro Express</h2>
          <p className="text-[10px] text-slate-400 font-medium">Live Corridor Status</p>
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto scrollbar-none flex-1 pt-2">
        
        {/* Delay Notice Banner */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-center space-x-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 animate-pulse" />
          <div>
            <p className="text-xs font-black text-rose-900">Delayed by 12 min</p>
            <p className="text-[10px] text-rose-700 font-medium">Due to heavy traffic congestion at NH16</p>
          </div>
        </div>

        {/* Stops Status Timeline */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-4">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Stop Status & Detours
          </p>

          <div className="relative pl-6 space-y-4 text-xs font-medium">
            <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-slate-200"></div>

            {/* Stop 1: Passed */}
            <div className="relative flex items-center justify-between">
              <span className="absolute -left-[19px] w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></span>
              <span className="text-slate-400 line-through">Madhurawada</span>
              <span className="text-[10px] font-bold text-emerald-600">Passed ✓</span>
            </div>

            {/* Stop 2: Passed */}
            <div className="relative flex items-center justify-between">
              <span className="absolute -left-[19px] w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></span>
              <span className="text-slate-400 line-through">PM Palem</span>
              <span className="text-[10px] font-bold text-emerald-600">Passed ✓</span>
            </div>

            {/* Stop 3: SKIPPED (Red) */}
            <div className="relative flex items-center justify-between bg-rose-50 p-2 rounded-xl -ml-2 pl-6 border border-rose-200">
              <span className="absolute left-[7px] w-3 h-3 rounded-full bg-rose-600 ring-2 ring-rose-200"></span>
              <span className="font-extrabold text-rose-700 line-through">Hanumanthawaka</span>
              <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                Skipped ✗
              </span>
            </div>

            {/* Stop 4: Next */}
            <div className="relative flex items-center justify-between">
              <span className="absolute -left-[19px] w-3.5 h-3.5 rounded-full border-2 border-blue-600 bg-white ring-2 ring-blue-100"></span>
              <span className="font-black text-blue-700">Maddilapalem</span>
              <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                Next Stop (4m)
              </span>
            </div>

            {/* Stop 5: Upcoming */}
            <div className="relative flex items-center justify-between">
              <span className="absolute -left-[19px] w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              <span className="text-slate-600 font-semibold">Gopalapatnam</span>
              <span className="text-[10px] text-slate-400">11 min</span>
            </div>

            {/* Stop 6: Destination */}
            <div className="relative flex items-center justify-between">
              <span className="absolute -left-[19px] w-3 h-3 rounded-full bg-slate-800"></span>
              <span className="text-slate-900 font-bold">RTC Complex</span>
              <span className="text-[10px] text-slate-400">18 min</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Alert Banner */}
      <div className="p-3 bg-amber-50 border border-amber-300/80 rounded-xl text-amber-900 text-xs font-semibold flex items-center space-x-2 shrink-0 shadow-2xs">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="text-[11px] leading-tight">
          Next stop <strong>Hanumanthawaka</strong> skipped due to flyover construction.
        </span>
      </div>

    </div>
  );
};
