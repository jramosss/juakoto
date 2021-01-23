const YouTube = require("discord-youtube-api");
const youtube = new YouTube(process.env.YT_KEY);

module.exports = class YoutubeUtils {
    constructor(){}

    is_playlist (link){
        let regexp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/
        let match = link.match(regexp);
        return match && match[2];
    }

    async get_song_info (link) {
        return await youtube.getVideo(link);
    }
    
    //Get video info by natural input
    async get_video(args) {
        return new Promise((resolve, reject) => {
            youtube.searchVideos(args).then(resolve,reject);
        });
    } 
    
    //Obtiene el link de una cancion
    async get_song_link (args) {
        let info = await this.get_video(args);
        return info.url;
    }

     /**
     * @param {playlist}
     * @returns {links} the obtained links from playlist
     */
    async get_playlist_songs_info (playlist) {
        let songs = [];
        let playlist_links = await youtube.getPlaylist(playlist);
        playlist_links.forEach(song_link => songs.push(song_link));

        return songs;
    }
}