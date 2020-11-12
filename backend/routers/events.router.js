const express = require("express");
const router = express.Router();

const { Event } = require('../models/event.model');
const { EventController } = require('../controllers');

// The root is /api/events
router.get('/', EventController.event_list);

router.post('/', EventController.create);

router.get('/:EventId', EventController.event_by_id);

router.delete('/:EventId', EventController.destroy);

router.patch('/:EventId', EventController.update);

// TODO: Refactor and remove
router.get("/nexteventbyproject/:id", (req, res) => {
  Event.find({ project: req.params.id })
    .populate("project")
    .then((events) => {
      res.status(200).json(events[events.length - 1]);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

module.exports = router;
