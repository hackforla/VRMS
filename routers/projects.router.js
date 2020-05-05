const express = require('express');
const router = express.Router();

const { Project } = require('../models/project.model');

// GET /api/projects/
router.get('/', (req, res) => {
    // const { headers } = req;
    // const expectedHeader = process.env.CUSTOM_REQUEST_HEADER;

    // if (headers['x-customrequired-header'] !== expectedHeader) {
    //     res.sendStatus(401);
    // } else {
        Project
            .find()
            .then(projects => {
                if (!projects) {
                    res.json(false);
                } else {
                    res.json(projects);
                };
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(500).json({
                    message: `/GET Internal server error: ${err}`
                });
            });
    // };
});

router.get('/:id', (req, res) => {
    Project
        .findById(req.params.id)
        .then(project => {
            res.json(project);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500).json({
                message: `/GET Internal server error: ${err}`
            });
        });
});


router.patch('/:id', (req, res) => {
    const { headers } = req;
    // const expectedHeader = process.env.CUSTOM_REQUEST_HEADER;

    // if (headers['x-customrequired-header'] !== expectedHeader) {
    //     res.sendStatus(401);
    // } else {
        Project
            .findByIdAndUpdate(req.params.id, req.body)
            .then(edit => res.json(req.params.id))
            .catch(err =>
                res.status(500).json({
                    error: 'Couldn\'t edit form... Try again.'
                }));
    // };
});

router.post('/', (req, res) => {
    // const { headers } = req;
    // const expectedHeader = process.env.CUSTOM_REQUEST_HEADER;
    
    // if (headers['x-customrequired-header'] !== expectedHeader) {
    //     res.sendStatus(401);
    // } else {
    Project
        .create(req.body, function (err, project) {
            if (err) {
                console.log(err.errmsg);
                res.json(err.errmsg);
            } else {
                const { id } = project;
                console.log('Created with id: ' + id);
                res.status(201).json(id);
            };
        });
    // }
});

module.exports = router;