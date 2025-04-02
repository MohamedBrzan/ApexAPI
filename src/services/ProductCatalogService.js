import ProductCatalog from '../models/ProductCatalog.js';

export default class ProductCatalogService {
    static async updateInventory(sku, variantIndex, quantity) {
        const updatePath = `variants.${variantIndex}.inventory.stock`;
        return ProductCatalog.findOneAndUpdate(
            { sku },
            { $inc: { [updatePath]: quantity } },
            { new: true }
        );
    }

    static async searchProducts(orgId, query) {
        return ProductCatalog.find(
            {
                organization: orgId,
                $text: { $search: query }
            },
            { score: { $meta: 'textScore' } }
        ).sort({ score: { $meta: 'textScore' } });
    }

    static async addProductReview(productId, reviewData) {
        return ProductCatalog.findByIdAndUpdate(
            productId,
            { $push: { reviews: reviewData } },
            { new: true }
        );
    }
}