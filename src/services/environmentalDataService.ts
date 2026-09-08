/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnvironmentalConditions } from '../types/simulation';

/**
 * Service to fetch or simulate metocean and hydrodynamic conditions.
 * Supports fallback to calibrated DEMO mode when external API keys are missing.
 */
export class EnvironmentalDataService {
  private static instance: EnvironmentalDataService;

  private constructor() {}

  public static getInstance(): EnvironmentalDataService {
    if (!EnvironmentalDataService.instance) {
      EnvironmentalDataService.instance = new EnvironmentalDataService();
    }
    return EnvironmentalDataService.instance;
  }

  public async getConditionsForLocation(lat: number, lng: number): Promise<EnvironmentalConditions> {
    try {
      const response = await fetch(`/api/environment?latitude=${lat}&longitude=${lng}`);
      if (response.ok) {
        const data = await response.json();
        return {
          windSpeedKts: data.wind.speedKts || 14.5,
          windDirectionDeg: data.wind.direction || 245,
          currentSpeedKts: data.oceanCurrent.speedKts || 1.2,
          currentDirectionDeg: data.oceanCurrent.direction || 68,
          waveHeightMeters: data.waveHeight || 1.6,
          waterTemperatureC: data.temperature || 28.5,
          airTemperatureC: data.airTemperature || 31.0,
        };
      }
    } catch (err) {
      console.warn('[EnvironmentalDataService] Failed to query backend /api/environment, using fallback values:', err);
    }

    // Calibrated oceanographic conditions for Arabian Sea / Offshore Mumbai region
    return {
      windSpeedKts: 14.5,
      windDirectionDeg: 245, // Blowing from WSW towards ENE (towards coast)
      currentSpeedKts: 1.2,
      currentDirectionDeg: 68, // Surface current moving ENE towards Alibaug/Mumbai
      waveHeightMeters: 1.6,
      waterTemperatureC: 28.5,
      airTemperatureC: 31.0,
    };
  }
}

export const environmentalDataService = EnvironmentalDataService.getInstance();
