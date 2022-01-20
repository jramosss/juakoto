/*
 * This module has spotify-related functions, to get a song name,
 * thumbnail, know if the passed link is a playlist, etc.
 * This is the library i use https://www.npmjs.com/package/spotify-url-info
 */

import { getData, getPreview, getTracks, Tracks } from 'spotify-url-info';

export default class SpotifyUtils {
  get_song_name = async (link: string) => (await getPreview(link)).title;

  async get_playlist_name_and_image(link: string): Promise<[string, string]> {
    const plist = await getData(link);
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
    const playlist = await getTracks(pl_link);
    let songs: any = [];
    playlist.forEach((song: Tracks) => songs.push(song.name));
    return songs;
  }
}
