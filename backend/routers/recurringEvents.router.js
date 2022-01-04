const express = require('express');
const router = express.Router();
const cors = require('cors');

const { RecurringEvent } = require('../models/recurringEvent.model');
const { RecurringEventController } = require('../controllers/');

// GET /api/recurringevents/
router.get('/', cors(), (req, res) => {
    // const { query } = req;
        
    RecurringEvent
        // .find(query.checkInReady === 'true' ? query : undefined)
        .find()
        .populate('project')
        .then(recurringEvents => {
            return res.status(200).send(recurringEvents);
        })
        .catch(err => {
            console.log(err);
            return res.sendStatus(400);
        });
});

router.post('/', (req, res) => {

    RecurringEvent
        .create(req.body)
        .then(recurringEvent => {
            return res.sendStatus(201);
        })
        .catch(err => {
            console.log(err);
            return res.sendStatus(400);
        });
});

router.get('/:id', (req, res) => {
    RecurringEvent
        .findById(req.params.id)
        .then(recurringEvent => {
            return res.status(200).send(recurringEvent);
        })
        .catch(err => {
            console.log(err);
            return res.sendStatus(400);
        });
});

// router.patch('/:id', (req, res) => {
//     RecurringEvent
//         .findById(req.params.id, function(err, recurringEvent) {
//             // recurringEvent.checkInReady = !recurringEvent.checkInReady;

//             recurringEvent.save(err => {
//                 if (err) {
//                     return res.sendStatus(400);
//                 }
//             })
//         })
//         .then(recurringEvent => {
//             return res.status(200).send(recurringEvent);
//         })
//         .catch(err => {
//             console.log(err);
//             return res.sendStatus(503);
//         });
// });

router.patch('/:RecurringEventID', RecurringEventController.update);

router.delete('/:RecurringEventID', RecurringEventController.destroy);

module.exports = router;
