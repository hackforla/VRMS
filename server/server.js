const app = require('./index.js');

// Endpoint for requests
const PORT = 3000;

// Spin up the server
app.listen(PORT, () => {
    console.log('Server is listening on port: ' + PORT);
});