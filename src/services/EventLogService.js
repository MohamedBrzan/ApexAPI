import EventLog from "../models/EventLog.js";

export default class EventLogService {
    static async logEvent(eventType, payload) {
        return EventLog.create({
            eventType,
            payload,
            aggregateId: payload.aggregateId,
            correlationId: payload.correlationId,
            version: payload.version
        });
    }

    static async replayEvents(aggregateId, version) {
        return EventLog.find({
            aggregateId,
            version: { $lte: version }
        }).sort('version');
    }

    static async getEventsByCorrelation(correlationId) {
        return EventLog.find({ correlationId }).sort('-timestamp');
    }
}