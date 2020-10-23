const express = require('express');
const router = express.Router();

const { User } = require('../models/user.model');

// Get a list of checkUser

// GET /api/checkuser/
router.post('/', (req, res) => {
    const { email } = req.body;
    console.log(email);
    
    if(email === "undefined") {
        return res.sendStatus(412).json({ message: "user email is required"})
    }

    if(email) {
        User
            .findOne({email})
            .then(user => {
                if (!user) {
                    res.json(false);
                } else {
                    res.json(user);
                }
            })
            .catch(err => {
                console.log(err);

                res.sendStatus(500).json({
                    message: `/GET Internal server error: ${err}`
                })
            });
    } else {
        res.json({ message: "Enter the email address you used to check-in last time."});
    }
    
});

router.get('/:id', (req, res) => {
    User
        .findById(req.params.id)
        .then(user => {
            res.json(user);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500).json({
                message: `/GET Internal server error: ${err}`
            })
        });
});

module.exports = router;