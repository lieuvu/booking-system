// Library
import express from 'express';

// App
import MachineController from '@controllers/machine';
import { validateId } from '@src/middlewares/params-validator';
import { validateRequestBody } from '@src/middlewares/body-validator';

// Router
const router = express.Router();

// Route
router.post('/',
  validateRequestBody([
    '@schemas/machine/machine-common.json',
    '@schemas/machine/machine-post.json'
  ]),
  MachineController.createMachine
);

router.get('/:id', validateId, MachineController.getMachine);

router.put('/:id',
  validateId,
  validateRequestBody([
    '@schemas/machine/machine-common.json',
    '@schemas/machine/machine-put.json'
  ]),
  MachineController.updateMachine
);

router.delete('/:id', validateId, MachineController.deleteMachine);

// Export
export { router as machineRoute };
