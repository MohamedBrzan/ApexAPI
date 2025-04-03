import { Router } from 'express';
import PostController from '../controllers/PostController.js';
import IsAuthenticated from '../middleware/IsAuthenticated.js';
import { createPostSchema, listPostsSchema } from '../validations/postValidations.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router();

router.post(
    '/posts',
    IsAuthenticated(),
    validate(createPostSchema),
    PostController.createPost
);

router.get(
    '/posts/:id',
    validate(listPostsSchema),
    PostController.getPost
);

router.put(
    '/posts/:id/views',
    PostController.incrementViews
);

export default router;