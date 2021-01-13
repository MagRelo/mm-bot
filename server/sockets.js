const { getOrCreateUser, endUserSocket } = require('./controllers/user');
const { getGameState } = require('./controllers/game');

// TEST = ENV
const url = process.env.URL;

let io, game;

exports.startIo = function (http) {
  io = require('socket.io')(http, {
    cors: {
      origin: url,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  game = io.of('/');
  game.on('connection', (socket) => {
    // events
    socket.on('join', async (data) => {
      if (!data.discordId) return console.log('connect/join error: no id');
      console.log('joined', socket.id);

      // join room
      socket.join(data.room);

      const user = await getOrCreateUser({
        discordUser: { id: data.discordId },
        socketId: socket.id,
      });
      const game = await getGameState();
      socket.emit('update', { user, game });
    });

    // Disconnect
    socket.on('disconnect', (reason) => {
      console.log('disconnect', socket.id);
      endUserSocket(socket.id);
    });
  });

  return io;
};

// EXPORTS
exports.sendUserUpdate = async function (user) {
  // console.log('sending', user);
  io.of('/').to(user.socketId).emit('update', { user });
};

exports.sendGameUpdate = async function ({ game, user }) {
  // console.log('sending', { game, user });
  io.of('/').emit('update', { game, user });
};

exports.getConnectedSockets = async function getConnectedSockets() {
  // console.log('get sockets');
  // get active sockets
  const ids = await io.of('/').allSockets();
  return Array.from(ids);
};
