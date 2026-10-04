import React from 'react';
import { Bookmark, Bus, ArrowRight, Clock, MapPin, Sparkles, Navigation, Plus } from 'lucide-react';
import { Route } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SavedRoutesProps {
  routes: Route[];
  setActiveTab: (tab: string) => void;
  onSearch: (from: string, to: string) => void;
}

export const SavedRoutes: React.FC<SavedRoutesProps> = ({
  routes,
  setActiveTab,
  onSearch
}) => {
  const { t, language } = useLanguage();

  // Screen 13 Authentic saved routes list
  const savedRoutesList = [
    {
      id: 'saved-1',
      from: 'Madhurawada',
      to: 'RTC Complex',
      routesAvailable: ['28', '32', '45'],
      frequency: language === 'TE' ? 'ప్రతి 8 నిమిషాలకు' : 'Every 8 mins',
      avgTravelTime: language === 'TE' ? '28 నిమిషాలు' : '28 mins',
      distance: '6.3 km',
      serviceTypes: [t('badge.ordinary'), t('badge.metroExpress'), t('badge.metroLiner')],
      nextBusEta: language === 'TE' ? '4 నిమిషాలు' : '4 min'
    },
    {
      id: 'saved-2',
      from: 'Gajuwaka',
      to: 'Dwaraka Nagar',
      routesAvailable: ['400', '400H'],
      frequency: language === 'TE' ? 'ప్రతి 10 నిమిషాలకు' : 'Every 10 mins',
      avgTravelTime: language === 'TE' ? '42 నిమిషాలు' : '42 mins',
      distance: '18 km',
      serviceTypes: [t('badge.metroExpress')],
      nextBusEta: language === 'TE' ? '7 నిమిషాలు' : '7 min'
    },
    {
      id: 'saved-3',
      from: 'Visakhapatnam Railway Station',
      to: 'Gajuwaka Old Post Office',
      routesAvailable: ['38', '38D'],
      frequency: language === 'TE' ? 'ప్రతి 12 నిమిషాలకు' : 'Every 12 mins',
      avgTravelTime: language === 'TE' ? '45 నిమిషాలు' : '45 mins',
      distance: '22 km',
      serviceTypes: [t('badge.ordinary'), t('badge.metroExpress')],
      nextBusEta: language === 'TE' ? '9 నిమిషాలు' : '9 min'
    },
    {
      id: 'saved-4',
      from: 'College Road (AU Campus)',
      to: 'Beach Road (RK Beach)',
      routesAvailable: ['10K', '25K'],
      frequency: language === 'TE' ? 'ప్రతి 15 నిమిషాలకు' : 'Every 15 mins',
      avgTravelTime: language === 'TE' ? '20 నిమిషాలు' : '20 mins',
      distance: '12 km',
      serviceTypes: [t('badge.ordinary')],
      nextBusEta: language === 'TE' ? '12 నిమిషాలు' : '12 min'
    }
  ];

  const handleRouteClick = (from: string, to: string) => {
    onSearch(from, to);
    setActiveTab('bus-search');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      
      {/* Header Bar (Screen 13 Style: "My Saved Routes") */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-amber-700 font-extrabold uppercase tracking-wider">
            <span>Frequent Commutes</span>
            <span>•</span>
            <span>Screen 13 Saved</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-center space-x-2">
            <Bookmark className="w-7 h-7 text-amber-600" />
            <span>{t('saved.title')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('saved.subtitle')}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('passenger-home')}
          className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t('saved.saveNew')}</span>
        </button>
      </div>

      {/* Saved Route Cards matching Screen 13 */}
      <div className="space-y-4">
        {savedRoutesList.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-3xl p-6 shadow-sm hover:shadow-md transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Origin -> Destination */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5">
                  <h3 className="text-lg font-black text-slate-900">
                    {item.from} <span className="text-slate-400">→</span> {item.to}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-slate-600">Available Routes:</span>
                  {item.routesAvailable.map((r, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-900 font-black text-xs border border-blue-200"
                    >
                      Route {r}
                    </span>
                  ))}
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 font-medium">{item.distance}</span>
                </div>
              </div>

              {/* ETA & Quick Action */}
              <div className="flex items-center space-x-3 self-end sm:self-auto">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Next Bus ETA</p>
                  <p className="text-base font-black text-emerald-700">~{item.nextBusEta}</p>
                </div>

                <button
                  onClick={() => handleRouteClick(item.from, item.to)}
                  className="px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center space-x-2"
                >
                  <span>{t('saved.checkLive')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Travel stats footer */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Headway: <strong className="text-slate-700">{item.frequency}</strong></span>
              </span>
              <span>Average Transit Duration: <strong className="text-slate-700">{item.avgTravelTime}</strong></span>
              <span>Services: {item.serviceTypes.join(', ')}</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
