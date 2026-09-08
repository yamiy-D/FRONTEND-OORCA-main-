/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  AlertTriangle, 
  Droplets, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Fish, 
  Waves, 
  Maximize2, 
  Minimize2,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { SimulationResult, SimulationParameters, RiskLevel } from '../../types/simulation';
import { SpillSummary } from './SpillSummary';
import { DangerAssessment } from './DangerAssessment';
import { EcologicalRiskTable } from './EcologicalRiskTable';
import { ShorelineImpact } from './ShorelineImpact';

interface OperationalCommandDockProps {
  simulationResult: SimulationResult;
  parameters: SimulationParameters;
  onSelectShoreline: (coords: [number, number]) => void;
  onOpenParameters: () => void;
}

type DockTab = 'summary' | 'danger' | 'shoreline' | 'ecology' | 'all';

export function OperationalCommandDock({
  simulationResult,
  parameters,
  onSelectShoreline,
  onOpenParameters,
}: OperationalCommandDockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<DockTab>('summary');

  const { summary, dangerAssessment, shorelineImpacts, ecologicalRisks } = simulationResult;

  const getOverallRiskBadgeClass = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
      case 'HIGH':
        return 'bg-red-950/90 text-red-300 border-red-600/80 shadow-[0_0_12px_rgba(239,68,68,0.35)]';
      case 'MEDIUM':
        return 'bg-amber-950/90 text-amber-300 border-amber-600/80 shadow-[0_0_12px_rgba(245,158,11,0.3)]';
      case 'LOW':
      default:
        return 'bg-emerald-950/90 text-emerald-300 border-emerald-600/80 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
    }
  };

  // If fully minimized: small floating pill at bottom center
  if (isMinimized) {
    return (
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 select-none">
        <button
          onClick={() => setIsMinimized(false)}
          className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md shadow-2xl transition-all cursor-pointer ${getOverallRiskBadgeClass(dangerAssessment.overallRisk)}`}
          title="Restore Operational Telemetry Dock"
        >
          <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
          <span>STATUS: {dangerAssessment.overallRisk} RISK</span>
          <span className="text-[11px] font-mono-code opacity-90">• {summary.spillAreaEstKm2.toFixed(1)} km²</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-300" />
        </button>
      </div>
    );
  }

  return (
    <div 
      id="operational-command-dock"
      className="z-20 bg-[#07131F]/96 border-t border-[#192f44] flex flex-col shrink-0 select-none backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.6)] transition-all duration-300"
    >
      {/* 1. PRIMARY OPERATIONAL BAR (ALWAYS VISIBLE & HIGH-CONTRAST) */}
      <div className="h-12 px-3 sm:px-5 flex items-center justify-between gap-3 text-xs">
        
        {/* LEFT: CRITICAL DANGER INDICATOR & LOCATION */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Overall Danger Badge (CRITICAL) */}
          <div className="flex items-center gap-1.5">
            <span 
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-mono-code tracking-wider border flex items-center gap-1.5 ${getOverallRiskBadgeClass(dangerAssessment.overallRisk)}`}
              title="Overall Emergency Danger Level"
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{dangerAssessment.overallRisk} RISK</span>
            </span>
          </div>

          {/* Location Badge (CRITICAL) */}
          <div className="hidden lg:flex items-center gap-1.5 text-slate-300 border-l border-[#192f44] pl-3">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-medium truncate max-w-[200px]">
              {parameters.location.locationName.split(',')[0]}
            </span>
            <span className="text-[10px] font-mono-code text-slate-400">
              ({parameters.location.latitude.toFixed(2)}°N, {parameters.location.longitude.toFixed(2)}°E)
            </span>
          </div>
        </div>

        {/* CENTER: IMPORTANT SUMMARY METRICS (GLANCEABLE AT A GLANCE) */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono-code">
          {/* Spill Volume */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <Droplets className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 text-[11px]">Volume:</span>
            <strong className="text-slate-100">{summary.totalSpilled}</strong>
          </div>

          <div className="h-3 w-[1px] bg-slate-700/60" />

          {/* Plume Area */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-400 text-[11px]">Plume Area:</span>
            <strong className="text-cyan-300 font-bold">{summary.spillAreaEstKm2.toFixed(2)} km²</strong>
          </div>

          <div className="h-3 w-[1px] bg-slate-700/60" />

          {/* Shoreline Arrival */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <Waves className="w-3.5 h-3.5 text-red-400" />
            <span className="text-slate-400 text-[11px]">Landfall:</span>
            <strong className="text-red-300">{summary.maxShoreArrival}</strong>
          </div>
        </div>

        {/* RIGHT: TABS & DRAWER EXPANSION TOGGLE */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Direct Category Tab Chips */}
          <div className="flex items-center bg-[#050e18] p-0.5 rounded-lg border border-[#162a3d]">
            <button
              onClick={() => {
                setActiveTab('summary');
                setIsExpanded(true);
              }}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                isExpanded && activeTab === 'summary'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Summary
            </button>

            <button
              onClick={() => {
                setActiveTab('shoreline');
                setIsExpanded(true);
              }}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                isExpanded && activeTab === 'shoreline'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Shorelines ({shorelineImpacts.length})
            </button>

            <button
              onClick={() => {
                setActiveTab('ecology');
                setIsExpanded(true);
              }}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                isExpanded && activeTab === 'ecology'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ecology ({ecologicalRisks.length})
            </button>

            <button
              onClick={() => {
                setActiveTab('danger');
                setIsExpanded(true);
              }}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                isExpanded && activeTab === 'danger'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Threats
            </button>

            <button
              onClick={() => {
                setActiveTab('all');
                setIsExpanded(true);
              }}
              className={`hidden xl:block px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                isExpanded && activeTab === 'all'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Panels
            </button>
          </div>

          {/* Expand / Collapse Button */}
          <button
            id="btn-toggle-telemetry-drawer"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0e2133] hover:bg-[#143049] border border-[#1f3d59] text-slate-200 hover:text-white transition-colors cursor-pointer text-[11px] font-medium"
            title={isExpanded ? "Collapse Telemetry Drawer" : "Expand Full Scientific Telemetry"}
          >
            <span>{isExpanded ? 'Collapse' : 'Details'}</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          {/* Minimize To Pill Button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Minimize dock completely for maximum map view"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. EXPANDED SCIENTIFIC TELEMETRY DRAWER (PROGRESSIVE DISCLOSURE) */}
      {isExpanded && (
        <div className="border-t border-[#162738] p-3 sm:p-4 bg-[#050e18]/95 overflow-y-auto max-h-[360px] custom-scrollbar animate-in slide-in-from-bottom-3 duration-200">
          
          {/* TAB: SPILL SUMMARY */}
          {activeTab === 'summary' && (
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SpillSummary summary={summary} />
                <DangerAssessment assessment={dangerAssessment} />
              </div>
            </div>
          )}

          {/* TAB: SHORELINE IMPACT */}
          {activeTab === 'shoreline' && (
            <div className="max-w-5xl mx-auto">
              <ShorelineImpact 
                shorelines={shorelineImpacts} 
                onSelectShoreline={(coords) => {
                  onSelectShoreline(coords);
                  // Optional subtle notification that map panned
                }}
              />
            </div>
          )}

          {/* TAB: ECOLOGICAL RISKS */}
          {activeTab === 'ecology' && (
            <div className="max-w-5xl mx-auto">
              <EcologicalRiskTable inhabitants={ecologicalRisks} />
            </div>
          )}

          {/* TAB: DANGER ASSESSMENT */}
          {activeTab === 'danger' && (
            <div className="max-w-4xl mx-auto">
              <DangerAssessment assessment={dangerAssessment} />
            </div>
          )}

          {/* TAB: ALL PANELS GRID */}
          {activeTab === 'all' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 max-w-[1920px] mx-auto">
              <SpillSummary summary={summary} />
              <DangerAssessment assessment={dangerAssessment} />
              <EcologicalRiskTable inhabitants={ecologicalRisks} />
              <ShorelineImpact 
                shorelines={shorelineImpacts} 
                onSelectShoreline={onSelectShoreline}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
