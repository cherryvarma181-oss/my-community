import React, { useState } from 'react';
import { Layers, ArrowRightLeft } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { RouteUtilisation } from '../types';

interface AdminRouteComparisonProps {
  utilisations: RouteUtilisation[];
}

export const AdminRouteComparison: React.FC<AdminRouteComparisonProps> = ({ utilisations }) => {
  const [selectedRouteIds, setSelectedRouteIds] = useState<string[]>(
    utilisations.slice(0, 3).map(u => u.routeId)
  );

  const comparedData = utilisations.filter(u => selectedRouteIds.includes(u.routeId));

  const toggleRouteSelect = (id: string) => {
    if (selectedRouteIds.includes(id)) {
      if (selectedRouteIds.length > 1) {
        setSelectedRouteIds(selectedRouteIds.filter(rId => rId !== id));
      }
    } else {
      if (selectedRouteIds.length < 4) {
        setSelectedRouteIds([...selectedRouteIds, id]);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <ArrowRightLeft className="w-6 h-6 text-cyan-400" />
          <span>Route Comparison Analysis</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Select two or more routes to compare passenger volume, occupancy %, peak utilisation, and demand/km.
        </p>
      </div>

      {/* Select Routes Checkboxes */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
        <h3 className="font-bold text-white text-sm">Select Routes to Compare (Max 4):</h3>
        <div className="flex flex-wrap gap-2">
          {utilisations.map(u => {
            const isSelected = selectedRouteIds.includes(u.routeId);
            return (
              <button
                key={u.routeId}
                onClick={() => toggleRouteSelect(u.routeId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <span>Route {u.routeNumber}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparative Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="font-bold text-white text-base">Utilisation Score & Peak Hour % Comparison</h3>
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="routeNumber" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="utilisationScore" fill="#3b82f6" name="Utilisation Score %" radius={[6, 6, 0, 0]} />
              <Bar dataKey="peakHourUtilisationPercent" fill="#ef4444" name="Peak Hour %" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Side-by-side Table Comparison */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="font-bold text-white text-base">Detailed Side-by-Side Comparison</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Metric</th>
                {comparedData.map(c => (
                  <th key={c.routeId} className="p-3 text-center">Route {c.routeNumber}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="p-3 font-bold text-white">Route Corridor</td>
                {comparedData.map(c => (
                  <td key={c.routeId} className="p-3 text-center text-slate-300 font-semibold">{c.routeName}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Total Surveyed Pax</td>
                {comparedData.map(c => (
                  <td key={c.routeId} className="p-3 text-center font-bold text-cyan-400">{c.totalPassengers}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Avg Pax / Trip</td>
                {comparedData.map(c => (
                  <td key={c.routeId} className="p-3 text-center text-slate-200">{c.avgPassengersPerTrip}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Peak Hour Utilisation %</td>
                {comparedData.map(c => (
                  <td key={c.routeId} className="p-3 text-center font-bold text-rose-400">{c.peakHourUtilisationPercent}%</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Pax Demand / km</td>
                {comparedData.map(c => (
                  <td key={c.routeId} className="p-3 text-center text-emerald-400 font-semibold">{c.passengerDemandPerKm}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">High-Demand Segment</td>
                {comparedData.map(c => (
                  <td key={c.routeId} className="p-3 text-center text-slate-300">{c.highDemandSections}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Demand Classification</td>
                {comparedData.map(c => (
                  <td key={c.routeId} className="p-3 text-center">
                    <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-700 font-bold text-slate-200">
                      {c.demandCategory}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
