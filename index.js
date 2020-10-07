const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'NzQxNzk2MjQ1NzUxNzI2MTMz.Xy8xlg.CMBi93nVuyEwre-1RHsyd1bF5s0';
var PREFIX = 'juakoto ';
const ytdl = require('ytdl-core');
var servers = []
const ms = require('ms')

bot.login(token);

bot.on('ready', () => {
    console.log("Buendiaaa");
})

//msg.reply("message") para responder a un usuario especifico

bot.on('message',async msg => {
    let args = msg.content.substring(PREFIX.length).split(" ");
    //msg.channel.send("Holabuenass\n");
    switch (args[0]){
        case "p":
            const vc = msg.member.voice.channel;
            if (!vc) 
                return msg.channel.send("No estas en un canal brrreeeo\n");
            const permissions = vc.permissionsFor(msg.client.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK'))
                return msg.channel.send("No me diste permisos breeeo\n");
            try {
                let connection = await vc.join();
                const dispatcher = connection.play(ytdl(args[1]))
                .on('finish',() =>{
                    vc.leave()
                }).on('error',error => {
                    console.log(error)
                })
                dispatcher.setVolumeLogarithmic(5 / 5)
            }
            catch (error){
                console.log("There was an error joining the voice channel\n");
                return msg.channel.send("Paso algo raro brreeeoo\n");
            }
            break;
        case "l":
            if(!msg.member.voice.channel)
                return msg.channel.send("No estas en un canal brreeeeo\n");
            msg.member.voice.channel.leave();
        case "wendia":
            msg.channel.send("AAAAAAAAAH!!!!!!!!!");
            break;

        case "nazi":
            args[1] = "https://www.youtube.com/watch?v=MSDfzlALzQo";
            msg.channel.send(PREFIX + "p " + args[1]);
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
                /*
                let members = msg.channel.members;
                let number = Math.random(0,members);
                members.forEach(x => {
                    
                });*/
                break;
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
                for (var i = from; i < to; i++){
                    msg.channel.send(PREFIX + "previa y cachengue " + i);
                }
            
    }
})