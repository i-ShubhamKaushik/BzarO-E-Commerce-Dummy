import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Secure all user endpoints
router.use(authenticate);

router.get('/me', UsersController.getProfile);
router.patch('/me', UsersController.updateProfile);
router.patch('/me/password', UsersController.updatePassword);
router.patch('/me/preferences', UsersController.updatePreferences);

// Addresses routes
router.get('/me/addresses', UsersController.getAddresses);
router.post('/me/addresses', UsersController.createAddress);
router.patch('/me/addresses/:id', UsersController.updateAddress);
router.delete('/me/addresses/:id', UsersController.deleteAddress);

export default router;
