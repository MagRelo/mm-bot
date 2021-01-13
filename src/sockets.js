import io from 'socket.io-client';

// setup socket connection
let socket;
export const initiateSocket = ({ room, discordId }) => {
  // connect
  socket = io('/');
  console.log(`Connecting socket...`);
  if (socket && room) {
    console.log('socket', !!socket, discordId);
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

export const disconnectSocket = () => {
  console.log('Disconnecting socket...');
  if (socket) socket.disconnect();
};

// send
export const sendClap = ({ roomNumber, discordId, userName, amount }) => {
  if (socket) socket.emit('clap', { roomNumber, discordId, userName, amount });
};
