//? How can i make this file shorter?

//Server stuff
const PORT = process.env.PORT || 5000;

//require('dotenv').config({path:'../.env'});

//External libraries
const Discord = require('discord.js');
const bot = new Discord.Client();

const Alias = require('./classes/Alias');
const Commands = require('./resources/commands');
const Prefix = require('./classes/Prefix');
const Queues = require('./classes/Queues');
const Utils = require('./classes/Utils')

const alias = new Alias();
const commands = new Commands();
const _prefix = new Prefix();
const queues = new Queues();
const utils = new Utils();

//Global vars
let prefix = _prefix.load_prefix();
if (!prefix) prefix = 'juakoto';
let aliases;
let custom_queues;
//let loop = false;

//Global Consts
const CHULS_DISCRIMINATOR = '5131';


//const Spotify = require('./Spotify');
//const sp = new Spotify();

//Emojis
const CORTE = '776276782125940756';
const SPEAKER = '🔈';


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

bot.on('disconnect', async () => await commands.clear_queue())

//Core Function
bot.on('message', async msg => {
    if (msg.author.bot) return;
    let args = null;
    try {
        args = msg.content.substring(prefix.length + 1).split(" ");
    }
    catch (e) {
        console.error(e);
        args = msg.content.substring('juakoto'.length + 1).split(" ");
    }
    const raw_input = msg.content.substring(prefix.length + 1).replace(args[0], "");
    if (!msg.content.startsWith(prefix)) return;
    console.log("Message: ", args, " Sent by ", msg.author.username);

    //Handle aliases
    const aliass = await alias.find(args[0]);
    if (aliass) await commands.play(msg, aliass);

    switch (args[0]) {

        //Register a new alias for a song
        case "alias":
            aliases = await commands.register_alias(msg, args);
            break;

        //display all aliases
        case "aliases":
            await commands.show_aliases(msg, aliases);
            break;

        //Make bot leave
        case "andate":
        case "leave":
        case "tomatela":
        case "shu":
        case "chau":
            await commands.leave(msg);
            break;

        //Clears queue
        case "c":
        case "clear":
            await commands.clear_queue(msg);
            break;

        //Deletes queue from database
        case "dq":
        case "deletequeue":
            await commands.delete_queue(msg, args);
            break;

        //greets
        case "gracias":
            await msg.channel.send("De nada " + msg.member.user.username);
            await msg.react('🥰');
            break;

        //Get song link by input (natural language)
        case "getlink":
        case "find":
            await commands.find(msg, args, raw_input);
            break;

        //Prints all bot utilities
        //TODO make this prettier
        case "h":
        case "help":
            await commands.display_help(msg);
            break;

        //Invoke bot into actual voice channel
        case "hola":
        case "veni":
            await utils.channel_join(msg, true);
            break;

        case "juernes":
            await commands.play(msg, "https://www.youtube.com/watch?v=_XxLrVu9UHE")
            await msg.react('🤪')
            break;

        //Loops queue
        case "loop":
        case "l":
            await commands.loop(msg);
            break;

        //Loads queue from file
        //!Somehow this is buggy
        case "lq":
        case "loadqueue":
        case "cargarcola":
            await commands.load_queue(msg, args);
            break;

        //Displays the title of the current playing song
        case "quesuena":
            await commands.now_playing(msg);
            break;

        //Sends a playlist for <mood> mood
        case "mood":
            await commands.mood(msg, args);
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
            await commands.play(msg, args);
            break;

        //Plays a song instantly, without adding it to the queue
        case "playINSTA":
        case "playinsta":
        case "PLAYINSTA":
        case "playI":
        case "playi":
            await commands.playI(msg, args);
            break;

        //Jumps to the args-th song in the queue
        case "jump":
            await commands.jump(msg, args);
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
            await commands.ping(msg);
            break;

        //Encola las sesiones de previa y cachengue desde n hasta m especificados
        //TODO make const ULTIMO_PYC refresh automatically whenever ferpa uploads a new session
        case "previaycachengue":
        case "pyc":
            await commands.previa_y_cachengue(msg, args);
            break;

        //Modifies bot prefix
        case "prefix":
            prefix = await commands.change_prefix(msg, args);
            break;

        //Sends the actual prefix through the actual channel
        case "showprefix":
            await msg.channel.send("`Prefix: " + prefix + '`');
            break;

        //Sends the bot status through a message
        case "status":
            await commands.status(msg);
            break;

        //Stops music definitively
        case "stop":
            await commands.stop(msg);
            break;

        //Displays Queue
        case "q":
        case "cola":
        case "queue":
            try {
                await commands.display_queue(msg);
            }
            catch (error) {
                console.error("Exception in queue " + error);
                break;
            }
            break;

        //Displays all saved queues
        case "queues":
            //console.log(custom_queues)
            await commands.show_queues(msg, [custom_queues]);
            break;

        //enqueues a random song from aliases
        case "random":
            await commands.random_song(msg);
            break;

        //Resume
        case "r":
        case "resume":
            await commands.resume();
            break;

        //Skip to next song
        case "skip":
        case "n":
        case "next":
            try {
                await commands.next(msg);
            }
            catch (e) {
                console.error("Exception in skip " + e);
            }
            break;

        //makes songs go brrrrrr
        case "satura":
        case "earrape":
            await commands.volume_set(msg, 10);
            await msg.channel.send("Espero que nadie este por hacer un clutch\n");
            await msg.react(SPEAKER);
            break;


        case "source":
        case "code":
        case "sourcecode":
        case "sc":
            await msg.channel.send("https://github.com/jramosss/juakoto");
            break;

        //Spams a message args times
        case "spam":
            await commands.spam(msg, args);
            break;

        //shuffles queue
        case "shuffle":
            await commands.shuffle_queue(msg);
            break;

        //Saves current queue to <filename> file
        case "sq":
        case "savequeue":
        case "guardarcola":
            try {
                custom_queues = await commands.save_queue(msg, args);
            }
            catch (error) {
                console.error("Exception in savequeue: ", error);
            }

            break;


        case "test":
            stats.increment(msg.author.username, args[1]);
            break;

        //Unmutes the bot, setting volume to previous volume
        case "unmute":
            commands.unmute();
            msg.react(SPEAKER);
            break;

        //Set bot volume
        case "vs":
        case "volumeset":
            await commands.volume_set(msg, args);
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
