const Discord = require('discord.js');
const client = new Discord.Client();
const mmbotToken = process.env.DISCORD_KEY;

const { getUserRemote, setTarget, getLeaderboard } = require('./game');
const { resetClaps } = require('./user');

const admins = [
  '491657957071650828',
  '519999958397485066',
  '761285444905205791',
  '722889011550486558',
  '383461425219239936',
];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
  const parsedCommand = msg.content.split(' ')[0].toLowerCase();
  // console.log(parsedCommand);

  // get user remote
  if (parsedCommand === 'moneystick') {
    try {
      const URL = await getUserRemote({
        discordId: msg.author.id,
        ...msg.author,
      });
      return msg.author.send('Your personal remote control: ' + URL);
    } catch (error) {
      console.log(error);
      return msg.reply('Error');
    }
  }

  // target => admin can set who reactions (claps) flow to
  if (parsedCommand === 'introducing') {
    // Check Admin

    if (admins.indexOf(msg.member.id) < 0) {
      console.log(admins.indexOf(msg.member.id));
      return msg.reply('Access Denied!');
    }

    const newTarget = msg.mentions.users.values().next().value;
    await setTarget(newTarget);
    const channel = client.channels.cache.find(
      (channel) => channel.name === 'general'
    );
    return channel.send(
      `Welcome ${newTarget.username} to the stage  **+:money_with_wings:100**\n:clap: for ${newTarget.username}`
    );
  }

  if (parsedCommand === 'scoreboard') {
    const leaderboardStats = await getLeaderboard();
    // const game = await getGameState();
    const channel = client.channels.cache.find(
      (channel) => channel.name === 'general'
    );
    return await channel.send(leaderboardStats);
  }

  if (parsedCommand === 'reset') {
    if (admins.indexOf(msg.member.id) < 0) {
      console.log(admins.indexOf(msg.member.id));
      return msg.reply('Access Denied!');
    }

    await resetClaps();
    // const game = await getGameState();
    const channel = client.channels.cache.find(
      (channel) => channel.name === 'general'
    );
    return await channel.send("All user's :clap: reset to 0");
  }
});

//
client.login(mmbotToken);

// Make announcement in channel
exports.announce = async function (message) {
  const channel = client.channels.cache.find(
    (channel) => channel.name === 'general'
  );
  channel.send(message);
};
