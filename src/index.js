//? How can i make this file shorter?

//Server stuff
const PORT = process.env.PORT || 5000;

//require('dotenv').config({path:'../.env'});

//External libraries
const Discord   = require('discord.js');
const bot = new Discord.Client();

const Alias = require('../classes/Alias');
const Commands = require('../resources/commands');
const Prefix = require('../classes/Prefix');
const Queues = require('../classes/Queues');
const Utils = require('../classes/Utils')

const alias = new Alias();
const commands = new Commands();
const _prefix = new Prefix();
const queues = new Queues();
const utils = new Utils();

//Global vars
let prefix = _prefix.load_prefix();
let aliases;
let custom_queues;
//let loop = false;

//Global Consts
const CHULS_DISCRIMINATOR = '5131';


//const Spotify = require('./Spotify');
//const sp = new Spotify();

//Emojis
const CORTE =       '776276782125940756';
const SPEAKER =     '🔈';


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

bot.on('disconnect',() => commands.clear_queue())

//Core Function
bot.on('message',async msg => {
    if (msg.author.bot) return;
    let args = msg.content.substring(prefix.length+1).split(" ");
    const raw_input = msg.content.substring(prefix.length+1).replace(args[0],"");
    if (!msg.content.startsWith(prefix)) return;
    console.log("Message: ",args, " Sent by ",msg.author.username); 

    //Handle aliases
    const aliass = await alias.find(args[0]);
    if (aliass) commands.play(msg,aliass);

    switch (args[0]){
        
        //Register a new alias for a song
        case "alias":
            aliases = await commands.register_alias(msg,args);
            break;

        //display all aliases
        case "aliases":
            commands.show_aliases(msg,aliases);
            break;

        //Make bot leave
        case "andate":
        case "leave":
        case "tomatela":
        case "shu":
        case "chau":
            commands.leave(msg);
            break;
        
        //Clears queue
        case "c":
        case "clear":
            commands.clear_queue(msg);
            break;

        //Deletes queue from database
        case "dq":
        case "deletequeue":
            commands.delete_queue(msg,args);
            break;
        
        //greets
        case "gracias":
            msg.channel.send("De nada " + msg.member.user.username);
            msg.react('🥰');
            break;

        //Get song link by input (natural language)
        case "getlink":
        case "find":
            commands.find(msg,args,raw_input);
            break;

        //Prints all bot utilities
        //TODO make this prettier
        case "h":
        case "help":
            commands.display_help(msg);
            break;

        //Invoke bot into actual voice channel
        case "hola":
        case "veni":
            utils.channel_join(msg,true);
            break;
        
        case "juernes":
            commands.play(msg,"https://www.youtube.com/watch?v=_XxLrVu9UHE")
            msg.react('🤪')
            break;

        //Loops queue
        case "loop":
        case "l":
            commands.loop(msg);
            break;
        
        //Loads queue from file
        //!Somehow this is buggy
        case "lq":
        case "loadqueue":
        case "cargarcola":
            commands.load_queue(msg,args);
            break;
        
        //Displays the title of the current playing song
        case "quesuena":
            commands.now_playing(msg);
            break;

        //Sends a playlist for <mood> mood
        case "mood":
            commands.mood(msg,args);
            break;
        
        //Mutes the bot
        case "mute":
            commands.mute();
            msg.react(CORTE);
            break;
            
        //Pauses music
        case "pause":
            commands.pause();
            msg.react('⏸️');
            break;

        //Play song by input (natural language, yt link, spotify link)
        case "p":
        case "play":
            commands.play(msg,args);
            break;
        
        //Plays a song instantly, without adding it to the queue
        case "playINSTA":
        case "playinsta":
        case "PLAYINSTA":
        case "playI":
        case "playi":
            commands.playI(msg,args);
            break;
            
        //Jumps to the args-th song in the queue
        case "jump":
            commands.jump(msg,args);
            break;
    
        //Makes bot crash
        //TODO make this command accesible only by me
        case "paraguayo":
        case "paradoja":
        case "die":
        case "reset":
            if (msg.author.discriminator === CHULS_DISCRIMINATOR)
                msg.channel.send("Perdon por trollear :(").then(process.exit(0));
            else
                msg.channel.send("Mira si vos me vas a apagar el bot a mi");

            break;

        //Sends bot ping in miliseconds
        case "ping":
        case "ms":
            commands.ping(msg);
            break;

        //Encola las sesiones de previa y cachengue desde n hasta m especificados
        //TODO make const ULTIMO_PYC refresh automatically whenever ferpa uploads a new session
        case "previaycachengue":
        case "pyc":
            commands.previa_y_cachengue(msg,args);
            break;

        //Modifies bot prefix
        case "prefix":
            prefix = commands.change_prefix(msg,args);
            break;
        
        //Sends the actual prefix through the actual channel
        case "showprefix":
            msg.channel.send("`Prefix: " + prefix + '`');
            break;

        //Sends the bot status through a message
        case "status":
            commands.status(msg);
            break;
        
        //Stops music definitively
        case "stop":
            commands.stop(msg);
            break;

        //Displays Queue
        case "q":
        case "cola":
        case "queue":
            try {
                commands.display_queue(msg);
            }
            catch(error) {
                console.log("Exception in queue ", error);
                break;
            }
            break;

        //Displays all saved queues
        case "queues":
            //console.log(custom_queues)
            commands.show_queues(msg,[custom_queues]);
            break;

        //enqueues a random song from aliases
        case "random":
            commands.random_song(msg);
            break;
        
        //Resume
        case "r":
        case "resume":
            commands.resume();
            break;

        //Skip to next song
        case "skip":
        case "n":
        case "next":
            try{
                commands.next(msg);
            }
            catch (e) {
                console.log("Exception in skip " + e);
            }
            break;

        //makes songs go brrrrrr
        case "satura":
        case "earrape":
            commands.volume_set(msg,10);
            msg.channel.send("Espero que nadie este por hacer un clutch\n");
            msg.react(SPEAKER);
            break;

        
        case "source":
        case "code":
        case "sourcecode":
        case "sc":
            msg.channel.send("https://github.com/jramosss/juakoto");
            break;
        
        //Spams a message args times
        case "spam":
            commands.spam(msg,args);
            break;
        
        //shuffles queue
        case "shuffle":
            commands.shuffle_queue(msg);
            break;

        //Saves current queue to <filename> file
        case "sq":
        case "savequeue":
        case "guardarcola":
            try{
                custom_queues = commands.save_queue(msg,args);
            }
            catch (error){
                console.log("Exception in savequeue: ", error);
            }

            break;


        case "test":
            stats.increment(msg.author.username,args[1]);
            break;
            
        //Unmutes the bot, setting volume to previous volume
        case "unmute":
            commands.unmute();
            msg.react(SPEAKER);
            break;
        
        //Set bot volume
        case "vs":
        case "volumeset":
            commands.volume_set(msg,args);
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
