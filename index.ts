import { Client, Intents } from 'discord.js';
import { config } from 'dotenv';
import commands_index from './src/commands_index';

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
  if (msg.author.bot) return;
  const args = msg.content.substring(prefix.length + 1).split(' ');
  const raw_input = msg.content
    .substring(prefix.length + 1)
    .replace(args[0], '');

  if (!msg.content.startsWith(prefix)) return;

  console.log('Message: ', args, ' Sent by ', msg.author.username);

  //TODO blacklist
  if (msg.author.id === '342858177064337409') {
    await msg.reply('No le hago caso a gente cara de verga');
    msg.react('❌');
    return;
  }

  //Handle aliases
  const command = args[0];
  const index = commands_index(msg, args, raw_input);
  index[command];
});

bot.login(process.env.BOT_TOKEN);
