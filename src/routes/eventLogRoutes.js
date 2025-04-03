import { Router } from 'express';
import EventLogController from '../controllers/EventLogController.js';
import IsAuthenticated from '../middleware/IsAuthenticated.js';

const router = Router();

router.get(
    '/events/correlation/:correlationId',
    IsAuthenticated(),
    EventLogController.getEventsByCorrelation
);

router.post(
    '/events/replay/:aggregateId',
    IsAuthenticated(),
    EventLogController.replayEvents
);

export default router;