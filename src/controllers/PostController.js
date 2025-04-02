import PostService from '../services/PostService.js';
import { ApiError } from '../middleware/errorMiddleware.js';
import { logger } from '../middleware/logging.js';
import { sanitizePost } from '../utils/sanitizers.js';

export default class PostController {
    /**
     * @desc    Create new post
     * @route   POST /api/v1/posts
     * @access  Private/Author
     */
    static async createPost(req, res, next) {
        try {
            const post = await PostService.createPost({
                ...req.body,
                author: req.user.id,
                organization: req.user.organization
            });

            logger.info(`Post created: ${post._id}`, { author: req.user.id });

            res.status(201).json({
                success: true,
                data: sanitizePost(post),
                meta: {
                    wordCount: post.content.split(' ').length,
                    readTime: Math.ceil(post.content.split(' ').length / 200) // 200 wpm
                }
            });
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }

    /**
     * @desc    Get single post
     * @route   GET /api/v1/posts/:id
     * @access  Public/Private
     */
    static async getPost(req, res, next) {
        try {
            const post = await PostService.getPostById(req.params.id, {
                includeAuthor: true,
                includeComments: req.query.comments === 'true'
            });

            if (!post) {
                throw new ApiError(404, 'Post not found');
            }

            // Track view if authenticated
            if (req.user) {
                await PostService.trackView(
                    req.params.id,
                    req.user.id,
                    req.user.organization
                );
            }

            res.json({
                success: true,
                data: sanitizePost(post, req.user?.role),
                meta: {
                    views: post.views,
                    cache: req.cacheStatus
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Update post
     * @route   PATCH /api/v1/posts/:id
     * @access  Private/Author+Admin
     */
    static async updatePost(req, res, next) {
        try {
            const post = await PostService.updatePost(
                req.params.id,
                req.body,
                req.user.id,
                req.user.role
            );

            res.json({
                success: true,
                data: sanitizePost(post),
                meta: {
                    changes: req.auditTrail,
                    editedAt: post.editedAt
                }
            });
        } catch (error) {
            next(new ApiError(403, error.message));
        }
    }

    /**
     * @desc    Delete post
     * @route   DELETE /api/v1/posts/:id
     * @access  Private/Admin+Author
     */
    static async deletePost(req, res, next) {
        try {
            await PostService.deletePost(
                req.params.id,
                req.user.id,
                req.user.role
            );

            res.status(204).json({
                success: true,
                data: null
            });
        } catch (error) {
            next(new ApiError(403, error.message));
        }
    }

    /**
     * @desc    List posts with pagination
     * @route   GET /api/v1/posts
     * @access  Public/Private
     */
    static async listPosts(req, res, next) {
        try {
            const {
                page = 1,
                limit = 10,
                sort = '-createdAt',
                tags
            } = req.query;

            const result = await PostService.listPosts({
                organization: req.user?.organization,
                page: parseInt(page),
                limit: parseInt(limit),
                sort,
                tags: tags?.split(',')
            });

            res.json({
                success: true,
                data: result.posts.map(post => sanitizePost(post)),
                meta: {
                    total: result.total,
                    pages: Math.ceil(result.total / limit),
                    currentPage: page,
                    perPage: limit
                }
            });
        } catch (error) {
            next(new ApiError(500, 'Failed to retrieve posts'));
        }
    }

    /**
     * @desc    Search posts
     * @route   GET /api/v1/posts/search
     * @access  Public
     */
    static async searchPosts(req, res, next) {
        try {
            const { q: searchQuery, page = 1, limit = 10 } = req.query;

            if (!searchQuery) {
                throw new ApiError(400, 'Search query required');
            }

            const results = await PostService.searchPosts({
                query: searchQuery,
                page: parseInt(page),
                limit: parseInt(limit),
                organization: req.user?.organization
            });

            res.json({
                success: true,
                data: results.posts.map(post => sanitizePost(post)),
                meta: {
                    total: results.total,
                    searchQuery,
                    searchTime: results.timing
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Increment post views
     * @route   POST /api/v1/posts/:id/views
     * @access  Public
     */
    static async incrementViews(req, res, next) {
        try {
            const views = await PostService.incrementViews(req.params.id);
            res.json({
                success: true,
                data: { views },
                meta: {
                    cached: views !== await PostService.getPostViews(req.params.id)
                }
            });
        } catch (error) {
            next(new ApiError(400, 'Failed to update views'));
        }
    }
}