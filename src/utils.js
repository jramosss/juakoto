const fs = require('fs');
const credentials = require('../db/credentials.js');
const YouTube = require("discord-youtube-api");
const youtube = new YouTube(credentials.YT_KEY);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
    .catch("Exception in sleep\n");
}
//Check if a string is an url
function valid_URL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

//Takes a message and adapt the string to make it readable by get_song_link
function adapt_input(arr) {
    let str1 = "";
    let i = 0;
    while (arr[i] != null){
        if(arr[i] === "p" || arr[i] === ' '){
            i++;
            continue;
        }
        str1 += arr[i];
        str1 += " ";
        i++;
    }
    return str1;
}

function queue_length(queue){
    let count = 0;
    for (var _ in queue)
        count++;
    return count
}

function write_to_file (filename,text,flagg,brackets=false){
    try {
        if (brackets)
            fs.writeFileSync(filename,
                '[',{
                encoding : 'utf8',
                flag : "a+"});

        fs.writeFileSync(filename,text,{
            encoding : "utf8",
            flag : flagg
        });
        if (brackets)
            fs.writeFileSync(filename,
                ']',{
                encoding : 'utf8',
                flag : "a+"});
    }
    catch (err){
        console.log("Exception in write_to_file: " + err);
    }
}

function read_from_file (filename){
    try {
        return fs.existsSync(filename) ? 
            fs.readFileSync(filename,'utf8') : null;
    }
    catch (err) {
        console.log("Exception in read_from_file" + err)
    }
}

function get_song_links (list) {
    let len = list.length;
    let links = [];
    let aux_str = "";
    for (let i = 0; i <= len; i++){
        if (list[i] === ',' || i == len){
            links.push(aux_str);
            aux_str = "";
        }
        else
            aux_str += list[i];
    }
    return links;
}

async function get_song_info (link) {
    //This doesn`t seem very professional
    let song_info = await youtube.getVideo(link);
    return song_info;
    //This does
    /*
    return new Promise((resolve,reject) => {
        youtube.getVideo(link).then(resolve,reject);
    });
    */
}

//Obtiene el link de una cancion
async function get_video(args) {
    return new Promise((resolve, reject) => {
        youtube.searchVideos(args).then(resolve,reject);
    });
} 

async function get_song_link (args) {
    let info = await get_video(args);
    return info.url;
}

//Returns a dict {alias_name : associated_link} from aliases file
function read_aliases (aliases_filepath) {
    let text = read_from_file(aliases_filepath);
    let fst_word = false;
    let aliases = {};
    let i = 0;
    let fst_word_string = "";
    let snd_word_string = "";
    while (i < text.length) {
        switch (text[i]){
            case "[":
                fst_word = true;
                i++;
                continue;
            case ",":
                fst_word = false;
                i++;
                continue;
            case "]":
                aliases[fst_word_string] = snd_word_string;
                fst_word_string = "";
                snd_word_string = "";
                i++;
                continue;
        }

        if (fst_word)
            fst_word_string += text[i];
        else 
            snd_word_string += text[i];
        i++;
    }
    return aliases;
}

/**
 * *Returns a link based on natural language input 
 * @param args the natural language input
*/
async function handle_args (args) {
    if (args[0] === 'p')
        args[0] = "";

    let link = "";
    if (valid_URL(args))
        link = args;
    else if (valid_URL(args[1]))
        link = args[1];
    else if (valid_URL(args[2]))
        link = args[2];
    else
        link = await get_song_link(adapt_input(args));
    return link;
}

function dict_contains (dict,elem) {
    for (const [key,value] of Object.entries(dict)) {
        if (key == elem)
            return true;
    }
    return false;
}

//Copied from stackoverflow https://stackoverflow.com/questions/5612787/converting-an-object-to-a-string?page=1&tab=votes#tab-top
function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + ' : ' + obj[p] + '\n';
        }
    }
    return str;
}

/**
 * get dict keys
 * @param {dict}
 * @returns {array with keys}
 * */
function get_keys (dict) {
    let keys = [];
    for (const [key,value] of Object.entries(dict)) {
        keys.push(key);
    }
    return keys;
}

/**
 * @param {playlist}
 * @returns {links} the obtained links from playlist
 */
async function get_playlist_links (playlist) {
    let songs = [];
    let playlist_links = await youtube.getPlaylist(playlist);

    for (let i = 0; i < playlist_links.length; i++)
        songs.push(playlist_links[i].url);

    return songs;
}

function array_shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

function dict_shuffle (dict) {
    let random_nums = [];
    for (let i = 0; i < queue_length(dict); i++)
        random_nums.push(i);
    array_shuffle(random_nums);

    let new_dict = {};

    for (let i = 0; i < random_nums.length; i++)
        new_dict[i] = dict[random_nums[i]];

    return new_dict;
}

function is_playlist (link){
    let regexp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/
    let match = link.match(regexp);
    return match && match[2];
}

module.exports = {adapt_input,valid_URL,sleep,queue_length,write_to_file,
                  get_song_links,read_from_file,read_aliases,handle_args,
                  dict_contains,get_song_info,get_song_link,objToString,
                  get_keys,get_playlist_links,dict_shuffle,is_playlist};