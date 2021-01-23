const fs = require('fs');
const Youtube = require('./Youtube')
const yt = new Youtube();

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

function queue_length(dict){
    return Object.keys(dict).length;
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

function str_arr_contains (str_arr,word) {
    for (let i = 0; i < str_arr.length; i++){
        if (str_arr[i] === word)
            return true;
    }
    return false;
}


function object_is_video (obj) {
    return str_arr_contains(Object.keys(obj),'durationSeconds');
}

/**
 * *Returns a link based on natural language input 
 * @param args the natural language input
*/
async function handle_args (args) {
    let link = "";
    if (object_is_video(args))
        link = args.url;
    else if (args[1]) {
        if (object_is_video(args[1])) 
            link = args[1].url;
        else if (valid_URL(args))
            link = args;
        else if (valid_URL(args[0]))
            link = args[0]
        else if (valid_URL(args[1]))
            link = args[1]
        else 
            link = await yt.get_song_link(adapt_input(args));
    }
    
    return link;
}

function dict_contains (dict,elem) {
    //return dict[elem] !== undefined
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

//TODO make custom exceptions
/** 
 * @param {opt} is to recognize whenthe user sent the command
 * play and not the command "hola"
 * */ 
 
async function channel_join (msg,opt=false) {
    const vc = msg.member.voice.channel;
    if (!vc) {
        //msg.react(X).then(msg.react(CORTE));
        msg.channel.send("A que canal queres que me meta si no estas en ninguno mogolico de mierda");
        await sleep(2500);
        msg.channel.send("La verdad que me pareces un irrespetuoso");
        await sleep(3000);
        msg.channel.send("Hijo de remil puta");
        return;
    }
    else{
        const permissions = vc.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK'))
            return msg.channel.send("Me sacaste los permisos imbecil");
    }
    if (msg.guild.voice && msg.guild.voice.channel){
        /*
        try{
            console.log("YO: ",msg.member.voice.channel.id,"EL BOT: ",msg.guild.voice.channelID);
        }
        catch{}*/
        if (msg.member.voice.channel.id === msg.guild.voice.channelID && opt){
            msg.channel.send("Ya estoy en el canal pa, sos estupido?");
            return undefined;
        }
        else if (msg.member.voice.channel.id !== msg.guild.voice.channelID){
            msg.channel.send("Estoy en otro canal")
            return undefined;
        }
        else 
            return await msg.member.voice.channel.join();
    }
    else
        return await msg.member.voice.channel.join();
}

module.exports = {adapt_input,valid_URL,sleep,queue_length,write_to_file,
                  get_song_links,read_from_file,read_aliases,handle_args,
                  dict_contains,objToString,get_keys,dict_shuffle,
                  object_is_video,channel_join};