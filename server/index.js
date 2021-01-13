//
// Server Monitoring
//
require('honeycomb-beeline')({
  writeKey: '49cb083671e8dbfdcfeaaf35778af1e4',
  dataset: 'moneystick_1',
  serviceName: 'moneystick',
});

// *
// load env var's
// *
const dotenv = require('dotenv');
if (process.env.NODE_ENV === 'development') {
  // load local config from .env file
  const result = dotenv.config();
  if (result.error) {
    throw result.error;
  }
}
console.log('ENV: ' + process.env.NODE_ENV);

//
// Mongoose/Mongo connection
//
const mongoose = require('mongoose');
const mongoConnString = process.env.MONGODB_URL_INT;
mongoose.Promise = global.Promise;
try {
  mongoose.connect(mongoConnString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
} catch (error) {
  console.error('MongoDB connection error: ' + error);
}
mongoose.connection.on('error', function (error) {
  console.error('MongoDB error: ' + error);
  process.exit(-1);
});

//
// Server
//
const express = require('express');
const app = require('express')();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

app.use(helmet());
app.use(
  // allow discord avatars from https://cdn.discordapp.com
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': ["'self'", 'data:', 'cdn.discordapp.com'],
    },
  })
);
app.use(express.json()); //Used to parse JSON bodies
app.use(cookieParser());
app.use(
  morgan('dev', {
    skip: function (req, res) {
      // remove the frontend dev server's 'json' calls from the console output
      return req.originalUrl.indexOf('json') > 0;
    },
  })
);
app.use(
  express.static('build', {
    index: false,
  })
);

var server = app.listen(8080, function () {
  console.log('App running on port 8080');
});

// API
const api = require('./api');
app.use('/api', api);

// Page routing (serve the react app)
const routesApi = require('./routes');
app.use('/', routesApi);

// Sockets
const sockets = require('./sockets.js');
sockets.startIo(server);

//
// initiateGame
//
const { initiateGame } = require('./controllers/game');
if (process.env.GAME_START === 'true') {
  console.log('starting game');
  initiateGame();
}

const { startBeachBall } = require('./controllers/beachball');
if (process.env.BEACHBALL_START === 'true') {
  console.log('starting beachball');
  startBeachBall();
}
