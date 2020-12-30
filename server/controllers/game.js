const { spend, receive, getOrCreateUser } = require('./user');
const { UserModel, GameModel, BeachBallModel } = require('../models');

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

  // increment balance
  user.mmBalance += 50;
  await user.save();

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
  return GameModel.findOne().populate('targetUser beachBallUser');
};

// beachball

exports.sendBeachBall = sendBeachBall;
async function sendBeachBall(userSocketId) {
  const user = await UserModel.findOne({
    $and: [{ socketId: userSocketId }, { socketId: { $ne: null } }],
  });
  if (!user) {
    console.log('no user for id', userSocketId);
    return null;
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
  return GameModel.findOneAndUpdate(
    {},
    { beachBallUser: newBeachBall.targetUser },
    { new: true }
  ).populate('targetUser beachBallUser');
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
    throw new Error(user);
  }

  // update user balance
  user.mmBalance += 10;
  await user.save();
  return user;
};

exports.missBeachBall = async function (socketId) {
  // update game
  return GameModel.findOneAndUpdate(
    {},
    { beachBallUser: null },
    { new: true }
  ).populate('targetUser beachBallUser');
};
