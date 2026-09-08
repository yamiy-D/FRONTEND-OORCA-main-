/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  SimulationParameters, 
  SimulationResult, 
  SimulationControlsState,
} from '../types/simulation';
import { simulationService, DEFAULT_PARAMETERS } from '../services/simulationService';
import { SimulationHeader } from '../components/simulation/SimulationHeader';
import { InputParametersPanel } from '../components/simulation/InputParametersPanel';
import { SimulationControls } from '../components/simulation/SimulationControls';
import { ConcentrationLegend } from '../components/simulation/ConcentrationLegend';
import { MapControls } from '../components/simulation/MapControls';
import { CompassAndScale } from '../components/simulation/CompassAndScale';
import { SimulationMap } from '../components/simulation/SimulationMap';
import { OperationalCommandDock } from '../components/simulation/OperationalCommandDock';

export function SimulationPage() {
  // Simulation Inputs & Parameters
  const [parameters, setParameters] = useState<SimulationParameters>(() => {
    const saved = localStorage.getItem('oorca_sim_params');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PARAMETERS;
      }
    }
    return DEFAULT_PARAMETERS;
  });

  // Timeline & Playback State
  const [currentHour, setCurrentHour] = useState<number>(48);
  const [totalHours] = useState<number>(72);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Dynamic Ocean Slick & Continuous Seepage State
  const [showOceanSlick, setShowOceanSlick] = useState<boolean>(true);
  const [showHighZone, setShowHighZone] = useState<boolean>(true);
  const [showMediumZone, setShowMediumZone] = useState<boolean>(true);
  const [showLowZone, setShowLowZone] = useState<boolean>(true);
  const [seepageRate, setSeepageRate] = useState<number>(parameters.spillDetails.seepageRateTonnesPerHour ?? 25);

  // Draggable Floating Overlays State: Simulation Timeline & Oil Spill Concentration
  const [isTimelineOpen, setIsTimelineOpen] = useState<boolean>(true);
  const [isConcentrationOpen, setIsConcentrationOpen] = useState<boolean>(true);
  const [focusedPanel, setFocusedPanel] = useState<'timeline' | 'concentration'>('timeline');

  const handleToggleTimeline = () => {
    if (!isTimelineOpen) {
      setIsTimelineOpen(true);
      setFocusedPanel('timeline');
    } else if (focusedPanel !== 'timeline') {
      setFocusedPanel('timeline');
    } else {
      setIsTimelineOpen(false);
    }
  };

  const handleToggleConcentration = () => {
    if (!isConcentrationOpen) {
      setIsConcentrationOpen(true);
      setFocusedPanel('concentration');
    } else if (focusedPanel !== 'concentration') {
      setFocusedPanel('concentration');
    } else {
      setIsConcentrationOpen(false);
    }
  };

  // Layout & UI Toggles
  const [isInputPanelOpen, setIsInputPanelOpen] = useState<boolean>(true);
  const [currentLayerId, setCurrentLayerId] = useState<string>('dark');
  const [showWind, setShowWind] = useState<boolean>(false);
  const [showWaves, setShowWaves] = useState<boolean>(false);
  const [zoomAction, setZoomAction] = useState<number>(0);
  const [zoomOutAction, setZoomOutAction] = useState<number>(0);
  const [focusCoords, setFocusCoords] = useState<[number, number] | null>(null);

  // Map State (spillLocation, simulationActive, affectedRadius)
  const [spillLocation, setSpillLocation] = useState<{ lat: number; lng: number } | null>({
    lat: parameters.location.latitude,
    lng: parameters.location.longitude,
  });
  const [simulationActive, setSimulationActive] = useState<boolean>(true);
  const [affectedRadius, setAffectedRadius] = useState<number>(50000);

  // Keep spillLocation synchronized if parameters are loaded/updated from panel
  useEffect(() => {
    if (parameters.location.latitude && parameters.location.longitude) {
      setSpillLocation({
        lat: parameters.location.latitude,
        lng: parameters.location.longitude,
      });
    }
  }, [parameters.location.latitude, parameters.location.longitude]);

  // Simulation Computed Output
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Execute or refresh simulation
  const executeSimulation = useCallback(async (
    paramsToUse: SimulationParameters = parameters,
    hourToUse: number = currentHour
  ) => {
    const result = await simulationService.runSimulation(paramsToUse, hourToUse, totalHours);
    setSimulationResult(result);
  }, [parameters, currentHour, totalHours]);

  // Initial load
  useEffect(() => {
    executeSimulation(parameters, currentHour);
  }, []);

  // Update simulation when currentHour changes
  useEffect(() => {
    executeSimulation(parameters, currentHour);
  }, [currentHour, executeSimulation]);

  // Playback timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentHour((prev) => {
          if (prev >= totalHours) {
            setIsPlaying(false);
            return totalHours;
          }
          return prev + 1;
        });
      }, 750 / playbackSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, totalHours, playbackSpeed]);

  // Handle RUN SIMULATION button
  const handleRunSimulation = async () => {
    setIsSimulating(true);
    await new Promise((r) => setTimeout(r, 600)); // Smooth feedback
    await executeSimulation(parameters, currentHour);
    setIsSimulating(false);
  };

  // Handle clicking on the map to choose a new origin
  const handleMapClickLocation = (lat: number, lng: number) => {
    setSpillLocation({ lat, lng });
    const updatedParams: SimulationParameters = {
      ...parameters,
      location: {
        ...parameters.location,
        latitude: lat,
        longitude: lng,
        locationName: `Selected Coordinates (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`,
      },
    };
    setParameters(updatedParams);
    executeSimulation(updatedParams, currentHour);
  };

  // Reset to default
  const handleNewSimulation = () => {
    setParameters(DEFAULT_PARAMETERS);
    setCurrentHour(48);
    setIsPlaying(false);
    executeSimulation(DEFAULT_PARAMETERS, 48);
  };

  // Save parameters
  const handleSaveSimulation = () => {
    localStorage.setItem('oorca_sim_params', JSON.stringify(parameters));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Export report
  const handleExportReport = () => {
    if (!simulationResult) return;
    const reportData = {
      title: 'OORCA Oil Spill Simulation Scientific Assessment',
      model: 'OpenDrift Marine Dispersion Engine (Calibrated)',
      generatedUtc: new Date().toISOString(),
      parameters,
      simulationResult,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OORCA_Simulation_Report_${parameters.vesselDetails.vesselName.replace(/\s+/g, '_')}_${currentHour}h.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Share simulation
  const handleShareSimulation = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  // Controls State Bundle
  const controlsState: SimulationControlsState = {
    currentHour,
    totalHours,
    isPlaying,
    playbackSpeed,
    simulationTimeLabel: `+ ${currentHour}h`,
    currentTimeFormatted: simulationResult?.currentTimeFormatted || '29/05/2025 10:00',
  };

  return (
    <div 
      id="oorca-simulation-page-root"
      className="min-h-screen h-screen w-full bg-[#07111B] text-slate-100 flex flex-col overflow-hidden font-sans select-none"
    >
      {/* 1. Top Application Header */}
      <SimulationHeader
        onNewSimulation={handleNewSimulation}
        onSaveSimulation={handleSaveSimulation}
        onExportReport={handleExportReport}
        onShareSimulation={handleShareSimulation}
        isSaved={isSaved}
        onToggleParameters={() => setIsInputPanelOpen(!isInputPanelOpen)}
        isParametersOpen={isInputPanelOpen}
        activeSpillSummary={`${parameters.spillDetails.amount} ${parameters.spillDetails.amountUnit} • ${parameters.spillDetails.oilType.split(' ')[0]}`}
        isTimelineOpen={isTimelineOpen}
        onToggleTimeline={handleToggleTimeline}
        isConcentrationOpen={isConcentrationOpen}
        onToggleConcentration={handleToggleConcentration}
      />

      {/* 2. Main Workspace: Left Panel + Center Map */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Input Parameters Panel */}
        <InputParametersPanel
          parameters={parameters}
          onChangeParameters={(newParams) => {
            setParameters(newParams);
          }}
          onRunSimulation={handleRunSimulation}
          isRunning={isSimulating}
          isOpen={isInputPanelOpen}
          onToggleOpen={() => setIsInputPanelOpen(!isInputPanelOpen)}
        />

        {/* Central Map & Overlays Container */}
        <main className="flex-1 relative flex flex-col overflow-hidden bg-[#050e18]">
          
          {/* MAP CANVAS VIEW (NOW EXPANSIVE & PRIMARY) */}
          <div className="flex-1 relative overflow-hidden">
            <SimulationMap
              spillLocation={spillLocation}
              onLocationSelect={(loc) => {
                setSpillLocation(loc);
                handleMapClickLocation(loc.lat, loc.lng);
              }}
              simulationActive={simulationActive}
              affectedRadius={affectedRadius}
              flyToLocation={focusCoords ? { lat: focusCoords[0], lng: focusCoords[1] } : null}
              simulationResult={simulationResult}
              parameters={parameters}
              onMapClickLocation={handleMapClickLocation}
              currentLayerId={currentLayerId}
              showWind={showWind}
              showWaves={showWaves}
              zoomAction={zoomAction}
              zoomOutAction={zoomOutAction}
              focusCoords={focusCoords}
              onOpenParameters={() => setIsInputPanelOpen(true)}
              showOceanSlick={showOceanSlick}
              onToggleOceanSlick={setShowOceanSlick}
              showHighZone={showHighZone}
              onToggleHighZone={setShowHighZone}
              showMediumZone={showMediumZone}
              onToggleMediumZone={setShowMediumZone}
              showLowZone={showLowZone}
              onToggleLowZone={setShowLowZone}
              seepageRate={seepageRate}
              onSeepageRateChange={setSeepageRate}
            />

            {/* Floating Draggable Overlay 1: Simulation Controls */}
            <SimulationControls
              controlsState={controlsState}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onHourChange={(hr) => setCurrentHour(hr)}
              onSelectTimeOption={(opt) => {
                const hr = parseInt(opt.replace(/\D/g, ''), 10);
                if (!isNaN(hr)) setCurrentHour(hr);
              }}
              onOpenParameters={() => setIsInputPanelOpen(true)}
              seepageRate={seepageRate}
              initialAmount={parameters.spillDetails.amount}
              onChangePlaybackSpeed={setPlaybackSpeed}
              isOpen={isTimelineOpen}
              onClose={() => setIsTimelineOpen(false)}
              zIndex={focusedPanel === 'timeline' ? 35 : 30}
              onFocus={() => setFocusedPanel('timeline')}
              initialPosition={{ x: 16, y: 16 }}
            />

            {/* Floating Draggable Overlay 2: Concentration Legend */}
            <ConcentrationLegend 
              showOceanSlick={showOceanSlick}
              onToggleOceanSlick={() => setShowOceanSlick(!showOceanSlick)}
              showHighZone={showHighZone}
              onToggleHighZone={() => setShowHighZone(!showHighZone)}
              showMediumZone={showMediumZone}
              onToggleMediumZone={() => setShowMediumZone(!showMediumZone)}
              showLowZone={showLowZone}
              onToggleLowZone={() => setShowLowZone(!showLowZone)}
              peakThicknessMicrons={simulationResult?.peakThicknessMicrons ?? 350}
              isOpen={isConcentrationOpen}
              onClose={() => setIsConcentrationOpen(false)}
              zIndex={focusedPanel === 'concentration' ? 35 : 30}
              onFocus={() => setFocusedPanel('concentration')}
              initialPosition={{ x: 340, y: 16 }}
            />

            {/* Floating Overlay 3: Map Controls (Top Right) */}
            <MapControls
              currentLayerId={currentLayerId}
              onChangeLayer={(id) => setCurrentLayerId(id)}
              showWind={showWind}
              onToggleWind={() => setShowWind(!showWind)}
              showWaves={showWaves}
              onToggleWaves={() => setShowWaves(!showWaves)}
              onZoomIn={() => setZoomAction((prev) => prev + 1)}
              onZoomOut={() => setZoomOutAction((prev) => prev + 1)}
            />

            {/* Floating Overlay 4: Compass & Scale */}
            <CompassAndScale />
          </div>

          {/* 3. Bottom Operational Intelligence Dock (High-Density / Low Cognitive Load) */}
          {simulationResult && (
            <OperationalCommandDock
              simulationResult={simulationResult}
              parameters={parameters}
              onSelectShoreline={(coords) => setFocusCoords(coords)}
              onOpenParameters={() => setIsInputPanelOpen(true)}
            />
          )}

          {/* 4. Footer / Data Attribution Bar */}
          <footer 
            id="simulation-data-attribution-footer"
            className="h-7 px-4 bg-[#050c14] border-t border-[#12202e] flex items-center justify-between text-[11px] text-slate-500 font-mono-code shrink-0 z-10 select-none"
          >
            <div>
              <span>Disclaimer: This is a simulation based on input parameters and environmental data. Actual results may vary.</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Model: <strong className="text-slate-400 font-semibold">OpenDrift</strong></span>
              <span>|</span>
              <span>Data: <strong className="text-slate-400 font-semibold">NOAA, Copernicus, EMODnet</strong></span>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}
