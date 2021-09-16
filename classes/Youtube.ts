/*
 * This is the youtube related module, this class has many handful methods
 * that just need the song link or the video name
 */

//https://www.npmjs.com/package/yt-search
const yt = require('yt-search');
import { URL } from '../utils/types';

export default class YoutubeUtils {
  constructor() {}

  is_playlist = (link: string) => {
    const regexp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
    const match = link.match(regexp);
    return match && match[2];
  };

  //Get video info by natural input or link
  get_video = async (args: String[] | URL) => (await yt(args)).videos[0];

  get_list_id = (link: URL) => {
    const splitted = link.split('&');
    for (const s of splitted)
      if (s.startsWith('list=')) return s.replace('list=', '');
  };

  get_song_link = async (args: String[]) => {
    let info = await this.get_video(args);
    return info.url;
  };

  /**
   * @param {playlist} playlist the playlist url
   * @returns {links} the obtained links from playlist
   */
  get_playlist_songs_info = async (playlist: URL) => {
    let songs = [];
    const plist = await yt({ listId: this.get_list_id(playlist) });
    plist.videos.forEach(async song => {
      try {
        const full_song = await yt({ videoId: song.videoId });
        songs.push(full_song);
      } catch (e) {
        console.error('Exception in Youtube.get_playlist_songs_info: ' + e);
      }
    });
    return songs;
  };
}
