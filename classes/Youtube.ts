/*
 * This is the youtube related module, this class has many handful methods
 * that just need the song link or the video name
 */

//https://www.npmjs.com/package/yt-search
import yt from 'yt-search';
import { URL } from '../utils/types';

export default class YoutubeUtils {
  isPlaylist = (link: string) => {
    const regexp = new RegExp(/^.*(youtu.be\/|list=)([^#\&\?]*).*/);
    return link.match(regexp) !== null;
  };

  //Get video info by natural input or link
  getVideoData = async (args: URL[]) => (await yt(args.toString())).videos[0];

  //TODO surely there's a better way to do this
  getListID = (link: URL) => {
    const splitted = link.split('&');
    for (const s of splitted)
      if (s.startsWith('list=')) return s.replace('list=', '');
  };

  getPlaylistSongInfo = async (playlist: URL) => {
    let songs = [];
    const plist = await yt(this.getListID(playlist));
    plist.videos.forEach(song => songs.push(song));

    return songs;
  };
}
