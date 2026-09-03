/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Radar, 
  Clock, 
  RefreshCw, 
  Satellite, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Square, 
  X, 
  Info,
  Radio,
  Eye
} from 'lucide-react';
import { OilSpillIncident } from '../../types/alertTypes';

export interface ScanResult {
  timestamp: string;
  type: 'MANUAL' | 'AUTO_10MIN';
  message: string;
  sectorsChecked: number;
  vesselsAnalyzed: number;
  newSpillsFound: number;
  detectedIncidentId?: string;
}

interface SpillScannerBarProps {
  isAutoScanning: boolean;
  autoScanCountdown: number; // in seconds (e.g. 600)
  onToggleAutoScan: () => void;
  isScanning: boolean;
  scanPhase: string;
  scanProgress: number;
  lastScanResult: ScanResult | null;
  onManualScan: () => void;
  onClearScanResult: () => void;
  onSelectIncident?: (id: string) => void;
  totalScansCount: number;
}

export function SpillScannerBar({
  isAutoScanning,
  autoScanCountdown,
  onToggleAutoScan,
  isScanning,
  scanPhase,
  scanProgress,
  lastScanResult,
  onManualScan,
  onClearScanResult,
  onSelectIncident,
  totalScansCount,
}: SpillScannerBarProps) {
  // Format countdown mm:ss
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <section 
      id="spill-scanner-surveillance-station"
      className="mb-6 rounded-2xl border border-cyan-900/60 bg-gradient-to-b from-slate-900/90 to-slate-950/95 p-4 sm:p-5 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.5)] relative overflow-hidden"
    >
      {/* Background Cyber Grid Accent */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Top Bar: Section Title, Constellation Status Badges */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3.5 border-b border-cyan-950/80">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Radar className={`w-4 h-4 ${isScanning || isAutoScanning ? 'animate-spin text-cyan-300' : ''}`} />
            {isAutoScanning && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white font-mono-code uppercase tracking-wider">
                Automated & Manual Spill Surveillance Radar
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                SAR & AIS Feeds
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Continuous 10-minute periodic sweep & on-demand manual satellite SAR anomaly detector
            </p>
          </div>
        </div>

        {/* Constellation Link Telemetry Badges */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono-code">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 border border-cyan-950 text-slate-300">
            <Satellite className="w-3 h-3 text-cyan-400" />
            <span>Sentinel-1A/B:</span>
            <span className="text-emerald-400 font-semibold">SYNCED</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 border border-cyan-950 text-slate-300">
            <Radio className="w-3 h-3 text-cyan-400" />
            <span>ICEYE-SAR:</span>
            <span className="text-emerald-400 font-semibold">ONLINE</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 border border-cyan-950 text-slate-300">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>Total Scans:</span>
            <span className="text-cyan-300 font-bold">{totalScansCount}</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Controls Row */}
      <div className="relative z-10 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        
        {/* BUTTON 1: 10-Minute Auto-Scan Scheduled Button */}
        <div className="lg:col-span-6 bg-slate-950/70 border border-cyan-950 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-lg border ${
              isAutoScanning 
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]' 
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <Clock className={`w-5 h-5 ${isAutoScanning ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold font-mono-code text-white">
                  10-Min Auto-Scan
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code font-semibold uppercase ${
                  isAutoScanning 
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-slate-900 text-slate-400 border border-slate-700'
                }`}>
                  {isAutoScanning ? 'ACTIVE • 10M LOOP' : 'STANDBY'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAutoScanning ? (
                  <span className="text-cyan-300 flex items-center gap-1.5 font-mono-code">
                    <span>Next auto-scan in:</span>
                    <strong className="text-white text-xs px-1.5 py-0.5 bg-cyan-950 rounded border border-cyan-500/30">
                      {formatTime(autoScanCountdown)}
                    </strong>
                  </span>
                ) : (
                  'Scans any spill occurred in every 10 min'
                )}
              </p>
            </div>
          </div>

          {/* Action Button for 10-Minute Auto Scan */}
          <button
            id="btn-toggle-10min-autoscan"
            onClick={onToggleAutoScan}
            disabled={isScanning}
            className={`px-4 py-2.5 rounded-lg text-xs font-mono-code font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md whitespace-nowrap ${
              isAutoScanning
                ? 'bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/40'
                : 'bg-emerald-600 hover:bg-emerald-500 text-black border border-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            } disabled:opacity-50`}
          >
            {isAutoScanning ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Auto-Scan</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start 10-Min Auto-Scan</span>
              </>
            )}
          </button>
        </div>

        {/* BUTTON 2: Manual Scan (Single Instant Scan) Button */}
        <div className="lg:col-span-6 bg-slate-950/70 border border-cyan-950 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-lg border ${
              isScanning 
                ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]' 
                : 'bg-slate-900 border-slate-800 text-cyan-400'
            }`}>
              <Radar className={`w-5 h-5 ${isScanning ? 'animate-spin text-cyan-300' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold font-mono-code text-white">
                  Manual Scan
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 uppercase">
                  Single Pass
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Trigger an instant single-pass scan across all ocean corridors
              </p>
            </div>
          </div>

          {/* Action Button for Single Manual Scan */}
          <button
            id="btn-trigger-manual-scan"
            onClick={onManualScan}
            disabled={isScanning}
            className={`px-4 py-2.5 rounded-lg text-xs font-mono-code font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              isScanning
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 cursor-wait'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black border border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-98'
            } disabled:opacity-50`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Orbit Feeds...' : 'Run Single Manual Scan'}</span>
          </button>
        </div>
      </div>

      {/* SCAN IN PROGRESS ACTIVE HUD (Visual Radar Sweep Progress Bar) */}
      {isScanning && (
        <div 
          id="scanner-active-telemetry-hud"
          className="relative z-10 mt-4 p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 animate-pulse"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono-code mb-2">
            <div className="flex items-center gap-2 text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-semibold">{scanPhase}</span>
            </div>
            <span className="text-slate-300 font-bold">{scanProgress}% COMPLETED</span>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-950">
            <div 
              className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-emerald-400 transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.6)]"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* LAST SCAN RESULT TOAST / BANNER */}
      {lastScanResult && !isScanning && (
        <div 
          id="scanner-last-result-banner"
          className={`relative z-10 mt-3.5 p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono-code transition-all ${
            lastScanResult.newSpillsFound > 0
              ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
              : 'bg-slate-950/90 border-cyan-900/60 text-slate-200'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {lastScanResult.newSpillsFound > 0 ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white">
                  {lastScanResult.type === 'AUTO_10MIN' ? '10-Min Automated Scan Report' : 'Manual Scan Report'}
                </span>
                <span className="text-[10px] text-slate-400">({lastScanResult.timestamp})</span>
                {lastScanResult.newSpillsFound > 0 && (
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-bold text-[10px] uppercase">
                    +1 New Incident Flagged
                  </span>
                )}
              </div>
              <p className="text-slate-300 mt-0.5">
                {lastScanResult.message}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                <span>Swaths: <strong className="text-cyan-300">{lastScanResult.sectorsChecked}</strong></span>
                <span>•</span>
                <span>Vessels Tracked: <strong className="text-cyan-300">{lastScanResult.vesselsAnalyzed}</strong></span>
                <span>•</span>
                <span>Spills in 10m Window: <strong className={lastScanResult.newSpillsFound > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>{lastScanResult.newSpillsFound}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {lastScanResult.detectedIncidentId && onSelectIncident && (
              <button
                onClick={() => onSelectIncident(lastScanResult.detectedIncidentId!)}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Detected Spill</span>
              </button>
            )}
            <button
              onClick={onClearScanResult}
              title="Dismiss report"
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
