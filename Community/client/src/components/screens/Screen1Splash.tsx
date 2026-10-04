import React from 'react';
import { ApsrtcLogo } from '../common/ApsrtcLogo';
import { ArrowRight } from 'lucide-react';

interface Screen1SplashProps {
  onProceed?: () => void;
}

export const Screen1Splash: React.FC<Screen1SplashProps> = ({ onProceed }) => {
  return (
    <div className="flex-1 flex flex-col justify-between items-center text-center p-6 bg-gradient-to-b from-blue-50/50 via-white to-blue-100/60 relative overflow-hidden select-none">
      
      {/* Top Logo */}
      <div className="pt-3">
        <div className="p-1 rounded-full bg-white shadow-md inline-block">
          <ApsrtcLogo size={62} />
        </div>
      </div>

      {/* Bus Image Card */}
      <div className="w-full my-auto py-2">
        <div className="rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-slate-100">
          <img
            src="/apsrtc_bus.jpg"
            alt="APSRTC City Bus"
            className="w-full h-36 object-cover object-center"
          />
        </div>

        {/* Brand Text Block */}
        <div className="mt-5 space-y-1">
          <div className="flex justify-center">
            <ApsrtcLogo size={38} className="drop-shadow-xs" />
          </div>
          <h2 className="text-2xl font-black text-blue-950 tracking-tight mt-1">
            APSRTC
          </h2>
          <p className="text-xs text-blue-700 font-semibold tracking-wide">
            Smart Travel for a Better Tomorrow
          </p>
        </div>
      </div>

      {/* Bottom Wave Graphic / Proceed Button */}
      <div className="w-full pb-2">
        {onProceed ? (
          <button
            onClick={onProceed}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="h-6 w-full flex items-center justify-center">
            <span className="w-16 h-1 rounded-full bg-blue-300/60"></span>
          </div>
        )}
      </div>

    </div>
  );
};
