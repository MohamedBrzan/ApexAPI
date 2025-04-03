import OrganizationService from '../services/OrganizationService.js';
import { ApiError } from '../middleware/errorMiddleware.js';
import { logger } from '../middleware/logging.js';
import { sanitizeOrganization } from '../utils/sanitizers.js';

export default class OrganizationController {
    /**
     * @desc    Create new organization
     * @route   POST /api/v1/organizations
     * @access  Private/Admin
     */
    static async createOrganization(req, res, next) {
        try {
            const organization = await OrganizationService.createOrganization({
                ...req.body,
                createdBy: req.user.id
            });

            logger.info(`Organization created: ${organization._id}`);

            res.status(201).json({
                success: true,
                data: sanitizeOrganization(organization),
                meta: {
                    audit: req.auditTrail
                }
            });
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }

    /**
     * @desc    Update organization subscription
     * @route   PUT /api/v1/organizations/:id/subscription
     * @access  Private/BillingAdmin
     */
    static async updateSubscription(req, res, next) {
        try {
            const organization = await OrganizationService.updateSubscription(
                req.params.id,
                req.body
            );

            if (!organization) {
                throw new ApiError(404, 'Organization not found');
            }

            res.json({
                success: true,
                data: {
                    organization: sanitizeOrganization(organization.toObject()),
                },
                meta: {
                    updatedBy: req.user.id,
                    audit: req.auditTrail
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Add domain to organization
     * @route   POST /api/v1/organizations/:id/domains
     * @access  Private/OrgAdmin
     */
    static async addDomain(req, res, next) {
        try {
            const organization = await OrganizationService.addDomain(
                req.params.id,
                req.body.domain
            );

            res.json({
                success: true,
                data: {
                    domains: organization.domains
                },
                meta: {
                    addedDomain: req.body.domain,
                    audit: req.auditTrail
                }
            });
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }

    /**
     * @desc    Get organization audit logs
     * @route   GET /api/v1/organizations/:id/audit
     * @access  Private/OrgAdmin
     */
    static async getAuditLogs(req, res, next) {
        try {
            const { page = 1, limit = 50 } = req.query;
            const auditLogs = await OrganizationService.getAuditLogs(
                req.params.id,
                parseInt(page),
                parseInt(limit)
            );

            res.json({
                success: true,
                data: auditLogs,
                meta: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(auditLogs.totalCount / limit)
                }
            });
        } catch (error) {
            next(new ApiError(500, 'Failed to retrieve audit logs'));
        }
    }

    /**
     * @desc    Invite user to organization
     * @route   POST /api/v1/organizations/:id/invite
     * @access  Private/OrgAdmin
     */
    static async inviteUser(req, res, next) {
        try {
            const invitation = await OrganizationService.inviteUser(
                req.params.id,
                req.body,
                req.user.id
            );

            res.status(202).json({
                success: true,
                data: {
                    invitationId: invitation._id,
                    status: invitation.status
                },
                meta: {
                    expiresAt: invitation.expiresAt
                }
            });
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }

    /**
     * @desc    Update organization member
     * @route   PATCH /api/v1/organizations/:id/members/:userId
     * @access  Private/OrgAdmin
     */
    static async updateMember(req, res, next) {
        try {
            const member = await OrganizationService.updateMember(
                req.params.id,
                req.params.userId,
                req.body
            );

            res.json({
                success: true,
                data: member,
                meta: {
                    updatedBy: req.user.id,
                    audit: req.auditTrail
                }
            });
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }

    /**
     * @desc    Get organization details
     * @route   GET /api/v1/organizations/:id
     * @access  Private/OrgMember
     */
    static async getOrganization(req, res, next) {
        try {
            const organization = await OrganizationService.getOrganizationById(
                req.params.id,
                req.user.role
            );

            if (!organization) {
                throw new ApiError(404, 'Organization not found');
            }

            res.json({
                success: true,
                data: sanitizeOrganization(organization, req.user.role),
                meta: {
                    cache: req.cacheStatus
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Delete organization
     * @route   DELETE /api/v1/organizations/:id
     * @access  Private/Admin
     */
    static async deleteOrganization(req, res, next) {
        try {
            const organization = await OrganizationService.deleteOrganization(
                req.params.id
            );

            if (!organization) {
                throw new ApiError(404, 'Organization not found');
            }

            res.json({
                success: true,
                message: 'Organization deleted successfully',
                meta: {
                    deletedBy: req.user.id,
                    audit: req.auditTrail
                }
            });
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }
}