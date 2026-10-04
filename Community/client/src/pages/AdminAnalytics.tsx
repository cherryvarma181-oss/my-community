import React, { useEffect, useState } from 'react';
import { Layers, Info, Filter, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { fetchRouteUtilisation } from '../services/api';
import { RouteUtilisation } from '../types';

export const AdminAnalytics: React.FC = () => {
  const [utilisations, setUtilisations] = useState<RouteUtilisation[]>([]);
  const [loading, setLoading] = useState(true);

  // Configurable thresholds
  const [highThreshold, setHighThreshold] = useState(80);
  const [lowThreshold, setLowThreshold] = useState(45);

  useEffect(() => {
    fetchRouteUtilisation()
      .then(setUtilisations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <Layers className="w-6 h-6 text-blue-500" />
          <span>Route Utilisation Analysis</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Deterministic route carrying-capacity calculation based on empirical passenger boarding logs.
        </p>
      </div>

      {/* Formula Explanation Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Info className="w-4 h-4" />
          <span>Measurable Utilisation Formula & Thresholds</span>
        </div>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
          <p className="font-mono text-cyan-300 font-bold text-sm">
            Route Utilisation (%) = ( Total Passenger Demand / Available Carrying Capacity ) × 100
          </p>
          <p className="text-slate-400">
            Available Carrying Capacity = Bus Count × Estimated Daily Trips (6) × Bus Seat Capacity (55 pax).
          </p>
        </div>

        {/* Threshold Controls */}
        <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">High Demand Threshold:</span>
            <input
              type="number"
              value={highThreshold}
              onChange={(e) => setHighThreshold(Number(e.target.value))}
              className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-rose-400 font-bold text-center"
            />
            <span className="text-slate-400">%</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Low Demand Threshold:</span>
            <input
              type="number"
              value={lowThreshold}
              onChange={(e) => setLowThreshold(Number(e.target.value))}
              className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-emerald-400 font-bold text-center"
            />
            <span className="text-slate-400">%</span>
          </div>
        </div>
      </div>

      {/* Route Utilisation Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="font-bold text-white text-base">Route-by-Route Utilisation Matrix</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Route</th>
                <th className="p-3 text-center">Total Pax</th>
                <th className="p-3 text-center">Avg Pax/Trip</th>
                <th className="p-3 text-center">Peak Hour %</th>
                <th className="p-3">High Demand Segment</th>
                <th className="p-3">Low Demand Segment</th>
                <th className="p-3 text-center">Utilisation Score</th>
                <th className="p-3 text-center">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {utilisations.map((u) => {
                const category =
                  u.utilisationScore >= highThreshold ? 'HIGH' :
                  u.utilisationScore < lowThreshold ? 'LOW' : 'MEDIUM';

                const catColor =
                  category === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                  category === 'LOW' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                  'bg-amber-500/20 text-amber-400 border-amber-500/30';

                return (
                  <tr key={u.routeId} className="hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-white">
                      <span className="px-2 py-0.5 bg-blue-600 rounded text-[10px] text-white mr-2">
                        {u.routeNumber}
                      </span>
                      <span>{u.routeName}</span>
                    </td>
                    <td className="p-3 text-center font-bold text-white">{u.totalPassengers}</td>
                    <td className="p-3 text-center text-slate-300">{u.avgPassengersPerTrip}</td>
                    <td className="p-3 text-center font-bold text-cyan-400">{u.peakHourUtilisationPercent}%</td>
                    <td className="p-3 text-slate-300">{u.highDemandSections}</td>
                    <td className="p-3 text-slate-400">{u.lowDemandSections}</td>
                    <td className="p-3 text-center font-extrabold text-sm text-white">{u.utilisationScore}%</td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${catColor}`}>
                        {category} DEMAND
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
