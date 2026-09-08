/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Play, 
  RefreshCw, 
  X, 
  ChevronRight,
  ChevronDown,
  Sliders,
  Ship,
  Droplets,
  Wind,
  Navigation
} from 'lucide-react';
import { 
  SimulationParameters, 
  OilType, 
  AmountUnit, 
  VesselType 
} from '../../types/simulation';

interface InputParametersPanelProps {
  parameters: SimulationParameters;
  onChangeParameters: (newParams: SimulationParameters) => void;
  onRunSimulation: () => void;
  isRunning: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function InputParametersPanel({
  parameters,
  onChangeParameters,
  onRunSimulation,
  isRunning,
  isOpen,
  onToggleOpen,
}: InputParametersPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Accordion expansion states (progressive disclosure)
  const [locationOpen, setLocationOpen] = useState(true);
  const [spillOpen, setSpillOpen] = useState(true);
  const [vesselOpen, setVesselOpen] = useState(false); // Collapsed by default for secondary specs
  const [envOpen, setEnvOpen] = useState(false); // Collapsed by default for secondary metocean

  // Location search handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase();
    if (query.includes('mumbai') || query.includes('arabian')) {
      onChangeParameters({
        ...parameters,
        location: {
          ...parameters.location,
          latitude: 18.9076,
          longitude: 72.8177,
          locationName: 'Arabian Sea, Offshore Mumbai, India',
        },
      });
    } else if (query.includes('alibaug')) {
      onChangeParameters({
        ...parameters,
        location: {
          ...parameters.location,
          latitude: 18.6414,
          longitude: 72.8722,
          locationName: 'Alibaug Coastal Sector, Maharashtra',
        },
      });
    } else if (query.includes('murud')) {
      onChangeParameters({
        ...parameters,
        location: {
          ...parameters.location,
          latitude: 18.3283,
          longitude: 72.9622,
          locationName: 'Murud Offshore Approaches, India',
        },
      });
    }
  };

  const handleLocationPreset = (name: string, lat: number, lng: number) => {
    onChangeParameters({
      ...parameters,
      location: {
        ...parameters.location,
        latitude: lat,
        longitude: lng,
        locationName: name,
      },
    });
  };

  // If closed: Always-visible dock tab on the left edge (docked below the simulation timeline controls)
  if (!isOpen) {
    return (
      <div className="absolute left-0 top-48 z-20 select-none">
        <button
          id="btn-expand-input-panel"
          onClick={onToggleOpen}
          className="group flex items-center gap-2 px-3 py-2 rounded-r-lg bg-[#0b1b2a]/95 hover:bg-[#0f243a] border-y border-r border-[#203c58] text-cyan-400 hover:text-white shadow-[4px_0_16px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all cursor-pointer"
          title="Open Simulation Parameters (Coordinates, Spill Volume, Vessel Details)"
        >
          <Sliders className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-200">
              PARAMETERS
            </span>
            <span className="text-[9px] font-mono-code text-cyan-400/80">
              {parameters.spillDetails.amount} {parameters.spillDetails.amountUnit} • {parameters.spillDetails.oilType.split(' ')[0]}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>
      </div>
    );
  }

