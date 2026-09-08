/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Pause, FastForward, Clock, Sliders, X, GripHorizontal } from 'lucide-react';
import { SimulationControlsState } from '../../types/simulation';
import { useDraggablePanel } from '../../hooks/useDraggablePanel';

interface SimulationControlsProps {
  controlsState: SimulationControlsState;
  onTogglePlay: () => void;
  onHourChange: (hour: number) => void;
  onSelectTimeOption: (option: string) => void;
  onOpenParameters?: () => void;
  seepageRate?: number;
  initialAmount?: number;
  onChangePlaybackSpeed?: (speed: number) => void;
  isOpen?: boolean;
  onClose?: () => void;
  zIndex?: number;
  onFocus?: () => void;
  initialPosition?: { x: number; y: number };
}

const TIME_STEPS = [12, 24, 36, 48, 60, 72];

export function SimulationControls({
  controlsState,
  onTogglePlay,
  onHourChange,
  onSelectTimeOption,
  onOpenParameters,
  seepageRate = 25,
  initialAmount = 100,
  onChangePlaybackSpeed,
  isOpen = true,
  onClose,
  zIndex = 30,
  onFocus,
  initialPosition = { x: 16, y: 16 },
}: SimulationControlsProps) {
  const { currentHour, totalHours, isPlaying, playbackSpeed, currentTimeFormatted } = controlsState;

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
      id="simulation-controls-floating-panel"
      onMouseDown={onFocus}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex,
      }}
      className={`absolute w-72 sm:w-80 rounded-xl bg-[#07131F]/95 border p-3 backdrop-blur-md transition-shadow select-none ${
        isDragging
          ? 'border-cyan-400 shadow-[0_16px_48px_rgba(0,0,0,0.85),0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-500/50 cursor-grabbing'
          : 'border-[#1b3147] shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
      }`}
    >
      {/* Draggable Header Row: Grip Handle + Title + Active Hour + Close Button */}
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#14283b] cursor-grab active:cursor-grabbing group/header"
        title="Click and drag to reposition panel across the map"
      >
        <div className="flex items-center gap-1.5 pointer-events-none">
          <GripHorizontal className="w-3.5 h-3.5 text-slate-500 group-hover/header:text-cyan-400 transition-colors" />
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold text-slate-300 tracking-wider uppercase">
            SIMULATION TIMELINE
          </span>
        </div>

        <div className="flex items-center gap-1.5" data-no-drag="true">
          {onOpenParameters && (
            <button
              id="btn-timeline-edit-params"
              onClick={onOpenParameters}
              className="px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/60 border border-[#1b344a] hover:border-cyan-700/60 transition-all cursor-pointer flex items-center gap-1"
              title="Open Simulation Parameters"
            >
              <Sliders className="w-3 h-3 text-cyan-400" />
              <span className="hidden xs:inline">Params</span>
            </button>
          )}

          <span className="text-xs font-bold font-mono-code text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
            +{currentHour}h
          </span>

          {onClose && (
            <button
              type="button"
              id="btn-close-timeline-panel"
              onClick={onClose}
              className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-950/70 hover:border-red-500/50 border border-transparent transition-all cursor-pointer ml-0.5"
              title="Close Timeline Panel"
              aria-label="Close Timeline Panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Play/Pause & Interactive Scrubber */}
      <div className="flex items-center gap-2.5 mb-2">
        <button
          id="btn-simulation-play"
          onClick={onTogglePlay}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
            isPlaying 
              ? 'bg-cyan-500 text-[#05101a] shadow-[0_0_12px_rgba(6,182,212,0.6)] font-bold' 
              : 'bg-[#0d2235] hover:bg-[#14324d] text-cyan-400 border border-[#204060]'
          }`}
          title={isPlaying ? 'Pause Simulation Timeline' : 'Play 72h Forward Projection'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Timeline Slider with Notches */}
        <div className="flex-1 relative flex flex-col justify-center">
          <input
            type="range"
            min="0"
            max={totalHours}
            step="1"
            value={currentHour}
            onChange={(e) => {
              const val = Number(e.target.value);
              onHourChange(val);
              onSelectTimeOption(`+ ${val}h`);
            }}
            className="w-full h-1.5 bg-[#0e2133] rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />
          {/* Subtle Step Marks */}
          <div className="flex justify-between text-[8px] font-mono-code text-slate-500 mt-1 px-0.5">
            <span>0h</span>
            <span>24h</span>
            <span>48h</span>
            <span>72h</span>
          </div>
        </div>
      </div>

      {/* Quick Jump Buttons (+12h, +24h, +36h, +48h, +60h, +72h) */}
      <div className="grid grid-cols-6 gap-1 mb-2">
        {TIME_STEPS.map((step) => {
          const isActive = currentHour === step;
          return (
            <button
              key={step}
              onClick={() => {
                onHourChange(step);
                onSelectTimeOption(`+ ${step}h`);
              }}
              className={`py-0.5 text-[10px] font-mono-code rounded transition-all cursor-pointer text-center ${
                isActive
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                  : 'bg-[#0b1c2b] text-slate-400 hover:text-slate-200 hover:bg-[#10273c] border border-[#183149]'
              }`}
            >
              +{step}h
            </button>
          );
        })}
      </div>

      {/* Spill Volume Display */}
      <div className="mb-2 px-2 py-1 rounded bg-[#091826] border border-[#162e45] flex items-center justify-between text-[9.5px] font-mono-code">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-slate-400">TOTAL SPILL RELEASE:</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-orange-400 font-bold bg-orange-950/70 px-1.5 py-0.5 rounded border border-orange-800/40">
            {initialAmount.toLocaleString()} Tonnes
          </span>
        </div>
      </div>

      {/* Timestamp & Playback Speed Controls */}
      <div className="pt-1.5 border-t border-[#162a3d] flex items-center justify-between text-[10px] font-mono-code text-slate-400">
        <span className="text-slate-300 truncate">{currentTimeFormatted}</span>
        
        <div className="flex items-center gap-2">
          {onChangePlaybackSpeed && (
            <div className="flex items-center gap-0.5 bg-[#0a1824] px-1 py-0.5 rounded border border-[#152e44]">
              {[1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  onClick={() => onChangePlaybackSpeed(spd)}
                  className={`px-1 text-[8.5px] rounded transition-all cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          )}
          <span className="text-cyan-400/90 font-medium shrink-0">
            {isPlaying ? '● SIMULATING' : 'PAUSED'}
          </span>
        </div>
      </div>
    </div>
  );
}
