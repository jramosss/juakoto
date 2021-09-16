/*
 * This module has spotify-related functions, to get a song name,
 * thumbnail, know if the passed link is a playlist, etc.
 * This is the library i use https://www.npmjs.com/package/spotify-url-info
 */

/*
const sp_url_info = require('spotify-url-info');
import { Spotify } from 'spotify-info.js';
const dotenv = require('dotenv').config();

const infos = new Spotify({
  clientID: process.env.SPOTIFY_CLIENT_ID,
  //This is your Spotify api key, you can get yours here
  //https://developer.spotify.com/documentation/general/guides/authorization-guide/
  clientSecret: process.env.SPOTIFY_KEY,
  //and this is an enviroment variable, you should create your own
});

export default class SpotifyUtils {
  constructor() {}

  async get_song_name(link: string): Promise<string> {
    const info = await sp_url_info.getPreview(link);
    return info.title;
  }

  async get_playlist_name_and_image(link: string): Promise<[string, string]> {
    const plist = await infos.getPlaylistByURL(link);
    return [plist.name, plist.images[0].url];
  }

  is_song(link: string) {
    const SP_REGEX =
      /(https?:\/\/open.spotify.com\/(track|user|artist|album)\/[a-zA-Z0-9]+(\/playlist\/[a-zA-Z0-9]+|)|spotify:(track|user|artist|album):[a-zA-Z0-9]+(:playlist:[a-zA-Z0-9]+|))/;
    return SP_REGEX.test(link);
  }

  is_playlist(link: string) {
    const SP_PL_REGEX = new RegExp(
      '^(spotify:|https://[a-z]+.spotify.com/+playlist)'
    );
    return SP_PL_REGEX.test(link);
  }

  async get_playlist_track_names(pl_link: string): Promise<string[]> {
    const playlist = await infos.getPlaylistByURL(pl_link);
    let songs: any = [];
    playlist.tracks.items.forEach((song: any) => songs.push(song.track.name));
    return songs;
  }
}
*/
