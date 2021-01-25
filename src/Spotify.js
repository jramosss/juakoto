const sp_url_info = require("spotify-url-info");
const { Spotify } = require("spotify-info.js");
const infos = new Spotify({
    clientID: '3b57291372f7424f8f343e3a874005af',
    clientSecret: process.env.SPOTIFY_KEY,
});

module.exports = class SpotifyUtils {

    constructor(){}

    async get_song_name (link) {
        const info = await sp_url_info.getPreview(link);
        return info.title;
    }
    
    is_song (link) {
        const SP_REGEX = /(https?:\/\/open.spotify.com\/(track|user|artist|album)\/[a-zA-Z0-9]+(\/playlist\/[a-zA-Z0-9]+|)|spotify:(track|user|artist|album):[a-zA-Z0-9]+(:playlist:[a-zA-Z0-9]+|))/
        return SP_REGEX.test(link);
    }
    
    is_playlist (link){
        const SP_PL_REGEX = new RegExp("^(spotify:|https://[a-z]+\.spotify\.com/+playlist)");
        return SP_PL_REGEX.test(link);
    }

    async get_playlist_track_names (pl_link) {
        const playlist = await infos.getPlaylistByURL(pl_link);
        let songs = [];
        playlist.tracks.items.forEach(song => songs.push(song.track.name));
        return songs;
    }
}