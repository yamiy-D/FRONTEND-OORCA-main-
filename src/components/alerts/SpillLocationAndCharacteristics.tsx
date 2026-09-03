/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MapPin, 
  Target, 
  Droplets, 
  Ruler, 
  Clock, 
  HelpCircle, 
  ShieldCheck, 
  Check, 
  Compass, 
  Layers 
} from 'lucide-react';
import { Coordinates, SpillCharacteristics } from '../../types/alertTypes';

interface SpillLocationAndCharacteristicsProps {
  location: Coordinates;
  characteristics: SpillCharacteristics;
  onFocusLocation: () => void;
}

export function SpillLocationAndCharacteristics({
  location,
  characteristics,
  onFocusLocation,
}: SpillLocationAndCharacteristicsProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${location.formattedLat}, ${location.formattedLon}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
      {/* 4. OIL SPILL LOCATION (4 Cols) */}
      <section 
        id="oil-spill-location"
        className="lg:col-span-5 rounded-2xl border border-cyan-950/80 bg-slate-950/80 backdrop-blur-md p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-cyan-950/80">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                <MapPin className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold font-mono-code text-white uppercase tracking-wider">
                  📍 OIL SPILL LOCATION
                </h2>
                <p className="text-[11px] text-slate-400 font-mono-code">
                  Centroid Coordinates
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyCoords}
              className="text-[10px] font-mono-code px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {copied ? 'COPIED' : 'COPY'}
            </button>
          </div>

          {/* Essential Coordinate Display */}
          <div className="bg-slate-900/90 border border-cyan-500/25 rounded-xl p-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-mono-code text-slate-400 uppercase block mb-1">
                  Latitude
                </span>
                <span className="text-base sm:text-lg font-bold font-mono-code text-cyan-300 tracking-wide">
                  {location.formattedLat}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono-code text-slate-400 uppercase block mb-1">
                  Longitude
                </span>
                <span className="text-base sm:text-lg font-bold font-mono-code text-cyan-300 tracking-wide">
                  {location.formattedLon}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] font-mono-code flex items-center justify-between text-slate-400">
              <span>Maritime Zone:</span>
              <span className="text-slate-200 font-medium truncate max-w-[200px]">
                {location.seaRegion}
              </span>
            </div>
          </div>
        </div>

        {/* Focus on Spill Location Button */}
        <button
          id="btn-focus-spill-location"
          onClick={onFocusLocation}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black font-semibold text-xs font-mono-code flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,255,0.1)] group"
        >
          <Target className="w-4 h-4 text-cyan-400 group-hover:text-black transition-colors" />
          <span>Focus on Spill Location</span>
        </button>
      </section>

      {/* 5. SPILL CHARACTERISTICS (7 Cols) */}
      <section 
        id="spill-characteristics"
        className="lg:col-span-7 rounded-2xl border border-cyan-950/80 bg-slate-950/80 backdrop-blur-md p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-cyan-950/80">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                <Droplets className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold font-mono-code text-white uppercase tracking-wider">
                  🛢 SPILL CHARACTERISTICS
                </h2>
                <p className="text-[11px] text-slate-400 font-mono-code">
                  Morphological & Physical Analysis
                </p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-amber-950/50 border border-amber-500/30 text-amber-300">
              *Model-Derived Estimates
            </span>
          </div>

          {/* Properties Table / Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono-code mb-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 block mb-1">Estimated Area</span>
              <span className="text-base font-bold text-cyan-300">
                {characteristics.estimatedAreaKm2} km²
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 block mb-1">Length</span>
              <span className="text-base font-bold text-white">
                {characteristics.lengthKm} km
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 block mb-1">Width</span>
              <span className="text-base font-bold text-white">
                {characteristics.widthKm} km
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 block mb-1">Estimated Age</span>
              <span className="text-base font-bold text-amber-300">
                {characteristics.estimatedAgeHours}
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 block mb-1">Confidence</span>
              <span className="text-base font-bold text-emerald-400">
                {characteristics.confidencePercentage}% Match
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 block mb-1">Est. Volume</span>
              <span className="text-base font-bold text-slate-200">
                {characteristics.estimatedVolumeM3 || '48.5'} m³
              </span>
            </div>
          </div>

          {/* Plume Shape Details */}
          <div className="bg-slate-900/60 border border-cyan-950 rounded-xl p-3 mb-3 text-xs font-mono-code flex items-start gap-2">
            <span className="text-cyan-400 font-semibold shrink-0">Spill Shape:</span>
            <span className="text-slate-300 leading-relaxed">
              {characteristics.shapeDescription}
            </span>
          </div>
        </div>

        {/* Clear Model Estimation Disclaimer */}
        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="leading-tight">
            <strong className="text-slate-200">Advisory Note:</strong> Physical characteristics are derived from satellite SAR backscatter inversion and hydrodynamic drift models. Values are scientific estimates and require ground-truth sampling for statutory calibration.
          </p>
        </div>
      </section>
    </div>
  );
}
