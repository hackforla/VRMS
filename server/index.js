// index.js - Entry point for our application


// Load in all of our node modules. Their uses are explained below as they are called.
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

// Create a new application using the Express framework
const app = express();

// Required to view Request Body (req.body) in JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// HTTP Request Logger
app.use(morgan('dev'));

// Hide sensitive Header data
app.use(helmet());

// Cross-Origin-Resource-Sharing
app.use(cors());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '/../client/build')));

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/../client/build/index.html'));
  });

const Users = require('./users/users.js');
const Events = require('./events/events.js');

// ROUTES

app.get('/api', (req, res) => {

    res.send(
        'Routes: ' + '\n' + 
        '/users ' +
        '/events ');
});

// GET /users
app.get('/api/users', (req, res) => {

    res.send(Users);
});

app.get('/api/users/:id', (req, res) => {
    const matchedUser = [];

    Users.forEach(user => {
        if (user.id.toString() === req.params.id) {
            matchedUser.push(user);
        }
    });
        
    // Check if there was a match and return it
    matchedUser.length === 0 ? res.send('No match') : res.send(matchedUser);

});

// GET /events
app.get('/api/events', (req, res) => {

    res.send(Events);
});

app.get('/api/events/:id', (req, res) => {
    const matchedEvent = [];

    Events.forEach(event => {
        if (event.id.toString() === req.params.id) {
            matchedEvent.push(event);
        }
    });

    matchedEvent.length === 0 ? res.send('No match') : res.send(matchedEvent);

});

module.exports = app;