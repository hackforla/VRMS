const express = require('express');
const router = express.Router();

const { Question } = require('../models/question.model');

// GET /api/questions/
router.get('/', (req, res) => {
    // const { query } = req;
        
    Question
        .find()
        .then(questions => {
            res.json(questions);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500).json({
                message: `/GET Internal server error: ${err}`
            })
        });
});

router.post('/', (req, res) => {

    Question
        .create(req.body)
        .then(question => {
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

    Question
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

module.exports = router;
