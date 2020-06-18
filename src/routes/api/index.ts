// Library
import * as express from 'express';
const router: express.Router = express.Router();

// Typescript
import { healthRoute } from '@src/routes/api/health';
import { v1Route } from '@src/routes/api/v1';

// Routes
router.use('/health', healthRoute);
router.use('/v1', v1Route);

// Export
export { router as apiRoute };
