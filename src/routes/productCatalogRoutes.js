import { Router } from 'express';
import ProductCatalogController from '../controllers/ProductCatalogController.js';
import IsAuthenticated from '../middleware/IsAuthenticated.js';
import { createProductSchema, searchProductsSchema, updateInventorySchema, } from '../validations/productValidations.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router();

router.post(
    '/products',
    IsAuthenticated(),
    validate(createProductSchema),
    ProductCatalogController.createProduct
);

router.get(
    '/products/search',
    validate(searchProductsSchema),
    ProductCatalogController.searchProducts
);

router.patch(
    '/products/:id/inventory',
    IsAuthenticated(),
    validate(updateInventorySchema),
    ProductCatalogController.updateInventory
);

export default router;