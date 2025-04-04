import Organization from '../models/Organization.js';

export default class OrganizationService {

    static async getAllOrganizations(page = 1, limit = 50) {

        const skip = (page - 1) * limit;
        const organizations = await Organization.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalCount = await Organization.countDocuments();
        return {
            organizations,
            totalCount
        };
    }

    static async getOrganizationById(orgId) {
        return Organization.findById(orgId);
    }

    static async createOrganization(orgData) {
        return Organization.create(orgData);
    }

    static async updateSubscription(orgId, subscriptionData) {
        return Organization.findByIdAndUpdate(
            orgId,
            { $set: { subscription: subscriptionData } },
            { new: true }
        );
    }

    static async addDomain(orgId, domain) {
        return Organization.findByIdAndUpdate(
            orgId,
            { $addToSet: { domains: domain } },
            { new: true }
        );
    }

    static async auditAction(orgId, auditEntry) {
        return Organization.findByIdAndUpdate(
            orgId,
            { $push: { auditLogs: auditEntry } },
            { new: true }
        );
    }

    static async deleteOrganization(orgId) {
        return Organization.findByIdAndDelete(orgId);
    }
}