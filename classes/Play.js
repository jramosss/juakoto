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
    
    //!This is always the same message, may cause problems
    async play_song (msg) {
        this.init = true; 
        const connection = await utils.channel_join(msg);
        if (!connection) throw new Error(this.NOT_IN_A_CHANNEL);
        try {
            const current_song_link = this.queue[this.playing_index].url;
            this.dispatcher = connection.play(ytdl(current_song_link));
        }
        catch (e){
            console.log("Exception in play_song: ",e);
        }
        this.paused = false;
    
        //Maybe i can modularize this
        this.dispatcher.on('finish',() => {
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
        })
    
        this.dispatcher.setVolumeLogarithmic(5 / 5)
    }
    
    async enqueue (msg,args) {
        if (!msg.member.voice.channel){
            msg.channel.send("No estas en un canal bro");
            return;
        }
        const link = utils.object_is_video(args) ? args.url :
                     await utils.handle_args(args);
    
        const is_yt_playlist = yt.is_playlist(link);
        const is_sp_playlist = sp.is_playlist(link);
    
        if (is_yt_playlist){
            try {
                const plist_songs = await yt.get_playlist_songs_info(link);
                for (let i = 0; i < plist_songs.length; i++) {
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
                console.log("Exception in enqueue 95: ",e);
            }
            const track_names = await sp.get_playlist_track_names(link);
    
            for (let i = 0; i < track_names.length; i++){
                try {
                    this.queue[this.last_index] = await yt.get_video(track_names[i]);
                    if (!i && (this.paused || !this.init)) {
                        this.play_song(msg);
                        msg.channel.send(embeds.now_playing_song(
                                            this.queue[this.last_index]));
                        this.last_index++;
                    }
                }
                catch (e){
                    console.log("Couldn`t get song: ",track_names[i],e);
                    msg.channel.send("No encontre nada parecido a " + track_names[i] +
                                     " en youtube");
                    continue;
                }
                this.last_index++
            }
        }
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
        else {
            this.queue[this.last_index] = utils.object_is_video(args) ? args : 
                                await yt.get_video(link);
            this.last_index++;
        }
    
        if (link){
            if (this.last_index-1 === this.playing_index || !this.init){
                try {
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
            "init" : this.init};
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
}