/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type OverallRisk = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type PresenceLevel = 'Low' | 'Medium' | 'High';

export type OilType = 
  | 'Crude Oil' 
  | 'Diesel' 
  | 'Heavy Fuel Oil' 
  | 'Marine Fuel Oil' 
  | 'Refined Petroleum Product';

export type AmountUnit = 'Tonnes' | 'Barrels' | 'm³' | 'Gallons';

export type VesselType = 
  | 'Oil Tanker' 
  | 'Cargo Ship' 
  | 'Container Vessel' 
  | 'Fishing Vessel' 
  | 'Passenger Vessel' 
  | 'Other';

export interface LocationParameters {
  latitude: number;
  longitude: number;
  locationName: string;
  searchQuery?: string;
}

export type HeatmapPalette = 'thermal' | 'magma' | 'bonn' | 'rainbow';

export interface SpillDetails {
  amount: number;
  amountUnit: AmountUnit;
  oilType: OilType;
  startTime: string; // "27/05/2025 10:00" or ISO
  seepageRateTonnesPerHour?: number; // Continuous leak rate (e.g. 15 tonnes/hr)
  spillMode?: 'instantaneous' | 'continuous_seepage';
}

export interface VesselDetails {
  vesselName: string;
  vesselType: VesselType;
  imoNumber: string;
  length: number; // in meters
  breadth: number; // in meters
  draft: number; // in meters or knots
  heading: number; // degrees (0 - 360)
}

export interface SimulationControlsState {
  currentHour: number; // e.g. 48
  totalHours: number; // e.g. 72
  isPlaying: boolean;
  playbackSpeed: number; // 1x, 2x, etc.
  simulationTimeLabel: string; // "+ 48h"
  currentTimeFormatted: string; // "29/05/2025 10:00"
}

export interface SimulationParameters {
  location: LocationParameters;
  spillDetails: SpillDetails;
  vesselDetails: VesselDetails;
}

export interface SpillSummary {
  totalSpilled: string; // "100 Tonnes"
  spillAreaEstKm2: number; // 12.45
  maxShoreArrival: string; // "36 - 48 h"
  weathering: 'Light' | 'Moderate' | 'Severe' | 'Extreme';
  evaporationPct: number; // 18
  dispersionPct: number; // 22
  remainingOnSurfacePct: number; // 60
}

export interface DangerAssessment {
  overallRisk: OverallRisk;
  riskToEnvironment: RiskLevel;
  riskToShoreline: RiskLevel;
  riskToHumanHealth: RiskLevel;
  cleanUpDifficulty: RiskLevel;
}

export interface EcologicalInhabitant {
  id: string;
  speciesHabitat: string;
  iconType: 'mangrove' | 'coral' | 'seagrass' | 'dolphin' | 'turtle' | 'fish' | 'plankton';
  presence: PresenceLevel;
  riskLevel: RiskLevel;
}

export interface ShorelineImpact {
  id: string;
  location: string;
  arrivalTime: string; // "36 - 48 h"
  impactLevel: RiskLevel;
  distanceKm: number;
  coordinates: [number, number]; // [lat, lng]
}

export interface EnvironmentalConditions {
  windSpeedKts: number;
  windDirectionDeg: number;
  currentSpeedKts: number;
  currentDirectionDeg: number;
  waveHeightMeters: number;
  waterTemperatureC: number;
  airTemperatureC: number;
}

export interface SpillConcentrationContour {
  level: 'Very Thin' | 'Thin' | 'Medium' | 'Thick' | 'Very Thick';
  colorHex: string;
  fillOpacity: number;
  thicknessMicrons: string;
  points: [number, number][]; // [lat, lng]
}

export interface SimulationResult {
  timestamp: string;
  currentHour: number;
  totalHours: number;
  currentTimeFormatted: string;
  spillOrigin: [number, number];
  slickCentroid: [number, number];
  vesselPosition: [number, number];
  contours: SpillConcentrationContour[];
  summary: SpillSummary;
  dangerAssessment: DangerAssessment;
  ecologicalRisks: EcologicalInhabitant[];
  shorelineImpacts: ShorelineImpact[];
  environmentalConditions: EnvironmentalConditions;
}
