import { Router } from 'express';
import CategoryController from '../controllers/CategoryController.js';
import { validate } from '../middleware/validationMiddleware.js';
import { categoryValidationSchema } from '../validations/categoryValidation.js';
import isAuthticated from '../middleware/IsAuthenticated.js';

const router = Router();

// Route to create a new category
router.post('/create', isAuthticated(), validate(categoryValidationSchema), CategoryController.createCategory);

// Route to get all categories
router.get('/', CategoryController.getCategories);

// Route to get a single category by ID
router.get('/:id', CategoryController.getCategory);

// Route to update a category by ID
router.put('/update/:id', isAuthticated(), CategoryController.updateCategory);

// Route to delete a category by ID
router.delete('/delete/:id', isAuthticated(), CategoryController.deleteCategory);

export default router;
