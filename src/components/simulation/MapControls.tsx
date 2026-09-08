/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, Wind, Waves, Plus, Minus, Check, Ship, Shield, Sparkles } from 'lucide-react';
import { TILE_LAYERS } from '../../services/mapService';

interface MapControlsProps {
  currentLayerId: string;
  onChangeLayer: (layerId: string) => void;
  showWind: boolean;
  onToggleWind: () => void;
  showWaves: boolean;
  onToggleWaves: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFocusShip?: () => void;
  showBooms?: boolean;
  onToggleBooms?: () => void;
  showLiveParticles?: boolean;
  onToggleLiveParticles?: () => void;
}

export function MapControls({
  currentLayerId,
  onChangeLayer,
  showWind,
  onToggleWind,
  showWaves,
  onToggleWaves,
  onZoomIn,
  onZoomOut,
  onFocusShip,
  showBooms = true,
  onToggleBooms,
  showLiveParticles = true,
  onToggleLiveParticles,
}: MapControlsProps) {
  const [layersMenuOpen, setLayersMenuOpen] = useState(false);

  return (
    <div 
      id="map-tool-controls"
      className="absolute top-4 right-4 z-20 flex flex-col gap-2 select-none"
    >
      {/* Layers Button */}
      <div className="relative">
        <button
          id="btn-map-layers"
          onClick={() => setLayersMenuOpen(!layersMenuOpen)}
          className={`w-9 h-9 rounded-lg bg-[#07131F]/90 border border-[#1b2f42] flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-500/50 shadow-xl backdrop-blur-md transition-all cursor-pointer ${
            layersMenuOpen ? 'border-cyan-500 text-cyan-400' : ''
          }`}
          title="Map Layers"
        >
          <Layers className="w-4 h-4" />
        </button>

        {layersMenuOpen && (
          <div className="absolute right-11 top-0 w-44 rounded-lg bg-[#07131F]/95 border border-[#1b2f42] p-1.5 shadow-2xl backdrop-blur-md text-xs z-30">
            <div className="text-[10px] text-slate-400 font-semibold px-2 py-1 uppercase tracking-wider border-b border-[#1b2f42] mb-1">
              Tile Layers
            </div>
            {Object.values(TILE_LAYERS).map((layer) => (
              <button
                key={layer.id}
                onClick={() => {
                  onChangeLayer(layer.id);
                  setLayersMenuOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
                  currentLayerId === layer.id 
                    ? 'bg-cyan-950/60 text-cyan-300 font-medium' 
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <span>{layer.name}</span>
                {currentLayerId === layer.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Wind Toggle Button */}
      <button
        id="btn-map-toggle-wind"
        onClick={onToggleWind}
        className={`w-9 h-11 rounded-lg bg-[#07131F]/90 border flex flex-col items-center justify-center gap-0.5 shadow-xl backdrop-blur-md transition-all cursor-pointer ${
          showWind
            ? 'border-cyan-500/70 text-cyan-300 bg-cyan-950/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
            : 'border-[#1b2f42] text-slate-400 hover:text-slate-200'
        }`}
        title="Toggle Wind Vectors"
      >
        <Wind className="w-3.5 h-3.5" />
        <span className="text-[9px] font-mono-code font-medium">Wind</span>
      </button>

      {/* Waves Toggle Button */}
      <button
        id="btn-map-toggle-waves"
        onClick={onToggleWaves}
        className={`w-9 h-11 rounded-lg bg-[#07131F]/90 border flex flex-col items-center justify-center gap-0.5 shadow-xl backdrop-blur-md transition-all cursor-pointer ${
          showWaves
            ? 'border-cyan-500/70 text-cyan-300 bg-cyan-950/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
            : 'border-[#1b2f42] text-slate-400 hover:text-slate-200'
        }`}
        title="Toggle Ocean Waves Streamlines"
      >
        <Waves className="w-3.5 h-3.5" />
        <span className="text-[9px] font-mono-code font-medium">Waves</span>
      </button>

      {/* Focus Ship & Near-Hull Spill Source Button */}
      {onFocusShip && (
        <button
          id="btn-map-focus-ship"
          onClick={onFocusShip}
          className="w-9 h-11 rounded-lg bg-[#07131F]/90 border border-sky-500/50 hover:border-sky-400 text-sky-300 hover:text-white flex flex-col items-center justify-center gap-0.5 shadow-xl backdrop-blur-md transition-all cursor-pointer hover:bg-sky-950/40 group"
          title="Zoom to Ship & Ruptured Hull (15x)"
        >
          <Ship className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-mono-code font-medium">Ship</span>
        </button>
      )}

      {/* Containment Booms Barrier Toggle */}
      {onToggleBooms && (
        <button
          id="btn-map-toggle-booms"
          onClick={onToggleBooms}
          className={`w-9 h-11 rounded-lg bg-[#07131F]/90 border flex flex-col items-center justify-center gap-0.5 shadow-xl backdrop-blur-md transition-all cursor-pointer ${
            showBooms
              ? 'border-amber-500/70 text-amber-300 bg-amber-950/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
              : 'border-[#1b2f42] text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Emergency Containment Booms"
        >
          <Shield className="w-3.5 h-3.5" />
          <span className="text-[9px] font-mono-code font-medium">Booms</span>
        </button>
      )}

      {/* Live Drifting Lagrangian Oil Flow Particles Toggle */}
      {onToggleLiveParticles && (
        <button
          id="btn-map-toggle-particles"
          onClick={onToggleLiveParticles}
          className={`w-9 h-11 rounded-lg bg-[#07131F]/90 border flex flex-col items-center justify-center gap-0.5 shadow-xl backdrop-blur-md transition-all cursor-pointer ${
            showLiveParticles
              ? 'border-emerald-500/70 text-emerald-300 bg-emerald-950/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
              : 'border-[#1b2f42] text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Live Drifting Oil Droplet Particles"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[9px] font-mono-code font-medium">Flow</span>
        </button>
      )}

      {/* Zoom In & Out */}
      <div className="flex flex-col rounded-lg bg-[#07131F]/90 border border-[#1b2f42] overflow-hidden shadow-xl backdrop-blur-md">
        <button
          id="btn-map-zoom-in"
          onClick={onZoomIn}
          className="w-9 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer border-b border-[#1b2f42]"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          id="btn-map-zoom-out"
          onClick={onZoomOut}
          className="w-9 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
