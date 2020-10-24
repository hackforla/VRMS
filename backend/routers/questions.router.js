const express = require('express');
const router = express.Router();

const { Question } = require('../models/question.model');


// GET /api/questions/
router.get('/', (req, res) => {
    // const { query } = req;
        
    Question
        .find()
        .then(questions => {
            return res.status(200).send(questions);
        })
        .catch(err => {
            console.log(err);
            return res.sendStatus(400);
        });
});

router.post('/', (req, res) => {

    Question
        .create(req.body)
        .then(question => {
            return res.sendStatus(201);
        })
        .catch(err => {
            console.log(err);
            return res.sendStatus(400);
        });
});

router.get('/:id', (req, res) => {

    Question
        .findById(req.params.id)
        .then(event => {
            return res.status(200).send(event);
        })
        .catch(err => {
            console.log(err);
            return res.sendStatus(400);
        });
});

module.exports = router;
