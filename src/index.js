//? How can this file be shorter?

//Server stuff
const PORT = process.env.PORT || 5000;

//require('dotenv').config({path:'../.env'});

//External libraries
const Discord = require('discord.js');

//Files
const Prefix = require('./Prefix.js')
const Youtube = require('./Youtube');
const Utils = require('./Utils.js')
const Player = require('./Play.js')
const Alias = require('./Alias');
const Embeds = require('../resources/Embeds');
const Queues = require('./Queues');

//Global consts
const ULTIMO_PREVIA_Y_CACHENGUE = 35;
const bot = new Discord.Client();

//Objects
const embeds = new Embeds();
const play = new Player();
const prefix_obj = new Prefix();
const utils = new Utils();
const yt = new Youtube();
const alias = new Alias();
const queues = new Queues();

//Global vars
let prefix = prefix_obj.load_prefix();
let aliases;
let custom_queues;
//let loop = false;


//const Spotify = require('./Spotify');
//const sp = new Spotify();

//Emojis
const CORTE = '776276782125940756';
const SPEAKER = '🔈';
const PLAY = '▶️';
const DISK = '💾';
const OK = '👍';
const X = '❌';


//bot.setTimeout()

bot.login(process.env.BOT_TOKEN);

bot.once('ready', () => {
    console.log("Buendiaaa");
    alias.sync().then(async () =>
        aliases = await alias.all()
    );
    queues.sync().then(async () => {
        custom_queues = await queues.all();
    }
    );
});

