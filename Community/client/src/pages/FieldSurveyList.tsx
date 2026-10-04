import React, { useEffect, useState } from 'react';
import { FileText, Search, Calendar, User, Bus } from 'lucide-react';
import { fetchSurveys } from '../services/api';
import { Survey } from '../types';

export const FieldSurveyList: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchSurveys()
      .then(data => setSurveys(data))
      .catch(() => setSurveys([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <FileText className="w-6 h-6 text-amber-400" />
          <span>Field Survey Records Log</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Historical passenger count surveys submitted by field enumerators across APSRTC routes.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading survey log...</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Route</th>
                  <th className="p-3">Bus Type</th>
                  <th className="p-3">Direction</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Surveyor</th>
                  <th className="p-3 text-center">Records</th>
                  <th className="p-3 text-center">Total Passengers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {surveys.map((s, idx) => {
                  const totalPax = s.records?.reduce((sum, r) => sum + r.passengerCount, 0) || 0;
                  return (
                    <tr key={s.id || idx} className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-white">
                        <span className="px-2 py-0.5 bg-blue-600 rounded text-[10px] font-bold text-white mr-2">
                          Route {s.route?.routeNumber || '28'}
                        </span>
                        <span>{s.route?.name}</span>
                      </td>
                      <td className="p-3 font-semibold text-slate-300">{s.busType}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.direction === 'UP' ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                          {s.direction}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{s.surveyDate} ({s.surveyTime})</td>
                      <td className="p-3 font-medium text-slate-200">{s.surveyor?.name || 'Ramu Enumerator'}</td>
                      <td className="p-3 text-center font-semibold text-slate-300">{s.records?.length || 0}</td>
                      <td className="p-3 text-center font-bold text-emerald-400 text-sm">{totalPax}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