  return (
    <aside
      id="input-parameters-panel"
      className="w-80 md:w-[340px] bg-[#07131F]/98 border-r border-[#192b3a] flex flex-col z-30 shrink-0 select-none backdrop-blur-xl transition-all duration-300 shadow-[8px_0_24px_rgba(0,0,0,0.6)]"
    >
      {/* Panel Top Title */}
      <div className="h-12 px-4 border-b border-[#182a3b] flex items-center justify-between text-xs text-slate-200 font-semibold tracking-wider uppercase bg-[#050e18]/80">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>SIMULATION PARAMETERS</span>
        </div>
        <button 
          id="btn-close-input-panel"
          onClick={onToggleOpen} 
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          title="Close Parameters Drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Accordion Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs custom-scrollbar">
        
        {/* ============================================================ */}
        {/* ACCORDION 1: LOCATION (CRITICAL) */}
        {/* ============================================================ */}
        <div className="rounded-lg bg-[#0b1723]/70 border border-[#182c40] overflow-hidden">
          <button
            onClick={() => setLocationOpen(!locationOpen)}
            className="w-full px-3 py-2.5 flex items-center justify-between bg-[#0b1a28]/60 hover:bg-[#0e2133] transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-[11px] text-slate-200 uppercase tracking-wide">
                1. Spill Location
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {!locationOpen && (
                <span className="text-[10px] font-mono-code text-cyan-400/80 truncate max-w-[120px]">
                  {parameters.location.latitude.toFixed(2)}°N, {parameters.location.longitude.toFixed(2)}°E
                </span>
              )}
              {locationOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </div>
          </button>

          {locationOpen && (
            <div className="p-3 space-y-2.5 border-t border-[#182c40] bg-[#07111b]/40">
              {/* Search Location Input */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sector or click ocean map"
                  className="w-full h-8 pl-8 pr-3 rounded bg-[#08131e] border border-[#1c3247] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs transition-colors"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              </form>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleLocationPreset('Arabian Sea, Offshore Mumbai', 18.9076, 72.8177)}
                  className="px-2 py-0.5 rounded text-[10px] bg-[#0d2030] hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-400 border border-[#1b344a] cursor-pointer"
                >
                  Offshore Mumbai
                </button>
                <button
                  type="button"
                  onClick={() => handleLocationPreset('Alibaug Coastal Sector', 18.6414, 72.8722)}
                  className="px-2 py-0.5 rounded text-[10px] bg-[#0d2030] hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-400 border border-[#1b344a] cursor-pointer"
                >
                  Alibaug
                </button>
                <button
                  type="button"
                  onClick={() => handleLocationPreset('Murud Approaches', 18.3283, 72.9622)}
                  className="px-2 py-0.5 rounded text-[10px] bg-[#0d2030] hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-400 border border-[#1b344a] cursor-pointer"
                >
                  Murud
                </button>
              </div>

              {/* Latitude & Longitude Fields */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Latitude</label>
                  <div className="h-7 px-2 rounded bg-[#08131e] border border-[#1c3247] flex items-center justify-between text-slate-200 font-mono-code text-[11px]">
                    <span>{parameters.location.latitude.toFixed(4)}</span>
                    <span className="text-slate-500">°N</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Longitude</label>
                  <div className="h-7 px-2 rounded bg-[#08131e] border border-[#1c3247] flex items-center justify-between text-slate-200 font-mono-code text-[11px]">
                    <span>{parameters.location.longitude.toFixed(4)}</span>
                    <span className="text-slate-500">°E</span>
                  </div>
                </div>
              </div>

              {/* Selected Location Display */}
              <div className="px-2.5 py-1.5 rounded bg-[#08131e] border border-[#1c3247] text-slate-300 flex items-center gap-2 text-xs">
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate text-slate-200">{parameters.location.locationName}</span>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* ACCORDION 2: SPILL CHARACTERISTICS (CRITICAL) */}
        {/* ============================================================ */}
        <div className="rounded-lg bg-[#0b1723]/70 border border-[#182c40] overflow-hidden">
          <button
            onClick={() => setSpillOpen(!spillOpen)}
            className="w-full px-3 py-2.5 flex items-center justify-between bg-[#0b1a28]/60 hover:bg-[#0e2133] transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Droplets className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-[11px] text-slate-200 uppercase tracking-wide">
                2. Spill Volume & Oil Type
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {!spillOpen && (
                <span className="text-[10px] font-mono-code text-amber-400/90">
                  {parameters.spillDetails.amount} {parameters.spillDetails.amountUnit}
                </span>
              )}
              {spillOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </div>
          </button>

          {spillOpen && (
            <div className="p-3 space-y-2.5 border-t border-[#182c40] bg-[#07111b]/40">
              {/* Spill Amount + Unit */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Spill Amount</label>
                <div className="grid grid-cols-12 gap-2">
                  <input
                    type="number"
                    min="1"
                    max="50000"
                    value={parameters.spillDetails.amount}
                    onChange={(e) =>
                      onChangeParameters({
                        ...parameters,
                        spillDetails: {
                          ...parameters.spillDetails,
                          amount: Number(e.target.value) || 0,
                        },
                      })
                    }
                    className="col-span-7 h-7 px-2 rounded bg-[#08131e] border border-[#1c3247] text-slate-200 focus:outline-none focus:border-cyan-500 font-mono-code text-xs"
                  />
                  <select
                    value={parameters.spillDetails.amountUnit}
                    onChange={(e) =>
                      onChangeParameters({
                        ...parameters,
                        spillDetails: {
                          ...parameters.spillDetails,
                          amountUnit: e.target.value as AmountUnit,
                        },
                      })
                    }
                    className="col-span-5 h-7 px-1.5 rounded bg-[#08131e] border border-[#1c3247] text-slate-300 focus:outline-none focus:border-cyan-500 text-xs cursor-pointer"
                  >
                    <option value="Tonnes">Tonnes</option>
                    <option value="Barrels">Barrels</option>
                    <option value="m³">m³</option>
                    <option value="Gallons">Gallons</option>
                  </select>
                </div>
              </div>

              {/* Oil Type Dropdown */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Hydrocarbon Classification</label>
                <select
                  value={parameters.spillDetails.oilType}
                  onChange={(e) =>
                    onChangeParameters({
                      ...parameters,
                      spillDetails: {
                        ...parameters.spillDetails,
                        oilType: e.target.value as OilType,
                      },
                    })
                  }
                  className="w-full h-7 px-2 rounded bg-[#08131e] border border-[#1c3247] text-slate-200 focus:outline-none focus:border-cyan-500 text-xs cursor-pointer"
                >
                  <option value="Crude Oil">Crude Oil (Heavy Viscosity)</option>
                  <option value="Diesel">Diesel (Light Distillate)</option>
                  <option value="Heavy Fuel Oil">Heavy Fuel Oil (HFO Bunker)</option>
                  <option value="Marine Fuel Oil">Marine Fuel Oil (MFO)</option>
                  <option value="Refined Petroleum Product">Refined Petroleum Product</option>
                </select>
              </div>

              {/* Spill Start Time */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Spill Incident Start Time (UTC)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={parameters.spillDetails.startTime}
                    onChange={(e) =>
                      onChangeParameters({
                        ...parameters,
                        spillDetails: {
                          ...parameters.spillDetails,
                          startTime: e.target.value,
                        },
                      })
                    }
                    className="w-full h-7 pl-2 pr-7 rounded bg-[#08131e] border border-[#1c3247] text-slate-200 focus:outline-none focus:border-cyan-500 font-mono-code text-xs"
                  />
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* ACCORDION 3: VESSEL KINEMATICS (SECONDARY) */}
        {/* ============================================================ */}
        <div className="rounded-lg bg-[#0b1723]/70 border border-[#182c40] overflow-hidden">
          <button
            onClick={() => setVesselOpen(!vesselOpen)}
            className="w-full px-3 py-2.5 flex items-center justify-between bg-[#0b1a28]/60 hover:bg-[#0e2133] transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Ship className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-semibold text-[11px] text-slate-200 uppercase tracking-wide">
                3. Vessel Specifications
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {!vesselOpen && (
                <span className="text-[10px] font-mono-code text-slate-400 truncate max-w-[130px]">
                  {parameters.vesselDetails.vesselName} • {parameters.vesselDetails.heading}°
                </span>
              )}
              {vesselOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </div>
          </button>

          {vesselOpen && (
            <div className="p-3 space-y-2.5 border-t border-[#182c40] bg-[#07111b]/40">
              {/* Vessel Name */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Vessel Name</label>
                <input
                  type="text"
                  value={parameters.vesselDetails.vesselName}
                  onChange={(e) =>
                    onChangeParameters({
                      ...parameters,
                      vesselDetails: {
                        ...parameters.vesselDetails,
                        vesselName: e.target.value,
                      },
                    })
                  }
                  className="w-full h-7 px-2 rounded bg-[#08131e] border border-[#1c3247] text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              {/* Vessel Type & IMO Number */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Vessel Type</label>
                  <select
                    value={parameters.vesselDetails.vesselType}
                    onChange={(e) =>
                      onChangeParameters({
                        ...parameters,
                        vesselDetails: {
                          ...parameters.vesselDetails,
                          vesselType: e.target.value as VesselType,
                        },
                      })
                    }
                    className="w-full h-7 px-1 rounded bg-[#08131e] border border-[#1c3247] text-slate-200 focus:outline-none focus:border-cyan-500 text-[11px] cursor-pointer"
                  >
                    <option value="Oil Tanker">Oil Tanker</option>
                    <option value="Cargo Ship">Cargo Ship</option>
                    <option value="Container Vessel">Container Vessel</option>
                    <option value="Fishing Vessel">Fishing Vessel</option>
                    <option value="Passenger Vessel">Passenger Vessel</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">IMO Number</label>
                  <input
                    type="text"
                    value={parameters.vesselDetails.imoNumber}
                    onChange={(e) =>
                      onChangeParameters({
                        ...parameters,
                        vesselDetails: {
                          ...parameters.vesselDetails,
                          imoNumber: e.target.value,
                        },
                      })
                    }
                    className="w-full h-7 px-2 rounded bg-[#08131e] border border-[#1c3247] text-slate-200 focus:outline-none focus:border-cyan-500 font-mono-code text-xs"
                  />
                </div>
              </div>

              {/* Length & Breadth */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Length</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={parameters.vesselDetails.length}
                      onChange={(e) =>
                        onChangeParameters({
                          ...parameters,
                          vesselDetails: {
                            ...parameters.vesselDetails,
                            length: Number(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full h-7 pl-2 pr-6 rounded bg-[#08131e] border border-[#1c3247] text-slate-200 focus:outline-none focus:border-cyan-500 font-mono-code text-xs"
                    />
                    <span className="text-[10px] text-slate-500 absolute right-2 top-1.5 pointer-events-none">m</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Breadth</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={parameters.vesselDetails.breadth}
                      onChange={(e) =>
                        onChangeParameters({
                          ...parameters,
                          vesselDetails: {
                            ...parameters.vesselDetails,
                            breadth: Number(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full h-7 pl-2 pr-6 rounded bg-[#08131e] border border-[#1c3247] text-slate-200 focus:outline-none focus:border-cyan-500 font-mono-code text-xs"
                    />
                    <span className="text-[10px] text-slate-500 absolute right-2 top-1.5 pointer-events-none">m</span>
                  </div>
                </div>
              </div>

              {/* Draft & Heading */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Speed / Draft</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={parameters.vesselDetails.draft}
                      onChange={(e) =>
                        onChangeParameters({
                          ...parameters,
                          vesselDetails: {
                            ...parameters.vesselDetails,
                            draft: Number(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full h-7 pl-2 pr-9 rounded bg-[#08131e] border border-[#1c3247] text-slate-200 focus:outline-none focus:border-cyan-500 font-mono-code text-xs"
                    />
                    <span className="text-[9px] text-slate-500 absolute right-1.5 top-1.5 pointer-events-none">knots</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Gyro Heading</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="360"
                      value={parameters.vesselDetails.heading}
                      onChange={(e) =>
                        onChangeParameters({
                          ...parameters,
                          vesselDetails: {
                            ...parameters.vesselDetails,
                            heading: Number(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full h-7 pl-2 pr-5 rounded bg-[#08131e] border border-[#1c3247] text-slate-200 focus:outline-none focus:border-cyan-500 font-mono-code text-xs"
                    />
                    <span className="text-[10px] text-slate-500 absolute right-2 top-1.5 pointer-events-none">°</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* ACCORDION 4: METOCEAN DRIVERS (SECONDARY) */}
        {/* ============================================================ */}
        <div className="rounded-lg bg-[#0b1723]/70 border border-[#182c40] overflow-hidden">
          <button
            onClick={() => setEnvOpen(!envOpen)}
            className="w-full px-3 py-2.5 flex items-center justify-between bg-[#0b1a28]/60 hover:bg-[#0e2133] transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Wind className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-semibold text-[11px] text-slate-200 uppercase tracking-wide">
                4. Metocean Baseline
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {!envOpen && (
                <span className="text-[10px] font-mono-code text-teal-400/80">
                  Wind 14.5 kts • Curr 1.2 kts
                </span>
              )}
              {envOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </div>
          </button>

          {envOpen && (
            <div className="p-3 space-y-2 border-t border-[#182c40] bg-[#07111b]/40 text-[11px]">
              <div className="flex justify-between items-center py-1 border-b border-[#142333] text-slate-400">
                <span>Surface Current</span>
                <span className="font-mono-code text-slate-200">1.2 kts @ 145° SE</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#142333] text-slate-400">
                <span>Wind Speed (10m)</span>
                <span className="font-mono-code text-slate-200">14.5 kts (NW 310°)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#142333] text-slate-400">
                <span>Sea Surface Temp</span>
                <span className="font-mono-code text-slate-200">28.5 °C</span>
              </div>
              <div className="flex justify-between items-center py-1 text-slate-400">
                <span>Fay's Spreading Phase</span>
                <span className="font-mono-code text-cyan-400">Viscous-Surface Tension</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Sticky Bottom Action */}
      <div className="p-3 border-t border-[#182a3b] bg-[#050e18]/90">
        <button
          id="btn-run-simulation"
          onClick={onRunSimulation}
          disabled={isRunning}
          className="w-full h-10 rounded-lg bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-600 hover:to-cyan-500 active:from-blue-800 active:to-cyan-700 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(6,182,212,0.3)] transition-all cursor-pointer disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Calculating Dispersion...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>RUN SIMULATION</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
