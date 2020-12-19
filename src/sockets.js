import io from 'socket.io-client';
let socket;
export const initiateSocket = (room) => {
  socket = io('http://localhost:8080/game');
  console.log(`Connecting socket...`);
  if (socket && room) {
    console.log('socket', !!socket);
    socket.emit('join', room);
  }
};
export const disconnectSocket = () => {
  console.log('Disconnecting socket...');
  if (socket) socket.disconnect();
};
export const subscribeToChat = (cb) => {
  if (!socket) return true;
  socket.on('chat', (msg) => {
    console.log('Websocket event received!');
    return cb(null, msg);
  });
};

// send
export const sendClap = (room, message) => {
  if (socket) socket.emit('clap', { message, room });
};
