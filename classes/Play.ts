/*
 * This is the player-related module, All things related to playing or
 * enqueueing a song are here.
 */

import Utils from './Utils';
import YoutubeUtils from './Youtube';
import ytdl from 'ytdl-core';

import Embeds from '../resources/Embeds';
//import Spotify from './Spotify';
import { Message } from 'discord.js';
import { URL } from '../utils/types';
import { UserNotInChannel } from '../utils/exceptions';
import { YTVideos } from '../utils/types';
import { YTVideo } from '../utils/interfaces';
import {
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
} from '@discordjs/voice';

const embeds = new Embeds();
//const sp = new Spotify();
const utils = new Utils();
const yt = new YoutubeUtils();

export default class Player {
  queue: YTVideos = [];
  dispatcher: any; //: StreamDispatcher = new StreamDispatcher({});
  last_index = 0;
  playing_index = 0;
  initialized = false;
  volume = 1;
  paused = true;
  previous_volume = this.volume;
  playing_i_b4_looping = this.playing_index;
  loop = false;
  NOT_IN_A_CHANNEL = 'Not in a channel';
  Player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Stop,
    },
  });

  async play_song(msg: Message) {
    //Mark the dispatcher as initialized once someone enqueued a song in this session
    this.initialized = true;

    //const connection = await utils.channelJoin(msg);
    //if (!connection) throw new UserNotInChannel();
    //replace for something like checkConnection()

    try {
      const current_song_link = this.queue[this.playing_index].url;
      const resource = createAudioResource(ytdl(current_song_link));
      this.dispatcher = this.Player.play(resource);
    } catch (e) {
      console.error('In Play.play_song: ' + e);
      return;
    }
    this.paused = false;

    //Once the song is over, check what the dispatcher should do
    this.dispatcher.on('finish', () => this.handle_next_song(msg));

    //I dont know if this is necessary, but it works so i`ll stick to it
    this.dispatcher.setVolumeLogarithmic(5 / 5);
  }

  enqueue = (song: YTVideo) => {
    this.queue.push(song);
    if (this.queue.length !== 1) {
      this.last_index++;
      this.play_song(null);
    }
  };

  async handle_next_song(msg: Message) {
    //If there is a song next
    if (this.queue[this.playing_index + 1]) {
      const embed = embeds.now_playing_song(this.queue[this.playing_index + 1]);
      await msg.channel.send({ embeds: [embed] });
      this.playing_index++;
      this.play_song(msg);
    } else {
      if (this.loop) {
        this.playing_i_b4_looping = this.playing_index;
        this.playing_index = 0;
        this.play_song(msg);
      } else {
        this.playing_index++;
        this.paused = true;
      }
    }
  }

  async handleYoutubePlaylist(link: URL) {
    //Use youtube library to get all songs in the youtube playlist
    const plist_songs = await yt.getPlaylistSongInfo(link);

    plist_songs.forEach(song => {
      this.enqueue(song);
      this.last_index++;
    });
  }

  /*
  async handleSpotifyPlaylist(msg: Message, link: URL) {
    const plist_preview = await sp.get_playlist_name_and_image(link);
    await msg.channel
      .send(embeds.wait_queue(link, plist_preview[0], plist_preview[1]))
      .catch(e => {
        console.error(e);
      });
    const track_names = await sp.get_playlist_track_names(link);

    for (let i = 0; i < track_names.length; i++) {
      try {
        this.enqueue(await yt.get_video(track_names[i]));
        //If this is the first song enqueued, and bot isn`t
        //playing anything, then play, otherwise just enqueue
        if (i === 0 && (this.paused || !this.initialized)) {
          this.play_song(msg);
          msg.channel.send(
            embeds.now_playing_song(this.queue[this.last_index])
          );
          this.last_index++;
        }
      } catch (e) {
        console.error('Couldn`t get song: ' + track_names[i] + e);
        msg.channel.send(
          'No encontre nada parecido a ' + track_names[i] + ' en youtube'
        );
        continue;
      }
      this.last_index++;
    }
  }*/

  //Sit tight bc this is the largest function
  async user_enqueue(msg: Message, args: string[]) {
    //Check if the user is in a channel, otherwise the bot doesn`t know
    //where he should enter to play the song
    if (!msg.member.voice.channel) {
      msg.channel.send('No estas en un canal bro');
      return;
    }

    //Get the song link
    //           this function is to know whether args is a video object
    //           incoming from the database or not
    //We re gonna pretend for the moment that databases dont exists
    //const link = utils.object_is_video(args)
    //  ? args.url
    //  : await utils.handle_args(args);
    //const link = await utils.handle_args(args);
    const link = '';

    const is_yt_playlist = yt.isPlaylist(link);
    //const is_sp_playlist = sp.is_playlist(link);

    if (is_yt_playlist)
      await this.handleYoutubePlaylist(link).catch(e =>
        msg.channel.send(
          'Ocurrio un error cargando la playlist pero no le des bola pq esta hecho medio como el orto'
        )
      );
    /*
    else if (is_sp_playlist) await this.handleSpotifyPlaylist(msg, link);
    //If it is a spotify song
    else if (sp.is_song(link)) {
      const name = await sp.get_song_name(link);
      try {
        this.enqueue(await yt.get_video(name));
        this.last_index++;
      } catch (e) {
        console.error('Exception in enqueue(sp.is_song): ' + e);
        msg.channel.send('No encontre ningun video con lo que me pasaste');
        return;
      }
    }
    */
    //If it is a youtube song
    else {
      //this.queue[this.last_index] = utils.object_is_video(args)
      //  ? args
      //  : await yt.get_video(link);
      this.enqueue(await yt.getVideoData([link]));
      this.last_index++;
    }
    //If all went right
    if (link) {
      //If current song is the last one enqueued and bot isnt playing
      if (this.last_index - 1 === this.playing_index || !this.initialized) {
        //Send an embed message saying that that song is now playing
        if (is_yt_playlist /*|| is_sp_playlist*/)
          msg.channel.send({ embeds: [embeds.now_playing_playlist(link)] });
        else
          msg.channel.send({
            embeds: [embeds.now_playing_song(this.queue[this.last_index - 1])],
          });
        this.play_song(msg);
      } else {
        //Otherwise send an embed message saying that the song was enqueued
        try {
          const embed = is_yt_playlist /*|| is_sp_playlist*/
            ? [embeds.enqueued_playlist(link)]
            : [embeds.enqueued_song(this.queue[this.last_index - 1])];
          msg.channel.send({ embeds: embed });
        } catch (e) {
          console.error(e);
        }
      }

      //returns the number that the song was asociated with
      return this.last_index - 1;
    } else return null;
  }

  get_queue = () => this.queue;

  clear_queue = () => (this.queue = []);

  queue_shift = () => this.playing_index++;

  get_dispatcher = () => this.dispatcher;

  get_playing_index = () => this.playing_index;

  set_playing_index = (index: number) => (this.playing_index = index);

  set_last_index = (index: number) => (this.last_index = index);

  get_volume = () => this.volume;

  set_volume(new_volume: number) {
    this.previous_volume = this.volume;
    //this.dispatcher.setVolume(new_volume);
    this.volume = new_volume;
  }

  mute = () => this.set_volume(0);

  unmute = () => this.set_volume(this.previous_volume);

  pause() {
    if (this.dispatcher) {
      this.dispatcher.pause();
      this.paused = true;
    }
  }

  resume = () => {
    if (this.dispatcher) this.dispatcher.resume();
  };

  jump = (to: number) => (this.playing_index = to);

  status() {
    return {
      paused: this.paused,
      init: this.initialized,
    };
  }

  //?
  get_song_number(name: string[]) {
    const song_name = name.toString();
    for (let i = 0; i < this.queue.length; i++)
      if (this.queue[i].title === song_name) return i;
    return null;
  }

  //pretty sure this is a very bad practice
  set_queue = (new_queue: YTVideos) => (this.queue = new_queue);

  isLooping = () => this.loop;

  set_loop(opt: boolean) {
    this.loop = opt;
    if (opt) this.playing_i_b4_looping = this.playing_index;
    else this.playing_index = this.playing_i_b4_looping;
  }

  stop = () => {
    this.pause();
    this.clear_queue();
  };
}
