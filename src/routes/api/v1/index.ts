// Library
import * as express from 'express';

// Typescript
import { userRoute } from '@src/routes/api/v1/user'

// Router
const router = express.Router();

// Routes
router.use('/user', userRoute);

// Export
export { router as v1Route };
