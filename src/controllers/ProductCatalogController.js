import ProductCatalogService from '../services/ProductCatalogService.js';
import { ApiError } from '../middleware/errorMiddleware.js';
import { logger } from '../middleware/logging.js';
import { sanitizeProduct } from '../utils/sanitizers.js';

export class ProductCatalogController {
    /**
     * @desc    Create new product
     * @route   POST /api/v1/products
     * @access  Private/ProductManager
     */
    static async createProduct(req, res, next) {
        try {
            const product = await ProductCatalogService.createProduct({
                ...req.body,
                organization: req.user.organization,
                createdBy: req.user.id
            });

            logger.info(`Product created: ${product.sku}`, {
                user: req.user.id,
                organization: req.user.organization
            });

            res.status(201).json({
                success: true,
                data: sanitizeProduct(product),
                meta: {
                    variants: product.variants.length,
                    categories: product.categories.length
                }
            });
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }

    /**
     * @desc    Get product by ID or SKU
     * @route   GET /api/v1/products/:identifier
     * @access  Public/Private
     */
    static async getProduct(req, res, next) {
        try {
            const product = await ProductCatalogService.getProduct(
                req.params.identifier,
                req.user?.organization
            );

            if (!product) {
                throw new ApiError(404, 'Product not found');
            }

            // Track view for authenticated users
            if (req.user) {
                await ProductCatalogService.trackProductView(
                    product._id,
                    req.user.id,
                    req.user.organization
                );
            }

            res.json({
                success: true,
                data: sanitizeProduct(product, req.user?.role),
                meta: {
                    cache: req.cacheStatus,
                    views: product.views
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Update product inventory
     * @route   PATCH /api/v1/products/:id/inventory
     * @access  Private/InventoryManager
     */
    static async updateInventory(req, res, next) {
        try {
            const inventoryUpdate = await ProductCatalogService.updateInventory(
                req.params.id,
                req.body,
                req.user.organization
            );

            res.json({
                success: true,
                data: {
                    stock: inventoryUpdate.newStock,
                    previousStock: inventoryUpdate.previousStock
                },
                meta: {
                    variant: inventoryUpdate.variant,
                    warehouse: inventoryUpdate.warehouseLocation
                }
            });
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }

    /**
     * @desc    Search products
     * @route   GET /api/v1/products/search
     * @access  Public
     */
    static async searchProducts(req, res, next) {
        try {
            const { q: query, page = 1, limit = 25, sort = '-rating' } = req.query;

            const { products, total, facets } = await ProductCatalogService.searchProducts({
                query,
                page: parseInt(page),
                limit: parseInt(limit),
                sort,
                organization: req.user?.organization,
                filters: req.query
            });

            res.json({
                success: true,
                data: products.map(sanitizeProduct),
                meta: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit),
                    searchQuery: query,
                    facets
                }
            });
        } catch (error) {
            next(new ApiError(400, 'Invalid search parameters'));
        }
    }

    /**
     * @desc    Add product review
     * @route   POST /api/v1/products/:id/reviews
     * @access  Private/Customer
     */
    static async addReview(req, res, next) {
        try {
            const review = await ProductCatalogService.addReview(
                req.params.id,
                {
                    ...req.body,
                    userId: req.user.id,
                    organization: req.user.organization
                }
            );

            res.status(201).json({
                success: true,
                data: review,
                meta: {
                    newRating: review.productRating
                }
            });
        } catch (error) {
            next(new ApiError(403, error.message));
        }
    }

    /**
     * @desc    Get product variants
     * @route   GET /api/v1/products/:id/variants
     * @access  Public
     */
    static async getVariants(req, res, next) {
        try {
            const variants = await ProductCatalogService.getProductVariants(
                req.params.id,
                req.user?.organization
            );

            res.json({
                success: true,
                data: variants,
                meta: {
                    count: variants.length
                }
            });
        } catch (error) {
            next(new ApiError(404, 'Product not found'));
        }
    }

    /**
     * @desc    Bulk update products
     * @route   PATCH /api/v1/products/bulk
     * @access  Private/ProductManager
     */
    static async bulkUpdate(req, res, next) {
        try {
            const { updateCount, matchedCount } = await ProductCatalogService.bulkUpdate(
                req.body,
                req.user.organization
            );

            res.json({
                success: true,
                data: null,
                meta: {
                    updated: updateCount,
                    matched: matchedCount
                }
            });
        } catch (error) {
            next(new ApiError(400, 'Bulk update failed'));
        }
    }

    /**
     * @desc    Get related products
     * @route   GET /api/v1/products/:id/related
     * @access  Public
     */
    static async getRelatedProducts(req, res, next) {
        try {
            const relatedProducts = await ProductCatalogService.getRelatedProducts(
                req.params.id,
                req.user?.organization,
                parseInt(req.query.limit) || 5
            );

            res.json({
                success: true,
                data: relatedProducts.map(sanitizeProduct),
                meta: {
                    sourceProduct: req.params.id,
                    count: relatedProducts.length
                }
            });
        } catch (error) {
            next(new ApiError(404, 'Product not found'));
        }
    }
}

export default ProductCatalogController;