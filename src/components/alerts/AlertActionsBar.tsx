/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Target, 
  Satellite, 
  Ship, 
  Download, 
  CheckSquare, 
  ShieldCheck, 
  Share2, 
  Check 
} from 'lucide-react';
import { OilSpillIncident, AlertStatus } from '../../types/alertTypes';

interface AlertActionsBarProps {
  incident: OilSpillIncident;
  onFocusLocation: () => void;
  onViewSatellite: () => void;
  onAnalyzeVesselRoute: () => void;
  onOpenDossier: () => void;
  onStatusChange: (newStatus: AlertStatus) => void;
}

export function AlertActionsBar({
  incident,
  onFocusLocation,
  onViewSatellite,
  onAnalyzeVesselRoute,
  onOpenDossier,
  onStatusChange,
}: AlertActionsBarProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section 
      id="alert-actions-bar"
      className="rounded-2xl border border-cyan-500/30 bg-slate-950/90 backdrop-blur-md p-4 sm:p-5 shadow-[0_0_30px_rgba(0,255,255,0.08)] mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Investigation Context & Status Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code text-slate-400">Incident Lifecycle:</span>
            <select
              value={incident.status}
              onChange={(e) => onStatusChange(e.target.value as AlertStatus)}
              className="bg-slate-900 border border-cyan-500/40 text-cyan-300 rounded-lg px-2.5 py-1.5 text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
            >
              <option value="NEW DETECTION">NEW DETECTION</option>
              <option value="UNDER INVESTIGATION">UNDER INVESTIGATION</option>
              <option value="HIGH PRIORITY">HIGH PRIORITY</option>
              <option value="TRACKING">TRACKING</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="text-xs font-mono-code text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographic Chain of Custody: <strong className="text-slate-200">VERIFIED</strong></span>
          </div>
        </div>

        {/* Right: Functional Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 font-mono-code">
          <button
            id="btn-action-focus"
            onClick={onFocusLocation}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>Focus Location</span>
          </button>

          <button
            id="btn-action-sat"
            onClick={onViewSatellite}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Satellite className="w-3.5 h-3.5 text-cyan-400" />
            <span>Satellite Pass</span>
          </button>

          <button
            id="btn-action-vessel"
            onClick={onAnalyzeVesselRoute}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Ship className="w-3.5 h-3.5 text-cyan-400" />
            <span>Analyse Route</span>
          </button>

          <button
            id="btn-action-share"
            onClick={handleShareLink}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedLink ? 'Link Copied' : 'Share Alert'}</span>
          </button>

          <button
            id="btn-action-dossier"
            onClick={onOpenDossier}
            className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:bg-cyan-400 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Investigation Report</span>
          </button>
        </div>
      </div>
    </section>
  );
}
