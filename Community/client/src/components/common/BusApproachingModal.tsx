import React from 'react';
import { Bell, MapPin, Navigation, X, Clock, Bus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface BusApproachingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewOnMap: () => void;
  routeNumber?: string;
  serviceType?: string;
  etaMinutes?: number;
  stopName?: string;
  regNumber?: string;
}

export const BusApproachingModal: React.FC<BusApproachingModalProps> = ({
  isOpen,
  onClose,
  onViewOnMap,
  routeNumber = '28',
  serviceType = 'City Ordinary',
  etaMinutes = 2,
  stopName = 'PM Palem Stop',
  regNumber = 'AP 39 Z 3487'
}) => {
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 overflow-hidden">
        
        {/* Amber Glow background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pulsing Bell Icon (Screen 9 Style) */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping opacity-75" />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30">
            <Bell className="w-8 h-8 animate-bounce" />
          </div>
        </div>

        {/* Alert Content */}
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
            {t('alert.badge')}
          </span>
          <h3 className="text-2xl font-black text-white tracking-tight">
            {t('alert.approaching')}
          </h3>
          <p className="text-sm font-semibold text-slate-300">
            Route {routeNumber} – <span className="text-blue-400 font-bold">{serviceType}</span>
          </p>
        </div>

        {/* Time & Stop Details Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{t('alert.eta')}</span>
            </div>
            <span className="text-sm font-black text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/30">
              {etaMinutes} {language === 'TE' ? 'నిమిషాలు' : 'minutes'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{t('alert.currentPos')}</span>
            </div>
            <span className="text-xs font-bold text-white">
              {stopName}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Bus className="w-4 h-4 text-cyan-400" />
              <span>{t('alert.reg')}</span>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-300">
              {regNumber}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => {
              onClose();
              onViewOnMap();
            }}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition"
          >
            <Navigation className="w-4 h-4" />
            <span>{t('alert.viewOnMap')}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
          >
            {t('alert.dismiss')}
          </button>
        </div>

      </div>
    </div>
  );
};
