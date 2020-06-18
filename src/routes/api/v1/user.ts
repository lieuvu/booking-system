// Library
import express from 'express';

// App
import UserController from '@controllers/user';
import { validateId } from '@src/middlewares/params-validator';
import { validateRequestBody } from '@src/middlewares/body-validator';

// Router
const router = express.Router();

// Route
router.post('/',
  validateRequestBody([
    '@schemas/user/user-common.json',
    '@schemas/user/user-post.json',
  ]),
  UserController.createUser
);

router.get('/:id', validateId, UserController.getUser);

router.put('/:id',
  validateId,
  validateRequestBody([
    '@schemas/user/user-common.json',
    '@schemas/user/user-put.json',
  ]),
  UserController.updateUser
);

router.delete('/:id', validateId, UserController.deleteUser);

// Export
export { router as userRoute };
