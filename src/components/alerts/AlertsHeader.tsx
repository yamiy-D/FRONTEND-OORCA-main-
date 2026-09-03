/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShieldAlert, 
  Radio, 
  FileDown, 
  Activity, 
  RotateCw, 
  Layers,
  Radar,
  Clock,
  Play,
  Square
} from 'lucide-react';
import { OilSpillIncident } from '../../types/alertTypes';

interface AlertsHeaderProps {
  incidents: OilSpillIncident[];
  activeIncident: OilSpillIncident;
  onOpenDossier: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onManualScan?: () => void;
  isScanning?: boolean;
  isAutoScanning?: boolean;
  autoScanCountdown?: number;
  onToggleAutoScan?: () => void;
}

export function AlertsHeader({
  incidents,
  activeIncident,
  onOpenDossier,
  onRefresh,
  isRefreshing,
  onManualScan,
  isScanning = false,
  isAutoScanning = false,
  autoScanCountdown = 600,
  onToggleAutoScan,
}: AlertsHeaderProps) {
  const activeAlertsCount = incidents.length;
  const highPriorityCount = incidents.filter(
    (i) => i.severity === 'CRITICAL' || i.severity === 'HIGH'
  ).length;
  const underInvestigationCount = incidents.filter(
    (i) => i.status === 'UNDER INVESTIGATION' || i.status === 'HIGH PRIORITY'
  ).length;

  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <header 
      id="alerts-header"
      className="relative z-10 border-b border-cyan-950/80 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4"
    >
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        {/* Title & Live Status Indicator */}
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/70 border border-cyan-500/30 text-cyan-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono-code uppercase">
                  ALERT CENTRE
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono-code bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -ml-3" />
                  Surveillance Active
                </span>
                {isAutoScanning && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono-code bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                    <Clock className="w-3 h-3 text-cyan-400 animate-spin" />
                    Auto-Scan: {formatCountdown(autoScanCountdown)}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Real-Time Oil Spill Detection & Maritime Investigation
              </p>
            </div>
          </div>
        </div>

        {/* Incident Summary Badges & Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Summary counters */}
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/80 border border-cyan-950 rounded-xl px-3 py-1.5 text-xs font-mono-code">
            <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-800">
              <span className="text-slate-400">Active Alerts:</span>
              <span className="text-cyan-300 font-bold">{activeAlertsCount}</span>
            </div>
            <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-800">
              <span className="text-slate-400">High Priority:</span>
              <span className="text-red-400 font-bold">{highPriorityCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Under Investigation:</span>
              <span className="text-amber-400 font-bold">{underInvestigationCount}</span>
            </div>
          </div>

          {/* Action Buttons: 10-Min Auto-Scan, Manual Scan, Sync, Dossier */}
          <div className="flex flex-wrap items-center gap-2">
            {onToggleAutoScan && (
              <button
                id="header-btn-toggle-autoscan"
                onClick={onToggleAutoScan}
                disabled={isScanning}
                title={isAutoScanning ? 'Deactivate 10-minute auto scan' : 'Activate automatic scan every 10 minutes'}
                className={`px-3 py-2 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-all cursor-pointer border disabled:opacity-50 ${
                  isAutoScanning
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-900 border-cyan-500/20 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40'
                }`}
              >
                <Clock className={`w-3.5 h-3.5 ${isAutoScanning ? 'text-emerald-400 animate-pulse' : ''}`} />
                <span className="hidden sm:inline">
                  {isAutoScanning ? `10m Auto (${formatCountdown(autoScanCountdown)})` : '10-Min Auto-Scan'}
                </span>
                <span className="sm:hidden">
                  {isAutoScanning ? formatCountdown(autoScanCountdown) : '10m'}
                </span>
              </button>
            )}

            {onManualScan && (
              <button
                id="header-btn-manual-scan"
                onClick={onManualScan}
                disabled={isScanning}
                title="Perform a single manual radar scan"
                className={`px-3 py-2 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-all cursor-pointer border disabled:opacity-50 ${
                  isScanning
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 cursor-wait'
                    : 'bg-slate-900 border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/50 hover:border-cyan-400'
                }`}
              >
                <Radar className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-cyan-400' : ''}`} />
                <span className="hidden sm:inline">{isScanning ? 'Scanning...' : 'Manual Scan'}</span>
                <span className="sm:hidden">Scan</span>
              </button>
            )}

            <button
              id="btn-refresh-telemetry"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh Real-Time Feeds"
              className="px-2.5 sm:px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/20 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-xs font-mono-code flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span className="hidden md:inline">Sync</span>
            </button>

            <button
              id="btn-export-dossier"
              onClick={onOpenDossier}
              className="px-3 sm:px-3.5 py-2 rounded-lg bg-cyan-500 text-black font-semibold text-xs font-mono-code flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:bg-cyan-400 transition-all cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Dossier</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
