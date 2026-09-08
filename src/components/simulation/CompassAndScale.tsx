/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export function CompassAndScale() {
  return (
    <>
      {/* Compass / North Indicator (Left Map Middle) */}
      <div 
        id="map-compass-indicator"
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none select-none"
      >
        <div className="w-10 h-10 rounded-full border border-slate-600/60 bg-[#07131F]/80 backdrop-blur-sm flex flex-col items-center justify-center relative shadow-lg">
          <span className="text-[9px] font-mono-code font-bold text-slate-300 absolute top-0.5">
            N
          </span>
          {/* Compass needle */}
          <div className="w-1.5 h-5 flex flex-col items-center justify-center mt-1">
            <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[9px] border-b-cyan-400" />
            <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[9px] border-t-slate-500" />
          </div>
        </div>
      </div>

      {/* Scale Indicator (Bottom-Left of Map) */}
      <div 
        id="map-scale-indicator"
        className="absolute left-6 bottom-4 z-20 pointer-events-none select-none"
      >
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-[10px] font-mono-code text-slate-300">
            10 km
          </span>
          <div className="w-20 h-1.5 border-b-2 border-l-2 border-r-2 border-slate-300" />
        </div>
      </div>
    </>
  );
}
