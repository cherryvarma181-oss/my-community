import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Route, Stop, Bus, UnderServedArea } from '../../types';
import { Layers, MapPin, Navigation, Eye, Compass, Satellite, Map as MapIcon } from 'lucide-react';

interface InteractiveMapProps {
  routes?: Route[];
  stops?: Stop[];
  buses?: Bus[];
  underservedAreas?: UnderServedArea[];
  selectedRouteId?: string;
  focusedBusId?: string;
  onSelectStop?: (stop: Stop) => void;
  onSelectBus?: (bus: Bus) => void;
  onSelectArea?: (area: UnderServedArea) => void;
  onProposeFeeder?: (area: UnderServedArea) => void;
  height?: string;
  showLayerControls?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  routes = [],
  stops = [],
  buses = [],
  underservedAreas = [],
  selectedRouteId,
  focusedBusId,
  onSelectStop,
  onSelectBus,
  onSelectArea,
  onProposeFeeder,
  height = '520px',
  showLayerControls = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayersRef = useRef<L.LayerGroup | null>(null);

  // Map Mode: 'satellite' (Real Satellite Imagery + Labels) vs 'streets' (Real OpenStreetMap)
  const [mapMode, setMapMode] = useState<'satellite' | 'streets'>('satellite');

  // Layer visibility state
  const [layers, setLayers] = useState({
    routes: true,
    stops: true,
    buses: true,
    underserved: true,
    telemetryLabels: true
  });

  // Visakhapatnam center coordinates
  const defaultCenter: [number, number] = [17.7386, 83.3160];

  // Helper to get real livery colors matching the graphic
  const getLiveryColors = (busType: string) => {
    switch (busType) {
      case 'ORDINARY':
        return { primary: '#2563eb', secondary: '#60a5fa', light: '#dbeafe', text: '#1e3a8a', label: 'Ordinary' };
      case 'METRO_EXPRESS':
        return { primary: '#16a34a', secondary: '#4ade80', light: '#dcfce7', text: '#14532d', label: 'Metro' };
      case 'METRO_DELUXE':
      case 'METRO_LINER':
        return { primary: '#9333ea', secondary: '#c084fc', light: '#f3e8ff', text: '#581c87', label: 'Liner' };
      case 'PALLE_VELUGU':
      default:
        return { primary: '#ea580c', secondary: '#fb923c', light: '#ffedd5', text: '#7c2d12', label: 'Palle' };
    }
  };

