const { handleClap } = require('./controllers/game');
const { announce } = require('./controllers/listener');
const { getOrCreateUser, endUserSocket } = require('./controllers/user');
const { sendBeachBall } = require('./controllers/game');

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
  temp_startBeachBall(game);

  game.on('connection', (socket) => {
    // events
    socket.on('join', async (data) => {
      if (!data.discordId) {
        return console.log('error: no id');
        // TODO: return error
      }

      // join room
      socket.join(data.room);

      //
      const user = await getOrCreateUser({
        discordUser: { discordId: data.discordId },
        socketId: socket.id,
      });
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

    // Disconnect
    socket.on('disconnect', (reason) => {
      endUserSocket(socket.id);
    });
  });

  return io;
};

function temp_startBeachBall(gameSocket) {
  setTimeout(async () => {
    console.log('starting');
    sendBeachBall(gameSocket);
  }, 5000);
}

function buildClapMessage(user, amount) {
  if (amount === 1) {
    return user + ' clapped!';
  } else {
    return user + ` clapped ${amount}X!`;
  }
}
