import express from 'express';
const router = express.Router();
import cors from 'cors';

import { Event } from '../models/event.model.js';

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