  // Helper to generate a realistic SVG bus icon
  const createRealBusSvg = (routeNumber: string, liveryColor: string, headingDeg: number = 0) => {
    return `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; pointer-events: auto;">
        
        <!-- Pulsing Live GPS Radar Ring -->
        <div style="
          position: absolute;
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: ${liveryColor};
          opacity: 0.35;
          animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
          top: -6px;
          left: -6px;
          pointer-events: none;
        "></div>

        <!-- Realistic City Bus Vehicle SVG (Chassis, windshield, destination board, headlights) -->
        <div style="
          position: relative;
          width: 50px;
          height: 50px;
          filter: drop-shadow(0 8px 16px rgba(0,0,0,0.6));
          transform: rotate(${headingDeg}deg);
          transition: transform 0.6s ease;
        ">
          <svg viewBox="0 0 100 100" width="50" height="50" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bodyGrad-${routeNumber}" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="${liveryColor}" />
                <stop offset="50%" stop-color="#ffffff" stop-opacity="0.25" />
                <stop offset="100%" stop-color="${liveryColor}" />
              </linearGradient>
              <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#7dd3fc" />
                <stop offset="100%" stop-color="#0284c7" />
              </linearGradient>
            </defs>

            <!-- Tires / Wheels -->
            <rect x="14" y="24" width="7" height="16" rx="2.5" fill="#090d16" />
            <rect x="79" y="24" width="7" height="16" rx="2.5" fill="#090d16" />
            <rect x="14" y="66" width="7" height="16" rx="2.5" fill="#090d16" />
            <rect x="79" y="66" width="7" height="16" rx="2.5" fill="#090d16" />

            <!-- Side Mirrors -->
            <rect x="10" y="16" width="8" height="4.5" rx="2" fill="#0f172a" stroke="#ffffff" stroke-width="0.8" />
            <rect x="82" y="16" width="8" height="4.5" rx="2" fill="#0f172a" stroke="#ffffff" stroke-width="0.8" />

            <!-- Main Bus Body Shell with High-Contrast White Edge -->
            <rect x="18" y="10" width="64" height="80" rx="14" fill="${liveryColor}" stroke="#ffffff" stroke-width="2.5" />
            <rect x="20" y="12" width="60" height="76" rx="12" fill="url(#bodyGrad-${routeNumber})" />

            <!-- Front Windshield -->
            <path d="M 24 28 L 76 28 C 76 18, 70 14, 50 14 C 30 14, 24 18, 24 28 Z" fill="url(#glassGrad)" stroke="#0f172a" stroke-width="1.5" />
            
            <!-- Windshield Wiper line -->
            <line x1="50" y1="26" x2="42" y2="18" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" />
            <line x1="68" y1="26" x2="60" y2="18" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" />

            <!-- LED Destination Board on Roof (Shows Route Number!) -->
            <rect x="28" y="4" width="44" height="13" rx="3.5" fill="#090d16" stroke="#fbbf24" stroke-width="1.2" />
            <text x="50" y="14" fill="#fbbf24" font-size="9" font-family="monospace" font-weight="900" text-anchor="middle">
              ${routeNumber}
            </text>

            <!-- Dual Headlights (Glow forward) -->
            <circle cx="27" cy="11" r="3.5" fill="#fef08a" stroke="#ca8a04" stroke-width="1" />
            <circle cx="73" cy="11" r="3.5" fill="#fef08a" stroke="#ca8a04" stroke-width="1" />

            <!-- Roof Hatch / AC Unit -->
            <rect x="36" y="38" width="28" height="24" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
            <line x1="42" y1="44" x2="58" y2="44" stroke="#94a3b8" stroke-width="1" />
            <line x1="42" y1="50" x2="58" y2="50" stroke="#94a3b8" stroke-width="1" />
            <line x1="42" y1="56" x2="58" y2="56" stroke="#94a3b8" stroke-width="1" />

            <!-- Side Windows -->
            <rect x="22" y="34" width="4" height="42" rx="1.5" fill="#38bdf8" />
            <rect x="74" y="34" width="4" height="42" rx="1.5" fill="#38bdf8" />

            <!-- Rear Glass & Brake Lights -->
            <rect x="26" y="80" width="48" height="6" rx="2" fill="#0f172a" />
            <rect x="22" y="83" width="7" height="3" rx="1" fill="#ef4444" />
            <rect x="71" y="83" width="7" height="3" rx="1" fill="#ef4444" />
          </svg>
        </div>

      </div>
    `;
  };

  // Helper to switch base tiles between Real Satellite and Real Street Map
  const applyBaseTiles = (map: L.Map, mode: 'satellite' | 'streets') => {
    // Remove previous base layers
    if (baseTileLayersRef.current) {
      map.removeLayer(baseTileLayersRef.current);
      baseTileLayersRef.current = null;
    }

    const group = L.layerGroup();

    if (mode === 'satellite') {
      // 1. Real Satellite Imagery (Esri ArcGIS World Imagery - NO API KEY REQUIRED, genuine high-res satellite photos)
      const satLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Imagery &copy; Esri &mdash; Earthstar Geographics, Maxar, GeoEye',
          maxZoom: 19
        }
      );
      group.addLayer(satLayer);

