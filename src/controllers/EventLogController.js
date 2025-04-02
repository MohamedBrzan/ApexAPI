import EventLogService from '../services/EventLogService.js';

export default class EventLogController {
    static async getEventsByCorrelation(req, res, next) {
        try {
            const events = await EventLogService.getEventsByCorrelation(
                req.params.correlationId,
                req.query.limit || 100
            );

            res.json({
                success: true,
                data: events,
                meta: {
                    correlationId: req.params.correlationId,
                    count: events.length
                }
            });
        } catch (error) {
            next(new ApiError(404, 'Events not found'));
        }
    }

    static async replayEvents(req, res, next) {
        try {
            const { aggregateId, version } = req.params;
            const events = await EventLogService.replayEvents(aggregateId, version);

            res.json({
                success: true,
                data: events,
                meta: {
                    aggregateId,
                    upToVersion: version
                }
            });
        } catch (error) {
            next(new ApiError(400, 'Event replay failed'));
        }
    }
}