const Discord = require('discord.js');
const utils = require('../src/utils');

                            //?Should this be an argument or a function var?
async function make_embed_fields (queue,current_song) {
    const len = current_song + 9;
    let info;
    let fields = [];
    for (let i = current_song; i < len; i++) {
        if (queue[i]){
            info = await utils.get_song_info(queue[i]);
            fields.push({name : info.title, value : info.length});
        }
    }
    return fields;
}

const queue_embed = async (queue,current_song) => {
    const embeds = await make_embed_fields(queue,current_song);
    const message = new Discord.MessageEmbed()
    .setColor('BLUE')
    .setTitle("Cola")
    .setThumbnail('https://i.imgur.com/yUQgHbh.jpg[/img]')
    .addFields(embeds)

    return message;
}

module.exports = {queue_embed};