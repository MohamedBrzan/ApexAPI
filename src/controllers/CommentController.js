import CommentService from '../services/CommentService.js';
import { validationResult } from 'express-validator';
import { sanitizeInput } from '../utils/sanitizers.js';

export default class CommentController {
    static async createComment(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const sanitized = sanitizeInput(req.body);
            const comment = await CommentService.createComment({
                ...sanitized,
                author: req.user.id,
                post: req.params.postId
            });

            res.status(201).json({
                success: true,
                data: comment,
                meta: {
                    post: req.params.postId,
                    depth: 0
                }
            });
        } catch (error) {
            next(new ApiError(400, 'Comment creation failed'));
        }
    }

    static async getComments(req, res, next) {
        try {
            // Set default pagination values if not provided
            const { page = 1, limit = 10 } = req.query;
            const comments = await CommentService.getComments(req.params.postId, { page, limit });

            res.json({
                success: true,
                data: comments,
                meta: {
                    count: comments.length,
                    post: req.params.postId,
                    page: Number(page),
                    limit: Number(limit)
                }
            });
        } catch (error) {
            next(new ApiError(404, 'Comments not found'));
        }
    }

    static async getThreadedComments(req, res, next) {
        try {
            const comments = await CommentService.getNestedComments(
                req.params.postId,
                req.query.depth || 3
            );

            res.json({
                success: true,
                data: comments,
                meta: {
                    count: comments.length,
                    post: req.params.postId
                }
            });
        } catch (error) {
            next(new ApiError(404, 'Comments not found'));
        }
    }

    static async updateComment(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Sanitize the incoming request body
            const sanitized = sanitizeInput(req.body);
            const updatedComment = await CommentService.updateComment(req.params.commentId, sanitized);

            if (!updatedComment) {
                return next(new ApiError(404, 'Comment not found'));
            }

            res.json({
                success: true,
                data: updatedComment
            });
        } catch (error) {
            next(new ApiError(400, 'Comment update failed'));
        }
    }

    static async deleteComment(req, res, next) {
        try {
            const deleted = await CommentService.deleteComment(req.params.commentId);
            if (!deleted) {
                return next(new ApiError(404, 'Comment not found'));
            }

            res.json({
                success: true,
                message: 'Comment deleted successfully'
            });
        } catch (error) {
            next(new ApiError(400, 'Comment deletion failed'));
        }
    }
}