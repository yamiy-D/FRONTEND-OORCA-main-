import React, { useState, useEffect } from 'react';
import { 
  Satellite, 
  Cpu, 
  Radio, 
  Compass, 
  Target, 
  FileCheck2, 
  ArrowRight, 
  Play, 
  Pause,
  CheckCircle2
} from 'lucide-react';
import { PIPELINE_STEPS } from '../data/mockData';

export const HowItWorksPipeline: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % PIPELINE_STEPS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const getStepIcon = (iconName: string, active: boolean) => {
    const className = `w-5 h-5 ${active ? 'text-black' : 'text-cyan-400'}`;
    switch (iconName) {
      case 'Satellite':
        return <Satellite className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Radio':
        return <Radio className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Target':
        return <Target className={className} />;
      case 'FileCheck2':
        return <FileCheck2 className={className} />;
      default:
        return <Satellite className={className} />;
    }
  };

  const currentStep = PIPELINE_STEPS[activeStepIndex];

  return (
    <section 
      id="how-it-works"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-12 bg-[#020712] border-b border-cyan-950/80 overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 ocean-grid opacity-25 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono-code mb-4">
              <span>FORENSIC PIPELINE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-display tracking-tight leading-tight">
              How OORCA Works
            </h2>
            <p className="mt-3 text-slate-300 max-w-2xl text-base sm:text-lg">
              A continuous, automated intelligence sequence that transforms satellite signals into verifiable maritime accountability.
            </p>
          </div>

          {/* Autoplay Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-cyan-800/50 text-xs font-mono-code text-cyan-300 hover:border-cyan-400 transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isPlaying ? 'PAUSE PIPELINE' : 'RESUME SEQUENCE'}</span>
            </button>
            <span className="text-xs font-mono-code text-slate-500">
              STEP {activeStepIndex + 1} OF {PIPELINE_STEPS.length}
            </span>
          </div>
        </div>

        {/* Pipeline Step Navigator Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-10">
          {PIPELINE_STEPS.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            const isCompleted = idx < activeStepIndex;
            return (
              <button
                key={step.stepNumber}
                onClick={() => {
                  setActiveStepIndex(idx);
                  setIsPlaying(false);
                }}
                className={`relative p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-950/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900/60 border-cyan-900/30 hover:border-cyan-700/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono-code font-bold ${isActive ? 'text-cyan-300' : 'text-slate-400'}`}>
                    STEP {step.stepNumber}
                  </span>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${isActive ? 'bg-cyan-400 text-black' : 'bg-slate-800 text-cyan-400'}`}>
                    {getStepIcon(step.icon, isActive)}
                  </div>
                </div>
                <div className="text-xs font-bold text-white font-display truncate">
                  {step.title}
                </div>
                <div className="text-[10px] text-slate-400 font-mono-code truncate">
                  {step.subtitle}
                </div>

                {/* Bottom Active Glow Line */}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-400 shadow-[0_0_8px_#22d3ee]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Detailed Active Step Stage Showcase */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#030d1d] border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.12)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Step Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-md bg-cyan-500 text-black font-mono-code font-bold text-xs">
                  STAGE 0{activeStepIndex + 1}
                </span>
                <span className="text-xs font-mono-code text-cyan-400 tracking-wider">
                  FORENSIC PROCESS PHASE
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display">
                {currentStep.title} — <span className="text-cyan-300">{currentStep.subtitle}</span>
              </h3>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                {currentStep.description}
              </p>

              {/* Data Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-mono-code">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-900/60">
                  <span className="text-slate-400 block mb-1">CORE TECHNOLOGY ENGINE:</span>
                  <span className="text-cyan-300 font-semibold text-sm">{currentStep.keyTech}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-900/60">
                  <span className="text-slate-400 block mb-1">EVIDENTIARY ARTIFACT PRODUCED:</span>
                  <span className="text-emerald-300 font-semibold text-sm">{currentStep.outputArtifact}</span>
                </div>
              </div>

              {/* Next Step Quick Link */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveStepIndex((prev) => (prev + 1) % PIPELINE_STEPS.length);
                    setIsPlaying(false);
                  }}
                  className="inline-flex items-center gap-2 text-xs font-mono-code text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span>ADVANCE TO NEXT STAGE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Visual Radar / Simulation Stage Display */}
            <div className="lg:col-span-5">
              <div className="relative w-full aspect-square rounded-xl bg-[#020a16] border border-cyan-800/60 p-6 flex flex-col justify-between overflow-hidden shadow-inner">
                {/* Dense Grid */}
                <div className="absolute inset-0 ocean-grid-dense opacity-20 pointer-events-none" />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between text-xs font-mono-code text-cyan-400">
                  <span>TELEMETRY STAGE {currentStep.stepNumber}</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE MODEL
                  </span>
                </div>

                {/* Center Visual Representation depending on active step */}
                <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center p-4">
                  <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-cyan-950/80 border border-cyan-500/50 mb-4 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                    <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping-slow" />
                    {getStepIcon(currentStep.icon, false)}
                  </div>
                  <h4 className="text-lg font-bold text-white font-display mb-1">
                    {currentStep.outputArtifact}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono-code max-w-xs">
                    Continuous feedback loop verified against IMO MARPOL standards.
                  </p>
                </div>

                {/* Bottom Status Feed */}
                <div className="relative z-10 p-3 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] font-mono-code flex items-center justify-between text-slate-300">
                  <span className="text-cyan-300">SYS_STATUS: VALIDATED</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> READY FOR DOSSIER
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
