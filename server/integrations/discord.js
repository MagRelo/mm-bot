const Discord = require('discord.js');
const client = new Discord.Client();

const {
  getUserRemote,
  setTarget,
  getLeaderboard,
} = require('../controllers/game');
const { resetClaps } = require('../controllers/user');

const mmbotToken = process.env.DISCORD_KEY;
const channelName = process.env.DISCORD_CHANNEL || '🕺-party-chat';
const admins = [
  '491657957071650828',
  '519999958397485066',
  '761285444905205791',
  '722889011550486558',
  '383461425219239936',
];

// login bot
if (process.env.DISCORD_START_BOT === 'true') {
  client.login(mmbotToken);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
  const parsedCommand = msg.content.split(' ')[0].toLowerCase();

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

  // show scoreboard
  if (parsedCommand === 'scoreboard') {
    const leaderboardStats = await getLeaderboard();
    return announceInChannel(leaderboardStats);
  }

  //
  // Admin-only Functions
  //

  // set who reactions (claps) flow to
  if (parsedCommand === 'introducing') {
    // Check Admin
    if (admins.indexOf(msg.member.id) < 0) {
      return msg.reply('Access Denied!');
    }

    // get first user from "mentions"
    const newTarget = msg.mentions.users.values().next().value;
    await setTarget(newTarget);

    const introducingMessage = `Welcome ${newTarget.username} to the stage  **+:money_with_wings:100**\n:clap: for ${newTarget.username}`;
    return announceInChannel(introducingMessage);
  }

  // reset clap balances
  if (parsedCommand === 'reset') {
    // Check Admin
    if (admins.indexOf(msg.member.id) < 0) {
      return msg.reply('Access Denied!');
    }

    await resetClaps();

    return announceInChannel("All user's :clap: reset to 0");
  }
});

// Make announcement in channel
exports.announce = announceInChannel;
async function announceInChannel(message) {
  const channel = client.channels.cache.find(
    (channel) => channel.name === channelName
  );
  if (channel) {
    channel.send(message);
  }
}
