const Discord = require('discord.js');
const bot = new Discord.Client();
require('dotenv').config();

//Global vars
let prefix = '-';

bot.login(process.env.BOT_TOKEN);

bot.once('ready', () => {
  console.log('Buendiaaa');
});

//Core Function
bot.on('message', async msg => {
  if (msg.author.bot) return;
  const args = msg.content.substring(prefix.length + 1).split(' ');
  const raw_input = msg.content
    .substring(prefix.length + 1)
    .replace(args[0], '');

  if (!msg.content.startsWith(prefix)) return;

  console.log('Args: ', args);
  console.log('Message: ', args, ' Sent by ', msg.author.username);
});
