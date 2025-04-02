import Joi from 'joi';

// Custom MongoDB ID validation
const mongoId = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message('Invalid ID format');

export const createCommentSchema = Joi.object({
    content: Joi.string()
        .min(10)
        .max(2000)
        .required()
        .trim()
        .label('Comment content')
        .messages({
            'string.empty': 'Comment content cannot be empty',
            'string.min': 'Comment must be at least {#limit} characters',
            'string.max': 'Comment cannot exceed {#limit} characters'
        }),

    parentComment: mongoId
        .optional()
        .label('Parent comment ID'),

    postId: mongoId
        .required()
        .label('Post ID'),

    author: mongoId
        .required()
        .label('Author ID')
})
    .options({ abortEarly: false });

export const updateCommentSchema = Joi.object({
    content: Joi.string()
        .min(10)
        .max(2000)
        .required()
        .trim()
        .label('Updated content'),

    editedAt: Joi.date()
        .default(Date.now)
        .label('Edit timestamp')
});

export const listCommentsSchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .label('Page number'),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(20)
        .label('Items per page'),

    sortBy: Joi.string()
        .valid('createdAt', 'votes', 'replies')
        .default('createdAt')
        .label('Sort field'),

    sortOrder: Joi.string()
        .valid('asc', 'desc')
        .default('desc')
        .label('Sort order'),

    includeReplies: Joi.boolean()
        .default(false)
        .label('Include nested replies')
});

export const voteSchema = Joi.object({
    action: Joi.string()
        .valid('upvote', 'downvote', 'remove-vote')
        .required()
        .label('Vote action'),

    commentId: mongoId
        .required()
        .label('Comment ID')
});

export const reportCommentSchema = Joi.object({
    reason: Joi.string()
        .max(500)
        .required()
        .trim()
        .label('Report reason'),

    category: Joi.string()
        .valid('spam', 'abuse', 'off-topic', 'other')
        .required()
        .label('Report category')
});

// Validation configuration
export const commentValidationOptions = {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false,
    errors: {
        escapeHtml: true,
        wrap: { label: false }
    }
};