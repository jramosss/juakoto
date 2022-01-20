//All comands are here, here is where all the work gets done

//External libraries
import { Message } from 'discord.js';

//Files
import Embeds from '../resources/Embeds';
import Emojis from '../utils/emojis';
import Player from '../classes/Play';
import Utils from '../classes/Utils';
import Youtube from '../classes/Youtube';
import { YTVideo } from '../utils/interfaces';

//Global consts
const ULTIMO_PREVIA_Y_CACHENGUE = 35;

//Objects
const embeds = new Embeds();
const play = new Player();
const utils = new Utils();
const yt = new Youtube();

export default class Commands {
  leave = async (msg: Message) => {
    if (msg.member.voice.channel) {
      //! Check if this is what i want
      // msg.member.voice.disconnect();
      play.clear_queue();
    } else msg.channel.send('No estas en un canal');
  };

  join = async (msg: Message) => await utils.channelJoin(msg, true);

  //because bot.on('disconnect') doesn`t have any {msg}
  clear_queue = async (msg?: Message) => {
    play.clear_queue();
    if (msg) msg.channel.send('`Cola vaciada`\n');
    play.set_playing_index(1);
    play.set_last_index(1);
    play.pause();
  };

  find = async (msg: Message, args: string[], raw_input: string) => {
    if (!utils.checkParams(msg, args, this.find)) return;
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

  now_playing = async (msg: Message) => {
    try {
      const queue = play.get_queue();
      const current = play.get_playing_index();
      const nowplaying: YTVideo = queue[current];
      if (nowplaying)
        await msg.channel.send({
          embeds: [embeds.now_playing_song(nowplaying)],
        });
      else await msg.channel.send('No esta sonando nada che flayero');
    } catch (e) {
      console.error('Exception in Commands.now_playing: ' + e);
      msg.channel.send('Me parece que no esta sonando nada pa');
    }
  };

  mood = async (msg: Message, args: string[]) => {
    if (!utils.checkParams(msg, args, this.mood)) return;
    const index = {
      chill:
        'https://open.spotify.com/playlist/0aNQUD5KlbMZRA0NfP7Iey?si=l4XzJkksQoaa8IScTmPz-A',
      sad: 'https://open.spotify.com/playlist/0sH5tySeyLIlOHfuUOBtMs?si=JQ3aGzbBTcybX8xJ1t4etA',
      cachengue:
        'https://open.spotify.com/playlist/3AWPgqd0Bk5t2UKAghlKWy?si=JbeMWPzETlOO89YVN5WL8Q',
      indie:
        'https://open.spotify.com/playlist/2KK44e1fAYc9Y0aYf3Zulf?si=8mCTXETuQLawplK2fxBCrQ',
      rock: 'https://open.spotify.com/playlist/4dSzcPPsT8meHeSqs9NZ2P?si=qY0ykm7_TuKO69wfRyXZSQ',
      eng: 'https://open.spotify.com/playlist/0alj6uaH0IA9b4TIdLNhgQ?si=OtuR9CIaQjiewVM4CMer0g',
      trap: 'https://open.spotify.com/playlist/00nCFhHxiGriJ3pDoDll69?si=NyZ1m0g5QDG1ku1MCb1vXw',
      techno:
        'https://open.spotify.com/playlist/2uGcGvoN3TGC8kMEOxfBNo?si=uXCy-McfRJiQfsYBZ5codA',
      viejito:
        'https://open.spotify.com/playlist/4mj2O0ItodoLlqI670pngS?si=F8Zox4H0RIGyb8AL-IXQ2w',
    };

    await play.user_enqueue(msg, [index[args[0]]]);
  };

  play = async (msg: Message, args: string[]) => {
    if (!utils.checkParams(msg, args, this.play)) return;
    msg.react(Emojis.PLAY);
    await play.user_enqueue(msg, args).catch(e => console.error(e));
  };

  playI = async (msg: Message, args: string[]) => {
    if (!utils.checkParams(msg, args, this.playI)) return;
    await play.user_enqueue(msg, args);
    //TODO fix
    await this.jump(msg, args);
  };

  jump = async (msg: Message, args: string[]) => {
    if (!utils.checkParams(msg, args, this.jump)) return;
    const queue = play.get_queue();
    const num = parseInt(args[0]) - 1;
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
    const from = parseInt(args[0]) | 1;
    const to = parseInt(args[1]) | ULTIMO_PREVIA_Y_CACHENGUE;

    if (!args[0]) {
      msg.channel.send(
        'No especificaste desde donde,terrible mogolico,defaulteando a 1'
      );
      msg.react(Emojis.X);
    }

    if (!args[1]) {
      msg.channel.send(
        'No especificaste hasta donde,terrible mogolico,defaulteando a ' +
          ULTIMO_PREVIA_Y_CACHENGUE
      );
      msg.react(Emojis.X);
    }

    for (let j = from; j <= to; j++)
      //? can this be faste?
      await play.user_enqueue(msg, ['previa y cachengue' + j]);
  };

  changePrefix = async (msg: Message, args: string[]) => {
    if (!utils.checkParams(msg, args, this.changePrefix)) return;
    const new_prefix = args[0];

    //prefix_obj.change_prefix(new_prefix);
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
    if (!utils.checkParams(msg, args, this.spam)) return;
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
    const dict = utils.arrayShuffle(queue);
    play.set_queue(dict);
    await msg.react('🔀');
  };

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
