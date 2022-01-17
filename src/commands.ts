//All comands are here, here is where all the work gets done

//Server stuff
const PORT = process.env.PORT || 5000;

//require('dotenv').config({path:'../.env'});

//External libraries
import { Emoji, Message } from 'discord.js';

//Files
//const Alias = require('../classes/Alias');
import Embeds from '../resources/Embeds';
import Emojis from '../utils/emojis';
import Player from '../classes/Play';
import Prefix from '../classes/Prefix';
//import Stats from '../classes/Stats';
//const Queues = require('../classes/Queues');
import Utils from '../classes/Utils';
import Youtube from '../classes/Youtube';
import { URL } from '../utils/types';
import { YTVideo } from '../utils/interfaces';
import { help1, help2 } from '../utils/consts';

//Global consts
const ULTIMO_PREVIA_Y_CACHENGUE = 35;

//Objects
//const alias = new Alias();
const embeds = new Embeds();
const play = new Player();
const prefix_obj = new Prefix();
//const queues = new Queues();
//const stats = new Stats();
const utils = new Utils();
const yt = new Youtube();

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
      msg.react(Emojis.X);
    }
    if (await alias.find(args[1])) {
      msg.channel.send('Alias ' + args[1] + ' ya registrado');
      //TODO ask for input to know if the user wants to redefine the alias
      msg.channel.send('Cambiando valor de ' + args[1] + 'a ' + args[2]);
      alias.redefine(args[1], args[2]);
      msg.react(Emojis.X);
    }
    if (!utils.valid_URL(args[2])) {
      msg.channel.send('Link invalido');
      msg.react(Emojis.X);
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
    if (msg.member && msg.member.voice && msg.member.voice.channel) {
      //! Check if this is what i want
      msg.member.voice.disconnect();
      play.clear_queue();
    } else msg.channel.send('No estas en un canal');
  };

  join = async (msg: Message) => {
    await utils.channel_join(msg, true);
  };

  //because bot.on('disconnect') doesn`t have any {msg}
  clear_queue = async (msg?: Message) => {
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
          args[1] +
          '<titulo del video>'
      );
      msg.react(Emojis.X);
    }
    //const link = await yt.get_song_link(utils.adapt_input(args));
    //msg.channel.send(embeds.link_search(raw_input, link));
    msg.react('🔍');
  };

  display_help = async (msg: Message) => {
    //msg.channel.send(embeds.help(help1));
    //msg.channel.send(embeds.help(help2));
  };

  loop = async (msg: Message) => {
    const loop = play.isLooping();
    play.set_loop(!loop);
    await msg.channel.send(
      loop ? '`Dejando de loopear la cola`' : '`Loopeando la cola`'
    );
  };

  /*
  load_queue = async (msg: Message, args) => {
    if (!args[1]) {
      msg.channel.send('No me pasaste argumentos. usage juakoto lq <filename>');
      msg.react(Emojis.X);
    }

    try {
      let songs = await queues.find(args[1]);
      songs = songs.split(',');
      songs.forEach(l => play.user_enqueue(msg, l));
    } catch (e) {
      console.error('Exception in load_queue: ' + e);
      msg.channel.send('No existe ninguna cola con ese nombre');
      msg.react(Emojis.X);
    }
  };
  */

  now_playing = async (msg: Message) => {
    try {
      const queue2 = play.get_queue();
      const current = play.get_playing_index();
      //const nowplaying: YTVideo = queue2[current];
      //if (nowplaying)
      //  await msg.channel.send(embeds.now_playing_song(nowplaying));
      //else await msg.channel.send('No esta sonando nada che flayero');
    } catch (e) {
      console.error('Exception in Commands.now_playing: ' + e);
      msg.channel.send('Me parece que no esta sonando nada pa');
    }
  };

  mood = async (msg: Message, args: string[]) => {
    if (!args[1]) {
      msg.channel.send(
        'Mood que? usage = juakoto mood <mood> (podes listar los mood con juakoto mood list)'
      );
      msg.react(Emojis.X);
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
    await play.user_enqueue(msg, [playlist]);
  };

  play = async (msg: Message, args: string[]) => {
    if (!args[1]) {
      msg.channel.send(
        'Que queres que meta en la cola? Pasame algo,' +
          'por que me encanta meterme cosas en la cola\n' +
          'usage = juakoto play/p <song name/song youtube link>'
      );
      msg.react(Emojis.X);
    }
    msg.react(Emojis.PLAY);
    try {
      await play.user_enqueue(msg, args);
    } catch (e) {
      console.error(e);
    }
  };

  playI = async (msg: Message, args: string[]) => {
    if (!args[1]) {
      msg.channel.send('Que queres que reproduzca? No soy adivino pa');
      msg.react(Emojis.X);
    }
    const response1 = await play.user_enqueue(msg, args);
    //TODO fix
    await this.jump(msg, args);
  };

  jump = async (msg: Message, args: string[]) => {
    if (!args[1]) {
      msg.channel.send('No me pasaste parametros');
      msg.react(Emojis.X);
    }
    const queue = play.get_queue();
    const num = parseInt(args[1]) - 1;
    const selected: YTVideo = queue[num];
    if (selected) {
      play.jump(num);
      await msg.react('🛐');
      await play.play_song(msg);
      //Could be an embed
      await msg.channel.send(
        'Saltando a la cancion nº' + (num + 1) + ': `' + selected + '`'
      );
    } else
      await msg.channel.send('Man que flayas no esta esa cancion en la cola');
  };

  previa_y_cachengue = async (msg: Message, args: string[]) => {
    const from = parseInt(args[1]) | 1;
    const to = parseInt(args[2]) | ULTIMO_PREVIA_Y_CACHENGUE;

    if (!args[1]) {
      msg.channel.send(
        'No especificaste desde donde,terrible mogolico,defaulteando a 1'
      );
      msg.react(Emojis.X);
    }

    if (!args[2]) {
      msg.channel.send(
        'No especificaste hasta donde,terrible mogolico,defaulteando a ' +
          ULTIMO_PREVIA_Y_CACHENGUE
      );
      msg.react(Emojis.X);
    }

    for (let j = from; j <= to; j++)
      await play.user_enqueue(msg, ['previa y cachengue' + j]);
  };

  change_prefix = async (msg: Message, args: string[]) => {
    if (!args[1]) {
      msg.channel.send(
        'Parametro inexistente \n' + 'usage juakoto prefix <prefix>'
      );
      msg.react(Emojis.X);
    }

    const new_prefix = args[1];

    prefix_obj.change_prefix(new_prefix);
    msg.channel.send('`Prefix cambiado a ' + new_prefix + '`');
    return new_prefix;
  };

  status = async (msg: Message) => {
    const status = play.status();
    let message1 = '';
    message1 += '*Initialized*: ';
    message1 += status.init ? ':white_check_mark: \n' : ':x:\n';
    message1 += '*Playing*: ';
    message1 += status.paused ? ':x:' : ':white_check_mark:';
    await msg.channel.send(message1);
  };

  stop = async (msg: Message) => {
    play.stop();
    play.clear_queue();
    await msg.react('🛑');
  };

  display_queue = async (msg: Message) => {
    const queue = play.get_queue();
    const currrent_song_index = play.get_playing_index();
    if (!queue.length) {
      //?Can the bot react to his own message?
      await msg.channel.send('`Cola vacia`');
      await msg.react(Emojis.CORTE);
    } else {
      const embed = embeds.queue_embed(queue, currrent_song_index);
      await msg.channel.send({ embeds: [embed] });
    }
  };

  /*
  show_queues = async (msg: Message, custom_queues) => {
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
  */

  next = async (msg: Message) => {
    const queue = play.get_queue();
    const playing_index1 = play.get_playing_index();
    msg.react(Emojis.FF);
    if (queue[playing_index1 + 1]) {
      play.queue_shift();
      const embed = embeds.now_playing_song(queue[playing_index1 + 1]);
      await msg.channel.send({ embeds: [embed] });
      await play.play_song(msg);
    } else play.pause();
  };

  mute = () => play.mute();

  pause = () => play.pause();

  resume = async (msg: Message) => {
    play.resume();
    await msg.react(Emojis.PLAY);
  };

  spam = async (msg: Message, args: string[]) => {
    if (!args[1] || !args[2]) {
      await msg.channel.send(
        'No me mandaste argumentos mogolico\n' +
          'usage = juakoto spam <message> <times>'
      );
      await msg.react(Emojis.X);
    }
    const message = args[1];
    const times = parseInt(args[2]);
    await msg.react(Emojis.CORTE);
    for (let i = 0; i < times; i++) {
      await msg.channel.send(message);
      await utils.sleep(1000);
    }
  };

  shuffle_queue = async (msg: Message) => {
    const queue = play.get_queue();
    const dict = utils.array_shuffle(queue);
    play.set_queue(dict);
    await msg.react('🔀');
  };

  /*
  save_queue = async (msg: Message, args) => {
    const queue1 = play.get_queue();
    if (!args[1]) {
      msg.channel.send('No me pasaste parametros. usage juakoto sq <filename>');
      msg.react(Emojis.X);
    }
    let _links = [];

    for (let i = 0; i < Object.keys(queue1).length; i++)
      _links.push(queue1[i].url);

    await msg.channel.send('`Cola guardada: ' + args[1] + '`');
    await msg.react(DISK);
    await queues.create(args[1], _links);
    return await queues.all();
  };
  */

  unmute = () => play.unmute();

  volume_set = async (msg: Message, args: string[]) => {
    const volume = args[1] ? parseInt(args[1]) : 1;
    const prev_volume = play.get_volume();
    play.set_volume(volume);

    await msg.react(Emojis.SPEAKER);
    if (volume > prev_volume) await msg.react('➕');
    else if (volume < prev_volume) await msg.react('➖');
    if (volume > 10) await msg.channel.send('Nt pero el volumen maximo es 10');

    await msg.channel.send(
      args[1]
        ? 'Volumen seteado a ' + volume
        : 'No me pasaste parametros, seteando a 1'
    );
  };

  gracias = async (msg: Message) => {
    if (msg.member) {
      await msg.channel.send('De nada ' + msg.member.user.username);
      await msg.react(Emojis.LOVE);
    }
  };

  juernes = async (msg: Message) => {
    const juernesSoundtrack = 'https://www.youtube.com/watch?v=_XxLrVu9UHE';
    await this.play(msg, [juernesSoundtrack]);
    await msg.react(Emojis.CRAZY);
  };

  satura = async (msg: Message) => {
    await this.volume_set(msg, ['', '10']);
    await msg.channel.send('Espero que nadie este por hacer un clutch\n');
    await msg.react(Emojis.SPEAKER);
  };

  wendia = async (msg: Message) => {
    msg.channel.send('AAAAAAAAAH!!!!!!!!!');
    msg.react(Emojis.CORTE);
  };
}
