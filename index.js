const Discord = require('discord.js');
const fisy = require('fs');
const search = require('youtube-search');
const ytdl = require('ytdl-core');
const token = require('./token')
//const prefix_file = require('./prefix')
const prefix_file = require('./prefix')
let prefix;

const bot = new Discord.Client();
//var Spotify = require('spotify-web-api-js');
const opts = {
    maxResults: 10,
    key: 'AIzaSyCf4haCXTfyKHn82yE5fU7Z9Majn2aBhwY'
};

const ULTIMO_PREVIA_Y_CACHENGUE = 35;

let dispatcher;

/* var spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken('<here_your_access_token>'); */

bot.login(token.token());

bot.on('ready', () => {
    console.log("Buendiaaa");
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
    .catch("EXCEPCION EN SLEEP\n");
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

//Takes a message and adapt the string to make it readable by get_link
function adapt_input(arr) {
    let str1 = "";
    let i = 0;
    while (arr[i] != null){
        if(arr[i] == "p"){
            i++;
            continue;
        }
        str1 += arr[i];
        str1 += " ";
        i++;
    }
    return str1;
}

let queue = [];

//Play song link
async function play (msg) {
    let vc = msg.member.voice.channel;
    if (!vc) 
        return msg.channel.send("No estas en un canal brrreeeo\n");
    let permissions = vc.permissionsFor(msg.client.user);

    if (!permissions.has('CONNECT') || !permissions.has('SPEAK'))
        return msg.channel.send("No me diste permisos breeeo\n");
    try {
        let connection = await vc.join();
        let current_song_link = queue[0];
        console.log("CURRENT_SONG_link: " + current_song_link);
        let info = await song_info(current_song_link);
        let title = info.videoDetails.title;

        console.log("TITLE; " + title);
        msg.channel.send("Suena " + "`" + title + "`" + "\n" 
                                        + current_song_link);
        dispatcher = connection.play(ytdl(current_song_link))

        dispatcher.on('finish',() => {
            queue.shift();
            let next = queue.shift();
            if (next){
                console.log("AHORA REPRODUCIMOS: " + next);
                play(msg);
            }
        })

        dispatcher.setVolumeLogarithmic(5 / 5)
    }
    catch (error){
        console.log("There was an error joining the voice channel\n");
        console.log(error);
        return msg.channel.send("Paso algo raro brreeeoo\n");
    }
}

//Da info sobre el video de la cancion
async function song_info (song) {
    return new Promise((resolve,reject) => {
        ytdl.getInfo(song).then(resolve,reject);
    });
}

//Obtiene el link de una cancion
async function get_link(song) {
    return new Promise((resolve, reject) => {
        search(song, opts, function(err, results) {
            err ? reject(err) : resolve(results[0].link)
        });
    });
} 

async function enqueue (msg,args) {
    let link1;
    if (args[0] == 'p')
        args[0] = "";
    if (!valid_URL(args)){
        let url = args[1]
        link1 = valid_URL(url) ? url : await get_link(adapt_input(args));
    }
    else 
        link1 = args;

    queue.push(link1);
    console.log("PUSHEANDO: " + link1);
    if (queue.length == 1)
        play(msg);
    else {
        let titl = await song_info(link1);
        msg.channel.send("Cancion añadida a la cola `" 
                         + titl.videoDetails.title + "`");
    }
}

//Funcion principal
bot.on('message',async msg => {
    prefix = prefix_file.prefix()
    let args = msg.content.substring(prefix.length+1).split(" ");
    console.log(args);
    switch (args[0]){

        //Sacar bot del canal de voz
        case "andate":
        case "leave":
        case "tomatela":
        case "shu":
            msg.member.voice.channel.leave();
            queue = [];
            break;
        
        //Reproduce una cancion de cancha
        case "cancha":
            enqueue(msg, "https://www.youtube.com/watch?v=mBmcuw4CRpQ");
            break;
        
        //Limpia la cola de canciones
        case "c":
        case "clear":
            queue = [];
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
            if (args[0] == "te" && args[1] == "invoco")
                msg.member.voice.channel.join();
            else if (args[0] == "te")
                break;
            else 
                msg.member.voice.channel.join();
            break;
        
        case "juernes":
        case "JUERNES":
        case "JUERNES PERRO":
        case "juernes perro":
            queue = [];
            queue.push("https://www.youtube.com/watch?v=QkngZ1P3aKw");
            await play(msg);
            dispatcher.setVolume(10);
            msg.channel.send("JUERNES PERRITO");
            break;

        //Reproduce el mejor clip del tata, ideal para momentos epicos
        case "nazi":
            enqueue(msg,"https://www.youtube.com/watch?v=MSDfzlALzQo");
            break;  
        
        case "n":
        case "next":
        case "skip":
        case "porfavor":
            if (args[0] == "porfavor"){
                if (!(args[1] == "saca" && args[2] == "esta" &&
                    args[3] == "cancion" && args[4] == "asquerosa"))
                        break;
            }
            queue.shift();
            try {
                let next_song = queue[0];
                if (next_song)
                    play(msg);
                else
                    dispatcher.pause();
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
            dispatcher.setVolume(0);
            msg.channel.send("Seteando el volumen a 0");
            break;
            
        case "pause":
            dispatcher.pause();
            break;

        //Reproducir una cancion con input en lenguaje natural
        case "p":
        case "play":
            if (!args)
                msg.channel.send("Que queres que meta en la cola? Pasame algo,"+
                                 "por que me encanta meterme cosas en la cola\n",
                                 "usage = juakoto play/p <song name/song youtube link>")
            enqueue(msg,args)
            break;
        
        case "playINSTA":
        case "playinsta":
        case "PLAYINSTA":
        case "playI":
        case "playi":
            queue = [];
            valid_URL(args) ? queue.push(args[1]) : queue.push(adapt_input(args))
            play(msg);
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
                msg.channel.send("No especificaste desde donde,terrible mogolico,defaulteando a 0\n")
                from = 1;
            }
            else
                from = args[1];

            if (!args[2]){
                msg.channel.send("No especificaste hasta donde,terrible mogolico,defaulteando a 34\n")
                to = ULTIMO_PREVIA_Y_CACHENGUE;
            }
            if (!args[1] || !args[2])
                msg.channel.send("usage = juakoto pyc <from> <to>");
            else
                to = args[2];

            let arr1 = [];
            for (var j = from; j < to; j++){
                arr1.push("previa y cachengue " + j);
                enqueue(msg,arr1);
                arr1 = [];
            }
            break;

        //Modificar prefix
        //TODO crear base de datos para que se guarde el prefix
        case "prefix":
            if (!args[1])
                msg.channel.send("Parametro invalido/inexistente \n" + 
                                 "usage juakoto prefix <prefix>");

            prefix = args[1];
            prefix_file.change_prefix(prefix);
            msg.channel.send("prefix cambiado a " + prefix);
            break;
        
        case "showprefix":
            msg.channel.send(prefix);
            break;
        

        case "troleo":
        case "bailedeltroleo":
            arr = "https://www.youtube.com/watch?v=qe5-ywmuKOg";
            await enqueue(msg,arr);
            sleep(4000); //Por que tiene que esperar un poco mas y no quiero pensar una forma mas elegante de hacerlo
            dispatcher.setVolume(10);
            break;
        //Printear Cola
        case "q":
        case "cola":
        case "queue":
            if (queue.length == 0)
                msg.channel.send("Cola vacia\n");
            else {
                msg.channel.send("Cola: \n");
                let v_song_info;
                let v_song_title;
                let v_song_link;
                let v_song_len;
                let message = "";
                let aux = queue;
                let s = aux.shift();
                while(s) {
                    try{
                        if (s){
                            v_song_info = await song_info(s);
                            v_song_title = v_song_info.videoDetails.title;
                            v_song_link = v_song_info.videoDetails.video_url;
                            message += v_song_title + " " + v_song_link + "\n";
                            s = aux.shift();
                        }
                        else
                            break;
                    }
                    catch(error) {
                        console.log(error);
                        break;
                    }
                }
                msg.channel.send("```" + message + "```")
                .catch(console.log("No podes mandar mensajes vacios"));
            }
            break;

        case "r":
        case "resume":
            dispatcher.resume();
            break;

        case "skip":
        case "n":
        case "next":
            queue.shift();
            let elem = queue.shift();
            elem ? play(msg) : dispatcher.pause()
            break;

        //jewjejejje
        case "satura":
        case "earrape":
            dispatcher.setVolume(10);
            msg.channel.send("Espero que nadie este por hacer un clutch\n");
            break;

        //Spamear s mensaje n veces
        case "spam":
            let message = args[1]
            let times = args[2];
            if (!args[1] || !args[2])
                msg.channel.send("No me mandaste argumentos mogolico\n" + 
                                 "usage = juakoto spam <message> <times>");
            for (let i = 0; i < times; i++){
                msg.channel.send(message);
                await sleep(1000);
            }
            break;
        
        //Definir el volument del bot
        case "vs":
        case "volumeset":
            let volume = 1;
            if (args[1]){
                volume = args[1];
                msg.channel.send("Volumen seteado a " + args[1]);
            }
            else
                msg.channel.send("No me pasaste parametros, seteando a 1\n" +
                                "usage = juakoto vs/volumeset <volume>\n");
        
            dispatcher.setVolume(volume);
        
            break;
        
        //QUENOPLANTE QUE NOPLANTE CARAJO
        case "qnp":
        case "quenoplante":
            enqueue(msg,"https://www.youtube.com/watch?v=Qt3ubcGoeoE");
            break;
        
        //Saludar al estilo de joacoto
        case "wendia":
            msg.channel.send("AAAAAAAAAH!!!!!!!!!");
            break;  
    }
})