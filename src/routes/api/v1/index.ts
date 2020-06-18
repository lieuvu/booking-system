// Library
import express from 'express';

// App
import { bookingRoute } from '@routes/api/v1/booking';
import { buildingAddressRoute } from '@routes/api/v1/building-address';
import { machineRoute } from '@routes/api/v1/machine';
import { machineLocationRoute } from '@routes/api/v1/machine-location';
import { machineTypeRoute } from '@routes/api/v1/machine-type';
import { userRoute } from '@routes/api/v1/user';
import { userAddressRoute } from '@routes/api/v1/user-address';

// Router
const router = express.Router();

// Routes
router.use('/booking', bookingRoute);
router.use('/building-address', buildingAddressRoute);
router.use('/machine', machineRoute);
router.use('/machine-location', machineLocationRoute);
router.use('/machine-type', machineTypeRoute);
router.use('/user', userRoute);
router.use('/user-address', userAddressRoute);

// Export
export { router as v1Route };
