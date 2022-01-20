import { Message } from 'discord.js';
import YoutubeUtils from './Youtube';
import { BotNotAllowed } from '../utils/exceptions';
import { YTVideos } from '../utils/types';
import Emojis from '../utils/emojis';
import { joinVoiceChannel } from '@discordjs/voice';
import { usages } from '../src/errors';

const yt = new YoutubeUtils();

export default class Utils {
  sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  //Check if a string is an url
  validURL(str: string) {
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
  async channelJoin(msg: Message, opt = false) {
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
      }
      if (msg.guild.available) {
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

  //Used to shuffle the queue, I obviously copied this.
  arrayShuffle(array: YTVideos) {
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

  checkParams(msg: Message, args: string[], fun: any) {
    if (args.length === 0) {
      const message = usages[fun.name];
      if (message) msg.channel.send(message);
      msg.react(Emojis.X);
      return true;
    }
    return false;
  }
}
