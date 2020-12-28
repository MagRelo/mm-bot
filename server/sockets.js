const { handleClap } = require('./controllers/game');
const { announce } = require('./controllers/listener');
const { getOrCreateUser } = require('./controllers/user');

// const { BeachBallModel } = require('./models');

// TEST = ENV
const url = process.env.URL;

exports.startIo = function (http) {
  const io = require('socket.io')(http, {
    cors: {
      origin: url,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  var game = io.of('/game');

  // start beachball loop
  // startBeachBall();

  game.on('connection', (socket) => {
    // events
    socket.on('join', async (data) => {
      if (!data.discordId) {
        return console.log('error: no id');
        // TODO: return error
      }

      // jon room
      socket.join(data.room);

      const user = await getOrCreateUser({ discordId: data.discordId });
      socket.emit('update', user);
    });

    socket.on('clap', async (data) => {
      try {
        // update user & target
        const user = await handleClap(data);

        // bot announcement in channel
        announce(buildClapMessage(user.username, data.amount));

        // update client
        return socket.emit('update', user);
      } catch (error) {
        console.log(error);
        return socket.emit('error', error);
      }
    });

    // socket.on('vote', (data) => {
    //   // GameController.handleVote(game, socket, data);
    //   console.log(data);
    // });
  });

  return io;
};

function buildClapMessage(user, amount) {
  if (amount === 1) {
    return user + ' clapped!';
  } else {
    return user + ` clapped ${amount}X!`;
  }
}
