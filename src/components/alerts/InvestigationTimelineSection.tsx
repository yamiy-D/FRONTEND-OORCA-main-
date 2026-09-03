/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  CircleDot, 
  ArrowDown, 
  Radio, 
  Satellite, 
  Compass, 
  AlertOctagon, 
  Send 
} from 'lucide-react';
import { TimelineEvent } from '../../types/alertTypes';

interface InvestigationTimelineSectionProps {
  timeline: TimelineEvent[];
}

export function InvestigationTimelineSection({
  timeline,
}: InvestigationTimelineSectionProps) {
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'STAGE-01':
        return <Compass className="w-4 h-4 text-amber-400" />;
      case 'STAGE-02':
        return <Radio className="w-4 h-4 text-red-400" />;
      case 'STAGE-03':
        return <Satellite className="w-4 h-4 text-cyan-400" />;
      case 'STAGE-04':
        return <CircleDot className="w-4 h-4 text-purple-400" />;
      case 'STAGE-05':
        return <AlertOctagon className="w-4 h-4 text-red-400" />;
      default:
        return <Send className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <section 
      id="investigation-timeline"
      className="rounded-2xl border border-cyan-950/80 bg-slate-950/80 backdrop-blur-md p-5 sm:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.6)] mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-950/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold font-mono-code text-white uppercase tracking-wide">
              ⏱ INVESTIGATION TIMELINE & EVENT SEQUENCE
            </h2>
            <p className="text-xs text-slate-400 font-mono-code mt-0.5">
              Chronological forensic event log from estimated release to dispatch
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-block px-2.5 py-1 rounded text-[10px] font-mono-code bg-slate-900 border border-slate-800 text-slate-400">
          UTC Standard Timing Reference
        </span>
      </div>

      {/* Timeline Steps (Responsive horizontal on desktop or vertical sequence) */}
      <div className="relative">
        {/* Desktop Connected Line */}
        <div className="hidden lg:block absolute top-7 left-8 right-8 h-0.5 bg-gradient-to-r from-amber-500/60 via-cyan-500/60 to-emerald-500/60 z-0" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative z-10 font-mono-code">
          {timeline.map((event, index) => {
            const isLast = index === timeline.length - 1;

            return (
              <div 
                key={event.id}
                className="rounded-xl border border-slate-800/90 bg-slate-900/80 p-3.5 flex flex-col justify-between hover:border-cyan-500/40 transition-all shadow-md group"
              >
                <div>
                  {/* Top: Icon + UTC Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-cyan-500/40 transition-colors">
                      {getStageIcon(event.stageCode)}
                    </div>
                    <span className="text-[11px] font-bold text-cyan-300">
                      {event.timeUtc}
                    </span>
                  </div>

                  {/* Stage Code & Badge */}
                  <div className="mb-1.5">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {event.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-xs font-bold text-slate-100 mb-1 leading-snug">
                    {event.title}
                  </h4>

                  {/* Description */}
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {event.description}
                  </p>
                </div>

                {/* Status dot */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Step {index + 1} of {timeline.length}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                    event.status === 'COMPLETED'
                      ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-900/50'
                      : 'text-cyan-400 bg-cyan-950/40 border border-cyan-900/50'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
