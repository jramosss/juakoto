//Play song link
//const Discord = require('discord.js');
const search = require('youtube-search');
const ytdl = require('ytdl-core');
const utils = require('./utils')
const OPTS = require('./credentials')

const opts = OPTS.opts
let queue = [];
let dispatcher;

async function play_song (msg) {
    let vc = msg.member.voice.channel;
    if (!vc) return msg.channel.send("No estas en un canal brrreeeo\n");
    let permissions = vc.permissionsFor(msg.client.user);

    if (!permissions.has('CONNECT') || !permissions.has('SPEAK'))
        return msg.channel.send("No me diste permisos breeeo\n");
    try {
        let connection = await vc.join();
        let current_song_link = queue[0];
        //console.log("CURRENT_SONG_link: " + current_song_link);
        let info = await song_info(current_song_link);
        //let title = info.videoDetails.title;

        //console.log("TITLE; " + title);
        //msg.channel.send("Suena " + "`" + title + "`" + "\n" 
        //                                + current_song_link);
        dispatcher = connection.play(ytdl(current_song_link,'audioonly'));

        dispatcher.on('finish',() => {
            queue.shift();
            let next = queue.shift();
            if (next){
                //console.log("AHORA REPRODUCIMOS: " + next);
                play(msg);
            }
            else 
                dispatcher.pause();
        })

        dispatcher.setVolumeLogarithmic(5 / 5)
    }
    catch (error){
        console.log("There was an error joining the voice channel\n");
        console.log(error);
        return msg.channel.send("Paso algo raro brreeeoo\n");
    }
}

//Da info sobre el video de la cancion
async function song_info (song) {
    return new Promise((resolve,reject) => {
        ytdl.getInfo(song).then(resolve,reject);
    });
}

//Obtiene el link de una cancion
async function get_link(song) {
    return new Promise((resolve, reject) => {
        search(song, opts, function(err, results) {
            err ? reject(err) : resolve(results[0].link)
        });
    });
} 

async function enqueue (msg,args) {
    if (args[0] === 'p')
        args[0] = "";

    let link = utils.valid_URL(args[1]) ? args 
               : await get_link(utils.adapt_input(args));

    queue.push(link);
    console.log("PUSHEANDO: " + link);
    if (queue.length !== 1) {
        let titl = await song_info(link);
        msg.channel.send("Cancion añadida a la cola `" 
                         + titl.videoDetails.title + "`");
    }
}

function get_queue (){
    return queue;
}

function clear_queue () {
    queue = []
}

function queue_push (elem) {
    queue.push(elem);
}

function queue_shift () {
    return queue.shift()
}

module.exports = {play_song,enqueue,get_link,song_info,get_queue,clear_queue,queue_push,queue_shift,dispatcher}