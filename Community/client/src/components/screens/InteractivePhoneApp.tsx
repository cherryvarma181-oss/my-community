import React, { useState } from 'react';
import { PhoneFrame } from './PhoneFrame';
import { Screen1Splash } from './Screen1Splash';
import { Screen2Home } from './Screen2Home';
import { Screen3SelectDestination } from './Screen3SelectDestination';
import { Screen4Results } from './Screen4Results';
import { Screen5BusDetails } from './Screen5BusDetails';
import { Screen6StopList } from './Screen6StopList';
import { Screen7MapView } from './Screen7MapView';
import { Screen8NearbyStops } from './Screen8NearbyStops';
import { Screen9BusApproachingAlert } from './Screen9BusApproachingAlert';
import { Screen10AlternativeBus } from './Screen10AlternativeBus';
import { Screen11LeaveHome } from './Screen11LeaveHome';
import { Screen12DelaysSkipped } from './Screen12DelaysSkipped';
import { Screen13SavedRoutes } from './Screen13SavedRoutes';
import { Screen14ProfileSettings } from './Screen14ProfileSettings';
import { ChevronLeft, ChevronRight, RotateCcw, AlertTriangle, Clock, MapPin, Bus } from 'lucide-react';

interface InteractivePhoneAppProps {
  initialScreen?: number;
}

