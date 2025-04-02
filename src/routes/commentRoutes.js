import { Router } from 'express';
import CommentController from '../controllers/CommentController.js';
import IsAuthenticated from '../middleware/IsAuthenticated.js';
import { createCommentSchema, listCommentsSchema, updateCommentSchema } from '../validations/commentValidations.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router();

router.post(
    '/posts/:postId/comments',
    IsAuthenticated,
    validate(createCommentSchema),
    CommentController.createComment
);

router.get(
    '/posts/:postId/comments',
    validate(listCommentsSchema),
    CommentController.getComments
);

router.patch(
    '/comments/:commentId',
    IsAuthenticated,
    validate(updateCommentSchema),
    CommentController.updateComment
);

router.delete(
    '/comments/:commentId',
    IsAuthenticated,
    CommentController.deleteComment
);

export default router;