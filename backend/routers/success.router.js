const express = require("express");
const router = express.Router();
const cors = require("cors");

const { Event } = require('../models/event.model');

// GET /api/recurringevents/
router.get("/", cors(), (req, res) => {
  // const { query } = req;

  Event.find()
    .then((event) => {
      res.status(200).send(event);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });

  router.get("/:id", (req, res) => {
    Event.findById(req.params.id)
      .then((event) => {
        res.status(200).send(event);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  });
});

module.exports = router;
