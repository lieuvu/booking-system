// Library
import express from 'express';

// App
import BuildingAddressController from '@controllers/building-address';
import { validateId } from '@src/middlewares/params-validator';
import { validateRequestBody } from '@src/middlewares/body-validator';

// Router
const router = express.Router();

// Route
router.post('/',
  validateRequestBody([
    '@schemas/building-address/building-address-common.json',
    '@schemas/building-address/building-address-post.json'
  ]),
  BuildingAddressController.createBuildingAddress
);

router.get('/:id', validateId, BuildingAddressController.getBuildingAddress);

router.put('/:id',
  validateId,
  validateRequestBody([
    '@schemas/building-address/building-address-common.json',
    '@schemas/building-address/building-address-put.json'
  ]),
  BuildingAddressController.updateBuildingAddress
);

router.delete('/:id', validateId, BuildingAddressController.deleteBuildingAddress);

// Export
export { router as buildingAddressRoute };
