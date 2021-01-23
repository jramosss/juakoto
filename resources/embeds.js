const Discord = require('discord.js');

function make_embed_fields (queue,current_song) {
    const len = current_song + 9;
    let fields = [];
    let opt = Object.keys(queue).length > 10;
    for (let i = opt ? current_song : 0; i <= len; i++) {
        if (queue[i])
            fields.push({name : i + ":  " + queue[i].title, value : queue[i].length});
    }
    return fields;
}

const queue_embed = (queue,current_song) => {
    if (!queue || current_song === undefined) return;
    const embeds = make_embed_fields(queue,current_song);
    const message = new Discord.MessageEmbed()
    .setColor('BLUE')
    .setTitle("Cola")
    .setThumbnail('https://i.imgur.com/yUQgHbh.jpg[/img]')
    .addFields(embeds)

    return message;
}

const enqueued_song = (song) => {
    if (!song) return;
    const message1 = new Discord.MessageEmbed()
    .setColor('BLUE')
    .setTitle("Añadida a la cola")
    .addField(song.title,song.length)

    return message1;
}

const enqueued_playlist = (pl_link) => {
    if (!song) return;
    const message1 = new Discord.MessageEmbed()
    .setColor('DARK_BUT_NOT_BLACK')
    .setTitle("Añadida a la cola")
    .addField("Playlist",pl_link)

    return message1;
}

const now_playing_song = (song1) => {
    if (!song1) return;
    const message2 = new Discord.MessageEmbed()
    .setColor('GREEN')
    .setTitle("Reproduciendo")
    .addField(song1.title,song1.length)

    return message2;
}

const now_playing_playlist = (playlist) => {
    if (!playlist) return;
    const message3 = new Discord.MessageEmbed()
    .setColor('BLURPLE')
    .setTitle("Reproduciendo")
    .addField("Playlist",playlist)

    return message3;
}

const link_search = (args,link) => {
    if (!link) return;
    const message3 = new Discord.MessageEmbed()
    .setColor('DARK_NAVY')
    .addField("Resultado de la busqueda " + args,link);

    return message3;
}

const help = (text) => {
    const msg = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .addField("Comandos" ,text)
    return msg;
}

module.exports = {queue_embed,enqueued_song,now_playing_song,link_search,help,
                  now_playing_playlist,enqueued_playlist};