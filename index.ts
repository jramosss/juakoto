import { Client, Intents } from 'discord.js';
import { config } from 'dotenv';
//import Alias from '../classes/Alias';
import Emojis from './utils/emojis';
import Prefix from './classes/Prefix';
//import Queues from '../classes/Queues';
import Utils from './classes/Utils';
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
//const alias = new Alias();
let prefix = new Prefix().load_prefix();
//const queues = new Queues();
const utils = new Utils();

const CHULS_DISCRIMINATOR = '';

//Global vars
//if (!prefix) prefix = 'juakoto';
prefix = '.';
//let aliases = null;
//let custom_queues = null;
//let loop = false;

bot.once('ready', () => {
  console.log('Buendiaaa');
  console.log(prefix);
  //alias.sync().then(async () => (aliases = await alias.all()));
  //queues.sync().then(async () => {
  //  custom_queues = await queues.all();
  //});
});

bot.on('disconnect', async () =>
  /*await commands.clear_queue()*/ console.log('Byee')
);

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
  //const aliass = await alias.find(args[0]);
  //if (aliass) await commands.play(msg, aliass);
  const command = args[0];
  const index = commands_index(msg, args, raw_input);
  index[command];
});

bot.login(process.env.BOT_TOKEN);
