import React from 'react';
import { Bus, Smartphone, LayoutGrid, BarChart3 } from 'lucide-react';
import { ApsrtcLogo } from './ApsrtcLogo';

interface PosterHeaderProps {
  viewMode: 'POSTER' | 'INTERACTIVE' | 'ADMIN';
  setViewMode: (mode: 'POSTER' | 'INTERACTIVE' | 'ADMIN') => void;
  activeScreenIndex?: number;
  onSelectScreen?: (index: number) => void;
}

export const PosterHeader: React.FC<PosterHeaderProps> = ({
  viewMode,
  setViewMode,
  activeScreenIndex = 2,
  onSelectScreen
}) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      {/* Top Banner Row */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-3.5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        
        {/* Left: APSRTC Brand & Tagline */}
        <div className="flex items-center space-x-3.5">
          <ApsrtcLogo size={52} className="shrink-0 drop-shadow-sm" />
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-blue-900 tracking-tight leading-none">
                APSRTC
              </h1>
              <span className="text-sm sm:text-base font-extrabold text-blue-700 tracking-tight">
                Your Journey. Our Service.
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Live bus tracking • All Ordinary, Metro, Palle Velugu & more • <span className="font-semibold text-slate-700">Plan. Track. Reach.</span>
            </p>
          </div>
        </div>

        {/* Center: Everyday travel notice */}
        <div className="hidden lg:flex items-center bg-blue-50/80 border border-blue-200/80 rounded-2xl px-4 py-2 space-x-3">
          <div className="text-right">
            <p className="text-xs font-bold text-blue-950 leading-tight">For everyday travel.</p>
            <p className="text-xs font-extrabold text-blue-700 leading-tight">No booking. Just board.</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Bus className="w-5 h-5" />
          </div>
        </div>

        {/* Right: Bus Type Legend & View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Color Tags */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-[11px] font-bold">
            <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              City Ordinary
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Metro Express
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              Metro Liner
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              Palle Velugu
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-300 flex items-center space-x-1">
            <button
              onClick={() => setViewMode('POSTER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                viewMode === 'POSTER'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Poster (All 14 Screens)</span>
            </button>

            <button
              onClick={() => setViewMode('INTERACTIVE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                viewMode === 'INTERACTIVE'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Interactive Phone App</span>
            </button>

            <button
              onClick={() => setViewMode('ADMIN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                viewMode === 'ADMIN'
                  ? 'bg-indigo-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Authority Analytics</span>
            </button>
          </div>

        </div>

      </div>

      {/* Screen Quick Jump Strip (only when in POSTER view) */}
      {viewMode === 'POSTER' && onSelectScreen && (
        <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-2 overflow-x-auto scrollbar-none">
          <div className="max-w-[1700px] mx-auto flex items-center space-x-1.5 text-xs whitespace-nowrap">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider pr-2">Jump to Screen:</span>
            {[
              '1. Splash',
              '2. Home',
              '3. Destination',
              '4. Results',
              '5. Bus Details',
              '6. Stop List',
              '7. Map Live',
              '8. Nearby Stops',
              '9. Approaching Alert',
              '10. Alternative Bus',
              '11. Leave Home',
              '12. Delays / Skipped',
              '13. Saved Routes',
              '14. Profile'
            ].map((title, i) => (
              <button
                key={i}
                onClick={() => onSelectScreen(i + 1)}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 font-semibold text-[11px] shadow-2xs hover:bg-blue-50 hover:text-blue-700 transition"
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
