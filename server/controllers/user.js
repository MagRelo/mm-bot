const UserModel = require('../models').UserModel;

const reactions = {
  clap: {
    cost: 1,
  },
  encore: {
    cost: 25,
  },
};

exports.spend = async function (discordId, reaction, amount) {
  return await UserModel.findOneAndUpdate(
    { discordId: discordId },
    {
      $inc: { mmBalance: -1 * reactions[reaction].cost * amount },
    },
    { new: true }
  );
};

exports.receive = async function (discordId, reaction, amount) {
  return await UserModel.findOneAndUpdate(
    { discordId: discordId },
    {
      $inc: { [reaction]: amount },
    },
    { new: true, upsert: true }
  );
};

exports.fund = async function (discordId, amount) {
  return await UserModel.findOneAndUpdate(
    { discordId: discordId },
    {
      $inc: { mmBalance: amount },
    },
    { new: true, upsert: true }
  );
};

exports.getOrCreateUser = async function ({ discordUser, socketId }) {
  const user = await UserModel.findOneAndUpdate(
    { discordId: discordUser.id },
    { socketId: socketId },
    { new: true }
  );

  if (!user) {
    const newUser = new UserModel({ socketId: socketId, ...discordUser });
    return newUser.save();
  }

  return Promise.resolve(user);
};

exports.endUserSocket = async function ({ socketId }) {
  const user = await UserModel.findOneAndUpdate(
    { socketId: socketId },
    { socketId: null },
    { new: true }
  );

  return user;
};
