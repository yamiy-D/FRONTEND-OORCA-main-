import React, { useState } from 'react';
import { 
  Radar, 
  Ship, 
  Waves, 
  ShieldAlert, 
  Scale, 
  Globe, 
  ArrowUpRight, 
  Activity, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { CORE_CAPABILITIES } from '../data/mockData';
import { IntelligenceCapability } from '../types';

export const CoreCapabilitiesSection: React.FC = () => {
  const [activeCapability, setActiveCapability] = useState<IntelligenceCapability | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radar':
        return <Radar className="w-5 h-5" />;
      case 'Ship':
        return <Ship className="w-5 h-5" />;
      case 'Waves':
        return <Waves className="w-5 h-5" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5" />;
      case 'Scale':
        return <Scale className="w-5 h-5" />;
      case 'Globe':
        return <Globe className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <section 
      id="core-capabilities"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-12 bg-[#020712] border-b border-cyan-950/80 overflow-hidden"
    >
      {/* Background Grids */}
      <div className="absolute inset-0 ocean-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono-code mb-4">
              <span>SYSTEM ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-display tracking-tight leading-tight">
              Core Intelligence Capabilities
            </h2>
            <p className="mt-3 text-slate-300 max-w-2xl text-base sm:text-lg">
              Six dedicated intelligence engines engineered to detect marine pollution, uncover hidden vessel identities, model ocean physics, and quantify environmental liability.
            </p>
          </div>
          <div className="text-xs font-mono-code text-cyan-400/80 bg-slate-900/80 px-4 py-2 rounded-lg border border-cyan-800/40 w-fit">
            ALL 6 ENGINES SYNCHRONIZED & OPERATIONAL
          </div>
        </div>

        {/* 6 Capabilities Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_CAPABILITIES.map((cap) => (
            <div
              key={cap.id}
              className="group relative p-7 rounded-2xl bg-[#030d1d] border border-cyan-900/40 hover:border-cyan-400/80 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:-translate-y-1"
            >
              {/* Subtle Card Grid Overlay */}
              <div className="absolute inset-0 ocean-grid-dense opacity-10 rounded-2xl pointer-events-none" />

              <div>
                {/* Header Icon and Tag */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-colors duration-300 shadow-md">
                    {getIcon(cap.iconName)}
                  </div>
                  <span className="text-[10px] uppercase font-mono-code text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
                    {cap.tagline.split(' ')[0]} ENGINE
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-xl font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                  {cap.title}
                </h3>
                <p className="text-xs text-cyan-400/70 font-mono-code mt-0.5 mb-3">
                  {cap.tagline}
                </p>

                {/* Description */}
                <p className="text-sm text-slate-300/85 leading-relaxed mb-6 font-normal">
                  {cap.description}
                </p>
              </div>

              {/* Card Bottom: Scientific Metric Badges */}
              <div>
                <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-lg bg-slate-950/70 border border-cyan-950/80">
                  {cap.metrics.slice(0, 2).map((metric, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-mono-code uppercase">
                        {metric.label}
                      </span>
                      <span className="text-xs font-bold text-cyan-200 font-mono-code mt-0.5">
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Data Flow Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cap.dataFlow.map((flow, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-slate-900/80 text-slate-300 border border-slate-800"
                    >
                      {flow}
                    </span>
                  ))}
                </div>

                {/* Interactive Modal Trigger */}
                <button
                  onClick={() => setActiveCapability(cap)}
                  className="w-full mt-4 pt-3 border-t border-cyan-900/30 flex items-center justify-between text-xs font-mono-code text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span>INSPECT SPECIFICATIONS</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for In-Depth Capability Inspection */}
        {activeCapability && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl rounded-2xl bg-[#030d1d] border border-cyan-500/60 p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
              
              {/* Close Button */}
              <button 
                onClick={() => setActiveCapability(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white text-xs font-mono-code px-2 py-1 rounded bg-slate-900 border border-slate-700 cursor-pointer"
              >
                ESC [✕]
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500 text-black flex items-center justify-center font-bold">
                  {getIcon(activeCapability.iconName)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-display">
                    {activeCapability.title}
                  </h3>
                  <p className="text-xs text-cyan-400 font-mono-code">
                    {activeCapability.tagline}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed mb-6">
                {activeCapability.description}
              </p>

              <div className="mb-6">
                <span className="text-xs font-mono-code text-cyan-400 block mb-2 uppercase">
                  Telemetry Benchmarks & Verification:
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {activeCapability.metrics.map((m, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-950 border border-cyan-900/50">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono-code">
                        {m.label}
                      </span>
                      <span className="text-sm font-bold text-cyan-300 font-mono-code mt-1 block">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-mono-code text-cyan-400 block mb-2 uppercase">
                  Connected Data Ingestion Pipelines:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeCapability.dataFlow.map((f, i) => (
                    <div key={i} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-800 text-xs font-mono-code text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-cyan-900/40 flex justify-end">
                <button
                  onClick={() => setActiveCapability(null)}
                  className="px-5 py-2 rounded-lg bg-cyan-500 text-black font-semibold text-xs font-mono-code hover:bg-cyan-400 transition-colors cursor-pointer"
                >
                  CLOSE INSPECTION
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
