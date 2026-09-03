/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Ship, 
  AlertOctagon, 
  Clock, 
  Compass, 
  Radio, 
  Activity, 
  MapPin, 
  Filter, 
  ShieldAlert, 
  ChevronRight, 
  Flag, 
  Anchor, 
  CheckCircle2, 
  Crosshair 
} from 'lucide-react';
import { SuspectVessel } from '../../types/alertTypes';

interface SuspectVesselInvestigationProps {
  primaryVessel: SuspectVessel;
  secondaryVessels: SuspectVessel[];
}

export function SuspectVesselInvestigation({
  primaryVessel,
  secondaryVessels,
}: SuspectVesselInvestigationProps) {
  const [activeVesselId, setActiveVesselId] = useState<string>(primaryVessel.id);
  const [filterMode, setFilterMode] = useState<'SUSPECTS_ONLY' | 'ALL_FILTERED'>('SUSPECTS_ONLY');

  const allVessels = [primaryVessel, ...secondaryVessels];
  const activeVessel = allVessels.find((v) => v.id === activeVesselId) || primaryVessel;

  const { scoringFactors } = activeVessel;

  // Visual meter helper
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-red-400 border-red-500 bg-red-950/40';
    if (score >= 65) return 'text-amber-400 border-amber-500 bg-amber-950/40';
    return 'text-cyan-400 border-cyan-500 bg-cyan-950/40';
  };

  return (
    <section 
      id="vessel-investigation"
      className="rounded-2xl border border-cyan-950/80 bg-slate-950/80 backdrop-blur-md overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.6)] mb-6"
    >
      {/* 7. VESSEL INVESTIGATION Header */}
      <div className="p-4 sm:p-5 border-b border-cyan-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <Ship className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold font-mono-code text-white uppercase tracking-wide">
                🚢 VESSEL INVESTIGATION
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-red-950/80 border border-red-500/40 text-red-300">
                HISTORIC AIS INTERSECT ANALYSIS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono-code mt-0.5">
              Filtered 24 background merchant vessels • 2 candidate vessels intersected temporal origin window
            </p>
          </div>
        </div>

        {/* Vessel Filter Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono-code">
            <button
              onClick={() => setFilterMode('SUSPECTS_ONLY')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterMode === 'SUSPECTS_ONLY'
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Suspects Only (2)
            </button>
            <button
              onClick={() => setFilterMode('ALL_FILTERED')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterMode === 'ALL_FILTERED'
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Background Traffic (24 Filtered)
            </button>
          </div>
        </div>
      </div>

      {/* Candidate Vessel Selector Tabs */}
      <div className="flex items-center gap-2 p-3 bg-slate-900/80 border-b border-cyan-950/80 overflow-x-auto">
        {allVessels
          .filter((v) => (filterMode === 'SUSPECTS_ONLY' ? v.overallSuspectScore > 20 : true))
          .map((vessel) => {
            const isSelected = vessel.id === activeVesselId;
            return (
              <button
                key={vessel.id}
                onClick={() => setActiveVesselId(vessel.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono-code flex items-center gap-2 transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-slate-950 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,255,255,0.2)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{vessel.flag}</span>
                <span className="font-bold">{vessel.name}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getScoreColor(vessel.overallSuspectScore)}`}>
                  {vessel.overallSuspectScore}/100
                </span>
                {vessel.isPrimary && (
                  <span className="px-1 py-0.2 rounded text-[9px] bg-red-950 text-red-400 border border-red-800">
                    PRIMARY
                  </span>
                )}
              </button>
            );
          })}
      </div>

      {/* 8. PRIMARY VESSEL OF INTEREST HERO CARD */}
      <div className="p-5 bg-gradient-to-b from-slate-900/60 to-slate-950/80 border-b border-cyan-950/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Vessel Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-red-950/80 border border-red-500/50 text-red-300 flex items-center gap-1.5 animate-pulse">
                <AlertOctagon className="w-3 h-3 text-red-400" />
                🚨 PRIMARY VESSEL OF INTEREST
              </span>
              <span className="text-xs font-mono-code text-slate-400">
                Flag State: {activeVessel.flagCountry} {activeVessel.flag}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-mono-code text-white tracking-tight">
              {activeVessel.name}
            </h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono-code text-slate-300 mt-1.5">
              <span>{activeVessel.imo}</span>
              <span className="text-slate-600">•</span>
              <span>MMSI: <strong className="text-cyan-300">{activeVessel.mmsi}</strong></span>
              <span className="text-slate-600">•</span>
              <span>Type: <strong className="text-slate-200">{activeVessel.vesselType}</strong></span>
              <span className="text-slate-600">•</span>
              <span>Destination: <strong className="text-amber-300">{activeVessel.destination}</strong></span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono-code text-slate-400 mt-2">
              <span>Draught: {activeVessel.draughtM}m</span>
              <span>DWT: {activeVessel.deadweightTonnage.toLocaleString()} tonnes</span>
              <span>Origin Transit Intersect: <strong className="text-amber-400">{activeVessel.historicOriginPosition.formattedLat}, {activeVessel.historicOriginPosition.formattedLon}</strong></span>
            </div>
          </div>

          {/* Suspect Score Gauge Meter */}
          <div className="flex items-center gap-4 bg-slate-950/90 border border-cyan-950 p-4 rounded-2xl shadow-xl">
            {/* Circular Gauge Graphic */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#1e293b"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={activeVessel.overallSuspectScore >= 80 ? '#ef4444' : '#f59e0b'}
                  strokeWidth="8"
                  strokeDasharray={`${(activeVessel.overallSuspectScore / 100) * 264} 264`}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono-code text-white">
                  {activeVessel.overallSuspectScore}
                </span>
                <span className="text-[9px] font-mono-code text-slate-400 uppercase -mt-1">
                  / 100
                </span>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">
                SUSPECT ATTRIBUTION INDEX
              </div>
              <div className="text-sm font-bold font-mono-code text-red-400 mt-0.5">
                {activeVessel.overallSuspectScore >= 85
                  ? 'CRITICAL LIABILITY RISK'
                  : activeVessel.overallSuspectScore >= 65
                  ? 'ELEVATED SUSPICION'
                  : 'LOW CORRELATION'}
              </div>
              <p className="text-[11px] text-slate-400 max-w-[200px] mt-1 leading-snug">
                Based on 5 weighted forensic factors including AIS blackout and wake vector alignment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 9. SUSPECT SCORING SYSTEM BREAKDOWN */}
      <div className="p-5 border-b border-cyan-950/80">
        <h4 className="text-xs font-bold font-mono-code text-cyan-300 uppercase tracking-wider mb-3">
          📊 SUSPECT SCORING FACTORS & EVIDENCE INDICATORS
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono-code">
          {/* Factor 1: Proximity */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Proximity
                </span>
                <span className="text-cyan-300 font-bold">{scoringFactors.proximityScore}%</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug mt-1">
                {scoringFactors.proximityDetails}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
              Separation: <strong className="text-slate-200">{scoringFactors.proximityDistanceNm} NM</strong>
            </div>
          </div>

          {/* Factor 2: Time Relevance */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Time Relevance
                </span>
                <span className="text-amber-300 font-bold">{scoringFactors.timeRelevanceScore}%</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug mt-1">
                {scoringFactors.timeRelevanceDetails}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
              Window Delta: <strong className="text-slate-200">{scoringFactors.timeWindowOverlapHours} Hours</strong>
            </div>
          </div>

          {/* Factor 3: Trajectory Compatibility */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-purple-400" /> Trajectory
                </span>
                <span className="text-purple-300 font-bold">{scoringFactors.trajectoryCompatibilityScore}%</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug mt-1">
                {scoringFactors.trajectoryCompatibilityDetails}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
              Wake Angular Offset: <strong className="text-slate-200">{scoringFactors.wakeAlignmentAngleDeg}°</strong>
            </div>
          </div>

          {/* Factor 4: AIS Behaviour */}
          <div className="bg-slate-900/60 border border-red-900/40 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-red-300 font-semibold flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-red-400" /> AIS Behaviour
                </span>
                <span className="text-red-400 font-bold">{scoringFactors.aisBehaviourScore}%</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug mt-1">
                {scoringFactors.aisBehaviourDetails}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
              Transponder Silence: <strong className="text-red-400">{scoringFactors.aisGapDurationMinutes} Minutes</strong>
            </div>
          </div>

          {/* Factor 5: Vessel Behaviour */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" /> Maneuver
                </span>
                <span className="text-indigo-300 font-bold">{scoringFactors.vesselBehaviourScore}%</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug mt-1">
                {scoringFactors.vesselBehaviourDetails}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
              Speed Drop: <strong className="text-slate-200">-{scoringFactors.speedDeltaKts} kts</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 10. VESSEL TRAFFIC RECONSTRUCTION */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-xs font-bold font-mono-code text-cyan-300 uppercase tracking-wider">
              🗺 VESSEL TRAFFIC RECONSTRUCTION (ORIGIN WINDOW)
            </h4>
            <p className="text-[11px] text-slate-400 font-mono-code">
              Reconstructed AIS Waypoints: Where vessels were → When they were there → Potential relevance
            </p>
          </div>
          <span className="text-[10px] font-mono-code text-slate-400 hidden sm:inline">
            Class A AIS 2-second nominal sampling
          </span>
        </div>

        {/* Waypoint Track Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
          <table className="w-full text-left text-xs font-mono-code">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-2.5 px-3">TIMESTAMP</th>
                <th className="py-2.5 px-3">COORDINATES</th>
                <th className="py-2.5 px-3">SPEED (KTS)</th>
                <th className="py-2.5 px-3">COURSE (COG)</th>
                <th className="py-2.5 px-3">NAV STATUS</th>
                <th className="py-2.5 px-3 text-right">ORIGIN INTERSECTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {activeVessel.historicRoute.map((point, idx) => (
                <tr 
                  key={idx}
                  className={`hover:bg-slate-900/60 transition-colors ${
                    point.isGapPoint ? 'bg-red-950/20 text-red-200' : ''
                  }`}
                >
                  <td className="py-2 px-3 font-semibold text-cyan-300">
                    {point.timeUtc} UTC
                  </td>
                  <td className="py-2 px-3 text-slate-300">
                    {point.lat.toFixed(4)}° N, {point.lon.toFixed(4)}° E
                  </td>
                  <td className="py-2 px-3">
                    <span className={point.speedKts < 8 ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                      {point.speedKts.toFixed(1)} kts
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-400">
                    {point.courseDeg}°
                  </td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      point.isGapPoint 
                        ? 'bg-red-950 text-red-300 border border-red-800' 
                        : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}>
                      {point.navStatus}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    {point.isInsideOriginWindow ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-red-950/80 border border-red-500/50 text-red-300 font-bold">
                        INSIDE RELEASE ZONE
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Clear</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
