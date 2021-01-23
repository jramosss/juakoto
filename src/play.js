const ytdl = require('ytdl-core');
const utils = require('./utils.js');
const embeds = require('../resources/embeds')

let queue = {};
let dispatcher;
let last_index = 1;
let playing_index = 1;
let init = false;
let volume = 1;
let paused = true;
let previous_volume = volume;
let playing_i_b4_looping = playing_index;
let loop = false;

class MyError extends Error {
    constructor(message) {
        super(message);
       // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
       // This clips the constructor invocation from the stack trace.
       // It's not absolutely essential, but it does make the stack trace a little nicer.
       //  @see Node.js reference (bottom)
        Error.captureStackTrace(this, this.constructor);
    }
}

//TODO implement this exceptions
class NotAllowed extends MyError {
    constructor(error) {
        super(`You are not allowed to do this.`);
        this.data = {error};
    }
}

class NotInAChannel extends Error {
    constructor(msg = 'Not In a channel') {
      if (Error.captureStackTrace)
        Error.captureStackTrace(this, NotInAChannel);
  
      this.name = 'NotInAChannel';
    }
}

//!This is always the same message, may cause problems
async function play_song (msg) {
    init = true; 
    try{
        const connection = await utils.channel_join(msg);
        if (!connection) return;
        const current_song_link = queue[playing_index].url;
        dispatcher = connection.play(ytdl(current_song_link));
        paused = false;

        dispatcher.on('finish',() => {
            if (queue[playing_index+1]){
                msg.channel.send(embeds.now_playing_song(queue[playing_index+1]));
                playing_index++;
                play_song(msg);
            }
            else {
                if (loop) {
                    playing_i_b4_looping = playing_index;
                    playing_index = 0;
                    play_song(msg);
                }
                else {
                    playing_index++;
                    paused = true;
                }
            }
        })
    }
    catch (error){
        console.log(error);
        msg.channel.send("No se puede reproducir la cancion\n");
    }
    
    dispatcher.setVolumeLogarithmic(5 / 5)
}

async function enqueue (msg,args) {
    let link;
    if (!msg.member.voice.channel){
        msg.channel.send("No estas en un canal bro");
        return;
    }
    try {
        if (utils.object_is_video(args))
            link = args.url
        else 
            link = await utils.handle_args(args);
    }
    catch (e){
        link = "";
        console.log("Exception in handle args: ", e)
        msg.channel.send("No encontre ningun video con lo que me pasaste");
    }
    //TODO research how can i handle > 25 songs
    const is_playlist = utils.is_playlist(link);
    if (is_playlist){
        const plist_songs = await utils.get_playlist_songs_info(link);
        for (let i = 0; i < plist_songs.length; i++) {
            queue[last_index] = plist_songs[i];
            last_index++;
        }
    }
    else {
        //?Should i change {link} for {song_info} ?
        if (utils.object_is_video(args))
            queue[last_index] = args;
        else 
            queue[last_index] = await utils.get_song_info(link);
        last_index++;
    }

    if (link){
        if (last_index-1 === playing_index || !init){
            if (is_playlist)
                msg.channel.send(embeds.now_playing_playlist(link));
            else 
                msg.channel.send(embeds.now_playing_song(queue[last_index-1]));
            play_song(msg);
        }
        else {
            if (is_playlist)
                msg.channel.send(embeds.enqueued_playlist(link))
            else 
                msg.channel.send(embeds.enqueued_song(queue[last_index-1]));
        }
        //returns the number that the song was asociated with
        return last_index-1;
    }
    else 
        return null;
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

function set_playing_index (index) {
    playing_index = index;
}

function set_last_index (index) {
    last_index = index;
}

function set_volume (new_volume) {
    previous_volume = volume;
    dispatcher.setVolume(new_volume);
    volume = new_volume;
}

function mute () {
    set_volume(0);
}

function unmute () {
    set_volume(previous_volume);
}

function pause () {
    dispatcher.pause();
    paused = true;
}

function resume ()  {
    dispatcher ? dispatcher.resume() : console.log("Dispatcher uninitialized");
}

function jump (to) {
    playing_index = to;
    play_song(msg);
}

function status () {
    return {
        "paused" : paused,
        "init" : init};
}

function get_song_number (name) {
    for (let song in queue) {
        if (queue[song] === name) {
            return song;
        }
    }
    return null;
}

//pretty sure this is a very bad practice
function set_queue (new_queue) {
    queue = new_queue;
}

function get_loop () {
    return loop;
}

function set_loop (opt) {
    loop = opt;
    if (opt) 
        playing_i_b4_looping = playing_index;
    else 
        playing_index = playing_i_b4_looping;
}

module.exports = {play_song,enqueue,get_queue,clear_queue,queue_shift,
                  get_dispatcher,get_playing_index,set_volume,
                  pause,resume,NotAllowed,NotInAChannel,jump,status,
                  get_song_number,mute,unmute,set_queue,get_loop,set_loop,
                  set_playing_index,set_last_index};