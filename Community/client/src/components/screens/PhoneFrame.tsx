import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  screenNumber?: number;
  screenTitle?: string;
  isDarkTheme?: boolean;
  className?: string;
  onClickHeader?: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  screenNumber,
  screenTitle,
  isDarkTheme = false,
  className = '',
  onClickHeader
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Optional Screen Title Label above device */}
      {screenNumber !== undefined && (
        <div
          onClick={onClickHeader}
          className={`text-xs font-black tracking-tight mb-2.5 text-center flex items-center justify-center space-x-1.5 ${
            onClickHeader ? 'cursor-pointer hover:text-blue-600 transition' : ''
          }`}
        >
          <span className="text-slate-800 font-extrabold">{screenNumber}.</span>
          <span className="text-blue-950 font-bold">{screenTitle}</span>
        </div>
      )}

      {/* Phone Hardware Shell */}
      <div className="relative w-[280px] sm:w-[300px] h-[610px] rounded-[42px] p-3 bg-slate-900 border-[3.5px] border-slate-700 shadow-2xl shadow-slate-400/20 shrink-0 select-none overflow-hidden flex flex-col justify-between">
        
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-40 flex items-center justify-end pr-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
        </div>

        {/* Screen Display Glass */}
        <div className={`relative w-full h-full rounded-[32px] overflow-hidden flex flex-col ${
          isDarkTheme ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
        }`}>
          
          {/* Status Bar (9:41) */}
          <div className={`h-8 pt-1 px-5 flex items-center justify-between text-[11px] font-bold shrink-0 z-30 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            <span className="font-semibold tracking-tight">9:41</span>
            <div className="flex items-center space-x-1.5 opacity-90">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Screen Inner Scroll Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none flex flex-col relative">
            {children}
          </div>

          {/* Home Bar Pill */}
          <div className="h-4 flex items-center justify-center shrink-0 z-30 pb-1">
            <div className={`w-28 h-1 rounded-full ${isDarkTheme ? 'bg-slate-600' : 'bg-slate-400'}`}></div>
          </div>

        </div>

      </div>
    </div>
  );
};
