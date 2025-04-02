import sanitizeHtml from 'sanitize-html';

/**
 * Sanitize organization data for public exposure
 * @param {Object} organization - Raw organization document
 * @param {string} userRole - Current user's role
 * @returns {Object} Sanitized organization data
 */
export const sanitizeOrganization = (organization, userRole = 'user') => {
    if (!organization) return null;

    const baseFields = {
        id: organization._id?.toString(),
        name: organization.name,
        slug: organization.slug,
        industry: organization.industry,
        size: organization.size,
        domains: organization.domains,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
        meta: {
            hasBilling: !!organization.billingDetails,
            memberCount: organization.members?.length || 0,
            teamCount: organization.teams?.length || 0
        }
    };

    // Add admin-only fields
    if (userRole === 'admin') {
        return {
            ...baseFields,
            subscription: {
                plan: organization.subscription?.plan,
                status: organization.subscription?.status,
                renewalDate: organization.subscription?.renewalDate
            },
            configuration: {
                authProviders: organization.configuration?.authProviders
            },
            billingAddress: organization.billingAddress && {
                street: organization.billingAddress.street,
                city: organization.billingAddress.city,
                state: organization.billingAddress.state,
                country: organization.billingAddress.country,
                postalCode: organization.billingAddress.postalCode
            },
            auditLogs: organization.auditLogs?.length || 0
        };
    }

    return baseFields;
};

/**
 * Sanitize user data for public exposure
 * @param {Object} user - Raw user document
 * @returns {Object} Sanitized user data
 */
export const sanitizeUser = (user) => {
    if (!user) return null;

    return {
        id: user._id?.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};

/**
 * Sanitize product data for public exposure
 * @param {Object} product - Raw product document
 * @returns {Object} Sanitized product data
 */
export const sanitizeProduct = (product) => {
    if (!product) return null;

    return {
        id: product._id?.toString(),
        sku: product.sku,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
        variants: product.variants?.map(v => ({
            option: v.option,
            price: v.price,
            inventory: v.inventory.stock
        })),
        rating: product.rating,
        createdAt: product.createdAt
    };
};

/**
 * Sanitize API request data
 * @param {Object} request - Raw request document
 * @returns {Object} Sanitized request data
 */
export const sanitizeRequest = (request) => {
    if (!request) return null;

    return {
        id: request._id?.toString(),
        endpoint: request.endpoint,
        method: request.method,
        statusCode: request.statusCode,
        responseTime: request.responseTime,
        createdAt: request.createdAt
    };
};

// Generic sanitization utilities

export const sanitizeHTML = (value, helpers) => {
    const clean = sanitizeHtml(value, {
        allowedTags: ['h1', 'h2', 'h3', 'blockquote', 'p', 'a', 'ul', 'ol', 'li', 'b', 'i', 'strong', 'em', 'code'],
        allowedAttributes: {
            a: ['href', 'rel', 'target']
        },
        allowedIframeHostnames: [],
        transformTags: {
            a: (tagName, attribs) => ({
                tagName: 'a',
                attribs: {
                    ...attribs,
                    rel: 'noopener noreferrer',
                    target: '_blank'
                }
            })
        }
    });

    if (clean !== value) {
        return helpers.error('any.invalid');
    }
    return clean;
};

export const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return sanitizeHtml(input, {
            allowedTags: [],
            allowedAttributes: {},
            disallowedTagsMode: 'escape'
        });
    }
    return input;
};

export const sanitizePost = (post, userRole = 'user') => {
    if (!post) return null;

    const basePost = {
        id: post._id?.toString(),
        title: post.title,
        content: sanitizeHTML(post.content),
        slug: post.slug,
        excerpt: post.excerpt || truncateText(post.content, 150),
        featuredImage: post.featuredImage,
        tags: post.tags,
        views: post.views || 0,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author ? sanitizeUser(post.author) : null,
        commentsCount: post.comments?.length || 0,
        meta: {
            wordCount: post.content.split(' ').length,
            readTime: Math.ceil(post.content.split(' ').length / 200) // 200 words/minute
        }
    };

    // Add editor/admin-only fields
    if (['admin', 'editor'].includes(userRole)) {
        return {
            ...basePost,
            status: post.status,
            isFeatured: post.isFeatured,
            seo: post.seo,
            internalNotes: post.internalNotes
        };
    }

    return basePost;
};

// Helper function to truncate text
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, text.lastIndexOf(' ', maxLength)) + '...';
};