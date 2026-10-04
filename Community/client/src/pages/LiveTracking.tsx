import React, { useEffect, useState } from 'react';
import { Bus as BusIcon, Navigation, Clock, ShieldCheck, MapPin, RefreshCw, Play, Pause, Compass, Zap, Activity, Radio, Smartphone } from 'lucide-react';
import { Bus, Route } from '../types';
import { InteractiveMap } from '../components/maps/InteractiveMap';
import { fetchLiveTelemetry } from '../services/api';

interface LiveTrackingProps {
  buses: Bus[];
  routes: Route[];
  onSelectBus: (bus: Bus) => void;
  setActiveTab: (tab: string) => void;
}

export const LiveTracking: React.FC<LiveTrackingProps> = ({ buses: initialBuses, routes, onSelectBus, setActiveTab }) => {
  const [buses, setBuses] = useState<Bus[]>(initialBuses);
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('ALL');
  const [focusedBusId, setFocusedBusId] = useState<string | undefined>(undefined);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());
  const [telemetryTick, setTelemetryTick] = useState<number>(1);

  // Poll live telemetry every 3 seconds if streaming is enabled
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(async () => {
      try {
        const liveBuses = await fetchLiveTelemetry();
        if (liveBuses && liveBuses.length > 0) {
          setBuses(liveBuses);
          setLastUpdated(new Date().toLocaleTimeString());
          setTelemetryTick(t => t + 1);
        }
      } catch (err) {
        console.warn('Telemetry polling error:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Keep in sync with initialBuses when they first load
  useEffect(() => {
    if (initialBuses.length > 0 && buses.length === 0) {
      setBuses(initialBuses);
    }
  }, [initialBuses]);

  const filteredBuses = buses.filter(b => {
    if (selectedRouteFilter === 'ALL') return true;
    return b.currentRoute?.routeNumber === selectedRouteFilter;
  });

  const avgSpeed = buses.length > 0
    ? Math.round((buses.reduce((acc, b) => acc + (b.speed || 30), 0) / buses.length) * 10) / 10
    : 32.5;

  const onTimeCount = buses.filter(b => b.delayMinutes === 0).length;
  const onTimePercent = buses.length > 0 ? Math.round((onTimeCount / buses.length) * 100) : 80;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 flex items-center space-x-2">
              <Navigation className="w-6 h-6 text-emerald-600" />
              <span>Corridor Fleet & Transit Operations Monitor</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold">
              FLEET DISPATCH
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Operational status, corridor progress, stop turnover, and occupancy monitoring across scheduled transit routes.
          </p>
        </div>

        {/* Live Stream Controls */}
        <div className="flex items-center space-x-3 flex-wrap gap-2">
          <div className="flex items-center space-x-2 bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs shadow-2xs">
            <span className={`w-2.5 h-2.5 rounded-full ${isStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span className="text-slate-800 font-mono text-[11px] font-bold">
              {isStreaming ? `Sync: ${lastUpdated}` : 'Monitor Paused'}
            </span>
          </div>

          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
              isStreaming
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-600" />
                <span>Pause Feed</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Feed</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Fleet Live KPI Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center space-x-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <BusIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Active Fleet</p>
            <p className="text-xl font-black text-slate-900">{buses.length} Buses Moving</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center space-x-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Average Speed</p>
            <p className="text-xl font-black text-cyan-700">{avgSpeed} km/h</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center space-x-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">On-Time Ratio</p>
            <p className="text-xl font-black text-emerald-700">{onTimePercent}% On Time</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center space-x-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Telemetry Updates</p>
            <p className="text-xl font-black text-amber-700 font-mono">#{telemetryTick}</p>
          </div>
        </div>
      </div>

      {/* Route Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-700 font-bold shrink-0 pr-1">Filter Route:</span>
        {['ALL', '28', '32', '45', '6A', '500', '111', '38', '25K', '60', '68'].map((rNum) => (
          <button
            key={rNum}
            onClick={() => setSelectedRouteFilter(rNum)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              selectedRouteFilter === rNum
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
            }`}
          >
            {rNum === 'ALL' ? 'All Routes' : `Route ${rNum}`}
          </button>
        ))}
      </div>

      {/* Main Interactive Map */}
      <div className="relative isolate z-0 rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2">
        <InteractiveMap
          routes={routes}
          buses={filteredBuses}
          focusedBusId={focusedBusId}
          selectedRouteId={selectedRouteFilter !== 'ALL' ? routes.find(r => r.routeNumber === selectedRouteFilter)?.id : undefined}
          onSelectBus={(bus) => {
            onSelectBus(bus);
            setFocusedBusId(bus.id);
          }}
          height="540px"
        />
      </div>

      {/* Active Tracked Buses Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base">
            Live Moving Buses ({filteredBuses.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Click any bus to focus map or view full stop sequence timeline
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBuses.map((bus) => {
            const isFocused = focusedBusId === bus.id;
            const occColor =
              bus.occupancyStatus === 'FULL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
              bus.occupancyStatus === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-emerald-50 text-emerald-700 border-emerald-200';

            return (
              <div
                key={bus.id}
                onClick={() => {
                  setFocusedBusId(bus.id);
                  onSelectBus(bus);
                }}
                className={`bg-white border rounded-2xl p-5 cursor-pointer transition space-y-3.5 shadow-sm hover:shadow-md ${
                  isFocused
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 text-xs font-black bg-blue-600 text-white rounded-lg shadow-2xs">
                      Route {bus.currentRoute?.routeNumber || '28'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 uppercase">
                      {bus.busType?.replace('_', ' ')}
                    </span>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border ${occColor}`}>
                    {bus.occupancyStatus}
                  </span>
                </div>

                {/* Real Device Telemetry Badge */}
                {bus.isRealWorldGps ? (
                  <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800">
                    <span className="flex items-center space-x-1.5">
                      <Radio className="w-3 h-3 animate-pulse text-emerald-600" />
                      <span>REAL GPS DEVICE ({bus.source || 'DRIVER_APP'})</span>
                    </span>
                    <span className="font-mono text-emerald-700 font-black">±{bus.accuracyMeters || 4}m</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-2.5 py-0.5 text-[10px] text-slate-500 font-mono font-bold">
                    <span>TIMETABLE SCHEDULED</span>
                    <span className="text-emerald-700">ONLINE ✓</span>
                  </div>
                )}

                {/* Bus Number & Route Name */}
                <div>
                  <h4 className="font-black text-slate-900 text-base flex items-center justify-between">
                    <span>{bus.busNumber}</span>
                    <span className="text-xs text-blue-600 font-mono font-bold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-cyan-600" />
                      {bus.speed || 32} km/h
                    </span>
                  </h4>
                  <p className="text-xs text-slate-600 font-semibold truncate mt-0.5">{bus.currentRoute?.name}</p>
                </div>

                {/* Dynamic Telemetry Box */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/90 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1 font-semibold">
                      <Compass className="w-3.5 h-3.5 text-blue-600" />
                      <span>Approaching Stop:</span>
                    </span>
                    <span className="font-bold text-slate-900 truncate max-w-[140px]">
                      {bus.nextStopName || 'Upcoming Stop'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Distance & ETA:</span>
                    <span className="font-extrabold text-emerald-700">
                      {bus.distanceToNextStopMeters || 450}m (ETA ~{bus.nextStopEtaMins || 2} min)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Delay Status:</span>
                    <span className={`font-bold ${bus.delayMinutes > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {bus.delayMinutes > 0 ? `+${bus.delayMinutes} mins delay` : 'On Time ✓'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFocusedBusId(bus.id);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-extrabold flex items-center space-x-1"
                  >
                    <span>🎯 Focus Map</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBus(bus);
                      setActiveTab('bus-details');
                    }}
                    className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold rounded-xl transition shadow-2xs"
                  >
                    View Timeline →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
