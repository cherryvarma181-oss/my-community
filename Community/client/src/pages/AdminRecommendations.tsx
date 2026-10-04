import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Clock, TrendingUp, AlertTriangle, ShieldCheck, Check, X, Sparkles, RefreshCw, Layers, ArrowUpRight, Zap, Filter } from 'lucide-react';
import { fetchRecommendations, updateRecommendationStatus, generateRecommendationsApi } from '../services/api';
import { Recommendation } from '../types';

export const AdminRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const loadRecommendations = async () => {
    try {
      const data = await fetchRecommendations();
      setRecommendations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await generateRecommendationsApi();
      if (res && res.recommendations) {
        setRecommendations(res.recommendations);
        setSuccessBanner(`⚡ Successfully computed fresh recommendations! ${res.count} proposals evaluated.`);
        setTimeout(() => setSuccessBanner(null), 6000);
      }
    } catch (err) {
      alert('Failed to generate recommendations');
    } finally {
      setGenerating(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await updateRecommendationStatus(id, newStatus);
      setRecommendations(recommendations.map(r => r.id === id ? { ...r, status: newStatus, appliedAction: res.appliedAction } : r));

      if (newStatus === 'APPROVED' && res.appliedAction) {
        setSuccessBanner(`✅ ${res.appliedAction}`);
        setTimeout(() => setSuccessBanner(null), 7000);
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredRecommendations = recommendations.filter(r => {
    const statusMatch = statusFilter === 'ALL' || r.status === statusFilter;
    const typeMatch = typeFilter === 'ALL' || r.recommendationType === typeFilter;
    return statusMatch && typeMatch;
  });

  const pendingCount = recommendations.filter(r => r.status === 'PENDING').length;
  const approvedCount = recommendations.filter(r => r.status === 'APPROVED').length;
  const avgConfidence = recommendations.length > 0
    ? Math.round(recommendations.reduce((sum, r) => sum + r.confidencePercent, 0) / recommendations.length * 10) / 10
    : 91.2;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              <span>Route Recommendation Engine</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
              DATA-DRIVEN
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Evidence-based transport recommendations generated from passenger boarding survey & route utilisation analytics.
          </p>
        </div>

        {/* Action Button: Run Algorithm */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          <span>{generating ? 'Evaluating Survey Data...' : '⚡ Run Algorithmic Recommendation Engine'}</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-2xl text-xs font-semibold flex items-center space-x-2 shadow-xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Total Proposals</p>
          <p className="text-2xl font-extrabold text-white">{recommendations.length}</p>
          <p className="text-[11px] text-slate-500">Evaluated Corridors</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Pending Review</p>
          <p className="text-2xl font-extrabold text-amber-400">{pendingCount}</p>
          <p className="text-[11px] text-amber-300/80">Awaiting Authority Approval</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Approved & Deployed</p>
          <p className="text-2xl font-extrabold text-emerald-400">{approvedCount}</p>
          <p className="text-[11px] text-emerald-300/80">Active in Fleet Schedule</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Avg Confidence Score</p>
          <p className="text-2xl font-extrabold text-cyan-400">{avgConfidence}%</p>
          <p className="text-[11px] text-cyan-300/80">Empirical Accuracy Rating</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800 text-xs">
        {/* Status Filters */}
        <div className="flex items-center space-x-1">
          <span className="text-slate-400 font-semibold pr-2">Status:</span>
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                statusFilter === s
                  ? s === 'APPROVED' ? 'bg-emerald-600 text-white shadow'
                    : s === 'REJECTED' ? 'bg-rose-600 text-white shadow'
                    : s === 'PENDING' ? 'bg-amber-600 text-white shadow'
                    : 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-semibold">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="ALL">All Intervention Types</option>
            <option value="PEAK_HOUR_BUSES">Peak Hour Buses</option>
            <option value="INCREASE_FREQUENCY">Increase Frequency</option>
            <option value="FEEDER_ROUTE">Feeder Route</option>
            <option value="MODIFY_ALIGNMENT">Modify Alignment / Re-allocate</option>
          </select>
        </div>
      </div>

      {/* Recommendations Cards List */}
      {filteredRecommendations.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Sparkles className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Recommendations Match Filter</h3>
          <p className="text-xs text-slate-400">Click "Run Algorithmic Recommendation Engine" above to re-evaluate.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRecommendations.map((rec) => {
            const statusBg =
              rec.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
              rec.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
              'bg-amber-500/20 text-amber-400 border-amber-500/30';

            return (
              <div
                key={rec.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl relative transition"
              >
                {/* Top Line Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${statusBg}`}>
                      {rec.status === 'APPROVED' ? 'APPROVED & DEPLOYED' : rec.status}
                    </span>
                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                      {rec.recommendationType.replace(/_/g, ' ')}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      rec.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {rec.priority} PRIORITY
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span>Confidence Score: <strong className="text-emerald-400 font-bold text-sm">{rec.confidencePercent}%</strong></span>
                    <span>• {rec.dataDaysCount} Days Empirical Logs</span>
                  </div>
                </div>

                {/* Title & Target */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{rec.targetAreaOrRoute}</p>
                  <h3 className="text-xl font-extrabold text-white mt-1">{rec.title}</h3>
                </div>

                {/* Applied Fleet Action Notification */}
                {rec.appliedAction && (
                  <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-300 flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>{rec.appliedAction}</span>
                  </div>
                )}

                {/* Details & Expected Impact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <p className="font-bold text-slate-300 uppercase text-[10px] tracking-wider">Proposed Fleet Action Plan:</p>
                    <p className="text-slate-300 leading-relaxed">{rec.details}</p>
                  </div>

                  <div className="bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/20 space-y-1">
                    <p className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider">Expected Operational Impact:</p>
                    <p className="text-emerald-200/90 leading-relaxed">{rec.expectedImpact}</p>
                  </div>
                </div>

                {/* Underlying Data Reason */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 text-xs">
                  <p className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">Empirical Survey Evidence & Diagnosis:</p>
                  <p className="text-slate-300 italic font-serif">"{rec.reason}"</p>
                </div>

                {/* Admin Approval Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Status: <strong className="text-slate-300">{rec.status}</strong>
                  </span>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleStatusChange(rec.id, 'REJECTED')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center space-x-1.5 transition ${
                        rec.status === 'REJECTED'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-slate-950 text-rose-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(rec.id, 'APPROVED')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center space-x-1.5 transition ${
                        rec.status === 'APPROVED'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/30'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{rec.status === 'APPROVED' ? 'Approved & Deployed ✓' : 'Approve & Deploy to Fleet'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
