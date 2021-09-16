//All comands are here, here is where all the work gets done

//Server stuff
const PORT = process.env.PORT || 5000;

//require('dotenv').config({path:'../.env'});

//External libraries
import { Message } from 'discord.js';

//Files
//const Alias = require('../classes/Alias');
import Embeds from '../resources/Embeds';
import Emojis from '../utils/emojis';
import Player from '../classes/Play.js';
import Prefix from '../classes/Prefix.js';
//import Stats from '../classes/Stats';
//const Queues = require('../classes/Queues');
import Utils from '../classes/Utils.js';
import Youtube from '../classes/Youtube';

//Global consts
const ULTIMO_PREVIA_Y_CACHENGUE = 35;

//Objects
//const alias = new Alias();
const embeds = new Embeds();
const emojis = new Emojis();
const play = new Player();
const prefix_obj = new Prefix();
//const queues = new Queues();
//const stats = new Stats();
const utils = new Utils();
const yt = new Youtube();

//Emojis
const CORTE = '776276782125940756';
const SPEAKER = '🔈';
const DISK = '💾';
const OK = '👍';
const X = '❌';

//Global vars
let aliases;

export default class Commands {
  constructor() {}

  /*
  register_alias = async (msg: Message, args) => {
    if (!args[1] || !args[2]) {
      msg.channel.send(
        'No me pasaste argumentos, usage: juakoto alias <alias> <link>'
      );
      msg.react(X);
    }
    if (await alias.find(args[1])) {
      msg.channel.send('Alias ' + args[1] + ' ya registrado');
      //TODO ask for input to know if the user wants to redefine the alias
      msg.channel.send('Cambiando valor de ' + args[1] + 'a ' + args[2]);
      alias.redefine(args[1], args[2]);
      msg.react(X);
    }
    if (!utils.valid_URL(args[2])) {
      msg.channel.send('Link invalido');
      msg.react(X);
    }
    msg.channel.send(
      'Nuevo alias registrado `' + args[1] + '` linkeado a ' + args[2]
    );
    msg.react(DISK);
    await alias.create(args[1], args[2]);
    return alias.all();
  };

  show_aliases = async (msg, aliases) => {
    try {
      await msg.channel.send(embeds.aliases(aliases));
    } catch (e) {
      msg.channel.send('No hay aliases registrados');
      console.error('Exception in show_aliases: ' + e);
    }
  };
  */

  leave = async (msg: Message) => {
    if (msg.member.voice && msg.member.voice.channel) {
      msg.member.voice.channel.leave();
      play.clear_queue();
    } else msg.channel.send('No estas en un canal');
  };

  //because bot.on('disconnect') doesn`t have any {msg}
  clear_queue = async (msg: Message = null) => {
    play.clear_queue();
    if (msg) msg.channel.send('`Cola vaciada`\n');
    play.set_playing_index(1);
    play.set_last_index(1);
    play.pause();
  };

  /*
  delete_queue = async (msg: Message, args) => {
    if (!utils.args1_check(args[1], msg, 'dq <queue name>')) return;
    try {
      await queues.delete(args[1]);
      msg.channel.send('`Cola ' + args[1] + ' Borrada`');
      custom_queues = await queues.all();
    } catch (e) {
      console.error('Exception in Commands.delete_queue: ', e);
      msg.channel.send('No existe ninguna cola con ese nombre');
    }
  };
  */

  find = async (msg: Message, args: string[], raw_input: string) => {
    if (!args[1]) {
      msg.channel.send(
        'No me pasaste argumentos, usage juakoto ' +
          args[0] +
          '<titulo del video>'
      );
      msg.react(X);
    }
    const link = await yt.get_song_link(utils.adapt_input(args));
    msg.channel.send(embeds.link_search(raw_input, link));
    msg.react('🔍');
  };

  display_help = async msg => {
    const help1 = utils.read_from_file('../db/help');
    const help2 = utils.read_from_file('../db/help2');
    msg.channel.send(embeds.help(help1));
    msg.channel.send(embeds.help(help2));
  };

  loop = async msg => {
    const loop = play.get_loop();
    play.set_loop(!loop);
    await msg.channel.send(
      loop ? '`Dejando de loopear la cola`' : '`Loopeando la cola`'
    );
  };

  load_queue = async (msg, args) => {
    if (!args[1]) {
      msg.channel.send('No me pasaste argumentos. usage juakoto lq <filename>');
      msg.react(X);
    }

    try {
      let songs = await queues.find(args[1]);
      songs = songs.split(',');
      songs.forEach(l => play.user_enqueue(msg, l));
    } catch (e) {
      console.error('Exception in load_queue: ' + e);
      msg.channel.send('No existe ninguna cola con ese nombre');
      msg.react(X);
    }
  };

