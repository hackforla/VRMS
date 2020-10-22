const express = require("express");
const router = express.Router();

const { Event } = require('../models/event.model');
const { EventController } = require('../controllers');


// Display list of all Eents.
router.get('/', EventController.event_list);

// Create new Event with POST.
router.post('/create', EventController.create);

// Display Event by id with GET.
router.get('/:EventId', EventController.event_by_id);

// Delete Event by id with POST.
router.post('/:EventId/destroy', EventController.destroy);

// Update Event by id with PUT.
router.put('/:EventId/update', EventController.update);

// Get Event members by GET
router.get('/:EventId/members', EventController.event_member_list);


router.post('/', (req, res) => {
  const newEvent = req.body;

  Event.create(newEvent, function (err, event) {
    if (err) {
      res.send(err);
    }
    res.send(event);
  });
});


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

// TODO: Refactor out from client and remove in favor of /events/:EventID/update
router.patch("/:id", (req, res) => {
  Event.findById(req.params.id, function (err, event) {
    event.checkInReady = !event.checkInReady;

    event.save((err) => {
      if (err) {
        console.log(err);
      }
    });
  })
    .then((checkIn) => {
      res.sendStatus(204);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json({
        message: `/PATCH Couldn't set check-in: ${err}`,
      });
    });
});

module.exports = router;
