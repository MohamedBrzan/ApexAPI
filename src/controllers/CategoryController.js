import CategoryService from '../services/CategoryService.js';

export default class CategoryController {
    /**
     * Create a new category.
     */
    static async createCategory(req, res, next) {
        try {
            const category = await CategoryService.createCategory(req.body);
            res.status(201).json({
                success: true,
                data: category
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Retrieve a single category by ID.
     */
    static async getCategory(req, res, next) {
        try {
            const category = await CategoryService.getCategory(req.params.id);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json({
                success: true,
                data: category
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Retrieve all categories.
     */
    static async getCategories(req, res, next) {
        try {
            const categories = await CategoryService.getCategories();
            res.json({
                success: true,
                data: categories
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update a category by ID.
     */
    static async updateCategory(req, res, next) {
        try {
            const category = await CategoryService.updateCategory(req.params.id, req.body);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json({
                success: true,
                data: category
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete a category by ID.
     */
    static async deleteCategory(req, res, next) {
        try {
            const category = await CategoryService.deleteCategory(req.params.id);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json({
                success: true,
                message: 'Category deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}
