/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Compass, 
  Wind, 
  Waves, 
  Thermometer, 
  Navigation, 
  Clock, 
  ChevronRight, 
  Layers, 
  Maximize2 
} from 'lucide-react';
import { Coordinates, MetoceanData, TrajectoryPoint } from '../../types/alertTypes';

interface SpillTrajectoryMapProps {
  trajectory: {
    origin: TrajectoryPoint;
    current: TrajectoryPoint;
    predictions: TrajectoryPoint[];
  };
  metocean: MetoceanData;
  isFocused?: boolean;
}

export function SpillTrajectoryMap({
  trajectory,
  metocean,
}: SpillTrajectoryMapProps) {
  const [selectedProjection, setSelectedProjection] = useState<'ALL' | '+6H' | '+12H' | '+24H'>('ALL');
  const [activeHoverPoint, setActiveHoverPoint] = useState<string | null>(null);

  const { origin, current, predictions } = trajectory;
  const p6 = predictions.find((p) => p.label === '+6 Hours') || predictions[0];
  const p12 = predictions.find((p) => p.label === '+12 Hours') || predictions[1];
  const p24 = predictions.find((p) => p.label === '+24 Hours') || predictions[2];

  return (
    <section 
      id="spill-trajectory-movement"
      className="rounded-2xl border border-cyan-950/80 bg-slate-950/80 backdrop-blur-md overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.6)] mb-6"
    >
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-cyan-950/80 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold font-mono-code text-white uppercase tracking-wide">
                🌊 SPILL TRAJECTORY & MOVEMENT
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                LAGRANGIAN DRIFT MODEL
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono-code mt-0.5">
              Directional Path: <strong className="text-amber-300">Estimated Origin</strong> → <strong className="text-cyan-300">Current Spill</strong> → <strong className="text-purple-300">Future Prediction</strong>
            </p>
          </div>
        </div>

        {/* Forecast Horizon Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs font-mono-code self-start md:self-auto">
          {(['ALL', '+6H', '+12H', '+24H'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedProjection(tab)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                selectedProjection === tab
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(0,255,255,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab === 'ALL' ? 'Full Track' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Environmental Field Conditions Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-4 bg-slate-900/70 border-b border-cyan-950/80 text-xs font-mono-code">
        <div className="flex items-center gap-2">
          <Navigation 
            className="w-4 h-4 text-cyan-400 shrink-0" 
            style={{ transform: `rotate(${metocean.currentHeadingDeg}deg)` }} 
          />
          <div>
            <span className="text-[10px] text-slate-400 block">SURFACE CURRENT</span>
            <span className="text-cyan-300 font-bold">
              {metocean.surfaceCurrentKts} kts @ {metocean.currentHeadingDeg}°
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Wind 
            className="w-4 h-4 text-sky-400 shrink-0" 
            style={{ transform: `rotate(${metocean.windDirectionDeg}deg)` }} 
          />
          <div>
            <span className="text-[10px] text-slate-400 block">WIND VECTOR</span>
            <span className="text-sky-300 font-bold">
              {metocean.windSpeedKts} kts @ {metocean.windDirectionDeg}°
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Waves className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block">SIGNIFICANT WAVE</span>
            <span className="text-white font-bold">
              {metocean.waveHeightMeters}m (Beaufort {metocean.seaStateBeaufort})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block">SEA SURFACE TEMP</span>
            <span className="text-emerald-300 font-bold">
              {metocean.waterTemperatureC}°C
            </span>
          </div>
        </div>
      </div>

      {/* Trajectory Vector Map Canvas Area */}
      <div className="relative w-full h-[420px] sm:h-[480px] bg-[#020914] overflow-hidden select-none">
        {/* Tactical Nautical Grid Lines */}
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.15) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Vector SVG Trajectory Graphics */}
        <svg 
          className="w-full h-full absolute inset-0"
          viewBox="0 0 900 480"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="backwardDriftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="forwardDriftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.7" />
            </linearGradient>

            {/* Arrows */}
            <marker id="arrow-amber" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="#f59e0b" />
            </marker>

            <marker id="arrow-cyan" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="#00ffff" />
            </marker>

            <marker id="arrow-purple" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="#c084fc" />
            </marker>
          </defs>

          {/* Coordinate system:
              Origin: (170, 130)
              Current: (420, 230)
              +6H: (580, 290)
              +12H: (710, 340)
              +24H: (820, 400)
          */}

          {/* 1. BACKWARD VECTOR: Estimated Origin -> Current Spill */}
          <g id="origin-vector-group">
            {/* Dashed trajectory line */}
            <line
              x1="170"
              y1="130"
              x2="410"
              y2="225"
              stroke="url(#backwardDriftGrad)"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />

            {/* Flow direction indicator animated dots */}
            <circle cx="290" cy="180" r="3" fill="#f59e0b" className="animate-ping" />
          </g>

          {/* 2. FORWARD VECTOR: Current Spill -> +6H -> +12H -> +24H */}
          <g id="forward-vector-group">
            {/* Current to +6H */}
            {(selectedProjection === 'ALL' || selectedProjection === '+6H') && (
              <line
                x1="430"
                y1="235"
                x2="570"
                y2="285"
                stroke="#06b6d4"
                strokeWidth="2.5"
                markerEnd="url(#arrow-cyan)"
              />
            )}

            {/* +6H to +12H */}
            {(selectedProjection === 'ALL' || selectedProjection === '+12H') && (
              <line
                x1="580"
                y1="290"
                x2="700"
                y2="335"
                stroke="#818cf8"
                strokeWidth="2"
                strokeDasharray="4 2"
                markerEnd="url(#arrow-purple)"
              />
            )}

            {/* +12H to +24H */}
            {(selectedProjection === 'ALL' || selectedProjection === '+24H') && (
              <line
                x1="710"
                y1="340"
                x2="810"
                y2="395"
                stroke="#c084fc"
                strokeWidth="2"
                strokeDasharray="4 3"
                markerEnd="url(#arrow-purple)"
              />
            )}

            {/* Expanding Uncertainty Dispersion Cone (+24h) */}
            {(selectedProjection === 'ALL' || selectedProjection === '+24H') && (
              <path
                d="M 420 230 L 800 350 A 60 40 0 0 1 840 430 L 420 230 Z"
                fill="rgba(168, 85, 247, 0.08)"
                stroke="rgba(168, 85, 247, 0.3)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            )}
          </g>

          {/* POINT A: ESTIMATED ORIGIN */}
          <g 
            id="point-origin"
            transform="translate(170, 130)"
            className="cursor-pointer"
            onMouseEnter={() => setActiveHoverPoint('ORIGIN')}
            onMouseLeave={() => setActiveHoverPoint(null)}
          >
            {/* Uncertainty circle */}
            <circle r="36" fill="rgba(245, 158, 11, 0.12)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
            <circle r="8" fill="#f59e0b" />
            <circle r="14" fill="none" stroke="#f59e0b" strokeWidth="1.5" className="animate-ping" />

            {/* Label Badge */}
            <rect x="-80" y="-45" width="160" height="24" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" />
            <text x="0" y="-30" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              ORIGIN: {origin.coordinates.formattedLat}
            </text>
            <text x="0" y="24" fill="#fbbf24" fontSize="9" fontFamily="monospace" textAnchor="middle">
              {origin.timestampUtc}
            </text>
          </g>

          {/* POINT B: CURRENT SPILL POSITION */}
          <g 
            id="point-current"
            transform="translate(420, 230)"
            className="cursor-pointer"
            onMouseEnter={() => setActiveHoverPoint('CURRENT')}
            onMouseLeave={() => setActiveHoverPoint(null)}
          >
            {/* Spill polygon representation */}
            <ellipse rx="32" ry="14" fill="#021426" stroke="#00ffff" strokeWidth="2" transform="rotate(-15)" />
            <circle r="4" fill="#ef4444" />
            <circle r="18" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" className="animate-spin" />

            {/* Label Badge */}
            <rect x="-90" y="-48" width="180" height="26" rx="6" fill="#020617" stroke="#00ffff" strokeWidth="1.5" />
            <text x="0" y="-32" fill="#00ffff" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              CURRENT SPILL CENTROID
            </text>
            <text x="0" y="28" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle">
              {current.coordinates.formattedLat}, {current.coordinates.formattedLon}
            </text>
          </g>

          {/* POINT C: PREDICTED +6H */}
          {(selectedProjection === 'ALL' || selectedProjection === '+6H') && (
            <g 
              id="point-p6"
              transform="translate(580, 290)"
              className="cursor-pointer"
              onMouseEnter={() => setActiveHoverPoint('+6H')}
              onMouseLeave={() => setActiveHoverPoint(null)}
            >
              <circle r="22" fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" />
              <circle r="6" fill="#06b6d4" />
              <rect x="-40" y="-30" width="80" height="18" rx="4" fill="#090d16" stroke="#06b6d4" strokeWidth="1" />
              <text x="0" y="-18" fill="#06b6d4" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                +6 HOURS
              </text>
              <text x="0" y="22" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                {p6.coordinates.formattedLat}
              </text>
            </g>
          )}

          {/* POINT D: PREDICTED +12H */}
          {(selectedProjection === 'ALL' || selectedProjection === '+12H') && (
            <g 
              id="point-p12"
              transform="translate(710, 340)"
              className="cursor-pointer"
              onMouseEnter={() => setActiveHoverPoint('+12H')}
              onMouseLeave={() => setActiveHoverPoint(null)}
            >
              <circle r="28" fill="rgba(129, 140, 248, 0.12)" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 3" />
              <circle r="5" fill="#818cf8" />
              <rect x="-42" y="-30" width="84" height="18" rx="4" fill="#090d16" stroke="#818cf8" strokeWidth="1" />
              <text x="0" y="-18" fill="#818cf8" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                +12 HOURS
              </text>
              <text x="0" y="24" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                {p12.coordinates.formattedLat}
              </text>
            </g>
          )}

          {/* POINT E: PREDICTED +24H */}
          {(selectedProjection === 'ALL' || selectedProjection === '+24H') && (
            <g 
              id="point-p24"
              transform="translate(820, 400)"
              className="cursor-pointer"
              onMouseEnter={() => setActiveHoverPoint('+24H')}
              onMouseLeave={() => setActiveHoverPoint(null)}
            >
              <circle r="36" fill="rgba(192, 132, 252, 0.12)" stroke="#c084fc" strokeWidth="1" strokeDasharray="3 3" />
              <circle r="5" fill="#c084fc" />
              <rect x="-42" y="-30" width="84" height="18" rx="4" fill="#090d16" stroke="#c084fc" strokeWidth="1" />
              <text x="0" y="-18" fill="#c084fc" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                +24 HOURS
              </text>
              <text x="0" y="26" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                {p24.coordinates.formattedLat}
              </text>
            </g>
          )}
        </svg>

        {/* Legend Box */}
        <div className="absolute top-3 right-3 bg-slate-950/90 border border-cyan-950 rounded-xl p-3 text-[11px] font-mono-code shadow-2xl backdrop-blur-md max-w-xs">
          <div className="text-slate-400 font-bold mb-2 uppercase text-[10px] tracking-wider border-b border-slate-800 pb-1">
            TRAJECTORY LEGEND
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span><strong>Estimated Origin</strong> (Backward Drift)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 border border-red-500" />
              <span><strong>Current Position</strong> (SAR Centroid)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-400" />
              <span><strong>Predicted Movement</strong> (+6h, +12h, +24h)</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-900 text-slate-400 text-[10px]">
              <span className="w-4 h-0.5 border-t border-dashed border-amber-400" />
              <span>Lagrangian Vector (-8.8 Hours)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Hover Tooltip */}
        {activeHoverPoint && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-cyan-500/50 rounded-xl px-4 py-2 text-xs font-mono-code text-cyan-300 shadow-2xl">
            Selected Waypoint: <strong className="text-white">{activeHoverPoint}</strong> • Hydrodynamic advection rate: {metocean.surfaceCurrentKts} knots
          </div>
        )}
      </div>

      {/* Trajectory Table Breakdown */}
      <div className="p-4 bg-slate-950/90 border-t border-cyan-950/80">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-code">
          {/* Card 1: Origin */}
          <div className="bg-slate-900/60 border border-amber-500/30 rounded-xl p-3">
            <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
              <span>ESTIMATED ORIGIN</span>
              <span className="text-[10px] text-slate-400">T - 8.8h</span>
            </div>
            <div className="text-slate-200">{origin.coordinates.formattedLat}, {origin.coordinates.formattedLon}</div>
            <div className="text-[11px] text-slate-400 mt-1">Dispersion Radius: {origin.dispersionRadiusKm} km</div>
          </div>

          {/* Card 2: Current */}
          <div className="bg-slate-900/60 border border-cyan-500/30 rounded-xl p-3">
            <div className="flex items-center justify-between text-cyan-400 font-bold mb-1">
              <span>CURRENT OBSERVATION</span>
              <span className="text-[10px] text-slate-400">Observed</span>
            </div>
            <div className="text-slate-200">{current.coordinates.formattedLat}, {current.coordinates.formattedLon}</div>
            <div className="text-[11px] text-slate-400 mt-1">Dispersion Radius: {current.dispersionRadiusKm} km</div>
          </div>

          {/* Card 3: +24H Prediction */}
          <div className="bg-slate-900/60 border border-purple-500/30 rounded-xl p-3">
            <div className="flex items-center justify-between text-purple-400 font-bold mb-1">
              <span>PREDICTED +24H</span>
              <span className="text-[10px] text-slate-400">Forecast</span>
            </div>
            <div className="text-slate-200">{p24.coordinates.formattedLat}, {p24.coordinates.formattedLon}</div>
            <div className="text-[11px] text-slate-400 mt-1">Dispersion Radius: {p24.dispersionRadiusKm} km</div>
          </div>
        </div>
      </div>
    </section>
  );
}
