import React from 'react';
import { Bookmark, Bell, Globe, HelpCircle, Settings, Info, ChevronRight, User } from 'lucide-react';
import { MobileBottomNav } from './MobileBottomNav';

interface Screen14ProfileSettingsProps {
  onOpenSaved?: () => void;
  onNavigate?: (tab: 'HOME' | 'LIVE' | 'SAVED' | 'PROFILE') => void;
}

export const Screen14ProfileSettings: React.FC<Screen14ProfileSettingsProps> = ({
  onOpenSaved,
  onNavigate
}) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-900 overflow-hidden justify-between">
      
      <div className="p-4 space-y-4 overflow-y-auto scrollbar-none flex-1">
        
        {/* User Profile Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-black text-base flex items-center justify-center shadow-md">
            DV
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 leading-tight">
              Durga Vaishnavi
            </h2>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              @durga.v
            </p>
            <span className="inline-block mt-1 text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
              Verified Commuter ✓
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden text-xs">
          <div
            onClick={onOpenSaved}
            className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition"
          >
            <div className="flex items-center space-x-3 text-slate-800 font-bold">
              <Bookmark className="w-4 h-4 text-blue-600" />
              <span>My Saved Routes</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition">
            <div className="flex items-center space-x-3 text-slate-800 font-bold">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Notifications</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition">
            <div className="flex items-center space-x-3 text-slate-800 font-bold">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Language</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold text-[11px]">
              <span className="text-blue-600 font-bold">English</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition">
            <div className="flex items-center space-x-3 text-slate-800 font-bold">
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <span>Help & Support</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition">
            <div className="flex items-center space-x-3 text-slate-800 font-bold">
              <Settings className="w-4 h-4 text-slate-600" />
              <span>Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition">
            <div className="flex items-center space-x-3 text-slate-800 font-bold">
              <Info className="w-4 h-4 text-blue-700" />
              <span>About APSRTC</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

      </div>

      {/* Bottom Nav */}
      <MobileBottomNav activeTab="PROFILE" onNavigate={onNavigate} />

    </div>
  );
};
