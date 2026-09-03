/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  FileText, 
  Scale, 
  HelpCircle, 
  Radio, 
  Droplets, 
  Compass, 
  Activity 
} from 'lucide-react';
import { PotentialViolationEvidence, EvidenceCategory } from '../../types/alertTypes';

interface PotentialViolationsSectionProps {
  violations: PotentialViolationEvidence[];
  vesselName: string;
}

export function PotentialViolationsSection({
  violations,
  vesselName,
}: PotentialViolationsSectionProps) {
  const getCategoryBadge = (category: EvidenceCategory) => {
    switch (category) {
      case 'Potential Violation':
        return {
          bg: 'bg-red-950/70 text-red-300 border-red-500/50',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-red-400" />,
        };
      case 'Suspected Environmental Offence':
        return {
          bg: 'bg-amber-950/70 text-amber-300 border-amber-500/50',
          icon: <Droplets className="w-3.5 h-3.5 text-amber-400" />,
        };
      case 'Requires Investigation':
        return {
          bg: 'bg-indigo-950/70 text-indigo-300 border-indigo-500/50',
          icon: <Scale className="w-3.5 h-3.5 text-indigo-400" />,
        };
      case 'Evidence Indicator':
      default:
        return {
          bg: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/50',
          icon: <Radio className="w-3.5 h-3.5 text-cyan-400" />,
        };
    }
  };

  return (
    <section 
      id="potential-violations-evidence"
      className="rounded-2xl border border-cyan-950/80 bg-slate-950/80 backdrop-blur-md p-5 sm:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.6)] mb-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-cyan-950/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-400">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold font-mono-code text-white uppercase tracking-wide">
              ⚠ POTENTIAL VIOLATIONS & INVESTIGATION EVIDENCE
            </h2>
            <p className="text-xs text-slate-400 font-mono-code mt-0.5">
              Targeted for Port State Control Inspection • Case Reference: <span className="text-cyan-300">{vesselName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono-code text-slate-400">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Non-Adjudicative Preliminary Findings</span>
        </div>
      </div>

      {/* Findings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono-code">
        {violations.map((violation) => {
          const badge = getCategoryBadge(violation.category);

          return (
            <div
              key={violation.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between hover:border-cyan-900 transition-colors"
            >
              <div>
                {/* Badge row */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1.5 ${badge.bg}`}>
                    {badge.icon}
                    <span>{violation.category}</span>
                  </div>

                  {violation.timestampUtc && (
                    <span className="text-[10px] text-slate-400">
                      {violation.timestampUtc}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-100 mb-1.5 flex items-center gap-2">
                  <span>{violation.title}</span>
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {violation.description}
                </p>
              </div>

              {/* Regulatory Citation */}
              {violation.regulatoryReference && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-slate-400">Statutory Standard:</span>
                  <span className="text-cyan-300 font-semibold truncate max-w-[240px]">
                    {violation.regulatoryReference}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Forensic Standard Notice */}
      <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-cyan-950 text-xs text-slate-400 leading-relaxed font-mono-code flex items-start gap-2.5">
        <Scale className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-200">Legal Evidentiary Framework:</strong> Under international maritime law (UNCLOS Art. 217 and MARPOL 73/78), satellite SAR detection paired with Lagrangian hydrodynamic backward origin modeling and AIS dead-reckoning reconstruction forms prima facie evidentiary basis for coastal states to request inspection of vessel oil record books (ORB Part I & II) upon port arrival.
        </p>
      </div>
    </section>
  );
}
