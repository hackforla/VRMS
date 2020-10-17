const express = require("express");
const router = express.Router();

const { Event } = require('../models/event.model');

// GET /api/events/
router.get('/', async (req, res) => {
  const { query } = req;
  try {
    const events = await Event.find().exec();
    res.json(events);
  } catch (err) {
    res.sendStatus(500).json({
      message: `/GET Internal server error: ${err.stack}`,
    });
  }
});

router.post("/", (req, res) => {
  const newEvent = req.body;

  Event.create(newEvent, function (err, event) {
    if (err) {
      res.send(err);
    }

    res.send(event);
  });
});

router.get("/:id", (req, res) => {
  Event.findById(req.params.id)
    .populate("project")
    .then((event) => {
      res.json(event);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json({
        message: `/GET Internal server error: ${err}`,
      });
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