export const InteractivePhoneApp: React.FC<InteractivePhoneAppProps> = ({
  initialScreen = 2
}) => {
  const [currentScreen, setCurrentScreen] = useState<number>(initialScreen);

  const screenNames: Record<number, string> = {
    1: 'Splash Screen',
    2: 'Home Screen',
    3: 'Select Destination',
    4: 'Results – All Buses for Route',
    5: 'Bus Details / Live Tracking',
    6: 'Complete Stop List',
    7: 'Map View – Live Location',
    8: 'Nearby Stops & Buses',
    9: 'Bus Approaching Alert',
    10: 'Alternative Bus Suggestion',
    11: 'Leave Home Guidance',
    12: 'Live Route – Delays / Skipped Stops',
    13: 'Saved Routes',
    14: 'Profile & Settings'
  };

  const handleBottomNav = (tab: 'HOME' | 'LIVE' | 'SAVED' | 'PROFILE') => {
    if (tab === 'HOME') setCurrentScreen(2);
    else if (tab === 'LIVE') setCurrentScreen(7);
    else if (tab === 'SAVED') setCurrentScreen(13);
    else if (tab === 'PROFILE') setCurrentScreen(14);
  };

  return (
    <div className="w-full bg-[#f1f5f9] min-h-[calc(100vh-80px)] py-8 px-4 flex flex-col items-center justify-center select-none">
      
      {/* Top Controller Strip */}
      <div className="max-w-xl w-full mb-6 bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
            {currentScreen}
          </span>
          <div>
            <p className="text-xs font-black text-slate-900 leading-tight">
              {screenNames[currentScreen]}
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              Interactive Prototype Experience
            </p>
          </div>
        </div>

        {/* Quick Stepper */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentScreen(p => Math.max(1, p - 1))}
            disabled={currentScreen === 1}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition"
            title="Previous Screen"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentScreen(1)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Reset to Splash"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentScreen(p => Math.min(14, p + 1))}
            disabled={currentScreen === 14}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition"
            title="Next Screen"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Phone Display */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 justify-center">
        
        {/* The Phone Device */}
        <PhoneFrame
          screenNumber={currentScreen}
          screenTitle={screenNames[currentScreen]}
          isDarkTheme={currentScreen === 9}
        >
          {currentScreen === 1 && (
            <Screen1Splash onProceed={() => setCurrentScreen(2)} />
          )}

          {currentScreen === 2 && (
            <Screen2Home
              onFindBuses={() => setCurrentScreen(4)}
              onOpenDestination={() => setCurrentScreen(3)}
              onOpenNearby={() => setCurrentScreen(8)}
              onOpenLive={() => setCurrentScreen(7)}
              onNavigate={handleBottomNav}
            />
          )}

          {currentScreen === 3 && (
            <Screen3SelectDestination
              onBack={() => setCurrentScreen(2)}
              onSelectDestination={() => setCurrentScreen(4)}
            />
          )}

          {currentScreen === 4 && (
            <Screen4Results
              onBack={() => setCurrentScreen(2)}
              onSelectBusCard={() => setCurrentScreen(5)}
            />
          )}

          {currentScreen === 5 && (
            <Screen5BusDetails
              onBack={() => setCurrentScreen(4)}
              onViewFullRoute={() => setCurrentScreen(6)}
              onOpenMap={() => setCurrentScreen(7)}
            />
          )}

          {currentScreen === 6 && (
            <Screen6StopList
              onBack={() => setCurrentScreen(5)}
              onOpenMap={() => setCurrentScreen(7)}
            />
          )}

          {currentScreen === 7 && (
            <Screen7MapView
              onBack={() => setCurrentScreen(5)}
              onSelectApproachingAlert={() => setCurrentScreen(9)}
            />
          )}

          {currentScreen === 8 && (
            <Screen8NearbyStops
              onBack={() => setCurrentScreen(2)}
              onSelectStop={() => setCurrentScreen(4)}
              onNavigate={handleBottomNav}
            />
          )}

          {currentScreen === 9 && (
            <Screen9BusApproachingAlert
              onViewMap={() => setCurrentScreen(7)}
              onDismiss={() => setCurrentScreen(2)}
            />
          )}

          {currentScreen === 10 && (
            <Screen10AlternativeBus
              onSelectAlternative={() => setCurrentScreen(5)}
              onKeepOriginal={() => setCurrentScreen(5)}
            />
          )}

          {currentScreen === 11 && (
            <Screen11LeaveHome
              onBack={() => setCurrentScreen(2)}
              onSetReminder={() => alert('Departure reminder set for 6:08 PM!')}
              onViewMap={() => setCurrentScreen(7)}
            />
          )}

          {currentScreen === 12 && (
            <Screen12DelaysSkipped
              onBack={() => setCurrentScreen(4)}
            />
          )}

          {currentScreen === 13 && (
            <Screen13SavedRoutes
              onBack={() => setCurrentScreen(2)}
              onSelectRoute={() => setCurrentScreen(4)}
              onNavigate={handleBottomNav}
            />
          )}

          {currentScreen === 14 && (
            <Screen14ProfileSettings
              onOpenSaved={() => setCurrentScreen(13)}
              onNavigate={handleBottomNav}
            />
          )}
        </PhoneFrame>

        {/* Side Screen Jump Palette (Quick test all scenarios) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 max-w-xs w-full">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Quick Screen Selector
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Instantly jump to any of the 14 designed screens:
            </p>
          </div>

          <div className="space-y-1.5 text-xs font-semibold max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
            {[
              { num: 1, name: 'Splash Screen', cat: 'Entry' },
              { num: 2, name: 'Home Screen', cat: 'Planner' },
              { num: 3, name: 'Select Destination', cat: 'Search' },
              { num: 4, name: 'Results – All Buses', cat: 'Search' },
              { num: 5, name: 'Bus Details / Tracking', cat: 'Live' },
              { num: 6, name: 'Complete Stop List', cat: 'Stops' },
              { num: 7, name: 'Map View – Live Location', cat: 'Map' },
              { num: 8, name: 'Nearby Stops & Buses', cat: 'Nearby' },
              { num: 9, name: 'Bus Approaching Alert', cat: 'Alert' },
              { num: 10, name: 'Alternative Bus Suggestion', cat: 'Smart' },
              { num: 11, name: 'Leave Home Guidance', cat: 'Smart' },
              { num: 12, name: 'Live Route – Delays/Skipped', cat: 'Live' },
              { num: 13, name: 'Saved Routes', cat: 'User' },
              { num: 14, name: 'Profile & Settings', cat: 'User' },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setCurrentScreen(s.num)}
                className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition ${
                  currentScreen === s.num
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className={`w-5 h-5 rounded-md text-[10px] font-black flex items-center justify-center ${
                    currentScreen === s.num ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {s.num}
                  </span>
                  <span className="truncate">{s.name}</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  currentScreen === s.num ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {s.cat}
                </span>
              </button>
            ))}
          </div>

          {/* Quick Scenario Triggers */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Test Key Features:</p>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
              <button
                onClick={() => setCurrentScreen(9)}
                className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-center"
              >
                Approaching Alert
              </button>
              <button
                onClick={() => setCurrentScreen(10)}
                className="p-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-center"
              >
                Alternative Bus
              </button>
              <button
                onClick={() => setCurrentScreen(11)}
                className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-center"
              >
                Leave Home Guide
              </button>
              <button
                onClick={() => setCurrentScreen(12)}
                className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-center"
              >
                Skipped Stop Alert
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
