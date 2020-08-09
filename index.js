const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'NzQxNzk2MjQ1NzUxNzI2MTMz.Xy8xlg.CMBi93nVuyEwre-1RHsyd1bF5s0';
const PREFIX = '//';
const ytdl = require('ytdl-core');
var servers = []
const ms = require('ms')

bot.login(token);

bot.on('ready', () => {
    console.log("Que queres la remil concha de tu puta madre");
})

//msg.reply("message") para responder a un usuario especifico

bot.on('message',msg => {
    let args = msg.content.substring(PREFIX.length).split(" ");
    switch (args[0]){
        /*
        case "p":

            function play (connection,msg){
                var server = servers[msg.guild.id];
                server.dispatcher = connection.playStream(
                        ytdl(server.queue[0],{filter: "audioonly"}));
                server.queue.shift();
                server.dispatcher.on("end",function(){
                    if(server.queue[0]){
                        play(connection,msg);
                    }
                    else {
                        connection.disconnect();
                    }
                });
            }

            if (!args[1]) {
                msg.channel.send("Argumento Invalido");
                return;
            }
            if (!msg.member.guild.voice.connection.voice){
                msg.channel.send("Tenes que estar en un canal para ejecutar comandos");
            }

            var server = servers[msg.guild.id]

            if (msg.guild.voice){
                msg.member.voice.channel.join();
            }
            break;
            */
        case "wendia":
            msg.channel.send("Wendiaaaa");
            break;
        case "nazi":
            msg.channel.send("WIP");
            break;
        case "callate":
            if (!args[1]){
                msg.channel.send("Argumento Invalido");
            }
            else {
                msg.channel.send("HOLA");
                const target = msg.guild.member(
                    msg.mentions.users.first() || msg.guild.members.cache.find(args[1]))
                if (!target){
                    msg.member.voice("El usuario no esta en un canal de voz");
                }
                else {
                    let mainrole = msg.guild.roles.cache.find(role => role.name === "Newb")
                    let mute = msg.guild.roles.cache.find(role => role.name === "Muted")
                    if (!mute || !mainrole){
                        msg.member.send("El rol mute no existe");
                    }
                    else {
                        let time = args[2];
                        if (!time){
                            msg.member.send("No hay un tiempo especificado, por default 5 segundos");
                            time = ms(50000,true);
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
                break;
                
            }
            
    }
})