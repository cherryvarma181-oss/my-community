import React, { useState } from 'react';
import { Bus as BusIcon, Filter, MapPin, Clock, Navigation, AlertTriangle, ShieldCheck, ArrowRight, Bookmark, AlertCircle, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { Bus, Route } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BusSearchProps {
  buses: Bus[];
  routes: Route[];
  fromQuery: string;
  toQuery: string;
  onSelectBus: (bus: Bus) => void;
  setActiveTab: (tab: string) => void;
}

export const BusSearch: React.FC<BusSearchProps> = ({
  buses,
  routes,
  fromQuery,
  toQuery,
  onSelectBus,
  setActiveTab
}) => {
  const { t, language } = useLanguage();
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [dismissDelayAlert, setDismissDelayAlert] = useState<boolean>(false);

  const displayFrom = fromQuery || 'Madhurawada';
  const displayTo = toQuery || 'RTC Complex';

  // Filter buses by busType and search query
  const filteredBuses = buses.filter(bus => {
    const typeMatch =
      selectedType === 'ALL' ||
      bus.busType === selectedType ||
      (selectedType === 'ORDINARY' && bus.busType === 'ORDINARY') ||
      (selectedType === 'METRO_EXPRESS' && bus.busType === 'METRO_EXPRESS') ||
      (selectedType === 'METRO_LINER' && (bus.busType === 'METRO_DELUXE' || bus.busType === 'METRO_EXPRESS')) ||
      (selectedType === 'PALLE_VELUGU' && bus.busType === 'PALLE_VELUGU');

    return typeMatch;
  });

  const getServiceBadge = (busType: string) => {
    switch (busType) {
      case 'ORDINARY':
        return {
          name: t('badge.ordinary'),
          color: 'bg-blue-600 text-white',
          border: 'border-blue-200',
          bgLight: 'bg-blue-50',
          textColor: 'text-blue-700'
        };
      case 'METRO_EXPRESS':
        return {
          name: t('badge.metroExpress'),
          color: 'bg-emerald-600 text-white',
          border: 'border-emerald-200',
          bgLight: 'bg-emerald-50',
          textColor: 'text-emerald-700'
        };
      case 'METRO_DELUXE':
      case 'METRO_LINER':
        return {
          name: t('badge.metroLiner'),
          color: 'bg-purple-600 text-white',
          border: 'border-purple-200',
          bgLight: 'bg-purple-50',
          textColor: 'text-purple-700'
        };
      case 'PALLE_VELUGU':
      default:
        return {
          name: t('badge.palleVelugu'),
          color: 'bg-amber-600 text-white',
          border: 'border-amber-200',
          bgLight: 'bg-amber-50',
          textColor: 'text-amber-700'
        };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      
      {/* Header Bar (Screen 4 Style: "Madhurawada → RTC Complex") */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-blue-700 font-extrabold uppercase tracking-wider">
            <span>{t('search.corridorTitle')}</span>
            <span>•</span>
            <span>{filteredBuses.length} {t('search.busesAvailable')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-center space-x-2">
            <span>{displayFrom}</span>
            <span className="text-slate-400">→</span>
            <span>{displayTo}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('search.noReservation')}
          </p>
        </div>

        {/* Filter Tabs matching Screen 4 */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            onClick={() => setSelectedType('ALL')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
              selectedType === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('search.allBuses')} ({buses.length})
          </button>

          <button
            onClick={() => setSelectedType('ORDINARY')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center space-x-1 ${
              selectedType === 'ORDINARY'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-blue-800 hover:bg-blue-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span>{t('badge.ordinary')}</span>
          </button>

          <button
            onClick={() => setSelectedType('METRO_EXPRESS')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center space-x-1 ${
              selectedType === 'METRO_EXPRESS'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{t('badge.metroExpress')}</span>
          </button>

          <button
            onClick={() => setSelectedType('METRO_LINER')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center space-x-1 ${
              selectedType === 'METRO_LINER'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-purple-800 hover:bg-purple-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            <span>{t('badge.metroLiner')}</span>
          </button>

          <button
            onClick={() => setSelectedType('PALLE_VELUGU')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center space-x-1 ${
              selectedType === 'PALLE_VELUGU'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-amber-800 hover:bg-amber-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>{t('badge.palleVelugu')}</span>
          </button>
        </div>
      </div>

      {/* Screen 10: Alternative Bus Suggestion Banner (When delayed!) */}
      {!dismissDelayAlert && (
        <div className="bg-amber-50 border border-amber-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black uppercase text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                    {t('search.delayWarning')}
                  </span>
                  <span className="text-xs font-bold text-slate-600">Route 28 ({t('badge.ordinary')})</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {t('search.altTitle')}
                </h3>
                <p className="text-xs text-slate-600">
                  {t('search.altDesc')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setDismissDelayAlert(true)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Dismiss
            </button>
          </div>

          {/* 2 Alternative Bus Options matching Screen 10 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            
            {/* Alt 1: Route 45 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-black text-xs">
                    45
                  </span>
                  <span className="font-bold text-slate-800 text-xs">{t('badge.ordinary')}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                    {t('search.boardNow')}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  ETA: <strong className="text-emerald-700">2 min away</strong> • {t('search.lowCrowd')} • AP 39 Z 8821
                </p>
              </div>

              <button
                onClick={() => {
                  const alt = buses.find(b => b.busType === 'ORDINARY') || buses[0];
                  onSelectBus(alt);
                  setActiveTab('bus-details');
                }}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition"
              >
                {t('search.boardNow')}
              </button>
            </div>

            {/* Alt 2: Route 32 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-black text-xs">
                    32
                  </span>
                  <span className="font-bold text-slate-800 text-xs">{t('badge.metroExpress')}</span>
                  <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold">
                    Fast Transit
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  ETA: <strong className="text-blue-700">5 min away</strong> • {t('search.modCrowd')} • AP 31 Z 9042
                </p>
              </div>

              <button
                onClick={() => {
                  const alt = buses.find(b => b.busType === 'METRO_EXPRESS') || buses[1] || buses[0];
                  onSelectBus(alt);
                  setActiveTab('bus-details');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl border border-slate-300 transition"
              >
                {t('search.viewDetails')}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Screen 4 Bus Cards Grid */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base">Active Buses on Route</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuses.map((bus, idx) => {
            const badge = getServiceBadge(bus.busType);
            const routeNum = bus.currentRoute?.routeNumber || (idx === 0 ? '28' : idx === 1 ? '32' : idx === 2 ? '45' : '111');
            const eta = bus.nextStopEtaMins || (idx === 0 ? 5 : idx * 4 + 3);
            const dist = (eta * 0.3).toFixed(1);

            return (
              <div
                key={bus.id}
                className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3.5">
                  
                  {/* Top Row: Route Pill + Service Badge */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className={`w-11 h-11 rounded-2xl ${badge.color} font-black text-lg flex items-center justify-center shadow-sm`}>
                        {routeNum}
                      </span>
                      <div>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${badge.border} ${badge.bgLight} ${badge.textColor}`}>
                          {badge.name}
                        </span>
                        <h4 className="text-base font-black text-slate-900 mt-0.5">
                          {bus.busNumber}
                        </h4>
                      </div>
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border ${
                      bus.occupancyStatus === 'FULL'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : bus.occupancyStatus === 'HIGH'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {bus.occupancyStatus === 'LOW' ? t('search.lowCrowd') : bus.occupancyStatus === 'MEDIUM' ? t('search.modCrowd') : t('search.heavyCrowd')}
                    </span>
                  </div>

                  {/* ETA & Approaching Info (Screen 4 Card) */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-semibold flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{t('search.arrivingAtStop')}</span>
                      </span>
                      <span className="text-sm font-black text-blue-800">
                        In {eta} min ({dist} km)
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
                      <span className="text-slate-500 font-medium">{t('search.nextStop')}</span>
                      <span className="font-bold text-slate-800">{bus.nextStopName || 'PM Palem'}</span>
                    </div>
                  </div>

                  {/* Route Corridor & Speed info */}
                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <span className="truncate max-w-[180px]">
                      {bus.currentRoute?.origin || 'Madhurawada'} → {bus.currentRoute?.destination || 'RTC Complex'}
                    </span>
                    <span className="font-semibold text-slate-700 flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-cyan-600" />
                      <span>{bus.speed} km/h</span>
                    </span>
                  </div>

                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
                  <button
                    onClick={() => {
                      onSelectBus(bus);
                      setActiveTab('bus-details');
                    }}
                    className="flex-1 py-3 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5"
                  >
                    <span>{t('search.liveTrackBtn')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
