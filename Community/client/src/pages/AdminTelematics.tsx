import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Wifi, 
  WifiOff, 
  Server, 
  Globe, 
  Key, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Copy, 
  Check, 
  ExternalLink,
  Smartphone,
  Navigation
} from 'lucide-react';
import { fetchTelemetryStats, updateExternalTransitConfig, syncExternalTransitFeed } from '../services/api';
import { TelemetryStats } from '../types';

export const AdminTelematics: React.FC = () => {
  const [stats, setStats] = useState<TelemetryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedUrl, setFeedUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [feedEnabled, setFeedEnabled] = useState(false);
  const [pollingSeconds, setPollingSeconds] = useState(10);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const loadStats = async () => {
    try {
      const data = await fetchTelemetryStats();
      setStats(data);
      if (data.externalFeed) {
        setFeedUrl(data.externalFeed.feedUrl || '');
        setApiKey(data.externalFeed.apiKey || '');
        setFeedEnabled(data.externalFeed.enabled || false);
        setPollingSeconds(data.externalFeed.pollingIntervalSeconds || 10);
      }
    } catch (err) {
      console.error('Failed to load telemetry stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveExternalConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateExternalTransitConfig({
        feedUrl,
        apiKey,
        enabled: feedEnabled,
        pollingIntervalSeconds: Number(pollingSeconds)
      });
      await loadStats();
      alert('External Transit API configuration updated!');
    } catch (err) {
      console.error('Failed to update external config:', err);
      alert('Failed to update config');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestSync = async () => {
    try {
      setIsSyncing(true);
      setSyncResult(null);
      const res = await syncExternalTransitFeed();
      setSyncResult(res);
      await loadStats();
    } catch (err: any) {
      setSyncResult({ success: false, message: err.message || 'Sync failed' });
    } finally {
      setIsSyncing(false);
    }
  };

  const curlExample = `curl -X POST http://localhost:5005/api/telemetry/ingest \\
  -H "Content-Type: application/json" \\
  -d '{
    "busNumber": "AP 31 Z 1204",
    "lat": 17.7285,
    "lng": 83.3150,
    "speed": 38.5,
    "heading": 140,
    "accuracyMeters": 4.0,
    "occupancyStatus": "MEDIUM",
    "source": "AIS140_IOT"
  }'`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
            Real-World Transit Telematics & IoT Ingestion
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">Fleet Telematics & External Transit Feeds</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Ingest real GPS packets from on-board AIS-140 devices, Driver Mobile Consoles, or Municipal GTFS-RT APIs.
          </p>
        </div>

        <button
          onClick={loadStats}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center space-x-2 self-start md:self-auto transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Active Live GPS Devices</p>
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <p className="text-2xl font-black text-white">{stats?.activeLiveDevices ?? 0}</p>
          </div>
          <p className="text-[10px] text-emerald-400 font-medium">Currently transmitting live pings</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Total Ingested GPS Pings</p>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <p className="text-2xl font-black text-white">{stats?.totalPingsIngested ?? 0}</p>
          </div>
          <p className="text-[10px] text-slate-400">Processed by spatial map engine</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">External Feed Status</p>
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-purple-400" />
            <p className="text-lg font-black text-white">{stats?.externalFeed.enabled ? 'ACTIVE' : 'STANDBY'}</p>
          </div>
          <p className="text-[10px] text-slate-400">
            {stats?.externalFeed.lastSyncStatus || 'No external feed running'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Registered Fleet</p>
          <div className="flex items-center space-x-2">
            <Server className="w-5 h-5 text-amber-400" />
            <p className="text-2xl font-black text-white">{stats?.totalRegisteredBuses ?? 10}</p>
          </div>
          <p className="text-[10px] text-slate-400">APSRTC Visakhapatnam region</p>
        </div>
      </div>

      {/* Main Grid: Active Devices + External Feed Config */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Connected Real-World Devices Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-white text-base flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Active Transmitting Hardware & Driver Phones</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {stats?.devices?.length || 0} Connected
            </span>
          </div>

          {stats?.devices && stats.devices.length > 0 ? (
            <div className="space-y-3">
              {stats.devices.map((device, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-black text-sm text-white">{device.busNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        device.gpsSignal === 'STRONG' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        device.gpsSignal === 'FAIR' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {device.gpsSignal} ({device.lastPingAgoSeconds}s ago)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Source: <strong className="text-slate-200">{device.source}</strong> | Accuracy: ±{device.accuracyMeters}m
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-indigo-400">{device.speed} km/h</p>
                    <p className="text-[10px] text-slate-500 uppercase">Velocity</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-slate-950 border border-slate-800/80 rounded-2xl text-center space-y-3">
              <WifiOff className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm font-bold text-slate-300">No Real Devices Currently Transmitting</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Open the <strong>Driver Console</strong> on your phone or laptop and tap <strong>"Start GPS Broadcast"</strong> to stream live coordinates.
              </p>
            </div>
          )}

          {/* IoT Ingestion Webhook Info */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">AIS-140 / IoT Ingestion Endpoint:</span>
              <button
                onClick={copyCurl}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Curl' : 'Copy Curl'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto">
              POST http://localhost:5005/api/telemetry/ingest
            </pre>
          </div>
        </div>

        {/* Right: External Municipal Transit API / GTFS-RT Connector */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="space-y-1">
            <h3 className="font-extrabold text-white text-base flex items-center space-x-2">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>External Transit Authority Feed (GTFS-RT / REST)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Connect real state/city feeds (e.g. APSRTC Open Data, Chalo API, Delhi OTD, BMTC).
            </p>
          </div>

          <form onSubmit={handleSaveExternalConfig} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Transit Feed URL</label>
              <input
                type="url"
                value={feedUrl}
                onChange={(e) => setFeedUrl(e.target.value)}
                placeholder="https://api.yourcity.gov.in/v1/vehicles"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">API Key / Access Token</label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Bearer token or vendor API key (optional)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
                <Key className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Polling Interval (Seconds)</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={pollingSeconds}
                  onChange={(e) => setPollingSeconds(parseInt(e.target.value) || 10)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Background Polling</label>
                <button
                  type="button"
                  onClick={() => setFeedEnabled(!feedEnabled)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold border transition ${
                    feedEnabled 
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' 
                      : 'bg-slate-950 border-slate-700 text-slate-400'
                  }`}
                >
                  {feedEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 transition disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </button>

              <button
                type="button"
                onClick={handleTestSync}
                disabled={isSyncing || !feedUrl}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 flex items-center space-x-1.5 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Test Sync</span>
              </button>
            </div>
          </form>

          {/* Sync Result Feedback */}
          {syncResult && (
            <div className={`p-4 rounded-2xl border text-xs ${
              syncResult.success 
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
                : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
            }`}>
              <p className="font-bold">{syncResult.success ? 'Sync Successful' : 'Notice'}</p>
              <p className="mt-0.5">{syncResult.message}</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
