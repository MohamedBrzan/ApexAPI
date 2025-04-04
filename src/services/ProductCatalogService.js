import ProductCatalog from '../models/ProductCatalog.js';

export default class ProductCatalogService {

    static async getAllProducts({ page, limit, sort, organization }) {
        const options = {
            page: page || 1,
            limit: limit || 25,
            sort: sort || '-createdAt',
            populate: 'variants'
        };

        return ProductCatalog.find({ organization })
            .sort(options.sort)
            .skip((options.page - 1) * options.limit)
            .limit(options.limit);
    }

    static async getAllProductsByOrgId(orgId) {
        return ProductCatalog.find({ organization: orgId }).populate('variants');
    }

    static async createProduct(productData) {
        const product = new ProductCatalog(productData);
        return product.save();
    }

    static async updateInventory(sku, updateObj, quantity) {
        return ProductCatalog.findOneAndUpdate(
            { sku },
            updateObj,
            { new: true }
        );
    }

    static async updateProduct(productId, updateObj) {
        return ProductCatalog.findByIdAndUpdate(
            productId,
            updateObj,
            { new: true }
        );
    }

    static async deleteProduct(productId) {
        return ProductCatalog.findByIdAndDelete(productId);
    }

    static async getProductById(productId) {
        return ProductCatalog.findById(productId);
    }

    static async getProductsByOrganization(orgId) {
        return ProductCatalog.find({ organization: orgId });
    }

    static async getProductsByCategory(orgId, category) {
        return ProductCatalog.find({
            organization: orgId,
            categories: { $in: [category] }
        });
    }

    static async getProductsByTag(orgId, tag) {
        return ProductCatalog.find({
            organization: orgId,
            tags: { $in: [tag] }
        });
    }

    static async getProductsByBrand(orgId, brand) {
        return ProductCatalog.find({
            organization: orgId,
            brand
        });
    }

    static async getProductsBySKU(orgId, sku) {
        return ProductCatalog.find({
            organization: orgId,
            sku
        });
    }

    static async getProductsByVendor(orgId, vendor) {
        return ProductCatalog.find({
            organization: orgId,
            vendor
        });
    }

    static async getProductsByType(orgId, type) {
        return ProductCatalog.find({
            organization: orgId,
            type
        });
    }

    static async getProductsByPriceRange(orgId, minPrice, maxPrice) {
        return ProductCatalog.find({
            organization: orgId,
            price: { $gte: minPrice, $lte: maxPrice }
        });
    }

    static async getProductsByStock(orgId, inStock) {
        return ProductCatalog.find({
            organization: orgId,
            inStock
        });
    }

    static async getProductsByRating(orgId, minRating) {
        return ProductCatalog.find({
            organization: orgId,
            rating: { $gte: minRating }
        });
    }

    static async getProductsByDate(orgId, startDate, endDate) {
        return ProductCatalog.find({
            organization: orgId,
            createdAt: { $gte: startDate, $lte: endDate }
        });
    }

    static async searchProducts(query) {
        return ProductCatalog.find(
            { $text: { $search: query } },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } });
    }

    static async getProductsBySearch(orgId, searchQuery) {
        return ProductCatalog.find({
            organization: orgId,
            $text: { $search: searchQuery }
        });
    }

    static async getProductsBySKUAndVendor(orgId, sku, vendor) {
        return ProductCatalog.find({
            organization: orgId,
            sku,
            vendor
        });
    }

    static async getProductsBySKUAndBrand(orgId, sku, brand) {
        return ProductCatalog.find({
            organization: orgId,
            sku,
            brand
        });
    }

    static async getProduct(identifier, orgId) {
        return ProductCatalog.findOne({
            $or: [
                { sku: identifier },
                { _id: identifier }
            ],
            organization: orgId
        });
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