import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ApsrtcNavbar } from './components/navbar/ApsrtcNavbar';
import { Footer } from './components/footer/Footer';
import { BusApproachingModal } from './components/common/BusApproachingModal';
import { ApsrtcApiHub } from './components/common/ApsrtcApiHub';
import { PosterBottomComparison } from './components/common/PosterBottomComparison';
import { LoadingPage } from './components/common/LoadingPage';

// Passenger Pages matching the 14 Mobile Screens
import { PassengerHome } from './pages/PassengerHome';
import { BusSearch } from './pages/BusSearch';
import { BusDetails } from './pages/BusDetails';
import { LiveTracking } from './pages/LiveTracking';
import { NearbyStops } from './pages/NearbyStops';
import { SavedRoutes } from './pages/SavedRoutes';
import { ProfileSettings } from './pages/ProfileSettings';

// Authority & Field Surveyor Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DriverConsole } from './pages/DriverConsole';
import { FieldSurvey } from './pages/FieldSurvey';
import { FieldSurveyList } from './pages/FieldSurveyList';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminAnalytics } from './pages/AdminAnalytics';
import { AdminUnderserved } from './pages/AdminUnderserved';
import { AdminRecommendations } from './pages/AdminRecommendations';
import { AdminRouteComparison } from './pages/AdminRouteComparison';
import { AdminGISMap } from './pages/AdminGISMap';
import { AdminReports } from './pages/AdminReports';
import { AdminDataUpload } from './pages/AdminDataUpload';

import { fetchRoutes, fetchBuses, fetchStops, fetchRouteUtilisation, fetchUnderServedAreas } from './services/api';
import { Route, Bus, Stop, RouteUtilisation, UnderServedArea } from './types';

