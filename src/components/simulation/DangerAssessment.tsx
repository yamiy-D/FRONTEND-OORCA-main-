/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DangerAssessment as DangerAssessmentType, RiskLevel } from '../../types/simulation';

interface DangerAssessmentProps {
  assessment: DangerAssessmentType;
}

export function DangerAssessment({ assessment }: DangerAssessmentProps) {
  const getRiskTextColor = (level: RiskLevel) => {
    switch (level) {
      case 'Critical':
      case 'High':
        return 'text-[#ef4444] font-medium';
      case 'Medium':
        return 'text-[#f59e0b] font-medium';
      case 'Low':
      default:
        return 'text-[#10b981] font-medium';
    }
  };

  const getOverallBadgeStyle = (overall: string) => {
    switch (overall) {
      case 'CRITICAL':
      case 'HIGH':
        return 'bg-[#7f1d1d] text-[#fca5a5] border-[#991b1b]';
      case 'MEDIUM':
        return 'bg-[#78350f] text-[#fcd34d] border-[#92400e]';
      case 'LOW':
      default:
        return 'bg-[#064e3b] text-[#6ee7b7] border-[#047857]';
    }
  };

  return (
    <div 
      id="simulation-danger-assessment-card"
      className="bg-[#0b1723]/90 border border-[#162738] rounded-xl p-4 flex flex-col justify-between select-none shadow-xl"
    >
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 tracking-wider uppercase mb-3">
        <span className="text-[10px] text-slate-400">▷</span>
        <span>DANGER ASSESSMENT</span>
      </div>

      {/* OVERALL RISK BANNER */}
      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#07111b] border border-[#162738] mb-3">
        <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
          OVERALL RISK
        </span>
        <span className={`px-4 py-1 rounded text-xs font-bold font-mono-code tracking-wider border ${getOverallBadgeStyle(assessment.overallRisk)}`}>
          {assessment.overallRisk}
        </span>
      </div>

      {/* RISKS LIST */}
      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Risk to Environment</span>
          <span className={getRiskTextColor(assessment.riskToEnvironment)}>
            {assessment.riskToEnvironment}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Risk to Shoreline</span>
          <span className={getRiskTextColor(assessment.riskToShoreline)}>
            {assessment.riskToShoreline}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Risk to Human Health</span>
          <span className={getRiskTextColor(assessment.riskToHumanHealth)}>
            {assessment.riskToHumanHealth}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Clean-up Difficulty</span>
          <span className={getRiskTextColor(assessment.cleanUpDifficulty)}>
            {assessment.cleanUpDifficulty}
          </span>
        </div>
      </div>
    </div>
  );
}
