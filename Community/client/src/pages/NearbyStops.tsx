import React, { useState } from 'react';
import { MapPin, Bus, Navigation, CheckCircle2, Shield, AlertCircle, Plus, Send, X, Search, Clock, ArrowRight } from 'lucide-react';
import { Stop } from '../types';
import { InteractiveMap } from '../components/maps/InteractiveMap';
import { reportTransitGap } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface NearbyStopsProps {
  stops: Stop[];
  onSelectRoute?: (from: string, to: string) => void;
  setActiveTab?: (tab: string) => void;
}

export const NearbyStops: React.FC<NearbyStopsProps> = ({
  stops,
  onSelectRoute,
  setActiveTab
}) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [areaName, setAreaName] = useState('');
  const [distanceKm, setDistanceKm] = useState(1.8);
  const [demandPax, setDemandPax] = useState(75);
  const [reason, setReason] = useState('Walk to nearest bus stop exceeds 1.5 km; feeder shuttle required.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Authentic stops list with distance matching Screen 8
  const nearbyStopsData = [
    {
      name: 'Madhurawada Stop',
      dist: '0.3 km',
      walkTime: language === 'TE' ? '4 నిమిషాల నడక' : '4 min walk',
      area: 'NH16 Main Road, Madhurawada',
      busesCount: 3,
      incoming: [
        { route: '28', type: t('badge.ordinary'), color: 'bg-blue-600', eta: language === 'TE' ? '3 నిమి' : '3 min', dest: 'RTC Complex' },
        { route: '32', type: t('badge.metroExpress'), color: 'bg-emerald-600', eta: language === 'TE' ? '7 నిమి' : '7 min', dest: 'RTC Complex' }
      ]
    },
    {
      name: 'PM Palem Junction',
      dist: '1.2 km',
      walkTime: language === 'TE' ? '14 నిమిషాల నడక' : '14 min walk',
      area: 'Opposite ACA-VDCA Cricket Stadium',
      busesCount: 5,
      incoming: [
        { route: '45', type: t('badge.ordinary'), color: 'bg-blue-600', eta: language === 'TE' ? '5 నిమి' : '5 min', dest: 'RTC Complex' },
        { route: '111', type: t('badge.palleVelugu'), color: 'bg-amber-600', eta: language === 'TE' ? '11 నిమి' : '11 min', dest: 'Anakapalle' }
      ]
    },
    {
      name: 'Hanumanthawaka Stop',
      dist: '2.5 km',
      walkTime: language === 'TE' ? 'ఆటో ప్రయాణం' : 'Short auto ride',
      area: 'Hanumanthawaka Circle & BRTS Flyover',
      busesCount: 4,
      incoming: [
        { route: '28', type: t('badge.ordinary'), color: 'bg-blue-600', eta: language === 'TE' ? '9 నిమి' : '9 min', dest: 'RTC Complex' },
        { route: '60', type: t('badge.metroLiner'), color: 'bg-purple-600', eta: language === 'TE' ? '14 నిమి' : '14 min', dest: 'Gajuwaka' }
      ]
    },
    {
      name: 'Maddilapalem Bus Station',
      dist: '3.8 km',
      walkTime: language === 'TE' ? 'సిటీ సెంటర్' : 'City Transit Zone',
      area: 'Andhra University Corridor',
      busesCount: 8,
      incoming: [
        { route: '10K', type: t('badge.ordinary'), color: 'bg-blue-600', eta: language === 'TE' ? '2 నిమి' : '2 min', dest: 'RTC Complex' },
        { route: '400', type: t('badge.metroExpress'), color: 'bg-emerald-600', eta: language === 'TE' ? '6 నిమి' : '6 min', dest: 'Dwaraka Nagar' }
      ]
    }
  ];

  const filteredStops = nearbyStopsData.filter(s =>
    !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitGap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!areaName.trim()) return;

    try {
      setIsSubmitting(true);
      await reportTransitGap({
        areaName,
        distanceToStopKm: Number(distanceKm),
        avgBusFrequencyMins: 60,
        peakDemandPaxHr: Number(demandPax),
        classificationReason: reason
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowReportModal(false);
        setAreaName('');
      }, 2000);
    } catch (err) {
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      
      {/* Header Bar (Screen 8 Style: "Nearby Stops & Buses") */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-purple-700 font-extrabold uppercase tracking-wider">
            <span>APSRTC Geo-Radar</span>
            <span>•</span>
            <span>Screen 8 Stops</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-center space-x-2">
            <MapPin className="w-7 h-7 text-purple-600" />
            <span>{t('nearby.radarTitle')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('nearby.radarDesc')}
          </p>
        </div>

        {/* Search bar & Report Stop */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={t('nearby.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition shadow-2xs"
            />
          </div>

          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition whitespace-nowrap"
          >
            {t('nearby.requestStop')}
          </button>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative isolate z-0 rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2">
        <InteractiveMap stops={stops} height="360px" />
      </div>

      {/* Screen 8: Stop Cards with Distance and Upcoming Buses */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base">{t('nearby.orderedBy')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStops.map((stop, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition space-y-4"
            >
              {/* Top Row: Stop Name + Distance Pill */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-black text-slate-900">{stop.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{stop.area}</p>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 font-black text-xs rounded-xl inline-block">
                    {stop.dist}
                  </span>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">{stop.walkTime}</p>
                </div>
              </div>

              {/* Incoming Bus Departures List */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {t('nearby.upcoming')} ({stop.busesCount} Buses)
                </p>

                <div className="space-y-2">
                  {stop.incoming.map((b, bIdx) => (
                    <div
                      key={bIdx}
                      className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className={`w-8 h-8 rounded-xl ${b.color} text-white font-black text-xs flex items-center justify-center shadow-2xs`}>
                          {b.route}
                        </span>
                        <div>
                          <p className="text-xs font-extrabold text-slate-900">
                            {b.type} → {b.dest}
                          </p>
                          <p className="text-[10px] text-slate-500">Live GPS tracking active</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl">
                          In {b.eta}
                        </span>
                        {setActiveTab && (
                          <button
                            onClick={() => setActiveTab('live-tracking')}
                            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-700 hover:border-blue-300 transition"
                            title="Track Bus"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Request New APSRTC Stop</h3>
                  <p className="text-xs text-slate-500">Directly inform Visakhapatnam regional route planners</p>
                </div>
              </div>

              {submitSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto animate-bounce" />
                  <h4 className="text-base font-black text-emerald-900">Request Successfully Submitted!</h4>
                  <p className="text-xs text-slate-600">
                    Your request has been added to the regional under-served area registry.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitGap} className="space-y-4 text-xs font-semibold text-slate-700">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Area / Locality Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kommadi Hill View Colony, Rushikonda Phase 3"
                      value={areaName}
                      onChange={(e) => setAreaName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-purple-600 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-800 font-bold mb-1">Walking Distance (km)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={distanceKm}
                        onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 1.5)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-purple-600 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-800 font-bold mb-1">Daily Commuters (Est)</label>
                      <input
                        type="number"
                        value={demandPax}
                        onChange={(e) => setDemandPax(parseInt(e.target.value) || 50)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-purple-600 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Impact / Comments</label>
                    <textarea
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:border-purple-600 resize-none transition"
                    />
                  </div>

                  <div className="pt-2 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowReportModal(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white font-black rounded-xl shadow-md transition"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
