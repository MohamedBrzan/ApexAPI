import { Router } from 'express';
import ProductCatalogController from '../controllers/ProductCatalogController.js';
import IsAuthenticated from '../middleware/IsAuthenticated.js';
import { createProductSchema, searchProductsSchema, updateInventorySchema, } from '../validations/productValidations.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router();

router.get(
    '/',
    IsAuthenticated(),
    ProductCatalogController.getAllProducts
);

router.get(
    '/:id',
    IsAuthenticated(),
    ProductCatalogController.getProductById
);

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
    '/update/:id/inventory',
    IsAuthenticated(),
    validate(updateInventorySchema),
    ProductCatalogController.updateInventory
);

router.delete(
    '/delete/:id',
    IsAuthenticated(),
    ProductCatalogController.deleteProduct
);

export default router;