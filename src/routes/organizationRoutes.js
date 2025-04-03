import { Router } from 'express';
import OrganizationController from '../controllers/OrganizationController.js';
import IsAuthenticated from '../middleware/IsAuthenticated.js';
import { createOrganizationSchema, updateSubscriptionSchema } from '../validations/organizationValidations.js';
import { validate } from '../middleware/validationMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = Router();

router.post(
    '/create',
    IsAuthenticated(),
    validate(createOrganizationSchema),
    OrganizationController.createOrganization
);

router.put(
    '/update/:id',
    IsAuthenticated(),
    roleMiddleware(['admin']),
    validate(updateSubscriptionSchema),
    OrganizationController.updateSubscription
);

router.get(
    '/:id/audit',
    IsAuthenticated(),
    OrganizationController.getAuditLogs
);


router.get(
    '/:id',
    IsAuthenticated(),
    OrganizationController.getOrganization
);

router.delete(
    '/delete/:id',
    IsAuthenticated(),
    roleMiddleware(['admin']),
    OrganizationController.deleteOrganization
);

export default router;