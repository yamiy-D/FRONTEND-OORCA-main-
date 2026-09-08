/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SpillSummary as SpillSummaryType } from '../../types/simulation';

interface SpillSummaryProps {
  summary: SpillSummaryType;
}

export function SpillSummary({ summary }: SpillSummaryProps) {
  return (
    <div 
      id="simulation-spill-summary-card"
      className="bg-[#0b1723]/90 border border-[#162738] rounded-xl p-4 flex flex-col justify-between select-none shadow-xl"
    >
      <div className="text-[11px] font-semibold text-slate-300 tracking-wider uppercase mb-3">
        SPILL SUMMARY
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-400">
          <span>Total Spilled</span>
          <span className="font-mono-code text-slate-100 font-medium">
            {summary.totalSpilled}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-400">
          <span>Spill Area (Est.)</span>
          <span className="font-mono-code text-slate-100 font-medium">
            {summary.spillAreaEstKm2.toFixed(2)} km²
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-400">
          <span>Max Shore Arrival</span>
          <span className="font-mono-code text-slate-100 font-medium">
            {summary.maxShoreArrival}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-400">
          <span>Weathering</span>
          <span className="font-mono-code text-slate-100 font-medium">
            {summary.weathering}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-400">
          <span>Evaporation</span>
          <span className="font-mono-code text-slate-100 font-medium">
            {summary.evaporationPct} %
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-400">
          <span>Dispersion</span>
          <span className="font-mono-code text-slate-100 font-medium">
            {summary.dispersionPct} %
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-400">
          <span>Remaining on Surface</span>
          <span className="font-mono-code text-slate-100 font-medium">
            {summary.remainingOnSurfacePct} %
          </span>
        </div>
      </div>
    </div>
  );
}
