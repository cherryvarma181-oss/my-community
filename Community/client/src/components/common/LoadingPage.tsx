import React, { useEffect, useState } from 'react';
import { Bus, Navigation, ArrowRight, Radio, CheckCircle2, Zap, ShieldCheck, Sparkles, Compass } from 'lucide-react';
import { ApsrtcLogo } from './ApsrtcLogo';
import { useLanguage } from '../../context/LanguageContext';

interface LoadingPageProps {
  onComplete?: () => void;
  autoTransition?: boolean;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  onComplete,
  autoTransition = true
}) => {
  const { t, language, setLanguage } = useLanguage();
  const [progress, setProgress] = useState(15);
  const [statusIndex, setStatusIndex] = useState(0);

  const statusMessages = [
    { en: 'Initializing APSRTC Smart Travel Engine...', te: 'ఏపీఎస్‌ఆర్‌టీసీ స్మార్ట్ ట్రావెల్ ఇంజిన్ ప్రారంభమవుతోంది...' },
    { en: 'Connecting to Visakhapatnam VTS & Telemetry Network...', te: 'విశాఖపట్నం వీటీఎస్ & టెలిమెట్రీ నెట్‌వర్క్‌తో అనుసంధానిస్తోంది...' },
    { en: 'Synchronizing Real-Time GPS Satellite Fleet...', te: 'నిజ సమయ జీపీఎస్ ఉపగ్రహ ఫ్లీట్‌ను సింక్ చేస్తోంది...' },
    { en: 'Loading Transit Corridors (Route 28, 32, 45, 111)...', te: 'బస్ కారిడార్లు (రూట్ 28, 32, 45, 111) లోడ్ అవుతున్నాయి...' },
    { en: 'Connected! Ready to Depart.', te: 'అనుసంధానం పూర్తయింది! ప్రయాణానికి సిద్ధం.' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.floor(Math.random() * 16) + 12;
        return Math.min(prev + increment, 100);
      });
    }, 420);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 30) setStatusIndex(0);
    else if (progress < 55) setStatusIndex(1);
    else if (progress < 80) setStatusIndex(2);
    else if (progress < 99) setStatusIndex(3);
    else setStatusIndex(4);

    if (progress >= 100 && autoTransition && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [progress, autoTransition, onComplete]);

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center bg-gradient-to-br from-[#bed6f7] via-[#dcebfb] to-[#b4d2f6] text-slate-900 select-none relative overflow-hidden font-sans p-4 sm:p-6 lg:p-8">
      
      {/* Top-Right Navy Accent Block (Faithful to the official graphic) */}
      <div className="absolute top-0 right-0 w-44 sm:w-64 md:w-80 h-16 sm:h-24 md:h-28 bg-[#001763] rounded-bl-[45px] sm:rounded-bl-[70px] shadow-lg pointer-events-none z-0" />

      {/* Bottom-Right Navy Accent Block (Faithful to the official graphic) */}
      <div className="absolute bottom-0 right-0 w-52 sm:w-72 md:w-96 h-16 sm:h-24 md:h-28 bg-[#001763] rounded-tl-[45px] sm:rounded-tl-[70px] shadow-lg pointer-events-none z-0" />

      {/* Top Header Bar: Telemetry Badge & Commuter Language Toggle */}
      <div className="w-full max-w-6xl flex items-center justify-between z-20">
        <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-blue-200/80 text-xs font-bold text-blue-950 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>MoRTH AIS-140 • APSRTC VTS</span>
        </div>

        {/* English / Telugu Language Switcher */}
        <div className="flex items-center bg-white/80 backdrop-blur-md p-1 rounded-full border border-blue-200/80 text-xs font-bold shadow-xs">
          <button
            onClick={() => setLanguage('EN')}
            className={`px-3 py-1 rounded-full transition ${
              language === 'EN'
                ? 'bg-[#001763] text-white shadow-2xs'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('TE')}
            className={`px-3 py-1 rounded-full transition ${
              language === 'TE'
                ? 'bg-[#001763] text-white shadow-2xs'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            తెలుగు
          </button>
        </div>
      </div>

      {/* Main Hero Card Container: Matching the exact banner composition */}
      <div className="w-full max-w-6xl my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 py-6">
        
        {/* Left Column (7 cols on lg): Concentric Radar Waves + Emblem + VTS / APSMART Title */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left relative">
          
          {/* Concentric Radar Ripple Signal Rings (Exact visual effect from image) */}
          <div className="relative mb-4 flex items-center justify-center">
            <div className="absolute w-[180px] h-[180px] rounded-full border border-white/70 animate-ping opacity-60 pointer-events-none" />
            <div className="absolute w-[240px] h-[240px] rounded-full border border-white/60 pointer-events-none" />
            <div className="absolute w-[320px] h-[320px] rounded-full border border-white/50 pointer-events-none" />
            <div className="absolute w-[420px] h-[420px] rounded-full border border-white/40 pointer-events-none" />
            <div className="absolute w-[530px] h-[530px] rounded-full border border-white/25 pointer-events-none" />

            {/* Official APSRTC Crest Logo */}
            <div className="relative z-10 p-2.5 rounded-full bg-white shadow-xl border-2 border-white/90">
              <ApsrtcLogo size={105} className="drop-shadow-md" />
            </div>
          </div>

          {/* Main Huge Acronym Title: APSMART / VTS */}
          <div className="space-y-1 relative z-10">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-[#001763] tracking-widest leading-none drop-shadow-xs">
                APSMART
              </h1>
              <span className="px-3 py-1 rounded-xl bg-blue-700 text-white font-mono font-bold text-xs tracking-wider shadow-sm">
                VTS 2.0
              </span>
            </div>

            {/* Exact Subtitle Style from Graphic: VEHICLE TRACKING SYSTEM -> Relates to our site */}
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-[#001763] tracking-wider uppercase drop-shadow-xs pt-1">
              VEHICLE TRACKING & TRANSIT INTELLIGENCE
            </h2>

            {/* Site Slogan & Everyday Commuter Subtitle */}
            <p className="text-sm sm:text-base font-extrabold text-blue-900 tracking-wide mt-1">
              {language === 'TE' ? 'మెరుగైన రేపటి కోసం స్మార్ట్ ప్రయాణం' : 'Smart Travel for a Better Tomorrow'}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              {language === 'TE'
                ? 'మీ ప్రయాణం - మా సేవ • రోజువారీ ప్రయాణం. బుకింగ్ అక్కర్లేదు.'
                : 'Your Journey. Our Service. • For everyday travel. No booking. Just board.'}
            </p>
          </div>

          {/* 4 Service Livery Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-3">
            <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-black text-xs shadow-2xs flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>{t('badge.ordinary')}</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-2xs flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>{t('badge.metroExpress')}</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-purple-600 text-white font-black text-xs shadow-2xs flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>{t('badge.metroLiner')}</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-orange-600 text-white font-black text-xs shadow-2xs flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>{t('badge.palleVelugu')}</span>
            </span>
          </div>

          {/* Exact "Powered by" row from the Graphic, adapted to our site */}
          <div className="mt-5 flex items-center justify-center lg:justify-start space-x-2 text-xs sm:text-sm font-bold text-slate-800">
            <span className="text-slate-600">Powered by</span>
            <span className="text-base sm:text-lg font-black text-[#dc2626] tracking-tight">
              APSRTC Live Telemetry
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-extrabold text-[#001763] uppercase bg-white/70 px-2 py-0.5 rounded-md border border-blue-200">
              AIS-140 GPS
            </span>
          </div>

        </div>

        {/* Right Column (5 cols on lg): Authentic Angled Bus Image with Drop Shadow */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          
          {/* Subtle Background Glow behind bus */}
          <div className="absolute w-72 h-72 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* High-Resolution Angled Bus from the user's graphic */}
          <div className="relative w-full max-w-md lg:max-w-none flex flex-col items-center group">
            <img
              src="/apsrtc_bus_transparent.png"
              alt="APSRTC City Bus"
              className="w-full h-auto object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                // Fallback to apsrtc_bus_side or apsrtc_bus.jpg if transparent png has issue
                (e.target as HTMLImageElement).src = '/apsrtc_vts_bus_panel.png';
              }}
            />

            {/* Live GPS Telemetry Badge below bus */}
            <div className="mt-2 flex items-center space-x-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-blue-200/90 shadow-sm text-xs font-bold text-[#001763]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Live Fleet Tracking • Visakhapatnam Corridors</span>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Bar: Animated Loading Progress & Action Button */}
      <div className="w-full max-w-4xl z-20 flex flex-col items-center space-y-3 pb-2">
        
        {/* Progress bar track */}
        <div className="w-full bg-white/80 backdrop-blur-sm rounded-full h-3 p-0.5 border border-blue-200 shadow-inner overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 h-full rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic Status Caption & Percent */}
        <div className="w-full flex items-center justify-between text-xs font-bold text-slate-800 px-1">
          <span className="flex items-center space-x-2 text-blue-900 font-mono text-xs truncate max-w-[340px] sm:max-w-md">
            {progress < 100 ? (
              <Radio className="w-4 h-4 text-blue-700 animate-pulse shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span className="truncate">
              {language === 'TE' ? statusMessages[statusIndex].te : statusMessages[statusIndex].en}
            </span>
          </span>
          <span className="font-mono font-black text-blue-950 text-sm">{progress}%</span>
        </div>

        {/* Proceed / Skip Action Button */}
        {onComplete && (
          <div className="pt-1 w-full max-w-md">
            <button
              onClick={onComplete}
              className={`w-full py-3.5 font-black text-sm rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition ${
                progress >= 100
                  ? 'bg-gradient-to-r from-[#001763] via-blue-700 to-emerald-700 text-white shadow-blue-900/30 hover:scale-[1.02]'
                  : 'bg-white/80 hover:bg-white text-[#001763] border border-blue-300 shadow-sm'
              }`}
            >
              <span>
                {progress >= 100
                  ? (language === 'TE' ? 'పోర్టల్‌లోకి ప్రవేశించండి →' : 'Enter Smart Travel Portal →')
                  : (language === 'TE' ? 'ఇప్పుడే ప్రారంభించండి' : 'Get Started Now')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
