import React, { useState, useEffect } from 'react';
import { 
  Radar, 
  Satellite, 
  Waves, 
  Compass, 
  ShieldAlert, 
  ArrowRight, 
  ChevronDown,
  Activity,
  Maximize2
} from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onPipelineClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onPipelineClick,
}) => {
  const [activeTelemetry, setActiveTelemetry] = useState({
    sarScan: 'PASS_142_ORBITAL_SYNCHRONIZED',
    confidence: '96.4%',
    vesselsTracked: '1,248',
    currentWind: '18.2 kts NE',
    wavePeriod: '6.4s / 1.8m',
    lat: '23° 24\' 36" N',
    lng: '59° 49\' 12" E',
  });

  const [activeMode, setActiveMode] = useState<'RADAR' | 'SAR' | 'METOCEAN'>('RADAR');

  useEffect(() => {
    const interval = setInterval(() => {
      const randomWind = (17 + Math.random() * 2).toFixed(1);
      setActiveTelemetry((prev) => ({
        ...prev,
        currentWind: `${randomWind} kts NE`,
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="hero-section"
      className="relative min-h-screen w-full bg-[#020712] overflow-hidden flex flex-col justify-between pt-10 pb-16 px-4 sm:px-6 lg:px-12 border-b border-cyan-900/30"
    >
      {/* Background Ocean Grids & Atmospheric Glow */}
      <div className="absolute inset-0 ocean-grid opacity-35 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(6,182,212,0.18),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_80%,rgba(14,116,144,0.12),transparent)] pointer-events-none" />

      {/* Top Telemetry Header (Clean Branding Status without Navigation Bar) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-cyan-900/40">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Radar className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-wider text-white font-display">OORCA</span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-mono-code tracking-widest text-cyan-300 bg-cyan-950/90 border border-cyan-700/50 rounded">
                COMMAND VER 4.2
              </span>
            </div>
            <p className="text-xs text-cyan-200/60 font-mono-code">
              Marine Environmental Intelligence & Liability Engine
            </p>
          </div>
        </div>

        {/* Global Sensor Readout Chips */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono-code">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900/80 border border-cyan-800/40 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SENTINEL-1C: ACQUISITION LIVE</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900/80 border border-cyan-800/40 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>HYCOM DRIFT: SYNCED</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900/80 border border-cyan-800/40 text-amber-400">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>7 ACTIVE SLICK ALERTS</span>
          </div>
        </div>
      </div>

      {/* Main Hero Content & Command Visual Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Headlines, Description & Core Calls to Action */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono-code tracking-wide w-fit shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>AI-POWERED GEOSPATIAL INTELLIGENCE PLATFORM</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-white font-display tracking-tight leading-[1.12]">
            Intelligence Beneath the Surface.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400">
              Accountability Above It.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed font-normal">
            OORCA transforms satellite radar, AIS vessel kinematics, and hydrodynamic ocean models into 
            forensic accountability. We autonomously detect marine oil spills, track responsible vessels 
            through intentional blackouts, simulate spill trajectory, and calculate international environmental liability.
          </p>

          {/* Key Intelligence Capabilities Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-cyan-900/50 flex flex-col">
              <span className="text-[11px] font-mono-code text-cyan-400 flex items-center gap-1">
                <Radar className="w-3 h-3" /> AI SATELLITE SAR
              </span>
              <span className="text-xs text-slate-200 font-medium mt-0.5">Slick Detection</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-cyan-900/50 flex flex-col">
              <span className="text-[11px] font-mono-code text-cyan-400 flex items-center gap-1">
                <Compass className="w-3 h-3" /> AIS CORRELATION
              </span>
              <span className="text-xs text-slate-200 font-medium mt-0.5">Vessel Attribution</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-cyan-900/50 flex flex-col">
              <span className="text-[11px] font-mono-code text-cyan-400 flex items-center gap-1">
                <Waves className="w-3 h-3" /> METOCEAN DRIFT
              </span>
              <span className="text-xs text-slate-200 font-medium mt-0.5">Hydrodynamic Model</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button
              id="hero-explore-cta"
              onClick={onExploreClick}
              className="group relative inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all duration-300 cursor-pointer overflow-hidden border border-cyan-300/30"
            >
              <span className="relative z-10 flex items-center gap-2 font-display tracking-wide">
                Explore Platform Capabilities
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              id="hero-pipeline-cta"
              onClick={onPipelineClick}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 text-cyan-200 font-semibold text-sm border border-cyan-500/40 hover:border-cyan-400 transition-all duration-200 cursor-pointer font-display tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.1)]"
            >
              <Compass className="w-4 h-4 mr-2 text-cyan-400" />
              View Forensic Pipeline
            </button>
          </div>

          {/* Verification Badge */}
          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono-code pt-1">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              IOPC Fund & MARPOL Compliant
            </span>
            <span className="text-slate-600">•</span>
            <span>Global Coverage 24/7</span>
          </div>
        </div>

        {/* Right Column: High-Tech Immersive Marine Command Simulation Canvas */}
        <div className="lg:col-span-6 relative">
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-[#030d1d] border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.18)] flex flex-col">
            
            {/* Command Frame Header */}
            <div className="h-10 px-4 bg-slate-950/90 border-b border-cyan-800/50 flex items-center justify-between text-xs font-mono-code text-cyan-300 z-20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-white font-semibold tracking-wider">RADAR SENSOR FEED [ARABIAN SEA]</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveMode('RADAR')}
                  className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${activeMode === 'RADAR' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  RADAR
                </button>
                <button 
                  onClick={() => setActiveMode('SAR')}
                  className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${activeMode === 'SAR' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  SAR
                </button>
                <button 
                  onClick={() => setActiveMode('METOCEAN')}
                  className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${activeMode === 'METOCEAN' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  DRIFT
                </button>
              </div>
            </div>

            {/* Visual Radar / Satellite Map Container */}
            <div className="relative flex-1 bg-[#020b18] overflow-hidden">
              {/* Dense Ocean Coordinate Grid */}
              <div className="absolute inset-0 ocean-grid-dense opacity-40" />

              {/* Bathymetric Depth Wave Contours (SVG) */}
              <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-50,80 Q200,40 450,110 T950,90" fill="none" stroke="#0891b2" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M-50,160 Q220,130 500,200 T1000,170" fill="none" stroke="#0e7490" strokeWidth="1.2" />
                <path d="M-50,260 Q180,240 440,290 T980,250" fill="none" stroke="#0891b2" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M-50,340 Q300,310 600,370 T1050,330" fill="none" stroke="#155e75" strokeWidth="1.5" />
              </svg>

              {/* Circular Radar Scan Screen Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-[340px] sm:w-[420px] h-[340px] sm:h-[420px] rounded-full border border-cyan-500/25">
                  <div className="absolute inset-[15%] rounded-full border border-cyan-500/20" />
                  <div className="absolute inset-[32%] rounded-full border border-cyan-500/20" />
                  <div className="absolute inset-[50%] rounded-full border border-cyan-500/25" />
                  <div className="absolute inset-[70%] rounded-full border border-cyan-500/25" />
                  
                  {/* Axis Crosshairs */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-cyan-500/20" />
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan-500/20" />
                  
                  {/* Sweeping Radar Beam */}
                  <div 
                    className="absolute inset-0 rounded-full animate-radar origin-center pointer-events-none"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent 0deg, transparent 310deg, rgba(6, 182, 212, 0.1) 330deg, rgba(34, 211, 238, 0.45) 360deg)',
                    }}
                  />
                </div>
              </div>

              {/* Satellite Laser Scanner Line */}
              <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-satellite-scan pointer-events-none z-10" />

              {/* Simulated Oil Spill Slick Zone (Iridescent Hydrocarbon Contour) */}
              <div className="absolute top-[38%] left-[42%] w-36 h-28 pointer-events-auto group cursor-pointer">
                {/* Expanding Diffusion Rings */}
                <div className="absolute inset-0 rounded-full bg-cyan-500/10 border border-cyan-400/40 animate-ping-slow" />
                
                {/* Iridescent Hydrocarbon Shape */}
                <svg className="w-full h-full filter drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" viewBox="0 0 140 110">
                  <defs>
                    <linearGradient id="slickGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0f172a" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#881337" stopOpacity="0.75" />
                      <stop offset="85%" stopColor="#0284c7" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#e11d48" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M 20,45 Q 35,15 65,22 Q 105,30 115,55 Q 125,85 85,95 Q 45,102 25,80 Z" 
                    fill="url(#slickGrad)" 
                    stroke="#f43f5e" 
                    strokeWidth="1.5" 
                    strokeDasharray="2 2"
                  />
                  {/* High Thickness Core */}
                  <circle cx="68" cy="54" r="14" fill="#991b1b" opacity="0.85" />
                  <circle cx="68" cy="54" r="7" fill="#dc2626" />
                </svg>

                {/* Slick Data Callout Tag */}
                <div className="absolute -top-7 -left-12 px-2 py-0.5 rounded bg-red-950/90 border border-red-500/70 text-[10px] font-mono-code text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.3)] whitespace-nowrap flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span>SLICK: 420 BBL • SAR CONF 96.4%</span>
                </div>

                {/* Drift Vector Arrow */}
                <div className="absolute top-[50%] left-[80%] flex items-center gap-1 text-[10px] font-mono-code text-cyan-300">
                  <div className="w-12 h-[1px] bg-cyan-400" />
                  <span className="text-[9px]">065° NE (1.4 kt)</span>
                </div>
              </div>

              {/* Suspect Vessel: MT AURA PACIFIC */}
              <div className="absolute top-[28%] left-[58%] pointer-events-auto group">
                <div className="relative flex items-center justify-center w-5 h-5 cursor-pointer">
                  <span className="absolute w-6 h-6 rounded-full bg-amber-500/20 animate-ping" />
                  <div className="w-3 h-3 bg-amber-400 rotate-45 border border-white shadow-[0_0_8px_#f59e0b]" />
                </div>
                
                {/* AIS Trail (Historical Track) */}
                <svg className="absolute -top-12 -left-28 w-36 h-20 pointer-events-none" viewBox="0 0 144 80">
                  <path 
                    d="M 5,75 Q 40,55 80,45 T 116,28" 
                    fill="none" 
                    stroke="#f59e0b" 
                    strokeWidth="1.5" 
                    strokeDasharray="3 3"
                    opacity="0.8"
                  />
                </svg>

                {/* Vessel Label */}
                <div className="absolute top-5 -left-16 px-2 py-1 rounded bg-slate-900/90 border border-amber-500/60 text-[10px] font-mono-code text-amber-200 whitespace-nowrap shadow-lg">
                  <div className="font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    MT AURA PACIFIC [PANAMA]
                  </div>
                  <div className="text-[9px] text-slate-400">IMO 9482110 • SPEED: 3.4 KTS</div>
                  <div className="text-[9px] text-red-400 font-bold">SUSPICIOUS AIS GAP: 4.2H</div>
                </div>
              </div>

              {/* Other Active Vessel 1 */}
              <div className="absolute top-[68%] left-[24%]">
                <div className="w-2.5 h-2.5 bg-cyan-400 rotate-45 shadow-[0_0_6px_#22d3ee]" />
                <div className="absolute top-3 -left-8 px-1.5 py-0.5 rounded bg-slate-900/80 border border-cyan-800/40 text-[9px] font-mono-code text-slate-300 whitespace-nowrap">
                  MV NORDIC TRADER (18.2 KT)
                </div>
              </div>

              {/* Other Active Vessel 2 */}
              <div className="absolute top-[18%] left-[22%]">
                <div className="w-2.5 h-2.5 bg-cyan-400 rotate-45 shadow-[0_0_6px_#22d3ee]" />
                <div className="absolute top-3 -left-8 px-1.5 py-0.5 rounded bg-slate-900/80 border border-cyan-800/40 text-[9px] font-mono-code text-slate-300 whitespace-nowrap">
                  MT OCEAN HARVEST (8.6 KT)
                </div>
              </div>

              {/* Marine Protected Sanctuary Overlay Marker */}
              <div className="absolute bottom-6 right-6 p-2 rounded-lg bg-teal-950/80 border border-teal-500/50 text-[10px] font-mono-code text-teal-300 max-w-[200px]">
                <div className="flex items-center gap-1 font-bold text-teal-200">
                  <Waves className="w-3 h-3 text-teal-400" />
                  MPA SANCTUARY ZONE
                </div>
                <div className="text-[9px] text-teal-300/80 mt-0.5">
                  Ras Al Hadd Sea Turtle Reserve
                </div>
                <div className="text-[9px] text-amber-300 font-semibold mt-1">
                  DRIFT INTERCEPTION ETA: 28.5H
                </div>
              </div>

              {/* Bottom Telemetry Floating Strip */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950/85 border border-cyan-900/60 text-[10px] font-mono-code text-cyan-200">
                <div className="flex items-center gap-3">
                  <span>LAT: {activeTelemetry.lat}</span>
                  <span className="hidden sm:inline">LON: {activeTelemetry.lng}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cyan-400">WIND: {activeTelemetry.currentWind}</span>
                  <span className="hidden sm:inline text-teal-400">WAVE: {activeTelemetry.wavePeriod}</span>
                  <span className="text-red-400 font-bold">SLICK ID: #AR-09</span>
                </div>
              </div>
            </div>

            {/* Live Command Footer Bar */}
            <div className="p-2.5 bg-slate-950/95 border-t border-cyan-900/50 flex items-center justify-between text-xs font-mono-code">
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <Satellite className="w-3.5 h-3.5 text-cyan-400" />
                <span>SENTINEL-1C C-SAR BAND • SUB-METER RESOLUTION</span>
              </div>
              <div className="flex items-center gap-1 text-cyan-300 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>ATTRIBUTION SCORE: 91.8%</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Scroll Indicator */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between pt-4 border-t border-cyan-900/30 text-xs font-mono-code text-slate-400">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400">01 / INTELLIGENCE OVERVIEW</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">TURNING OCEAN DATA INTO ACCOUNTABILITY</span>
        </div>
        <button 
          onClick={onExploreClick}
          className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <span>CONTINUE TO ECOSYSTEM</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>

    </section>
  );
};
