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

async function getOrCreateUser({ discordUser, socketId }) {
  // default update
  const updateObject = { socketId: socketId };

  // add avatar if present
  if (discordUser.avatar) {
    updateObject.avatarURL = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`;
  }

  const user = await UserModel.findOneAndUpdate(
    { discordId: discordUser.id },
    updateObject,
    { new: true }
  );

  if (!user) {
    const newUser = new UserModel({ ...updateObject, ...discordUser });
    return newUser.save();
  }

  return Promise.resolve(user);
}
exports.getOrCreateUser = getOrCreateUser;

exports.endUserSocket = async function ({ socketId }) {
  const user = await UserModel.findOneAndUpdate(
    { socketId: socketId },
    { socketId: null },
    { new: true }
  );

  return user;
};

exports.resetClaps = async function () {
  return UserModel.updateMany({}, { clap: 0 }, { new: true });
};

exports.getUserRemote = async function (discordUser) {
  const user = await getOrCreateUser({ discordUser });
  const baseURL = process.env.URL || 'https://www.google.com/';
  return baseURL + '?accessCode=' + user.discordId;
};
