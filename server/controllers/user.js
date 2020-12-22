const UserModel = require('../models').UserModel;

const reactions = {
  clap: {
    cost: 1,
  },
  encore: {
    cost: 25,
  },
};

exports.spend = async function (memberId, reaction, amount) {
  return await UserModel.findOneAndUpdate(
    { discordUser: memberId },
    {
      $inc: { mmBalance: -1 * reactions[reaction].cost * amount },
    },
    { new: true }
  );
};

exports.receive = async function (memberId, reaction, amount) {
  return await UserModel.findOneAndUpdate(
    { discordUser: memberId },
    {
      $inc: { [reaction]: amount },
    },
    { new: true, upsert: true }
  );
};

exports.fund = async function (memberId, amount) {
  return await UserModel.findOneAndUpdate(
    { discordUser: memberId },
    {
      $inc: { mmBalance: amount },
    },
    { new: true, upsert: true }
  );
};

exports.getOrCreateUser = async function (discordUser) {
  // console.log(discordUser);

  const user = await UserModel.findOne({ discordId: discordUser.discordId });

  if (!user) {
    const newUser = new UserModel(discordUser);
    return newUser.save();
  }

  return Promise.resolve(user);
};
