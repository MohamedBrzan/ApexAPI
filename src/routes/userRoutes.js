import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import { validate } from '../middleware/validationMiddleware.js';
import IsAuthenticated from '../middleware/IsAuthenticated.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validations/userValidations.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = Router();

router.post(
    '/register',
    validate(registerSchema),
    UserController.register
);

router.post(
    '/login',
    validate(loginSchema),
    UserController.login
);

router.get(
    '/me',
    IsAuthenticated,
    UserController.getProfile
);

router.patch(
    '/:id',
    IsAuthenticated,
    roleMiddleware(['admin']),
    validate(updateProfileSchema),
    UserController.updateUser
);

router.delete(
    '/:id',
    IsAuthenticated,
    roleMiddleware(['admin']),
    UserController.deleteUser
);

export default router;