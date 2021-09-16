import Discord from 'discord.js';
const bot = new Discord.Client();
import dotenv from 'dotenv';
dotenv.config();

//const Commands = require('./src/commands');
import { redir } from './src/redir';
//const commands = Commands();

bot.login(process.env.BOT_TOKEN);

bot.once('ready', () => {
  console.log('Buendiaaa');
  //alias.sync().then(async () => (aliases = await alias.all()));
  //queues.sync().then(async () => {
  //  custom_queues = await queues.all();
  //});
});

bot.on('disconnect', async () =>
  /*await commands.clear_queue()*/ console.log('Byee')
);

//Core Function
bot.on('message', async msg => {
  if (msg.author.bot) return;
  redir(msg);
});
