// server.js - Entry point for our application

// Load in all of our node modules. Their uses are explained below as they are called.
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
// const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

// Create a new application using the Express framework
const app = express();

// Load config variables 
const { DATABASE_URL, PORT } = require('./config/database');

// Required to view Request Body (req.body) in JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// HTTP Request Logger
app.use(morgan('dev'));

// Hide sensitive Header data
// app.use(helmet());

// Cross-Origin-Resource-Sharing
app.use(cors());

mongoose.Promise = global.Promise; 

// ROUTES

const eventsRouter = require('./routers/events.router');
const checkInsRouter = require('./routers/checkIns.router');
const usersRouter = require('./routers/users.router');
const answersRouter = require('./routers/answers.router');

app.use('/api/events', eventsRouter);
app.use('/api/checkIns', checkInsRouter);
app.use('/api/answers', answersRouter);
app.use('/api/users', usersRouter);

const CLIENT_BUILD_PATH = path.join(__dirname, './client/build');

// Serve static files from the React frontend app
app.use(express.static(path.join(CLIENT_BUILD_PATH)));

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
    const index = path.join(CLIENT_BUILD_PATH, 'index.html');
    console.log("I'm TRYING client build path!!!");

    res.sendFile(index);
});

let server;

async function runServer(databaseUrl, port = PORT) {
    console.log("I'm TRYING (server)!!!");

        await mongoose
            .connect(
                databaseUrl, 
                { 
                    useNewUrlParser: true, 
                    useCreateIndex: true, 
                    useUnifiedTopology: true
                }
            ).catch(err => err);

        server = app
            .listen(port, () => {
                console.log(`Server listening on ${port}`);
                console.log("I'm TRYING!!!");
            })
            .on('error', err => {
                mongoose.disconnect();
                return err;
            });
}

async function closeServer() {
    await mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
};


runServer(DATABASE_URL).catch(err => console.error(err));
console.log("I'm TRYING (server.js please)!!!");

// app.listen(process.env.PORT || PORT, () => {
//     console.log(`Server is listening on port: ${process.env.PORT || PORT}`);
// });

module.exports = { app, runServer, closeServer };
