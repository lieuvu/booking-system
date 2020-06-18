// Library
import express from 'express';

// App
import UserAddressController from '@controllers/user-address';
import { validateId } from '@src/middlewares/params-validator';
import { validateRequestBody } from '@src/middlewares/body-validator';
import { validateQueryParams } from '@src/middlewares/query-params-validator';

// Router
const router = express.Router();

// Route
router.post('/',
  validateRequestBody([
    '@schemas/user-address/user-address-common.json',
    '@schemas/user-address/user-address-post.json'
  ]),
  UserAddressController.createUserAddress
);

router.get('/:id', validateId, UserAddressController.getUserAddress);

router.get('/',
  validateQueryParams('@schemas/user-address/user-address-query-params.json'),
  UserAddressController.getUserAddressByQuery
);

router.put('/',
  validateQueryParams('@schemas/user-address/user-address-query-params.json'),
  validateRequestBody([
    '@schemas/user-address/user-address-common.json',
    '@schemas/user-address/user-address-put.json'
  ]),
  UserAddressController.updateUserAddress
);

// Export
export { router as userAddressRoute };
