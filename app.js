const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

// Get our API routes
const api = require('./server/routes/api');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// static path to dist
app.use(express.static(path.join(__dirname, 'dist/simpleFlightSearch')));

// Setting api routes
app.use('/api', api);

// Catching all other routes and returning the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/simpleFlightSearch/index.html'));
});

/**
 * Get port from environment and storing in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Creating HTTP server.
 */
const server = http.createServer(app);

/**
 * Listening on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));