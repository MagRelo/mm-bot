const { spend, receive, getOrCreateUser } = require('./user');
const { UserModel } = require('../models');
const { GameModel } = require('../models');

// clap
exports.handleClap = async function (game, socket, data) {
  try {
    // get game
    const game = await GameModel.findOne({}).populate('targetUser');

    console.log(data.discordId)
    console.log(game.targetUser.discordId)
    // decrease use
    const updatedUser = await spend(data.discordId, 'clap', data.amount);
    await receive(game.targetUser.discordId, 'clap', data.amount);

    // update client
    socket.emit('update', updatedUser);

    return updatedUser;
  } catch (error) {
    console.log(error);
    return Promise.resolve(socket.emit('error', error));
  }
};

exports.setTarget = async function (discordUser) {
  const user = await getOrCreateUser(discordUser);
  return GameModel.findOneAndUpdate(
    {},
    {
      targetUser: user._id,
    },
    { new: true }
  );
};

exports.getUserRemote = async function (discordUser) {
  const user = await getOrCreateUser(discordUser);
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

exports.getLeaderboard = async function() {
  console.log('updating leaderboard');
  const users = await UserModel.find({clap: {$ne: null}}).sort({clap: -1})
  ret = ""
  users.forEach(user => {
    console.log(user)
    ret += user.username + ": " + user.clap + "\n";
  })
  return ret;
};

exports.saveMessage = async function(messageId) {
  GameModel.findOneAndUpdate(
    {},
    {
      statuseMessageId: messageId,
    },
    { new: true }
  );
}

exports.getGameState = async function() {
  const game = await GameModel.findOne()
  return game;
}
