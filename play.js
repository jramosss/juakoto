const search = require('youtube-search');
const ytdl = require('ytdl-core');
const utils = require('./utils')
const OPTS = require('./credentials')

const opts = OPTS.opts
let queue = {};
let dispatcher;
let last_index = 0;
let playing_index = 0;
let paused = false;
let init = false;

class NotAllowed extends Error {
    constructor(msg = 'Not allowed') {
      if (Error.captureStackTrace)
        Error.captureStackTrace(this, NotAllowed)
  
      this.name = 'NotAllowed'
    }
}

class NotInAChannel extends Error {
    constructor(msg = 'Not In a channel') {
      if (Error.captureStackTrace)
        Error.captureStackTrace(this, NotInAChannel);
  
      this.name = 'NotInAChannel';
    }
}

async function play_song (msg) {
    init = true;
    let vc = msg.member.voice.channel;
    if (!vc) throw NotInAChannel
    let permissions = vc.permissionsFor(msg.client.user);

    if (!permissions.has('CONNECT') || !permissions.has('SPEAK'))
        throw NotAllowed

        let connection = await vc.join().catch(console.log("Error entrando al canal\n"));
        
        try{
            let current_song_link = queue[playing_index];
            dispatcher = connection.play(ytdl(current_song_link));
            if (paused){
                resume();
                paused = false;
            } 
                
            dispatcher.on('finish',() => {
                if (queue[playing_index+1]){
                    play_song(msg) ;
                }
                else {
                    pause();
                    paused = true;
                }
                playing_index++;
            })
        }
        catch (error){
            console.log(error);
            msg.channel.send("No se puede reproducir la cancion xd\n");
        }
        
        dispatcher.setVolumeLogarithmic(5 / 5)
}

async function enqueue (msg,args) {
    if (args[0] === 'p')
        args[0] = "";

    let link;
    if (utils.valid_URL(args))
        link = args;
    else if (utils.valid_URL(args[1]))
        link = args[1];
    else
        link = await get_link(utils.adapt_input(args));

    queue[last_index] = link;
    last_index++;
    
    //TODO send a message telling which song was enqueued
    msg.channel.send("Cancion añadida a la cola " + link);
    //let info = await song_info(link);
    //return info.videoDetails.title;
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


function get_queue (){
    return queue;
}

function clear_queue () {
    queue = {};
}

function queue_shift () {
    playing_index++;
}

function get_dispatcher () {
    return dispatcher;
}

function get_playing_index () {
    return playing_index;
}

function set_volume (volume) {
    dispatcher.setVolume(volume);
}

function pause () {
    dispatcher.pause();
}

function resume ()  {
    try{
        dispatcher.resume();
    }
    catch{
        console.log("Dispatcher uninitialized\n")
    }
}

function jump (to) {
    playing_index = to;
}

function status () {
    return {
        "paused" : paused,
        "init" : init};
}

module.exports = {play_song,enqueue,get_link,song_info,get_queue,clear_queue,
                  queue_shift,get_dispatcher,get_playing_index,set_volume,
                  pause,resume,NotAllowed,NotInAChannel,jump,status}