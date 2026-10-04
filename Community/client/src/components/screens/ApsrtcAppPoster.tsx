import React from 'react';
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
import { PosterBottomComparison } from '../common/PosterBottomComparison';

interface ApsrtcAppPosterProps {
  onOpenScreenInInteractive?: (screenNumber: number) => void;
}

export const ApsrtcAppPoster: React.FC<ApsrtcAppPosterProps> = ({
  onOpenScreenInInteractive
}) => {
  return (
    <div className="w-full bg-[#f8fafc] text-slate-900 pb-16">
      
      {/* 14 Mobile Screens Gallery Section */}
      <div className="max-w-[1850px] mx-auto px-4 sm:px-6 pt-6 pb-12">
        
        {/* Row 1: Screens 1 to 7 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>Passenger Journey Flow (Screens 1 – 7)</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Click any screen title to test interactively</span>
          </div>

          <div className="flex items-start gap-5 overflow-x-auto pb-6 pt-2 scrollbar-thin scrollbar-thumb-slate-300">
            {/* Screen 1 */}
            <PhoneFrame
              screenNumber={1}
              screenTitle="Splash Screen"
              onClickHeader={() => onOpenScreenInInteractive && onOpenScreenInInteractive(1)}
            >
              <Screen1Splash onProceed={() => onOpenScreenInInteractive && onOpenScreenInInteractive(2)} />
            </PhoneFrame>

            {/* Screen 2 */}
            <PhoneFrame
              screenNumber={2}
              screenTitle="Home Screen"
              onClickHeader={() => onOpenScreenInInteractive && onOpenScreenInInteractive(2)}
            >
              <Screen2Home
                onFindBuses={() => onOpenScreenInInteractive && onOpenScreenInInteractive(4)}
                onOpenDestination={() => onOpenScreenInInteractive && onOpenScreenInInteractive(3)}
                onOpenNearby={() => onOpenScreenInInteractive && onOpenScreenInInteractive(8)}
                onOpenLive={() => onOpenScreenInInteractive && onOpenScreenInInteractive(7)}
                onNavigate={(tab) => {
                  if (tab === 'LIVE') onOpenScreenInInteractive && onOpenScreenInInteractive(7);
                  else if (tab === 'SAVED') onOpenScreenInInteractive && onOpenScreenInInteractive(13);
                  else if (tab === 'PROFILE') onOpenScreenInInteractive && onOpenScreenInInteractive(14);
                }}
              />
            </PhoneFrame>

            {/* Screen 3 */}
            <PhoneFrame
              screenNumber={3}
              screenTitle="Select Destination"
              onClickHeader={() => onOpenScreenInInteractive && onOpenScreenInInteractive(3)}
            >
              <Screen3SelectDestination
                onBack={() => onOpenScreenInInteractive && onOpenScreenInInteractive(2)}
                onSelectDestination={() => onOpenScreenInInteractive && onOpenScreenInInteractive(4)}
              />
            </PhoneFrame>

            {/* Screen 4 */}
            <PhoneFrame
              screenNumber={4}
              screenTitle="Results – All Buses for the Route"
              onClickHeader={() => onOpenScreenInInteractive && onOpenScreenInInteractive(4)}
            >
              <Screen4Results
                onBack={() => onOpenScreenInInteractive && onOpenScreenInInteractive(2)}
                onSelectBusCard={() => onOpenScreenInInteractive && onOpenScreenInInteractive(5)}
              />
            </PhoneFrame>

            {/* Screen 5 */}
            <PhoneFrame
              screenNumber={5}
              screenTitle="Bus Details / Live Tracking"
              onClickHeader={() => onOpenScreenInInteractive && onOpenScreenInInteractive(5)}
            >
              <Screen5BusDetails
                onBack={() => onOpenScreenInInteractive && onOpenScreenInInteractive(4)}
                onViewFullRoute={() => onOpenScreenInInteractive && onOpenScreenInInteractive(6)}
                onOpenMap={() => onOpenScreenInInteractive && onOpenScreenInInteractive(7)}
              />
            </PhoneFrame>

            {/* Screen 6 */}
            <PhoneFrame
              screenNumber={6}
              screenTitle="Complete Stop List"
              onClickHeader={() => onOpenScreenInInteractive && onOpenScreenInInteractive(6)}
            >
              <Screen6StopList
                onBack={() => onOpenScreenInInteractive && onOpenScreenInInteractive(5)}
                onOpenMap={() => onOpenScreenInInteractive && onOpenScreenInInteractive(7)}
              />
            </PhoneFrame>

            {/* Screen 7 */}
            <PhoneFrame
              screenNumber={7}
              screenTitle="Map View – Live Location"
              onClickHeader={() => onOpenScreenInInteractive && onOpenScreenInInteractive(7)}
            >
              <Screen7MapView
                onBack={() => onOpenScreenInInteractive && onOpenScreenInInteractive(5)}
                onSelectApproachingAlert={() => onOpenScreenInInteractive && onOpenScreenInInteractive(9)}
              />
            </PhoneFrame>
          </div>
        </div>

        {/* Row 2: Screens 8 to 14 */}
        <div className="space-y-4 mt-8">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Alerts, Guidance & Passenger Services (Screens 8 – 14)</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Click any screen title to test interactively</span>
          </div>

          <div className="flex items-start gap-5 overflow-x-auto pb-6 pt-2 scrollbar-thin scrollbar-thumb-slate-300">
            {/* Screen 8 */}
            <PhoneFrame
              screenNumber={8}
              screenTitle="Nearby Stops & Buses"
              onClickHeader={() => onOpenScreenInInteractive && onOpenScreenInInteractive(8)}
            >
              <Screen8NearbyStops
                onBack={() => onOpenScreenInInteractive && onOpenScreenInInteractive(2)}
                onSelectStop={() => onOpenScreenInInteractive && onOpenScreenInInteractive(4)}
                onNavigate={(tab) => {
                  if (tab === 'HOME') onOpenScreenInInteractive && onOpenScreenInInteractive(2);
                  else if (tab === 'LIVE') onOpenScreenInInteractive && onOpenScreenInInteractive(7);
                  else if (tab === 'SAVED') onOpenScreenInInteractive && onOpenScreenInInteractive(13);
                  else if (tab === 'PROFILE') onOpenScreenInInteractive && onOpenScreenInInteractive(14);
                }}
              />
            </PhoneFrame>

            {/* Screen 9 */}
            <PhoneFrame
              screenNumber={9}
              screenTitle="Bus Approaching Alert"
              isDarkTheme={true}
              onClickHeader={() => onOpenScreenInInteractive && onOpenScreenInInteractive(9)}
            >
              <Screen9BusApproachingAlert
                onViewMap={() => onOpenScreenInInteractive && onOpenScreenInInteractive(7)}
                onDismiss={() => onOpenScreenInInteractive && onOpenScreenInInteractive(2)}
              />
            </PhoneFrame>

            {/* Screen 10 */}
            <PhoneFrame
              screenNumber={10}
              screenTitle="Alternative Bus Suggestion"
              onClickHeader={() => onOpenScreenInInteractive && onOpenScreenInInteractive(10)}
            >
              <Screen10AlternativeBus
                onSelectAlternative={() => onOpenScreenInInteractive && onOpenScreenInInteractive(5)}
                onKeepOriginal={() => onOpenScreenInInteractive && onOpenScreenInInteractive(5)}
              />
            </PhoneFrame>

            {/* Screen 11 */}
            <PhoneFrame
              screenNumber={11}
              screenTitle="Leave Home Guidance"
              onClickHeader={() => onOpenScreenInInteractive && onOpenScreenInInteractive(11)}
            >
              <Screen11LeaveHome
                onBack={() => onOpenScreenInInteractive && onOpenScreenInInteractive(2)}
                onSetReminder={() => alert('Departure reminder set for 6:08 PM!')}
                onViewMap={() => onOpenScreenInInteractive && onOpenScreenInInteractive(7)}
              />
            </PhoneFrame>

            {/* Screen 12 */}
            <PhoneFrame
              screenNumber={12}
              screenTitle="Live Route – Delays / Skipped Stops"
              onClickHeader={() => onOpenScreenInInteractive && onOpenScreenInInteractive(12)}
            >
              <Screen12DelaysSkipped
                onBack={() => onOpenScreenInInteractive && onOpenScreenInInteractive(4)}
              />
            </PhoneFrame>

            {/* Screen 13 */}
            <PhoneFrame
              screenNumber={13}
              screenTitle="Saved Routes"
              onClickHeader={() => onOpenScreenInInteractive && onOpenScreenInInteractive(13)}
            >
              <Screen13SavedRoutes
                onBack={() => onOpenScreenInInteractive && onOpenScreenInInteractive(2)}
                onSelectRoute={() => onOpenScreenInInteractive && onOpenScreenInInteractive(4)}
                onNavigate={(tab) => {
                  if (tab === 'HOME') onOpenScreenInInteractive && onOpenScreenInInteractive(2);
                  else if (tab === 'LIVE') onOpenScreenInInteractive && onOpenScreenInInteractive(7);
                  else if (tab === 'PROFILE') onOpenScreenInInteractive && onOpenScreenInInteractive(14);
                }}
              />
            </PhoneFrame>

            {/* Screen 14 */}
            <PhoneFrame
              screenNumber={14}
              screenTitle="Profile & Settings"
              onClickHeader={() => onOpenScreenInInteractive && onOpenScreenInInteractive(14)}
            >
              <Screen14ProfileSettings
                onOpenSaved={() => onOpenScreenInInteractive && onOpenScreenInInteractive(13)}
                onNavigate={(tab) => {
                  if (tab === 'HOME') onOpenScreenInInteractive && onOpenScreenInInteractive(2);
                  else if (tab === 'LIVE') onOpenScreenInInteractive && onOpenScreenInInteractive(7);
                  else if (tab === 'SAVED') onOpenScreenInInteractive && onOpenScreenInInteractive(13);
                }}
              />
            </PhoneFrame>
          </div>
        </div>

      </div>

      {/* 4 Bottom Infographic Comparison Cards */}
      <div className="border-t border-slate-200 bg-white">
        <PosterBottomComparison />
      </div>

    </div>
  );
};
