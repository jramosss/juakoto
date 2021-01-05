const Discord = require('discord.js');
const CREDENTIALS = require('./credentials')
const prefix_file = require('./prefix')
const utils = require('./utils')
const play = require('./play')
const TOKEN = CREDENTIALS.token;

const bot = new Discord.Client();

const ULTIMO_PREVIA_Y_CACHENGUE = 35;

let prefix = prefix_file.load_prefix();

//TODO
/*
const Spotify = require('spotify-web-api-js');
var spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken('<here_your_access_TOKEN>'); */

bot.login(TOKEN);

bot.on('ready', () => {
    console.log("Buendiaaa");
})

//Funcion principal
bot.on('message',async msg => {
    let args = msg.content.substring(prefix.length+1).split(" ");
    switch (args[0]){

        //Sacar bot del canal de voz
        case "andate":
        case "leave":
        case "tomatela":
        case "shu":
            msg.member.voice.channel.leave();
            play.clear_queue();
            break;
        
        //Reproduce una cancion de cancha
        case "cancha":
            play.enqueue(msg,"https://www.youtube.com/watch?v=mBmcuw4CRpQ");
            break;
        
        //Limpia la cola de canciones
        case "c":
        case "clear":
            play.clear_queue();
            msg.channel.send("Cola vaciada\n");
            //TODO, hacer que esto pause la ejecucion
            break;
        
        case "gracias":
            msg.channel.send("De nada " + msg.member.user.username);
            break;

        case "h":
        case "help":
            msg.channel.send(
            "*andate* / *leave* / *shu* = Hace que juakoto se vaya del canal\n" +
            "*cancha* = Escuchen, corran la bola\n" +
            "*clear* / *c* = Vacia la cola de canciones\n" +
            "*hola* / *veni* / *te invoco* = Invoca al dios juakoto en el canal de voz\n" +
            "*juernes* / *JUERNES PERRO* / *juernes perro* : JUERNES PERRO\n" +
            "*nazi* = Pone en la cola el clip del momo\n" +
            "*mogolicodeldia* = No funciona, pero la idea es que muestre un mogolico del server\n" +
            "mood <mood> : Te tira una playlist acorde al mood que le des (chill/cachengue/trap/sad)" +
            "*prefix* <prefix> = Setea un nuevo prefix para el bot\n" +
            "*pause* = Pausa la cancion que se esta reproduciendo actualmente\n" +
            "*previaycachengue* / *pyc* <from> <to> = Encola todos los previa y cachengue del ferpa desde <from> hasta <to>\n" +
            "*play* <song> / *p* <song> : Reproduce una cancion (No funciona con listas por que no me pagan lo suficiente)\n" +
            "*playI* / *playINSTA* : Reproduce la cancion instantaneamente\n" +
            "*q* / *queue* = Muestra la cola actual de canciones\n" +
            "*resume* / *r* = Despausar\n" +
            "*satura* / *earrape* = Hace volumeset en 10, ideal para trolear y tiltear a joacoto, provocando que todos los usuarios del server tengan al bot insta muteado\n" +
            "*skip* / *n* / *next* = Pasa a la siguiente cancion de la cola\n" +
            "*showprefix* = Muestra el prefix actual del bot\n" +
            "*spam* <mensaje> <numero> = spamea <mensaje> <numero> veces\n" +
            "*stop* / *s* = Lo mismo que pause pero la quise caretear\n" +
            "*volumeset* <volume> / *vs* <volume> = Setea el volumen del bot a <volume>\n" +
            "*qnp* / *quenoplante* = QUENOPLANTE QUENOPLANTE\n" +
            "*wendia* = Un saludito que nunca viene mal\n")
            break;

        //Invocar al bot en el canal de voz 
        case "hola":
        case "veni":
        case "te":
            if (args[0] === "te" && args[1] === "invoco")
                msg.member.voice.channel.join();
            else if (args[0] === "te")
                break;
            else 
                msg.member.voice.channel.join().catch(console.log("Exception in hola\n"));
            break;
        
        case "juernes":
        case "JUERNES":
        case "JUERNES PERRO":
        case "juernes perro":
            play.clear_queue();
            play.enqueue(msg,"https://www.youtube.com/watch?v=QkngZ1P3aKw");
            await play.play_song(msg);
            play.set_volume(10);
            msg.channel.send("JUERNES PERRITO");
            break;

        
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

        //Reproduce el mejor clip del tata, ideal para momentos epicos
        case "nazi":
            await play.enqueue(msg,"https://www.youtube.com/watch?v=MSDfzlALzQo");
            break;  
        
        case "n":
        case "next":
        case "skip":
        case "porfavor":
            if (args[0] === "porfavor"){
                if (!(args[1] === "saca" && args[2] === "esta" &&
                    args[3] === "cancion" && args[4] === "asquerosa"))
                        break;
            }
            play.queue_shift();
            try {
                let playing_index = play.get_playing_index()
                try {
                    let next_song = play.get_queue()[playing_index+1];
                    next_song ? play.play_song(msg) : play.pause()
                }
                catch(err){
                    console.log(err);
                }
            }
            catch(e){
                msg.channel.send("Excepcion\n");
                console.log(e.trace);
            }
            break;
        
        case "mood":
            if (!args[1]){
                msg.channel.send("Mood que? usage = juakoto mood <mood>");
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


        case "mute":
            play.set_volume(0);
            msg.channel.send("Seteando el volumen a 0");
            break;
            
        case "pause":
            play.pause();
            break;

        //Reproducir una cancion con input en lenguaje natural
        case "p":
        case "play":
            if (!args)
                msg.channel.send("Que queres que meta en la cola? Pasame algo,"+
                                 "por que me encanta meterme cosas en la cola\n",
                                 "usage = juakoto play/p <song name/song youtube link>")
            await play.enqueue(msg,args).catch(console.log("Excepcion en enqueue msg,(index.js)\n"));
            let queue = play.get_queue();
            if (utils.queue_length(queue) === 1){
                try{
                    play.play_song(msg);
                }
                catch(e){
                    if (e instanceof play.NotAllowed)
                        msg.channel.send("No me diste permisos bro\n");
                    else if (e instanceof play.NotInAChannel)
                        msg.channel.send("No estas en un canal bro\n");
                    else{
                        console.log("Error en play (index.js)" + error);
                        msg.channel.send("Problemitas tecnicos\n");
                    }
                }
            }
            break;
        
        case "playINSTA":
        case "playinsta":
        case "PLAYINSTA":
        case "playI":
        case "playi":
            play.clear_queue();
            play.enqueue(args);
            play.play_song(msg);
            break;
        
        case "paraguayo":
        case "paradoja":
            msg.channel.send("Perdon por trollear :(");
            throw ArithmeticException;

        //Encola las sesiones de previa y cachengue desde n hasta m especificados
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

        //Modificar prefix
        //TODO crear base de datos para que se guarde el prefix
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
        
        case "showprefix":
            msg.channel.send(prefix);
            break;

        case "status":
            let status = play.status()
            let message1 = "";
            message1 += status.init ? "Initialized\n" : "Uninitialized\n";
            message1 += status.paused ? "Paused" : "Playing";
            msg.channel.send("```" + message1 + "```");
            break;
        

        case "troleo":
        case "bailedeltroleo":
            arr = "https://www.youtube.com/watch?v=qe5-ywmuKOg";
            await play.enqueue(msg,arr);
            utils.sleep(4000); 
            //Por que tiene que esperar un poco mas y no quiero pensar una forma mas elegante de hacerlo
            play.set_volume(10);
            break;
        //Print Queue
        case "q":
        case "cola":
        case "queue":
            let _queue = play.get_queue()
            if (utils.queue_length(_queue) === 0)
                msg.channel.send("Cola vacia\n");
            else {
                let v_song_info;
                let v_song_title;
                //let v_song_link;
                let v_song_len;
                let message = "";
                let aux = play.get_queue();
                let i = 0;
                while(aux[i]) {
                    try{
                        v_song_info = await play.song_info(aux[i]);
                        v_song_len = v_song_info.videoDetails.lengthSeconds / 60;
                        v_song_title = v_song_info.videoDetails.title;
                        //v_song_link = v_song_info.videoDetails.video_url;
                        message += i + " " + v_song_title + "       " + v_song_len + "\n";

                        i++;
                    }
                    catch(error) {
                        console.log("QUEUE " + error);
                        break;
                    }
                }
                if (message !== "")
                    msg.channel.send("```" + "Cola: \n" + message + "```")
                    .catch(console.log("Empty Message"));
                else 
                    msg.channel.send("Cola vacia");
            }
            break;

        case "r":
        case "resume":
            play.resume();
            break;

        case "skip":
        case "n":
        case "next":
            try{
                let queue = play.get_queue();
                let playing_index1 = play.get_playing_index()
                if (queue[playing_index1+1]){
                    play.queue_shift();
                    play.play_song(msg);
                }
                else 
                    play.pause()
            }
            catch (e) {
                console.log("Excepcion en skip " + e);
            }
            break;

        //jewjejejje
        case "satura":
        case "earrape":
            play.set_volume(10);
            msg.channel.send("Espero que nadie este por hacer un clutch\n");
            break;

        //Spamear s mensaje n veces
        case "spam":
            let message = args[1]
            let times = args[2];
            if (!args[1] || !args[2]){
                msg.channel.send("No me mandaste argumentos mogolico\n" + 
                                 "usage = juakoto spam <message> <times>");
                break;
            }
            for (let i = 0; i < times; i++){
                msg.channel.send(message);
                await utils.sleep(1000);
            }
            break;
        
        //Definir el volument del bot
        case "vs":
        case "volumeset":
            let volume = args[1] ? args[1] : 1;
            play.set_volume(volume)

            msg.channel.send(args[1] ? "Volumen seteado a " + volume : 
                            "No me pasaste parametros, seteando a 1");
            
            break;
        
        //QUENOPLANTE QUE NOPLANTE CARAJO
        case "qnp":
        case "quenoplante":
            play.enqueue(msg,"https://www.youtube.com/watch?v=Qt3ubcGoeoE");
            break;
        
        //Saludar al estilo de joacoto
        case "wendia":
            msg.channel.send("AAAAAAAAAH!!!!!!!!!");
            break;  
    }
})