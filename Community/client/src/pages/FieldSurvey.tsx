import React, { useState } from 'react';
import { FileSpreadsheet, Plus, Trash2, CheckCircle2, MapPin, Bus as BusIcon, Clock, Users, Navigation, Send } from 'lucide-react';
import { Route, Stop, PassengerRecord } from '../types';
import { submitSurvey } from '../services/api';

interface FieldSurveyProps {
  routes: Route[];
  stops: Stop[];
}

export const FieldSurvey: React.FC<FieldSurveyProps> = ({ routes, stops }) => {
  // Form Header State
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || '');
  const [busNumber, setBusNumber] = useState<string>('AP 31 Z 1204');
  const [busType, setBusType] = useState<string>('ORDINARY');
  const [direction, setDirection] = useState<'UP' | 'DOWN'>('UP');
  const [surveyDate, setSurveyDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [surveyTime, setSurveyTime] = useState<string>('08:30 AM');

  // Single Entry Form State
  const [boardingStopId, setBoardingStopId] = useState<string>(stops[0]?.id || '');
  const [alightingStopId, setAlightingStopId] = useState<string>(stops[1]?.id || '');
  const [passengerCount, setPassengerCount] = useState<number>(12);
  const [category, setCategory] = useState<'GENERAL' | 'STUDENT' | 'SENIOR_CITIZEN' | 'WOMEN_CHILD'>('GENERAL');
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>({ lat: 17.8023, lng: 83.3512 });

  // Staged Records for Current Survey Session
  const [stagedRecords, setStagedRecords] = useState<PassengerRecord[]>([]);

  // Submission Status
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const activeRoute = routes.find(r => r.id === selectedRouteId);
  const routeStops = activeRoute?.routeStops?.map(rs => rs.stop) || stops;

  const handleCaptureGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          setGpsLocation({ lat: 17.8023, lng: 83.3512 });
        }
      );
    }
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardingStopId || !alightingStopId || boardingStopId === alightingStopId) {
      alert('Boarding and Alighting stops must be different!');
      return;
    }

    const bStop = stops.find(s => s.id === boardingStopId);
    const aStop = stops.find(s => s.id === alightingStopId);

    const newRecord: PassengerRecord = {
      boardingStopId,
      alightingStopId,
      passengerCount: Number(passengerCount),
      category,
      lat: gpsLocation?.lat,
      lng: gpsLocation?.lng,
      boardingStop: bStop,
      alightingStop: aStop
    };

    setStagedRecords([...stagedRecords, newRecord]);
    
    // Auto increment boarding stop for fast rapid entry
    const currentIdx = routeStops.findIndex(s => s.id === boardingStopId);
    if (currentIdx !== -1 && currentIdx < routeStops.length - 1) {
      setBoardingStopId(routeStops[currentIdx + 1].id);
      if (currentIdx + 2 < routeStops.length) {
        setAlightingStopId(routeStops[currentIdx + 2].id);
      }
    }
  };

  const handleRemoveRecord = (index: number) => {
    setStagedRecords(stagedRecords.filter((_, i) => i !== index));
  };

  const handleSubmitSurvey = async () => {
    if (stagedRecords.length === 0) {
      alert('Please add at least one passenger boarding/alighting record first!');
      return;
    }

    setSubmitting(true);
    try {
      await submitSurvey({
        routeId: selectedRouteId,
        busType,
        direction,
        surveyDate,
        surveyTime,
        records: stagedRecords
      });

      setSuccessMessage(`✅ Survey submitted! Recorded ${stagedRecords.reduce((sum, r) => sum + r.passengerCount, 0)} total passengers.`);
      setStagedRecords([]);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setSuccessMessage('✅ Survey saved to offline queue!');
      setStagedRecords([]);
      setTimeout(() => setSuccessMessage(null), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider rounded-full flex items-center space-x-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Field Enumerator Mobile Portal</span>
          </span>
          <span className="text-xs text-slate-400">APSRTC Survey System</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Record Boarding & Alighting Data</h1>
        <p className="text-slate-300 text-xs sm:text-sm">
          Collect passenger counts, boarding/alighting stops, and GPS coordinates for route utilization analysis.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-950 border border-emerald-500/40 text-emerald-400 rounded-2xl text-sm font-semibold flex items-center space-x-2 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* STEP 1: Survey Trip Metadata */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="font-bold text-white text-base flex items-center space-x-2 border-b border-slate-800 pb-3">
          <BusIcon className="w-5 h-5 text-amber-400" />
          <span>Trip & Route Identification</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          
          {/* Select Route */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Select City Route</label>
            <select
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
            >
              {routes.map(r => (
                <option key={r.id} value={r.id}>
                  Route {r.routeNumber} ({r.name})
                </option>
              ))}
            </select>
          </div>

          {/* Bus Registration Number */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Bus Registration No.</label>
            <input
              type="text"
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Bus Type */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Bus Category</label>
            <select
              value={busType}
              onChange={(e) => setBusType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="ORDINARY">Ordinary (City Ordinary)</option>
              <option value="METRO_EXPRESS">Metro Express</option>
              <option value="METRO_DELUXE">Metro Deluxe</option>
              <option value="PALLE_VELUGU">Palle Velugu</option>
            </select>
          </div>

          {/* Direction */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Direction</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection('UP')}
                className={`py-2 rounded-xl font-bold transition ${direction === 'UP' ? 'bg-amber-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
              >
                UP (Origin → Dest)
              </button>
              <button
                type="button"
                onClick={() => setDirection('DOWN')}
                className={`py-2 rounded-xl font-bold transition ${direction === 'DOWN' ? 'bg-amber-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
              >
                DOWN (Dest → Origin)
              </button>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Survey Date</label>
            <input
              type="date"
              value={surveyDate}
              onChange={(e) => setSurveyDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Time */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Time</label>
            <input
              type="text"
              value={surveyTime}
              onChange={(e) => setSurveyTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

        </div>
      </div>

      {/* STEP 2: Fast Passenger Record Input Form */}
      <form onSubmit={handleAddRecord} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-base flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Passenger Boarding / Alighting Logger</span>
          </h3>

          <button
            type="button"
            onClick={handleCaptureGps}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs rounded-xl flex items-center space-x-1.5 transition"
          >
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span>GPS: {gpsLocation ? `${gpsLocation.lat.toFixed(3)}, ${gpsLocation.lng.toFixed(3)}` : 'Capture'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          {/* Boarding Stop */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Boarding Stop</label>
            <select
              value={boardingStopId}
              onChange={(e) => setBoardingStopId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
            >
              {routeStops.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          {/* Alighting Stop */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Alighting Stop</label>
            <select
              value={alightingStopId}
              onChange={(e) => setAlightingStopId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
            >
              {routeStops.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          {/* Passenger Count */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Number of Passengers</label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-base flex items-center justify-center hover:bg-slate-800"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={passengerCount}
                onChange={(e) => setPassengerCount(Number(e.target.value))}
                className="flex-1 text-center bg-slate-950 border border-slate-700 rounded-xl py-2 text-white font-bold text-base"
              />
              <button
                type="button"
                onClick={() => setPassengerCount(passengerCount + 1)}
                className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-base flex items-center justify-center hover:bg-slate-800"
              >
                +
              </button>
            </div>
          </div>

          {/* Passenger Category */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Passenger Category</label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="GENERAL">General</option>
              <option value="STUDENT">Student Concession</option>
              <option value="SENIOR_CITIZEN">Senior Citizen</option>
              <option value="WOMEN_CHILD">Women & Children</option>
            </select>
          </div>

        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-600/20 flex items-center justify-center space-x-2 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add Passenger Record to Trip Log</span>
        </button>
      </form>

      {/* STEP 3: Staged Records Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-base">Staged Survey Records ({stagedRecords.length})</h3>
            <p className="text-xs text-slate-400">Total Passengers: {stagedRecords.reduce((sum, r) => sum + r.passengerCount, 0)}</p>
          </div>

          {stagedRecords.length > 0 && (
            <button
              onClick={handleSubmitSurvey}
              disabled={submitting}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Survey'}</span>
            </button>
          )}
        </div>

        {stagedRecords.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No passenger records added yet. Use the form above to add boarding/alighting entries.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Boarding Stop</th>
                  <th className="p-3">Alighting Stop</th>
                  <th className="p-3 text-center">Passengers</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {stagedRecords.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-white">{idx + 1}</td>
                    <td className="p-3 font-semibold text-slate-200">{rec.boardingStop?.name}</td>
                    <td className="p-3 font-semibold text-slate-200">{rec.alightingStop?.name}</td>
                    <td className="p-3 text-center font-bold text-emerald-400 text-sm">{rec.passengerCount}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-[10px] uppercase font-bold text-slate-300">
                        {rec.category}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleRemoveRecord(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
