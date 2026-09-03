/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Satellite, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sliders, 
  Layers, 
  Info, 
  Eye, 
  Split, 
  X, 
  Crosshair,
  ShieldCheck
} from 'lucide-react';
import { SatelliteMetadata, SpillCharacteristics } from '../../types/alertTypes';

interface SatelliteSpillViewerProps {
  satellite: SatelliteMetadata;
  characteristics: SpillCharacteristics;
  incidentId: string;
}

export function SatelliteSpillViewer({
  satellite,
  characteristics,
  incidentId,
}: SatelliteSpillViewerProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showBoundary, setShowBoundary] = useState<boolean>(true);
  const [colorMode, setColorMode] = useState<'SAR_CONTRAST' | 'THERMAL_INFRARED' | 'NATURAL_RGB'>('SAR_CONTRAST');
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [compareSplit, setCompareSplit] = useState<number>(50);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [isFullscreenModal, setIsFullscreenModal] = useState<boolean>(false);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(2.5, prev + 0.25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0.75, prev - 0.25));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <section 
      id="satellite-spill-detection"
      className="rounded-2xl border border-cyan-950/90 bg-slate-950/80 backdrop-blur-md overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.6)] mb-6"
    >
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-cyan-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold font-mono-code text-white uppercase tracking-wide">
                🛰 SATELLITE SPILL DETECTION
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                {satellite.satelliteName}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono-code mt-0.5">
              Acquisition: <span className="text-slate-200">{satellite.acquisitionTimeUtc}</span> • {satellite.sensorMode}
            </p>
          </div>
        </div>

        {/* AI Confidence & Top Stats */}
        <div className="flex items-center gap-2 sm:gap-4 self-end sm:self-auto">
          <div className="text-right">
            <div className="text-[10px] font-mono-code text-slate-400">AI DETECTION CONFIDENCE</div>
            <div className="text-base sm:text-lg font-bold font-mono-code text-cyan-300 flex items-center justify-end gap-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>{satellite.aiConfidencePercentage}%</span>
            </div>
          </div>

          <button
            id="btn-toggle-details"
            onClick={() => setShowDetails(!showDetails)}
            className={`p-2 rounded-lg border text-xs font-mono-code transition-colors cursor-pointer ${
              showDetails 
                ? 'bg-cyan-500 text-black border-cyan-400' 
                : 'bg-slate-900 border-cyan-950 text-slate-300 hover:text-white'
            }`}
            title="Toggle Sensor Specifications"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sensor Metadata Drawer (Collapsible) */}
      {showDetails && (
        <div className="bg-slate-900/90 border-b border-cyan-950/80 p-4 text-xs font-mono-code grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-300">
          <div>
            <span className="text-slate-400 block text-[10px]">SENSOR PAYLOAD</span>
            <span className="text-cyan-300 font-semibold">{satellite.sensorType}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">POLARIZATION</span>
            <span className="text-white font-semibold">{satellite.polarization}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">SPATIAL RESOLUTION</span>
            <span className="text-white font-semibold">{satellite.resolutionMeters}m Pixel Ground Sample</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">ORBIT / SCENE ID</span>
            <span className="text-slate-300 font-mono text-[11px] truncate block">{satellite.passOrbitId}</span>
          </div>
        </div>
      )}

      {/* Main Satellite Imagery Canvas Viewport */}
      <div className="relative w-full h-[380px] sm:h-[460px] bg-[#020914] overflow-hidden select-none border-b border-cyan-950/60">
        {/* Synthetic Aperture Radar (SAR) Ocean Canvas Graphic */}
        <div 
          className="w-full h-full relative transition-transform duration-200 flex items-center justify-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Base Ocean SAR Texture (Visual simulation of radar backscatter dampening) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#021021] via-[#04162e] to-[#010b17]">
            {/* Fine radar scan lines grid */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* Ocean swell wave pattern simulation */}
            <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="sar-waves" width="120" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 0 20 Q 30 5 60 20 T 120 20" fill="none" stroke="#00d2ff" strokeWidth="0.8" opacity="0.4" />
                  <path d="M 0 35 Q 30 20 60 35 T 120 35" fill="none" stroke="#0099cc" strokeWidth="0.5" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#sar-waves)" />
            </svg>
          </div>

          {/* SVG Overlay: Detected Oil Spill Slick (Dark radar backscatter dampening zone + glowing contour) */}
          <svg 
            className="w-full h-full absolute inset-0 pointer-events-none" 
            viewBox="0 0 800 460"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Radial filter for oil slick dampening */}
              <filter id="spill-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <linearGradient id="slickFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#01060d" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#020d1c" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#041830" stopOpacity="0.75" />
              </linearGradient>

              <linearGradient id="thermalSlick" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#2563eb" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Normal Radar Backscatter Suppression Zone (Oil flattens capillary waves => appears dark) */}
            <path
              d="M 280 180 C 330 150, 420 170, 480 200 C 530 225, 590 260, 560 290 C 530 320, 430 300, 370 270 C 310 240, 240 210, 280 180 Z"
              fill={colorMode === 'THERMAL_INFRARED' ? 'url(#thermalSlick)' : 'url(#slickFill)'}
              stroke="#01060d"
              strokeWidth="2"
            />

            {/* Trailing thin sheen ribbon */}
            <path
              d="M 270 185 C 230 195, 190 205, 150 215 C 130 220, 110 225, 90 228"
              fill="none"
              stroke={colorMode === 'THERMAL_INFRARED' ? '#a855f7' : '#031024'}
              strokeWidth="18"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Boundary Polygon Outline with High-Tech Pulsing Glow */}
            {showBoundary && (
              <g id="slick-boundary-layer">
                {/* Outer bounding contour */}
                <path
                  d="M 280 180 C 330 150, 420 170, 480 200 C 530 225, 590 260, 560 290 C 530 320, 430 300, 370 270 C 310 240, 240 210, 280 180 Z"
                  fill="none"
                  stroke={colorMode === 'THERMAL_INFRARED' ? '#ec4899' : '#00ffff'}
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  filter="url(#spill-glow)"
                  className="animate-pulse"
                />

                {/* Sheen tail boundary */}
                <path
                  d="M 270 185 C 230 195, 190 205, 150 215 C 130 220, 110 225, 90 228"
                  fill="none"
                  stroke="#00ffff"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.7"
                />

                {/* Centroid Crosshairs Marker */}
                <g transform="translate(420, 235)">
                  <circle r="12" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" className="animate-spin" />
                  <circle r="3" fill="#ef4444" />
                  <line x1="-18" y1="0" x2="18" y2="0" stroke="#ef4444" strokeWidth="1" opacity="0.7" />
                  <line x1="0" y1="-18" x2="0" y2="18" stroke="#ef4444" strokeWidth="1" opacity="0.7" />
                  <text x="18" y="-12" fill="#00ffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    SLICK CENTROID ({characteristics.estimatedAreaKm2} km²)
                  </text>
                </g>

                {/* Length & Width dimension annotations */}
                <line x1="160" y1="210" x2="550" y2="280" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                <text x="350" y="235" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  MAJOR AXIS: {characteristics.lengthKm} KM
                </text>
              </g>
            )}
          </svg>

          {/* Before / After Comparison Overlay Mode */}
          {isComparing && (
            <div 
              className="absolute inset-0 border-r-2 border-cyan-400 pointer-events-none z-10"
              style={{
                width: `${compareSplit}%`,
                backgroundColor: 'rgba(2, 6, 23, 0.9)',
                overflow: 'hidden',
              }}
            >
              <div className="absolute top-4 left-4 px-2 py-1 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-mono-code text-slate-300">
                PRE-PASS BASELINE (T - 24H) • NO SLICK PRESENT
              </div>
              <div className="w-full h-full flex items-center justify-center opacity-30">
                <span className="text-xs font-mono-code text-slate-400">UNPERTURBED BACKGROUND SEA SURFACE</span>
              </div>
            </div>
          )}
        </div>

        {/* Comparison Split Slider (Visible when comparing) */}
        {isComparing && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-64 bg-slate-950/90 border border-cyan-500/40 rounded-full px-4 py-2 flex items-center gap-3 z-20">
            <span className="text-[10px] font-mono-code text-slate-400">PRE</span>
            <input
              type="range"
              min="10"
              max="90"
              value={compareSplit}
              onChange={(e) => setCompareSplit(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-ew-resize"
            />
            <span className="text-[10px] font-mono-code text-cyan-400">CURRENT</span>
          </div>
        )}

        {/* Viewport Floating HUD Overlays */}
        {/* Top-Left: Live Telemetry Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          <div className="px-2.5 py-1 rounded bg-slate-950/85 border border-cyan-950 text-[10px] font-mono-code text-cyan-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>SAR C-BAND LEVEL-1B SLC</span>
          </div>
          <div className="px-2.5 py-0.5 rounded bg-slate-950/70 text-[9px] font-mono-code text-slate-400">
            INCIDENT: {incidentId}
          </div>
        </div>

        {/* Bottom-Left: Scale & Grid readout */}
        <div className="absolute bottom-3 left-3 bg-slate-950/85 border border-slate-800 rounded px-2.5 py-1 text-[10px] font-mono-code text-slate-300 flex items-center gap-3 z-10">
          <div className="flex items-center gap-1.5">
            <div className="w-12 h-1 bg-cyan-400" />
            <span>2.0 KM</span>
          </div>
          <span className="text-slate-600">|</span>
          <span>ZOOM: {zoomLevel.toFixed(2)}x</span>
        </div>

        {/* Bottom-Right Viewport Control Cluster */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-950/90 border border-cyan-950 p-1 rounded-xl shadow-xl z-20">
          <button
            id="btn-zoom-in"
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-300 cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            id="btn-zoom-out"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-300 cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            id="btn-reset-zoom"
            onClick={handleResetZoom}
            title="Reset Zoom"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-300 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-slate-800 mx-0.5" />
          <button
            id="btn-toggle-boundary"
            onClick={() => setShowBoundary(!showBoundary)}
            title="Toggle Spill Boundary Outline"
            className={`p-1.5 rounded text-xs font-mono-code flex items-center gap-1 cursor-pointer ${
              showBoundary ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px]">Boundary</span>
          </button>
          <button
            id="btn-compare-prev"
            onClick={() => setIsComparing(!isComparing)}
            title="Compare with Pre-Spill Baseline Pass"
            className={`p-1.5 rounded text-xs font-mono-code flex items-center gap-1 cursor-pointer ${
              isComparing ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px]">Compare</span>
          </button>
          <button
            id="btn-fullscreen-sat"
            onClick={() => setIsFullscreenModal(true)}
            title="View Full Image (High-Res Inspection)"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-300 cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer Controls & Color Palette Presets */}
      <div className="p-3 sm:p-4 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Spectral Palette:</span>
          {(['SAR_CONTRAST', 'THERMAL_INFRARED', 'NATURAL_RGB'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setColorMode(mode)}
              className={`px-2.5 py-1 rounded text-[10px] cursor-pointer transition-colors ${
                colorMode === mode
                  ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-semibold'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>Slick Geometry:</span>
          <span className="text-slate-200 font-bold">{characteristics.shapeDescription}</span>
        </div>
      </div>

      {/* Fullscreen High-Resolution Inspection Modal */}
      {isFullscreenModal && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col p-4 sm:p-8 backdrop-blur-xl animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-cyan-950 text-white font-mono-code">
            <div className="flex items-center gap-3">
              <Satellite className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-sm sm:text-base">
                FULL SCENE SATELLITE INSPECTION • {satellite.satelliteName} ({incidentId})
              </span>
            </div>
            <button
              onClick={() => setIsFullscreenModal(false)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>
          </div>

          <div className="flex-1 relative flex items-center justify-center overflow-hidden my-4 bg-slate-950 border border-cyan-950/80 rounded-xl p-4">
            <div className="text-center max-w-lg">
              <div className="w-24 h-24 mx-auto rounded-full bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center mb-4 text-cyan-400">
                <Satellite className="w-10 h-10 animate-pulse" />
              </div>
              <h3 className="text-base font-bold font-mono-code text-white mb-2">
                10-METER RADAR CALIBRATION SCENE
              </h3>
              <p className="text-xs text-slate-400 font-mono-code mb-4 leading-relaxed">
                Full-swath SAR Interferometric Wide scene loaded. Detected slick boundary covers 
                <span className="text-cyan-300 font-bold"> {characteristics.estimatedAreaKm2} km²</span> across coordinates 
                <span className="text-cyan-300"> 25.8412° N, 56.4921° E</span>. Ocean capillary wave suppression confirmed with 94.2% AI confidence index.
              </p>
              <div className="inline-flex gap-2">
                <button
                  onClick={() => setIsFullscreenModal(false)}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold text-xs font-mono-code hover:bg-cyan-400 cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
