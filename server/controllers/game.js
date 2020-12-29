const { spend, receive, getOrCreateUser } = require('./user');
const { UserModel, GameModel, BeachBallModel } = require('../models');

// timer function values
const timeToHit = 5000;
const timeToWait = 5000;

// clap
exports.handleClap = async function (data) {
  // get game
  const game = await GameModel.findOne({}).populate('targetUser');

  // decrease user
  const updatedUser = await spend(data.discordId, 'clap', data.amount);

  // increase target
  await receive(game.targetUser.discordId, 'clap', data.amount);

  return updatedUser;
};

exports.setTarget = async function (discordUser) {
  const user = await getOrCreateUser({ discordUser });
  return GameModel.findOneAndUpdate(
    {},
    {
      targetUser: user._id,
    },
    { new: true }
  );
};

exports.getUserRemote = async function (discordUser) {
  const user = await getOrCreateUser({ discordUser });
  const baseURL = process.env.URL || 'https://www.google.com/';
  return baseURL + '?accessCode=' + user.discordId;
};

exports.initiateGame = async function () {
  console.log('init game');
  const game = await GameModel.findOne({});
  if (game) {
    console.log('loaded game');
    return game;
  }

  const randomUser = await UserModel.findOne({});
  const newGame = new GameModel({ targetUser: randomUser._id });

  await newGame.save();
  console.log('new game');
};

exports.getLeaderboard = async function () {
  // Returns text containing top ten users by claps with emojis representing place
  console.log('updating leaderboard');
  const places = [
    ':first_place:',
    ':second_place:',
    ':potato:',
    ':four:',
    ':five:',
    ':six:',
    ':seven:',
    ':eight:',
    ':nine:',
    ':keycap_ten:',
  ];
  const users = await UserModel.find({ clap: { $ne: null } })
    .sort({
      clap: -1,
    })
    .limit(10);
  let ret =
    ':money_with_wings::money_with_wings::money_with_wings:   **SCOREBOARD**   :money_with_wings::money_with_wings::money_with_wings:\n';
  users.forEach((user, index) => {
    ret += places[index] + '  **' + user.username + '**: ' + user.clap + '\n';
  });
  return ret;
};

exports.saveMessage = async function (messageId) {
  GameModel.findOneAndUpdate(
    {},
    {
      statuseMessageId: messageId,
    },
    { new: true }
  );
};

exports.getGameState = async function () {
  const game = await GameModel.findOne();
  return game;
};

// beachball
let hitTimer, sendTimer;
exports.sendBeachBall = sendBeachBall;
async function sendBeachBall(gameSocket) {
  // find user with socket id !== null
  const beachBallUser = await UserModel.findOne({ socketId: { $ne: null } });
  if (!beachBallUser) {
    // cancel?
    return console.log('no user');
  }

  // create beachball
  let timeObject = new Date();
  const ballExpires = new Date(timeObject.getTime() + 5000);

  const newBeachBall = new BeachBallModel({
    targetUser: beachBallUser._id,
    expires: ballExpires,
  });
  await newBeachBall.save();

  // set hit timer for beachball "miss"
  // cleanup sendTimer (someone has the ball)
  clearTimeout(sendTimer);

  // setup countdown to "miss"
  hitTimer = setTimeout(async () => {
    console.log('===not hit within ' + timeToHit + 'ms');

    // update beachball
    newBeachBall.didHit = false;
    await newBeachBall.save();

    // update user
    // beachBallUser

    // start sendTimer
    startSendTimer(gameSocket);

    // announce miss
  }, timeToHit);

  // update game
  const game = await GameModel.findOneAndUpdate(
    {},
    { beachBallUser: newBeachBall.targetUser },
    { new: true }
  ).populate('targetUser beachBallUser');

  // send
  console.log('sending ball to', game);
  return gameSocket.emit('gameUpdate', game);
}

function startSendTimer(gameSocket) {
  clearTimeout(hitTimer);
  sendTimer = setTimeout(async () => {
    console.log('sending new ball');
    sendBeachBall(gameSocket);
  }, timeToWait);
}

exports.hitBeachBall = async function (socketId) {
  // cancel hit timer

  // check for live beachball

  // - update for hit: bb & user balance

  const game = await GameModel.findOne();
  return game;
};
