const express = require('express');
const router = express.Router();

const { User } = require('../models/user.model');

// GET /api/users/
router.get('/', (req, res) => {
    
    User
        .find()
        .then(users => {
            res.json(users);
        })
        .catch(err => console.log(err));
});

router.get('/:id', (req, res) => {
    // const matchedUser = [];

    // Users.forEach(user => {
    //     if (user.id.toString() === req.params.id) {
    //         matchedUser.push(user);
    //     }
    // });
        
    // // Check if there was a match and return it
    // matchedUser.length === 0 ? res.send({ "message": "No match" }) : res.send(matchedUser);

});

router.post('/', (req, res) => {
    // const requiredFields = ['firstName', 'email'];
    // const missingField = requiredFields.find(
    //     field => !(field in req.body)
    // );

    // if (missingField) {
    //     return res.sendStatus(422).json({
    //         code: 422,
    //         reason: 'ValidationError',
    //         message: 'Missing field',
    //         location: missingField
    //     });
    // }

    // const stringFields = ['firstName', 'email'];

    // const nonStringField = stringFields.find(
    //     field => field in req.body && typeof req.body[field] !== 'string'
    // );

    // if (nonStringField) {
    //     return res.sendStatus(422).json({
    //         code: 422,
    //         reason: 'ValidationError',
    //         message: 'Incorrect field type: expected string',
    //         location: nonStringField
    //     });
    // }

    // const trimmedFields = ['firstName', 'password'];

    // const nonTrimmedField = trimmedFields.find(
    //     field => req.body[field].trim() !== req.body[field]
    // );

    // if (nonTrimmedField) {
    //     return res.sendStatus(422).json({
    //         code: 422,
    //         reason: 'ValidationError',
    //         message: 'Cannon start or end with space',
    //         location: nonTrimmedField
    //     });
    // }

    // const sizedFields = {
    //     firstName: {
    //         min: 2
    //     },
    //     email: {
    //         min: 4,
    //         max: 72
    //     }
    // };
    // const tooSmallField = Object.keys(sizedFields).find(
    //     field => 
    //         'min' in sizedFields[field] &&
    //             req.body[field].trim().length < sizedFields[field].min
    // );
    
    // const tooLargeField = Object.keys(sizedFields).find(
    //     field => 
    //         'max' in sizedFields[field] &&
    //             req.body[field].trim().length > sizedFields[field].max
    // );

    // if (tooSmallField || tooLargeField) {
    //     return res.sendStatus(422).json({
    //         code: 422,
    //         reason: 'ValidationError',
    //         message: tooSmallField
    //             ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
    //             : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
    //         location: tooSmallField || tooLargeField
    //     });
    // }

    let { email } = req.body;
    let { firstName } = req.body.name;

    User
        .create(req.body, function (err, user) {
            if (err) throw err;

            const { id } = user;
            console.log('Created with id: ' + id);
            res.status(201).json(id);
        })
        // .then(user => {
        //     .json({ id: res.body.id })
        // })
        // .catch(err => console.log(err));
        // .find()
        // .count()
        // .then(count => {
        //     if (count > 0) {
        //         res.sendStatus(403);
        //         // return Promise.reject({
        //         //     code: 422,
        //         //     reason: 'ValidationError',
        //         //     message: 'Email is already in use!',
        //         //     location: 'email'
        //         // });
        //     }

        //     return User;
        // })
        // .then(user => {
        //     return User.create({
        //         firstName,
        //         email
        //     });
        // })
        // .then(user => {
        //     return res.sendStatus(201).json({ id: user._id });
        // })
        // .catch(err => {
        //     console.log(err);
        //     // if (err.reason === 'ValidationError') {
        //     //     return res.sendStatus(err.code).json(err);
        //     // }
        //     res.sendStatus(500).json({
        //         code: 500,
        //         message: 'Internal server error while creating User'});
        // });
});

module.exports = router;