/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EcologicalInhabitant, RiskLevel } from '../../types/simulation';

interface EcologicalRiskTableProps {
  inhabitants: EcologicalInhabitant[];
}

export function EcologicalRiskTable({ inhabitants }: EcologicalRiskTableProps) {
  const getHabitatIcon = (iconType: string) => {
    switch (iconType) {
      case 'mangrove':
        return '🌲';
      case 'coral':
        return '🪸';
      case 'seagrass':
        return '🌿';
      case 'dolphin':
        return '🐬';
      case 'turtle':
        return '🐢';
      case 'fish':
        return '🐟';
      case 'plankton':
      default:
        return '🦠';
    }
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'Critical':
      case 'High':
        return 'bg-[#7f1d1d]/80 text-[#fca5a5] border border-[#991b1b]';
      case 'Medium':
        return 'bg-[#78350f]/80 text-[#fcd34d] border border-[#92400e]';
      case 'Low':
      default:
        return 'bg-[#365314]/80 text-[#bef264] border border-[#4d7c0f]';
    }
  };

  return (
    <div 
      id="simulation-ecological-risk-card"
      className="bg-[#0b1723]/90 border border-[#162738] rounded-xl p-4 flex flex-col justify-between select-none shadow-xl"
    >
      <div className="text-[11px] font-semibold text-slate-300 tracking-wider uppercase mb-2">
        ECOLOGICAL INHABITANTS AT RISK
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[10px] text-slate-400 border-b border-[#162738]">
              <th className="pb-1.5 font-normal">Species / Habitat</th>
              <th className="pb-1.5 font-normal text-center">Presence</th>
              <th className="pb-1.5 font-normal text-right">Risk Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#132230]">
            {inhabitants.map((item) => (
              <tr key={item.id} className="hover:bg-[#0e1e2d] transition-colors">
                <td className="py-1 text-slate-200 flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-sm">{getHabitatIcon(item.iconType)}</span>
                  <span>{item.speciesHabitat}</span>
                </td>
                <td className="py-1 text-slate-300 text-center font-mono-code">
                  {item.presence}
                </td>
                <td className="py-1 text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-medium uppercase font-mono-code ${getRiskBadge(item.riskLevel)}`}>
                    {item.riskLevel}
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
