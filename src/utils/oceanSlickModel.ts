/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnvironmentalConditions } from '../types/simulation';

export type SlickZoneId = 'high' | 'medium' | 'low' | 'fragment' | 'breach_jet';

export interface SlickZoneProperties {
  zone: SlickZoneId;
  label: string;
  description: string;
  thicknessMicrons: number;
  colorHex: string;
  edgeColorHex: string;
  fillOpacity: number;
  edgeWidth: number;
  edgeBlur: number;
}

export interface OceanSlickParams {
  originLat: number;
  originLng: number;
  vesselHeadingDeg: number;
  vesselLengthMeters?: number;
  vesselBreadthMeters?: number;
  envConditions?: EnvironmentalConditions;
  elapsedHours: number;
  seepageRateTonnesPerHour: number;
  initialTonnes: number;
  animPhase: number; // Wave and turbulence phase in radians (driven by requestAnimationFrame)
}

/**
 * Generates an organic, smooth spline-like closed polygon with irregular multi-harmonic
 * boundary perturbations that reflect real ocean hydrodynamic surface tension and wave shear.
 */
function createOrganicBoundary(
  centerLat: number,
  centerLng: number,
  driftRad: number,
  longLengthKm: number,
  maxLateralWidthKm: number,
  nearVesselWidthKm: number,
  upstreamBufferKm: number,
  harmonicWeights: Array<{ freq: number; amp: number; speed: number; phaseOffset: number }>,
  animPhase: number,
  numPoints: number = 64
): [number, number][] {
  const kmPerDegLat = 111.0;
  const kmPerDegLng = 111.0 * Math.cos((centerLat * Math.PI) / 180);
  const sinD = Math.sin(driftRad);
  const cosD = Math.cos(driftRad);

  const coords: [number, number][] = [];

  for (let i = 0; i < numPoints; i++) {
    const theta = (i / numPoints) * 2 * Math.PI;
    const u = Math.cos(theta); // +1 = down-current apex, -1 = upstream tail behind vessel
    const v = Math.sin(theta); // lateral flank direction (-1 = port, +1 = stbd)

    // Interpolate along longitudinal drift axis: from -upstreamBufferKm to +longLengthKm
    const sNormalized = (u + 1) / 2; // 0 at tail, 1 at apex
    const longDistKm = sNormalized * (longLengthKm + upstreamBufferKm) - upstreamBufferKm;

    // Asymmetric lateral expansion profile:
    // Starts with non-zero width wrapping the vessel, expands into a hydrodynamic teardrop,
    // and gently tapers at the leading crest
    const profile = Math.sin(Math.pow(sNormalized, 0.62) * Math.PI);
    const baseWidthKm = nearVesselWidthKm * (1 - sNormalized * 0.45) + maxLateralWidthKm * profile;

    // Multi-frequency hydrodynamic turbulence (Kelvin-Helmholtz & ocean swell harmonics)
    let turbulence = 1.0;
    for (let h = 0; h < harmonicWeights.length; h++) {
      const hw = harmonicWeights[h];
      const wave = Math.sin(theta * hw.freq + hw.phaseOffset + animPhase * hw.speed);
      turbulence += hw.amp * wave;
    }
    turbulence = Math.max(0.68, Math.min(1.42, turbulence));

    const lateralDistKm = (baseWidthKm * 0.5 * turbulence) * v;
    const finalLongDistKm = longDistKm * (u < 0 ? 1 : turbulence * 0.95);

    // Project rotated vector along drift trajectory
    const dEastKm = finalLongDistKm * sinD + lateralDistKm * cosD;
    const dNorthKm = finalLongDistKm * cosD - lateralDistKm * sinD;

    const lat = centerLat + dNorthKm / kmPerDegLat;
    const lng = centerLng + dEastKm / kmPerDegLng;
    coords.push([lng, lat]);
  }

  // Ensure closed polygon
  if (coords.length > 0) {
    coords.push([coords[0][0], coords[0][1]]);
  }

  return coords;
}

/**
 * Calculates a dynamic ocean-surface oil slick featuring 3 distinct concentration zones:
 * 1. High concentration: Dark, dense, viscous crude wrapping the vessel and ruptured tank.
 * 2. Medium concentration: Semi-transparent chocolate mousse / emulsified patches spreading outward.
 * 3. Low concentration: Light, fragmented iridescent sheen traces gradually dispersing into the ocean.
 * Also includes detached floating sheen islands and the ruptured tank injection jet.
 */
