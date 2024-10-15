const express = require('express');
const router = express.Router();
const cors = require('cors');

const { RecurringEvent } = require('../models/recurringEvent.model');
const { RecurringEventController } = require('../controllers/');
const { AuthUtil } = require('../middleware');

// GET /api/recurringevents/
router.get('/', cors(), (req, res) => {
    // const { query } = req;
        
    RecurringEvent
        // .find(query.checkInReady === 'true' ? query : undefined)
        .find()
        // This will deselect the video conference link field
        .select("-videoConferenceLink")
        .populate('project')
        .then(recurringEvents => {
            return res.status(200).send(recurringEvents);
        })
        .catch(err => {
            console.log(err);
            return res.sendStatus(400);
        });
});

router.get("/internal", (req, res) => {
    RecurringEvent
        .find()
        .populate('project')
        .then(recurringEvents => {
            return res.status(200).send(recurringEvents)
        })
        .catch(err => {
            console.error(err)
            return res.status(400);
        })
} )

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

router.post('/', AuthUtil.verifyCookie, RecurringEventController.create);

router.patch('/:RecurringEventId', AuthUtil.verifyCookie, RecurringEventController.update);

router.delete('/:RecurringEventId', AuthUtil.verifyCookie, RecurringEventController.destroy);

module.exports = router;
