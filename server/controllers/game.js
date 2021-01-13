const { spend, receive, getOrCreateUser } = require('./user');
const { UserModel, GameModel } = require('../models');

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

exports.initiateGame = async function () {
  const game = await GameModel.findOne({});
  if (game) {
    console.log('loaded game');
    return game;
  }

  const randomUser = await UserModel.findOne({});
  if (randomUser) {
    const newGame = new GameModel({ targetUser: randomUser._id });
    await newGame.save();
    console.log('new game');
  } else {
    console.log('no user - not starting game');
  }
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
