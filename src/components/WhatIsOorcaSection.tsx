import React, { useState } from 'react';
import { 
  Satellite, 
  Cpu, 
  Ship, 
  Waves, 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  FileText,
  AlertTriangle
} from 'lucide-react';

export const WhatIsOorcaSection: React.FC = () => {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(0);

  const intelligenceLayers = [
    {
      id: 'layer-satellite',
      name: 'Satellite Monitoring',
      badge: 'LAYER 01',
      icon: Satellite,
      color: 'cyan',
      input: 'SAR C-Band & X-Band Radar Swaths',
      transformation: 'Deep ocean backscatter scans penetrate 100% cloud cover & nighttime darkness to detect surface oil film dampening.',
      output: 'Georeferenced Hydrocarbon Slick Polygon',
      metrics: '350 km swath width • 10m ground resolution',
    },
    {
      id: 'layer-ai',
      name: 'AI Analysis',
      badge: 'LAYER 02',
      icon: Cpu,
      color: 'teal',
      input: 'Raw Synthetic Aperture Radar Tiles',
      transformation: 'Convolutional neural networks reject false-positive lookalikes (algal blooms, low-wind calm zones) to isolate true mineral crude.',
      output: 'Validated Oil Spill Area & Volume Estimate',
      metrics: '98.7% classification precision • 420 bbl volume',
    },
    {
      id: 'layer-vessel',
      name: 'Vessel Tracking',
      badge: 'LAYER 03',
      icon: Ship,
      color: 'blue',
      input: 'Satellite & Terrestrial AIS Constellation',
      transformation: 'Continuous geospatial surveillance of nearby fleets, flagging loitering behavior, velocity changes, and intentional AIS blackouts.',
      output: 'Candidate Vessel Identity & Historical Course',
      metrics: '1,248 active vessels • 4.2h dark gap identified',
    },
    {
      id: 'layer-simulation',
      name: 'Environmental Simulation',
      badge: 'LAYER 04',
      icon: Waves,
      color: 'amber',
      input: 'ECMWF Wind Stress + HYCOM Ocean Currents',
      transformation: 'Lagrangian hydrodynamic models backtrack oil particles through hourly vector fields to isolate exact release point and timestamp.',
      output: 'Forensic Release Origin & Forward Drift Vector',
      metrics: '±45 min temporal precision • 1/12° grid physics',
    },
    {
      id: 'layer-liability',
      name: 'Liability Assessment',
      badge: 'LAYER 05',
      icon: Scale,
      color: 'rose',
      input: 'Attributed Vessel Dossier + ESI Shoreline Indices',
      transformation: 'Quantifies ecological damage to marine sanctuaries, clean-up costs, and legal compensation exposure under IMO MARPOL & IOPC funds.',
      output: 'Court-Admissible Legal & Financial Evidence Dossier',
      metrics: '$14.2M clean-up & restoration valuation',
    },
  ];

  return (
    <section 
      id="what-is-oorca"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-12 bg-[#020712] border-b border-cyan-950/80 overflow-hidden"
    >
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 ocean-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono-code mb-4">
            <span>PLATFORM ARCHITECTURE & PURPOSE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-display tracking-tight leading-tight">
            Turning Ocean Data Into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400">
              Environmental Accountability
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed">
            OORCA is an AI-powered marine environmental intelligence ecosystem that bridges the gap between 
            unseen offshore pollution and verifiable legal accountability. By fusing orbital sensors, physical ocean 
            simulations, and maritime fleet kinematics, OORCA transforms disjointed oceanic signals into irrefutable evidence.
          </p>
        </div>

        {/* 4 Core Pillars: What it is / Problem / Technology / Why Combining Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          
          <div className="p-6 rounded-xl bg-slate-900/60 border border-cyan-900/40 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-cyan-950/90 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 font-mono-code text-sm font-bold">
                01
              </div>
              <h3 className="text-lg font-bold text-white font-display">What OORCA Is</h3>
              <p className="mt-2 text-sm text-slate-300/80 leading-relaxed">
                An enterprise-grade marine geospatial intelligence platform designed for coastguards, environmental ministries, maritime regulators, and international legal authorities.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-cyan-300 font-mono-code">
              Autonomous 24/7 Deep-Ocean Sentry
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-cyan-900/40 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-red-950/90 border border-red-500/40 flex items-center justify-center text-red-400 mb-4 font-mono-code text-sm font-bold">
                02
              </div>
              <h3 className="text-lg font-bold text-white font-display">What Problem It Solves</h3>
              <p className="mt-2 text-sm text-slate-300/80 leading-relaxed">
                Over 80% of marine oil contamination results from intentional nighttime bilge washing. Polluting vessels exploit offshore darkness and lack of continuous tracking to evade prosecution.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-red-400 font-mono-code">
              Eliminating Evidentiary Gaps
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-cyan-900/40 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-950/90 border border-teal-500/40 flex items-center justify-center text-teal-400 mb-4 font-mono-code text-sm font-bold">
                03
              </div>
              <h3 className="text-lg font-bold text-white font-display">How It Uses Technology</h3>
              <p className="mt-2 text-sm text-slate-300/80 leading-relaxed">
                Combines high-resolution radar satellites with AI vision classifiers, multi-source AIS fleet tracking, and reverse hydrodynamic drift physics models to reconstruct pollution events.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-teal-300 font-mono-code">
              AI + Hydrodynamic Physics Fusion
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-cyan-900/40 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-950/90 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 font-mono-code text-sm font-bold">
                04
              </div>
              <h3 className="text-lg font-bold text-white font-display">Why Fusion Matters</h3>
              <p className="mt-2 text-sm text-slate-300/80 leading-relaxed">
                A satellite image alone shows only a slick; an AIS trace alone shows only a ship. Only by synthesizing both through MetOcean ocean drift can legal liability and responsibility be proven.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-amber-300 font-mono-code">
              From Detection to Legal Proof
            </div>
          </div>

        </div>

        {/* Visually Connected Flow Diagram: The 5-Layer Intelligence Pipeline */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#030d1d] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono-code text-cyan-400 tracking-wider">
                INTEGRATED INTELLIGENCE PIPELINE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
                The 5-Layer Data Transformation Flow
              </h3>
            </div>
            <div className="text-xs text-slate-400 font-mono-code">
              Click any stage below to inspect data inputs & evidentiary outputs
            </div>
          </div>

          {/* Interactive Flow Sequence Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative mb-8">
            {intelligenceLayers.map((layer, index) => {
              const Icon = layer.icon;
              const isSelected = selectedLayerIndex === index;
              return (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayerIndex(index)}
                  className={`relative text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900/60 border-cyan-900/40 hover:border-cyan-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-cyan-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono-code text-slate-400">
                      {layer.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-display mb-1">{layer.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {layer.output}
                  </p>

                  {/* Flow Arrow (Hidden on last item) */}
                  {index < intelligenceLayers.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-5 h-5 rounded-full bg-slate-900 border border-cyan-800/80 flex items-center justify-center text-cyan-400 text-xs">
                      →
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Expanded Selected Layer Inspection Console */}
          {intelligenceLayers[selectedLayerIndex] && (
            <div className="p-6 rounded-xl bg-slate-950/90 border border-cyan-800/40">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4">
                  <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 mb-1">
                    <span>STAGE DETAILS</span>
                    <span>•</span>
                    <span>{intelligenceLayers[selectedLayerIndex].badge}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white font-display">
                    {intelligenceLayers[selectedLayerIndex].name}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono-code mt-1">
                    {intelligenceLayers[selectedLayerIndex].metrics}
                  </p>
                </div>

                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-code">
                  <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block mb-1 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      RAW DATA INGESTION:
                    </span>
                    <span className="text-cyan-200 font-semibold">
                      {intelligenceLayers[selectedLayerIndex].input}
                    </span>
                    <p className="text-slate-400 mt-2 text-[11px] font-sans">
                      {intelligenceLayers[selectedLayerIndex].transformation}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block mb-1 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      ACTIONABLE FORENSIC OUTPUT:
                    </span>
                    <span className="text-emerald-300 font-semibold">
                      {intelligenceLayers[selectedLayerIndex].output}
                    </span>
                    <div className="mt-3 flex items-center gap-1.5 text-[10px] text-cyan-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Integrated into unified liability dossier
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
