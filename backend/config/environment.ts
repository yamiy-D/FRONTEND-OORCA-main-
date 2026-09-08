/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  host: '0.0.0.0',
  environment: process.env.NODE_ENV || 'development',
  
  // API Keys (Optional - Open-Meteo works open-source without keys)
  weatherApiKey: process.env.WEATHER_API_KEY || process.env.VITE_WEATHER_API_KEY || '',
  oceanDataApiKey: process.env.OCEAN_DATA_API_KEY || process.env.VITE_OCEAN_DATA_API_KEY || '',
  noaaApiKey: process.env.NOAA_API_KEY || '',
  copernicusApiKey: process.env.COPERNICUS_API_KEY || '',
  
  // Caching Configuration
  cache: {
    weatherTtlMs: 1000 * 60 * 30,     // 30 minutes
    oceanTtlMs: 1000 * 60 * 60,       // 1 hour
    geographicTtlMs: 1000 * 60 * 60 * 24, // 24 hours
    simulationTtlMs: 1000 * 60 * 60 * 6,  // 6 hours
  },

  // Hydrodynamic & Physical Constants
  physics: {
    windDriftFactor: 0.032, // 3.2% of 10m wind speed
    coriolisFactor: 0.08,   // deflection fraction in Northern Hemisphere
    seaWaterDensityKgM3: 1025,
    airDensityKgM3: 1.225,
    gravity: 9.81,
  },
};
