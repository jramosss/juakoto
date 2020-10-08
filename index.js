const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const ms = require('ms')
var search = require('youtube-search');
const bot = new Discord.Client();
const token = 'NzQxNzk2MjQ1NzUxNzI2MTMz.Xy8xlg.CMBi93nVuyEwre-1RHsyd1bF5s0';
var PREFIX = 'juakoto ';
var servers = []
var opts = {
    maxResults: 10,
    key: 'AIzaSyCf4haCXTfyKHn82yE5fU7Z9Majn2aBhwY'
};


bot.login(token);

bot.on('ready', () => {
    console.log("Buendiaaa");
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

//Play song link
async function play (msg,link) {
    let vc = msg.member.voice.channel;
    if (!vc) 
        return msg.channel.send("No estas en un canal brrreeeo\n");
    let permissions = vc.permissionsFor(msg.client.user);

    if (!permissions.has('CONNECT') || !permissions.has('SPEAK'))
        return msg.channel.send("No me diste permisos breeeo\n");
    try {
        let connection = await vc.join();
        let dispatcher = connection.play(ytdl(link))
        //.on('finish',() =>{
        //    vc.leave()
        /*})*/.on('error',error => {
            console.log(error)
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
    })
}

//Obtiene el link de una cancion
async function get_link(song) {
    console.log("SONG: " + song);
    return new Promise((resolve, reject) => {
        search(song, opts, function(err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results[0].link);
            }
        });
    })
}

let queue = [];
let playing = false;

//Reproduce y encola canciones
async function enqueue (msg,song) {
    let current_song = "";
    let i = 0;
    queue.push(song);
    console.log("QUEUE: " + queue);
    let len = 10000;
    let info = "";
    let link = "";
    while (queue.length != 0){
        if (!playing){
            try {
                current_song = queue.pop();
                console.log("CURRENT SONG: " + current_song);
                if (!validURL(current_song)){
                    link = await get_link(current_song)
                    console.log("TRUE LINK: " + link)
                }
                else {
                    link = current_song;
                    console.log("ELSE: " + link);
                }
                info = await song_info(link);
                len = info.videoDetails.lengthSeconds;
                console.log("LEN: " + len);
                play(msg,link);
                msg.channel.send("Suena " + "`" +info.videoDetails.title + "`" +"\n" + link);
                playing = true;
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            msg.channel.send("Dale banca ahi la pongo\n");
            //window.setTimeout(playing,len*1000);
            //TODO implementar
            //VER, se rompe cuando pones un tema, tecnicamente lo encola pero
            //el otro se deja de reproducir
        }
    }
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

//Funcion principal
bot.on('message',async msg => {
    let args = msg.content.substring(PREFIX.length).split(" ");
    switch (args[0]){
        //Reproducir una cancion con input en lenguaje natural
        case "p":
            enqueue(msg,adaptar_input(args));
            break;

        //Sacar bot del canal de voz
        case "andate":
        case "leave":
            let vc = msg.member.voice.channel;
            vc.leave();
            break;
        
        //Invocar al bot en el canal de voz 
        case "veni":
        case "hola":
            let vc1 = msg.member.voice.channel;
            vc1.join();
            break;

        //Printear Cola WIP
        case "q":
            msg.channel.send(queue);
            break;

        //Saludar al estilo de joacoto
        case "wendia":
            msg.channel.send("AAAAAAAAAH!!!!!!!!!");
            break;

        //Reproduce el mejor clip del tata, ideal para momentos epicos
        case "nazi":
            enqueue(msg,"https://www.youtube.com/watch?v=MSDfzlALzQo");
            break;

        //Mutear (abandonado por frustracion)
        case "callate":
            if (!args[1]){
                msg.channel.send("Argumento Invalido");
            }
            else {
                //Mensaje para que me deje pushear
                try {
                    const target = msg.guild.member(
                        msg.mentions.users.first() || msg.guild.members.cache.find(args[1]))
                    if (!target){
                        msg.channel.voice("El usuario no esta en un canal de voz");
                    }
                    else {
                        let mainrole = msg.guild.roles.cache.find(role => role.name === "Valido")
                        let mute = msg.guild.roles.cache.find(role => role.name === "Invalido")
                        if (!mute || !mainrole){
                            msg.channel.send("El rol Invalido no existe");
                        }
                        else {
                            let time = args[2];
                            if (!time){
                                msg.channel.send("No hay un tiempo especificado, por default 5 segundos");
                                time = ms(5000,true);
                            }
                            
                            target.roles.remove(mainrole.id);
                            target.roles.add(mute.id);
                            msg.channel.send("Mal callate " 
                                + target.user.username + ", te vas muteado por " 
                                    + time + " segundos");
                            
                            setTimeout(function(){
                                target.roles.add(mainrole.id);
                                target.roles.remove(mute.id);
                                msg.channel.send("Ya cumpliste la condena " + target.user.username);
                            }, ms(time,true));
                        }
                    }
                }
                catch (exc){
                    msg.channel.send("Unhandled Exception (se pudrio el guiso)");
                    console.log(exc)
                }
            }
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
                else{
                    from = args[1];
                }
                if (!args[2]){
                    msg.channel.send("No especificaste desde donde,terrible mogolico,defaulteando a 34\n")
                    to = 34;
                }
                else{
                    to = args[2];
                }
                for (var j = from; j < to; j++){
                    enqueue(msg,"previa y cachengue " + j);
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
    }
})
