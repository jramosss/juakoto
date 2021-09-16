import { MessageEmbed } from 'discord.js';
import { URL } from '../utils/types';

export default class Embeds {
  private make_embed_fields(queue, current_song) {
    const len = current_song + 9;
    let fields = [];
    let opt = Object.keys(queue).length > 10;
    for (let i = opt ? current_song : 0; i <= len; i++)
      if (queue[i])
        if (i === current_song)
          fields.push({
            name: '-> ' + (i + 1) + ':  ' + queue[i].title,
            value: queue[i].duration.timestamp,
          });
        else
          fields.push({
            name: i + 1 + ':  ' + queue[i].title,
            value: queue[i].duration.timestamp,
          });
    return fields;
  }

  queue_embed = (queue, current_song) => {
    if (!queue || current_song === undefined) return;
    const embeds = this.make_embed_fields(queue, current_song);
    const message = new MessageEmbed()
      .setColor('BLUE')
      .setTitle('Cola')
      .setThumbnail('https://i.imgur.com/yUQgHbh.jpg[/img]')
      .addFields(embeds);

    return message;
  };

  enqueued_song = song => {
    if (!song) return;
    const message1 = new MessageEmbed()
      .setColor('BLUE')
      .setTitle('Añadida a la cola')
      .addField(song.title, song.duration.timestamp);

    return message1;
  };

  enqueued_playlist = pl_link => {
    if (!pl_link) return;
    const message1 = new MessageEmbed()
      .setColor('DARK_BUT_NOT_BLACK')
      .setTitle('Añadida a la cola')
      .addField('Playlist', pl_link);

    return message1;
  };

  now_playing_song = song1 => {
    if (!song1) return;
    const message2 = new MessageEmbed()
      .setColor('GREEN')
      .setTitle('Reproduciendo')
      .addField(song1.title, song1.duration.timestamp);

    return message2;
  };

  now_playing_playlist = playlist => {
    if (!playlist) return;
    const message3 = new MessageEmbed()
      .setColor('BLURPLE')
      .setTitle('Reproduciendo')
      .addField('Playlist', playlist);

    return message3;
  };

  link_search = (args, link: URL) => {
    if (!link) return;
    const message3 = new MessageEmbed()
      .setColor('DARK_NAVY')
      .addField('Resultado de la busqueda ' + args, link);

    return message3;
  };

  help = text => {
    const msg = new MessageEmbed()
      .setColor('RANDOM')
      .addField('Comandos', text);
    return msg;
  };
  wait_queue = (url, name, thumbnail) => {
    const msg1 = new MessageEmbed()
      .setColor('RANDOM')
      .addField(
        'Encolando la playlist ' + name + ' (Puede tomar un tiempo)',
        url
      )
      .setThumbnail(thumbnail);
    return msg1;
  };

  make_embed_aliases = dict => {
    const keys = Object.keys(dict);
    const values = Object.values(dict);
    const len = keys.length;
    let res = [];
    for (let i = 0; i < len; i++)
      if (keys[i] && values[i]) res.push({ name: keys[i], value: values[i] });

    return res;
  };

  aliases = dict => {
    if (!dict) return;
    const res = this.make_embed_aliases(dict);
    const message4 = new MessageEmbed().setColor('RANDOM').addFields(res);

    return message4;
  };

  queues = list => {
    if (!list) return;
    const msg3 = new MessageEmbed()
      .setColor('RANDOM')
      //.setTitle("Colas")
      .addField('Colas', list);
    return msg3;
  };
}
