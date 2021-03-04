/*
 * This is the youtube related module, this class has many handful methods
 * that just need the song link or the video name 
*/

const yt = require('yt-search');
//https://www.npmjs.com/package/yt-search
module.exports = class YoutubeUtils {
    constructor(){}

    is_playlist = (link) => {
        const regexp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/
        const match = link.match(regexp);
        return match && match[2];
    }
    
    //Get video info by natural input or link
    get_video = async (args) => (await yt(args)).videos[0];

    get_list_id = (link) => {
        const splitted = link.split('&');
        for (let i = 0; i < splitted.length; i++) {
            if (splitted[i].startsWith('list='))
                return splitted[i].replace('list=','');
        }
    }
    
    get_song_link = async (args) => {
        let info = await this.get_video(args);
        return info.url;
    }

     /**
     * @param {playlist}
     * @returns {links} the obtained links from playlist
     */
    get_playlist_songs_info = async (playlist) =>{
        let songs = [];
        const plist = await yt({listId : this.get_list_id(playlist)});
        plist.videos.forEach(async song => {
            try {
                const full_song = await yt({videoId : song.videoId});
                songs.push(full_song);
            }
            catch (e) {
                console.log("Exception in get_playlist_songs_info: ",e);
            }
        })
        return songs;
    }

}