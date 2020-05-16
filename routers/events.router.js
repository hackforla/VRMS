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
            res.send(event);
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
        .findById(req.params.id, function(err, event) {
            event.checkInReady = !event.checkInReady;

            event.save(err => {
                if (err) {
                    console.log(err);
                }
            })
        })
        .then(checkIn => {
            res.sendStatus(204);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500).json({
                message: `/PATCH Couldn't set check-in: ${err}`
            })
        });
});

module.exports = router;
