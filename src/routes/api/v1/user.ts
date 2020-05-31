// Library
import * as express from 'express'

// Typescript
import { userController } from '@src/controllers/user';

// Router
const router = express.Router();

// Route
router.get('/', userController.getUser);
router.post('/', userController.createUser)
router.put('/', userController.updateUser)
router.delete('/', userController.deleteUser)

// Export
export { router as userRoute };
