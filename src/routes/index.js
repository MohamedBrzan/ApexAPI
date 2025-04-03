import { Router } from 'express';
import userRoutes from './userRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import commentRoutes from './commentRoutes.js';
import eventLogRoutes from './eventLogRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import organizationRoutes from './organizationRoutes.js';
import postRoutes from './postRoutes.js';
import apiRequestRoutes from './apiRequestRoutes.js';
import productCatalogRoutes from './productCatalogRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import { errorHandler } from '../middleware/errorMiddleware.js';

const router = Router();

router.use('/api/v1/auth', userRoutes);
router.use('/api/v1/analytics', analyticsRoutes);
router.use('/api/v1/comments', commentRoutes);
router.use('/api/v1/events', eventLogRoutes);
router.use('/api/v1/notifications', notificationRoutes);
router.use('/api/v1/organizations', organizationRoutes);
router.use('/api/v1/posts', postRoutes);
router.use('/api/v1/requests', apiRequestRoutes);
router.use('/api/v1/products', productCatalogRoutes);
router.use('/api/v1/categories', categoryRoutes);

router.use(errorHandler);

export default router;