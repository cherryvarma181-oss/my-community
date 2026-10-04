import React from 'react';
import { Bus, MapPin, BarChart3, ShieldAlert, FileText, User, CheckCircle2, Navigation, Layers, Compass, Bookmark, Database, Scale } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, role, loginAsRole } = useAuth();

  const handleRoleSwitch = (newRole: UserRole) => {
    loginAsRole(newRole);
    if (newRole === 'TRANSPORT_ADMIN') setActiveTab('admin-dashboard');
    else if (newRole === 'FIELD_SURVEYOR') setActiveTab('field-survey');
    else setActiveTab('passenger-home');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-wider text-white">APSMART</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md">PS050</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">City Transit Route Intelligence & Survey Analytics</p>
            </div>
          </div>

          {/* Role Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {role === 'PASSENGER' && (
              <>
                <button
                  onClick={() => setActiveTab('passenger-home')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${activeTab === 'passenger-home' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => setActiveTab('bus-search')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${activeTab === 'bus-search' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <Bus className="w-4 h-4" />
                  <span>Find Buses</span>
                </button>
                <button
                  onClick={() => setActiveTab('live-tracking')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${activeTab === 'live-tracking' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <Navigation className="w-4 h-4 text-emerald-400" />
                  <span>Fleet Monitor</span>
                </button>
                <button
                  onClick={() => setActiveTab('nearby-stops')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${activeTab === 'nearby-stops' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Nearby Stops</span>
                </button>
                <button
                  onClick={() => setActiveTab('saved-routes')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${activeTab === 'saved-routes' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>My Routes</span>
                </button>
              </>
            )}

            {role === 'FIELD_SURVEYOR' && (
              <>
                <button
                  onClick={() => setActiveTab('field-survey')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${activeTab === 'field-survey' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Record Boarding/Alighting</span>
                </button>
                <button
                  onClick={() => setActiveTab('field-survey-list')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${activeTab === 'field-survey-list' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Survey Log</span>
                </button>
              </>
            )}

            {role === 'TRANSPORT_ADMIN' && (
              <>
                <button
                  onClick={() => setActiveTab('admin-dashboard')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${activeTab === 'admin-dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setActiveTab('admin-analytics')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${activeTab === 'admin-analytics' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Utilisation</span>
                </button>
                <button
                  onClick={() => setActiveTab('admin-underserved')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${activeTab === 'admin-underserved' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Under-Served</span>
                </button>
                <button
                  onClick={() => setActiveTab('admin-recommendations')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${activeTab === 'admin-recommendations' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Recommendations</span>
                </button>
                <button
                  onClick={() => setActiveTab('admin-gis-map')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${activeTab === 'admin-gis-map' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>GIS Map</span>
                </button>
                <button
                  onClick={() => setActiveTab('admin-compare')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${activeTab === 'admin-compare' ? 'bg-violet-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <Scale className="w-4 h-4 text-violet-400" />
                  <span>Compare</span>
                </button>
                <button
                  onClick={() => setActiveTab('admin-data-upload')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${activeTab === 'admin-data-upload' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <Database className="w-4 h-4 text-indigo-400" />
                  <span>Data Ingestion</span>
                </button>
                <button
                  onClick={() => setActiveTab('admin-reports')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${activeTab === 'admin-reports' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Reports</span>
                </button>
              </>
            )}
          </nav>

          {/* Role Switcher & Profile */}
          <div className="flex items-center space-x-3">
            {/* Quick Role Toggle Bar */}
            <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center space-x-1 text-xs">
              <button
                onClick={() => handleRoleSwitch('PASSENGER')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${role === 'PASSENGER' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Passenger
              </button>
              <button
                onClick={() => handleRoleSwitch('FIELD_SURVEYOR')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${role === 'FIELD_SURVEYOR' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Field Surveyor
              </button>
              <button
                onClick={() => handleRoleSwitch('TRANSPORT_ADMIN')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${role === 'TRANSPORT_ADMIN' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Transport Authority
              </button>
            </div>

            {/* Profile badge */}
            <div className="hidden lg:flex items-center space-x-2 pl-2 border-l border-slate-800 text-xs">
              <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-200 text-xs truncate max-w-[120px]">{user?.name || 'Guest'}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
