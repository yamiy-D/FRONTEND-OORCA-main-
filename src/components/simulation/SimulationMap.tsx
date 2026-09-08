/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  SimulationResult, 
  SimulationParameters,
} from '../../types/simulation';
import { DEFAULT_CARTO_API_KEY, getCartoApiKey } from '../../services/mapService';
import { 
  generateNearHullSlick, 
  generateContainmentBoom 
} from '../../utils/simulationCalculations';
import {
  generateDynamicOceanSlick,
} from '../../utils/oceanSlickModel';

/**
 * Generates a smooth GeoJSON Polygon approximating a circle on Earth's curved surface.
 * @param lng - Longitude in degrees
 * @param lat - Latitude in degrees
 * @param radiusMeters - Radius in meters
 * @param points - Number of coordinate points (default 64 for smooth circle)
 */
export function createCircle(
  lng: number,
  lat: number,
  radiusMeters: number,
  points: number = 64
): GeoJSON.Feature<GeoJSON.Polygon> {
  const coords: [number, number][] = [];
  const km = radiusMeters / 1000;
  const distanceRadians = km / 6371.0088; // Earth's mean radius in km
  const centerLatRadians = (lat * Math.PI) / 180;
  const centerLngRadians = (lng * Math.PI) / 180;

  for (let i = 0; i <= points; i++) {
    const angle = (i * 2 * Math.PI) / points;
    const latPointRadians = Math.asin(
      Math.sin(centerLatRadians) * Math.cos(distanceRadians) +
      Math.cos(centerLatRadians) * Math.sin(distanceRadians) * Math.cos(angle)
    );
    const lngPointRadians = centerLngRadians + Math.atan2(
      Math.sin(angle) * Math.sin(distanceRadians) * Math.cos(centerLatRadians),
      Math.cos(distanceRadians) - Math.sin(centerLatRadians) * Math.sin(latPointRadians)
    );
    coords.push([
      (lngPointRadians * 180) / Math.PI,
      (latPointRadians * 180) / Math.PI,
    ]);
  }

  return {
    type: 'Feature',
    properties: {
      radiusMeters,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [coords],
    },
  };
}

/**
 * Pre-defined coastal settlements along the operational corridor.
 */
const COASTAL_CITIES = [
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, isMajor: true },
  { name: 'Navi Mumbai', lat: 19.0330, lng: 73.0297, isMajor: false },
  { name: 'Alibaug', lat: 18.6584, lng: 72.8777, isMajor: false },
  { name: 'Murud', lat: 18.3300, lng: 72.9600, isMajor: false },
  { name: 'Roha', lat: 18.2300, lng: 73.1200, isMajor: false },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, isMajor: true },
];

/**
 * Ocean current flowlines (curved trajectories in Arabian Sea / coastal corridor).
 */
const CURRENT_STREAMLINES: [number, number][][] = [
  [[72.40, 18.50], [72.65, 18.58], [72.90, 18.68]],
  [[72.35, 18.65], [72.60, 18.75], [72.88, 18.86]],
  [[72.30, 18.80], [72.58, 18.90], [72.84, 19.00]],
  [[72.35, 18.95], [72.65, 19.05], [72.92, 19.15]],
  [[72.45, 18.35], [72.70, 18.45], [72.95, 18.56]],
  [[72.50, 18.20], [72.75, 18.30], [73.00, 18.40]],
];

/**
 * Self-contained MapLibre Style Specification.
 * Guarantees zero external network JSON/glyph blocking, instant WebGL initialization,
 * and reliable multi-basemap switching (Dark Maritime, Satellite Ocean, Ocean Basemap).
 */
const activeCartoKey = getCartoApiKey() || DEFAULT_CARTO_API_KEY;
const cartoKeyParam = `?key=${encodeURIComponent(activeCartoKey)}`;

const MAP_BASE_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'dark-tiles': {
      type: 'raster',
      tiles: [
        `https://a.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png${cartoKeyParam}`,
        `https://b.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png${cartoKeyParam}`,
        `https://c.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png${cartoKeyParam}`,
        `https://d.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png${cartoKeyParam}`,
      ],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    },
    'voyager-tiles': {
      type: 'raster',
      tiles: [
        `https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png${cartoKeyParam}`,
        `https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png${cartoKeyParam}`,
        `https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png${cartoKeyParam}`,
        `https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png${cartoKeyParam}`,
      ],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    },
    'satellite-tiles': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: 'Esri World Imagery',
    },
    'ocean-tiles': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: 'Esri Ocean Basemap',
    },
  },
  layers: [
    {
      id: 'layer-dark',
      type: 'raster',
      source: 'dark-tiles',
      minzoom: 0,
      maxzoom: 20,
      layout: { visibility: 'visible' },
      paint: { 'raster-opacity': 1.0 },
    },
    {
      id: 'layer-voyager',
      type: 'raster',
      source: 'voyager-tiles',
      minzoom: 0,
      maxzoom: 20,
      layout: { visibility: 'none' },
      paint: { 'raster-opacity': 1.0 },
    },
    {
      id: 'layer-satellite',
      type: 'raster',
      source: 'satellite-tiles',
      minzoom: 0,
      maxzoom: 19,
      layout: { visibility: 'none' },
      paint: { 'raster-opacity': 1.0 },
    },
    {
      id: 'layer-ocean',
      type: 'raster',
      source: 'ocean-tiles',
      minzoom: 0,
      maxzoom: 14,
      layout: { visibility: 'none' },
      paint: { 'raster-opacity': 1.0 },
    },
  ],
};

export interface SimulationMapProps {
  // Core user requirements
  spillLocation?: {
    lat: number;
    lng: number;
  } | null;
  onLocationSelect?: (location: {
    lat: number;
    lng: number;
  }) => void;
  simulationActive?: boolean;
  affectedRadius?: number;
  flyToLocation?: {
    lat: number;
    lng: number;
  } | null;

  // Extended OORCA platform props
  simulationResult?: SimulationResult | null;
  parameters?: SimulationParameters;
  onMapClickLocation?: (lat: number, lng: number) => void;
  currentLayerId?: string;
  showWind?: boolean;
  showWaves?: boolean;
  zoomAction?: number;
  zoomOutAction?: number;
  focusCoords?: [number, number] | null;
  onOpenParameters?: () => void;
  showBooms?: boolean;
  showLiveParticles?: boolean;

  // Dynamic Ocean-Surface Oil Slick & Seepage Props
  showOceanSlick?: boolean;
  onToggleOceanSlick?: (show: boolean) => void;
  showHighZone?: boolean;
  onToggleHighZone?: (show: boolean) => void;
  showMediumZone?: boolean;
  onToggleMediumZone?: (show: boolean) => void;
  showLowZone?: boolean;
  onToggleLowZone?: (show: boolean) => void;
  seepageRate?: number;
  onSeepageRateChange?: (rate: number) => void;
}

