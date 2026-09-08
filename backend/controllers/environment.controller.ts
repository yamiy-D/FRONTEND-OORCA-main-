/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { EnvironmentalDataService } from '../services/environmentalData.service';

export class EnvironmentController {
  /**
   * GET /api/environment
   * Query params: latitude, longitude, timestamp (optional)
   */
  public static async getEnvironment(req: Request, res: Response): Promise<void> {
    try {
      const { latitude, longitude, timestamp } = req.query;

      if (!latitude || !longitude) {
        res.status(400).json({
          error: 'Missing required query parameters: latitude and longitude are required.',
          example: '/api/environment?latitude=18.9100&longitude=72.7800',
        });
        return;
      }

      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);

      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        res.status(400).json({
          error: `Invalid coordinates: latitude must be between -90 and 90, longitude between -180 and 180. Received (${latitude}, ${longitude}).`,
        });
        return;
      }

      const envData = await EnvironmentalDataService.getNormalizedEnvironment(
        lat,
        lng,
        timestamp ? (timestamp as string) : undefined
      );

      res.status(200).json(envData);
    } catch (err: any) {
      console.error('[EnvironmentController] Error fetching environmental data:', err);
      res.status(500).json({
        error: 'Failed to retrieve environmental conditions',
        details: err.message,
      });
    }
  }
}
