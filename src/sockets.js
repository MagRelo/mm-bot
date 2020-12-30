import io from 'socket.io-client';
let socket;

export const initiateSocket = ({ room, discordId }) => {
  // select URL for env
  let URL = 'http://localhost:8080/game';
  if (process.env.NODE_ENV === 'production') {
    URL = process.env.REACT_APP_URL;
  }

  console.log();

  // connect
  socket = io(URL);

  console.log(`Connecting socket...`);
  if (socket && room) {
    console.log('socket', !!socket);
    socket.emit('join', { room, discordId });
  }
};

export const subscribeToChat = (cb) => {
  if (!socket) return true;

  socket.on('update', (msg) => {
    // console.log('Websocket event received!');
    return cb(null, msg);
  });
};

// export const subscribeToBall = (cb) => {
//   if (!socket) return true;

//   socket.on('ballUpdate', (msg) => {
//     // console.log('Websocket event received!');
//     return cb(null, msg);
//   });
// };

// send
// export const sendBall = ({ discordId }) => {
//   if (socket) socket.emit('hitball', { discordId });
// };

export const disconnectSocket = () => {
  console.log('Disconnecting socket...');
  if (socket) socket.disconnect();
};

// send
export const sendClap = ({ roomNumber, discordId, userName, amount }) => {
  if (socket) socket.emit('clap', { roomNumber, discordId, userName, amount });
};
