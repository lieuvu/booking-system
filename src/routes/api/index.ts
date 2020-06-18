// Library
import express from 'express';
const router: express.Router = express.Router();

// App
import { healthRoute } from '@routes/api/health';
import { v1Route } from '@routes/api/v1';

// Routes
router.use('/health', healthRoute);
router.use('/v1', v1Route);

// Export
export { router as apiRoute };
