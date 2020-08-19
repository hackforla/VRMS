const express = require("express");
const router = express.Router();
const cors = require("cors");

const { Event } = require("../models/event.model");

// GET /api/recurringevents/
router.get("/", cors(), (req, res) => {
  // const { query } = req;

  Event.find()
    .then((event) => {
      res.json(event);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json({
        message: `/GET Internal server error: ${err}`,
      });
    });

  router.get("/:id", (req, res) => {
    Event.findById(req.params.id)
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
});

module.exports = router;
