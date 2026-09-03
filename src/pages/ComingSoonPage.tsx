import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Radar, 
  ArrowLeft, 
  Cpu, 
  Database, 
  AlertTriangle, 
  Code2, 
  Terminal, 
  Radio, 
  Layers,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface ComingSoonPageProps {
  pageType: 'simulation' | 'data' | 'alerts' | 'dev';
}

interface PageMeta {
  title: string;
  tag: string;
  subtitle: string;
  codeName: string;
  description: string;
  modules: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const PAGE_METAS: Record<ComingSoonPageProps['pageType'], PageMeta> = {
  simulation: {
    title: 'Simulation',
    tag: 'TACTICAL HYDRODYNAMIC SIMULATION ENGINE',
    subtitle: 'Lagrangian Reverse-Current & Forward Oil Spill Trajectory Modeling',
    codeName: 'OORCA-SIM-CORPUS-V4',
    description: 'High-resolution ocean current particle trajectory engine computing 72-hour backward-in-time drift attribution and forward-impact dispersion against coastal marine sanctuaries.',
    modules: [
      'HYCOM & ECMWF Oceanic Current Field Integration',
      'Stochastic 100,000-Particle Lagrangian Dispersion',
      'Bathymetric Shoreline Entrainment Modeling',
      'Dynamic Vessel Wake Kelvin Envelope Intersect'
    ],
    icon: Radar,
  },
  data: {
    title: 'Data Dashboard',
    tag: 'ORBITAL METOCEAN & VESSEL TELEMETRY HUB',
    subtitle: 'Synchronized Multi-Sensor Orbital Data & AIS Telemetry Analytics',
    codeName: 'OORCA-DATA-GRID-X1',
    description: 'Unified geospatial data streaming pipeline assimilating real-time Sentinel-1 SAR imagery, global S-AIS/T-AIS vessel transponder streams, and NOAA MetOcean oceanic buoy sensor matrices.',
    modules: [
      'Real-Time Copernicus Sentinel-1A/B Ingestion Pipeline',
      'Global AIS Vessel Density & Blackout Anomaly Layer',
      'Wind Scatterometer & Wave Buoy Real-Time Mesh',
      'Environmental Sensitivity Index (ESI) Vector GIS'
    ],
    icon: Database,
  },
  alerts: {
    title: 'Alert Center',
    tag: 'GLOBAL MARITIME ESCALATION & INCIDENT TRIAGE',
    subtitle: 'Autonomous Risk Detection, Vessel Flagging & Legal Notification Feeds',
    codeName: 'OORCA-ALERTS-DISPATCH-9',
    description: 'Multi-criteria alert routing terminal triggering instantaneous automated escalations upon detection of synthetic radar backscatter dampening, nighttime AIS deactivations, and high-threat marine sanctuary drift vectors.',
    modules: [
      'Multi-Threshold SAR Slick Anomaly Flagging',
      'Dark Ship Transponder Deactivation Traps',
      'Direct Coastal Guard & Port State Dispatch Protocol',
      'Automated Forensic Snapshot Archiving'
    ],
    icon: AlertTriangle,
  },
  dev: {
    title: 'Developer Information',
    tag: 'DEVELOPER SPECIFICATIONS & API PROTOCOLS',
    subtitle: 'REST / GraphQL APIs, Webhooks & Cryptographic Evidence SDK',
    codeName: 'OORCA-DEV-SDK-REST-V2',
    description: 'Comprehensive technical documentation, cryptographic hash verification tools, and open standard APIs for coastal sovereign states, maritime legal authorities, and environmental defense organizations.',
    modules: [
      'Evidence Dossier SHA-256 Cryptographic Verification',
      'RESTful Satellite Anomaly Telemetry Endpoints',
      'Automated IOPC Fund Valuation Calculation API',
      'Custom Webhook Integrations for Coastal Sentry Drones'
    ],
    icon: Code2,
  },
};

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ pageType }) => {
  const navigate = useNavigate();
  const meta = PAGE_METAS[pageType];
  const IconComponent = meta.icon;

  return (
    <div className="relative min-h-screen w-full bg-[#020712] text-slate-100 flex flex-col items-center justify-between p-6 sm:p-12 overflow-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background Futuristic Ocean Grid & Glow */}
      <div className="absolute inset-0 ocean-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Navigation & Status */}
      <div className="relative z-10 w-full max-w-6xl flex items-center justify-between border-b border-cyan-950/80 pb-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-mono-code transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO OVERVIEW</span>
        </button>

        <div className="flex items-center gap-3 text-xs font-mono-code">
          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            MODULE TELEMETRY ACTIVE
          </span>
          <span className="text-slate-400">BUILD {meta.codeName}</span>
        </div>
      </div>

      {/* Main Center Console */}
      <div className="relative z-10 my-auto py-12 max-w-4xl w-full text-center flex flex-col items-center">
        
        {/* Module Icon in Glowing Command Ring */}
        <div className="relative mb-8 group">
          <div className="absolute -inset-4 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-900 to-[#030d1d] border-2 border-cyan-400/60 shadow-[0_0_30px_rgba(0,255,255,0.3)] flex items-center justify-center text-cyan-400">
            <IconComponent className="w-12 h-12" />
          </div>
        </div>

        {/* Tactical Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono-code mb-4">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{meta.tag}</span>
        </div>

        {/* Page Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white font-display tracking-tight leading-tight mb-4">
          {meta.title}
        </h1>

        {/* Prominent Coming Soon Banner */}
        <div className="my-3 inline-block">
          <div className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 border border-cyan-400/80 shadow-[0_0_25px_rgba(0,255,255,0.35)]">
            <span className="text-xl sm:text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-teal-200 font-display uppercase">
              Coming Soon
            </span>
          </div>
        </div>

        <p className="mt-4 text-base sm:text-lg text-cyan-200/90 font-mono-code max-w-2xl">
          {meta.subtitle}
        </p>

        <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-normal">
          {meta.description}
        </p>

        {/* Pipeline Specifications Grid */}
        <div className="w-full mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {meta.modules.map((mod, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-slate-900/70 border border-cyan-950/80 hover:border-cyan-500/40 transition-colors flex items-start gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <div>
                <span className="text-xs font-mono-code text-cyan-400 block mb-0.5">
                  SUBSYSTEM 0{idx + 1}
                </span>
                <span className="text-xs sm:text-sm text-slate-200 font-mono-code">
                  {mod}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Module Switcher Tabs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          {[
            { id: 'simulation', label: 'Simulation', path: '/simulation' },
            { id: 'data', label: 'Data Dashboard', path: '/data' },
            { id: 'alerts', label: 'Alert Center', path: '/alerts' },
            { id: 'dev', label: 'Developer Info', path: '/dev' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`px-4 py-2 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
                pageType === tab.id
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,255,255,0.5)]'
                  : 'text-cyan-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status indicator info strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono-code text-slate-400 border-t border-cyan-950/80 pt-6 w-full">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>DEPLOYMENT STAGE: CALIBRATION & INTEGRATION</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>ORBITAL NAV: DRAG & CLICK THE FLOATING RADAR WHEEL</span>
          </div>
        </div>

      </div>

      {/* Footer System Line */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-slate-500 border-t border-cyan-950/80 pt-6">
        <div>
          OORCA PROTOCOL TERMINAL • SECURE MARINE ENCLAVE
        </div>
        <div>
          AUTONOMOUS SENSOR REFRESH: 18 SEC
        </div>
      </div>
    </div>
  );
};
