const get_preview = require("spotify-url-info");

module.exports = class SpotifyUtils {

    constructor(){}

    async get_song_name (link) {
        const info = await get_preview(link);
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
}