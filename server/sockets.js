const { handleClap } = require('./controllers/game');
const { announce } = require('./controllers/listener');
const { getOrCreateUser, endUserSocket } = require('./controllers/user');
const {
  sendBeachBall,
  getGameState,
  missBeachBall,
} = require('./controllers/game');

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

  game = io.of('/game');

  temp_startBeachBall(game);

  game.on('connection', (socket) => {
    // events
    socket.on('join', async (data) => {
      if (!data.discordId) return console.log('error: no id');

      // join room
      socket.join(data.room);

      const user = await getOrCreateUser({
        discordUser: { id: data.discordId },
        socketId: socket.id,
      });
      const game = await getGameState();
      socket.emit('update', { user, game });
    });

    socket.on('clap', async (data) => {
      try {
        // update user & target
        const user = await handleClap(data);
        // bot announcement in channel
        announce(buildClapMessage(user.username, data.amount));

        // update game
        const updatedGame = await getGameState();
        io.of('/game').emit('update', { game: updatedGame });

        // update client
        return socket.emit('update', { user });
      } catch (error) {
        console.log(error);
        return socket.emit('error', error);
      }
    });

    // Disconnect
    socket.on('disconnect', (reason) => {
      console.log('disconnect', socket.id);
      endUserSocket(socket.id);
    });
  });

  return io;
};

function buildClapMessage(username, amount) {
  let clapEmoji = ':clap:';

  if (amount === 1) {
    return `${username} ${clapEmoji}`;
  } else {
    return `${username} ${clapEmoji.repeat(amount)}`;
  }
}

function temp_startBeachBall(gameSocket) {
  setTimeout(async () => {
    console.log('starting');
    sendBall();
  }, 5000);
}

// Beach Ball
// timer function values
const timeToHit = 5000;
const timeToWait = 5000;
let hitTimer, sendTimer;

async function sendBall() {
  clearTimeout(sendTimer);

  // get active sockets
  const ids = await io.of('/game').allSockets();
  const randomSocket = getRandomItem(ids);

  // create ball and update game
  const updatedGame = await sendBeachBall(randomSocket);
  if (!updatedGame) {
    startSendTimer();
    return console.log('no user, restarting...');
  } else {
    console.log('sending new ball:', updatedGame.beachBallUser.username);
  }

  // update all clients
  io.of('/game').emit('update', { game: updatedGame });

  // if hitTimer runs out the ball was "dropped"
  hitTimer = setTimeout(async () => {
    const game = await missBeachBall();

    // restart sendTimer
    startSendTimer();

    // update all clients
    io.of('/game').emit('update', { game: game });
  }, timeToHit);
}

function startSendTimer() {
  clearTimeout(hitTimer);
  console.log('waiting for', timeToWait);
  sendTimer = setTimeout(async () => {
    sendBall();
  }, timeToWait);
}

function getRandomItem(set) {
  let items = Array.from(set);
  return items[Math.floor(Math.random() * items.length)];
}

exports.sendUserUpdate = async function (user) {
  // console.log('sending', user);
  io.of('/game').to(user.socketId).emit('update', { user });
};


exports.sendGameUpdate = async function ({game, user}) {
  // console.log('sending', user);
  io.of('/game').emit('update', { game, user });
};
