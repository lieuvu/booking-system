// Library
import express from 'express';

// App
import MachineTypeController from '@controllers/machine-type';
import { validateId } from '@src/middlewares/params-validator';
import { validateRequestBody } from '@src/middlewares/body-validator';

// Router
const router = express.Router();

// Route
router.post('/',
  validateRequestBody([
    '@schemas/machine-type/machine-type-common.json',
    '@schemas/machine-type/machine-type-post.json'
  ]),
  MachineTypeController.createMachineType
);

router.get('/:id', validateId, MachineTypeController.getMachineType);

router.put('/:id',
  validateId,
  validateRequestBody([
    '@schemas/machine-type/machine-type-common.json',
    '@schemas/machine-type/machine-type-put.json'
  ]),
  MachineTypeController.updateMachineType
);

router.delete('/:id', validateId, MachineTypeController.deleteMachineType);

// Export
export { router as machineTypeRoute };
