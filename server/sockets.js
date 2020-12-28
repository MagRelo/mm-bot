const { handleClap } = require('./controllers/game');
const { announce } = require('./controllers/listener');
const { getOrCreateUser } = require('./controllers/user');

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
  // game.use(gameAuth);
  game.on('connection', (socket) => {
    // events
    socket.on('join', async (data) => {
      if (!data.discordId) {
        return console.log('error: no id');
        // TODO: return error
      }
      const user = await getOrCreateUser({ discordId: data.discordId });
      socket.emit('update', user);
    });

    socket.on('clap', async (data) => {
      //
      const user = await handleClap(game, socket, data);

      let announcement = '';
      let clapEmoji = ":clap:"
      if (data.amount === 1) {
        announcement = `${user.username} ${clapEmoji}`;
      } else {
        announcement = `${user.username} ${clapEmoji.repeat(data.amount)}`;
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
};

// var cookie = require('cookie');
// var cookieParser = require('cookie-parser');
// const sigUtil = require('eth-sig-util')

// const GameController = require('./controllers/game')

// var gameAuth = function socketAuth(socket, next){

//   // var handshakeData = socket.request;
//   // var parsedCookie = cookie.parse(handshakeData.headers.cookie);

//   // Check for valid cookie and session
//   if (!parsedCookie.servesa){
//     console.log('no servesa cookie');
//   } else {

//     let cookieObject
//     try {
//       cookieObject = JSON.parse(parsedCookie.servesa)
//     } catch (e) {
//       console.log(e);
//     }

//     if(cookieObject){
//       // setup recovery
//       const msgParams = [{
//         name: 'Message',
//         type: 'string',
//         value: 'You will be logged into game ' + cookieObject.gameId
//       }]
//       const recovered = sigUtil.recoverTypedSignature({
//         data: msgParams,
//         sig: cookieObject.signature
//       })

//       // if it matches then we have a valid cookie.
//       if (recovered === cookieObject.userAddress) {
//         // console.log('Recovered signer: ' + recovered)

//         // check session store for this address, and return the games that they should have access to
//         // TODO - for testing we'll take their word for it
//         socket.userId = cookieObject.userAddress
//         socket.gameId = cookieObject.gameId

//       } else {
//         console.log('Failed to verify signer, got: ' + recovered)
//         // box em out
//       }
//     }

//   }

//   return next();
// };
