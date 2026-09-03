import React, { useState } from 'react';
import { 
  Satellite, 
  Cpu, 
  Ship, 
  Waves, 
  MapPin, 
  Scale, 
  Share2, 
  Layers, 
  Check, 
  Activity,
  ArrowRight
} from 'lucide-react';
import { TECHNOLOGY_NODES } from '../data/mockData';
import { TechnologyNode } from '../types';

export const TechnologyBehindSection: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string>('ai-engine');

  const getNodeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Satellite':
        return <Satellite className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'Ship':
        return <Ship className="w-5 h-5" />;
      case 'Waves':
        return <Waves className="w-5 h-5" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5" />;
      case 'Scale':
        return <Scale className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const activeNode = TECHNOLOGY_NODES.find((n) => n.id === activeNodeId) || TECHNOLOGY_NODES[1];

  // SVG node positions for the network visualization
  const nodePositions: Record<string, { x: number; y: number }> = {
    'sat-intel': { x: 180, y: 90 },
    'ai-engine': { x: 420, y: 110 },
    'vessel-tracking': { x: 680, y: 90 },
    'metocean-data': { x: 660, y: 310 },
    'geospatial-engine': { x: 190, y: 310 },
    'liability-engine': { x: 430, y: 340 },
  };

  return (
    <section 
      id="technology-behind"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-12 bg-[#020712] border-b border-cyan-950/80 overflow-hidden"
    >
      {/* Background Grids */}
      <div className="absolute inset-0 ocean-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono-code mb-4">
            <Share2 className="w-3.5 h-3.5" />
            <span>INTERCONNECTED SENSOR & MODEL NETWORK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-display tracking-tight leading-tight">
            Technology Behind OORCA
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            OORCA is not a loose assembly of disparate dashboards. It is a unified, symbiotic intelligence network 
            where orbital sensors, machine learning classifiers, hydrodynamic ocean physics, and legal valuation engines 
            continuously feed each other.
          </p>
        </div>

        {/* Network Graph Visualizer & Interactive Node Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left / Center: Interactive Constellation Network Visualization */}
          <div className="lg:col-span-7">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl bg-[#030d1d] border border-cyan-500/40 p-4 sm:p-6 flex flex-col justify-between overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.15)]">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between text-xs font-mono-code text-cyan-400 z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  NEURAL DATA TOPOLOGY • 6 CONVERGENT NODES
                </span>
                <span className="text-slate-400">LATENCY: &lt;1.2 MS INTER-NODE</span>
              </div>

              {/* Connected Lines SVG Layer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 850 440">
                <defs>
                  <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0891b2" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0e7490" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* Draw lines between interconnected nodes */}
                {TECHNOLOGY_NODES.map((node) => {
                  const sourcePos = nodePositions[node.id];
                  if (!sourcePos) return null;
                  return node.connectedNodeIds.map((targetId) => {
                    const targetPos = nodePositions[targetId];
                    if (!targetPos) return null;
                    const isHighlit = node.id === activeNodeId || targetId === activeNodeId;
                    return (
                      <g key={`${node.id}-${targetId}`}>
                        <line
                          x1={sourcePos.x}
                          y1={sourcePos.y}
                          x2={targetPos.x}
                          y2={targetPos.y}
                          stroke={isHighlit ? '#22d3ee' : '#0891b2'}
                          strokeWidth={isHighlit ? 2.5 : 1}
                          strokeDasharray={isHighlit ? 'none' : '4 4'}
                          opacity={isHighlit ? 0.9 : 0.3}
                        />
                        {/* Animated traveling data packet along active line */}
                        {isHighlit && (
                          <circle r="3" fill="#ffffff">
                            <animateMotion
                              path={`M ${sourcePos.x} ${sourcePos.y} L ${targetPos.x} ${targetPos.y}`}
                              dur="3s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}
                      </g>
                    );
                  });
                })}
              </svg>

              {/* Render Nodes as Interactive Futuristic Pins */}
              <div className="relative w-full h-full">
                {TECHNOLOGY_NODES.map((node) => {
                  const pos = nodePositions[node.id];
                  if (!pos) return null;
                  const isActive = node.id === activeNodeId;
                  const isConnected = activeNode.connectedNodeIds.includes(node.id);

                  // Convert SVG coords to percentages for responsive positioning
                  const left = (pos.x / 850) * 100;
                  const top = (pos.y / 440) * 100;

                  return (
                    <div
                      key={node.id}
                      style={{ left: `${left}%`, top: `${top}%` }}
                      onClick={() => setActiveNodeId(node.id)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                    >
                      {/* Pulse Ring for Active */}
                      {isActive && (
                        <div className="absolute -inset-3 rounded-full bg-cyan-400/30 animate-ping" />
                      )}

                      {/* Node Icon Box */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                        isActive
                          ? 'bg-cyan-500 text-black border-white shadow-[0_0_25px_rgba(34,211,238,0.7)] scale-110'
                          : isConnected
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          : 'bg-slate-900/90 text-slate-300 border-cyan-900/60 hover:border-cyan-500 hover:text-white'
                      }`}>
                        {getNodeIcon(node.icon)}
                      </div>

                      {/* Node Label Below */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-0.5 rounded bg-slate-950/90 border border-slate-800 text-[10px] font-mono-code whitespace-nowrap text-slate-300 group-hover:text-cyan-300 transition-colors">
                        {node.name}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Network Instructions */}
              <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400 z-10 pt-2 border-t border-cyan-900/40">
                <span className="text-cyan-400">CLICK ANY NODE TO INSPECT CONVERGENT DATA STREAM</span>
                <span className="text-slate-500">REAL-TIME TELEMETRY</span>
              </div>

            </div>
          </div>

          {/* Right: Active Node Detail Dossier Panel */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-2xl bg-[#030d1d] border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.12)]">
              
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-md bg-cyan-950 border border-cyan-700/60 text-cyan-300 text-xs font-mono-code">
                  {activeNode.category.toUpperCase()}
                </span>
                <span className="text-xs font-mono-code text-slate-400">
                  NODE ID: #{activeNode.id.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500 text-black flex items-center justify-center font-bold">
                  {getNodeIcon(activeNode.icon)}
                </div>
                <h3 className="text-2xl font-bold text-white font-display">
                  {activeNode.name}
                </h3>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed mb-6 font-normal">
                {activeNode.description}
              </p>

              {/* Specifications List */}
              <div className="mb-6 space-y-2.5">
                <span className="text-xs font-mono-code text-cyan-400 block uppercase">
                  Technical Specifications:
                </span>
                {activeNode.specs.map((spec, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono-code text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              {/* Connected Streams */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs font-mono-code text-slate-400 block mb-2">
                  DIRECT CONVERGENT DATA CONNECTIONS:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeNode.connectedNodeIds.map((targetId) => {
                    const targetNode = TECHNOLOGY_NODES.find((n) => n.id === targetId);
                    return (
                      <button
                        key={targetId}
                        onClick={() => setActiveNodeId(targetId)}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-cyan-950 border border-cyan-800/60 text-xs font-mono-code text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>{targetNode?.name || targetId}</span>
                        <ArrowRight className="w-3 h-3 text-cyan-400" />
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
