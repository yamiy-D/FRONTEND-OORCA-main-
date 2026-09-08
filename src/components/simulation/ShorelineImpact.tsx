/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShorelineImpact as ShorelineImpactType, RiskLevel } from '../../types/simulation';

interface ShorelineImpactProps {
  shorelines: ShorelineImpactType[];
  onSelectShoreline?: (coord: [number, number]) => void;
}

export function ShorelineImpact({ shorelines, onSelectShoreline }: ShorelineImpactProps) {
  const getImpactBadge = (level: RiskLevel) => {
    switch (level) {
      case 'Critical':
      case 'High':
        return 'bg-[#7f1d1d]/90 text-[#fca5a5] border border-[#991b1b]';
      case 'Medium':
        return 'bg-[#78350f]/90 text-[#fcd34d] border border-[#92400e]';
      case 'Low':
      default:
        return 'bg-[#064e3b]/90 text-[#6ee7b7] border border-[#047857]';
    }
  };

  return (
    <div 
      id="simulation-shoreline-impact-card"
      className="bg-[#0b1723]/90 border border-[#162738] rounded-xl p-4 flex flex-col justify-between select-none shadow-xl"
    >
      <div className="text-[11px] font-semibold text-slate-300 tracking-wider uppercase mb-2">
        SHORELINE IMPACT (EST.)
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[10px] text-slate-400 border-b border-[#162738]">
              <th className="pb-1.5 font-normal">Location</th>
              <th className="pb-1.5 font-normal text-center">Arrival Time</th>
              <th className="pb-1.5 font-normal text-right">Impact Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#132230]">
            {shorelines.map((shore) => (
              <tr 
                key={shore.id} 
                onClick={() => onSelectShoreline?.(shore.coordinates)}
                className="hover:bg-[#0e1e2d] transition-colors cursor-pointer"
                title={`Click to center on ${shore.location}`}
              >
                <td className="py-1.5 text-slate-200 font-medium whitespace-nowrap">
                  {shore.location}
                </td>
                <td className="py-1.5 text-slate-300 text-center font-mono-code">
                  {shore.arrivalTime}
                </td>
                <td className="py-1.5 text-right">
                  <span className={`inline-block px-3 py-0.5 rounded text-[10px] font-medium uppercase font-mono-code ${getImpactBadge(shore.impactLevel)}`}>
                    {shore.impactLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
