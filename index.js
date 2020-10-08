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

//Play link
async function play (msg,link) {
    let vc = msg.member.voice.channel;
    if (!vc) 
        return msg.channel.send("No estas en un canal brrreeeo\n");
    let permissions = vc.permissionsFor(msg.client.user);

    if (!permissions.has('CONNECT') || !permissions.has('SPEAK'))
        return msg.channel.send("No me diste permisos breeeo\n");
    try {
        let connection = await vc.join();
        console.log("El verdadero link que llega: " + link);
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

async function song_length (song) {
    return new Promise((resolve,reject) => {
        ytdl.getInfo(song).then(resolve,reject);
    })
}

async function get_link(song) {
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

async function enqueue (msg,song) {
    let current_song;
    let i = 0;
    let str1 = "";
    let queue = [];
    if (!song.startsWith("https://www.youtube.com/")){
        while (song[i] != null){
            if(song[i] == "p"){
                i++;
                continue;
            }
            str1 += song[i];
            str1 += " ";
            i++;
        }
    }
    else 
        str1 = song;
    queue.push(str1);
    console.log("QUEUE: " + queue);
    let playing = false;
    let len = 10000;
    let link = "";
    while (queue.length != 0){
        if (!playing){
            try {
                current_song = queue.pop();
                console.log("CURRENT SONG: " + current_song);
                if (!song.startsWith("https://www.youtube.com/"))
                    link = await get_link(msg,current_song)
                else 
                    link = current_song;
                console.log("LINK: " + link);
                len = await song_length(link);
                console.log("LEN: " + len.videoDetails.lengthSeconds);
                play(msg,link);
                msg.channel.send("Suena " + len.videoDetails.title);
                playing = true;
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            window.setTimeout(playing,len*1000);
        }
    }
}
//Search and play

//msg.reply("message") para responder a un usuario especifico

bot.on('message',async msg => {
    let args = msg.content.substring(PREFIX.length).split(" ");
    switch (args[0]){
        case "p":
    
            break;
        case "andate":
        case "leave":
            let vc = msg.member.voice.channel;
            vc.leave();
            break;
        case "veni":
        case "hola":
            let vc1 = msg.member.voice.channel;
            vc1.join();
        case "q":
            msg.channel.send(queue);
            break;
        case "pl":
            play(msg,args[1]);
            break;
        case "l":
            if(!msg.member.voice.channel)
                return msg.channel.send("No estas en un canal brreeeeo\n");
            msg.member.voice.channel.leave();
        case "wendia":
            msg.channel.send("AAAAAAAAAH!!!!!!!!!");
            break;

        case "nazi":
            enqueue(msg,"https://www.youtube.com/watch?v=MSDfzlALzQo");
            break;

        case "callate":
            if (!args[1]){
                msg.channel.send("Argumento Invalido");
            }
            else {
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
                break;
                
            }
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
            case "cancha":
                enqueue(msg, "https://www.youtube.com/watch?v=mBmcuw4CRpQ");
                break;
            case "qnp":
            case "quenoplante":
                enqueue(msg,"https://www.youtube.com/watch?v=Qt3ubcGoeoE");
                break;

    }
})
