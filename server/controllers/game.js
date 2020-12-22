const { spend, receive, getOrCreateUser } = require('./user');
const { UserModel } = require('../models');
const { GameModel } = require('../models');

// clap
exports.handleClap = async function (game, socket, data) {
  try {
    // console.log('clap', data);

    const game = await GameModel.findOne({}).populate('targetUser');

    // decrease use
    const updatedUser = await spend(data.userId, 'clap', data.amount);
    await receive(game.targetUser.discordUserId, 'clap', data.amount);

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
  return baseURL + '?user=' + user.discordId;
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
