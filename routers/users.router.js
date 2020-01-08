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

router.post('/api/users', (req, res) => {
    const requiredFields = ['firstName', 'email'];
    const missingField = requiredFields.find(
        field => !(field in req.body)
    );

    if (missingField) {
        return res.sendStatus(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }

    const stringFields = ['firstName', 'email'];

    const nonStringField = stringFields.find(
        field => field in req.body && typeof req.body[field] !== 'string'
    );

    if (nonStringField) {
        return res.sendStatus(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Incorrect field type: expected string',
            location: nonStringField
        });
    }

    const trimmedFields = ['firstName', 'password'];

    const nonTrimmedField = trimmedFields.find(
        field => req.body[field].trim() !== req.body[field]
    );

    if (nonTrimmedField) {
        return res.sendStatus(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Cannon start or end with space',
            location: nonTrimmedField
        });
    }

    const sizedFields = {
        firstName: {
            min: 2
        },
        email: {
            min: 4,
            max: 72
        }
    };
    const tooSmallField = Object.keys(sizedFields).find(
        field => 
            'min' in sizedFields[field] &&
                req.body[field].trim().length < sizedFields[field].min
    );
    
    const tooLargeField = Object.keys(sizedFields).find(
        field => 
            'max' in sizedFields[field] &&
                req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField || tooLargeField) {
        return res.sendStatus(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField
                ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
                : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
            location: tooSmallField || tooLargeField
        });
    }

    let { firstName, email } = req.body;

    return User
        .find({ email })
        .count()
        .then(count => {
            if (count > 0) {
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Email is already in use!',
                    location: 'email'
                });
            }

            return User;
        })
        .then(user => {
            return User.create({
                firstName,
                email
            });
        })
        .then(user => {
            return res.sendStatus(201);
        })
        .catch(err => {
            console.log(err);
            if (err.reason === 'ValidationError') {
                return res.sendStatus(err.code).json(err);
            }
            res.sendStatus(500).json({
                code: 500,
                message: 'Internal server error while creating User'});
        });
});

module.exports = router;