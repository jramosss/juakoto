import { Message } from 'discord.js';
import fs from 'fs';
import YoutubeUtils from './Youtube';
import {
  BotAlreadyInChannel,
  BotInAnotherChannel,
  BotNotAllowed,
} from '../utils/exceptions';

const yt = new YoutubeUtils();

export default class Utils {
  sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  //Check if a string is an url
  valid_URL(str: string) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return !!pattern.test(str);
  }

  //Takes a message and adapt the string to make it readable by other functions
  //i.e: it takes ["","play","oasis","wonderwall","live"] into "oasis wondewall live"
  adapt_input = str1 => {
    let str = String(str1);
    let full_input = '';
    str.split(' ').forEach(word => {
      if (word !== 'juakoto' && word !== 'p' && word !== 'play') {
        full_input += word += ' ';
      }
    });
    return full_input;
  };

  //TODO make custom exceptions
  /**
   * @param {opt}: is to recognize when the user sent the command
   * play and not the command "hola"
   **/
  async channel_join(msg: Message, opt = false) {
    const vc = msg.member.voice.channel;
    if (!vc) {
      //msg.react(X).then(msg.react(CORTE));
      msg.channel.send(
        'A que canal queres que me meta si no estas en ninguno mogolico de mierda'
      );
      await this.sleep(2500);
      msg.channel.send('La verdad que me pareces un irrespetuoso');
      await this.sleep(3000);
      msg.channel.send('Hijo de remil puta');
      return;
    } else {
      const permissions = vc.permissionsFor(msg.client.user);
      if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        msg.channel.send('Me sacaste los permisos imbecil');
        throw new BotNotAllowed();
      }
    }
    if (msg.guild.voice && msg.guild.voice.channel) {
      if (msg.member.voice.channel.id === msg.guild.voice.channelID && opt) {
        msg.channel.send('Ya estoy en el canal pa, sos estupido?');
        throw new BotAlreadyInChannel();
      } else if (msg.member.voice.channel.id !== msg.guild.voice.channelID) {
        msg.channel.send('Estoy en otro canal');
        throw new BotInAnotherChannel();
      } else return await msg.member.voice.channel.join();
    } else return await msg.member.voice.channel.join();
  }

  queue_length = dict => Object.keys(dict).length;

  //Used to store the prefix
  write_to_file(filename: string, text: string, flagg: string) {
    try {
      fs.writeFileSync(filename, text, {
        encoding: 'utf8',
        flag: flagg,
      });
    } catch (err) {
      console.error('Exception in Utils.write_to_file: ' + err);
    }
  }

  /**
    * Used to read the prefix
    @returns {file content} if file exists, null otherwise
    */
  read_from_file(filename: string) {
    try {
      return fs.existsSync(filename) ? fs.readFileSync(filename, 'utf8') : null;
    } catch (err) {
      console.error('Exception in Utils.read_from_file' + err);
    }
  }

  //TODO google if it`s a shorter way to do this
  str_arr_contains(str_arr: string[], word: string) {
    for (const s of str_arr) if (s === word) return true;

    return false;
  }

  object_is_video = obj => this.str_arr_contains(Object.keys(obj), 'ago');

  /**
   * *Returns a link based on natural language input
   * @param link or natural language input
   * @returns link
   */
  /*
  async handle_args(args: string[] | string) {
    //TODO should be a smarter & shorter way to do this
    if (this.object_is_video(args)) return args.url;
    else if (args[1]) {
      if (this.object_is_video(args[1])) return args[1].url;
      else if (this.valid_URL(args)) return args;
      else if (this.valid_URL(args[0])) return args[0];
      else if (this.valid_URL(args[1])) return args[1];
      else return await yt.get_song_link(this.adapt_input(args));
    }
  }*/

  async handle_args(args: string[] | string) {
    console.log(args);

    if (this.valid_URL(args[0])) return args[0];
    else return;
  }

  /**
   * get dict keys
   * @param {dict}
   * @returns {array with keys}
   * */
  //! I should get rid of this
  get_keys(dict) {
    let keys = [];
    for (const [key, value] of Object.entries(dict)) keys.push(key);

    return keys;
  }

  //Used to shuffle the queue, I obviously copied this.
  array_shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  dict_shuffle(dict) {
    let random_nums = [];
    for (let i = 0; i < this.queue_length(dict); i++) random_nums.push(i);
    this.array_shuffle(random_nums);

    let new_dict = {};

    for (let i = 0; i < random_nums.length; i++)
      new_dict[i] = dict[random_nums[i]];

    return new_dict;
  }

  //Pretty unnecesary
  args1_check = (args1, msg, usage = '', reaction = '❌') => {
    if (!args1) {
      msg.channel.send('No me pasaste argumentos, ' + usage);
      msg.react(reaction);
      return false;
    }
    return true;
  };
}