  now_playing = async msg => {
    try {
      const queue2 = play.get_queue();
      const current = play.get_playing_index();
      const nowplaying = queue2[current];
      await msg.channel.send(
        nowplaying
          ? embeds.now_playing_song(nowplaying)
          : 'No esta sonando nada che flayero'
      );
    } catch (e) {
      console.error('Exception in Commands.now_playing: ' + e);
      msg.channel.send('Me parece que no esta sonando nada pa');
    }
  };

  mood = async (msg, args) => {
    if (!args[1]) {
      msg.channel.send(
        'Mood que? usage = juakoto mood <mood> (podes listar los mood con juakoto mood list)'
      );
      msg.react(X);
    }
    let playlist = '';
    switch (args[1]) {
      case 'chill':
        playlist =
          'https://open.spotify.com/playlist/0aNQUD5KlbMZRA0NfP7Iey?si=l4XzJkksQoaa8IScTmPz-A';
        break;
      case 'sad':
        playlist =
          'https://open.spotify.com/playlist/0sH5tySeyLIlOHfuUOBtMs?si=JQ3aGzbBTcybX8xJ1t4etA';
        break;
      case 'cachengue':
        playlist =
          'https://open.spotify.com/playlist/3AWPgqd0Bk5t2UKAghlKWy?si=JbeMWPzETlOO89YVN5WL8Q';
        break;
      case 'indie':
        await msg.channel.send('Berka sali del canal hippie sucio');
        playlist =
          'https://open.spotify.com/playlist/2KK44e1fAYc9Y0aYf3Zulf?si=8mCTXETuQLawplK2fxBCrQ';
        break;
      case 'rock':
        playlist =
          'https://open.spotify.com/playlist/4dSzcPPsT8meHeSqs9NZ2P?si=qY0ykm7_TuKO69wfRyXZSQ';
        break;
      case 'eng':
        playlist =
          'https://open.spotify.com/playlist/0alj6uaH0IA9b4TIdLNhgQ?si=OtuR9CIaQjiewVM4CMer0g';
        break;
      case 'trap':
        playlist =
          'https://open.spotify.com/playlist/00nCFhHxiGriJ3pDoDll69?si=NyZ1m0g5QDG1ku1MCb1vXw';
        break;
      case 'techo':
      case 'unchicachi':
        playlist =
          'https://open.spotify.com/playlist/2uGcGvoN3TGC8kMEOxfBNo?si=uXCy-McfRJiQfsYBZ5codA';
        break;
      case 'viejito':
        playlist =
          'https://open.spotify.com/playlist/4mj2O0ItodoLlqI670pngS?si=F8Zox4H0RIGyb8AL-IXQ2w';
        break;
      case 'list':
        await msg.channel.send(
          'chill/sad/cachengue/indie/rock/eng/trap/techno/viejito'
        );
        break;
      default:
        await msg.channel.send('Mood no especificado: <juakoto mood list>');
        break;
    }
    await play.user_enqueue(msg, playlist);
  };

  play = async (msg, args) => {
    if (!args[1]) {
      msg.channel.send(
        'Que queres que meta en la cola? Pasame algo,' +
          'por que me encanta meterme cosas en la cola\n',
        'usage = juakoto play/p <song name/song youtube link>'
      );
      msg.react(X);
    }
    msg.react('▶️');
    try {
      await play.user_enqueue(msg, args);
    } catch (e) {
      //TODO make this work
      if (e.name === play.NOT_IN_A_CHANNEL)
        msg.channel.send('No estas en un canal bro\n');
      else {
        console.error('Exception in Commands.play' + e);
        msg.channel.send('Problemitas tecnicos\n');
      }
    }
  };

  playI = async (msg, args) => {
    if (!args[1]) {
      msg.channel.send('Que queres que reproduzca? No soy adivino pa');
      msg.react(X);
    }
    const response1 = await play.user_enqueue(msg, args);
    args[1] = response1 + 1;
    await this.jump(msg, args);
  };

  jump = async (msg, args) => {
    if (!args[1]) {
      msg.channel.send('No me pasaste parametros');
      msg.react(X);
    }
    const queuex = play.get_queue();
    const num = args[1] - 1;
    if (queuex[num]) {
      play.jump(num);
      await msg.react('🛐');
      await play.play_song(msg);
      //Could be an embed
      await msg.channel.send(
        'Saltando a la cancion nº' + (num + 1) + ': `' + queuex[num].title + '`'
      );
    } else
      await msg.channel.send('Man que flayas no esta esa cancion en la cola');
  };

  ping = async msg => {
    const ping = bot.ws.ping;
    if (ping > 200) {
      await msg.channel.send(
        'Toy re lageado padreee, tengo ' + ping + ' de ping'
      );
      await msg.react(CORTE);
    } else {
      await msg.channel.send('Tengo ' + ping + ' de ping');
      await msg.react(OK);
    }
  };

