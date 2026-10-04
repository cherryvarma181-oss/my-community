import React from 'react';
import { ArrowLeft, Clock, MapPin, Footprints, Bus, Bell } from 'lucide-react';

interface Screen11LeaveHomeProps {
  onBack?: () => void;
  onSetReminder?: () => void;
  onViewMap?: () => void;
}

export const Screen11LeaveHome: React.FC<Screen11LeaveHomeProps> = ({
  onBack,
  onSetReminder,
  onViewMap
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
          <h2 className="text-xs font-black text-slate-900">Plan Your Journey</h2>
          <p className="text-[10px] text-slate-400 font-medium">Madhurawada → RTC Complex</p>
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto scrollbar-none flex-1 pt-2">
        
        {/* Step 1: Walking to stop */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-900">Your location (Home)</p>
            <p className="text-[11px] text-slate-500 font-medium">Walk to stop: <strong className="text-blue-700">7 min (450 m)</strong></p>
          </div>
        </div>

        {/* Step 2: Bus Arrival */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-900">Bus arrives: 6:20 PM</p>
            <p className="text-[11px] text-slate-500 font-medium">Route 28 – City Ordinary</p>
          </div>
        </div>

        {/* Highlight Recommendation Card */}
        <div className="bg-gradient-to-tr from-blue-700 to-indigo-600 rounded-2xl p-4 text-white shadow-md space-y-1.5 text-center">
          <Clock className="w-6 h-6 text-blue-200 mx-auto" />
          <p className="text-xs font-medium text-blue-100 uppercase tracking-wider">Recommended Departure</p>
          <p className="text-xl font-black tracking-tight">
            Leave by 6:08 PM
          </p>
          <p className="text-[11px] text-blue-200 font-medium">
            to catch your bus comfortably on time
          </p>
        </div>

      </div>

      {/* Bottom Buttons */}
      <div className="space-y-2 pt-2 shrink-0">
        <button
          onClick={onSetReminder}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center space-x-1.5 transition"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Set Reminder</span>
        </button>

        <button
          onClick={onViewMap}
          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition"
        >
          View Map
        </button>
      </div>

    </div>
  );
};
