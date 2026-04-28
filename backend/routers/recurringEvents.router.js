import express from 'express';
const router = express.Router();
import cors from 'cors';

import { RecurringEvent } from '../models/recurringEvent.model.js';
import { RecurringEventController } from '../controllers/index.js';

// GET /api/recurringevents/
router.get('/', cors(), (req, res) => {
    // const { query } = req;
        
    RecurringEvent
        // .find(query.checkInReady === 'true' ? query : undefined)
        .find()
        .populate('project')
        .then(recurringEvents => {
            return res.status(200).send(recurringEvents);
        })
        .catch(err => {
            console.log(err);
            return res.sendStatus(400);
        });
});

router.get('/:id', (req, res) => {
    RecurringEvent
        .findById(req.params.id)
        .then(recurringEvent => {
            return res.status(200).send(recurringEvent);
        })
        .catch(err => {
            console.log(err);
            return res.sendStatus(400);
        });
});

router.post('/', RecurringEventController.create);

router.patch('/:RecurringEventId', RecurringEventController.update);

router.delete('/:RecurringEventId', RecurringEventController.destroy);

export default router;
