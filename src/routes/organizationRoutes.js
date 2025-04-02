import { Router } from 'express';
import OrganizationController from '../controllers/OrganizationController.js';
import IsAuthenticated from '../middleware/IsAuthenticated.js';
import { createOrganizationSchema, updateSubscriptionSchema } from '../validations/organizationValidations.js';
import { validate } from '../middleware/validationMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = Router();

router.post(
    '/organizations',
    IsAuthenticated,
    validate(createOrganizationSchema),
    OrganizationController.createOrganization
);

router.put(
    '/organizations/:id/subscription',
    IsAuthenticated,
    roleMiddleware(['admin']),
    validate(updateSubscriptionSchema),
    OrganizationController.updateSubscription
);

router.get(
    '/organizations/:id/audit',
    IsAuthenticated,
    OrganizationController.getAuditLogs
);

export default router;