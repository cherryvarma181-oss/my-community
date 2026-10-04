import React from 'react';
import { Bus, Shield, MapPin, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-white font-bold text-base mb-2">
              <Bus className="w-5 h-5 text-blue-500" />
              <span>APSMART TRANSIT</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Smart Bus Route Utilisation & City Mobility Intelligence System for APSRTC City Bus Transport Network.
            </p>
          </div>
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">Core Pipeline</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Passenger Boarding/Alighting Survey</li>
              <li>• Route Utilisation Analysis</li>
              <li>• Under-Served Area Detection</li>
              <li>• Data-Driven Recommendation Engine</li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">Domain Context</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• City Ordinary & Metro Express</li>
              <li>• Metro Deluxe & Palle Velugu</li>
              <li>• Visakhapatnam Smart City Corridor</li>
              <li>• APSRTC Standard Operations</li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">System Status</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-md text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Database: 14,000+ Live Survey Records</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-950/50 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-md text-[11px]">
                <Database className="w-3.5 h-3.5" />
                <span>Deterministic Utilisation Engine Active</span>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 APSMART – Bus Route Intelligence. Problem Statement ID: PS050.</p>
          <p className="mt-2 md:mt-0 font-mono">COLLECT → ANALYZE → MAP → IDENTIFY → RECOMMEND → IMPROVE</p>
        </div>
      </div>
    </footer>
  );
};
