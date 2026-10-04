import React from 'react';
import { AlertTriangle, Bus, Clock, ArrowRight } from 'lucide-react';

interface Screen10AlternativeBusProps {
  onSelectAlternative?: (route: string) => void;
  onKeepOriginal?: () => void;
}

export const Screen10AlternativeBus: React.FC<Screen10AlternativeBusProps> = ({
  onSelectAlternative,
  onKeepOriginal
}) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-900 overflow-hidden justify-between p-4">
      
      <div className="space-y-4 overflow-y-auto scrollbar-none flex-1">
        
        {/* Warning Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 space-y-1.5 shadow-2xs">
          <div className="flex items-center space-x-2 text-amber-800 font-black text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Bus delayed by 20 min</span>
          </div>
          <p className="text-[11px] text-amber-900/80 font-medium leading-relaxed">
            Route 28 is delayed due to traffic near PM Palem. Here are other available buses:
          </p>
        </div>

        {/* Alternative 1: Route 45 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Bus className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">Route 45</p>
                <p className="text-[10px] text-blue-600 font-bold">City Ordinary</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              Recommended
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Arrives in <strong>8 min</strong></span>
            <span>•</span>
            <span>1.6 km away</span>
          </div>

          <button
            onClick={() => onSelectAlternative && onSelectAlternative('Route 45')}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition"
          >
            Board now
          </button>
        </div>

        {/* Alternative 2: Route 32 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Bus className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">Route 32</p>
                <p className="text-[10px] text-emerald-600 font-bold">Metro Express</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Arrives in <strong>12 min</strong></span>
            <span>•</span>
            <span>2.5 km away</span>
          </div>

          <button
            onClick={() => onSelectAlternative && onSelectAlternative('Route 32')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl border border-slate-200 transition"
          >
            View details
          </button>
        </div>

      </div>

      {/* Bottom Link to keep original */}
      <div className="pt-2 text-center shrink-0">
        <button
          onClick={onKeepOriginal}
          className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold underline transition"
        >
          Keep Route 28 (Delayed)
        </button>
      </div>

    </div>
  );
};
