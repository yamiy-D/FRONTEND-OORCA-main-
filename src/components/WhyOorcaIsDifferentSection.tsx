import React from 'react';
import { 
  Check, 
  X, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Sparkles,
  Target
} from 'lucide-react';

export const WhyOorcaIsDifferentSection: React.FC = () => {
  const comparisonData = [
    {
      feature: 'Satellite SAR Surface Slick Detection',
      traditional: 'Isolated Imagery (Cloud delays, manual photo-interpreter reviews take days)',
      oorca: 'Autonomous AI Ingestion (Sentinel-1 & COSMO-SkyMed analyzed within 18 minutes)',
    },
    {
      feature: 'Dark Ship & AIS Blackout Handling',
      traditional: 'Blind Spot (Vessels disappear completely once transponder is switched off)',
      oorca: 'Kinematic Gap Interpolation & SAR Kelvin Wake Analysis',
    },
    {
      feature: 'Ocean Drift & Spill Origin Pinpointing',
      traditional: 'Generic Weather Maps (Static wind vectors without tidal current back-propagation)',
      oorca: 'Lagrangian Hydrodynamic Reverse Simulation (±45 min release window accuracy)',
    },
    {
      feature: 'Legal & Financial Liability Assessment',
      traditional: 'None (Requires separate multi-year external forensic consulting)',
      oorca: 'Automated IOPC Funds & MARPOL Annex I Court-Admissible Dossier Generation',
    },
    {
      feature: 'Unified Intelligence Synthesis',
      traditional: 'Fragmented Silos (3-5 separate disconnected vendor platforms)',
      oorca: 'Single Continuous Ecosystem: Detect → Track → Simulate → Attribute → Assess',
    },
  ];

  const processFlow = [
    { title: 'Detect', desc: 'SAR Radar Anomaly' },
    { title: 'Investigate', desc: 'AI Neural Classifier' },
    { title: 'Track', desc: 'AIS & Dark Ship' },
    { title: 'Simulate', desc: 'MetOcean Currents' },
    { title: 'Attribute', desc: 'Vessel Correlation' },
    { title: 'Assess', desc: 'Liability Dossier' },
  ];

  return (
    <section 
      id="why-oorca-is-different"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-12 bg-[#020712] border-b border-cyan-950/80 overflow-hidden"
    >
      {/* Background Grids */}
      <div className="absolute inset-0 ocean-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono-code mb-4">
            <span>THE ARCHITECTURAL ADVANTAGE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-display tracking-tight leading-tight">
            “From Detection to Accountability —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400">
              In One Intelligence Ecosystem.”
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed">
            Legacy maritime surveillance systems offer fragmented glimpses: an isolated satellite photo here, an AIS transponder 
            map there. OORCA unifies the entire analytical chain into a continuous, automated evidentiary pipeline.
          </p>
        </div>

        {/* Process Flow Ribbon: Detect → Investigate → Track → Simulate → Attribute → Assess */}
        <div className="mb-16 p-6 sm:p-8 rounded-2xl bg-[#030d1d] border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.12)]">
          <div className="text-xs font-mono-code text-cyan-400 text-center mb-6 uppercase tracking-wider">
            THE UNIFIED OORCA INTELLIGENCE LIFECYCLE
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative">
            {processFlow.map((step, idx) => (
              <div 
                key={idx}
                className="relative p-4 rounded-xl bg-slate-900/80 border border-cyan-900/60 flex flex-col justify-between group hover:border-cyan-400 transition-colors"
              >
                <div>
                  <div className="text-[10px] font-mono-code text-cyan-400 mb-1">
                    PHASE 0{idx + 1}
                  </div>
                  <div className="text-base font-bold text-white font-display">
                    {step.title}
                  </div>
                  <div className="text-xs text-slate-400 font-mono-code mt-0.5">
                    {step.desc}
                  </div>
                </div>

                {/* Arrow to next item */}
                {idx < processFlow.length - 1 && (
                  <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 text-cyan-400 text-xs">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Matrix: Isolated Legacy Silos vs OORCA Unified Ecosystem */}
        <div className="rounded-2xl bg-[#030d1d] border border-cyan-500/30 overflow-hidden shadow-2xl">
          
          <div className="p-6 bg-slate-950/90 border-b border-cyan-800/40 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-4 text-xs font-mono-code text-cyan-400 uppercase tracking-wider">
              CAPABILITY COMPARISON
            </div>
            <div className="md:col-span-4 text-xs font-mono-code text-slate-400 uppercase">
              LEGACY DISCONNECTED SILOS
            </div>
            <div className="md:col-span-4 text-xs font-mono-code text-cyan-300 font-bold uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              OORCA UNIFIED ECOSYSTEM
            </div>
          </div>

          <div className="divide-y divide-cyan-900/30">
            {comparisonData.map((row, idx) => (
              <div 
                key={idx} 
                className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-slate-900/40 transition-colors"
              >
                <div className="md:col-span-4">
                  <span className="text-sm font-bold text-white font-display">
                    {row.feature}
                  </span>
                </div>
                <div className="md:col-span-4 flex items-start gap-2.5">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-400 leading-relaxed font-mono-code">
                    {row.traditional}
                  </span>
                </div>
                <div className="md:col-span-4 flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-cyan-100 font-medium leading-relaxed font-mono-code">
                    {row.oorca}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
