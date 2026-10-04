import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  MapPin, 
  Navigation, 
  Gauge, 
  Users, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  Square, 
  Compass, 
  Crosshair, 
  Smartphone, 
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Bus, Route } from '../types';
import { ingestLiveTelemetry } from '../services/api';

interface DriverConsoleProps {
  buses: Bus[];
  routes: Route[];
  setActiveTab: (tab: string) => void;
}

export const DriverConsole: React.FC<DriverConsoleProps> = ({ buses, routes, setActiveTab }) => {
  const [selectedBusNumber, setSelectedBusNumber] = useState<string>('AP 31 Z 1204');
  const [driverName, setDriverName] = useState<string>('K. Satyanarayana');
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [trackingMode, setTrackingMode] = useState<'DEVICE_GPS' | 'VIRTUAL_TEST'>('DEVICE_GPS');
  
  // Real telemetry state
  const [currentLat, setCurrentLat] = useState<number>(17.7285);
  const [currentLng, setCurrentLng] = useState<number>(83.3150);
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [currentHeading, setCurrentHeading] = useState<number>(135);
  const [currentAccuracy, setCurrentAccuracy] = useState<number>(4.2);
  const [occupancy, setOccupancy] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'FULL'>('MEDIUM');
  
  // Stats
  const [pingsSent, setPingsSent] = useState<number>(0);
  const [lastPingTime, setLastPingTime] = useState<string | null>(null);
  const [lastServerResponse, setLastServerResponse] = useState<any>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Road waypoints for virtual test drive along Visakhapatnam NH16 corridor
  const testWaypoints = [
    { name: 'Madhurawada Junction', lat: 17.7845, lng: 83.3512, speed: 42 },
    { name: 'PM Palem Cricket Stadium', lat: 17.7690, lng: 83.3421, speed: 38 },
    { name: 'Yendada SEZ Cross', lat: 17.7554, lng: 83.3320, speed: 35 },
    { name: 'Hanumanthawaka Junction', lat: 17.7420, lng: 83.3210, speed: 28 },
    { name: 'Maddilapalem Bus Station', lat: 17.7284, lng: 83.3142, speed: 34 },
    { name: 'RTC Complex Dwaraka Nagar', lat: 17.7198, lng: 83.3054, speed: 22 }
  ];
  const [virtualWaypointIdx, setVirtualWaypointIdx] = useState<number>(0);

  const watchIdRef = useRef<number | null>(null);
  const broadcastIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Currently selected bus details
  const currentBus = buses.find(b => b.busNumber === selectedBusNumber) || buses[0];
  const busRoute = routes.find(r => r.id === currentBus?.currentRouteId) || routes[0];

  // Stop broadcasting on unmount
  useEffect(() => {
    return () => {
      stopBroadcasting();
    };
  }, []);

  const startBroadcasting = () => {
    setGpsError(null);
    setIsBroadcasting(true);

    if (trackingMode === 'DEVICE_GPS') {
      if (!navigator.geolocation) {
        setGpsError('Geolocation is not supported by your browser. Please switch to Test Drive mode.');
        return;
      }

      // Request real HTML5 device GPS with maximum accuracy
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed, heading, accuracy } = position.coords;
          setCurrentLat(latitude);
          setCurrentLng(longitude);
          setCurrentAccuracy(Math.round(accuracy * 10) / 10);
          
          // Speed comes in m/s; convert to km/h
          const speedKmH = speed ? Math.round(speed * 3.6 * 10) / 10 : 0;
          setCurrentSpeed(speedKmH);
          if (heading !== null && !isNaN(heading)) {
            setCurrentHeading(Math.round(heading));
          }

          // Transmit ping immediately
          sendTelemetryPacket(latitude, longitude, speedKmH, heading || 0, accuracy);
        },
        (error) => {
          console.warn('GPS watch error:', error.message);
          setGpsError(`${error.message}. If on desktop, enable location permissions or use Test Drive mode.`);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000
        }
      );
    } else {
      // Virtual road test drive mode: cycle through Visakhapatnam corridor waypoints every 3 seconds
      let step = 0;
      broadcastIntervalRef.current = setInterval(() => {
        step = (step + 1) % testWaypoints.length;
        setVirtualWaypointIdx(step);
        const wp = testWaypoints[step];
        setCurrentLat(wp.lat);
        setCurrentLng(wp.lng);
        setCurrentSpeed(wp.speed);
        sendTelemetryPacket(wp.lat, wp.lng, wp.speed, 145, 3.5);
      }, 3000);
    }
  };

  const stopBroadcasting = () => {
    setIsBroadcasting(false);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (broadcastIntervalRef.current !== null) {
      clearInterval(broadcastIntervalRef.current);
      broadcastIntervalRef.current = null;
    }
  };

  const sendTelemetryPacket = async (lat: number, lng: number, speed: number, heading: number, accuracy: number) => {
    try {
      const response = await ingestLiveTelemetry({
        busNumber: selectedBusNumber,
        lat,
        lng,
        speed,
        heading,
        accuracyMeters: accuracy,
        occupancyStatus: occupancy,
        driverName,
        source: trackingMode === 'DEVICE_GPS' ? 'DRIVER_APP' : 'AIS140_IOT'
      });

      setPingsSent(prev => prev + 1);
      setLastPingTime(new Date().toLocaleTimeString());
      setLastServerResponse(response.telemetry);
    } catch (err: any) {
      console.error('Failed to send live telemetry ping:', err);
    }
  };

  // Immediate update when occupancy changes
  const handleOccupancyChange = (newOccupancy: 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL') => {
    setOccupancy(newOccupancy);
    if (isBroadcasting) {
      sendTelemetryPacket(currentLat, currentLng, currentSpeed, currentHeading, currentAccuracy);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1.5">
              <Radio className={`w-3.5 h-3.5 ${isBroadcasting ? 'animate-pulse text-emerald-400' : 'text-slate-400'}`} />
              <span>{isBroadcasting ? 'TRANSMITTING LIVE TELEMETRY' : 'DRIVER TELEMATICS CONSOLE'}</span>
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Real-World GPS Feed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">APSMART Vehicle In-Cab Transmitter</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Transmits real-time GPS coordinates, velocity, and crowd load directly to the APSRTC Control Center & Passenger App.
          </p>
        </div>

        {/* Start / Stop Toggle */}
        <div className="flex items-center space-x-3">
          {isBroadcasting ? (
            <button
              onClick={stopBroadcasting}
              className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-red-600/30 flex items-center space-x-3 transition animate-pulse"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>End Shift / Stop GPS</span>
            </button>
          ) : (
            <button
              onClick={startBroadcasting}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center space-x-3 transition"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Go On Duty / Start GPS Broadcast</span>
            </button>
          )}
        </div>
      </div>

      {/* GPS Error Alert */}
      {gpsError && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{gpsError}</span>
          </div>
          <button
            onClick={() => setTrackingMode('VIRTUAL_TEST')}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shrink-0 ml-3"
          >
            Switch to Test Drive Mode
          </button>
        </div>
      )}

      {/* Main Grid: Controls & Live Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Vehicle & Shift Assignment */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-blue-400" />
              <span>Vehicle & Driver Setup</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Bus Vehicle</label>
                <select
                  disabled={isBroadcasting}
                  value={selectedBusNumber}
                  onChange={(e) => setSelectedBusNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-blue-500 disabled:opacity-50"
                >
                  {buses.map(b => (
                    <option key={b.id} value={b.busNumber}>
                      {b.busNumber} ({b.busType.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Duty Driver Name</label>
                <input
                  type="text"
                  disabled={isBroadcasting}
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-semibold focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">GPS Telemetry Source</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={isBroadcasting}
                    onClick={() => setTrackingMode('DEVICE_GPS')}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      trackingMode === 'DEVICE_GPS'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    📱 Real Phone/Laptop GPS
                  </button>
                  <button
                    type="button"
                    disabled={isBroadcasting}
                    onClick={() => setTrackingMode('VIRTUAL_TEST')}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      trackingMode === 'VIRTUAL_TEST'
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    🛣️ Virtual Corridor Drive
                  </button>
                </div>
              </div>

              {/* Assigned Route Summary */}
              {busRoute && (
                <div className="pt-3 border-t border-slate-800 space-y-1">
                  <p className="text-[11px] text-slate-400">Assigned Route:</p>
                  <p className="text-sm font-extrabold text-white">Route {busRoute.routeNumber} — {busRoute.name}</p>
                  <p className="text-[11px] text-slate-400">Total Distance: {busRoute.distanceKm} km | Stops: {busRoute.totalStops}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action: Jump to Live Map */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Passenger Map View</p>
              <p className="text-[11px] text-slate-400">Verify your bus location on the live public tracking map</p>
            </div>
            <button
              onClick={() => setActiveTab('live-tracking')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-bold rounded-xl transition flex items-center space-x-1"
            >
              <span>View Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Column: Live Speedometer & Telemetry Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Live Speedometer & Telemetry Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Gauge className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-extrabold text-white">Real-Time In-Cab Telematics</h3>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                {isBroadcasting ? (
                  <span className="flex items-center space-x-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold">
                    <Wifi className="w-3.5 h-3.5" />
                    <span>ONLINE (Transmitting)</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 px-3 py-1 bg-slate-800 text-slate-400 rounded-full font-bold">
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>STANDBY (Stopped)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Speedometer Display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div className="sm:col-span-1 bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-1">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Ground Speed</p>
                <div className="text-5xl font-black text-white tracking-tight">
                  {currentSpeed}
                </div>
                <p className="text-xs font-bold text-indigo-400 uppercase">km / hour</p>
              </div>

              <div className="sm:col-span-2 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold flex items-center space-x-1">
                    <Crosshair className="w-3.5 h-3.5 text-blue-400" />
                    <span>GPS Coordinates</span>
                  </p>
                  <p className="font-mono text-white font-bold">{currentLat.toFixed(5)}, {currentLng.toFixed(5)}</p>
                  <p className="text-[10px] text-slate-500">Accuracy: ±{currentAccuracy}m</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold flex items-center space-x-1">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>Bearing & Heading</span>
                  </p>
                  <p className="font-mono text-white font-bold">{currentHeading}° SE</p>
                  <p className="text-[10px] text-slate-500">Corridor Direction: DOWN</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Pings Transmitted</p>
                  <p className="text-lg font-black text-emerald-400">{pingsSent}</p>
                  <p className="text-[10px] text-slate-500">Last: {lastPingTime || 'None'}</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Next Route Stop</p>
                  <p className="font-bold text-white truncate">{lastServerResponse?.nextStopName || 'Maddilapalem'}</p>
                  <p className="text-[10px] text-cyan-400">
                    {lastServerResponse?.distanceToNextStopMeters || 600}m ({lastServerResponse?.nextStopEtaMins || 2} min)
                  </p>
                </div>
              </div>
            </div>

            {/* Occupancy Selector: Driver can tap to update crowd level */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Real-Time Cabin Crowding / Occupancy Status</span>
                </label>
                <span className="text-[11px] text-slate-400">Updates live on passenger apps</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'LOW', label: 'Seats Empty', color: 'emerald', desc: 'Plenty of Seats' },
                  { id: 'MEDIUM', label: 'Standing Room', color: 'blue', desc: 'Seats Full' },
                  { id: 'HIGH', label: 'Crowded', color: 'amber', desc: 'Heavy Load' },
                  { id: 'FULL', label: 'Full / Packed', color: 'red', desc: 'No Boarding' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleOccupancyChange(item.id as any)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      occupancy === item.id
                        ? `bg-${item.color}-500/20 border-${item.color}-500 text-${item.color}-300 ring-2 ring-${item.color}-500/40 font-bold`
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-xs font-extrabold text-white">{item.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Virtual Road Waypoint Step Indicator (if in Virtual Test Drive mode) */}
          {trackingMode === 'VIRTUAL_TEST' && (
            <div className="bg-purple-950/20 border border-purple-500/30 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-200">Visakhapatnam Corridor Simulation Sequence</span>
                <span className="text-purple-400 font-mono">Waypoint {virtualWaypointIdx + 1} of {testWaypoints.length}</span>
              </div>
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {testWaypoints.map((wp, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] whitespace-nowrap ${
                      idx === virtualWaypointIdx
                        ? 'bg-purple-600 text-white font-bold border-purple-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {wp.name}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
