import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Fish, 
  Waves, 
  Scale, 
  FileWarning, 
  CheckCircle2, 
  ArrowRight,
  TrendingDown,
  Anchor
} from 'lucide-react';

export const EnvironmentalImpactSection: React.FC = () => {
  const [comparisonState, setComparisonState] = useState<'UNMONITORED' | 'OORCA_PROTECTED'>('OORCA_PROTECTED');

  return (
    <section 
      id="environmental-impact"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-12 bg-[#020712] border-b border-cyan-950/80 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 ocean-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-teal-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Section Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono-code mb-4">
            <span>ECOLOGICAL STEWARDSHIP & LEGAL REALITY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-display tracking-tight leading-tight">
            “The Ocean Cannot Speak.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-400 to-sky-400">
              Data Can.”
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed">
            Every year, thousands of metric tons of hydrocarbon sludges are illicitly discharged into global waters under the cloak of night. 
            Without objective, synchronized orbital data, marine ecosystems suffer in silence while responsible polluters sail on without consequence.
          </p>
        </div>

        {/* 6 Real Marine Environmental Problems Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          
          <div className="p-6 rounded-xl bg-slate-900/60 border border-cyan-900/40 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 mb-4">
                <Fish className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Damage to Marine Ecosystems</h3>
              <p className="mt-2 text-sm text-slate-300/80 leading-relaxed">
                Hydrocarbon slicks block atmospheric oxygen dissolution and sunlight penetration, killing plankton blooms and asphyxiating coral reef barrier ecosystems.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono-code text-red-400">
              Phytoplankton & Benthic Devastation
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-cyan-900/40 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4">
                <Waves className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Threats to Coastal Sanctuaries</h3>
              <p className="mt-2 text-sm text-slate-300/80 leading-relaxed">
                Unchecked offshore drift vectors push oily emulsions into intertidal mangroves, marine turtle nesting beaches, and artisanal community fisheries.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono-code text-amber-400">
              Irreversible Coastal Oiling
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-cyan-900/40 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4">
                <TrendingDown className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Long-Term Bioaccumulation</h3>
              <p className="mt-2 text-sm text-slate-300/80 leading-relaxed">
                Polycyclic aromatic hydrocarbons (PAHs) persist in oceanic food chains for decades, concentrating in pelagic apex predators and commercial fish stocks.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono-code text-cyan-400">
              Decadal Trophic Contamination
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-cyan-900/40 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4">
                <Anchor className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Identifying Responsible Polluters</h3>
              <p className="mt-2 text-sm text-slate-300/80 leading-relaxed">
                Offshore violators take advantage of flags of convenience, intentional AIS transponder blackouts, and open ocean expanses to deny culpability.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono-code text-purple-400">
              Flags of Convenience & Dark Ships
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-cyan-900/40 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-4">
                <FileWarning className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Evidentiary Gaps in Prosecution</h3>
              <p className="mt-2 text-sm text-slate-300/80 leading-relaxed">
                Maritime courts dismiss circumstantial claims. Without backward drift physics matching the vessel’s exact coordinate at the timestamp of release, prosecutions fail.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono-code text-rose-400">
              Lack of Court-Admissible Proof
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-cyan-900/40 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400 mb-4">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Financial & Legal Complications</h3>
              <p className="mt-2 text-sm text-slate-300/80 leading-relaxed">
                Coastal sovereign states bear millions in uncompensated clean-up bills while the International Oil Pollution Compensation (IOPC) claims stall without empirical attribution.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono-code text-teal-400">
              Uncompensated Sovereign Burden
            </div>
          </div>

        </div>

        {/* Transition Comparison: Unmonitored Ocean vs OORCA Protected Ocean */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#030d1d] border border-cyan-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono-code text-cyan-400 tracking-wider">
                PARADIGM SHIFT IN MARITIME ENFORCEMENT
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
                The Shift to Evidentiary Marine Accountability
              </h3>
            </div>
            
            {/* Toggle Switch */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono-code">
              <button
                onClick={() => setComparisonState('UNMONITORED')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  comparisonState === 'UNMONITORED'
                    ? 'bg-red-950 text-red-300 border border-red-800 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                UNMONITORED STATUS QUO
              </button>
              <button
                onClick={() => setComparisonState('OORCA_PROTECTED')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  comparisonState === 'OORCA_PROTECTED'
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                OORCA INTELLIGENCE SENTRY
              </button>
            </div>
          </div>

          {comparisonState === 'UNMONITORED' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl bg-red-950/20 border border-red-900/40 text-xs font-mono-code">
              <div className="space-y-2">
                <span className="text-red-400 font-bold text-sm block">DISCHARGE OCCURS IN SECRET</span>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  Tankers pump oily bilge water at night during open-sea transit. Transponders are intentionally shut down. The ocean absorbs the toxic plume with zero alarms sounded.
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-red-400 font-bold text-sm block">WEEKS OF DELAYED DETECTION</span>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  Only when tar balls wash ashore or fishermen spot dead marine life is the spill discovered. By then, the wind and currents have scattered physical samples across hundreds of miles.
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-red-400 font-bold text-sm block">ZERO LEGAL RECOURSE</span>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  Insurance carriers deny responsibility; courts throw out circumstantial claims. The coastal community and marine ecosystems bear 100% of the financial and ecological ruin.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-xs font-mono-code">
              <div className="space-y-2">
                <span className="text-cyan-300 font-bold text-sm block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  INSTANT ORBITAL IDENTIFICATION
                </span>
                <p className="text-slate-200 font-sans text-xs leading-relaxed">
                  Sentinel-1 SAR radar sweeps identify the dampened surface backscatter within 18 minutes. Neural nets confirm mineral oil thickness and compute area.
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-cyan-300 font-bold text-sm block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  REVERSE HYDRODYNAMIC ATTRIBUTION
                </span>
                <p className="text-slate-200 font-sans text-xs leading-relaxed">
                  MetOcean particle drift models trace the slick back to its exact geographic release point and timestamp, correlating historical AIS and dark-ship wake anomalies.
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-cyan-300 font-bold text-sm block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  COURT-READY LIABILITY DOSSIER
                </span>
                <p className="text-slate-200 font-sans text-xs leading-relaxed">
                  Generates cryptographic evidence packages detailing vessel IMO, flag state, calculated volume, ESI sanctuary threat, and IOPC Fund financial restitution claims.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
