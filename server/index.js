// *
// load env var's
// *
const dotenv = require('dotenv');
if (process.env.NODE_ENV !== 'production') {
  // load local config from .env file
  const result = dotenv.config();
  if (result.error) {
    throw result.error;
  }
}
console.log('ENV: ' + process.env.NODE_ENV);

// Mongoose/Mongo connection
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

// Server
const express = require('express');
const app = require('express')();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

app.use(helmet());
// allow discord avatars from https://cdn.discordapp.com
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': ["'self'", 'data:', 'cdn.discordapp.com'],
    },
  })
);

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

// API ROUTING
const api = require('./api');
app.use('/api', api);

// page routing
const routesApi = require('./routes');
app.use('/', routesApi);

// Sockets
const sockets = require('./sockets.js');
sockets.startIo(server);

// start bot - TODO
// require('./controllers/listener');

// initiateGame
const { initiateGame } = require('./controllers/game');
initiateGame();
