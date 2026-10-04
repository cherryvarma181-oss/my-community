import React from 'react';
import { Bus, MapPin, Navigation, Bookmark, User, Compass, Layers, ShieldAlert, CheckCircle2, Scale, Database, FileText, Bell, Search, Shield, Key, Globe, Sparkles } from 'lucide-react';
import { ApsrtcLogo } from '../common/ApsrtcLogo';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';

interface ApsrtcNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenApproachingModal: () => void;
  onOpenApiHub?: () => void;
}

export const ApsrtcNavbar: React.FC<ApsrtcNavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenApproachingModal,
  onOpenApiHub
}) => {
  const { user, role, loginAsRole } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleRoleSwitch = (newRole: UserRole) => {
    loginAsRole(newRole);
    if (newRole === 'TRANSPORT_ADMIN') setActiveTab('admin-dashboard');
    else if (newRole === 'FIELD_SURVEYOR') setActiveTab('field-survey');
    else setActiveTab('passenger-home');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm sticky top-0 z-50 font-sans">
      
      {/* Top Banner Row (Exact brand header from Graphic) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100">
        
        {/* Brand Crest & Tagline */}
        <div 
          onClick={() => setActiveTab('passenger-home')}
          className="flex items-center space-x-3.5 cursor-pointer group"
        >
          <ApsrtcLogo size={48} className="shrink-0 drop-shadow-sm group-hover:scale-105 transition-transform" />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-blue-900 tracking-tight leading-none">
                {t('brand.title')}
              </h1>
              <span className="text-xs sm:text-sm font-extrabold text-blue-700 tracking-tight">
                {t('brand.tagline')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {t('brand.subtitle')}
            </p>
          </div>
        </div>

        {/* Center: Everyday Travel Callout */}
        <div className="hidden lg:flex items-center bg-blue-50 border border-blue-200/80 rounded-2xl px-4 py-2 space-x-3 shadow-2xs">
          <div className="text-right">
            <p className="text-xs font-bold text-blue-950 leading-tight">{t('brand.everyday')}</p>
            <p className="text-xs font-extrabold text-blue-700 leading-tight">{t('brand.noBooking')}</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Bus className="w-4 h-4" />
          </div>
        </div>

        {/* Right: Language Switcher, Service Badges & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
          
          {/* Real Language Switcher (EN / తెలుగు) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setLanguage('EN')}
              className={`px-2.5 py-1 rounded-lg transition ${
                language === 'EN'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('TE')}
              className={`px-2.5 py-1 rounded-lg transition ${
                language === 'TE'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              తెలుగు
            </button>
          </div>

          {/* 4 Service Type Badges from graphic */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-[10px] font-bold">
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              {t('badge.ordinary')}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              {t('badge.metroExpress')}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 hidden md:flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
              {t('badge.metroLiner')}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 hidden md:flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              {t('badge.palleVelugu')}
            </span>
          </div>

          {/* APSRTC API Key Hub Trigger */}
          {onOpenApiHub && (
            <button
              onClick={onOpenApiHub}
              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-xl text-xs font-bold flex items-center space-x-1 transition shadow-2xs"
              title="Configure real APSRTC API Key & GPS Feeds"
            >
              <Key className="w-3.5 h-3.5 text-blue-700" />
              <span className="hidden sm:inline">{t('nav.apiKey')}</span>
              <span className="sm:hidden">API</span>
            </button>
          )}

          {/* Screen 9 Approaching Alert Trigger */}
          <button
            onClick={onOpenApproachingModal}
            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-400/40 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-2xs"
            title="Click to test Screen 9 Bus Approaching Alert"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            <span className="hidden sm:inline">{t('nav.approachingAlert')}</span>
            <span className="sm:hidden">Alert</span>
          </button>

          {/* Replay Screen 1 Splash / Loading Screen */}
          <button
            onClick={() => setActiveTab('loading-screen')}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1 transition shadow-2xs"
            title="Replay Screen 1 Splash & Loading Screen"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Splash Screen</span>
            <span className="sm:hidden">Splash</span>
          </button>

          {/* Quick Role Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center space-x-1 text-[11px] font-semibold">
            <button
              onClick={() => handleRoleSwitch('PASSENGER')}
              className={`px-2.5 py-1 rounded-lg transition ${
                role === 'PASSENGER'
                  ? 'bg-blue-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('nav.passenger')}
            </button>
            <button
              onClick={() => handleRoleSwitch('TRANSPORT_ADMIN')}
              className={`px-2.5 py-1 rounded-lg transition ${
                role === 'TRANSPORT_ADMIN'
                  ? 'bg-indigo-700 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('nav.authority')}
            </button>
          </div>

        </div>

      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13 overflow-x-auto scrollbar-none py-1">
          
          {/* Passenger Navigation */}
          {role === 'PASSENGER' && (
            <nav className="flex items-center space-x-1 sm:space-x-2 text-xs font-semibold whitespace-nowrap">
              <button
                onClick={() => setActiveTab('passenger-home')}
                className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition ${
                  activeTab === 'passenger-home'
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>{t('nav.home')}</span>
              </button>

              <button
                onClick={() => setActiveTab('bus-search')}
                className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition ${
                  activeTab === 'bus-search'
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Bus className="w-4 h-4" />
                <span>{t('nav.buses')}</span>
              </button>

              <button
                onClick={() => setActiveTab('live-tracking')}
                className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition ${
                  activeTab === 'live-tracking'
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Navigation className="w-4 h-4 text-emerald-500" />
                <span>{t('nav.liveTracking')}</span>
              </button>

              <button
                onClick={() => setActiveTab('nearby-stops')}
                className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition ${
                  activeTab === 'nearby-stops'
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-4 h-4 text-purple-500" />
                <span>{t('nav.nearbyStops')}</span>
              </button>

              <button
                onClick={() => setActiveTab('saved-routes')}
                className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition ${
                  activeTab === 'saved-routes'
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Bookmark className="w-4 h-4 text-amber-500" />
                <span>{t('nav.savedRoutes')}</span>
              </button>

              <button
                onClick={() => setActiveTab('profile-settings')}
                className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition ${
                  activeTab === 'profile-settings'
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>{t('nav.profile')}</span>
              </button>
            </nav>
          )}

          {/* Transport Admin Navigation */}
          {role === 'TRANSPORT_ADMIN' && (
            <nav className="flex items-center space-x-1 text-xs font-semibold whitespace-nowrap overflow-x-auto">
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition ${
                  activeTab === 'admin-dashboard' ? 'bg-indigo-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Command Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('admin-gis-map')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition ${
                  activeTab === 'admin-gis-map' ? 'bg-cyan-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                <span>GIS Fleet Map</span>
              </button>
              <button
                onClick={() => setActiveTab('admin-underserved')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition ${
                  activeTab === 'admin-underserved' ? 'bg-rose-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span>Under-Served Detector</span>
              </button>
              <button
                onClick={() => setActiveTab('admin-recommendations')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition ${
                  activeTab === 'admin-recommendations' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>AI Recommendations</span>
              </button>
              <button
                onClick={() => setActiveTab('admin-data-upload')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition ${
                  activeTab === 'admin-data-upload' ? 'bg-indigo-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-indigo-500" />
                <span>ETM Data Ingestion</span>
              </button>
              <button
                onClick={() => setActiveTab('admin-reports')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition ${
                  activeTab === 'admin-reports' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Reports</span>
              </button>
            </nav>
          )}

          {/* Right: Commuter Badge */}
          <div className="hidden md:flex items-center space-x-2 text-xs text-slate-500 pl-4 border-l border-slate-200">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-[10px]">
              {role === 'TRANSPORT_ADMIN' ? 'ADM' : 'DV'}
            </div>
            <span className="font-semibold text-slate-700">
              {role === 'TRANSPORT_ADMIN' ? 'Transport Authority' : 'Durga Vaishnavi'}
            </span>
          </div>

        </div>
      </div>

    </header>
  );
};