export function SimulationMap({
  spillLocation,
  onLocationSelect,
  simulationActive = true,
  affectedRadius = 50000,
  flyToLocation,
  simulationResult,
  parameters,
  onMapClickLocation,
  currentLayerId = 'dark',
  showWind = false,
  showWaves = false,
  zoomAction = 0,
  zoomOutAction = 0,
  focusCoords,
  onOpenParameters,
  showBooms = true,
  showLiveParticles = true,
  showOceanSlick: showOceanSlickProp,
  onToggleOceanSlick,
  showHighZone: showHighZoneProp,
  onToggleHighZone,
  showMediumZone: showMediumZoneProp,
  onToggleMediumZone,
  showLowZone: showLowZoneProp,
  onToggleLowZone,
  seepageRate: seepageRateProp,
  onSeepageRateChange,
}: SimulationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [webGlError, setWebGlError] = useState<string | null>(null);

  // Dynamic Ocean-Surface Oil Slick & Seepage States
  const [isOceanSlickVisible, setIsOceanSlickVisible] = useState<boolean>(showOceanSlickProp ?? true);
  const [isHighZoneVisible, setIsHighZoneVisible] = useState<boolean>(showHighZoneProp ?? true);
  const [isMediumZoneVisible, setIsMediumZoneVisible] = useState<boolean>(showMediumZoneProp ?? true);
  const [isLowZoneVisible, setIsLowZoneVisible] = useState<boolean>(showLowZoneProp ?? true);
  const animPhaseRef = useRef<number>(0);
  const lastSlickUpdateRef = useRef<number>(0);
  const activeSeepageRate = seepageRateProp ?? parameters?.spillDetails.seepageRateTonnesPerHour ?? 0;

  // Sync state if props change
  useEffect(() => {
    if (showOceanSlickProp !== undefined) setIsOceanSlickVisible(showOceanSlickProp);
  }, [showOceanSlickProp]);

  useEffect(() => {
    if (showHighZoneProp !== undefined) setIsHighZoneVisible(showHighZoneProp);
  }, [showHighZoneProp]);

  useEffect(() => {
    if (showMediumZoneProp !== undefined) setIsMediumZoneVisible(showMediumZoneProp);
  }, [showMediumZoneProp]);

  useEffect(() => {
    if (showLowZoneProp !== undefined) setIsLowZoneVisible(showLowZoneProp);
  }, [showLowZoneProp]);

  // Markers refs
  const vesselMarkerRef = useRef<maplibregl.Marker | null>(null);
  const cityMarkersRef = useRef<maplibregl.Marker[]>([]);

  // Lagrangian dynamic oil droplet particle animation refs
  const particleAnimRef = useRef<number | null>(null);
  const particlesStateRef = useRef<Array<{
    progress: number;
    speed: number;
    lateralFactor: number;
    baseSize: number;
  }>>([]);

  // Initialize random particle distribution
  useEffect(() => {
    if (particlesStateRef.current.length === 0) {
      const arr = [];
      for (let i = 0; i < 45; i++) {
        arr.push({
          progress: Math.random(),
          speed: 0.75 + Math.random() * 0.5,
          lateralFactor: (Math.random() - 0.5) * 1.6,
          baseSize: 3.5 + Math.random() * 2,
        });
      }
      particlesStateRef.current = arr;
    }
  }, []);

  // Active coordinates resolution
  const activeLat = spillLocation?.lat ?? parameters?.location.latitude ?? 18.9076;
  const activeLng = spillLocation?.lng ?? parameters?.location.longitude ?? 72.8777;

  // 1. Initialize MapLibre GL Map (Runs once on mount)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    try {
      const initialLng = activeLng;
      const initialLat = activeLat;

      // Professional intelligence-platform configuration
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: MAP_BASE_STYLE,
        center: [initialLng, initialLat],
        zoom: 7.2,
        minZoom: 2,
        maxZoom: 18,
        pitch: 15,
        bearing: 0,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Error guard
      map.on('error', (e) => {
        // Tile 404s on deep zoom are expected on edge ocean areas
        if (e.error?.message?.includes('404')) return;
        console.warn('[MapLibre GL Notice]', e);
      });

      // Add navigation controls (Zoom, Compass, Pitch Visualization) to top-right
      const navControl = new maplibregl.NavigationControl({
        visualizePitch: true,
        showCompass: true,
        showZoom: true,
      });
      map.addControl(navControl, 'top-right');

      // Scale control at bottom-left
      const scaleControl = new maplibregl.ScaleControl({
        maxWidth: 140,
        unit: 'metric',
      });
      map.addControl(scaleControl, 'bottom-left');

      map.on('load', () => {
        setMapLoaded(true);
        // Force canvas geometry calculation
        map.resize();
      });

      // Capture cursor coordinates for tactical HUD
      map.on('mousemove', (e) => {
        setCursorCoords({
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
        });
      });

      // Interactive Location Selection
      map.on('click', (e) => {
        const clickLng = e.lngLat.lng;
        const clickLat = e.lngLat.lat;

        // 1. Send location to callback handlers
        onLocationSelect?.({ lat: clickLat, lng: clickLng });
        onMapClickLocation?.(clickLat, clickLng);

        // 2. Smooth camera movement to selected location
        map.flyTo({
          center: [clickLng, clickLat],
          zoom: 7.8,
          duration: 1600,
          essential: true,
        });
      });

      // Immediate resize check
      const resizeTimer = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.resize();
        }
      }, 100);

      return () => {
        clearTimeout(resizeTimer);
        cityMarkersRef.current.forEach((m) => m.remove());
        cityMarkersRef.current = [];
        if (vesselMarkerRef.current) {
          vesselMarkerRef.current.remove();
          vesselMarkerRef.current = null;
        }
        map.remove();
        mapInstanceRef.current = null;
        setMapLoaded(false);
      };
    } catch (err: any) {
      console.error('[MapLibre Initialization Error]:', err);
      setWebGlError(err?.message || 'WebGL initialization error');
    }
  }, []);

  // 2. Container ResizeObserver for seamless adaptation to layout changes
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.resize();
      }
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // 3. Register Core Dynamic GeoJSON Sources & Layers once map is loaded
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    // Helper: Safely add GeoJSON source if it doesn't already exist
    const ensureSource = (id: string, initialData: GeoJSON.GeoJSON) => {
      if (!map.getSource(id)) {
        map.addSource(id, {
          type: 'geojson',
          data: initialData,
        });
      }
    };

    // Helper: Safely add layer if it doesn't already exist
    const ensureLayer = (layerDef: maplibregl.LayerSpecification) => {
      if (!map.getLayer(layerDef.id)) {
        map.addLayer(layerDef);
      }
    };

    // 1. Ocean Currents Source & Layer
    const currentsFeatureCollection: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: CURRENT_STREAMLINES.map((coords, i) => ({
        type: 'Feature',
        id: `current-${i}`,
        properties: { name: 'Coastal Current' },
        geometry: {
          type: 'LineString',
          coordinates: coords,
        },
      })),
    };
    ensureSource('ocean-currents', currentsFeatureCollection);
    ensureLayer({
      id: 'ocean-currents-lines',
      type: 'line',
      source: 'ocean-currents',
      paint: {
        'line-color': '#38bdf8',
        'line-width': 1.6,
        'line-opacity': 0.45,
        'line-dasharray': [4, 4],
      },
    });

    // 2. Dynamic Ocean-Surface Oil Slick Visualization (Smooth organic irregular shapes with 3 concentration zones)
    // 2a. Zone 3: Low Concentration Iridescent Sheen (Light, fragmented traces dispersing into ocean)
    ensureSource('ocean-slick-low', {
      type: 'FeatureCollection',
      features: [],
    });
    ensureLayer({
      id: 'ocean-slick-low-glow',
      type: 'line',
      source: 'ocean-slick-low',
      paint: {
        'line-color': '#f97316',
        'line-width': 8.0,
        'line-blur': 5.0,
        'line-opacity': isOceanSlickVisible && isLowZoneVisible && simulationActive ? 0.35 : 0,
      },
    });
    ensureLayer({
      id: 'ocean-slick-low-fill',
      type: 'fill',
      source: 'ocean-slick-low',
      paint: {
        'fill-color': '#fb923c',
        'fill-opacity': isOceanSlickVisible && isLowZoneVisible && simulationActive ? 0.38 : 0,
      },
    });
    ensureLayer({
      id: 'ocean-slick-low-line',
      type: 'line',
      source: 'ocean-slick-low',
      paint: {
        'line-color': '#fdba74',
        'line-width': 1.2,
        'line-opacity': isOceanSlickVisible && isLowZoneVisible && simulationActive ? 0.70 : 0,
      },
    });

    // 2b. Detached Fragmented Sheen Patches & Wisps (Light orange sheen broken off by wave action)
    ensureSource('ocean-slick-fragmented', {
      type: 'FeatureCollection',
      features: [],
    });
    ensureLayer({
      id: 'ocean-slick-fragmented-glow',
      type: 'line',
      source: 'ocean-slick-fragmented',
      paint: {
        'line-color': '#f97316',
        'line-width': 4.0,
        'line-blur': 3.0,
        'line-opacity': isOceanSlickVisible && isLowZoneVisible && simulationActive ? 0.35 : 0,
      },
    });
    ensureLayer({
      id: 'ocean-slick-fragmented-fill',
      type: 'fill',
      source: 'ocean-slick-fragmented',
      paint: {
        'fill-color': ['coalesce', ['get', 'colorHex'], '#fb923c'],
        'fill-opacity': isOceanSlickVisible && isLowZoneVisible && simulationActive ? ['coalesce', ['get', 'fillOpacity'], 0.36] : 0,
      },
    });
    ensureLayer({
      id: 'ocean-slick-fragmented-line',
      type: 'line',
      source: 'ocean-slick-fragmented',
      paint: {
        'line-color': ['coalesce', ['get', 'edgeColorHex'], '#fdba74'],
        'line-width': 1.0,
        'line-opacity': isOceanSlickVisible && isLowZoneVisible && simulationActive ? 0.75 : 0,
      },
    });

    // 2c. Zone 2: Medium Concentration Emulsion (Vibrant Orange Mousse spreading outward)
    ensureSource('ocean-slick-medium', {
      type: 'FeatureCollection',
      features: [],
    });
    ensureLayer({
      id: 'ocean-slick-medium-glow',
      type: 'line',
      source: 'ocean-slick-medium',
      paint: {
        'line-color': '#ea580c',
        'line-width': 6.0,
        'line-blur': 4.0,
        'line-opacity': isOceanSlickVisible && isMediumZoneVisible && simulationActive ? 0.48 : 0,
      },
    });
    ensureLayer({
      id: 'ocean-slick-medium-fill',
      type: 'fill',
      source: 'ocean-slick-medium',
      paint: {
        'fill-color': '#ea580c',
        'fill-opacity': isOceanSlickVisible && isMediumZoneVisible && simulationActive ? 0.72 : 0,
      },
    });
    ensureLayer({
      id: 'ocean-slick-medium-line',
      type: 'line',
      source: 'ocean-slick-medium',
      paint: {
        'line-color': '#f97316',
        'line-width': 1.8,
        'line-opacity': isOceanSlickVisible && isMediumZoneVisible && simulationActive ? 0.85 : 0,
      },
    });

    // 2d. Zone 1: High Concentration Core (Concentrated Red, dense viscous crude directly at ship hull)
    ensureSource('ocean-slick-high', {
      type: 'FeatureCollection',
      features: [],
    });
    ensureLayer({
      id: 'ocean-slick-high-glow',
      type: 'line',
      source: 'ocean-slick-high',
      paint: {
        'line-color': '#dc2626',
        'line-width': 5.0,
        'line-blur': 3.0,
        'line-opacity': isOceanSlickVisible && isHighZoneVisible && simulationActive ? 0.75 : 0,
      },
    });
    ensureLayer({
      id: 'ocean-slick-high-fill',
      type: 'fill',
      source: 'ocean-slick-high',
      paint: {
        'fill-color': '#dc2626',
        'fill-opacity': isOceanSlickVisible && isHighZoneVisible && simulationActive ? 0.94 : 0,
      },
    });
    ensureLayer({
      id: 'ocean-slick-high-sheen',
      type: 'line',
      source: 'ocean-slick-high',
      paint: {
        'line-color': '#f87171',
        'line-width': 2.2,
        'line-opacity': isOceanSlickVisible && isHighZoneVisible && simulationActive ? 0.90 : 0,
      },
    });

    // 2e. Breached Tank Rupture Continuous Emitter Stream (Concentrated Red Jet)
    ensureSource('ocean-slick-breach-jet', {
      type: 'FeatureCollection',
      features: [],
    });
    ensureLayer({
      id: 'ocean-slick-breach-jet-fill',
      type: 'fill',
      source: 'ocean-slick-breach-jet',
      paint: {
        'fill-color': '#b91c1c',
        'fill-opacity': isOceanSlickVisible && isHighZoneVisible && simulationActive ? 0.96 : 0,
      },
    });
    ensureLayer({
      id: 'ocean-slick-breach-jet-line',
      type: 'line',
      source: 'ocean-slick-breach-jet',
      paint: {
        'line-color': '#f87171',
        'line-width': 1.6,
        'line-opacity': isOceanSlickVisible && isHighZoneVisible && simulationActive ? 0.95 : 0,
      },
    });

    // 2f. Containment Booms Protective Barrier Layer
    ensureSource('containment-booms', {
      type: 'FeatureCollection',
      features: [],
    });

    ensureLayer({
      id: 'containment-booms-glow',
      type: 'line',
      source: 'containment-booms',
      paint: {
        'line-color': '#ea580c',
        'line-width': 6.0,
        'line-opacity': 0.35,
      },
    });

    ensureLayer({
      id: 'containment-booms-line',
      type: 'line',
      source: 'containment-booms',
      paint: {
        'line-color': '#facc15',
        'line-width': 3.5,
        'line-dasharray': [3, 2],
        'line-opacity': 0.95,
      },
    });

    // 3. Multi-tier Plume Concentration Contours (OpenDrift Physical Model)
    ensureSource('plume-contours', {
      type: 'FeatureCollection',
      features: [],
    });

    ensureLayer({
      id: 'plume-contours-fill',
      type: 'fill',
      source: 'plume-contours',
      paint: {
        'fill-color': ['coalesce', ['get', 'colorHex'], '#ea580c'],
        'fill-opacity': ['coalesce', ['get', 'fillOpacity'], 0.35],
      },
    });

    ensureLayer({
      id: 'plume-contours-outline',
      type: 'line',
      source: 'plume-contours',
      paint: {
        'line-color': ['coalesce', ['get', 'colorHex'], '#ff6b00'],
        'line-width': ['case', ['==', ['coalesce', ['get', 'level'], ''], 'Very Thick'], 2.0, 1.0],
        'line-opacity': 0.8,
      },
    });

    // 3b. Lagrangian Dynamic Oil Droplet Particles Layer
    ensureSource('oil-particles', {
      type: 'FeatureCollection',
      features: [],
    });

    ensureLayer({
      id: 'oil-particles-layer',
      type: 'circle',
      source: 'oil-particles',
      paint: {
        'circle-radius': ['coalesce', ['get', 'radius'], 4.0],
        'circle-color': ['coalesce', ['get', 'color'], '#180808'],
        'circle-opacity': ['coalesce', ['get', 'opacity'], 0.85],
        'circle-stroke-color': ['coalesce', ['get', 'strokeColor'], '#b45309'],
        'circle-stroke-width': 1.0,
      },
    });

    // 4. Trajectory Axis Line
    ensureSource('trajectory-line', {
      type: 'FeatureCollection',
      features: [],
    });
    ensureLayer({
      id: 'trajectory-axis',
      type: 'line',
      source: 'trajectory-line',
      paint: {
        'line-color': '#ffffff',
        'line-width': 1.8,
        'line-dasharray': [4, 4],
        'line-opacity': 0.85,
      },
    });

    // 5. Environmental Wind / Waves Grid Source & Layer
    ensureSource('env-vectors', {
      type: 'FeatureCollection',
      features: [],
    });
    ensureLayer({
      id: 'env-vectors-points',
      type: 'circle',
      source: 'env-vectors',
      paint: {
        'circle-radius': 3.5,
        'circle-color': ['coalesce', ['get', 'color'], '#67e8f9'],
        'circle-opacity': 0.65,
      },
    });

    // 6. Oil Spill Source Marker (Point GeoJSON + Glow & Core circle layers)
    const initialSpillPoint: GeoJSON.Feature<GeoJSON.Point> = {
      type: 'Feature',
      properties: { name: 'Spill Origin' },
      geometry: {
        type: 'Point',
        coordinates: [activeLng, activeLat],
      },
    };
    ensureSource('oil-spill', initialSpillPoint);

    // Breach location hazard indicator
    ensureLayer({
      id: 'oil-spill-glow',
      type: 'circle',
      source: 'oil-spill',
      paint: {
        'circle-radius': 14,
        'circle-color': '#ef4444',
        'circle-blur': 0.85,
        'circle-opacity': 0.5,
      },
    });

    ensureLayer({
      id: 'oil-spill-core',
      type: 'circle',
      source: 'oil-spill',
      paint: {
        'circle-radius': 4.5,
        'circle-color': '#ef4444',
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 1.5,
        'circle-opacity': 0.95,
      },
    });

    // 7. Render Coastal City Markers (Clean HTML Markers with pulse dots)
    cityMarkersRef.current.forEach((m) => m.remove());
    cityMarkersRef.current = [];

    COASTAL_CITIES.forEach((city) => {
      const el = document.createElement('div');
      el.className = 'custom-maplibre-city';
      el.innerHTML = `
        <div style="display: flex; align-items: center; gap: 5px; pointer-events: none; user-select: none;">
          <div style="width: 6px; height: 6px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 6px #06b6d4;"></div>
          <span style="color: #f8fafc; font-size: ${city.isMajor ? '12px' : '10px'}; font-weight: ${city.isMajor ? '700' : '500'}; font-family: sans-serif; text-shadow: 0 2px 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.9); letter-spacing: 0.5px;">
            ${city.name}
          </span>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el, anchor: 'left' })
        .setLngLat([city.lng, city.lat])
        .addTo(map);

      cityMarkersRef.current.push(marker);
    });

  }, [mapLoaded]);

  // 4. Update Oil Spill Source Marker dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    const source = map.getSource('oil-spill') as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData({
        type: 'Feature',
        properties: { name: 'Spill Origin' },
        geometry: {
          type: 'Point',
          coordinates: [activeLng, activeLat],
        },
      });
    }
  }, [activeLat, activeLng, mapLoaded]);

  // 5. Initialize & Sync Dynamic Ocean-Surface Oil Slick Sources
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    const highSource = map.getSource('ocean-slick-high') as maplibregl.GeoJSONSource | undefined;
    const medSource = map.getSource('ocean-slick-medium') as maplibregl.GeoJSONSource | undefined;
    const lowSource = map.getSource('ocean-slick-low') as maplibregl.GeoJSONSource | undefined;
    const fragSource = map.getSource('ocean-slick-fragmented') as maplibregl.GeoJSONSource | undefined;
    const jetSource = map.getSource('ocean-slick-breach-jet') as maplibregl.GeoJSONSource | undefined;

    if (simulationResult && simulationActive && isOceanSlickVisible) {
      const vesselLat = simulationResult.vesselPosition[0];
      const vesselLng = simulationResult.vesselPosition[1];
      const heading = parameters?.vesselDetails.heading ?? 45;

      const slick = generateDynamicOceanSlick({
        originLat: vesselLat,
        originLng: vesselLng,
        vesselHeadingDeg: heading,
        envConditions: simulationResult.environmentalConditions,
        elapsedHours: simulationResult.currentHour ?? 48,
        seepageRateTonnesPerHour: activeSeepageRate,
        initialTonnes: parameters?.spillDetails.amount ?? 100,
        animPhase: animPhaseRef.current,
      });

      if (highSource) highSource.setData(slick.highConcentration);
      if (medSource) medSource.setData(slick.mediumConcentration);
      if (lowSource) lowSource.setData(slick.lowConcentration);
      if (fragSource) fragSource.setData(slick.fragmentedPatches);
      if (jetSource) jetSource.setData(slick.breachJet);
    } else {
      const emptyFC: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
      if (highSource) highSource.setData(emptyFC);
      if (medSource) medSource.setData(emptyFC);
      if (lowSource) lowSource.setData(emptyFC);
      if (fragSource) fragSource.setData(emptyFC);
      if (jetSource) jetSource.setData(emptyFC);
    }
  }, [simulationResult, simulationActive, isOceanSlickVisible, parameters, activeSeepageRate, mapLoaded]);

  // 6. Update Multi-tier Contours, Near-Hull Slick, Containment Booms, & Vessel Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    const plumeSource = map.getSource('plume-contours') as maplibregl.GeoJSONSource | undefined;
    const trajectorySource = map.getSource('trajectory-line') as maplibregl.GeoJSONSource | undefined;
    const nearHullSource = map.getSource('near-hull-slick') as maplibregl.GeoJSONSource | undefined;
    const boomSource = map.getSource('containment-booms') as maplibregl.GeoJSONSource | undefined;

    if (simulationResult && simulationActive) {
      const vesselLat = simulationResult.vesselPosition[0];
      const vesselLng = simulationResult.vesselPosition[1];
      const heading = parameters?.vesselDetails.heading ?? 45;
      const driftHeading = simulationResult.environmentalConditions?.currentDirectionDeg ?? 135;
      const driftSpeed = simulationResult.environmentalConditions?.currentSpeedKts ?? 2.8;

      // 1. Plume contours
      if (plumeSource) {
        const contourFeatures: GeoJSON.Feature[] = simulationResult.contours.map((contour, index) => {
          // GeoJSON coordinates are [lng, lat]
          const ring = contour.points.map(([lat, lng]) => [lng, lat]);
          // Close the polygon if not already closed
          if (ring.length > 0 && (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1])) {
            ring.push([ring[0][0], ring[0][1]]);
          }

          return {
            type: 'Feature',
            id: index,
            properties: {
              level: contour.level,
              thicknessMicrons: contour.thicknessMicrons,
              colorHex: contour.colorHex,
              fillOpacity: contour.fillOpacity,
            },
            geometry: {
              type: 'Polygon',
              coordinates: [ring],
            },
          };
        });

        plumeSource.setData({
          type: 'FeatureCollection',
          features: contourFeatures,
        });
      }

      // 2. Near-Hull Viscous Heavy Crude Slick (Immediate 150m-300m puddle hugging vessel hull)
      if (nearHullSource) {
        const slickPoints = generateNearHullSlick(vesselLat, vesselLng, heading, driftHeading);
        const slickRing = slickPoints.map(([lat, lng]) => [lng, lat]);
        nearHullSource.setData({
          type: 'Feature',
          properties: { level: 'Heavy Core' },
          geometry: {
            type: 'Polygon',
            coordinates: [slickRing],
          },
        });
      }

      // 3. Containment Booms Protective Barrier
      if (boomSource) {
        if (showBooms) {
          const boomPoints = generateContainmentBoom(vesselLat, vesselLng, driftHeading);
          const boomCoords = boomPoints.map(([lat, lng]) => [lng, lat]);
          boomSource.setData({
            type: 'Feature',
            properties: { type: 'Deflection Boom' },
            geometry: {
              type: 'LineString',
              coordinates: boomCoords,
            },
          });
        } else {
          boomSource.setData({ type: 'FeatureCollection', features: [] });
        }
      }

      // 4. Trajectory Axis Line
      if (trajectorySource) {
        const originLng = simulationResult.spillOrigin[1];
        const originLat = simulationResult.spillOrigin[0];
        const centroidLng = simulationResult.slickCentroid[1];
        const centroidLat = simulationResult.slickCentroid[0];

        trajectorySource.setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [vesselLng, vesselLat],
              [originLng, originLat],
              [centroidLng, centroidLat],
            ],
          },
        });
      }

      // 5. Rich Aframax Tanker Vessel Marker with Leak Emitter & Local Oil Halo
      if (vesselMarkerRef.current) {
        vesselMarkerRef.current.remove();
        vesselMarkerRef.current = null;
      }

      const vesselName = parameters?.vesselDetails.vesselName ?? 'MV Oceanic Star';
      const vesselType = parameters?.vesselDetails.vesselType ?? 'Aframax Crude Tanker';
      const imoNumber = parameters?.vesselDetails.imoNumber ?? '9732548';
      const amount = parameters?.spillDetails.amount ?? 100;
      const amountUnit = parameters?.spillDetails.amountUnit ?? 'Tonnes';

      const vesselEl = document.createElement('div');
      vesselEl.className = 'custom-maplibre-vessel-wrapper';
      vesselEl.innerHTML = `
        <div style="position: relative; width: 96px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <!-- Subtle Hydrodynamic Water Displacement & Waterline Hull Shadow -->
          <div style="position: absolute; width: 98px; height: 34px; border-radius: 40%; background: radial-gradient(ellipse at center, rgba(6,182,212,0.18) 0%, rgba(2,6,23,0.55) 55%, transparent 100%); filter: blur(3px); pointer-events: none; z-index: 1;"></div>
          
          <!-- Heading-oriented Aframax Tanker Graphic -->
          <div style="transform: rotate(${heading}deg); transform-origin: center center; position: relative; z-index: 2; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.95));">
            <svg viewBox="0 0 100 32" width="78" height="25" fill="none">
              <!-- Dark Steel Hull Silhouette -->
              <path d="M6 16 L18 5 L82 5 L94 16 L82 27 L18 27 Z" fill="#091421" stroke="#38bdf8" stroke-width="1.8" />
              <!-- Cargo Tank Bays #1, #2, #4 -->
              <rect x="22" y="8" width="10" height="16" rx="1.5" fill="#17283c" stroke="#475569" stroke-width="0.8" />
              <rect x="34" y="8" width="10" height="16" rx="1.5" fill="#17283c" stroke="#475569" stroke-width="0.8" />
              <!-- Ruptured Cargo Tank #3 (Portside breach origin) -->
              <rect x="46" y="8" width="10" height="16" rx="1.5" fill="#450a0a" stroke="#ef4444" stroke-width="1.4" />
              <rect x="58" y="8" width="10" height="16" rx="1.5" fill="#17283c" stroke="#475569" stroke-width="0.8" />
              <!-- Deck Piping Manifold -->
              <line x1="20" y1="16" x2="68" y2="16" stroke="#cbd5e1" stroke-width="1.4" stroke-dasharray="2,2" />
              <!-- Superstructure / Wheelhouse -->
              <rect x="70" y="7" width="12" height="18" rx="2" fill="#1e293b" stroke="#94a3b8" stroke-width="1.2" />
              <rect x="73" y="10" width="6" height="12" fill="#334155" />
              <circle cx="76" cy="16" r="1.8" fill="#f8fafc" />
              <!-- Funnel / Exhaust Stack -->
              <circle cx="80" cy="16" r="2.2" fill="#0f172a" stroke="#f59e0b" stroke-width="1" />
              <!-- Bow Navigation Light -->
              <circle cx="12" cy="16" r="2" fill="#22c55e" />
            </svg>
            
            <!-- Breached Tank Oil Leak Emitter -->
            <div style="position: absolute; left: 40px; top: 0px; width: 12px; height: 12px; pointer-events: none;">
              <div class="animate-breach-leak" style="position: absolute; inset: 0; border-radius: 50%; border: 2px solid #ef4444; background: rgba(239, 68, 68, 0.45);"></div>
              <div style="position: absolute; inset: 3px; border-radius: 50%; background: #dc2626;"></div>
            </div>
          </div>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 16, closeButton: true, maxWidth: '290px' }).setHTML(`
        <div style="min-width: 220px; font-family: sans-serif; font-size: 11px; color: #f8fafc; line-height: 1.5;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1e3a5f; padding-bottom: 6px; margin-bottom: 8px;">
            <div>
              <span style="color: #38bdf8; font-weight: 700; font-size: 13px; letter-spacing: 0.5px;">${vesselName}</span>
              <div style="color: #94a3b8; font-size: 10px; font-family: monospace;">IMO ${imoNumber} • ${vesselType}</div>
            </div>
            <span style="background: rgba(239,68,68,0.25); color: #f87171; border: 1px solid rgba(239,68,68,0.6); padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 700;">SPILL SOURCE</span>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 10px; margin-bottom: 8px; font-family: monospace;">
            <div style="background: rgba(15,23,42,0.6); padding: 4px 6px; border-radius: 4px; border: 1px solid #1e293b;">
              <span style="color: #64748b;">DISCHARGED:</span><br/>
              <strong style="color: #f59e0b;">${amount} ${amountUnit}</strong>
            </div>
            <div style="background: rgba(15,23,42,0.6); padding: 4px 6px; border-radius: 4px; border: 1px solid #1e293b;">
              <span style="color: #64748b;">HULL SLICK:</span><br/>
              <strong style="color: #ef4444;">&gt; 250 μm (Core)</strong>
            </div>
            <div style="background: rgba(15,23,42,0.6); padding: 4px 6px; border-radius: 4px; border: 1px solid #1e293b;">
              <span style="color: #64748b;">HEADING:</span><br/>
              <strong style="color: #38bdf8;">${heading}°</strong>
            </div>
            <div style="background: rgba(15,23,42,0.6); padding: 4px 6px; border-radius: 4px; border: 1px solid #1e293b;">
              <span style="color: #64748b;">DRIFT VECTOR:</span><br/>
              <strong style="color: #34d399;">${driftHeading}° @ ${driftSpeed} kts</strong>
            </div>
          </div>

          <div style="background: rgba(88,23,23,0.3); border: 1px solid rgba(239,68,68,0.4); border-radius: 6px; padding: 5px 8px; font-size: 10px; margin-bottom: 6px;">
            <span style="color: #fca5a5; font-weight: 600;">⚠️ Casualty Incident:</span>
            <div style="color: #cbd5e1; font-size: 9.5px;">Portside Cargo Tank #3 ruptured. Active continuous heavy crude release into surrounding waters.</div>
          </div>
        </div>
      `);

      vesselMarkerRef.current = new maplibregl.Marker({ element: vesselEl, anchor: 'center' })
        .setLngLat([vesselLng, vesselLat])
        .setPopup(popup)
        .addTo(map);

    } else {
      // Clear contours if simulation not active
      if (plumeSource) {
        plumeSource.setData({ type: 'FeatureCollection', features: [] });
      }
      if (nearHullSource) {
        nearHullSource.setData({ type: 'FeatureCollection', features: [] });
      }
      if (boomSource) {
        boomSource.setData({ type: 'FeatureCollection', features: [] });
      }
      if (trajectorySource) {
        trajectorySource.setData({ type: 'FeatureCollection', features: [] });
      }
      if (vesselMarkerRef.current) {
        vesselMarkerRef.current.remove();
        vesselMarkerRef.current = null;
      }
    }
  }, [simulationResult, simulationActive, parameters, mapLoaded, showBooms]);

  // 6d. Dynamically update Ocean Slick Zones visibility opacities
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    // Ocean Slick Zone 3: Low Concentration & Sheen Fragments (Light Orange)
    const lowOpacity = isOceanSlickVisible && isLowZoneVisible && simulationActive ? 0.38 : 0;
    const lowGlowOpacity = isOceanSlickVisible && isLowZoneVisible && simulationActive ? 0.35 : 0;
    const lowLineOpacity = isOceanSlickVisible && isLowZoneVisible && simulationActive ? 0.70 : 0;
    if (map.getLayer('ocean-slick-low-fill')) map.setPaintProperty('ocean-slick-low-fill', 'fill-opacity', lowOpacity);
    if (map.getLayer('ocean-slick-low-glow')) map.setPaintProperty('ocean-slick-low-glow', 'line-opacity', lowGlowOpacity);
    if (map.getLayer('ocean-slick-low-line')) map.setPaintProperty('ocean-slick-low-line', 'line-opacity', lowLineOpacity);

    const fragOpacity = isOceanSlickVisible && isLowZoneVisible && simulationActive ? 0.36 : 0;
    if (map.getLayer('ocean-slick-fragmented-fill')) map.setPaintProperty('ocean-slick-fragmented-fill', 'fill-opacity', fragOpacity);
    if (map.getLayer('ocean-slick-fragmented-glow')) map.setPaintProperty('ocean-slick-fragmented-glow', 'line-opacity', fragOpacity);
    if (map.getLayer('ocean-slick-fragmented-line')) map.setPaintProperty('ocean-slick-fragmented-line', 'line-opacity', isOceanSlickVisible && isLowZoneVisible && simulationActive ? 0.75 : 0);

    // Ocean Slick Zone 2: Medium Concentration Emulsion (Vibrant Orange)
    const medOpacity = isOceanSlickVisible && isMediumZoneVisible && simulationActive ? 0.72 : 0;
    const medGlowOpacity = isOceanSlickVisible && isMediumZoneVisible && simulationActive ? 0.48 : 0;
    const medLineOpacity = isOceanSlickVisible && isMediumZoneVisible && simulationActive ? 0.85 : 0;
    if (map.getLayer('ocean-slick-medium-fill')) map.setPaintProperty('ocean-slick-medium-fill', 'fill-opacity', medOpacity);
    if (map.getLayer('ocean-slick-medium-glow')) map.setPaintProperty('ocean-slick-medium-glow', 'line-opacity', medGlowOpacity);
    if (map.getLayer('ocean-slick-medium-line')) map.setPaintProperty('ocean-slick-medium-line', 'line-opacity', medLineOpacity);

    // Ocean Slick Zone 1: High Concentration Core & Breach Jet (Concentrated Red)
    const highOpacity = isOceanSlickVisible && isHighZoneVisible && simulationActive ? 0.94 : 0;
    const highGlowOpacity = isOceanSlickVisible && isHighZoneVisible && simulationActive ? 0.75 : 0;
    const highSheenOpacity = isOceanSlickVisible && isHighZoneVisible && simulationActive ? 0.90 : 0;
    if (map.getLayer('ocean-slick-high-fill')) map.setPaintProperty('ocean-slick-high-fill', 'fill-opacity', highOpacity);
    if (map.getLayer('ocean-slick-high-glow')) map.setPaintProperty('ocean-slick-high-glow', 'line-opacity', highGlowOpacity);
    if (map.getLayer('ocean-slick-high-sheen')) map.setPaintProperty('ocean-slick-high-sheen', 'line-opacity', highSheenOpacity);

    const jetOpacity = isOceanSlickVisible && isHighZoneVisible && simulationActive ? 0.96 : 0;
    if (map.getLayer('ocean-slick-breach-jet-fill')) map.setPaintProperty('ocean-slick-breach-jet-fill', 'fill-opacity', jetOpacity);
    if (map.getLayer('ocean-slick-breach-jet-line')) map.setPaintProperty('ocean-slick-breach-jet-line', 'line-opacity', isOceanSlickVisible && isHighZoneVisible && simulationActive ? 0.95 : 0);
  }, [
    isOceanSlickVisible, 
    isHighZoneVisible, 
    isMediumZoneVisible, 
    isLowZoneVisible, 
    simulationActive, 
    mapLoaded
  ]);

  // 6b. Dynamic Living Fluid Loop: Undulating Ocean Slick Waves & Lagrangian Droplets
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || !simulationActive || !simulationResult) {
      if (particleAnimRef.current) {
        cancelAnimationFrame(particleAnimRef.current);
        particleAnimRef.current = null;
      }
      const pSource = map?.getSource('oil-particles') as maplibregl.GeoJSONSource | undefined;
      if (pSource) pSource.setData({ type: 'FeatureCollection', features: [] });
      return;
    }

    const pSource = map.getSource('oil-particles') as maplibregl.GeoJSONSource | undefined;
    const highSource = map.getSource('ocean-slick-high') as maplibregl.GeoJSONSource | undefined;
    const medSource = map.getSource('ocean-slick-medium') as maplibregl.GeoJSONSource | undefined;
    const lowSource = map.getSource('ocean-slick-low') as maplibregl.GeoJSONSource | undefined;
    const fragSource = map.getSource('ocean-slick-fragmented') as maplibregl.GeoJSONSource | undefined;
    const jetSource = map.getSource('ocean-slick-breach-jet') as maplibregl.GeoJSONSource | undefined;

    const vesselLat = simulationResult.vesselPosition[0];
    const vesselLng = simulationResult.vesselPosition[1];
    const vesselHeading = parameters?.vesselDetails.heading ?? 45;
    const driftHeading = simulationResult.environmentalConditions?.currentDirectionDeg ?? 135;
    const driftSpeed = simulationResult.environmentalConditions?.currentSpeedKts ?? 2.8;
    const driftRad = (driftHeading * Math.PI) / 180;
    const sinD = Math.sin(driftRad);
    const cosD = Math.cos(driftRad);
    const kmPerDegLat = 111.0;
    const kmPerDegLng = 111.0 * Math.cos((vesselLat * Math.PI) / 180);
    const maxDriftKm = Math.min(8.0, 0.14 * Math.max(1, simulationResult.currentHour) * driftSpeed);

    let lastTime = performance.now();

    const renderSimulationLoop = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      // 1. Advance fluid wave & swell oscillation phase
      animPhaseRef.current += dt * 1.5;

      // 2. Dynamically recompute and undulate the 3-zone ocean-surface slick polygons at smooth ~25 FPS
      if (now - lastSlickUpdateRef.current > 40) {
        lastSlickUpdateRef.current = now;
        if (isOceanSlickVisible) {
          const slick = generateDynamicOceanSlick({
            originLat: vesselLat,
            originLng: vesselLng,
            vesselHeadingDeg: vesselHeading,
            envConditions: simulationResult.environmentalConditions,
            elapsedHours: simulationResult.currentHour ?? 48,
            seepageRateTonnesPerHour: activeSeepageRate,
            initialTonnes: parameters?.spillDetails.amount ?? 100,
            animPhase: animPhaseRef.current,
          });

          if (highSource) highSource.setData(slick.highConcentration);
          if (medSource) medSource.setData(slick.mediumConcentration);
          if (lowSource) lowSource.setData(slick.lowConcentration);
          if (fragSource) fragSource.setData(slick.fragmentedPatches);
          if (jetSource) jetSource.setData(slick.breachJet);
        }
      }

      // 3. Subtle Lagrangian micro-droplet particle dispersion
      if (showLiveParticles && pSource) {
        const features: GeoJSON.Feature[] = [];

        particlesStateRef.current.forEach((p, idx) => {
          p.progress += dt * 0.07 * p.speed;
          if (p.progress >= 1.0) {
            p.progress = 0;
            p.lateralFactor = (Math.random() - 0.5) * 1.6;
          }

          // Distance downstream along plume axis
          const distKm = p.progress * maxDriftKm;
          // Lateral expansion increases downstream
          const latWidthKm = (0.06 + 0.35 * Math.pow(p.progress, 0.68)) * p.lateralFactor;

          // Geographical position
          const dEastKm = distKm * sinD + latWidthKm * cosD;
          const dNorthKm = distKm * cosD - latWidthKm * sinD;

          const pLat = vesselLat + dNorthKm / kmPerDegLat;
          const pLng = vesselLng + dEastKm / kmPerDegLng;

          // Visual weathering progression: dense region (near source) is concentrated red, turning orange outward
          let color = '#dc2626';
          let strokeColor = '#f87171';
          const opacity = 0.95 * (1 - p.progress * 0.60);
          const radius = p.baseSize * (1 + p.progress * 0.85);

          if (p.progress > 0.60) {
            // Low concentration / outer boundary: light orange
            color = '#fb923c';
            strokeColor = '#fdba74';
          } else if (p.progress > 0.25) {
            // Medium concentration: vibrant orange
            color = '#ea580c';
            strokeColor = '#f97316';
          } else {
            // High concentration core near breach: concentrated red
            color = '#dc2626';
            strokeColor = '#f87171';
          }

          features.push({
            type: 'Feature',
            id: idx,
            properties: {
              radius,
              color,
              strokeColor,
              opacity,
            },
            geometry: {
              type: 'Point',
              coordinates: [pLng, pLat],
            },
          });
        });

        pSource.setData({
          type: 'FeatureCollection',
          features,
        });
      }

      particleAnimRef.current = requestAnimationFrame(renderSimulationLoop);
    };

    particleAnimRef.current = requestAnimationFrame(renderSimulationLoop);

    return () => {
      if (particleAnimRef.current) {
        cancelAnimationFrame(particleAnimRef.current);
        particleAnimRef.current = null;
      }
    };
  }, [simulationActive, showLiveParticles, isOceanSlickVisible, mapLoaded, simulationResult, parameters, activeSeepageRate]);

  // 7. Update Environmental Wind / Wave Field Overlay
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    const envSource = map.getSource('env-vectors') as maplibregl.GeoJSONSource | undefined;
    if (!envSource) return;

    if (!showWind && !showWaves) {
      envSource.setData({ type: 'FeatureCollection', features: [] });
      return;
    }

    const features: GeoJSON.Feature[] = [];
    const color = showWind ? '#a7f3d0' : '#67e8f9';

    for (let lat = 18.3; lat <= 19.1; lat += 0.15) {
      for (let lng = 72.3; lng <= 73.1; lng += 0.15) {
        features.push({
          type: 'Feature',
          properties: { color },
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
        });
      }
    }

    envSource.setData({
      type: 'FeatureCollection',
      features,
    });
  }, [showWind, showWaves, mapLoaded]);

  // 8. Handle External Camera Controls (flyToLocation / focusCoords)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const target = flyToLocation ?? (focusCoords ? { lat: focusCoords[0], lng: focusCoords[1] } : null);
    if (target) {
      const isShip = simulationResult && (
        Math.abs(target.lat - simulationResult.vesselPosition[0]) < 0.005 &&
        Math.abs(target.lng - simulationResult.vesselPosition[1]) < 0.005
      );

      map.flyTo({
        center: [target.lng, target.lat],
        zoom: isShip ? 14.8 : 10.5,
        pitch: isShip ? 35 : 15,
        duration: 1600,
        essential: true,
      });
    }
  }, [flyToLocation, focusCoords, simulationResult]);

  // 9. Handle Zoom In / Zoom Out Action triggers
  useEffect(() => {
    if (zoomAction > 0 && mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  }, [zoomAction]);

  useEffect(() => {
    if (zoomOutAction > 0 && mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  }, [zoomOutAction]);

  // 10. Handle Instant Basemap Layer Switching (Dark Maritime, Satellite Ocean, Ocean Basemap)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    const basemapLayers = [
      { key: 'dark', id: 'layer-dark' },
      { key: 'voyager', id: 'layer-voyager' },
      { key: 'satellite', id: 'layer-satellite' },
      { key: 'ocean', id: 'layer-ocean' },
    ];

    basemapLayers.forEach(({ key, id }) => {
      if (map.getLayer(id)) {
        const isVisible = (currentLayerId === key) || (key === 'dark' && !['voyager', 'satellite', 'ocean'].includes(currentLayerId));
        map.setLayoutProperty(id, 'visibility', isVisible ? 'visible' : 'none');
      }
    });
  }, [currentLayerId, mapLoaded]);

  const handleToggleOceanSlick = () => {
    const next = !isOceanSlickVisible;
    setIsOceanSlickVisible(next);
    if (onToggleOceanSlick) onToggleOceanSlick(next);
  };

  const handleToggleHighZone = () => {
    const next = !isHighZoneVisible;
    setIsHighZoneVisible(next);
    if (onToggleHighZone) onToggleHighZone(next);
  };

  const handleToggleMediumZone = () => {
    const next = !isMediumZoneVisible;
    setIsMediumZoneVisible(next);
    if (onToggleMediumZone) onToggleMediumZone(next);
  };

  const handleToggleLowZone = () => {
    const next = !isLowZoneVisible;
    setIsLowZoneVisible(next);
    if (onToggleLowZone) onToggleLowZone(next);
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#07131f] select-none">
      {/* MapLibre WebGL Canvas Container */}
      <div 
        id="simulation-maplibre-canvas"
        ref={mapContainerRef} 
        className="w-full h-full cursor-crosshair relative z-0"
      />

      {/* WebGL Error Fallback Card if graphics context fails */}
      {webGlError && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-[#07111b]/95 backdrop-blur-md">
          <div className="max-w-md p-6 rounded-xl bg-[#0e1e2e] border border-red-500/30 text-center shadow-2xl">
            <div className="text-3xl mb-3">⚠️</div>
            <h3 className="text-base font-semibold text-white mb-2">WebGL Renderer Warning</h3>
            <p className="text-xs text-slate-400 mb-4 font-mono-code">
              {webGlError}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white shadow-lg transition-all"
            >
              Reload Map Canvas
            </button>
          </div>
        </div>
      )}

      {/* Floating Tactical Coordinate HUD (Bottom Left) */}
      <div 
        id="map-telemetry-hud"
        className="absolute bottom-3 left-4 z-10 hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#050d18]/90 border border-[#132738] text-[11px] font-mono-code text-slate-400 shadow-xl backdrop-blur-md"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-medium">MAPLIBRE GL</span>
        </div>
        <span className="text-slate-600">|</span>
        <div>
          <span>CURSOR: </span>
          <span className="text-cyan-300">
            {cursorCoords 
              ? `${cursorCoords.lat.toFixed(4)}°N, ${cursorCoords.lng.toFixed(4)}°E` 
              : `${activeLat.toFixed(4)}°N, ${activeLng.toFixed(4)}°E`}
          </span>
        </div>
        <span className="text-slate-600">|</span>
        <div>
          <span>RADIUS: </span>
          <span className="text-amber-400">{(affectedRadius / 1000).toFixed(0)} km</span>
        </div>
        <span className="text-slate-600">|</span>
        <div>
          <span>BASEMAP: </span>
          <span className="text-emerald-300 uppercase">{currentLayerId}</span>
        </div>
      </div>

      {/* Parameter Edit Shortcut Pill */}
      {onOpenParameters && parameters && (
        <button
          id="btn-map-edit-params-pill"
          onClick={onOpenParameters}
          className="absolute bottom-3 right-40 z-10 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#07131F]/90 hover:bg-[#0b1c2b] border border-[#1d3852] text-slate-300 hover:text-white shadow-xl backdrop-blur-md text-[11px] font-mono-code transition-all cursor-pointer"
          title="Open Input Parameters to modify coordinates or spill volume"
        >
          <span className="text-cyan-400">⚙️</span>
          <span>{parameters.vesselDetails.vesselName}</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400">{parameters.spillDetails.amount} {parameters.spillDetails.amountUnit}</span>
          <span className="text-cyan-400 font-medium ml-0.5 hover:underline">Edit</span>
        </button>
      )}
    </div>
  );
}
