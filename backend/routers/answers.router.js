const express = require('express');
const router = express.Router();

// GET /answers
router.get('/api/answers', (req, res) => {

    res.send(Answers);
});

router.get('/api/answers/:id', (req, res) => {
    const matchedAnswer = [];

    Answers.forEach(answer => {
        if (answer.id.toString() === req.params.id) {
            matchedAnswer.push(answer);
        }
    });

    matchedAnswer.length === 0 ? res.send('No match') : res.send(matchedAnswer);
});

module.exports = router;