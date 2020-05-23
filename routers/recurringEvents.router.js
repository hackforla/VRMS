const express = require('express');
const router = express.Router();
const cors = require('cors');

const { RecurringEvent } = require('../models/recurringEvent.model');

// GET /api/recurringevents/
router.get('/', cors(), (req, res) => {
    // const { query } = req;
        
    RecurringEvent
        // .find(query.checkInReady === 'true' ? query : undefined)
        .find()
        .then(recurringEvents => {
            res.json(recurringEvents);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500).json({
                message: `/GET Internal server error: ${err}`
            })
        });
});

router.post('/', (req, res) => {
    RecurringEvent
        .create(req.body)
        .then(recurrentEvent => {
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
    RecurringEvent
        .findById(req.params.id)
        .then(recurringEvent => {
            res.json(recurringEvent);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500).json({
                message: `/GET Internal server error: ${err}`
            })
        });
});

router.patch('/:id', (req, res) => {
    RecurringEvent
        .findById(req.params.id, function(err, recurringEvent) {
            // recurringEvent.checkInReady = !recurringEvent.checkInReady;

            recurringEvent.save(err => {
                if (err) {
                    console.log(err);
                }
            })
        })
        .then(recurringEvent => {
            res.sendStatus(204)
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500).json({
                message: `/PATCH Couldn't set check-in: ${err}`
            })
        });
});

module.exports = router;
