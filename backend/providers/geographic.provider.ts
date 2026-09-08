/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { haversineDistanceKm } from '../utils/geoCalculation';

export interface CoastalFeature {
  name: string;
  lat: number;
  lng: number;
  type: 'port' | 'urban' | 'mangrove' | 'sanctuary' | 'beach';
}

const REGIONAL_COASTAL_POINTS: CoastalFeature[] = [
  { name: 'Mumbai Harbor & Port Trust', lat: 18.9438, lng: 72.8628, type: 'port' },
  { name: 'Jawaharlal Nehru Port (JNPT)', lat: 18.9500, lng: 72.9500, type: 'port' },
  { name: 'Alibag Beach & Marine Zone', lat: 18.6414, lng: 72.8722, type: 'beach' },
  { name: 'Thane Creek Flamingo Sanctuary (Ramsar)', lat: 19.0330, lng: 72.9800, type: 'mangrove' },
  { name: 'Murud Janjira Coastal Biosphere', lat: 18.3000, lng: 72.9600, type: 'sanctuary' },
  { name: 'Kashid Marine Coast', lat: 18.4400, lng: 72.9000, type: 'beach' },
];

export class GeographicProvider {
  /**
   * Determines marine geographic zone and nearest sensitive shoreline feature.
   */
  public static getGeographicContext(lat: number, lng: number): {
    regionName: string;
    nearestCoastKm: number;
    nearestFeature: CoastalFeature;
    isInOpenWater: boolean;
  } {
    let minDistanceKm = Infinity;
    let closestFeature = REGIONAL_COASTAL_POINTS[0];

    for (const point of REGIONAL_COASTAL_POINTS) {
      const dist = haversineDistanceKm(lat, lng, point.lat, point.lng);
      if (dist < minDistanceKm) {
        minDistanceKm = dist;
        closestFeature = point;
      }
    }

    let regionName = 'Offshore Oceanic Waters';
    if (lat >= 17.5 && lat <= 20.5 && lng >= 71.5 && lng <= 73.5) {
      regionName = 'Arabian Sea — Mumbai Offshore Continental Shelf Basin';
    } else if (lat >= 20.5 && lat <= 24.0 && lng >= 68.0 && lng <= 71.0) {
      regionName = 'Gulf of Kachchh Ecological Marine Corridor';
    } else if (lat >= 8.0 && lat <= 15.0 && lng >= 73.0 && lng <= 77.0) {
      regionName = 'Malabar Coastal Maritime Zone';
    }

    return {
      regionName,
      nearestCoastKm: Math.round(minDistanceKm * 10) / 10,
      nearestFeature: closestFeature,
      isInOpenWater: minDistanceKm > 5.0,
    };
  }
}
