const { handleClap } = require('./controllers/game');
const { announce } = require('./controllers/listener');
const { getOrCreateUser } = require('./controllers/user');

// const { BeachBallModel } = require('./models');

// TEST = ENV
const url = 'http://localhost:3000';

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
      //
      const user = await handleClap(game, socket, data);

      let announcement = '';
      if (data.amount === 1) {
        announcement = user.username + ' clapped!';
      } else {
        announcement = user.username + ` clapped ${data.amount}X!`;
      }

      // bot announcement in channel
      announce(announcement);

      // console.log('sockets', data);
    });

    // socket.on('vote', (data) => {
    //   // GameController.handleVote(game, socket, data);
    //   console.log(data);
    // });
  });

  return io;

  // function startBeachBall() {
  //   const userInterval = 10 * 1000; // 15 sec between users
  //   const expireTime = 5 * 1000; // 4 sec to hit ball

  //   const userTimer = setInterval(() => {
  //     // get users

  //     var clientsList = io.sockets.adapter.rooms['general'];
  //     // var numClients = clientsList.length;

  //     console.log(clientsList);

  //     // push in beachball with expiration
  //     const expires = new Date(Date.now() + expireTime);
  //     const newBall = BeachBallModel({
  //       targetuser: '',
  //       expires: expires,
  //     });

  //     // update game

  //     // game.emit new 'ballholder'
  //   }, userInterval);
  // }
};