      // 2. Real Transportation & Road Overlay on top of satellite
      const roadOverlay = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          opacity: 0.85
        }
      );
      group.addLayer(roadOverlay);

      // 3. Real City/Locality Reference Labels on top of satellite
      const labelOverlay = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          opacity: 0.95
        }
      );
      group.addLayer(labelOverlay);
    } else {
      // Real OpenStreetMap (Standard HD Street Map - NO API KEY REQUIRED, complete road network and labels)
      const osmLayer = L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19
        }
      );
      group.addLayer(osmLayer);
    }

    group.addTo(map);
    baseTileLayersRef.current = group;
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 13,
      zoomControl: false // Custom controls
    });

    // Add Zoom Control to top-left
    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Apply initial base tiles (Real Satellite with hybrid road labels)
    applyBaseTiles(map, mapMode);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Map Mode Changes (Real Satellite vs Real Street Map)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    applyBaseTiles(map, mapMode);
  }, [mapMode]);

  // Pan to focused bus when focusedBusId changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !focusedBusId) return;

    const focusedBus = buses.find(b => b.id === focusedBusId);
    if (focusedBus && focusedBus.lat && focusedBus.lng) {
      map.setView([focusedBus.lat, focusedBus.lng], 14, { animate: true });
    }
  }, [focusedBusId, buses]);

  // Update Map Layers whenever data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing non-base layers (keep the baseTileLayersRef layer group)
    map.eachLayer((layer) => {
      if (layer !== baseTileLayersRef.current && !(baseTileLayersRef.current?.hasLayer(layer))) {
        map.removeLayer(layer);
      }
    });

    const routeColors: Record<string, string> = {
      '28': '#3b82f6',  // Blue (City Ordinary)
      '32': '#22c55e',  // Green (Metro Express)
      '45': '#a855f7',  // Purple (Metro Liner)
      '111': '#f97316', // Orange (Palle Velugu)
      '400': '#06b6d4', // Cyan
      '38': '#94a3b8',  // Slate
      '10K': '#10b981', // Emerald
      '25K': '#fbbf24'  // Amber
    };

    // 1. Render Routes (Enhanced Polyline with border and glow)
    if (layers.routes && routes.length > 0) {
      routes.forEach((route) => {
        if (selectedRouteId && route.id !== selectedRouteId) return;

        if (route.routeStops && route.routeStops.length > 1) {
          const latLngs: [number, number][] = route.routeStops.map((rs) => [
            rs.stop.lat,
            rs.stop.lng
          ]);

          const color = routeColors[route.routeNumber] || '#3b82f6';

          // Outer shadow/casing line for high visibility on roads and satellite terrain
          L.polyline(latLngs, {
            color: '#ffffff',
            weight: selectedRouteId === route.id ? 8 : 6,
            opacity: 0.95
          }).addTo(map);

          // Inner colorful route line
          const polyline = L.polyline(latLngs, {
            color,
            weight: selectedRouteId === route.id ? 5 : 4,
            opacity: 1.0
          }).addTo(map);

          polyline.bindPopup(`
            <div style="font-family: sans-serif; padding: 6px; min-width: 200px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span style="background: ${color}; color: white; padding: 3px 8px; border-radius: 6px; font-weight: 800; font-size: 11px;">
                  Route ${route.routeNumber}
                </span>
                <span style="font-size: 11px; font-weight: bold; color: #475569;">${route.totalStops} Stops</span>
              </div>
              <strong style="color: #0f172a; font-size: 14px;">${route.name}</strong>
              <div style="font-size: 11px; color: #475569; margin-top: 4px; line-height: 1.5;">
                • Corridor: <strong>${route.origin} → ${route.destination}</strong><br/>
                • Headway: <strong style="color: #1d4ed8;">Every ${route.frequencyMins} mins</strong> (${route.busCount} active buses)
              </div>
            </div>
          `);
        }
      });
    }

    // 2. Render Bus Stops (Real Bus Shelter Pin Markers)
    if (layers.stops && stops.length > 0) {
      stops.forEach((stop) => {
        // Stop icon: shelter symbol (🚏) with high-contrast stop name tag
        const customIcon = L.divIcon({
          className: 'custom-stop-marker',
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; pointer-events: auto;">
              <div style="
                background: #ffffff;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 2.5px solid #2563eb;
                box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                cursor: pointer;
                transition: transform 0.2s;
              ">
                🚏
              </div>
              <div style="
                background: rgba(15, 23, 42, 0.92);
                color: #ffffff;
                font-size: 9px;
                font-weight: 800;
                padding: 1px 5px;
                border-radius: 4px;
                border: 1px solid rgba(255, 255, 255, 0.4);
                box-shadow: 0 2px 6px rgba(0,0,0,0.6);
                margin-top: 2px;
                white-space: nowrap;
                letter-spacing: 0.2px;
                pointer-events: none;
              ">
                ${stop.name}
              </div>
            </div>
          `,
          iconSize: [80, 48],
          iconAnchor: [40, 12]
        });

        const marker = L.marker([stop.lat, stop.lng], { icon: customIcon }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 6px; min-width: 180px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span style="font-size: 16px;">🚏</span>
              <strong style="color: #0f172a; font-size: 14px;">${stop.name}</strong>
            </div>
            <span style="font-size: 10px; font-family: monospace; color: #1e3a8a; background: #dbeafe; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
              ${stop.code}
            </span>
            <div style="font-size: 11px; color: #475569; margin-top: 6px; line-height: 1.4;">
              • Area: <strong>${stop.area}</strong><br/>
              • Shelter: <strong>${stop.shelter ? 'Passenger Canopy ✓' : 'Standard Stop'}</strong><br/>
              • Wheelchair Access: <strong>${stop.accessibility ? 'Yes ✓' : 'No'}</strong>
            </div>
          </div>
        `);

        if (onSelectStop) {
          marker.on('click', () => onSelectStop(stop));
        }
      });
    }

    // 3. Render Under-Served Transit Gap Zones
    if (layers.underserved && underservedAreas.length > 0) {
      underservedAreas.forEach((area) => {
        const isCritical = area.demandLevel === 'CRITICAL';
        const color = isCritical ? '#ef4444' : '#f97316';

        // Outer pulsing ring
        L.circle([area.lat, area.lng], {
          color,
          weight: 2,
          dashArray: '4, 4',
          fillColor: color,
          fillOpacity: 0.16,
          radius: area.distanceToStopKm * 400 + 200
        }).addTo(map);

        // Core hotspot circle
        const circle = L.circle([area.lat, area.lng], {
          color,
          weight: 2.5,
          fillColor: color,
          fillOpacity: 0.4,
          radius: 150
        }).addTo(map);

        circle.bindPopup(`
          <div style="font-family: sans-serif; padding: 6px; max-width: 250px;">
            <div style="background: ${isCritical ? '#fee2e2' : '#ffedd5'}; border: 1px solid ${color}; border-radius: 4px; padding: 2px 6px; margin-bottom: 6px; font-size: 10px; font-weight: 800; color: ${color}; display: inline-block;">
              ⚠️ UNDER-SERVED TRANSIT ZONE
            </div><br/>
            <strong style="color: #0f172a; font-size: 13px;">${area.areaName}</strong>
            <div style="margin-top: 6px; font-size: 11px; color: #475569; line-height: 1.4;">
              • Unmet Peak Demand: <strong style="color: #dc2626;">${area.unmetDemandPaxHr} pax/hr</strong><br/>
              • Walk to Nearest Stop: <strong>${area.distanceToStopKm} km</strong><br/>
              • Nearest Stop: <strong>${area.nearestStop?.name || 'Local Stop'}</strong>
            </div>
            ${onProposeFeeder ? `
              <button
                id="btn-feeder-${area.id}"
                style="margin-top: 8px; width: 100%; background: #059669; color: white; font-weight: bold; font-size: 11px; padding: 6px 10px; border-radius: 6px; border: none; cursor: pointer;"
              >
                💡 Generate Feeder Recommendation
              </button>
            ` : ''}
          </div>
        `);

        circle.on('popupopen', () => {
          const btn = document.getElementById(`btn-feeder-${area.id}`);
          if (btn && onProposeFeeder) {
            btn.onclick = () => onProposeFeeder(area);
          }
        });

        if (onSelectArea) {
          circle.on('click', () => onSelectArea(area));
        }
      });
    }

    // 4. Render Live Animated Buses (Realistic Bus Vehicles!)
    if (layers.buses && buses.length > 0) {
      buses.forEach((bus) => {
        const isFocused = focusedBusId === bus.id;
        const livery = getLiveryColors(bus.busType);
        const routeNum = bus.currentRoute?.routeNumber || '28';
        const speedDisplay = bus.speed ? `${bus.speed} km/h` : '32 km/h';
        const etaText = bus.nextStopEtaMins ? `${bus.nextStopEtaMins}m` : '3m';

        const busSvg = createRealBusSvg(routeNum, livery.primary, bus.heading || 0);

        const busIcon = L.divIcon({
          className: 'real-bus-marker',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; z-index: ${isFocused ? 1000 : 100};">
              
              <!-- Floating High-Visibility Vehicle Badge -->
              <div style="
                background: #090d16;
                color: #ffffff;
                padding: 2.5px 7px;
                border-radius: 8px;
                font-size: 10px;
                font-weight: 800;
                border: 1.5px solid ${livery.secondary};
                box-shadow: 0 4px 12px rgba(0,0,0,0.6);
                display: flex;
                align-items: center;
                gap: 4px;
                white-space: nowrap;
                margin-bottom: 2px;
                letter-spacing: 0.2px;
              ">
                <span style="background: ${livery.primary}; color: #ffffff; padding: 1px 4.5px; border-radius: 4px; font-weight: 900;">
                  ${routeNum}
                </span>
                <span style="font-family: monospace; font-size: 10px;">${bus.busNumber.split(' ').pop()}</span>
                ${layers.telemetryLabels ? `
                  <span style="color: #38bdf8; font-size: 9px; font-weight: bold; background: rgba(255,255,255,0.12); padding: 1px 3.5px; border-radius: 3px;">
                    ${speedDisplay}
                  </span>
                ` : ''}
              </div>

              <!-- Real Bus Vehicle SVG -->
              ${busSvg}

            </div>
          `,
          iconSize: [60, 75],
          iconAnchor: [30, 48]
        });

        const marker = L.marker([bus.lat, bus.lng], { icon: busIcon }).addTo(map);

        // Rich Bus Information Popup
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 6px; min-width: 230px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="background: ${livery.primary}; color: white; font-size: 11px; padding: 2px 7px; border-radius: 5px; font-weight: 800;">
                Route ${routeNum} • ${livery.label}
              </span>
              <span style="font-size: 10px; font-weight: bold; color: ${bus.occupancyStatus === 'FULL' ? '#dc2626' : '#15803d'}; background: ${bus.occupancyStatus === 'FULL' ? '#fee2e2' : '#dcfce7'}; padding: 2px 6px; border-radius: 4px;">
                ${bus.occupancyStatus === 'LOW' ? 'Low Crowd' : bus.occupancyStatus === 'MEDIUM' ? 'Moderate' : 'Heavy Crowd'}
              </span>
            </div>

            <strong style="color: #0f172a; font-size: 15px; display: block;">${bus.busNumber}</strong>
            <p style="font-size: 11px; color: #475569; margin-top: 1px;">
              ${bus.currentRoute?.name || 'Visakhapatnam City Transit Line'}
            </p>

            <div style="margin-top: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 6px 8px; font-size: 11px; color: #334155; line-height: 1.6;">
              <div style="display: flex; justify-content: space-between;">
                <span>Live GPS Speed:</span>
                <strong style="color: #0284c7;">${speedDisplay}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Approaching Stop:</span>
                <strong style="color: #0f172a;">${bus.nextStopName || 'PM Palem'}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Distance / ETA:</span>
                <strong style="color: #15803d;">${bus.distanceToNextStopMeters || 450}m (${etaText})</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Live Schedule Status:</span>
                <strong style="color: ${bus.delayMinutes > 0 ? '#b45309' : '#15803d'};">
                  ${bus.delayMinutes > 0 ? `+${bus.delayMinutes} min delay` : 'On Time ✓'}
                </strong>
              </div>
            </div>

            <div style="font-size: 10px; color: #15803d; margin-top: 6px; display: flex; align-items: center; gap: 4px; font-weight: bold;">
              <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #15803d;"></span>
              <span>Active Scheduled Fleet Unit</span>
            </div>
          </div>
        `);

        if (onSelectBus) {
          marker.on('click', () => onSelectBus(bus));
        }
      });
    }

  }, [routes, stops, buses, underservedAreas, selectedRouteId, focusedBusId, layers, mapMode]);

  // Center map on route or default
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setView(defaultCenter, 13, { animate: true });
  };

  return (
    <div className="relative isolate z-0 w-full rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-900 font-sans">
      
      {/* Map Canvas */}
      <div ref={mapContainerRef} style={{ height }} className="w-full z-10" />

      {/* Top Left: Real Satellite vs Real Street Map Switcher */}
      <div className="absolute top-3 left-3 sm:left-12 z-20 flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-2xl p-1 shadow-lg text-xs">
        <button
          onClick={() => setMapMode('satellite')}
          className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition ${
            mapMode === 'satellite'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Real High-Resolution Satellite Imagery with Street Labels"
        >
          <Satellite className="w-3.5 h-3.5 text-cyan-300" />
          <span>Real Satellite</span>
        </button>

        <button
          onClick={() => setMapMode('streets')}
          className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition ${
            mapMode === 'streets'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Real Street & Transit Map (OpenStreetMap)"
        >
          <MapIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real Street Map</span>
        </button>

        <button
          onClick={handleRecenter}
          className="px-2.5 py-1.5 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center space-x-1 transition border-l border-slate-700 pl-2"
          title="Recenter on Visakhapatnam City Corridor"
        >
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Recenter</span>
        </button>
      </div>

      {/* Top Right: Layer Control Bar */}
      {showLayerControls && (
        <div className="absolute top-3 right-3 z-20 bg-slate-900/95 backdrop-blur border border-slate-700/80 rounded-2xl p-3 shadow-xl text-xs space-y-2 text-slate-200">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-1">Map Visibility</p>
          
          <label className="flex items-center space-x-2 cursor-pointer hover:text-white px-1 font-semibold">
            <input
              type="checkbox"
              checked={layers.buses}
              onChange={(e) => setLayers({ ...layers, buses: e.target.checked })}
              className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-0"
            />
            <span className="text-cyan-400 flex items-center gap-1 font-bold">
              <span>🚌 Real Bus Vehicles</span>
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer hover:text-white px-1 font-semibold">
            <input
              type="checkbox"
              checked={layers.routes}
              onChange={(e) => setLayers({ ...layers, routes: e.target.checked })}
              className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-0"
            />
            <span>Bus Routes</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer hover:text-white px-1 font-semibold">
            <input
              type="checkbox"
              checked={layers.stops}
              onChange={(e) => setLayers({ ...layers, stops: e.target.checked })}
              className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-0"
            />
            <span>🚏 Bus Stops</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer hover:text-white px-1 font-semibold">
            <input
              type="checkbox"
              checked={layers.underserved}
              onChange={(e) => setLayers({ ...layers, underserved: e.target.checked })}
              className="rounded border-slate-700 bg-slate-800 text-rose-500 focus:ring-0"
            />
            <span className="text-rose-400 font-bold">Under-Served Zones</span>
          </label>
        </div>
      )}

      {/* Bottom Floating Legend Bar */}
      <div className="absolute bottom-3 left-3 z-20 bg-slate-900/90 backdrop-blur border border-slate-700 px-3.5 py-2 rounded-2xl shadow-xl text-xs text-slate-200 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 font-bold">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span>Ordinary</span>
        </span>
        <span className="flex items-center gap-1.5 font-bold">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span>Metro</span>
        </span>
        <span className="flex items-center gap-1.5 font-bold">
          <span className="w-3 h-3 rounded-full bg-purple-500"></span>
          <span>Liner</span>
        </span>
        <span className="flex items-center gap-1.5 font-bold">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          <span>Palle Velugu</span>
        </span>
        <span className="text-slate-600">|</span>
        <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Live GPS Satellite Fleet</span>
        </span>
      </div>

    </div>
  );
};
