const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const ms = require('ms')
var search = require('youtube-search');
const bot = new Discord.Client();
const token = 'NzY0NjUzODAwMDY4NzQzMTk5.X4JZWA.WLFREy6em53RtqdYJUV-L7MyAAQ';
var PREFIX = 'juakoto ';
var servers = []
var opts = {
    maxResults: 10,
    key: 'AIzaSyCf4haCXTfyKHn82yE5fU7Z9Majn2aBhwY'
};
let dispatcher;

bot.login(token);

bot.on('ready', () => {
    console.log("Buendiaaa");
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms)).catch("EXCEPCION EN SLEEP\n");
}

//Check if a string is an url
function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

//Toma un mensaje y lo adapta para que lo pueda leer get_link()
function adaptar_input(arr) {
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
async function play (msg,song) {
    let vc = msg.member.voice.channel;
    if (!vc) 
        return msg.channel.send("No estas en un canal brrreeeo\n");
    let permissions = vc.permissionsFor(msg.client.user);

    if (!permissions.has('CONNECT') || !permissions.has('SPEAK'))
        return msg.channel.send("No me diste permisos breeeo\n");
    try {
        let connection = await vc.join();
        let current_song_link = queue[0]
        console.log("CURRENT_SONG_link: " + current_song_link);
        let info = await song_info(current_song_link);
        let title = info.videoDetails.title;
        console.log("TITLE; " + title);
        msg.channel.send("Suena " + "`" + title + "`" + "\n" + current_song_link);
        dispatcher = connection.play(ytdl(current_song_link))
        dispatcher.on('finish',() => {
            let next = queue.shift();
            if (next){
                console.log("AHORA REPRODUCIMOS: " + next);
                play(msg,next);
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
    }).catch(console.log("EXCEPCION EN SONG_INFO\n"));
}

//Obtiene el link de una cancion
async function get_link(song) {
    return new Promise((resolve, reject) => {
        search(song, opts, function(err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results[0].link);
            }
        });
    }).catch(console.log("EXCEPCION EN GET_LINK\n"));
} 

async function enqueue (msg,args) {
    let link1;
    console.log("ARGS: " + args);
    if (args[0] == 'p')
        args[0] = "";
    console.log("ARGS: " + args);
    if (!validURL(args)){
        let url = args[1]
        if (!validURL(url)){
            console.log("No es URL\n");
            link1 = await get_link(adaptar_input(args))
            .catch(msg.channel.send("Los servers estan caidos\n"));
        }
        else {
            console.log("URL: " + url);
            link1 = url;
        }
    }
    else {
        link1 = args;
        console.log("URL: " + link1);
    }
    queue.push(link1);
    console.log("PUSHEANDO: " + link1);
    console.log("QUEUE_LEN: " + queue.length);
    if (queue.length == 1)
        play(msg,queue[0]);
    else {
        let titl = await song_info(link1);
        msg.channel.send("Cancion añadida a la cola " + titl.videoDetails.title);
    }
}

//Funcion principal
bot.on('message',async msg => {
    let args = msg.content.substring(PREFIX.length).split(" ");
    switch (args[0]){

        case "h":
        case "help":
            msg.channel.send("*PREFIX* = juakoto con esto le decis a juakoto que comando ejecutar\n" +
            "*play* <song> / *p* <song> : Reproduce una cancion (No funciona con listas por que no me pagan lo suficiente)\n" +
            "*andate* / *leave* = Hace que juakoto se vaya del canal\n" +
            "*pause* = Pausa la cancion que se esta reproduciendo actualmente\n" +
            "*stop* / *s* = Lo mismo que pause pero la quise caretear\n" +
            "*skip* / *n* / *next* = Pasa a la siguiente cancion de la cola\n" +
            "*resume* / *r* = Despausar\n" +
            "*hola* / *veni* = Invoca al dios juakoto en el canal de voz\n" +
            "*volumeset* <volume> / *vs* <volume> = Setea el volumen del bot a <volume>\n" +
            "*satura* / *earrape* = Hace volumeset en 10, ideal para trolear y tiltear a joacoto, provocando que todos los usuarios del server tengan al bot insta muteado\n" +
            "*q* / *queue* = Muestra la cola actual de canciones\n" +
            "*clear* / *c* = Vacia la cola de canciones\n" +
            "*wendia* = Un saludito que nunca viene mal\n" +
            "*nazi* = Pone en la cola el clip del momo\n" +
            "*prefix* <prefix> = Setea un nuevo prefix para el bot\n" +
            "*showprefix* = Muestra el prefix actual del bot\n" +
            "*mogolicodeldia* = No funciona, pero la idea es que muestre un mogolico del server\n" +
            "*previaycachengue* / *pyc* <from> <to> = Encola todos los previa y cachengue del ferpa desde <from> hasta <to>\n" +
            "*spam* <mensaje> <numero> = spamea <mensaje> <numero> veces\n" +
            "*ANAKIN* / *anakin* = Juju on that beat\n" +
            "*cancha* = Escuchen, corran la bola\n" +
            "*qnp* / *quenoplante* = QUENOPLANTE QUENOPLANTE\n")
            break;

        //Reproducir una cancion con input en lenguaje natural
        case "play":
        case "p":
            enqueue(msg,args)
            break;

        //Sacar bot del canal de voz
        case "andate":
        case "leave":
            msg.member.voice.channel.leave();
            queue = [];
            break;
        case "s":
        case "stop":
            dispatcher.pause();
            break;
        case "pause":
            dispatcher.pause();
            break;
        case "skip":
        case "n":
        case "next":
            let song = queue.shift();
            play(msg,song);
            //dispatcher.stop();
            break;
        case "r":
        case "resume":
            dispatcher.resume();
            break;
        //Invocar al bot en el canal de voz 
        case "veni":
        case "hola":
            msg.member.voice.channel.join();
            break;

        //Definir el volument del bot
        case "vs":
        case "volumeset":
            if (args[1]){
                dispatcher.setVolume(args[1]);
                msg.channel.send("Volumen seteado a " + args[1]);
            }
            else 
                msg.channel.send("No me pasaste parametros, juakoto vs/volumeset <volume>\n");
            break;

        //jewjejejje
        case "satura":
        case "earrape":
            dispatcher.setVolume(10);
            msg.channel.send("Espero que nadie este por hacer un clutch\n");
            break;

        //Printear Cola
        case "q":
        case "queue":
            if (queue.length == 0)
                msg.channel.send("Cola vacia\n");
            else 
                msg.channel.send(queue);
            break;
        
        //Limpia la cola de canciones
        case "c":
        case "clear":
            queue = [];
            break;
        //Saludar al estilo de joacoto
        case "wendia":
            msg.channel.send("AAAAAAAAAH!!!!!!!!!");
            break;

        //Reproduce el mejor clip del tata, ideal para momentos epicos
        case "nazi":
            enqueue(msg,"https://www.youtube.com/watch?v=MSDfzlALzQo");
            break;  

        //Modificar Prefix
        //TODO crear base de datos para que se guarde el prefix
        case "prefix":
            if (!args[1]){
                msg.channel.send("Parametro invalido/inexistente");
            }
            PREFIX = args[1];
            msg.channel.send("Prefix cambiado a " + PREFIX);
            break;
        case "showprefix":
            msg.channel.send(PREFIX);
        case "mogolicodeldia":
            let vc2 = msg.member.voice.channel;
            let arr = vc2.members.array;
            for (let user in vc2.members.array){
                console.log(user);
            }
            break;

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
                msg.channel.send("No especificaste desde donde,terrible mogolico,defaulteando a 34\n")
                to = 34;
            }
            else
                to = args[2];

            let arr1 = [];
            for (var j = from; j < to; j++){
                arr1.push("previa y cachengue " + j);
                enqueue(msg,arr1);
                arr1 = [];
            }
            break;

        //Spamear s mensaje n veces
        case "spam":
            let message = args[1]
            let times = args[2];
            if (!args[1] || !args[2])
                msg.channel.send("No me mandaste argumentos mogolico\n");
            for (let i = 0; i < times; i++){
                msg.channel.send(message);
                await sleep(1000);
            }
            break;
        
        //Juju on that beat
        case "anakin":
        case "ANAKIN":
            msg.channel.send("??????????\n");
            await sleep(1000);
            msg.channel.send("Wait...\n");
            await sleep(1000);
            enqueue(msg,"https://www.youtube.com/watch?v=bh6uhboa2v4");
            sleep(3000);
            msg.channel.send("AAAAAAAAAAAAAAAAAAAAAAAAAAA\n");
            break;

        //Reproduce una cancion de cancha
        case "cancha":
            enqueue(msg, "https://www.youtube.com/watch?v=mBmcuw4CRpQ");
            break;
        
        //QUENOPLANTE QUE NOPLANTE CARAJO
        case "qnp":
        case "quenoplante":
            enqueue(msg,"https://www.youtube.com/watch?v=Qt3ubcGoeoE");
            break;
        
        case "skip":
        case "next":
        case "n":
            queue.shift();
            try {
                let next_song = queue.shift();
                if (next_song)
                    play(msg,next_song);
            }
            catch(e){
                msg.channel.send("Excepcion\n");
                console.log(e.trace);
            }
    }
})