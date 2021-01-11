const ytdl = require('ytdl-core');
const utils = require('./utils');

let queue = {};
let dispatcher;
let last_index = 0;
let playing_index = 0;
let paused = false;
let init = false;
let volume = 1;
let previous_volume = volume;

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

async function play_song (msg) {
    init = true;
    let vc = msg.member.voice.channel;
    if (!vc){//TODO throw NotInAChannel
        msg.channel.send("No estas en un canal bro");
        return;
    } 
    let permissions = vc.permissionsFor(msg.client.user);

    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')){//TODO throw NotAllowed
        return msg.channel.send("No me diste permisos bro")
    }

    //!There was a .catch() here, but the function always print even though it worked
    let connection = await vc.join();
    
    try{
        let current_song_link = queue[playing_index];
        dispatcher = connection.play(ytdl(current_song_link));
        if (paused){
            resume();
            paused = false;
        } 
            
        dispatcher.on('finish',() => {
            if (queue[playing_index+1]){
                msg.channel.send("Reproduciendo " + queue[playing_index+1])
                playing_index++;
                play_song(msg) ;
            }
            else {
                playing_index++;
                pause();
                paused = true;
            }
        })
    }
    catch (error){
        console.log(error);
        msg.channel.send("No se puede reproducir la cancion xd\n");
    }
    
    dispatcher.setVolumeLogarithmic(5 / 5)
}

async function enqueue (msg,args) {
    
    if (!msg.member.voice.channel){
        msg.channel.send("No estas en un canal bro");
        return;
    }

    let link = await utils.handle_args(args);

    let regexp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/
    let match = link.match(regexp);
    let is_playlist;
    //TODO research how can i handle > 25 songs
    if (match && match[2]){
        is_playlist = true;
        let plist_songs = await utils.get_playlist_links(link);
        for (let i = 0; i < plist_songs.length; i++) {
            //console.log("Enqueueing " + plist_songs[i]);
            queue[last_index] = plist_songs[i];
            last_index++;
        }
    }
    else {
        queue[last_index] = link;
        last_index++;
    }

    if (link !== ""){
        if (last_index-1 === playing_index || !init){
            msg.channel.send("Reproduciendo: " + link);
            play_song(msg);
        }
        else
            msg.channel.send(is_playlist ? "Playlist" : "Cancion" + 
                                    " añadida a la cola " + link);
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

function get_song_number (name) {
    for (let song in queue) {
        if (queue[song] === name) {
            return song;
        }
    }
    return null;
}

module.exports = {play_song,enqueue,get_queue,clear_queue,queue_shift,
                  get_dispatcher,get_playing_index,set_volume,
                  pause,resume,NotAllowed,NotInAChannel,jump,status,
                  get_song_number,mute,unmute};