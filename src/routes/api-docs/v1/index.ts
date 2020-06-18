// Library
import express from 'express';
import swaggerUI from 'swagger-ui-express';

// App
import { prepareSwaggerDoc } from '@routes/api-docs/v1/api-support';

// Router
const router = express.Router();

// Routes
router.use('/', swaggerUI.serve);
router.get('/', prepareSwaggerDoc, swaggerUI.serve, swaggerUI.setup());

// Export
export { router as v1DocRoute };