const MainApp: React.FC = () => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('passenger-home');
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  const [showApproachingModal, setShowApproachingModal] = useState<boolean>(false);
  const [showApiHub, setShowApiHub] = useState<boolean>(false);

  // Core Data States
  const [routes, setRoutes] = useState<Route[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [utilisations, setUtilisations] = useState<RouteUtilisation[]>([]);
  const [underservedAreas, setUnderservedAreas] = useState<UnderServedArea[]>([]);

  // Search & Selected States
  const [fromQuery, setFromQuery] = useState('Madhurawada');
  const [toQuery, setToQuery] = useState('RTC Complex');
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  const refreshAllData = async () => {
    try {
      const [rData, bData, sData, uData, usaData] = await Promise.all([
        fetchRoutes(),
        fetchBuses(),
        fetchStops(),
        fetchRouteUtilisation(),
        fetchUnderServedAreas()
      ]);
      setRoutes(rData);
      setBuses(bData);
      setStops(sData);
      setUtilisations(uData);
      setUnderservedAreas(usaData);
      if (bData.length > 0 && !selectedBus) {
        setSelectedBus(bData[0]);
      }
    } catch (err) {
      console.warn('Data refresh error:', err);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleSearch = (from: string, to: string) => {
    setFromQuery(from);
    setToQuery(to);
  };

  const isPassengerTab = [
    'passenger-home',
    'bus-search',
    'bus-details',
    'live-tracking',
    'nearby-stops',
    'saved-routes',
    'profile-settings'
  ].includes(activeTab);

  // Screen 1: App Loading / Splash Screen
  if (isAppLoading || activeTab === 'loading-screen') {
    return (
      <LoadingPage
        onComplete={() => {
          setIsAppLoading(false);
          if (activeTab === 'loading-screen') {
            setActiveTab('passenger-home');
          }
        }}
        autoTransition={isAppLoading}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans antialiased">
      
      {/* Official APSRTC Navbar & Top Branding */}
      <ApsrtcNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApproachingModal={() => setShowApproachingModal(true)}
        onOpenApiHub={() => setShowApiHub(true)}
      />

      {/* Screen 9: Bus Approaching Alert Interactive Modal */}
      <BusApproachingModal
        isOpen={showApproachingModal}
        onClose={() => setShowApproachingModal(false)}
        onViewOnMap={() => {
          setShowApproachingModal(false);
          setActiveTab('live-tracking');
        }}
        routeNumber={selectedBus?.currentRoute?.routeNumber || '28'}
        serviceType={selectedBus?.busType === 'ORDINARY' ? 'City Ordinary' : 'Metro Express'}
        etaMinutes={2}
        stopName="PM Palem Stop"
        regNumber={selectedBus?.busNumber || 'AP 39 Z 3487'}
      />

      {/* APSRTC Live API Key & External Feed Hub Modal */}
      <ApsrtcApiHub
        isOpen={showApiHub}
        onClose={() => setShowApiHub(false)}
        onOpenDriverConsole={() => {
          setShowApiHub(false);
          setActiveTab('driver-console');
        }}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        
        {/* Passenger Experience Pages */}
        {activeTab === 'passenger-home' && (
          <PassengerHome
            setActiveTab={setActiveTab}
            onSearch={handleSearch}
            routes={routes}
            onOpenApproachingModal={() => setShowApproachingModal(true)}
          />
        )}

        {activeTab === 'bus-search' && (
          <BusSearch
            buses={buses}
            routes={routes}
            fromQuery={fromQuery}
            toQuery={toQuery}
            onSelectBus={(bus) => {
              setSelectedBus(bus);
              setActiveTab('bus-details');
            }}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'bus-details' && (
          <BusDetails
            bus={selectedBus || buses[0] || null}
            allBuses={buses}
            onBack={() => setActiveTab('bus-search')}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'live-tracking' && (
          <LiveTracking
            buses={buses}
            routes={routes}
            onSelectBus={(bus) => {
              setSelectedBus(bus);
              setActiveTab('bus-details');
            }}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'nearby-stops' && (
          <NearbyStops
            stops={stops}
            onSelectRoute={handleSearch}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'saved-routes' && (
          <SavedRoutes
            routes={routes}
            setActiveTab={setActiveTab}
            onSearch={handleSearch}
          />
        )}

        {activeTab === 'profile-settings' && (
          <ProfileSettings
            setActiveTab={setActiveTab}
            onOpenApiHub={() => setShowApiHub(true)}
          />
        )}

        {/* Real-time Driver GPS Console */}
        {activeTab === 'driver-console' && (
          <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-140px)] p-4 sm:p-6 max-w-7xl mx-auto">
            <DriverConsole buses={buses} routes={routes} setActiveTab={setActiveTab} />
          </div>
        )}

        {/* Transport Authority & Analytics Console */}
        {activeTab === 'admin-dashboard' && (
          <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-140px)] p-4 sm:p-6 max-w-7xl mx-auto">
            <AdminDashboard setActiveTab={setActiveTab} />
          </div>
        )}

        {activeTab === 'admin-analytics' && (
          <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-140px)] p-4 sm:p-6 max-w-7xl mx-auto">
            <AdminAnalytics />
          </div>
        )}

        {activeTab === 'admin-underserved' && (
          <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-140px)] p-4 sm:p-6 max-w-7xl mx-auto">
            <AdminUnderserved setActiveTab={setActiveTab} />
          </div>
        )}

        {activeTab === 'admin-recommendations' && (
          <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-140px)] p-4 sm:p-6 max-w-7xl mx-auto">
            <AdminRecommendations />
          </div>
        )}

        {activeTab === 'admin-compare' && (
          <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-140px)] p-4 sm:p-6 max-w-7xl mx-auto">
            <AdminRouteComparison utilisations={utilisations} />
          </div>
        )}

        {activeTab === 'admin-data-upload' && (
          <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-140px)] p-4 sm:p-6 max-w-7xl mx-auto">
            <AdminDataUpload
              setActiveTab={setActiveTab}
              onDataRecalculated={refreshAllData}
            />
          </div>
        )}

        {activeTab === 'admin-gis-map' && (
          <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-140px)] p-4 sm:p-6 max-w-7xl mx-auto">
            <AdminGISMap
              routes={routes}
              stops={stops}
              buses={buses}
              underservedAreas={underservedAreas}
            />
          </div>
        )}

        {activeTab === 'admin-reports' && (
          <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-140px)] p-4 sm:p-6 max-w-7xl mx-auto">
            <AdminReports />
          </div>
        )}

        {activeTab === 'field-survey' && (
          <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-140px)] p-4 sm:p-6 max-w-7xl mx-auto">
            <FieldSurvey routes={routes} stops={stops} />
          </div>
        )}

        {activeTab === 'field-survey-list' && (
          <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-140px)] p-4 sm:p-6 max-w-7xl mx-auto">
            <FieldSurveyList />
          </div>
        )}

        {activeTab === 'landing' && <LandingPage setActiveTab={setActiveTab} />}
        {activeTab === 'login' && <LoginPage setActiveTab={setActiveTab} />}

      </main>

      {/* Modern Transit Comparison Section (Bottom of Website) */}
      {isPassengerTab && (
        <section className="bg-slate-100/80 border-t border-slate-200/90 py-10 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PosterBottomComparison />
          </div>
        </section>
      )}

      {/* Official APSRTC Footer */}
      <Footer />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
