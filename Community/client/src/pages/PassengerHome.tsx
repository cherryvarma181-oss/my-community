import React, { useState, useEffect } from 'react';
import { Bus, MapPin, Navigation, Bookmark, Search, Clock, ArrowRight, AlertTriangle, ShieldCheck, Sparkles, Zap, ArrowLeftRight, Bell, Compass, Footprints, CheckCircle2, ChevronRight } from 'lucide-react';
import { Route, Recommendation, Bus as BusType } from '../types';
import { fetchRecommendations, fetchLiveTelemetry } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface PassengerHomeProps {
  setActiveTab: (tab: string) => void;
  onSearch: (from: string, to: string) => void;
  routes: Route[];
  onOpenApproachingModal?: () => void;
}

export const PassengerHome: React.FC<PassengerHomeProps> = ({
  setActiveTab,
  onSearch,
  routes,
  onOpenApproachingModal
}) => {
  const { t, language } = useLanguage();
  const [fromStop, setFromStop] = useState('Madhurawada');
  const [toStop, setToStop] = useState('RTC Complex');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [liveBuses, setLiveBuses] = useState<BusType[]>([]);
  const [reminderSet, setReminderSet] = useState(false);

  useEffect(() => {
    const loadSmartCommuterData = async () => {
      try {
        const [recommsData, telemetryData] = await Promise.allSettled([
          fetchRecommendations(),
          fetchLiveTelemetry()
        ]);
        if (recommsData.status === 'fulfilled' && recommsData.value) {
          setRecommendations(recommsData.value);
        }
        if (telemetryData.status === 'fulfilled' && telemetryData.value) {
          setLiveBuses(telemetryData.value);
        }
      } catch (err) {
        console.error('Failed to load commuter data:', err);
      }
    };
    loadSmartCommuterData();

    const interval = setInterval(async () => {
      try {
        const live = await fetchLiveTelemetry();
        if (live && live.length > 0) setLiveBuses(live);
      } catch (err) {}
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const swapStops = () => {
    const temp = fromStop;
    setFromStop(toStop);
    setToStop(temp);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(fromStop, toStop);
    setActiveTab('bus-search');
  };

  const handlePopularDestinationClick = (dest: string) => {
    setToStop(dest);
    onSearch(fromStop, dest);
    setActiveTab('bus-search');
  };

  const approachingBus = liveBuses
    .slice()
    .filter(b => b.status === 'ACTIVE')
    .sort((a, b) => (a.nextStopEtaMins || 99) - (b.nextStopEtaMins || 99))[0];

  const popularDestinations = [
    { name: 'RTC Complex', area: language === 'TE' ? 'ద్వారకా బస్ స్టేషన్ • సెంట్రల్' : 'Dwaraka Bus Station • Central', dist: '14 km', buses: language === 'TE' ? '12 బస్సులు' : '12 Buses' },
    { name: 'Maddilapalem', area: language === 'TE' ? 'ఆంధ్రా విశ్వవిద్యాలయం' : 'AU Campus • City Centre', dist: '10 km', buses: language === 'TE' ? '8 బస్సులు' : '8 Buses' },
    { name: 'Gajuwaka', area: language === 'TE' ? 'స్టీల్ ప్లాంట్ & పారిశ్రామిక ప్రాంతం' : 'Steel Plant & Industrial Corridor', dist: '26 km', buses: language === 'TE' ? '6 బస్సులు' : '6 Buses' },
    { name: 'Beach Road', area: language === 'TE' ? 'ఆర్కే బీచ్ తీరం' : 'RK Beach • Coastal Corridor', dist: '16 km', buses: language === 'TE' ? '4 బస్సులు' : '4 Buses' },
    { name: 'PM Palem', area: language === 'TE' ? 'క్రికెట్ స్టేడియం' : 'ACA-VDCA Cricket Stadium', dist: '1.2 km', buses: language === 'TE' ? '15 బస్సులు' : '15 Buses' },
    { name: 'Hanumanthawaka', area: language === 'TE' ? 'జాతీయ రహదారి కూడలి' : 'NH16 Junction', dist: '3.2 km', buses: language === 'TE' ? '9 బస్సులు' : '9 Buses' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      
      {/* Top Welcoming Bar (Screen 2 Graphic: "Good Morning, Sneha 👋") */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('home.greeting')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {t('home.subGreeting')}
          </p>
        </div>

        {/* Live Weather & Transit Status pill */}
        <div className="flex items-center space-x-2 bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2 shadow-2xs self-start sm:self-auto text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="font-bold text-slate-800">{t('home.networkStatus')}</span>
          <span className="text-emerald-700 font-black">{t('home.normalServices')}</span>
        </div>
      </div>

      {/* Main Journey Planner Card (Screen 2: "Where do you want to go?") */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">{t('home.planTitle')}</h2>
              <p className="text-xs text-slate-500">{t('home.planSubtitle')}</p>
            </div>
          </div>

          <span className="hidden sm:inline-flex px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold rounded-full">
            {t('home.allBusesPill')}
          </span>
        </div>

        {/* Form Inputs: From -> To with swap button */}
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-center">
            
            {/* From Stop */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('home.fromStop')}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Madhurawada, PM Palem, Kommadi"
                  value={fromStop}
                  onChange={(e) => setFromStop(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none transition shadow-2xs"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center md:pt-5">
              <button
                type="button"
                onClick={swapStops}
                title="Swap From and To stops"
                className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-300 flex items-center justify-center transition shadow-2xs"
              >
                <ArrowLeftRight className="w-5 h-5" />
              </button>
            </div>

            {/* To Stop */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <Navigation className="w-3.5 h-3.5 text-cyan-600" />
                <span>{t('home.toStop')}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. RTC Complex, Maddilapalem, Gajuwaka"
                  value={toStop}
                  onChange={(e) => setToStop(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none transition shadow-2xs"
                />
              </div>
            </div>

          </div>

          {/* Search Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>{t('badge.ordinary')}, {t('badge.metroExpress')}, {t('badge.metroLiner')}, {t('badge.palleVelugu')}</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-black text-sm rounded-2xl shadow-md shadow-blue-700/20 flex items-center justify-center space-x-2 transition"
            >
              <Search className="w-4 h-4" />
              <span>{t('home.findBuses')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Screen 11: Leave Home Guidance Card (Key Feature from Graphic!) */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-800 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/40 text-xs font-black uppercase tracking-wider flex items-center space-x-1.5">
                <Footprints className="w-3.5 h-3.5 text-cyan-300" />
                <span>{t('leaveHome.badge')}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Route 28 – {t('badge.ordinary')}
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center space-x-2">
                <span>{t('leaveHome.title')}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {t('leaveHome.desc')}
              </p>
            </div>

            {/* Walk & Transit Breakdown Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-3">
                <p className="text-blue-300 font-semibold text-[11px]">{t('leaveHome.walkToStop')}</p>
                <p className="text-base font-extrabold text-white mt-0.5">7 min (450 m)</p>
                <p className="text-[10px] text-slate-300">Madhurawada Stop</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-3">
                <p className="text-emerald-300 font-semibold text-[11px]">{t('leaveHome.busArrives')}</p>
                <p className="text-base font-extrabold text-white mt-0.5">6:20 PM</p>
                <p className="text-[10px] text-slate-300">Live GPS tracking active</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-3">
                <p className="text-amber-300 font-semibold text-[11px]">{t('leaveHome.bufferTime')}</p>
                <p className="text-base font-extrabold text-white mt-0.5">5 min safety</p>
                <p className="text-[10px] text-slate-300">Never miss the bus</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => {
                setReminderSet(true);
                setTimeout(() => setReminderSet(false), 3000);
              }}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-blue-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
            >
              <Bell className="w-4 h-4 text-blue-700" />
              <span>{reminderSet ? '✓ Reminder Active (6:05 PM)' : t('leaveHome.setReminder')}</span>
            </button>

            <button
              onClick={() => setActiveTab('live-tracking')}
              className="px-6 py-3 bg-blue-800/80 hover:bg-blue-800 border border-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2"
            >
              <Navigation className="w-4 h-4 text-cyan-300" />
              <span>{t('leaveHome.trackLive')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Screen 2: Quick Access 4-Card Grid */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-slate-900 text-base">{t('quick.title')}</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <button
            onClick={() => setActiveTab('nearby-stops')}
            className="bg-white border border-slate-200/90 hover:border-purple-300 p-5 rounded-3xl text-left space-y-3 shadow-2xs hover:shadow-md transition group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm">{t('quick.nearby')}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{t('quick.nearbyDesc')}</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('live-tracking')}
            className="bg-white border border-slate-200/90 hover:border-emerald-300 p-5 rounded-3xl text-left space-y-3 shadow-2xs hover:shadow-md transition group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm">{t('quick.live')}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{t('quick.liveDesc')}</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('bus-search')}
            className="bg-white border border-slate-200/90 hover:border-blue-300 p-5 rounded-3xl text-left space-y-3 shadow-2xs hover:shadow-md transition group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm">{t('quick.types')}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{t('quick.typesDesc')}</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('saved-routes')}
            className="bg-white border border-slate-200/90 hover:border-amber-300 p-5 rounded-3xl text-left space-y-3 shadow-2xs hover:shadow-md transition group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm">{t('quick.saved')}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{t('quick.savedDesc')}</p>
            </div>
          </button>

        </div>
      </div>

      {/* Screen 2 & 3: Popular Destinations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">{t('popular.title')}</h3>
            <p className="text-xs text-slate-500">{t('popular.subtitle')}</p>
          </div>
          <button 
            onClick={() => setActiveTab('bus-search')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center space-x-1"
          >
            <span>{t('popular.viewAll')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularDestinations.map((dest, idx) => (
            <div
              key={idx}
              onClick={() => handlePopularDestinationClick(dest.name)}
              className="bg-white border border-slate-200/90 hover:border-blue-400 p-4 rounded-2xl flex items-center justify-between cursor-pointer transition shadow-2xs hover:shadow group"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-blue-700 transition">
                    {dest.name}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {dest.dist}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{dest.area}</p>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-black border border-blue-200">
                  {dest.buses}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approaching Alert Banner if a bus is nearby */}
      {approachingBus && (
        <div className="bg-amber-50 border border-amber-300 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-black text-amber-950">
                  {language === 'TE' ? 'లైవ్ బస్సు అలర్ట్' : 'Live Approaching Bus Alert'}
                </h4>
                <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded">
                  {approachingBus.nextStopEtaMins || 2} MIN AWAY
                </span>
              </div>
              <p className="text-xs text-amber-900">
                Route {approachingBus.currentRoute?.routeNumber || '28'} ({approachingBus.busNumber}) is approaching <strong>{approachingBus.nextStopName || 'PM Palem Stop'}</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
            {onOpenApproachingModal && (
              <button
                onClick={onOpenApproachingModal}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                {language === 'TE' ? 'పూర్తి అలర్ట్ చూడండి' : 'Open Full Screen Alert'}
              </button>
            )}
            <button
              onClick={() => setActiveTab('live-tracking')}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-amber-300 text-amber-900 font-bold text-xs rounded-xl transition"
            >
              {language === 'TE' ? 'లైవ్ ట్రాక్ చేయండి' : 'Track Live'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
