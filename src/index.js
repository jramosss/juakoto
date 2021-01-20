//Server stuff
const PORT = process.env.PORT || 5000;

//External libraries
const fs = require('fs')
const Discord = require('discord.js');

//Files
const CREDENTIALS = require('../db/credentials')
const prefix_file = require('./prefix.js')
const utils = require('./utils.js')
const play = require('./play.js')
const embeds = require('../resources/embeds');
const { info } = require('console');

//Global consts
const ALIAS_FILENAME = '../db/aliases'
const TOKEN = CREDENTIALS.TOKEN;
const ULTIMO_PREVIA_Y_CACHENGUE = 35;
const bot = new Discord.Client();

//Global vars
let prefix = prefix_file.load_prefix();
let aliases = utils.read_aliases(ALIAS_FILENAME);

//Emojis
const CORTE = '776276782125940756';
const SPEAKER = '🔈';
const PLAY = '▶️';
const DISK = '💾';
const OK = '👍';

//TODO
/*
const Spotify = require('spotify-web-api-js');
var spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken('<here_your_access_TOKEN>'); */

bot.login(TOKEN);

bot.on('ready', () => { console.log("Buendiaaa");})

//Core Function
bot.on('message',async msg => {
    if (msg.author.bot) return;
    let args = msg.content.substring(prefix.length+1).split(" ");
    //!This causes all the messages to be sent twice (¿?¿??¿)
    console.log("Message: ",args);
    let raw_input = msg.content.substring(prefix.length+1).replace(args[0],"");

    //Handle aliases
    if (utils.dict_contains(aliases,args[0])) {
        try {
            play.enqueue(msg,aliases[args[0]]);
        }
        catch (e){
            console.log("Exception in alias: " + aliases + e);
            msg.channel.send("Jejej se rompio todo sorry usa un bot mas competente");
        }
        finally{
            return;
        }
    }

    switch (args[0]){
        
        //Register a new alias
        //TODO check if alias link is valid
        case "alias":
            if (!args[1] || !args[2]){
                msg.channel.send("No me pasaste argumentos, usage: juakoto alias <alias> <link>");
                break;
            }
            if (utils.dict_contains(aliases,args[1])){
                msg.channel.send("Alias " + args[1] + " ya registrado");
                break;
            }
            let dict = [args[1],args[2]];
            utils.write_to_file(ALIAS_FILENAME,dict,'a+',true);
            aliases[args[1]] = args[2];
            msg.channel.send("Nuevo alias registrado `" + args[1] + "` linkeado a " + args[2]);
            msg.react(DISK);
            break;

        //display all aliases
        case "aliases":
            try {
                msg.channel.send("Aliases: \n");
                msg.channel.send("```"+utils.objToString(aliases)+"```");
            }
            catch (e) {
                msg.channel.send("No hay aliases ");
                console.log("Exception in aliases: " + e);
            }
            break;

        //Make bot quick challenge
        case "andate":
        case "leave":
        case "tomatela":
        case "shu":
            msg.member.voice.channel.leave();
            play.clear_queue();
            break;
        
        //Clears queue
        case "c":
        case "clear":
            play.clear_queue();
            msg.channel.send("Cola vaciada\n");
            play.pause();
            break;
        
        //greets
        case "gracias":
            msg.channel.send("De nada " + msg.member.user.username);
            msg.react('🥰');
            break;

        //Get song link by input (natural language)
        case "getlink":
        case "find":
            if (!args[1]){
                msg.channel.send("No me pasaste argumentos, usage juakoto " + args[0] + "<titulo del video>");
                break;
            }
            args[0] = '';
            let link = await utils.get_song_link(utils.adapt_input(args));
            msg.channel.send("Resultado de buscar " + raw_input + " " + link);
            msg.react('🔍');
            break;

        //Prints all bot utilities
        case "h":
        case "help":
            msg.channel.send(utils.read_from_file('help'));
            break;

        //Invoke bot into actual voice channel
        case "hola":
        case "veni":
        case "te":
            if (args[0] === "te" && args[1] === "invoco")
                msg.member.voice.channel.join();
            else if (args[0] === "te")
                break;
            else 
                try {
                    if (!msg.guild.voice || msg.member.voice.channel.id !== msg.guild.voice.channelID)
                        msg.member.voice.channel.join();
                    else if (msg.member.voice.channel.id === msg.guild.voice.channelID){
                        msg.channel.send("Ya estoy en el canal pa, sos estupido?");
                        break;
                    }   
                }
                catch (e) {
                    console.log("Exception in hola ", e);
                }
            break;
        
        //Loads queue from file
        case "lq":
        case "loadqueue":
        case "cargarcola":
            if (!args[1]){
                msg.channel.send("No me pasaste argumentos. usage juakoto lq <filename>");
                break;
            }
            const filepath = "../db/queues/" + args[1];
            if (!fs.existsSync(filepath)){
                msg.channel.send("No existe un archivo con ese nombre.\n")
                break;
            }
            try {
                const files = fs.readdirSync("../db/queues/");
                let list = "";
                for (let i = 0; i < files.length; i++){
                    if (files[i] === args[1]){
                        list = fs.readFileSync(filepath,'utf8')
                        break;
                    }
                }
                let links = utils.get_song_links(list);
                let infos = [];
                for (let i = 0; i < links.length; i++) 
                infos.push(await utils.get_song_info(links[i]));
                //infos[0].length
                infos.forEach(song => play.enqueue(msg,song));
                /*                
                if (play.status().paused)
                    play.play_song(msg);*/
            }
            catch (err) {
                console.log("Exception in lq " + err);
            }
            break;
        
        //Displays the title of the current playing song
        case "quesuena":
            try {
                let queue2 = play.get_queue();
                let current = play.get_playing_index();
                msg.channel.send(queue2[current] ? embeds.now_playing(queue2[current]) : 
                                    "No esta sonando nada che flayero")
            }
            catch (e) {
                console.log("Exception in quesuena: " , e);
                msg.channel.send("Me parece que no esta sonando nada pa");
            }
            break;

        //Sends a playlist for <mood> mood
        case "mood":
            if (!args[1]){
                msg.channel.send("Mood que? usage = juakoto mood <mood> (podes listar los mood con juakoto mood list)");
                break;
            }
            let playlist = "";
            switch(args[1]){
                case "chill":
                    playlist = "https://open.spotify.com/playlist/0aNQUD5KlbMZRA0NfP7Iey?si=l4XzJkksQoaa8IScTmPz-A";
                    break;
                case "sad":
                    break;
                case "cachengue":
                    playlist = "https://open.spotify.com/playlist/3AWPgqd0Bk5t2UKAghlKWy?si=JbeMWPzETlOO89YVN5WL8Q";
                    break;
                case "indie":
                    msg.channel.send("Berka sali del canal hippie sucio");
                    playlist = "https://open.spotify.com/playlist/2KK44e1fAYc9Y0aYf3Zulf?si=8mCTXETuQLawplK2fxBCrQ";
                    break;
                case "rock":
                    playlist = "https://open.spotify.com/playlist/4dSzcPPsT8meHeSqs9NZ2P?si=qY0ykm7_TuKO69wfRyXZSQ";
                    break;
                case "eng":
                    playlist = "https://open.spotify.com/playlist/0alj6uaH0IA9b4TIdLNhgQ?si=OtuR9CIaQjiewVM4CMer0g";
                    break;
                case "trap":
                    playlist = "https://open.spotify.com/playlist/00nCFhHxiGriJ3pDoDll69?si=NyZ1m0g5QDG1ku1MCb1vXw";
                    break;
                case "techo":
                case "unchicachi":
                    playlist = "https://open.spotify.com/playlist/2uGcGvoN3TGC8kMEOxfBNo?si=uXCy-McfRJiQfsYBZ5codA";
                    break;
                case "viejito":
                    playlist = "https://open.spotify.com/playlist/4mj2O0ItodoLlqI670pngS?si=F8Zox4H0RIGyb8AL-IXQ2w";
                    break;
                case "list":
                    msg.channel.send("chill/sad/cachengue/indie/rock/eng/trap/techno/viejito");
                    break;
                default:
                    msg.channel.send("Mood no especificado " +
                                    "si tenes quejas metetelas en el orto");
                    msg.channel.send("Na mentira, decile a juli");
                    break;
            }
            msg.channel.send("Por el momento no puedo reproducir playlists por" +
                            " por que el que me programo es un deficiente mental" +
                            " pero si queres te paso una playlist y la pones en el groovy" +
                            " que esta programado por gente mas picante");
            msg.channel.send(playlist);
            break;
        
        //Mutes the bot
        case "mute":
            play.mute();
            msg.react(CORTE);
            break;
            
        //Pauses the bot
        case "pause":
            play.pause();
            msg.react('⏸️');
            break;

        //Play song by input (natural language or yt link)
        case "p":
        case "play":
            if (!args){
                msg.channel.send("Que queres que meta en la cola? Pasame algo,"+
                                 "por que me encanta meterme cosas en la cola\n",
                                 "usage = juakoto play/p <song name/song youtube link>")
                break;
            }
            try {
                await play.enqueue(msg,args);
                msg.react('▶️');
            }
            //TODO make this work
            catch(e){
                if (e instanceof play.NotAllowed)
                    msg.channel.send("No me diste permisos bro\n");
                else if (e instanceof play.NotInAChannel)
                    msg.channel.send("No estas en un canal bro\n");
                else{
                    console.log("Error en play (index.js)" + e);
                    msg.channel.send("Problemitas tecnicos\n");
                }
            }
            break;
        
        //Plays a song instantly, without adding it to the queue
        case "playINSTA":
        case "playinsta":
        case "PLAYINSTA":
        case "playI":
        case "playi":
            if (!args[1]){
                msg.channel.send("Que queres que reproduzca? No soy adivino pa");
                break;
            }
            let response1 = await play.enqueue(msg,args);
            args[1] = response1 ? response1 : "Algo salio mal";
            
        //Jumps to the n-th song in the queue
        case "jump":
            if (!args[1]) {
                msg.channel.send("No me pasaste parametros");
                break;
            }
            if (play.get_queue()[args[1]]){
                play.jump(args[1]);
                play.play_song(msg);
                msg.channel.send("Saltando a la cancion nº" + args[1]);
            }
            else 
                msg.channel.send("Man que flayas no esta esa cancion en la cola")
            break;
    
        //Makes bot stop
        case "paraguayo":
        case "paradoja":
            msg.channel.send("Perdon por trollear :(").then(process.exit(0));
            break; //Not necessary


        case "ping":
        case "ms":
            let ping = bot.ws.ping;
            if (ping > 230) {
                msg.channel.send("Toy re lageado padreee, tengo " + ping + " de ping");
                msg.react(CORTE);
            }
            else {
                msg.channel.send("Tengo " + ping + " de ping");
                msg.react(OK);
            }
            break;
        //Encola las sesiones de previa y cachengue desde n hasta m especificados
        //TODO make const ULTIMO_PYC refresh automatically whenever ferpa uploads a new session
        case "previaycachengue":
        case "pyc":
            let from;
            let to;

            if (!args[1]){
                msg.channel.send("No especificaste desde donde,terrible mogolico,defaulteando a 1")
                from = 1;
            }   
            else 
                from = args[1];

            if (!args[2]){
                msg.channel.send("No especificaste hasta donde,terrible mogolico,defaulteando a" + ULTIMO_PREVIA_Y_CACHENGUE)
                to = ULTIMO_PREVIA_Y_CACHENGUE;
            }
            else
                to = args[2];

            let arr1 = [];
            for (var j = from; j <= to; j++){
                arr1.push("previa y cachengue " + j);
                play.enqueue(msg,arr1);
                arr1 = [];
            }
            break;

        //Modifies bot prefix
        case "prefix":
            if (!args[1]){
                msg.channel.send("Parametro inexistente \n" + 
                                 "usage juakoto prefix <prefix>");
                break;
            }

            prefix = args[1];
            prefix_file.change_prefix(prefix);
            msg.channel.send("prefix cambiado a " + prefix);
            break;
        
        //Sends the prefix through the actual channel
        case "showprefix":
            msg.channel.send("Prefix: " + prefix);
            break;

        //Sends the bot status through a message
        case "status":
            let status = play.status()
            let message1 = "";
            message1 += "*Initialized*: "
            message1 += status.init ? ":white_check_mark: \n" : ":x:\n";
            message1 += "*Playing*: "
            message1 += status.paused ? ":x:" : ":white_check_mark:";
            msg.channel.send(message1);
            break;
        
        //Print Queue
        case "q":
        case "cola":
        case "queue":
            let _queue = play.get_queue();
            let currrent_song_index = play.get_playing_index();
            if (!utils.queue_length(_queue)){
                //?Can the bot react to his own message?
                msg.channel.send("`Cola vacia`")
                msg.react(CORTE);
            }
            else {
                try{
                    const message = embeds.queue_embed(_queue,currrent_song_index);
                    msg.channel.send(message);
                }
                catch(error) {
                    console.log("Exception in queue ", error);
                    break;
                }
            }
            break;

        //Show all saved queues
        case "queues":
            let queues = fs.readdirSync('../db/queues/');
            msg.channel.send("```Queues: " + queues + "```");
            break;
        //Selects a random song from aliases file
        case "random":
            let keys = utils.get_keys(aliases);
            let random = Math.floor(Math.random() * keys.length);
            let song = aliases[keys[random]];
            await play.enqueue(msg,song);
            break;
        
        //Resume
        //TODO add reaction when resuming
        case "r":
        case "resume":
            play.resume();
            msg.react(PLAY);
            break;

        //Skip to next song
        //TODO add reaction when skipping
        case "skip":
        case "n":
        case "next":
            try{
                let queue = play.get_queue();
                let playing_index1 = play.get_playing_index()
                msg.react('⏭️');
                if (queue[playing_index1+1]){
                    play.queue_shift();
                    play.play_song(msg);
                }
                else 
                    play.pause()
            }
            catch (e) {
                console.log("Exception in skip " + e);
            }
            break;

        //makes songs go brrrrrr
        case "satura":
        case "earrape":
            play.set_volume(10);
            msg.channel.send("Espero que nadie este por hacer un clutch\n");
            msg.react(SPEAKER);
            break;

        //Spams a message n times
        case "spam":
            let message = args[1]
            let times = args[2];
            if (!args[1] || !args[2]){
                msg.channel.send("No me mandaste argumentos mogolico\n" + 
                                 "usage = juakoto spam <message> <times>");
                break;
            }
            msg.react(CORTE);
            for (let i = 0; i < times; i++){
                msg.channel.send(message);
                await utils.sleep(1000);
            }
            break;
        
        //shuffles queue
        //!Not working
        case "shuffle":
            let queue = play.get_queue();
            let dict1 = utils.dict_shuffle(queue);
            console.log(dict1);
            play.set_queue(dict1);
            msg.react('🔀');
            break;

        //Saves current queue to <filename> file
        case "sq":
        case "savequeue":
        case "guardarcola":
            try{
                let queue1 = play.get_queue()
                let links = []
                if (!args[1]){
                    msg.channel.send("No me pasaste parametros. usage juakoto sq <filename>");
                    break;
                }
                const filepath = "../db/queues/" + args[1];
                if (fs.existsSync(filepath)){
                    msg.channel.send("Ya existe un archivo con ese nombre");
                    break;
                }
                let queue_len = utils.queue_length(queue1);
                for (var i = 0; i < queue_len; i++)
                    links.push(queue1[i].url)
                    
                utils.write_to_file(filepath,links,'a+');

                msg.channel.send("Cola guardada en " + filepath);
                msg.react(DISK);
            }
            catch (error){
                console.log("Exception in savequeue " + error);
            }

            break;

        //Unmutes the bot, setting volume to previous volume
        case "unmute":
            play.unmute();
            msg.react(SPEAKER);
            break;
        
        //Set bot volume
        case "vs":
        case "volumeset":
            let volume = args[1] ? args[1] : 1;
            play.set_volume(volume)

            msg.react(SPEAKER);
            msg.channel.send(args[1] ? "Volumen seteado a " + volume : 
                            "No me pasaste parametros, seteando a 1");
            break;
        
        //Greets
        case "wendia":
            msg.channel.send("AAAAAAAAAH!!!!!!!!!");
            msg.react(CORTE);
            break;  

        default:
            msg.channel.send("??¿?¿?¿?¿??¿");
            break;
    }
});