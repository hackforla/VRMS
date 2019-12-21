const express = require('express');
const router = express.Router();

// GET /users
router.get('/api/users', (req, res) => {

    res.send(Users);
});

router.get('/api/users/:id', (req, res) => {
    const matchedUser = [];

    Users.forEach(user => {
        if (user.id.toString() === req.params.id) {
            matchedUser.push(user);
        }
    });
        
    // Check if there was a match and return it
    matchedUser.length === 0 ? res.send({ "message": "No match" }) : res.send(matchedUser);

});

module.exports = router;