const express = require("express");
const router = express.Router();

const { CheckIn } = require('../models/checkIn.model');

// GET /api/checkins/
router.get('/', (req, res) => {
  CheckIn.find()
    .then((checkIns) => {
      res.status(200).send(checkIns);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.get("/:id", (req, res) => {
  CheckIn.findById(req.params.id)
    .then((checkIn) => {
      res.status(200).send(checkIn);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.get("/findEvent/:id", (req, res) => {
  CheckIn.find({ eventId: req.params.id, userId: { $ne: "undefined" } })
    .populate({
      path: "userId",
      model: "User",
    })
    .then((checkIns) => {
      res.status(200).send(checkIns);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.post("/", (req, res) => {
  CheckIn.create(req.body)
    .then((checkIn) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

module.exports = router;
