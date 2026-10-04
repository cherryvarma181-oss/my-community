import React, { useEffect, useState } from 'react';
import { BarChart3, Layers, Bus as BusIcon, ShieldAlert, CheckCircle2, TrendingUp, Users, ArrowUpRight, ArrowDownRight, MapPin, FileText, Activity } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, Legend } from 'recharts';
import { fetchRouteUtilisation, fetchStopAnalytics, fetchDemandCurve, fetchUnderServedAreas } from '../services/api';
import { RouteUtilisation, UnderServedArea } from '../types';

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveTab }) => {
  const [utilisations, setUtilisations] = useState<RouteUtilisation[]>([]);
  const [stopStats, setStopStats] = useState<any[]>([]);
  const [demandCurve, setDemandCurve] = useState<any[]>([]);
  const [underservedAreas, setUnderservedAreas] = useState<UnderServedArea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchRouteUtilisation(),
      fetchStopAnalytics(),
      fetchDemandCurve(),
      fetchUnderServedAreas()
    ])
      .then(([utilData, stopData, demandData, usaData]) => {
        setUtilisations(utilData);
        setStopStats(stopData.slice(0, 6)); // Top 6 stops
        setDemandCurve(demandData);
        setUnderservedAreas(usaData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalPassengers = utilisations.reduce((sum, u) => sum + u.totalPassengers, 0);
  const highDemandCount = utilisations.filter(u => u.demandCategory === 'HIGH').length;
  const lowDemandCount = utilisations.filter(u => u.demandCategory === 'LOW').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      
      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>APSRTC Transport Authority Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">City Mobility Intelligence Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time analytics for bus route utilisation, stop turnover, under-served area detection, and recommendations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('admin-underserved')}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 flex items-center space-x-1.5 transition"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Under-Served Areas ({underservedAreas.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('admin-recommendations')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>View Recommendations</span>
          </button>

          <button
            onClick={() => setActiveTab('admin-reports')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 rounded-xl flex items-center space-x-1.5 transition"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total City Routes</p>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{utilisations.length || 10}</p>
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>100% Operational Network</span>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Surveyed Pax</p>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{totalPassengers.toLocaleString() || '13,828'}</p>
          <p className="text-[11px] text-slate-400">Aggregated boarding logs</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">High Utilisation Routes</p>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-rose-400">{highDemandCount || 4}</p>
          <p className="text-[11px] text-rose-300 font-semibold">Over-capacity peak demand</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Under-Served Zones</p>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400">{underservedAreas.length || 4}</p>
          <p className="text-[11px] text-amber-300 font-semibold">Priority fleet intervention needed</p>
        </div>
      </div>

      {/* Charts Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Route Utilisation Scores */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Route Utilisation Score (%)</h3>
              <p className="text-xs text-slate-400">Demand / Carrying Capacity Ratio per Route</p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded">
              FORMULA BASED
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilisations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="routeNumber" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="utilisationScore" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Utilisation Score %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Hourly Demand Curve */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Hourly Passenger Demand Curve</h3>
              <p className="text-xs text-slate-400">Peak hour demand vs available carrying capacity</p>
            </div>
            <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-500/30 px-2.5 py-1 rounded">
              PEAK: 8 AM & 6 PM
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demandCurve}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="demand" stroke="#ef4444" fill="#ef4444" fillOpacity={0.25} name="Passenger Demand (pax/h)" />
                <Area type="monotone" dataKey="capacity" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Bus Capacity (pax/h)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Chart 3 & 4: Stop Boarding vs Alighting + Under-Served Area Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Stop Turnover (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Stop-wise Boarding vs Alighting Passengers</h3>
              <p className="text-xs text-slate-400">Top high-turnover bus stops in Visakhapatnam corridor</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stopStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Bar dataKey="boarding" fill="#3b82f6" name="Boarding Pax" radius={[4, 4, 0, 0]} />
                <Bar dataKey="alighting" fill="#10b981" name="Alighting Pax" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Under-served summary list (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>Under-Served Priority Zones</span>
              </h3>
              <button onClick={() => setActiveTab('admin-underserved')} className="text-xs text-rose-400 font-semibold hover:underline">
                View All →
              </button>
            </div>

            <div className="space-y-3">
              {underservedAreas.slice(0, 3).map((area) => (
                <div key={area.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{area.areaName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${area.demandLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {area.demandLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Unmet Demand: <strong className="text-rose-300">{area.unmetDemandPaxHr} pax/h</strong> | Bus Headway: {area.avgBusFrequencyMins}m
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('admin-recommendations')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-600/20"
          >
            Review Data-Driven Route Recommendations
          </button>
        </div>

      </div>

    </div>
  );
};
