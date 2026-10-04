import React, { useState } from 'react';
import { User, Bell, Globe, Shield, HelpCircle, Phone, FileText, ChevronRight, Check, Sparkles, Bookmark, Settings as SettingsIcon, Key } from 'lucide-react';
import { ApsrtcLogo } from '../components/common/ApsrtcLogo';
import { useLanguage } from '../context/LanguageContext';

interface ProfileSettingsProps {
  setActiveTab: (tab: string) => void;
  onOpenApiHub?: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ setActiveTab, onOpenApiHub }) => {
  const { language, setLanguage, t } = useLanguage();
  const [approachingAlertEnabled, setApproachingAlertEnabled] = useState(true);
  const [leaveHomeAlertEnabled, setLeaveHomeAlertEnabled] = useState(true);
  const [delaysAlertEnabled, setDelaysAlertEnabled] = useState(true);

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 py-6 font-sans">
      
      {/* Profile Header Card (Screen 14 Style) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-600/20 shrink-0">
          DV
        </div>

        {/* User Details */}
        <div className="text-center sm:text-left space-y-1 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
            <h2 className="text-2xl font-black text-slate-900">{t('profile.title')}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 self-center sm:self-auto">
              {t('profile.badge')}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">@durga.v • +91 98765 43210</p>
          <p className="text-xs text-slate-600 pt-1">
            {language === 'TE' ? 'ప్రధాన మార్గం:' : 'Primary Corridor:'} <strong className="text-slate-800">Madhurawada ↔ RTC Complex (Route 28 & 32)</strong>
          </p>
        </div>

        {/* Saved Count & API Button */}
        <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
          <button
            onClick={() => setActiveTab('saved-routes')}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center space-x-1.5 transition"
          >
            <Bookmark className="w-4 h-4 text-blue-600" />
            <span>4 {t('nav.savedRoutes')}</span>
          </button>

          {onOpenApiHub && (
            <button
              onClick={onOpenApiHub}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold text-blue-800 flex items-center space-x-1.5 transition"
            >
              <Key className="w-4 h-4 text-blue-600" />
              <span>APSRTC API Key</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('loading-screen')}
            className="px-4 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-xs font-bold text-purple-800 flex items-center space-x-1.5 transition"
            title="View Screen 1 Splash & Loading Screen"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Splash Screen</span>
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Language Selection */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">{t('profile.langTitle')}</h3>
              <p className="text-xs text-slate-500">{t('profile.langDesc')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => setLanguage('EN')}
              className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${
                language === 'EN'
                  ? 'bg-blue-50 border-blue-500 text-blue-900 font-black shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div>
                <p className="text-sm font-bold">English</p>
                <p className="text-[10px] text-slate-500">Default interface</p>
              </div>
              {language === 'EN' && <Check className="w-4 h-4 text-blue-600" />}
            </button>

            <button
              onClick={() => setLanguage('TE')}
              className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${
                language === 'TE'
                  ? 'bg-blue-50 border-blue-500 text-blue-900 font-black shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div>
                <p className="text-sm font-bold">తెలుగు (Telugu)</p>
                <p className="text-[10px] text-slate-500">స్థానిక అనువాదం</p>
              </div>
              {language === 'TE' && <Check className="w-4 h-4 text-blue-600" />}
            </button>
          </div>
        </div>

        {/* Smart Commuter Notifications */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">{t('profile.alertsTitle')}</h3>
              <p className="text-xs text-slate-500">Real-time alerts for your active journeys</p>
            </div>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70 cursor-pointer">
              <div>
                <p className="font-bold text-slate-800">Bus Approaching Alert (2 min)</p>
                <p className="text-[11px] text-slate-500">Ring & vibration when bus is 1 stop away</p>
              </div>
              <input
                type="checkbox"
                checked={approachingAlertEnabled}
                onChange={(e) => setApproachingAlertEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70 cursor-pointer">
              <div>
                <p className="font-bold text-slate-800">Leave Home Countdown Guidance</p>
                <p className="text-[11px] text-slate-500">Includes walking time + live bus arrival</p>
              </div>
              <input
                type="checkbox"
                checked={leaveHomeAlertEnabled}
                onChange={(e) => setLeaveHomeAlertEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70 cursor-pointer">
              <div>
                <p className="font-bold text-slate-800">Route Delays & Skipped Stops Alerts</p>
                <p className="text-[11px] text-slate-500">Direct notifications from depot control</p>
              </div>
              <input
                type="checkbox"
                checked={delaysAlertEnabled}
                onChange={(e) => setDelaysAlertEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* APSRTC Passenger Support & Helpline */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">{t('profile.helpline')}</h3>
              <p className="text-xs text-slate-500">24x7 Andhra Pradesh Transit Helpline</p>
            </div>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-bold text-emerald-950">{t('profile.tollFree')}</p>
                <p className="text-sm font-black text-emerald-700">1800 200 4599 / 0866-2570005</p>
              </div>
              <a
                href="tel:18002004599"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition"
              >
                Call
              </a>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Visakhapatnam Regional Depot</p>
                <p className="text-xs text-slate-500">Dwaraka Bus Station (RTC Complex), Vizag</p>
              </div>
              <span className="text-xs font-mono text-slate-600">0891-2746400</span>
            </div>
          </div>
        </div>

        {/* About APSRTC Smart Travel */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <ApsrtcLogo size={36} />
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">About APSRTC Smart Mobility</h3>
              <p className="text-xs text-slate-500">Andhra Pradesh State Road Transport Corporation</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 leading-relaxed pt-1">
            <p>
              <strong>Same Buses. Smarter Journey.</strong> Unified real-time GPS tracking and route intelligence across all City Ordinary, Metro Express, Metro Liner, and Palle Velugu services.
            </p>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between mt-2">
              <span className="text-blue-900 font-bold">App Version</span>
              <span className="font-mono text-blue-700 font-semibold">v3.5.0 (Visakhapatnam Smart City Pilot)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
