import React from 'react';
import { MapPin, Layers, Navigation, ShieldAlert } from 'lucide-react';
import { Route, Stop, Bus, UnderServedArea } from '../types';
import { InteractiveMap } from '../components/maps/InteractiveMap';

interface AdminGISMapProps {
  routes: Route[];
  stops: Stop[];
  buses: Bus[];
  underservedAreas: UnderServedArea[];
}

export const AdminGISMap: React.FC<AdminGISMapProps> = ({
  routes,
  stops,
  buses,
  underservedAreas
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-cyan-400" />
            <span>GIS Mobility Spatial Intelligence Map</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            OpenStreetMap multi-layer spatial GIS visualization: Route Corridors, Bus Stops, Transit Gap Under-Served Buffers, and Active Fleet Allocation.
          </p>
        </div>
      </div>

      {/* Full GIS Map */}
      <InteractiveMap
        routes={routes}
        stops={stops}
        buses={buses}
        underservedAreas={underservedAreas}
        height="640px"
        showLayerControls={true}
      />

    </div>
  );
};
