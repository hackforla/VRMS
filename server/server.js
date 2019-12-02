const app = require('./index.js');

// Endpoint for requests
const PORT = 4000;

// Spin up the server
app.listen(process.env.PORT || PORT, () => {
    console.log('Server is listening on port: ' + process.env.PORT || PORT);
});