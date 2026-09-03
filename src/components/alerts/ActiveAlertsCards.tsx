/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Compass, 
  Target 
} from 'lucide-react';
import { OilSpillIncident, AlertSeverity, AlertStatus } from '../../types/alertTypes';

interface ActiveAlertsCardsProps {
  incidents: OilSpillIncident[];
  activeIncidentId: string;
  onSelectIncident: (id: string) => void;
}

export function ActiveAlertsCards({
  incidents,
  activeIncidentId,
  onSelectIncident,
}: ActiveAlertsCardsProps) {
  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return {
          label: 'CRITICAL',
          classes: 'bg-red-950/80 border-red-500/50 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.25)]',
          dot: 'bg-red-400 animate-pulse',
        };
      case 'HIGH':
        return {
          label: 'HIGH',
          classes: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
          dot: 'bg-amber-400',
        };
      case 'MEDIUM':
        return {
          label: 'MEDIUM',
          classes: 'bg-sky-950/80 border-sky-500/50 text-sky-300',
          dot: 'bg-sky-400',
        };
      case 'LOW':
      default:
        return {
          label: 'LOW',
          classes: 'bg-slate-900/80 border-slate-700 text-slate-300',
          dot: 'bg-slate-400',
        };
    }
  };

  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case 'HIGH PRIORITY':
        return 'text-red-400 bg-red-950/40 border-red-800/40';
      case 'UNDER INVESTIGATION':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
      case 'TRACKING':
        return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40';
      case 'RESOLVED':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
      case 'NEW DETECTION':
      default:
        return 'text-purple-400 bg-purple-950/40 border-purple-800/40';
    }
  };

  return (
    <section id="active-alerts-section" className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <h2 className="text-xs sm:text-sm font-bold font-mono-code tracking-wider text-slate-200 uppercase">
            DETECTED OIL SPILL INCIDENTS ({incidents.length})
          </h2>
        </div>
        <span className="text-[11px] font-mono-code text-slate-400">
          Click incident card to update forensic telemetry
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {incidents.map((incident) => {
          const isActive = incident.id === activeIncidentId;
          const sev = getSeverityBadge(incident.severity);
          const statusClass = getStatusBadge(incident.status);

          return (
            <div
              key={incident.id}
              id={`alert-card-${incident.id.toLowerCase()}`}
              onClick={() => onSelectIncident(incident.id)}
              className={`relative rounded-xl p-4 transition-all duration-200 cursor-pointer border ${
                isActive
                  ? 'bg-slate-900/95 border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.18)] ring-1 ring-cyan-500/40'
                  : 'bg-slate-950/60 border-cyan-950/70 hover:border-cyan-800/80 hover:bg-slate-900/50'
              }`}
            >
              {/* Active selection indicator bar */}
              {isActive && (
                <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              )}

              {/* Top row: ID + Severity Badge */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono-code text-cyan-300">
                    {incident.id}
                  </span>
                  {isActive && (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono-code bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-semibold border flex items-center gap-1.5 ${sev.classes}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                  {sev.label}
                </div>
              </div>

              {/* Title & Region */}
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-slate-100 line-clamp-1">
                  {incident.title}
                </h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-cyan-500 shrink-0" />
                  <span className="truncate">{incident.location.seaRegion}</span>
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-code bg-slate-950/70 border border-slate-900 rounded-lg p-2.5 mb-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">Estimated Area</span>
                  <span className="text-cyan-300 font-bold text-xs">
                    {incident.estimatedSpillAreaKm2} km²
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Confidence</span>
                  <span className="text-emerald-400 font-bold text-xs">
                    {incident.confidencePercentage}% AI Match
                  </span>
                </div>
              </div>

              {/* Bottom metadata */}
              <div className="flex items-center justify-between text-[10px] font-mono-code pt-1 border-t border-slate-900 text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{incident.detectionTimestampUtc.split(' ')[1]} UTC</span>
                </div>

                <span className={`px-2 py-0.5 rounded text-[9px] font-semibold border ${statusClass}`}>
                  {incident.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
