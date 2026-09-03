import React from 'react';
import { Radar, Shield, Satellite, Globe, FileText, CheckCircle2 } from 'lucide-react';

export const FooterSection: React.FC = () => {
  return (
    <footer className="relative w-full bg-[#01040a] text-slate-400 py-16 px-4 sm:px-6 lg:px-12 border-t border-cyan-950">
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-cyan-950">
          
          {/* Brand & Mission Statement Column */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <Radar className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-wider text-white font-display">
                OORCA
              </span>
            </div>

            <p className="text-sm font-semibold text-cyan-200/90 font-mono-code">
              AI-Powered Marine Environmental Intelligence Platform
            </p>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Using intelligence, data, and technology to transform marine environmental monitoring into accountability.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono-code text-cyan-400/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>GLOBAL ORBITAL TELEMETRY OPERATIONAL • ZERO DOWNTIME</span>
            </div>
          </div>

          {/* Section Direct Anchors (Non-navigation informational references) */}
          <div className="md:col-span-3 space-y-3 text-xs font-mono-code">
            <div className="text-white font-bold uppercase tracking-wider mb-2">
              Intelligence Layers
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#what-is-oorca" className="hover:text-cyan-300 transition-colors">
                  Overview & Pipeline Flow
                </a>
              </li>
              <li>
                <a href="#core-capabilities" className="hover:text-cyan-300 transition-colors">
                  Core AI Capabilities
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-cyan-300 transition-colors">
                  6-Step Forensic Pipeline
                </a>
              </li>
              <li>
                <a href="#environmental-impact" className="hover:text-cyan-300 transition-colors">
                  Ecological Impact Analysis
                </a>
              </li>
              <li>
                <a href="#technology-behind" className="hover:text-cyan-300 transition-colors">
                  Sensor & Model Architecture
                </a>
              </li>
            </ul>
          </div>

          {/* Regulatory Compliance & Frameworks */}
          <div className="md:col-span-3 space-y-3 text-xs font-mono-code">
            <div className="text-white font-bold uppercase tracking-wider mb-2">
              Forensic Frameworks
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>IMO MARPOL Annex I Protocols</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>IOPC Funds Legal Evidence Standards</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copernicus Sentinel SAR Integration</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>NOAA & ECMWF MetOcean Assimilation</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>UNCLOS Article 194 Maritime Law</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Mission Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-slate-500">
          <div>
            © {new Date().getFullYear()} OORCA Maritime Environmental Intelligence. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Cryptographically Signed Evidence Dossiers</span>
            <span>•</span>
            <span>WGS 84 Dynamic Datum</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
