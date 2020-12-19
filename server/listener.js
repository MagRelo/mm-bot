const Discord = require('discord.js');
const client = new Discord.Client();
const { MessageAttachment } = require('discord.js');

const UserModel = require('./models').UserModel;

const mmbotToken =
  'Nzg4ODIxODM3NzQ3ODQ3MTY4.X9pFlQ.vZt0XoANgH9mnjJIjc9uscKcqzQ';
const channelName = 'general';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// ping
client.on('message', async (msg) => {
  let payees = '';

  if (msg.content.startsWith('fund')) {
    // get amount
    const parsed = msg.content.split(' ');
    const amount = parseInt(parsed[1]);
    console.log(amount);

    // access contol
    const admins = ['491657957071650828'];
    if (!~admins.indexOf(msg.member.id)) {
      return msg.reply('Access Denied!');
    }

    const funds = await Promise.all(
      msg.mentions.users.map((user) => {
        payees = payees + user.username + ', ';
        return fund(user.id, parseInt(amount));
      })
    );

    return msg.reply('Funded ' + payees + ' ' + amount);
  }

  if (msg.content.startsWith('clap')) {
    let payees = '';

    // decrease sender balance
    const spends = await Promise.all(
      msg.mentions.users.map((user) => {
        payees = payees + user.username + ', ';
        return spend(msg.member.id, 'clap');
      })
    );

    // increase targets reaction counts
    const receives = await Promise.all(
      msg.mentions.users.map((user) => {
        return receive(user.id, 'clap');
      })
    );

    const greeting = `CLAP!. You clapped for ${payees}`;
    msg.reply(greeting);

    msg.channel.send(
      new MessageAttachment(
        'https://images-ext-2.discordapp.net/external/0bZZbBeaajMWVW8HpZQ54u5zd0OBUwC7cNZ0h9Axb_E/http/static.skaip.org/img/emoticons/180x180/f6fcff/clap.gif'
      )
    );
  }

  if (msg.content === 'encore') {
    // decrease user's balance
    const updatedUser = await UserModel.findOneAndUpdate(
      { discordUser: msg.member.id },
      {
        $inc: { mmBalance: -1 * reactions['encore'].cost },
      },
      { new: true }
    );

    const greeting = `ENCORE!!!. Your new balance is $${updatedUser.mmBalance}mm`;

    msg.reply(greeting);
  }
});

// greeting
client.on('guildMemberAdd', async (member) => {
  let greeting = '';

  console.log(member.id);

  // check existing users
  const user = await UserModel.findOne({ discordUser: member.id });

  if (user) {
    greeting = `Welcome BACK, @${user.username}! Your balance is $${user.mmBalance}mm`;
  } else {
    // not found > create user record w/ balance
    const newUser = new UserModel({
      username: member.user.username,
      discordUser: member.id,
      ...member,
    });
    await newUser.save();
    greeting = `Welcome to the server, ${newUser.user}. Your balance is $${newUser.mmBalance}mm`;
  }

  // display balance, reactions options + prices

  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.cache.find(
    (ch) => ch.name === channelName
  );
  if (!channel) return;
  return channel.send(greeting);
});

client.login(mmbotToken);

const reactions = {
  clap: {
    cost: 1,
  },
  encore: {
    cost: 25,
  },
};

async function spend(memberId, reaction) {
  return await UserModel.findOneAndUpdate(
    { discordUser: memberId },
    {
      $inc: { mmBalance: -1 * reactions[reaction].cost },
    },
    { new: true }
  );
}

async function receive(memberId, reaction) {
  return await UserModel.findOneAndUpdate(
    { discordUser: memberId },
    {
      $inc: { [reaction]: 1 },
    },
    { new: true, upsert: true }
  );
}

async function fund(memberId, amount) {
  return await UserModel.findOneAndUpdate(
    { discordUser: memberId },
    {
      $inc: { mmBalance: amount },
    },
    { new: true, upsert: true }
  );
}
