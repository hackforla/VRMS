import express from 'express';
const router = express.Router();

import { Event } from '../models/event.model.js';
import { EventController } from '../controllers/index.js';

// The root is /api/events
router.get('/', EventController.event_list);

router.post('/', EventController.create);

router.get('/:EventId', EventController.event_by_id);

router.delete('/:EventId', EventController.destroy);

router.patch('/batchUpdate', EventController.update);

router.patch('/:EventId', EventController.update);

// TODO: Refactor and remove
router.get('/nexteventbyproject/:id', (req, res) => {
  Event.find({ project: req.params.id })
    .populate('project')
    .then((events) => {
      res.status(200).json(events[events.length - 1]);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

module.exports = router;
