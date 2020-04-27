const express = require("express");
const router = express.Router();

const { CheckIn } = require("../models/checkIn.model");

// GET /api/checkins/
router.get("/", (req, res) => {
    CheckIn.find()
        .then((checkIns) => {
            res.json(checkIns);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400).json({
                message: `/GET Internal server error:  ${err}`,
            });
        });
});

router.get("/:id", (req, res) => {
    CheckIn.findById(req.params.id)
        .then((checkIn) => {
            res.json(checkIn);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400).json({
                message: `/GET Internal server error:  ${err}`,
            });
        });
});

router.get("/findEvent/:id", (req, res) => {
    CheckIn.find({ eventId: req.params.id })
        .populate({
            path: "userId",
            model: "User",
        })
        .then((checkIn) => {
            res.status(200).json(checkIn);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400).json({
                message: "/GET Internal server error: " + err,
            });
        });
});

router.post("/", (req, res) => {
    CheckIn.create(req.body)
        .then((checkIn) => {
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400).json({
                message: `/POST Internal server error: ${err}`,
            });
        });
});

module.exports = router;
