/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { EnvironmentController } from '../controllers/environment.controller';

const router = Router();

// GET /api/environment?latitude=...&longitude=...&timestamp=...
router.get('/', EnvironmentController.getEnvironment);

export default router;
