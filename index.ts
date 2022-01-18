import { Client, Intents } from 'discord.js';
import { config } from 'dotenv';
import route from './src/router';

const IF = Intents.FLAGS;
const bot = new Client({
  intents: [
    IF.GUILDS,
    IF.DIRECT_MESSAGES,
    IF.DIRECT_MESSAGE_TYPING,
    IF.GUILD_MESSAGES,
  ],
});
config();

//Global vars
const CHULS_DISCRIMINATOR = '';
const prefix = '.';

bot.once('ready', () => {
  console.log('Buendiaaa');
  console.log(prefix);
});

bot.on('disconnect', async () => console.log('Byee'));

//Core Function
bot.on('messageCreate', async msg => {
  if (msg.author.bot || !msg.content.startsWith(prefix)) return;
  const args = msg.content.substring(prefix.length + 1).split(' ');
  const raw_input = msg.content
    .substring(prefix.length + 1)
    .replace(args[0], '');

  console.log('Message: ', args, ' Sent by ', msg.author.username);
  //TODO blacklist

  route(msg, args, raw_input);
});

bot.login(process.env.BOT_TOKEN);
