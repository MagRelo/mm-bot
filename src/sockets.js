import io from 'socket.io-client';
let socket;

export const initiateSocket = ({ room, discordId }) => {
  socket = io('http://localhost:8080/game');
  console.log(`Connecting socket...`);
  if (socket && room) {
    console.log('socket', !!socket);
    socket.emit('join', { room, discordId });
  }
};

export const subscribeToChat = (cb) => {
  if (!socket) return true;

  socket.on('update', (msg) => {
    console.log('Websocket event received!');
    return cb(null, msg);
  });
};

export const disconnectSocket = () => {
  console.log('Disconnecting socket...');
  if (socket) socket.disconnect();
};

// send
export const sendClap = ({ roomNumber, userId, userName, amount }) => {
  if (socket) socket.emit('clap', { roomNumber, userId, userName, amount });
};
