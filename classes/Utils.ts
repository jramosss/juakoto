import { Client, Message } from 'discord.js';
import fs from 'fs';
import YoutubeUtils from './Youtube';
import {
  BotAlreadyInChannel,
  BotInAnotherChannel,
  BotNotAllowed,
} from '../utils/exceptions';
import { YTVideos } from '../utils/types';
import Emojis from '../utils/emojis';
import {
  DiscordGatewayAdapterCreator,
  joinVoiceChannel,
} from '@discordjs/voice';

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

  async threaten(msg: Message) {
    await msg.react(Emojis.X);
    msg.react(Emojis.CORTE);
    msg.channel.send(
      'A que canal queres que me meta si no estas en ninguno mogolico de mierda'
    );
    await this.sleep(2500);
    msg.channel.send('La verdad que me pareces un irrespetuoso');
    await this.sleep(3000);
    msg.channel.send('Hijo de remil puta');
  }

  //TODO make custom exceptions
  /**
   * @param {opt}: is to recognize when the user sent the command
   * play and not the command "hola"
   **/
  async channel_join(msg: Message, opt = false) {
    if (msg.member.voice) {
      const vc = msg.member.voice.channel;

      if (!vc) return;

      if (msg.client.user) {
        const permissions = vc.permissionsFor(msg.client.user);
        if (
          (permissions && !permissions.has('CONNECT')) ||
          !permissions.has('SPEAK')
        ) {
          msg.channel.send('Me sacaste los permisos imbecil');
          throw new BotNotAllowed();
        }
      } else if (msg.guild.available) {
        /*
        if (msg.member.voice.channel.id === msg.guild.) {
          msg.channel.send('Ya estoy en el canal pa, sos estupido?');
          throw new BotAlreadyInChannel();
        } else if (msg.member.voice.channel.id !== msg.guild.voice.channelID) {
            msg.channel.send('Estoy en otro canal');
            throw new BotInAnotherChannel();
        }*/

        return joinVoiceChannel({
          channelId: msg.member.voice.channel.name,
          guildId: msg.guild.id,
          adapterCreator: msg.guild.voiceAdapterCreator as any,
        });
      }
    }
  }

  //object_is_video = obj => this.str_arr_contains(Object.keys(obj), 'ago');

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

  async handle_args(args: string[]): Promise<string> {
    if (this.valid_URL(args[0])) return args[0];
    //else return await yt.get_song_link(this.adapt_input(args));
  }

  //Used to shuffle the queue, I obviously copied this.
  array_shuffle(array: YTVideos) {
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
}
