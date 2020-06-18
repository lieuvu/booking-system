// Library
import express from 'express';

// App
import MachineLocationController from '@controllers/machine-location';
import { validateId } from '@src/middlewares/params-validator';
import { validateRequestBody } from '@src/middlewares/body-validator';
import { validateQueryParams } from '@src/middlewares/query-params-validator';

// Router
const router = express.Router();

// Route
router.post('/',
  validateRequestBody([
    '@schemas/machine-location/machine-location-common.json',
    '@schemas/machine-location/machine-location-post.json'
  ]),
  MachineLocationController.createMachineLocation
);

router.get('/:id', validateId, MachineLocationController.getMachineLocation);

router.get('/',
  validateQueryParams('@schemas/machine-location/machine-location-query-params.json'),
  MachineLocationController.getMachineLocationByQuery
);

router.put('/:id',
  validateId,
  validateRequestBody([
    '@schemas/machine-location/machine-location-common.json',
    '@schemas/machine-location/machine-location-put.json'
  ]),
  MachineLocationController.updateMachineLocation
);

router.delete('/:id', validateId, MachineLocationController.deleteMachineLocation);

// Export
export { router as machineLocationRoute };
