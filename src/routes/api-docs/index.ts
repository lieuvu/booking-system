// Library
import express from 'express';
const router: express.Router = express.Router();

// App
import { v1DocRoute } from '@routes/api-docs/v1';

// Routes
router.use('/v1', v1DocRoute);

// Export
export { router as apiDocsRoute };
