const Discord = require('discord.js');
const client = new Discord.Client();
const mmbotToken = process.env.DISCORD_KEY;

const { getUserRemote, setTarget, getLeaderboard } = require('./game');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
  // get user remote
  if (msg.content.startsWith('remote')) {
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
  if (msg.content.startsWith('introducing')) {
    // Check Admin
    const admins = ['491657957071650828', '519999958397485066'];
    if (admins.indexOf(msg.member.id) < 0) {
      console.log(admins.indexOf(msg.member.id));
      return msg.reply('Access Denied!');
    }

    const newTarget = msg.mentions.users.values().next().value;
    await setTarget(newTarget);

    return msg.reply(newTarget.username + ' is on stage. All claps will flow to them.');
  }

  if (msg.content.startsWith('samtest')) {
    const leaderboard = await getLeaderboard();
    return msg.reply(leaderboard);
  }
});

//
client.login(mmbotToken);

// export
exports.announce = async function (message) {
  // TODO

  // console.log('Announcing: ' + message);

  const channel = client.channels.cache.find(
    (channel) => channel.name === 'general'
  );
  channel.send(message);
};
