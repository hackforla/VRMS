const express = require("express");
const router = express.Router();

const { Event } = require('../models/event.model');
const { EventController } = require('../controllers');


// Display list of all Eents.
router.get('/', EventController.event_list);

// Create a new Event with POST.
router.post('/', EventController.create);

// Display Event by id with GET.
router.get('/:EventId', EventController.event_by_id);

// Delete Event by id with DELETE.
router.delete('/:EventId', EventController.destroy);

// Update Event by id with PATCH.
router.patch('/:EventId', EventController.update);

// Get Event members by GET
router.get('/:EventId/members', EventController.event_member_list);


router.get("/nexteventbyproject/:id", (req, res) => {
  Event.find({ project: req.params.id })
    .populate("project")
    .then((events) => {
      res.status(200).json(events[events.length - 1]);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json({
        message: `/GET Internal server error: ${err}`,
      });
    });
});

module.exports = router;