  previa_y_cachengue = async (msg, args) => {
    const from = args[1] | 1;
    const to = args[2] | ULTIMO_PREVIA_Y_CACHENGUE;

    if (!args[1]) {
      msg.channel.send(
        'No especificaste desde donde,terrible mogolico,defaulteando a 1'
      );
      msg.react(X);
    }

    if (!args[2]) {
      msg.channel.send(
        'No especificaste hasta donde,terrible mogolico,defaulteando a ' +
          ULTIMO_PREVIA_Y_CACHENGUE
      );
      msg.react(X);
    }

    for (let j = from; j <= to; j++)
      await play.user_enqueue(msg, ['previa y cachengue' + j]);
  };

  change_prefix = async (msg, args) => {
    if (!args[1]) {
      msg.channel.send(
        'Parametro inexistente \n' + 'usage juakoto prefix <prefix>'
      );
      msg.react(X);
    }

    prefix_obj.change_prefix(prefix);
    msg.channel.send('`Prefix cambiado a ' + prefix + '`');
    return args[1];
  };

  status = async msg => {
    const status = play.status();
    let message1 = '';
    message1 += '*Initialized*: ';
    message1 += status.init ? ':white_check_mark: \n' : ':x:\n';
    message1 += '*Playing*: ';
    message1 += status.paused ? ':x:' : ':white_check_mark:';
    await msg.channel.send(message1);
  };

  stop = async msg => {
    play.stop();
    play.clear_queue();
    await msg.react('🛑');
  };

  display_queue = async msg => {
    const _queue = play.get_queue();
    const currrent_song_index = play.get_playing_index();
    if (!utils.queue_length(_queue)) {
      //?Can the bot react to his own message?
      await msg.channel.send('`Cola vacia`');
      await msg.react(CORTE);
    } else
      await msg.channel.send(embeds.queue_embed(_queue, currrent_song_index));
  };

  show_queues = async (msg, custom_queues) => {
    let names = [];
    if (custom_queues === [] || !custom_queues)
      await msg.channel.send('No hay colas guardadas');
    else custom_queues.forEach(q => names.push(q[0].getDataValue('name')));

    if (names != []) await msg.channel.send(embeds.queues(names));
  };

  random_song = async msg => {
    const keys = utils.get_keys(aliases);
    const random = Math.floor(Math.random() * keys.length);
    const song = aliases[keys[random]];
    await play.enqueue(msg, song);
  };

  next = async msg => {
    const queue = play.get_queue();
    const playing_index1 = play.get_playing_index();
    msg.react('⏭️');
    if (queue[playing_index1 + 1]) {
      play.queue_shift();
      await msg.channel.send(
        embeds.now_playing_song(queue[playing_index1 + 1])
      );
      await play.play_song(msg);
    } else play.pause();
  };

  mute = () => play.mute();

  pause = () => play.pause();

  resume = async msg => {
    play.resume();
    await msg.react(PLAY);
  };

  spam = async (msg, args) => {
    if (!args[1] || !args[2]) {
      await msg.channel.send(
        'No me mandaste argumentos mogolico\n' +
          'usage = juakoto spam <message> <times>'
      );
      await msg.react(X);
    }
    const message = args[1];
    const times = args[2];
    await msg.react(CORTE);
    for (let i = 0; i < times; i++) {
      await msg.channel.send(message);
      await utils.sleep(1000);
    }
  };

  shuffle_queue = async msg => {
    const queue = play.get_queue();
    const dict1 = utils.dict_shuffle(queue);
    play.set_queue(dict1);
    await msg.react('🔀');
  };

  save_queue = async (msg, args) => {
    const queue1 = play.get_queue();
    if (!args[1]) {
      msg.channel.send('No me pasaste parametros. usage juakoto sq <filename>');
      msg.react(X);
    }
    let _links = [];

    for (let i = 0; i < Object.keys(queue1).length; i++)
      _links.push(queue1[i].url);

    await msg.channel.send('`Cola guardada: ' + args[1] + '`');
    await msg.react(DISK);
    await queues.create(args[1], _links);
    return await queues.all();
  };

  unmute = () => play.unmute();

  volume_set = async (msg, args) => {
    const volume = args[1] ? args[1] : 1;
    const prev_volume = play.get_volume();
    play.set_volume(volume);

    await msg.react(SPEAKER);
    if (volume > prev_volume) await msg.react('➕');
    else if (volume < prev_volume) await msg.react('➖');
    if (volume > 10) await msg.channel.send('Nt pero el volumen maximo es 10');

    await msg.channel.send(
      args[1]
        ? 'Volumen seteado a ' + volume
        : 'No me pasaste parametros, seteando a 1'
    );
  };
}