export function generateDynamicOceanSlick(params: OceanSlickParams): {
  highConcentration: GeoJSON.Feature<GeoJSON.Polygon, SlickZoneProperties>;
  mediumConcentration: GeoJSON.Feature<GeoJSON.Polygon, SlickZoneProperties>;
  lowConcentration: GeoJSON.Feature<GeoJSON.Polygon, SlickZoneProperties>;
  fragmentedPatches: GeoJSON.FeatureCollection<GeoJSON.Polygon, SlickZoneProperties>;
  breachJet: GeoJSON.Feature<GeoJSON.Polygon, SlickZoneProperties>;
} {
  const {
    originLat,
    originLng,
    vesselHeadingDeg,
    envConditions,
    elapsedHours,
    seepageRateTonnesPerHour,
    initialTonnes,
    animPhase,
  } = params;

  // Hydrodynamic net drift vector: Current (100%) + Wind leeway (~3.2%)
  const currentSpeed = envConditions?.currentSpeedKts ?? 2.8;
  const currentDirRad = ((envConditions?.currentDirectionDeg ?? 135) * Math.PI) / 180;
  const windSpeed = envConditions?.windSpeedKts ?? 15;
  const windDirRad = ((envConditions?.windDirectionDeg ?? 45) * Math.PI) / 180;

  const uNet = currentSpeed * Math.sin(currentDirRad) + (windSpeed * 0.032) * Math.sin(windDirRad);
  const vNet = currentSpeed * Math.cos(currentDirRad) + (windSpeed * 0.032) * Math.cos(windDirRad);
  const netDriftRad = Math.atan2(uNet, vNet);

  const time = Math.max(0.2, elapsedHours);
  const totalTonnes = initialTonnes + seepageRateTonnesPerHour * time;

  // Scale dimensions organically based on total spilled volume and elapsed weathering time
  const scaleFactor = Math.pow(totalTonnes / 100, 0.22) * Math.pow(time / 24, 0.48);

  // -------------------------------------------------------------
  // ZONE 1: HIGH CONCENTRATION (> 200 µm) - Dark, dense crude
  // Closest to the spill source, wrapping the hull and breached tank
  // -------------------------------------------------------------
  const highLengthKm = Math.max(0.45, 0.65 * scaleFactor);
  const highMaxWidthKm = Math.max(0.24, 0.38 * scaleFactor);
  const highNearVesselWidthKm = 0.18;
  const highBackBufferKm = 0.12;

  const highHarmonics = [
    { freq: 4, amp: 0.14, speed: 1.2, phaseOffset: 0.3 },
    { freq: 7, amp: 0.08, speed: 1.8, phaseOffset: 1.1 },
    { freq: 2, amp: 0.12, speed: 0.6, phaseOffset: 2.4 },
  ];

  const highCoords = createOrganicBoundary(
    originLat,
    originLng,
    netDriftRad,
    highLengthKm,
    highMaxWidthKm,
    highNearVesselWidthKm,
    highBackBufferKm,
    highHarmonics,
    animPhase,
    52
  );

  const highConcentration: GeoJSON.Feature<GeoJSON.Polygon, SlickZoneProperties> = {
    type: 'Feature',
    properties: {
      zone: 'high',
      label: 'High Concentration Core (Concentrated Red)',
      description: 'Dense viscous crude directly surrounding rupture source & ship hull',
      thicknessMicrons: 380,
      colorHex: '#dc2626',
      edgeColorHex: '#f87171',
      fillOpacity: 0.94,
      edgeWidth: 2.2,
      edgeBlur: 1.2,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [highCoords],
    },
  };

  // -------------------------------------------------------------
  // ZONE 2: MEDIUM CONCENTRATION (10 - 200 µm) - Vibrant Orange Mousse
  // Spreading outward with organic Kelvin-Helmholtz shear lobes
  // -------------------------------------------------------------
  const medLengthKm = Math.max(1.1, 1.75 * scaleFactor);
  const medMaxWidthKm = Math.max(0.55, 0.95 * scaleFactor);
  const medNearVesselWidthKm = 0.32;
  const medBackBufferKm = 0.22;

  const medHarmonics = [
    { freq: 3, amp: 0.18, speed: 1.0, phaseOffset: 0.8 },
    { freq: 6, amp: 0.14, speed: 1.5, phaseOffset: 1.9 },
    { freq: 9, amp: 0.09, speed: 2.2, phaseOffset: 0.4 },
    { freq: 2, amp: 0.15, speed: 0.5, phaseOffset: 3.1 },
  ];

  const medCoords = createOrganicBoundary(
    originLat,
    originLng,
    netDriftRad,
    medLengthKm,
    medMaxWidthKm,
    medNearVesselWidthKm,
    medBackBufferKm,
    medHarmonics,
    animPhase,
    64
  );

  const mediumConcentration: GeoJSON.Feature<GeoJSON.Polygon, SlickZoneProperties> = {
    type: 'Feature',
    properties: {
      zone: 'medium',
      label: 'Medium Concentration Emulsion (Vibrant Orange)',
      description: 'Vibrant orange mousse & viscous patches spreading outward',
      thicknessMicrons: 75,
      colorHex: '#ea580c',
      edgeColorHex: '#f97316',
      fillOpacity: 0.72,
      edgeWidth: 1.8,
      edgeBlur: 2.4,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [medCoords],
    },
  };

  // -------------------------------------------------------------
  // ZONE 3: LOW CONCENTRATION (0.1 - 10 µm) - Light Orange Sheen
  // Light, fragmented orange sheen film gradually dispersing into the ocean
  // -------------------------------------------------------------
  const lowLengthKm = Math.max(2.4, 3.85 * scaleFactor);
  const lowMaxWidthKm = Math.max(1.1, 1.85 * scaleFactor);
  const lowNearVesselWidthKm = 0.52;
  const lowBackBufferKm = 0.38;

  const lowHarmonics = [
    { freq: 2, amp: 0.22, speed: 0.7, phaseOffset: 1.4 },
    { freq: 5, amp: 0.19, speed: 1.3, phaseOffset: 2.8 },
    { freq: 8, amp: 0.15, speed: 1.9, phaseOffset: 0.9 },
    { freq: 11, amp: 0.10, speed: 2.6, phaseOffset: 3.5 },
  ];

  const lowCoords = createOrganicBoundary(
    originLat,
    originLng,
    netDriftRad,
    lowLengthKm,
    lowMaxWidthKm,
    lowNearVesselWidthKm,
    lowBackBufferKm,
    lowHarmonics,
    animPhase,
    72
  );

  const lowConcentration: GeoJSON.Feature<GeoJSON.Polygon, SlickZoneProperties> = {
    type: 'Feature',
    properties: {
      zone: 'low',
      label: 'Low Concentration Sheen (Light Orange)',
      description: 'Light orange iridescent film dispersing smoothly into open seawater',
      thicknessMicrons: 3.5,
      colorHex: '#fb923c',
      edgeColorHex: '#fdba74',
      fillOpacity: 0.38,
      edgeWidth: 1.2,
      edgeBlur: 3.6,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [lowCoords],
    },
  };

  // -------------------------------------------------------------
  // DETACHED FRAGMENTED SHEEN PATCHES & WISPS (Orange Sheen)
  // Small organic drifting oil islands peeled off by turbulent wave action
  // -------------------------------------------------------------
  const kmPerDegLat = 111.0;
  const kmPerDegLng = 111.0 * Math.cos((originLat * Math.PI) / 180);
  const sinD = Math.sin(netDriftRad);
  const cosD = Math.cos(netDriftRad);

  const fragmentOffsets = [
    { distFrac: 0.72, latOffsetKm: 0.65, radiusKm: 0.24, lobes: 4, speed: 1.4, color: '#ea580c', opacity: 0.45 },
    { distFrac: 0.85, latOffsetKm: -0.58, radiusKm: 0.28, lobes: 5, speed: 1.2, color: '#f97316', opacity: 0.40 },
    { distFrac: 0.94, latOffsetKm: 0.35, radiusKm: 0.22, lobes: 3, speed: 1.6, color: '#fb923c', opacity: 0.36 },
    { distFrac: 1.05, latOffsetKm: -0.25, radiusKm: 0.32, lobes: 6, speed: 1.1, color: '#fb923c', opacity: 0.32 },
    { distFrac: 1.14, latOffsetKm: 0.45, radiusKm: 0.20, lobes: 4, speed: 1.7, color: '#fdba74', opacity: 0.28 },
    { distFrac: 0.55, latOffsetKm: 0.85, radiusKm: 0.18, lobes: 3, speed: 1.5, color: '#ea580c', opacity: 0.48 },
    { distFrac: 0.62, latOffsetKm: -0.80, radiusKm: 0.19, lobes: 4, speed: 1.3, color: '#f97316', opacity: 0.44 },
  ];

  const fragmentFeatures: GeoJSON.Feature<GeoJSON.Polygon, SlickZoneProperties>[] = [];

  fragmentOffsets.forEach((frag, idx) => {
    // Drifting position
    const centerDistKm = frag.distFrac * lowLengthKm;
    // Small undulating wander
    const wander = Math.sin(animPhase * frag.speed + idx * 1.5) * 0.08 * lowMaxWidthKm;
    const finalLatKm = frag.latOffsetKm + wander;

    const eastKm = centerDistKm * sinD + finalLatKm * cosD;
    const northKm = centerDistKm * cosD - finalLatKm * sinD;

    const fLat = originLat + northKm / kmPerDegLat;
    const fLng = originLng + eastKm / kmPerDegLng;

    const pts = 24;
    const ring: [number, number][] = [];
    for (let p = 0; p < pts; p++) {
      const a = (p / pts) * 2 * Math.PI;
      const w = Math.sin(a * frag.lobes + animPhase * 1.4 + idx) * 0.25;
      const r = frag.radiusKm * (1 + w);

      const dE = r * Math.sin(a);
      const dN = r * Math.cos(a);

      ring.push([fLng + dE / kmPerDegLng, fLat + dN / kmPerDegLat]);
    }
    if (ring.length > 0) ring.push([ring[0][0], ring[0][1]]);

    fragmentFeatures.push({
      type: 'Feature',
      properties: {
        zone: 'fragment',
        label: `Fragmented Slick Island #${idx + 1}`,
        description: 'Detached orange sheen patch broken off by ocean wave turbulence',
        thicknessMicrons: 1.5,
        colorHex: frag.color,
        edgeColorHex: '#fed7aa',
        fillOpacity: frag.opacity,
        edgeWidth: 1.0,
        edgeBlur: 2.0,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [ring],
      },
    });
  });

  // -------------------------------------------------------------
  // BREACH JET / HIGH-VELOCITY EMITTER STREAM (Concentrated Red)
  // Concentrated fluid pulse emerging from the portside breach of Tank #3
  // -------------------------------------------------------------
  const shipRad = (vesselHeadingDeg * Math.PI) / 180;
  // Portside beam offset from center of ship (approx 16m beam + 30m aft of bow)
  const portAngle = shipRad - Math.PI * 0.5;
  const portDistMeters = 24; // hull half-breadth
  const portDLat = (portDistMeters / 1000) * Math.cos(portAngle) / kmPerDegLat;
  const portDLng = (portDistMeters / 1000) * Math.sin(portAngle) / kmPerDegLng;

  const breachLat = originLat + portDLat;
  const breachLng = originLng + portDLng;

  // Small organic tongue/jet extending into the high core
  const jetPointsCount = 18;
  const jetCoords: [number, number][] = [];
  const jetLengthKm = 0.14;
  const jetWidthKm = 0.05;

  for (let j = 0; j < jetPointsCount; j++) {
    const a = (j / jetPointsCount) * 2 * Math.PI;
    const u = Math.cos(a);
    const v = Math.sin(a);

    const s = ((u + 1) / 2) * jetLengthKm;
    const w = jetWidthKm * Math.sin(((u + 1) / 2) * Math.PI) * (1 + 0.2 * Math.sin(a * 3 + animPhase * 2.5));

    const jLong = s;
    const jLat = w * v;

    const dE = jLong * sinD + jLat * cosD;
    const dN = jLong * cosD - jLat * sinD;

    jetCoords.push([breachLng + dE / kmPerDegLng, breachLat + dN / kmPerDegLat]);
  }
  if (jetCoords.length > 0) jetCoords.push([jetCoords[0][0], jetCoords[0][1]]);

  const breachJet: GeoJSON.Feature<GeoJSON.Polygon, SlickZoneProperties> = {
    type: 'Feature',
    properties: {
      zone: 'breach_jet',
      label: 'Breach Tank Rupture Jet',
      description: 'Active continuous fluid discharge from Cargo Tank #3',
      thicknessMicrons: 500,
      colorHex: '#b91c1c',
      edgeColorHex: '#f87171',
      fillOpacity: 0.96,
      edgeWidth: 1.6,
      edgeBlur: 0.5,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [jetCoords],
    },
  };

  return {
    highConcentration,
    mediumConcentration,
    lowConcentration,
    fragmentedPatches: {
      type: 'FeatureCollection',
      features: fragmentFeatures,
    },
    breachJet,
  };
}
