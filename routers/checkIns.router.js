const express = require('express');
const router = express.Router();

const { CheckIn } = require('../models/checkIn.model');

// GET /api/checkIns/
router.get('/', (req, res) => {
    CheckIn
        .find()
        .then(checkIns => {
            res.json(checkIns);
            console.log(checkIns);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400).json({
                message: `/GET Internal server error:  ${err}`
            })
        });
});

router.get('/:id', (req, res) => {
    CheckIn
        .findById(req.params.id)
        .then(checkIn => {
            res.json(checkIn);
            console.log(checkIn);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400).json({
                message: `/GET Internal server error:  ${err}`
            })
        });
});

router.post('/'), (req, res) => {
    CheckIn
        .create(req.body)
        .then(checkIn => {
            res.sendStatus(201);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400).json({
                message: `/POST Internal server error: ${err}`
            })
        });
}

module.exports = router;
