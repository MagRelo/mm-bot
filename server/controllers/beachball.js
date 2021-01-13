// const { spend, receive, getOrCreateUser } = require('./user');
const { UserModel, GameModel, BeachBallModel } = require('../models');
const { getConnectedSockets, sendGameUpdate } = require('../sockets');

const timeToHit = process.env.BEACHBALL_TIMETOHIT;
const timeToWait = process.env.BEACHBALL_TIMETOWAIT;

var hitTimer;
var sendTimer;
function startSendTimer() {
  sendTimer = setTimeout(async () => {
    sendBeachBall();
  }, timeToWait);
}
exports.startBeachBall = startSendTimer;

async function sendBeachBall() {
  // get all connected users
  const sockets = await getConnectedSockets();
  console.log('connected sockets:', sockets.length, sockets);
  if (!sockets.length) {
    clearTimeout(sendTimer);
    console.log('waiting for', timeToWait);
    startSendTimer();
    return console.log('no sockets');
  }

  // TODO selsct reandom item...
  const userSocketId = sockets[0];

  // Select a connected User
  const user = await UserModel.findOne({
    $and: [{ socketId: userSocketId }, { socketId: { $ne: null } }],
  });
  if (!user) {
    clearTimeout(sendTimer);
    startSendTimer();
    return console.log('no user for id', userSocketId);
  }

  // create beachball
  let timeObject = new Date();
  const ballExpires = new Date(timeObject.getTime() + 5000);
  const newBeachBall = new BeachBallModel({
    targetUser: user._id,
    expires: ballExpires,
  });
  await newBeachBall.save();

  // update game
  const updatedGame = await GameModel.findOneAndUpdate(
    {},
    { beachBallUser: newBeachBall.targetUser },
    { new: true }
  ).populate('targetUser beachBallUser');

  // if hitTimer runs out the ball was "dropped"
  hitTimer = setTimeout(async () => {
    const game = await missBeachBall();

    // restart sendTimer
    startSendTimer();

    // update all clients
    // io.of('/game').emit('update', { game: game });
  }, timeToHit);

  // send game update
  return sendGameUpdate({ game: updatedGame });
}

exports.hitBeachBall = async function ({ discordId }) {
  // get user
  const user = await UserModel.findOne({ discordId: discordId });
  // console.log(user);

  // check for live beachball
  let date = new Date();
  const liveBall = await BeachBallModel.findOne({
    targetUser: user._id,
    expires: { $gte: date },
  });

  if (!liveBall) {
    console.log('no ball');
    throw new Error(user);
  }

  // update user balance
  user.mmBalance += 10;
  await user.save();
  return user;
};

async function missBeachBall(socketId) {
  // update game
  return GameModel.findOneAndUpdate(
    {},
    { beachBallUser: null },
    { new: true }
  ).populate('targetUser beachBallUser');
}
