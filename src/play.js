const ytdl = require('ytdl-core');
const utils = require('./utils.js');
const embeds = require('../resources/embeds')
const Youtube = require('./Youtube');
const yt = new Youtube();
const Spotify = require('./Spotify');
const sp = new Spotify();

let queue = {};
let dispatcher;
let last_index = 0;
let playing_index = 0;
let init = false;
let volume = 1;
let paused = true;
let previous_volume = volume;
let playing_i_b4_looping = playing_index;
let loop = false;

//!This is always the same message, may cause problems
async function play_song (msg) {
    init = true; 
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

    dispatcher.setVolumeLogarithmic(5 / 5)
}

async function enqueue (msg,args) {
    if (!msg.member.voice.channel){
        msg.channel.send("No estas en un canal bro");
        return;
    }
    const link = utils.object_is_video(args) ? args.url :
                 await utils.handle_args(args);

    //TODO research how can i handle > 25 songs
    const is_yt_playlist = yt.is_playlist(link);
    if (is_yt_playlist){
        const plist_songs = await yt.get_playlist_songs_info(link);
        for (let i = 0; i < plist_songs.length; i++) {
            queue[last_index] = plist_songs[i];
            last_index++;
        }
    }
    else if (sp.is_playlist(link)){
        return true;
    }
    else if (sp.is_song(link)){
        const name = await sp.get_song_name(link);
        const info = await yt.get_video(name);
        queue[last_index] = info;
        last_index++;
    }
    else {
        queue[last_index] = utils.object_is_video(args) ? args : 
                            await yt.get_song_info(link);
        last_index++;
    }

    if (link){
        if (last_index-1 === playing_index || !init){
            if (is_yt_playlist)
                msg.channel.send(embeds.now_playing_playlist(link));
            else 
                msg.channel.send(embeds.now_playing_song(queue[last_index-1]));
            play_song(msg);
        }
        else
            msg.channel.send(is_yt_playlist ? embeds.enqueued_playlist(link) :
                             embeds.enqueued_song(queue[last_index-1]))

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
    if (dispatcher) {
        dispatcher.pause();
        paused = true;
    }
    else
        console.log("Dispacher uninitialized")
}

function resume ()  {
    dispatcher ? dispatcher.resume() : console.log("Dispatcher uninitialized");
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
                  pause,resume,jump,status,get_song_number,mute,
                  unmute,set_queue,get_loop,set_loop,set_playing_index,
                  set_last_index};