/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MOCK_INCIDENTS, NEW_SCANNED_INCIDENT } from '../data/alertsData';
import { OilSpillIncident, AlertStatus } from '../types/alertTypes';
import { AlertsHeader } from '../components/alerts/AlertsHeader';
import { SpillScannerBar, ScanResult } from '../components/alerts/SpillScannerBar';
import { ActiveAlertsCards } from '../components/alerts/ActiveAlertsCards';
import { SatelliteSpillViewer } from '../components/alerts/SatelliteSpillViewer';
import { SpillLocationAndCharacteristics } from '../components/alerts/SpillLocationAndCharacteristics';
import { SpillTrajectoryMap } from '../components/alerts/SpillTrajectoryMap';
import { SuspectVesselInvestigation } from '../components/alerts/SuspectVesselInvestigation';
import { PotentialViolationsSection } from '../components/alerts/PotentialViolationsSection';
import { InvestigationTimelineSection } from '../components/alerts/InvestigationTimelineSection';
import { AlertActionsBar } from '../components/alerts/AlertActionsBar';
import { InvestigationDossierModal } from '../components/alerts/InvestigationDossierModal';

const AUTO_SCAN_INTERVAL_SECONDS = 600; // 10 minutes

export function AlertCenterPage() {
  const [incidents, setIncidents] = useState<OilSpillIncident[]>(MOCK_INCIDENTS);
  const [activeIncidentId, setActiveIncidentId] = useState<string>(MOCK_INCIDENTS[0].id);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);

  // Scanner State
  const [isAutoScanning, setIsAutoScanning] = useState<boolean>(false);
  const [autoScanCountdown, setAutoScanCountdown] = useState<number>(AUTO_SCAN_INTERVAL_SECONDS);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanPhase, setScanPhase] = useState<string>('Ready for surveillance pass');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [lastScanResult, setLastScanResult] = useState<ScanResult | null>(null);
  const [totalScansCount, setTotalScansCount] = useState<number>(1);

  const activeIncident = incidents.find((i) => i.id === activeIncidentId) || incidents[0];

  const handleSelectIncident = (id: string) => {
    setActiveIncidentId(id);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // Core Scanning Logic (Used by both Manual and 10-Min Auto-Scan)
  const executeScan = useCallback((scanType: 'MANUAL' | 'AUTO_10MIN') => {
    if (isScanning) return;

    setIsScanning(true);
    setScanProgress(10);
    setScanPhase('Acquiring Copernicus Sentinel-1 & ICEYE C-SAR Satellite Radar Swaths...');

    // Phase 1: Satellite Ingestion
    setTimeout(() => {
      setScanProgress(45);
      setScanPhase('Correlating Class-A AIS Transponders & Dark Vessel Drift Tracks (10-Min Window)...');
    }, 500);

    // Phase 2: Hydrodynamic Dispersion & Anomaly Threshold
    setTimeout(() => {
      setScanProgress(80);
      setScanPhase('Solving Lagrangian Hydrodynamic Dispersion & Anomaly Filters...');
    }, 1100);

    // Phase 3: Synthesize Findings
    setTimeout(() => {
      setScanProgress(100);
      setScanPhase('Surveillance pass verified & synthesized.');
    }, 1600);

    // Phase 4: Finalize & update state
    setTimeout(() => {
      setIsScanning(false);
      setTotalScansCount((prev) => prev + 1);

      const timestampNow = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

      // Check if NEW_SCANNED_INCIDENT has been added yet
      setIncidents((currentIncidents) => {
        const alreadyHasNewIncident = currentIncidents.some((i) => i.id === NEW_SCANNED_INCIDENT.id);

        if (!alreadyHasNewIncident) {
          // Fresh spill detected in this 10-minute pass!
          const updatedList = [NEW_SCANNED_INCIDENT, ...currentIncidents];
          setActiveIncidentId(NEW_SCANNED_INCIDENT.id);

          setLastScanResult({
            timestamp: timestampNow,
            type: scanType,
            sectorsChecked: 18,
            vesselsAnalyzed: 154,
            newSpillsFound: 1,
            detectedIncidentId: NEW_SCANNED_INCIDENT.id,
            message: `FRESH ANOMALY DETECTED: 1 new oil slick identified in Southern Red Sea / Bab-el-Mandeb Ingress within the last 10-min window. Primary suspect MT RED SEA GLORY correlated with 95% suspect index.`,
          });

          return updatedList;
        } else {
          // Already have all incidents: Update observation telemetry
          const updatedList = currentIncidents.map((inc) => ({
            ...inc,
            characteristics: {
              ...inc.characteristics,
              confidencePercentage: Math.min(99, inc.characteristics.confidencePercentage + 1),
            },
          }));

          setLastScanResult({
            timestamp: timestampNow,
            type: scanType,
            sectorsChecked: 18,
            vesselsAnalyzed: 168,
            newSpillsFound: 0,
            message: `Surveillance pass complete across 4 international corridors (Hormuz, North Sea, Malacca, Bab-el-Mandeb). All 4 active slicks tracked within predicted hydrodynamic drift cones. 0 new discharges in the last 10 minutes.`,
          });

          return updatedList;
        }
      });
    }, 1800);
  }, [isScanning]);

  // Handle Manual Single Scan
  const handleManualScan = () => {
    executeScan('MANUAL');
    if (isAutoScanning) {
      // Reset the 10-minute timer to start fresh
      setAutoScanCountdown(AUTO_SCAN_INTERVAL_SECONDS);
    }
  };

  // Toggle 10-Minute Periodic Auto-Scan
  const handleToggleAutoScan = () => {
    if (isAutoScanning) {
      setIsAutoScanning(false);
    } else {
      setIsAutoScanning(true);
      setAutoScanCountdown(AUTO_SCAN_INTERVAL_SECONDS);
      // Immediately run an initial scan upon starting the 10-min cycle if none run recently
      if (!isScanning) {
        executeScan('AUTO_10MIN');
      }
    }
  };

  // 10-Minute Auto-Scan Timer Effect (Ticking every second)
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isAutoScanning) {
      intervalId = setInterval(() => {
        setAutoScanCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            // Timer expired: trigger automated scan for spills in the last 10 minutes!
            executeScan('AUTO_10MIN');
            return AUTO_SCAN_INTERVAL_SECONDS;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoScanning, executeScan]);

  const handleClearScanResult = () => {
    setLastScanResult(null);
  };

  const handleFocusLocation = () => {
    const el = document.getElementById('spill-trajectory-movement');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewSatellite = () => {
    const el = document.getElementById('satellite-spill-detection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAnalyzeVesselRoute = () => {
    const el = document.getElementById('vessel-investigation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStatusChange = (newStatus: AlertStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === activeIncident.id ? { ...inc, status: newStatus } : inc))
    );
  };

  return (
    <div className="min-h-screen bg-[#020712] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* 1. Alert Centre Header */}
      <AlertsHeader
        incidents={incidents}
        activeIncident={activeIncident}
        onOpenDossier={() => setIsDossierOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onManualScan={handleManualScan}
        isScanning={isScanning}
        isAutoScanning={isAutoScanning}
        autoScanCountdown={autoScanCountdown}
        onToggleAutoScan={handleToggleAutoScan}
      />

      {/* Main Forensic Intelligence Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* SATELLITE SPILL SCANNER SURVEILLANCE BAR (10-Min Auto-Scan & Single Manual Scan) */}
        <SpillScannerBar
          isAutoScanning={isAutoScanning}
          autoScanCountdown={autoScanCountdown}
          onToggleAutoScan={handleToggleAutoScan}
          isScanning={isScanning}
          scanPhase={scanPhase}
          scanProgress={scanProgress}
          lastScanResult={lastScanResult}
          onManualScan={handleManualScan}
          onClearScanResult={handleClearScanResult}
          onSelectIncident={handleSelectIncident}
          totalScansCount={totalScansCount}
        />

        {/* 2. Active Oil Spill Incident Alert Cards */}
        <ActiveAlertsCards
          incidents={incidents}
          activeIncidentId={activeIncident.id}
          onSelectIncident={handleSelectIncident}
        />

        {/* 3. Satellite Spill Detection (SAR / Multispectral) */}
        <SatelliteSpillViewer
          satellite={activeIncident.satellite}
          characteristics={activeIncident.characteristics}
          incidentId={activeIncident.id}
        />

        {/* 4. Oil Spill Location & 5. Spill Characteristics */}
        <SpillLocationAndCharacteristics
          location={activeIncident.location}
          characteristics={activeIncident.characteristics}
          onFocusLocation={handleFocusLocation}
        />

        {/* 6. Spill Trajectory & Movement (Origin -> Current -> Predictions) */}
        <SpillTrajectoryMap
          trajectory={activeIncident.trajectory}
          metocean={activeIncident.metocean}
        />

        {/* 7. Vessel Investigation, 8. Primary Suspect, 9. Suspect Scoring & 10. Traffic Reconstruction */}
        <SuspectVesselInvestigation
          primaryVessel={activeIncident.primarySuspect}
          secondaryVessels={activeIncident.secondarySuspects}
        />

        {/* 11. Potential Violations & Investigation Evidence */}
        <PotentialViolationsSection
          violations={activeIncident.primarySuspect.violations}
          vesselName={activeIncident.primarySuspect.name}
        />

        {/* 12. Investigation Timeline & Event Sequence */}
        <InvestigationTimelineSection
          timeline={activeIncident.timeline}
        />

        {/* 13. Alert Actions Bar */}
        <AlertActionsBar
          incident={activeIncident}
          onFocusLocation={handleFocusLocation}
          onViewSatellite={handleViewSatellite}
          onAnalyzeVesselRoute={handleAnalyzeVesselRoute}
          onOpenDossier={() => setIsDossierOpen(true)}
          onStatusChange={handleStatusChange}
        />
      </main>

      {/* Formal Maritime Evidence Dossier Modal */}
      {isDossierOpen && (
        <InvestigationDossierModal
          incident={activeIncident}
          onClose={() => setIsDossierOpen(false)}
        />
      )}
    </div>
  );
}
