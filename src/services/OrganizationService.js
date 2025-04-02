import Organization from '../models/Organization.js';

export default class OrganizationService {
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
}