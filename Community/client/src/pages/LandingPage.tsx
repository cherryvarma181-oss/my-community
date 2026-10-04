import React from 'react';
import { Bus, MapPin, BarChart3, ShieldAlert, ArrowRight, CheckCircle2, Navigation, Layers, Users, Zap, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab }) => {
  const { loginAsRole } = useAuth();

  const handleRoleStart = (role: 'PASSENGER' | 'FIELD_SURVEYOR' | 'TRANSPORT_ADMIN', tab: string) => {
    loginAsRole(role);
    setActiveTab(tab);
  };

  return (
    <div className="space-y-16 py-6">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide uppercase">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>Problem Statement PS050 Solution</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Smarter Bus Routes.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
              Better City Mobility.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Turn passenger boarding & alighting movement data into measurable evidence to detect under-served areas and optimize city public transport routes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleRoleStart('PASSENGER', 'bus-search')}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition"
            >
              <Bus className="w-4 h-4" />
              <span>Find a Bus</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => handleRoleStart('FIELD_SURVEYOR', 'field-survey')}
              className="px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow-lg shadow-amber-600/30 flex items-center space-x-2 transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Field Surveyor Portal</span>
            </button>

            <button
              onClick={() => handleRoleStart('TRANSPORT_ADMIN', 'admin-dashboard')}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-700 flex items-center space-x-2 transition"
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Transport Authority Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live System KPI Quick Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">10</p>
            <p className="text-xs text-slate-400">APSRTC City Routes</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">30 Active</p>
            <p className="text-xs text-slate-400">Tracked City Buses</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">13,800+</p>
            <p className="text-xs text-slate-400">Surveyed Passengers</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">4 Areas</p>
            <p className="text-xs text-slate-400">Detected Under-Served</p>
          </div>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How APSMART Intelligence Works</h2>
          <p className="text-sm text-slate-400">A data-driven evidence pipeline designed specifically for transport planners.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative space-y-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center">1</div>
            <h3 className="font-bold text-white text-base">Collect</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Field surveyors collect fast boarding/alighting counts with GPS location across bus stops and peak hours.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative space-y-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white font-bold text-sm flex items-center justify-center">2</div>
            <h3 className="font-bold text-white text-base">Analyze</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculate deterministic route utilisation scores: <br/>
              <code className="text-[10px] text-cyan-300">Demand / Available Capacity × 100</code>
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative space-y-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white font-bold text-sm flex items-center justify-center">3</div>
            <h3 className="font-bold text-white text-base">Map & Detect</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identify under-served areas based on measurable factors (unmet peak demand, long stop walking distance, low headways).
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">4</div>
            <h3 className="font-bold text-white text-base">Recommend</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate data-driven route changes (peak-hour buses, feeder routes, alignment modifications) with clear confidence scores.
            </p>
          </div>
        </div>
      </div>

      {/* Role Selection Quick Launch Cards */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h3 className="text-xl font-bold text-white text-center">Select Portal & Role</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Passenger Portal */}
            <div
              onClick={() => handleRoleStart('PASSENGER', 'passenger-home')}
              className="bg-slate-950 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl cursor-pointer transition group space-y-4 shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                <Bus className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Passenger Portal</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Search buses from A → B, view live tracking, check nearby stops, and receive alternative bus suggestions.
                </p>
              </div>
              <div className="pt-2 text-xs font-semibold text-blue-400 flex items-center space-x-1 group-hover:translate-x-1 transition">
                <span>Launch Passenger Mode</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Field Surveyor Portal */}
            <div
              onClick={() => handleRoleStart('FIELD_SURVEYOR', 'field-survey')}
              className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl cursor-pointer transition group space-y-4 shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Field Surveyor Portal</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Mobile-friendly fast entry for field enumerators to record boarding stop, alighting stop, and passenger counts.
                </p>
              </div>
              <div className="pt-2 text-xs font-semibold text-amber-400 flex items-center space-x-1 group-hover:translate-x-1 transition">
                <span>Launch Field Survey Mode</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Admin Dashboard */}
            <div
              onClick={() => handleRoleStart('TRANSPORT_ADMIN', 'admin-dashboard')}
              className="bg-slate-950 border border-slate-800 hover:border-cyan-500/50 p-6 rounded-2xl cursor-pointer transition group space-y-4 shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Transport Authority Dashboard</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Comprehensive dashboard for transport authority admins: utilization heatmaps, under-served area detection, and recommendations.
                </p>
              </div>
              <div className="pt-2 text-xs font-semibold text-cyan-400 flex items-center space-x-1 group-hover:translate-x-1 transition">
                <span>Launch Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
