import React, { useEffect, useState } from 'react';
import { ShieldAlert, MapPin, Clock, AlertTriangle, ArrowRight, CheckCircle2, Sliders, RefreshCw, Plus, Sparkles, Zap, Building } from 'lucide-react';
import { fetchUnderServedAreas, recalculateUnderservedAreas, createFeederRecommendationApi, reportTransitGap } from '../services/api';
import { UnderServedArea } from '../types';

interface AdminUnderservedProps {
  setActiveTab: (tab: string) => void;
}

export const AdminUnderserved: React.FC<AdminUnderservedProps> = ({ setActiveTab }) => {
  const [areas, setAreas] = useState<UnderServedArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  // Threshold States
  const [distanceThresholdKm, setDistanceThresholdKm] = useState<number>(1.2);
  const [frequencyThresholdMins, setFrequencyThresholdMins] = useState<number>(20);
  const [peakUnmetThresholdPaxHr, setPeakUnmetThresholdPaxHr] = useState<number>(50);

  // Success / Action feedback
  const [notification, setNotification] = useState<string | null>(null);

  // New Area Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [newDistance, setNewDistance] = useState(1.8);
  const [newHeadway, setNewHeadway] = useState(30);
  const [newUnmetDemand, setNewUnmetDemand] = useState(160);
  const [newReason, setNewReason] = useState('');

  const loadAreas = async (dist = distanceThresholdKm, freq = frequencyThresholdMins, unmet = peakUnmetThresholdPaxHr) => {
    setRecalculating(true);
    try {
      const data = await recalculateUnderservedAreas({
        distanceThresholdKm: dist,
        frequencyThresholdMins: freq,
        peakUnmetThresholdPaxHr: unmet
      });
      setAreas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRecalculating(false);
    }
  };

  useEffect(() => {
    loadAreas();
  }, []);

  const handleSliderChange = (dist: number, freq: number, unmet: number) => {
    setDistanceThresholdKm(dist);
    setFrequencyThresholdMins(freq);
    setPeakUnmetThresholdPaxHr(unmet);
    loadAreas(dist, freq, unmet);
  };

  const handleCreateFeeder = async (area: UnderServedArea) => {
    try {
      const res = await createFeederRecommendationApi(area.id);
      setNotification(`✅ Feeder route proposal generated for ${area.areaName}! Added to Recommendation queue.`);
      setTimeout(() => setNotification(null), 6000);
    } catch (err) {
      alert('Failed to generate feeder route');
    }
  };

  const handleAddAreaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName) return;

    try {
      await reportTransitGap({
        areaName: newAreaName,
        distanceToStopKm: Number(newDistance),
        avgBusFrequencyMins: Number(newHeadway),
        peakDemandPaxHr: Number(newUnmetDemand),
        classificationReason: newReason || 'Surveyor reported newly constructed urban settlement with no scheduled public transit service.'
      });

      setShowAddModal(false);
      setNewAreaName('');
      setNewReason('');
      setNotification(`✅ New transit desert zone "${newAreaName}" recorded and analyzed!`);
      loadAreas();
      setTimeout(() => setNotification(null), 6000);
    } catch (err) {
      alert('Failed to log transit desert');
    }
  };

  const criticalCount = areas.filter(a => a.demandLevel === 'CRITICAL').length;
  const highCount = areas.filter(a => a.demandLevel === 'HIGH').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
              <ShieldAlert className="w-6 h-6 text-rose-500" />
              <span>Under-Served Area Detection & Analysis</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono font-bold">
              SPATIAL DEFICIT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multi-criteria spatial & capacity gap identification across Visakhapatnam Smart City transport zones.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 rounded-xl flex items-center space-x-1.5 transition"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Log Transit Desert</span>
          </button>

          <button
            onClick={() => setActiveTab('admin-recommendations')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>View Recommendations →</span>
          </button>
        </div>
      </div>

      {/* Notification Toast Banner */}
      {notification && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-2xl text-xs font-semibold flex items-center space-x-2 shadow-xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Interactive Detection Threshold Sliders Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-white text-sm">Interactive Deficit Parameter Controls</h3>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-400">
              Active Flags: <strong className="text-rose-400">{criticalCount} Critical</strong>, <strong className="text-amber-400">{highCount} High</strong>
            </span>
            <button
              onClick={() => handleSliderChange(1.2, 20, 50)}
              className="text-slate-400 hover:text-white underline text-[11px]"
            >
              Reset to Standard Defaults
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          {/* Slider 1: Distance Gap */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Min Walk to Stop (km)</span>
              </span>
              <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                &gt; {distanceThresholdKm} km
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={distanceThresholdKm}
              onChange={(e) => handleSliderChange(Number(e.target.value), frequencyThresholdMins, peakUnmetThresholdPaxHr)}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.5 km (Walkable)</span>
              <span>3.0 km (Severe Gap)</span>
            </div>
          </div>

          {/* Slider 2: Bus Headway */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Min Headway / Wait (min)</span>
              </span>
              <span className="font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                &gt; {frequencyThresholdMins} min
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="5"
              value={frequencyThresholdMins}
              onChange={(e) => handleSliderChange(distanceThresholdKm, Number(e.target.value), peakUnmetThresholdPaxHr)}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>10 min (Frequent)</span>
              <span>45 min (Sparse)</span>
            </div>
          </div>

          {/* Slider 3: Unmet Peak Demand */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-rose-400" />
                <span>Min Unmet Demand (pax/h)</span>
              </span>
              <span className="font-mono font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                &gt; {peakUnmetThresholdPaxHr} pax/h
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="220"
              step="10"
              value={peakUnmetThresholdPaxHr}
              onChange={(e) => handleSliderChange(distanceThresholdKm, frequencyThresholdMins, Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>20 pax/h (Low Surge)</span>
              <span>220 pax/h (Severe Deficit)</span>
            </div>
          </div>

        </div>
      </div>

      {/* Under-served cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {areas.map((area) => (
          <div
            key={area.id}
            className={`bg-slate-900 border rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl transition relative ${
              area.demandLevel === 'CRITICAL' ? 'border-rose-500/40 hover:border-rose-500' : 'border-slate-800 hover:border-amber-500/40'
            }`}
          >
            {/* Top Bar */}
            <div className="flex items-start justify-between">
              <div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${
                  area.demandLevel === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  ⚠️ {area.demandLevel} GAP
                </span>
                <h3 className="text-xl font-extrabold text-white mt-2">{area.areaName}</h3>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  Deficit Score: {area.priorityScore}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">Priority Ranking</p>
              </div>
            </div>

            {/* Diagnostic Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400">Peak Demand</p>
                <p className="text-sm font-bold text-white">{area.peakDemandPaxHr} pax/h</p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400">Bus Capacity</p>
                <p className="text-sm font-bold text-slate-300">{area.availableCapacityPaxHr} pax/h</p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400">Unmet Demand</p>
                <p className="text-sm font-extrabold text-rose-400">{area.unmetDemandPaxHr} pax/h</p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400">Bus Headway</p>
                <p className="text-sm font-bold text-amber-400">{area.avgBusFrequencyMins} min</p>
              </div>
            </div>

            {/* Nearest Stop & Distance */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Nearest Stop: <strong>{area.nearestStop?.name || 'Local Junction Stop'}</strong></span>
              </span>
              <span className="font-bold text-white">Walking Gap: {area.distanceToStopKm} km</span>
            </div>

            {/* Reason for Classification */}
            <div className="p-3.5 bg-rose-950/25 border border-rose-500/20 rounded-xl space-y-1">
              <p className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">Classification Reason & Transit Deficit:</p>
              <p className="text-xs text-rose-200/90 leading-relaxed font-sans font-normal">
                "{area.classificationReason}"
              </p>
            </div>

            {/* Feeder Action Button */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Action: <strong className="text-slate-300">Transit Intervention Required</strong>
              </span>

              <button
                onClick={() => handleCreateFeeder(area)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>💡 Generate Feeder Route Proposal</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Log Transit Desert Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-rose-400" />
                <h3 className="font-extrabold text-white text-base">Log Emerging Transit Desert</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            <form onSubmit={handleAddAreaSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Zone / Settlement Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anandapuram University Zone, Bheemili SEZ Corridor"
                  value={newAreaName}
                  onChange={(e) => setNewAreaName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Walk Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newDistance}
                    onChange={(e) => setNewDistance(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Headway (min)</label>
                  <input
                    type="number"
                    value={newHeadway}
                    onChange={(e) => setNewHeadway(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Peak Surge (pax/h)</label>
                  <input
                    type="number"
                    value={newUnmetDemand}
                    onChange={(e) => setNewUnmetDemand(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Deficit Reason / Evidence</label>
                <textarea
                  rows={3}
                  placeholder="Describe why public transit is insufficient..."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30"
                >
                  Save & Analyze Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
