const express = require('express');
const router = express.Router();

const { Event } = require('../models/event.model');

// GET /api/events/
router.get('/', (req, res) => {
    const { query } = req;

    Event
        .find(query.checkInReady === 'true' ? query : undefined)
        .then(events => {
            res.json(events);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500).json({
                message: `/GET Internal server error: ${err}`
            })
        });
});

router.post('/', (req, res) => {
    Event
        .create(req.body)
        .then(event => {
            res.sendStatus(201);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400).json({
                message: `/POST Internal server error: ${err}`
            })
        });
});

router.get('/:id', (req, res) => {
    Event
        .findById(req.params.id)
        .then(event => {
            res.json(event);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500).json({
                message: `/GET Internal server error: ${err}`
            })
        });
});

router.patch('/:id', (req, res) => {
    Event
        .findByIdAndUpdate(req.params.id, req.body)
        .then(checkIn => {
            res.sendStatus(204).end();
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400).json({
                message: `/PATCH Couldn't set check-in: ${err}`
            })
        });
});

module.exports = router;
