/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  PlusCircle, 
  Save, 
  FileText, 
  Share2, 
  Check, 
  SlidersHorizontal,
  ChevronDown,
  Clock,
  Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SimulationHeaderProps {
  onNewSimulation: () => void;
  onSaveSimulation: () => void;
  onExportReport: () => void;
  onShareSimulation: () => void;
  isSaved?: boolean;
  onToggleParameters: () => void;
  isParametersOpen: boolean;
  activeSpillSummary?: string;
  isTimelineOpen?: boolean;
  onToggleTimeline?: () => void;
  isConcentrationOpen?: boolean;
  onToggleConcentration?: () => void;
}

export function SimulationHeader({
  onNewSimulation,
  onSaveSimulation,
  onExportReport,
  onShareSimulation,
  isSaved = false,
  onToggleParameters,
  isParametersOpen,
  activeSpillSummary = '100t Crude',
  isTimelineOpen = true,
  onToggleTimeline,
  isConcentrationOpen = true,
  onToggleConcentration,
}: SimulationHeaderProps) {
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShareClick = () => {
    onShareSimulation();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    setShareDropdownOpen(false);
  };

  return (
    <header 
      id="simulation-page-header"
      className="h-14 bg-[#07111B] border-b border-[#1b2b3a] px-4 sm:px-6 flex items-center justify-between z-30 shrink-0 select-none"
    >
      {/* LEFT: OORCA Logo + Vertical Divider + Title */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 group">
          {/* OORCA Emblem */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-600 flex items-center justify-center p-0.5 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
            <div className="w-full h-full rounded-full bg-[#07111B] flex items-center justify-center">
              <svg 
                className="w-4 h-4 text-cyan-400 transform group-hover:scale-110 transition-transform" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <path d="M12 6a6 6 0 00-6 6c0 2.5 1.5 4.5 3.5 5.5l1-2c-1.3-.7-2-1.9-2-3.5 0-2.2 1.8-4 4-4s4 1.8 4 4c0 1.6-.7 2.8-2 3.5l1 2c2-1 3.5-3 3.5-5.5a6 6 0 00-6-6z" />
              </svg>
            </div>
          </div>

          <span className="text-lg font-bold tracking-wider text-white font-display">
            OORCA
          </span>
        </Link>

        {/* Thin Vertical Separator */}
        <div className="h-5 w-[1px] bg-slate-700/60 mx-1" />

        {/* Page Title */}
        <h1 className="text-sm sm:text-base font-medium text-slate-200">
          Oil Spill Simulator
        </h1>

        {/* Quick Parameters Access Button */}
        <button
          id="btn-header-toggle-params"
          onClick={onToggleParameters}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-xs transition-all cursor-pointer ${
            isParametersOpen
              ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
              : 'bg-[#0d1c2b] border-[#22394e] text-slate-300 hover:text-white hover:border-cyan-500/50'
          }`}
          title={isParametersOpen ? "Close Input Parameters" : "Open Input Parameters Panel"}
        >
          <SlidersHorizontal className={`w-3.5 h-3.5 ${isParametersOpen ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span className="font-medium hidden sm:inline">Parameters</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#06131f] text-cyan-400 border border-cyan-800/50 font-mono-code">
            {activeSpillSummary}
          </span>
        </button>
      </div>

      {/* RIGHT SIDE ACTIONS */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs">
        {/* Floating Controls Quick Access Cluster: Timeline & Oil Concentration (Beside New Simulation) */}
        <div className="flex items-center gap-1 bg-[#091726] p-1 rounded-lg border border-[#1b334a] shadow-inner">
          {/* 🕒 Timeline Icon Button */}
          <button
            id="btn-header-timeline"
            type="button"
            onClick={onToggleTimeline}
            className={`relative p-1.5 sm:px-2 rounded transition-all duration-200 cursor-pointer flex items-center justify-center group ${
              isTimelineOpen
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'bg-transparent text-slate-400 hover:text-cyan-300 hover:bg-[#0f253a] border border-transparent'
            }`}
            title="Simulation Timeline — Toggle draggable playback controls, time scrubber, and projection metrics"
            aria-label="Toggle Simulation Timeline"
          >
            <Clock className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
              isTimelineOpen ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
            }`} />
            {isTimelineOpen && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#07111B] shadow-[0_0_6px_#22d3ee]" />
            )}
          </button>

          {/* 🔥 Oil Spill Concentration Icon Button */}
          <button
            id="btn-header-concentration"
            type="button"
            onClick={onToggleConcentration}
            className={`relative p-1.5 sm:px-2 rounded transition-all duration-200 cursor-pointer flex items-center justify-center group ${
              isConcentrationOpen
                ? 'bg-orange-950 text-orange-300 border border-orange-400/80 shadow-[0_0_12px_rgba(249,115,22,0.45)]'
                : 'bg-transparent text-slate-400 hover:text-orange-300 hover:bg-[#0f253a] border border-transparent'
            }`}
            title="Oil Spill Concentration — Toggle draggable concentration gradient, peak thickness, and physical zone filters"
            aria-label="Toggle Oil Spill Concentration"
          >
            <Flame className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
              isConcentrationOpen ? 'text-orange-400 fill-orange-400/40' : 'text-slate-400 group-hover:text-orange-400'
            }`} />
            {isConcentrationOpen && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-orange-400 ring-2 ring-[#07111B] shadow-[0_0_6px_#fb923c]" />
            )}
          </button>
        </div>

        {/* Separator */}
        <div className="h-5 w-[1px] bg-slate-700/60 mx-0.5 hidden xs:block" />

        {/* New Simulation */}
        <button
          id="btn-new-simulation"
          onClick={onNewSimulation}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          title="Reset parameters to start a new simulation"
        >
          <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">New Simulation</span>
        </button>

        {/* Save */}
        <button
          id="btn-save-simulation"
          onClick={onSaveSimulation}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          title="Save simulation parameters"
        >
          {isSaved ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 hidden sm:inline">Saved</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Save</span>
            </>
          )}
        </button>

        {/* Export Report */}
        <button
          id="btn-export-report"
          onClick={onExportReport}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          title="Export scientific simulation report"
        >
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Export Report</span>
        </button>

        {/* Share Dropdown */}
        <div className="relative">
          <button
            id="btn-share-simulation"
            onClick={() => setShareDropdownOpen(!shareDropdownOpen)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Share</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {shareDropdownOpen && (
            <div className="absolute right-0 mt-1 w-52 rounded-md bg-[#0d1b28] border border-[#1d3246] shadow-xl py-1 z-50 text-xs">
              <button
                onClick={handleShareClick}
                className="w-full text-left px-3 py-2 text-slate-200 hover:bg-cyan-950/60 hover:text-cyan-300 flex items-center justify-between"
              >
                <span>{copied ? 'Link Copied!' : 'Copy Simulation Link'}</span>
                {copied && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2500);
                  setShareDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-slate-200 hover:bg-cyan-950/60 hover:text-cyan-300"
              >
                Copy Workspace Coordinates
              </button>
            </div>
          )}
        </div>

        {/* Compact Theme/Settings Toggle */}
        <div className="hidden md:flex items-center pl-1 border-l border-slate-700/60">
          <div className="w-8 h-4 rounded-full bg-slate-800 p-0.5 flex items-center justify-end cursor-pointer border border-slate-700" title="Dark Maritime Mode (Locked for telemetry accuracy)">
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm" />
          </div>
        </div>
      </div>
    </header>
  );
}