//Core Function
bot.on('message',async msg => {
    if (msg.author.bot) return;
    let args = msg.content.substring(prefix.length+1).split(" ");
    const raw_input = msg.content.substring(prefix.length+1).replace(args[0],"");
    if (!msg.content.startsWith(prefix)) return;
    console.log("Message: ",args); 

    //Handle aliases
    const aliass = await alias.find(args[0]);
    if (aliass) play.enqueue(msg,aliass)

    switch (args[0]){
        
        //Register a new alias
        //TODO check if alias link is valid
        case "alias":
            if (!args[1] || !args[2]){
                msg.channel.send("No me pasaste argumentos, usage: juakoto alias <alias> <link>");
                msg.react(X);
                break;
            }
            if (await alias.find(args[1])){
                msg.channel.send("Alias " + args[1] + " ya registrado");
                msg.react(X);
                break;
            }
            if (!utils.valid_URL(args[2])){
                msg.channel.send("Link invalido");
                msg.react(X);
                break;
            }
            msg.channel.send("Nuevo alias registrado `" + 
                                args[1] + "` linkeado a " + args[2]);
            msg.react(DISK);
            alias.create(args[1],args[2]).then(
                    async () => aliases = await alias.all());
            break;

        //display all aliases
        case "aliases":
            try {
                msg.channel.send("Dame un sec");
                msg.channel.send('https://tenor.com/view/loading-cat-thinking-wait-what-gif-15922897');
                msg.channel.send(embeds.aliases(aliases));
            }
            catch (e) {
                msg.channel.send("No hay aliases registrados");
                console.log("Exception in aliases: " + e);
            }
            break;

        //Make bot leave
        case "andate":
        case "leave":
        case "tomatela":
        case "shu":
        case "chau":
            if (msg.member.voice && msg.member.voice.channel){
                msg.member.voice.channel.leave();
                play.clear_queue();
            }
            else
                msg.channel.send("No estas en un canal, andate vos");
            break;
        
        //Clears queue
        case "c":
        case "clear":
            play.clear_queue();
            msg.channel.send("`Cola vaciada`\n");
            play.set_playing_index(1);
            play.set_last_index(1);
            play.pause();
            break;

        case "dq":
        case "deletequeue":
            if(!utils.args1_check(args[1],msg,"dq <queue name>")) break;
            try {
                await queues.delete(args[1]);
                msg.channel.send("`Cola " + args[1] + " Borrada`");
                custom_queues = await queues.all();
            }
            catch (e) {
                console.log("Exception in dq: ",e);
                msg.channel.send("No existe ninguna cola con ese nombre");
            }
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
                msg.react(X);
                break;
            }
            const link = await yt.get_song_link(utils.adapt_input(args));
            msg.channel.send(embeds.link_search(raw_input,link));
            msg.react('🔍');
            break;

        //Prints all bot utilities
        //TODO make this prettier
        case "h":
        case "help":
            const help1 = utils.read_from_file('../db/help');
            const help2 = utils.read_from_file('../db/help2');
            msg.channel.send(embeds.help(help1));
            msg.channel.send(embeds.help(help2));
            break;

        //Invoke bot into actual voice channel
        case "hola":
        case "veni":
        case "te":
            if (args[0] === "te")
                if ((args[1] === "invoco"))
                    break;
            else 
                utils.channel_join(msg,true);
            break;
        
        case "loop":
        case "l":
            const loop = play.get_loop();
            play.set_loop(!loop);
            if (loop)
                msg.channel.send("`Dejando de loopear la cola`")
            else
                msg.channel.send("`Loopeando la cola`")
            break;
        
        //Loads queue from file
        //!Somehow this is buggy
        case "lq":
        case "loadqueue":
        case "cargarcola":
            if (!args[1]){
                msg.channel.send("No me pasaste argumentos. usage juakoto lq <filename>");
                msg.react(X);
                break;
            }
            
            try {
                let songs = await queues.find(args[1]);
                songs = songs.split(',');
                songs.forEach(l => play.enqueue(msg,l));
            }
            catch(e){
                console.log("Exception in lq: ",e);
                msg.channel.send("No existe ninguna cola con ese nombre");
                msg.react(X);
            }
            break;
        
        //Displays the title of the current playing song
        case "quesuena":
            try {
                const queue2 = play.get_queue();
                const current = play.get_playing_index();
                msg.channel.send(queue2[current] ? embeds.now_playing_song(queue2[current]) : 
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
                msg.react(X);
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
            play.enqueue(playlist);
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
            if (!args[1]){
                msg.channel.send("Que queres que meta en la cola? Pasame algo,"+
                                 "por que me encanta meterme cosas en la cola\n",
                                 "usage = juakoto play/p <song name/song youtube link>")
                msg.react(X);
                break;
            }
            msg.react('▶️');
            try {
                play.enqueue(msg,args);
            }
            //TODO make this work
            catch(e){
                if (e.name === play.NOT_IN_A_CHANNEL)
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
                msg.react(X);
                break;
            }
            const response1 = await play.enqueue(msg,args);
            args[1] = response1+1;
            
        //Jumps to the n-th song in the queue
        case "jump":
            if (!args[1]) {
                msg.channel.send("No me pasaste parametros");
                msg.react(X);
                break;
            }
            const queuex = play.get_queue();
            const num = args[1]-1;
            if (queuex[num]){
                play.jump(num);
                msg.react('🛐');
                play.play_song(msg);
                //Could be an embed
                msg.channel.send("Saltando a la cancion nº" + num+1 + 
                                 ": `" + queuex[num].title + '`');
            }
            else 
                msg.channel.send("Man que flayas no esta esa cancion en la cola")
            break;
    
        //Makes bot stop
        case "paraguayo":
        case "paradoja":
            msg.channel.send("Perdon por trollear :(").then(process.exit(0));

        case "ping":
        case "ms":
            const ping = bot.ws.ping;
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
                msg.react(X);
                from = 1;
            }   
            else 
                from = args[1];

            if (!args[2]){
                msg.channel.send("No especificaste hasta donde,terrible mogolico,defaulteando a" + ULTIMO_PREVIA_Y_CACHENGUE)
                msg.react(X);
                to = ULTIMO_PREVIA_Y_CACHENGUE;
            }
            else
                to = args[2];

            let arr1 = [];
            for (let j = from; j <= to; j++){
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
                msg.react(X);
                break;
            }

            prefix = args[1];
            prefix_obj.change_prefix(prefix);
            msg.channel.send("`Prefix cambiado a " + prefix + '`');
            break;
        
        //Sends the prefix through the actual channel
        case "showprefix":
            msg.channel.send("`Prefix: " + prefix + '`');
            break;

        //Sends the bot status through a message
        case "status":
            const status = play.status()
            let message1 = "";
            message1 += "*Initialized*: "
            message1 += status.init ? ":white_check_mark: \n" : ":x:\n";
            message1 += "*Playing*: "
            message1 += status.paused ? ":x:" : ":white_check_mark:";
            msg.channel.send(message1);
            break;
        
        case "stop":
            play.stop();
            msg.react('🛑');
            break;
        //Print Queue
        case "q":
        case "cola":
        case "queue":
            const _queue = play.get_queue();
            const currrent_song_index = play.get_playing_index();
            if (!utils.queue_length(_queue)){
                //?Can the bot react to his own message?
                msg.channel.send("`Cola vacia`");
                msg.react(CORTE);
            }
            else {
                try{
                    msg.channel.send(
                        embeds.queue_embed(_queue,currrent_song_index));
                }
                catch(error) {
                    console.log("Exception in queue ", error);
                    break;
                }
            }
            break;

        //Show all saved queues
        case "queues":
            let names = [];
            if (custom_queues === [] || !custom_queues) {
                await msg.channel.send("No hay colas guardadas");
                break;
            }
            custom_queues.forEach(q => names.push(q.getDataValue('name')));
            if (names != [])
                msg.channel.send(embeds.queues(names));
            break;
        //Selects a random song from aliases file
        //TODO refactor this to adapt to database
        case "random":
            const keys = utils.get_keys(aliases);
            const random = Math.floor(Math.random() * keys.length);
            const song = aliases[keys[random]];
            play.enqueue(msg,song);
            break;
        
        //Resume
        case "r":
        case "resume":
            play.resume();
            msg.react(PLAY);
            break;

        //Skip to next song
        case "skip":
        case "n":
        case "next":
            try{
                const queue = play.get_queue();
                const playing_index1 = play.get_playing_index()
                msg.react('⏭️');
                if (queue[playing_index1+1]){
                    play.queue_shift();
                    msg.channel.send(embeds.now_playing_song(queue[playing_index1+1]));
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


        case "source":
        case "code":
        case "sourcecode":
            //When the project is complete
            break;
        
            //Spams a message n times
        case "spam":
            if (!args[1] || !args[2]){
                msg.channel.send("No me mandaste argumentos mogolico\n" + 
                "usage = juakoto spam <message> <times>");
                msg.react(X);
                break;
            }
            const message = args[1];
            const times = args[2];
            msg.react(CORTE);
            for (let i = 0; i < times; i++){
                msg.channel.send(message);
                await utils.sleep(1000);
            }
            break;
        
        //shuffles queue
        //!Not working
        case "shuffle":
            const queue = play.get_queue();
            const dict1 = utils.dict_shuffle(queue);
            play.set_queue(dict1);
            msg.react('🔀');
            break;

        //Saves current queue to <filename> file
        case "sq":
        case "savequeue":
        case "guardarcola":
            const queue1 = play.get_queue();
            if (!args[1]){
                msg.channel.send("No me pasaste parametros. usage juakoto sq <filename>");
                msg.react(X);
                break;
            }
            let _links = [];
            
            for (let i = 0; i < Object.keys(queue1).length; i++)
                _links.push(queue1[i].url)
            
            msg.channel.send("`Cola guardada: " + args[1] + '`');
            msg.react(DISK);
            try{
                queues.create(args[1],_links).then(async () => 
                    custom_queues = await queues.all()
                );
            }
            catch (error){
                console.log("Exception in savequeue: ", error);
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
            const volume = args[1] ? args[1] : 1;
            play.set_volume(volume)

            msg.react(SPEAKER);
            if (volume > 10)
                msg.channel.send("Nt pero el volumen maximo es 10");
                
            msg.channel.send(args[1] ? "Volumen seteado a " + volume : 
                            "No me pasaste parametros, seteando a 1");
            break;
        
        //Greets
        case "wendia":
            msg.channel.send("AAAAAAAAAH!!!!!!!!!");
            msg.react(CORTE);
            break;  

        /*
        default:
            msg.channel.send("??¿?¿?¿?¿??¿");
            break;
        */
    }
});
