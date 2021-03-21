/*
 * This is the player-related module, All things related to playing or
 * enqueueing a song are here.
*/

const Embeds = require('../resources/Embeds')
const Spotify = require('./Spotify');
const Utils = require('./Utils.js');
const Youtube = require('./Youtube');

const ytdl = require('ytdl-core');

const embeds = new Embeds();
const sp = new Spotify();
const utils = new Utils();
const yt = new Youtube();

module.exports = class Player {

    constructor(){}

    //VARS
    queue = {};
    dispatcher;
    last_index = 0;
    playing_index = 0;
    init = false;
    volume = 1;
    paused = true;
    previous_volume = this.volume;
    playing_i_b4_looping = this.playing_index;
    loop = false;
    NOT_IN_A_CHANNEL = "Not in a channel"
    

    async play_song (msg) {
        //Mark the dispatcher as initialized once someone enqueued a song in this session
        this.init = true; 

        const connection = await utils.channel_join(msg);
        if (!connection) throw new Error(this.NOT_IN_A_CHANNEL);

        try {
            const current_song_link = this.queue[this.playing_index].url;
            this.dispatcher = connection.play(ytdl(current_song_link));
        }
        catch (e){
            console.log("Exception in play_song: ",e);
            return;
        }
        this.paused = false;
    
        //Once the song is over, check what the dispatcher should do
        this.dispatcher.on('finish',() => this.handle_next_song(msg))
        
        //I dont know if this is necessary, but it works so i`ll stick to it
        this.dispatcher.setVolumeLogarithmic(5 / 5)
    }

    handle_next_song = (msg) => {
        //If there is a song next
        if (this.queue[this.playing_index+1]){
            msg.channel.send(embeds.now_playing_song(this.queue[this.playing_index+1]));
            this.playing_index++;
            this.play_song(msg);
        }
        else {
            if (this.loop) {
                this.playing_i_b4_looping = this.playing_index;
                this.playing_index = 0;
                this.play_song(msg);
            }
            else {
                this.playing_index++;
                this.paused = true;
            }
        }
    }
    
    //Sit tight bc this is the largest function 
    async enqueue (msg,args) {
        //Check if the user is in a channel, otherwise the bot doesn`t know
        //where he should enter to play the song
        if (!msg.member.voice.channel){
            msg.channel.send("No estas en un canal bro");
            return;
        }

        //Get the song link
        //           this function is to know whether args is a video object
        //           incoming from the database or not
        const link = utils.object_is_video(args) ? args.url :
                     await utils.handle_args(args);
        console.log(link);
    
        const is_yt_playlist = yt.is_playlist(link);
        const is_sp_playlist = sp.is_playlist(link);
    
        if (is_yt_playlist){
            try {
                //Use youtube library to get all songs in the youtube playlist
                const plist_songs = await yt.get_playlist_songs_info(link);
                for (let i = 0; i < plist_songs.length; i++) {
                    //And enqueue those links
                    this.queue[this.last_index] = plist_songs[i];
                    this.last_index++;
                }
            }
            catch (e) {
                console.log("Exception in enqueue yt playlist: ",e);
                msg.channel.send("Ocurrio un error cargando la playlist pero no le des bola pq esta hecho medio como el orto");
            }
        }

        else if (is_sp_playlist){
            const plist_preview = await sp.get_playlist_name_and_image(link);
            try {
                msg.channel.send(embeds.wait_queue(link,plist_preview[0],plist_preview[1]));
            }
            catch (e) {
                console.log("Exception in enqueue: ",e);
            }
            const track_names = await sp.get_playlist_track_names(link);
    
            for (let i = 0; i < track_names.length; i++){
                try {
                    this.queue[this.last_index] = await yt.get_video(track_names[i]);
                    //If this is the first song enqueued, and bot isn`t 
                    //playing anythhing, then play, otherwise just enqueue
                    if (!i && (this.paused || !this.init)) {
                        this.play_song(msg);
                        msg.channel.send(embeds.now_playing_song(
                                            this.queue[this.last_index]));
                        this.last_index++;
                    }
                }
                catch (e) {
                    console.log("Couldn`t get song: ",track_names[i],e);
                    msg.channel.send("No encontre nada parecido a " + track_names[i] +
                                     " en youtube");
                    continue;
                }
                this.last_index++
            }
        }
        //If it is a spotify song
        else if (sp.is_song(link)){
            const name = await sp.get_song_name(link);
            try {
                const info = await yt.get_video(name);
                this.queue[this.last_index] = info;
                this.last_index++;
            }
            catch (e) {
                console.log("Exception in enqueue(sp.is_song): ",e);
                msg.channel.send("No encontre ningun video con lo que me pasaste");
                return;
            }
        }
        //If it is a youtube song
        else {
            this.queue[this.last_index] = utils.object_is_video(args) ? args : 
                                await yt.get_video(link);
            this.last_index++;
        }
        //If all went right
        if (link){
            //If current song is the last one enqueued and bot isnt playing
            if (this.last_index-1 === this.playing_index || !this.init){
                try {
                    //Send an embed message saying that that song is now playing
                    if (is_yt_playlist || is_sp_playlist)
                        msg.channel.send(embeds.now_playing_playlist(link));
                    else 
                        msg.channel.send(embeds.now_playing_song(this.queue[this.last_index-1]));
                }
                catch (e) {
                    console.log(e);
                }
                this.play_song(msg);
            }
            else {
                //Otherwise send an embed message saying that the song was enqueued
                try  {
                    msg.channel.send(is_yt_playlist || is_sp_playlist ?
                                     embeds.enqueued_playlist(link) :
                                     embeds.enqueued_song(this.queue[this.last_index-1]))
                }
                catch (e) {
                    console.log(e);
                }
            }
    
            //returns the number that the song was asociated with
            return this.last_index-1;
        }
        else 
            return null;
    }
    
    get_queue = () => this.queue;
    
    clear_queue = () => this.queue = {};
    
    queue_shift = () => this.playing_index++;
    
    get_dispatcher = () => this.dispatcher;
    
    get_playing_index = () => this.playing_index;
    
    set_playing_index = (index) => this.playing_index = index;
    
    set_last_index = (index) => this.last_index = index;
    
    get_volume = () => this.volume;

    set_volume (new_volume) {
        this.previous_volume = this.volume;
        this.dispatcher.setVolume(new_volume);
        this.volume = new_volume;
    }
    
    mute = () => this.set_volume(0);
    
    unmute = () => this.set_volume(this.previous_volume);
    
    pause () {
        if (this.dispatcher) {
            this.dispatcher.pause();
            this.paused = true;
        }
        else
            console.log("Dispacher uninitialized")
    }
    
    resume ()  {
        this.dispatcher ? this.dispatcher.resume() : 
                          console.log("Dispatcher uninitialized");
    }
    
    jump = (to) => this.playing_index = to;
    
    status () {
        return {
            "paused" : this.paused,
            "init" : this.init
        };
    }
    
    get_song_number (name) {
        for (let song in this.queue) 
            if (this.queue[song] === name)
                return song;

        return null;
    }
    
    //pretty sure this is a very bad practice
    set_queue = (new_queue) =>  this.queue = new_queue;
    
    get_loop = () => this.loop;
    
    set_loop (opt) {
        this.loop = opt;
        if (opt) 
            this.playing_i_b4_looping = this.playing_index;
        else 
            this.playing_index = this.playing_i_b4_looping;
    }

    stop = () => this.dispatcher.stop();
}