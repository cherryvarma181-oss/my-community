import React, { useEffect, useState } from 'react';
import { Bus as BusIcon, MapPin, Clock, ArrowLeft, AlertTriangle, ShieldCheck, CheckCircle2, Navigation, AlertCircle, Share2, ThumbsUp, Zap, Compass, XCircle, ChevronRight } from 'lucide-react';
import { Bus } from '../types';
import { InteractiveMap } from '../components/maps/InteractiveMap';
import { submitFeedback, fetchBusById } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface BusDetailsProps {
  bus: Bus | null;
  allBuses?: Bus[];
  onBack: () => void;
  setActiveTab: (tab: string) => void;
}

export const BusDetails: React.FC<BusDetailsProps> = ({
  bus: initialBus,
  allBuses = [],
  onBack,
  setActiveTab
}) => {
  const { t, language } = useLanguage();
  const [currentBus, setCurrentBus] = useState<Bus | null>(initialBus);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [telemetryCount, setTelemetryCount] = useState(1);

  // Poll live telemetry
  useEffect(() => {
    if (!initialBus?.id) return;
    setCurrentBus(initialBus);

    const interval = setInterval(async () => {
      try {
        const live = await fetchBusById(initialBus.id);
        if (live) {
          setCurrentBus(live);
          setTelemetryCount(c => c + 1);
        }
      } catch (err) {}
    }, 3000);

    return () => clearInterval(interval);
  }, [initialBus?.id]);

  if (!currentBus) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4 font-sans">
        <p className="text-slate-500 text-sm">No bus selected.</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-blue-700 text-white font-bold text-xs rounded-xl shadow"
        >
          {t('details.back')}
        </button>
      </div>
    );
  }

  const routeStops = currentBus.currentRoute?.routeStops || [];

  // Authentic stop list from Screen 6 & Screen 12
  const stopsList = [
    { name: 'Madhurawada', tag: t('details.yourStop'), dist: '0.0 km', status: 'ACTIVE', eta: language === 'TE' ? 'స్టాప్ వద్ద' : 'At Stop' },
    { name: 'PM Palem', tag: t('details.nextStopNode'), dist: '1.2 km', status: 'NEXT', eta: language === 'TE' ? '5 నిమిషాలు' : '5 min' },
    { name: 'Hanumanthawaka', tag: language === 'TE' ? 'దాటవేయబడింది ✗' : 'Skipped ✗', dist: '3.2 km', status: 'SKIPPED', eta: language === 'TE' ? 'రోడ్డు పని కారణంగా ఆపబడదు' : 'Skipped due to road work' },
    { name: 'Maddilapalem', tag: language === 'TE' ? 'మార్గంలో' : 'En Route', dist: '4.8 km', status: 'UPCOMING', eta: language === 'TE' ? '18 నిమిషాలు' : '18 min' },
    { name: 'RTC Complex', tag: language === 'TE' ? 'గమ్యస్థానం' : 'Terminus', dist: '6.3 km', status: 'DESTINATION', eta: language === 'TE' ? '28 నిమిషాలు' : '28 min' }
  ];

  const getServiceTypeDetails = (busType: string) => {
    switch (busType) {
      case 'ORDINARY':
        return { name: t('badge.ordinary'), color: 'bg-blue-600 text-white', light: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'METRO_EXPRESS':
        return { name: t('badge.metroExpress'), color: 'bg-emerald-600 text-white', light: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'METRO_DELUXE':
      case 'METRO_LINER':
        return { name: t('badge.metroLiner'), color: 'bg-purple-600 text-white', light: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'PALLE_VELUGU':
      default:
        return { name: t('badge.palleVelugu'), color: 'bg-amber-600 text-white', light: 'bg-amber-50 text-amber-800 border-amber-200' };
    }
  };

  const service = getServiceTypeDetails(currentBus.busType);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-blue-700 bg-white border border-slate-200 px-4 py-2 rounded-xl transition shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('details.back')}</span>
        </button>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-300 px-3.5 py-1.5 rounded-xl font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>{t('details.liveActive')} (#{telemetryCount})</span>
        </div>
      </div>

      {/* Screen 5: Bus Live Status Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span className={`px-3 py-1 text-xs font-black rounded-xl ${service.color} shadow-sm`}>
                Route {currentBus.currentRoute?.routeNumber || '28'}
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-bold uppercase rounded-md border ${service.light}`}>
                {service.name}
              </span>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                APSRTC City Corridor
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {currentBus.busNumber}
            </h1>

            <p className="text-sm font-semibold text-slate-600">
              Corridor: <strong className="text-slate-900">{currentBus.currentRoute?.origin || 'Madhurawada'}</strong> → <strong className="text-slate-900">{currentBus.currentRoute?.destination || 'RTC Complex'}</strong>
            </p>
          </div>

          {/* Quick Metrics Badges matching Screen 5 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-50 border border-slate-200/90 p-3 rounded-2xl text-center min-w-[110px]">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Live Status</p>
              <p className="text-sm font-black text-emerald-700 mt-0.5">{t('details.inService')}</p>
              <p className="text-[10px] text-slate-500">Regular Fleet</p>
            </div>

            <div className="bg-slate-50 border border-slate-200/90 p-3 rounded-2xl text-center min-w-[110px]">
              <p className="text-[10px] font-bold text-slate-400 uppercase">{t('details.arrivingIn')}</p>
              <p className="text-sm font-black text-blue-700 mt-0.5">
                ~{currentBus.nextStopEtaMins || 5} min
              </p>
              <p className="text-[10px] text-slate-500">1.2 km away</p>
            </div>

            <div className="bg-slate-50 border border-slate-200/90 p-3 rounded-2xl text-center min-w-[110px]">
              <p className="text-[10px] font-bold text-slate-400 uppercase">{t('details.crowdLevel')}</p>
              <p className={`text-sm font-black mt-0.5 ${currentBus.occupancyStatus === 'FULL' ? 'text-rose-600' : 'text-amber-600'}`}>
                {currentBus.occupancyStatus === 'LOW' ? t('search.lowCrowd') : t('search.modCrowd')}
              </p>
              <p className="text-[10px] text-slate-500">Seating Ready</p>
            </div>

            <div className="bg-slate-50 border border-slate-200/90 p-3 rounded-2xl text-center min-w-[110px]">
              <p className="text-[10px] font-bold text-slate-400 uppercase">{t('details.speed')}</p>
              <p className="text-sm font-black text-slate-800 mt-0.5 flex items-center justify-center gap-1">
                <Zap className="w-3.5 h-3.5 text-cyan-600" />
                <span>{currentBus.speed} km/h</span>
              </p>
              <p className="text-[10px] text-slate-500">GPS Speedometer</p>
            </div>
          </div>
        </div>

        {/* Screen 12: Live Route Delay & Skipped Stops Notice */}
        <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-rose-950 text-sm">
                {t('details.skippedNotice')}
              </p>
              <p className="text-rose-800 text-xs">
                {language === 'TE'
                  ? 'NH16 ఫ్లైఓవర్ పనుల కారణంగా, ఈ బస్సు హనుమంతవాకలో ఆగకుండా నేరుగా మద్దిలపాలెం వెళ్తుంది.'
                  : 'Due to ongoing NH16 flyover maintenance, this bus will proceed directly to Maddilapalem without halting at Hanumanthawaka.'}
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-lg bg-rose-200 text-rose-900 font-extrabold shrink-0">
            DEPOT NOTICE
          </span>
        </div>
      </div>

      {/* Screen 6 & Screen 7: Stop Sequence + Live Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Screen 6 Complete Stop Sequence (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>{t('details.stopSeqTitle')}</span>
              </h3>
              <p className="text-xs text-slate-500">Screen 6 Timeline • 5 Transit Nodes</p>
            </div>

            <div className="bg-blue-50 text-blue-800 border border-blue-200 font-black text-xs px-3 py-1 rounded-xl">
              6.3 km • 28 min
            </div>
          </div>

          {/* Vertical Stop Sequence (Screen 6 Authentic Layout) */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-1 before:bg-slate-200">
            {stopsList.map((stop, idx) => {
              const isYourStop = stop.status === 'ACTIVE';
              const isNext = stop.status === 'NEXT';
              const isSkipped = stop.status === 'SKIPPED';
              const isDest = stop.status === 'DESTINATION';

              return (
                <div key={idx} className="relative flex items-start justify-between">
                  
                  {/* Timeline Node Dot */}
                  <span
                    className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white transition-all ${
                      isYourStop
                        ? 'bg-blue-600 ring-4 ring-blue-300'
                        : isNext
                        ? 'bg-emerald-500 ring-4 ring-emerald-200 animate-pulse'
                        : isSkipped
                        ? 'bg-rose-500 ring-2 ring-rose-200'
                        : isDest
                        ? 'bg-purple-600'
                        : 'bg-slate-400'
                    }`}
                  />

                  <div className="pr-2">
                    <div className="flex items-center space-x-2">
                      <p className={`text-sm font-extrabold ${
                        isSkipped
                          ? 'text-rose-600 line-through'
                          : isYourStop
                          ? 'text-blue-900'
                          : 'text-slate-800'
                      }`}>
                        {stop.name}
                      </p>
                      {isYourStop && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-black">
                          {t('details.yourStop')}
                        </span>
                      )}
                      {isSkipped && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black">
                          {language === 'TE' ? 'దాటవేయబడింది' : 'Skipped ✗'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">{stop.dist}</p>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border ${
                    isYourStop
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : isNext
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-black animate-pulse'
                      : isSkipped
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {stop.eta}
                  </span>

                </div>
              );
            })}
          </div>

          {/* Passenger Feedback / Report Delay */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Report Bus Issue</h4>
            
            {reportSubmitted ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center space-x-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Issue recorded for Visakhapatnam regional control room.</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => {
                    setReportSubmitted(true);
                    setTimeout(() => setReportSubmitted(false), 3000);
                  }}
                  className="p-2.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-xl text-slate-700 hover:text-rose-700 transition"
                >
                  ⚠️ Overcrowded Bus
                </button>

                <button
                  onClick={() => {
                    setReportSubmitted(true);
                    setTimeout(() => setReportSubmitted(false), 3000);
                  }}
                  className="p-2.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-slate-700 hover:text-amber-700 transition"
                >
                  🕒 Running Delay
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Screen 7 Live Location Map (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <Navigation className="w-5 h-5 text-emerald-600" />
                <span>{t('details.mapViewTitle')}</span>
              </h3>
              <p className="text-xs text-slate-500">Real-time GPS pin moving along route polyline</p>
            </div>

            {/* Map Legend (from Screen 7 Graphic) */}
            <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-bold">
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                {t('details.busLocation')}
              </span>
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                {t('details.yourStop')}
              </span>
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-3 h-0.5 bg-blue-500"></span>
                {t('details.routeLine')}
              </span>
            </div>
          </div>

          {/* Interactive Map Component */}
          <div className="relative isolate z-0 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
            <InteractiveMap
              routes={currentBus.currentRoute ? [currentBus.currentRoute] : []}
              buses={[currentBus]}
              stops={routeStops.map(rs => rs.stop)}
              selectedRouteId={currentBus.currentRouteId || undefined}
              focusedBusId={currentBus.id}
              height="480px"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
            <span>Bus currently approaching: <strong className="text-slate-800">{currentBus.nextStopName || 'PM Palem Stop'}</strong></span>
            <span className="font-mono text-emerald-700 font-bold">3-sec Live Polling</span>
          </div>
        </div>

      </div>

    </div>
  );
};
