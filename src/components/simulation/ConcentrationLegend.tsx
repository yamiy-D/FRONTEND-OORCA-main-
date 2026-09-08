/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, Waves, X, GripHorizontal } from 'lucide-react';
import { useDraggablePanel } from '../../hooks/useDraggablePanel';

export interface ConcentrationLegendProps {
  showOceanSlick?: boolean;
  onToggleOceanSlick?: () => void;
  showHighZone?: boolean;
  onToggleHighZone?: () => void;
  showMediumZone?: boolean;
  onToggleMediumZone?: () => void;
  showLowZone?: boolean;
  onToggleLowZone?: () => void;
  peakThicknessMicrons?: number;
  isOpen?: boolean;
  onClose?: () => void;
  zIndex?: number;
  onFocus?: () => void;
  initialPosition?: { x: number; y: number };
}

export function ConcentrationLegend({
  showOceanSlick = true,
  onToggleOceanSlick,
  showHighZone = true,
  onToggleHighZone,
  showMediumZone = true,
  onToggleMediumZone,
  showLowZone = true,
  onToggleLowZone,
  peakThicknessMicrons = 350,
  isOpen = true,
  onClose,
  zIndex = 30,
  onFocus,
  initialPosition = { x: 340, y: 16 },
}: ConcentrationLegendProps) {
  const {
    panelRef,
    position,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useDraggablePanel({
    initialPosition,
    onFocus,
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      ref={panelRef}
      id="oil-concentration-legend"
      onMouseDown={onFocus}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex,
      }}
      className={`absolute w-[94vw] max-w-[480px] sm:w-[480px] rounded-xl bg-[#07131F]/95 border p-2.5 backdrop-blur-md transition-shadow select-none ${
        isDragging
          ? 'border-orange-400 shadow-[0_16px_48px_rgba(0,0,0,0.85),0_0_20px_rgba(249,115,22,0.35)] ring-1 ring-orange-500/50 cursor-grabbing'
          : 'border-[#1b3147] shadow-[0_8px_32px_rgba(0,0,0,0.65)]'
      }`}
    >
      {/* Draggable Header Row: Grip + Title + Master Slick Toggle + Peak Thickness + Close Button */}
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#14283b] cursor-grab active:cursor-grabbing group/header"
        title="Click and drag to reposition panel across the map"
      >
        <div className="flex items-center gap-1.5 pointer-events-none">
          <GripHorizontal className="w-3.5 h-3.5 text-slate-500 group-hover/header:text-orange-400 transition-colors" />
          <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400/40" />
          <span className="text-[10px] font-bold text-slate-200 tracking-wider uppercase">
            OIL SPILL CONCENTRATION
          </span>
          <span className="text-[8.5px] font-medium text-orange-300/80 hidden sm:inline">
            (Orange to Concentrated Red)
          </span>
        </div>

        <div className="flex items-center gap-1.5" data-no-drag="true">
          {/* Quick Toggle: Master Oil Slick Layer */}
          {onToggleOceanSlick && (
            <button
              type="button"
              onClick={onToggleOceanSlick}
              className={`px-2 py-0.5 rounded text-[9px] font-semibold transition-all cursor-pointer flex items-center gap-1 border ${
                showOceanSlick
                  ? 'bg-orange-950/80 text-orange-300 border-orange-500/70 shadow-[0_0_6px_rgba(249,115,22,0.35)]'
                  : 'bg-[#0d1f2d] text-slate-400 border-slate-700/50 hover:text-slate-200'
              }`}
              title={showOceanSlick ? 'Hide Oil Spill Layer' : 'Show Oil Spill Layer'}
            >
              <Waves className="w-2.5 h-2.5 text-orange-400" />
              <span>Oil Spill Layer</span>
            </button>
          )}

          <span className="text-[9px] font-mono-code text-red-300 bg-red-950/70 px-1.5 py-0.5 rounded border border-red-800/60 font-semibold">
            &gt;{peakThicknessMicrons}μm
          </span>

          {onClose && (
            <button
              type="button"
              id="btn-close-concentration-panel"
              onClick={onClose}
              className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-950/70 hover:border-red-500/50 border border-transparent transition-all cursor-pointer ml-0.5"
              title="Close Oil Concentration Panel"
              aria-label="Close Oil Concentration Panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Red-to-Orange Oil Concentration Gradient Bar */}
      <div className="w-full h-2.5 rounded-sm overflow-hidden border border-[#22394e] bg-gradient-to-r from-[#fb923c] via-[#f97316] via-45%-[#ea580c] via-75%-[#dc2626] to-[#b91c1c] relative shadow-inner">
        {/* Subtle contour tick markers */}
        <div className="absolute inset-0 flex justify-between pointer-events-none opacity-25">
          <div className="w-[1px] h-full bg-white"></div>
          <div className="w-[1px] h-full bg-white"></div>
          <div className="w-[1px] h-full bg-white"></div>
          <div className="w-[1px] h-full bg-white"></div>
          <div className="w-[1px] h-full bg-white"></div>
        </div>
      </div>

      {/* Thickness & Optical State Labels */}
      <div className="flex justify-between text-[8.5px] text-slate-300 mt-1 font-mono-code px-0.5">
        <span className="text-orange-300">0.1 μm (Light Orange)</span>
        <span className="text-orange-400">50 μm (Vibrant Orange)</span>
        <span className="text-red-400 font-semibold">&gt;250 μm (Concentrated Red)</span>
      </div>

      {/* 3 Physical Oil Spill Concentration Zones */}
      <div className="mt-2 grid grid-cols-3 gap-1.5 text-[9.5px]">
        {/* Low Zone: Light Orange Sheen */}
        <button
          type="button"
          onClick={onToggleLowZone}
          className={`flex items-center justify-between p-1.5 rounded-lg border transition-all cursor-pointer ${
            showLowZone
              ? 'bg-[#0f2438] border-orange-400/50 text-slate-200 shadow-sm'
              : 'bg-[#07131F] border-[#15293d] text-slate-500 opacity-60'
          }`}
        >
          <div className="flex items-center gap-1.5 text-left">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 shadow-[0_0_5px_rgba(251,146,60,0.7)] shrink-0" />
            <div>
              <div className="font-semibold leading-tight text-orange-300">Low Zone</div>
              <div className="text-[8px] text-slate-400 leading-tight">Light Orange Sheen</div>
            </div>
          </div>
          <span className="text-[8px] font-mono-code px-1 py-0.5 rounded bg-orange-950/60 text-orange-400 border border-orange-800/40">
            {showLowZone ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Medium Zone: Vibrant Orange Mousse */}
        <button
          type="button"
          onClick={onToggleMediumZone}
          className={`flex items-center justify-between p-1.5 rounded-lg border transition-all cursor-pointer ${
            showMediumZone
              ? 'bg-[#0f2438] border-orange-600/60 text-slate-200 shadow-sm'
              : 'bg-[#07131F] border-[#15293d] text-slate-500 opacity-60'
          }`}
        >
          <div className="flex items-center gap-1.5 text-left">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-orange-600 to-orange-500 shadow-[0_0_5px_rgba(234,88,12,0.7)] shrink-0" />
            <div>
              <div className="font-semibold leading-tight text-orange-400">Medium Zone</div>
              <div className="text-[8px] text-slate-400 leading-tight">Vibrant Orange Mousse</div>
            </div>
          </div>
          <span className="text-[8px] font-mono-code px-1 py-0.5 rounded bg-orange-950/60 text-orange-400 border border-orange-800/40">
            {showMediumZone ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* High Zone: Concentrated Red Core */}
        <button
          type="button"
          onClick={onToggleHighZone}
          className={`flex items-center justify-between p-1.5 rounded-lg border transition-all cursor-pointer ${
            showHighZone
              ? 'bg-[#0f2438] border-red-500/60 text-slate-200 shadow-sm'
              : 'bg-[#07131F] border-[#15293d] text-slate-500 opacity-60'
          }`}
        >
          <div className="flex items-center gap-1.5 text-left">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-red-700 to-red-500 border border-red-400 shadow-[0_0_6px_rgba(239,68,68,0.8)] shrink-0" />
            <div>
              <div className="font-semibold leading-tight text-red-300">High Zone</div>
              <div className="text-[8px] text-slate-400 leading-tight">Concentrated Red Core</div>
            </div>
          </div>
          <span className="text-[8px] font-mono-code px-1 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/40">
            {showHighZone ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>
    </div>
  );
}
