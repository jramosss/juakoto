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
    
    //Takes a message and adapt the string to make it readable by other functions
    //i.e: it takes ["","play","oasis","wonderwall","live"] into "oasis wondewall live"
    adapt_input = (str1) => {
        let str = String(str1);
        let full_input = "";
        str.split(" ").forEach(word => {
            if (word !== 'juakoto' && word !== 'p' && word !== 'play'){
                full_input += word += " ";
            } 
        });
        return full_input;
    }
    
    queue_length = (dict) => Object.keys(dict).length;
    
    //Used to store the prefix
    write_to_file (filename,text,flagg){
        try {
            fs.writeFileSync(filename,text,{
                encoding : "utf8",
                flag : flagg
            });
        }
        catch (err){
            console.log("Exception in write_to_file: " + err);
        }
    }
    
    /**
    * Used to read the prefix
    @returns {file content} if file exists, null otherwise
    */
    read_from_file (filename){
        try {
            return fs.existsSync(filename) ? 
                fs.readFileSync(filename,'utf8') : null;
        }
        catch (err) {
            console.log("Exception in read_from_file" + err)
        }
    }
    
    //TODO google if it`s a shorter way to do this
    str_arr_contains (str_arr,word) {
        for (let i = 0; i < str_arr.length; i++)
            if (str_arr[i] === word)
                return true;

        return false;
    }
    
    object_is_video = (obj) =>
        this.str_arr_contains(Object.keys(obj),'ago');
    
    /**
     * *Returns a link based on natural language input 
     * @param {the natural language input or link}
    */
    async handle_args (args) {
        let link = "";
        //TODO should be a smarter & shorter way to do this
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
    
    /**
     * get dict keys
     * @param {dict}
     * @returns {array with keys}
     * */
    //! I should get rid of this
    get_keys (dict) {
        let keys = [];
        for (const [key,value] of Object.entries(dict))
            keys.push(key);

        return keys;
    }
    
    //Used to shuffle the queue, I obviously copied this.
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

    //Pretty unnecesary
    args1_check = (args1,msg,usage = "",reaction='❌') => {
        if (!args1){
            msg.channel.send("No me pasaste argumentos, "+ usage);
            msg.react(reaction);
            return false;
        }
        return true;
    }
}