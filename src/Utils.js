const fs = require('fs');
const Youtube = require('./Youtube')
const yt = new Youtube();

module.exports = class Utils {

    sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    //Check if a string is an url
    valid_URL(str) {
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }
    
    //Takes a message and adapt the string to make it readable by get_song_link
    adapt_input = (str) => {
        let full_input = "";
        str.split(" ").forEach(word => {
            if (word !== 'juakoto' && word !== 'p' && word !== 'play'){
                full_input += word += " ";
            } 
        });
        return full_input;
    }
    
    queue_length = (dict) => Object.keys(dict).length;
    
    write_to_file (filename,text,flagg,brackets=false){
        try {
            if (brackets)
                fs.writeFileSync(filename,
                    '[',{
                    encoding : 'utf8',
                    flag : "a+"});
    
            fs.writeFileSync(filename,text,{
                encoding : "utf8",
                flag : flagg
            });
            if (brackets)
                fs.writeFileSync(filename,
                    ']',{
                    encoding : 'utf8',
                    flag : "a+"});
        }
        catch (err){
            console.log("Exception in write_to_file: " + err);
        }
    }
    
    read_from_file (filename){
        try {
            return fs.existsSync(filename) ? 
                fs.readFileSync(filename,'utf8') : null;
        }
        catch (err) {
            console.log("Exception in read_from_file" + err)
        }
    }
    
    get_song_links = (list) => list.split(',');
    
    //Returns a dict {alias_name : associated_link} from aliases file
    read_aliases (aliases_filepath) {
        const text = utils.read_from_file(aliases_filepath);
        const keyvalue = text.split('[');
        let values = [];
        keyvalue.forEach(bracket => {
            if (bracket != '')
                values.push(bracket.split(','));    
        })
        let aliases = {};
        for (let i = 0; i < values.length; i++)
            aliases[values[i][0]] = (values[i][1]).replace(']','');   
    }
    
    //TODO google if it`s a shorter way to do this
    str_arr_contains (str_arr,word) {
        for (let i = 0; i < str_arr.length; i++){
            if (str_arr[i] === word)
                return true;
        }
        return false;
    }
    
    
    object_is_video = (obj) =>  
        this.str_arr_contains(Object.keys(obj),'durationSeconds');
    
    /**
     * *Returns a link based on natural language input 
     * @param args the natural language input
    */
    async handle_args (args) {
        let link = "";
        if (this.object_is_video(args))
            link = args.url;
        else if (args[1]) {
            if (this.object_is_video(args[1])) 
                link = args[1].url;
            else if (this.valid_URL(args))
                link = args;
            else if (this.valid_URL(args[0]))
                link = args[0]
            else if (this.valid_URL(args[1]))
                link = args[1]
            else 
                link = await yt.get_song_link(this.adapt_input(args));
        }
        
        return link;
    }
    
    dict_contains (dict,elem) {
        //return dict[elem] !== undefined
        for (const [key,value] of Object.entries(dict)) {
            if (key == elem)
                return true;
        }
        return false;
    }
    
    //Copied from stackoverflow https://stackoverflow.com/questions/5612787/converting-an-object-to-a-string?page=1&tab=votes#tab-top
    objToString (obj) {
        var str = '';
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str += p + ' : ' + obj[p] + '\n';
            }
        }
        return str;
    }
    
    /**
     * get dict keys
     * @param {dict}
     * @returns {array with keys}
     * */
    get_keys (dict) {
        let keys = [];
        for (const [key,value] of Object.entries(dict)) {
            keys.push(key);
        }
        return keys;
    }
    
    array_shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
    }
    
    dict_shuffle (dict) {
        let random_nums = [];
        for (let i = 0; i < this.queue_length(dict); i++)
            random_nums.push(i);
        this.array_shuffle(random_nums);
    
        let new_dict = {};
    
        for (let i = 0; i < random_nums.length; i++)
            new_dict[i] = dict[random_nums[i]];
    
        return new_dict;
    }
    
    //TODO make custom exceptions
    /** 
     * @param {opt} is to recognize whenthe user sent the command
     * play and not the command "hola"
     * */ 
     
    async channel_join (msg,opt=false) {
        const vc = msg.member.voice.channel;
        if (!vc) {
            //msg.react(X).then(msg.react(CORTE));
            msg.channel.send("A que canal queres que me meta si no estas en ninguno mogolico de mierda");
            await sleep(2500);
            msg.channel.send("La verdad que me pareces un irrespetuoso");
            await sleep(3000);
            msg.channel.send("Hijo de remil puta");
            return;
        }
        else{
            const permissions = vc.permissionsFor(msg.client.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK'))
                return msg.channel.send("Me sacaste los permisos imbecil");
        }
        if (msg.guild.voice && msg.guild.voice.channel){
            /*
            try{
                console.log("YO: ",msg.member.voice.channel.id,"EL BOT: ",msg.guild.voice.channelID);
            }
            catch{}*/
            if (msg.member.voice.channel.id === msg.guild.voice.channelID && opt){
                msg.channel.send("Ya estoy en el canal pa, sos estupido?");
                return undefined;
            }
            else if (msg.member.voice.channel.id !== msg.guild.voice.channelID){
                msg.channel.send("Estoy en otro canal")
                return undefined;
            }
            else 
                return await msg.member.voice.channel.join();
        }
        else
            return await msg.member.voice.channel.join();
    }
}