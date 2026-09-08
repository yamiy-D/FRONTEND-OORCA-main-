/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WindData {
  speed: number;        // in meters per second (m/s)
  direction: number;    // meteorological origin direction in degrees (0 - 360)
  speedKts: number;     // in knots
  gusts?: number;       // in meters per second (m/s)
}

export interface OceanCurrentData {
  speed: number;        // in meters per second (m/s)
  direction: number;    // oceanographic flow heading in degrees (0 - 360)
  speedKts: number;     // in knots
}

export interface WaveData {
  height: number;       // significant wave height in meters
  direction?: number;   // mean wave direction in degrees
  period?: number;      // wave period in seconds
}

export interface EnvironmentalMetadata {
  source: string;       // e.g. "Open-Meteo Marine & ECMWF IFS" or "NOAA GFS"
  status: 'observed' | 'estimated' | 'cached';
  confidence: 'high' | 'medium' | 'low';
  fetchedAt: string;    // ISO timestamp
  notes?: string;
}

export interface NormalizedEnvironmentalData {
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;     // ISO UTC timestamp
  wind: WindData;
  oceanCurrent: OceanCurrentData;
  temperature: number;   // Sea surface temperature in Celsius
  airTemperature: number;// Air temperature in Celsius
  waveHeight: number;    // in meters
  waves?: WaveData;
  metadata: EnvironmentalMetadata;
}
