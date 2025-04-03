import Category from '../models/Category.js';

export default class CategoryService {
    /**
     * Create a new category.
     * @param {Object} data - The category data.
     * @returns {Promise<Object>} - The created category.
     */
    static async createCategory(data) {
        const category = await Category.create(data);
        return category;
    }

    /**
     * Get a single category by its ID.
     * @param {String} categoryId - The ID of the category.
     * @returns {Promise<Object|null>} - The found category or null.
     */
    static async getCategory(categoryId) {
        return await Category.findById(categoryId)
            .populate('parent', 'name')
            .populate('children', 'name')
            .lean();
    }

    /**
     * Get all categories.
     * Optionally, you can pass query parameters for pagination or filtering.
     * @param {Object} [query={}] - The query object.
     * @returns {Promise<Array>} - Array of categories.
     */
    static async getCategories(query = {}) {
        return await Category.find(query)
            .sort({ createdAt: -1 })
            .lean();
    }

    /**
     * Update a category by its ID.
     * @param {String} categoryId - The ID of the category.
     * @param {Object} data - The new data for the category.
     * @returns {Promise<Object|null>} - The updated category or null if not found.
     */
    static async updateCategory(categoryId, data) {
        return await Category.findByIdAndUpdate(categoryId, data, { new: true });
    }

    /**
     * Delete a category by its ID.
     * @param {String} categoryId - The ID of the category.
     * @returns {Promise<Object|null>} - The deleted category or null if not found.
     */
    static async deleteCategory(categoryId) {
        return await Category.findByIdAndDelete(categoryId);
    }
}
