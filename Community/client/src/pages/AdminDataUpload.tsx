import React, { useState, useEffect } from 'react';
import { Upload, FileSpreadsheet, Database, CheckCircle2, AlertCircle, RefreshCw, BarChart2, Layers, Download, Check, Sparkles, ArrowRight } from 'lucide-react';
import { fetchSurveyStats, bulkImportSurveysApi, loadSurveyPresetApi, fetchRoutes, fetchStops } from '../services/api';
import { Route, Stop } from '../types';

interface AdminDataUploadProps {
  setActiveTab: (tab: string) => void;
  onDataRecalculated?: () => void;
}

export const AdminDataUpload: React.FC<AdminDataUploadProps> = ({ setActiveTab, onDataRecalculated }) => {
  const [stats, setStats] = useState<{
    totalSurveys: number;
    totalPassengerRecords: number;
    totalPassengersSurveyed: number;
    categoryBreakdown: Array<{ category: string; count: number }>;
  } | null>(null);

  const [routes, setRoutes] = useState<Route[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<any | null>(null);

  const loadData = async () => {
    try {
      const [sData, rData, stData] = await Promise.all([
        fetchSurveyStats(),
        fetchRoutes(),
        fetchStops()
      ]);
      setStats(sData);
      setRoutes(rData);
      setStops(stData);
    } catch (err) {
      console.warn('Error fetching upload stats:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Quick preset loading
  const handleLoadPreset = async (presetId: string) => {
    setLoading(true);
    setSuccessResult(null);
    try {
      const res = await loadSurveyPresetApi(presetId);
      setSuccessResult({
        title: 'Municipal Census Loaded Successfully',
        message: `${res.presetLabel}: Ingested ${res.recordsAdded} boarding records (${res.passengersSurveyed} riders). Recalculated ${res.recalculatedRoutes} routes & generated ${res.recommendationsUpdated} new route recommendations!`,
        recordsAdded: res.recordsAdded,
        passengersSurveyed: res.passengersSurveyed
      });
      await loadData();
      if (onDataRecalculated) onDataRecalculated();
    } catch (err: any) {
      alert(`Failed to load preset: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Parse CSV
  const handleParseCsv = (textToParse: string) => {
    setCsvText(textToParse);
    setParseError(null);

    if (!textToParse.trim()) {
      setParsedRows([]);
      return;
    }

    try {
      const lines = textToParse.trim().split('\n').filter(l => l.trim().length > 0);
      if (lines.length < 2) {
        setParseError('CSV must contain a header row and at least 1 record row');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const routeIdx = headers.findIndex(h => h.includes('route'));
      const boardIdx = headers.findIndex(h => h.includes('board') || h.includes('origin'));
      const alightIdx = headers.findIndex(h => h.includes('alight') || h.includes('dest'));
      const countIdx = headers.findIndex(h => h.includes('pax') || h.includes('count') || h.includes('passenger'));
      const catIdx = headers.findIndex(h => h.includes('category') || h.includes('type'));

      if (boardIdx === -1 || alightIdx === -1) {
        setParseError('CSV header must contain Boarding and Alighting columns (e.g., BoardingStopCode, AlightingStopCode)');
        return;
      }

      const rows: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        if (parts.length >= 2) {
          rows.push({
            routeNumber: routeIdx !== -1 ? parts[routeIdx] : '28',
            boardingStopCode: parts[boardIdx],
            alightingStopCode: parts[alightIdx],
            passengerCount: countIdx !== -1 ? parseInt(parts[countIdx], 10) || 1 : 1,
            category: catIdx !== -1 ? parts[catIdx].toUpperCase() : 'GENERAL'
          });
        }
      }

      setParsedRows(rows);
    } catch (err: any) {
      setParseError(`Parse error: ${err.message}`);
    }
  };

  // Submit custom parsed CSV
  const handleSubmitCsv = async () => {
    if (parsedRows.length === 0) return;
    setLoading(true);
    setSuccessResult(null);

    try {
      const res = await bulkImportSurveysApi('Custom Municipal Survey Batch', parsedRows);
      setSuccessResult({
        title: 'Survey Ingestion Complete',
        message: `${res.message} Network utilisation re-evaluated across ${res.recalculatedRoutes} routes!`,
        recordsAdded: res.recordsImported,
        passengersSurveyed: res.totalPassengersAdded
      });
      setCsvText('');
      setParsedRows([]);
      await loadData();
      if (onDataRecalculated) onDataRecalculated();
    } catch (err: any) {
      alert(`Bulk import failed: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleCsv = () => {
    const sample = `RouteNumber,BoardingStopCode,AlightingStopCode,PassengerCount,Category
28,STP-MDW,STP-RTC,34,GENERAL
28,STP-MDX,STP-MDP,22,STUDENT
45,STP-GJW,STP-RTC,45,GENERAL
45,STP-KRM,STP-SCN,18,WOMEN_CHILD
32,STP-PND,STP-RTC,29,GENERAL
500,STP-ANK,STP-TAG,38,SENIOR_CITIZEN
6A,STP-SCN,STP-RTC,26,GENERAL
28,STP-PMP,STP-RTC,41,STUDENT`;
    handleParseCsv(sample);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      
      {/* Header Banner */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
              <Database className="w-6 h-6 text-blue-400" />
              <span>Municipal Survey & ETM Data Ingestion Hub</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono font-bold">
              PS050 COMPLIANT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Feed authentic Electronic Ticketing Machine (ETM) transaction logs and conductor boarding surveys into the analytical engine.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('admin-analytics')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center space-x-1.5 transition"
          >
            <BarChart2 className="w-4 h-4 text-blue-400" />
            <span>View Utilisation</span>
          </button>
          <button
            onClick={() => setActiveTab('admin-recommendations')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5 transition"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>View Recommendations</span>
          </button>
        </div>
      </div>

      {/* Success Result Banner */}
      {successResult && (
        <div className="p-5 bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/40 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-300">{successResult.title}</h4>
              <p className="text-xs text-emerald-200/90 mt-0.5 leading-relaxed">{successResult.message}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActiveTab('admin-analytics')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1"
            >
              <span>Examine Results</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Total Field Surveys</p>
          <p className="text-2xl font-extrabold text-white">{stats?.totalSurveys ?? '...'}</p>
          <p className="text-[11px] text-slate-500">Conductor & Enumerator Runs</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Boarding Records</p>
          <p className="text-2xl font-extrabold text-blue-400">{stats?.totalPassengerRecords ?? '...'}</p>
          <p className="text-[11px] text-blue-300/80">Origin-Destination Pairs</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Total Riders Surveyed</p>
          <p className="text-2xl font-extrabold text-emerald-400">
            {stats?.totalPassengersSurveyed ? stats.totalPassengersSurveyed.toLocaleString() : '...'}
          </p>
          <p className="text-[11px] text-emerald-300/80">Empirical Passenger Volume</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Monitored Corridors</p>
          <p className="text-2xl font-extrabold text-cyan-400">{routes.length}</p>
          <p className="text-[11px] text-cyan-300/80">{stops.length} Geo-coded Bus Stops</p>
        </div>
      </div>

      {/* Section 1: Pre-packaged Municipal Survey Censuses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Official Municipal Transit Censuses (1-Click Test Scenarios)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Instantly ingest structured field survey data to evaluate the algorithmic response of the route utilisation and under-served area detection engines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Preset 1 */}
          <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 space-y-3 shadow-xl transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-bold text-[10px] uppercase">
                  Scenario A
                </span>
                <span className="text-[11px] font-mono text-slate-400">07:30 - 10:30 AM</span>
              </div>
              <h3 className="text-base font-bold text-white mt-2">Morning Peak Commute Corridor Census</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Evaluates heavy commuter surge towards commercial centers. Overcrowds Route 28 (Madhurawada) and Route 45 (Gajuwaka) to test capacity strain algorithms.
              </p>
            </div>
            <button
              onClick={() => handleLoadPreset('PEAK_MORNING')}
              disabled={loading}
              className="w-full mt-3 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Ingest Morning Peak Data</span>
            </button>
          </div>

          {/* Preset 2 */}
          <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 space-y-3 shadow-xl transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-bold text-[10px] uppercase">
                  Scenario B
                </span>
                <span className="text-[11px] font-mono text-slate-400">16:00 - 20:00 PM</span>
              </div>
              <h3 className="text-base font-bold text-white mt-2">Gajuwaka SEZ & Port Industrial Shift Census</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Captures heavy factory shift-change movement in industrial sectors. Triggers critical unmet demand alerts and validates Feeder Route 45F proposals.
              </p>
            </div>
            <button
              onClick={() => handleLoadPreset('INDUSTRIAL_SHIFT')}
              disabled={loading}
              className="w-full mt-3 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/20 flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Ingest Industrial Shift Data</span>
            </button>
          </div>

          {/* Preset 3 */}
          <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 space-y-3 shadow-xl transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase">
                  Scenario C
                </span>
                <span className="text-[11px] font-mono text-slate-400">11:30 - 15:30 PM</span>
              </div>
              <h3 className="text-base font-bold text-white mt-2">Education Corridor & Student Transit Survey</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Captures high student pass-holder movement across university hubs (Route 32, 25K, 60). Validates student fare category ratios and off-peak headway adjustments.
              </p>
            </div>
            <button
              onClick={() => handleLoadPreset('STUDENT_COMMUTE')}
              disabled={loading}
              className="w-full mt-3 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Ingest Student Census Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Custom CSV / ETM Uploader */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-400" />
              <span>Import Custom Conductor ETM / Survey CSV Data</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Paste or load Electronic Ticketing Machine (ETM) CSV logs. Formatted with Route, Boarding Stop Code, Alighting Stop Code, and Pax Count.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadSampleCsv}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition"
            >
              Load Sample CSV
            </button>
          </div>
        </div>

        {/* CSV Input Textarea */}
        <div className="space-y-2">
          <textarea
            value={csvText}
            onChange={(e) => handleParseCsv(e.target.value)}
            placeholder="RouteNumber,BoardingStopCode,AlightingStopCode,PassengerCount,Category&#10;28,STP-MDW,STP-RTC,34,GENERAL&#10;45,STP-GJW,STP-RTC,25,GENERAL"
            rows={5}
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition"
          />

          {parseError && (
            <p className="text-xs text-rose-400 flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{parseError}</span>
            </p>
          )}
        </div>

        {/* Preview Table */}
        {parsedRows.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                Parsed Records Preview ({parsedRows.length} rows ready for ingestion):
              </span>
              <button
                onClick={handleSubmitCsv}
                disabled={loading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{loading ? 'Processing & Recalculating...' : 'Process & Recalculate Network Analytics'}</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Route</th>
                    <th className="p-3">Boarding Stop Code</th>
                    <th className="p-3">Alighting Stop Code</th>
                    <th className="p-3">Pax Count</th>
                    <th className="p-3">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/60 font-mono text-[11px]">
                  {parsedRows.slice(0, 8).map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/50">
                      <td className="p-3 text-slate-500">{idx + 1}</td>
                      <td className="p-3 font-bold text-blue-400">Route {r.routeNumber}</td>
                      <td className="p-3 text-emerald-400">{r.boardingStopCode}</td>
                      <td className="p-3 text-rose-400">{r.alightingStopCode}</td>
                      <td className="p-3 font-bold text-white">{r.passengerCount}</td>
                      <td className="p-3 text-amber-300">{r.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedRows.length > 8 && (
                <div className="p-2 bg-slate-950 text-center text-[10px] text-slate-500 border-t border-slate-800">
                  + {parsedRows.length - 8} more rows will be imported in this batch
                </div>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
