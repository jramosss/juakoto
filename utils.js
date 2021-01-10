const fs = require('fs')

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
        if(arr[i] === "p" || arr[i] === ' '){
            i++;
            continue;
        }
        str1 += arr[i];
        str1 += " ";
        i++;
    }
    return str1;
}

function queue_length(queue){
    let count = 0;
    for (var _ in queue)
        count++;
    return count
}

function write_to_file (filename,text,flagg,brackets=false){
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

function read_from_file (filename){
    try {
        return fs.existsSync(filename) ? 
            fs.readFileSync(filename,'utf8') : null;
    }
    catch (err) {
        console.log("Exception in read_from_file" + err)
    }
}

function get_links (list) {
    let len = list.length;
    let links = [];
    let aux_str = "";
    for (let i = 0; i <= len; i++){
        if (list[i] === ',' || i == len){
            links.push(aux_str);
            aux_str = "";
        }
        else
            aux_str += list[i];
    }
    return links;
}

function read_aliases (aliases_filepath) {
    let text = read_from_file(aliases_filepath);
    let fst_word = false;
    let finished_dict = false;
    let aliases = {};
    let i = 0;
    let fst_word_string = "";
    let snd_word_string = "";
    while (i < text.length) {
        switch (text[i]){
            case "[":
                fst_word = true;
                finished_dict = false;
                i++;
                continue;
            case ",":
                fst_word = false;
                i++;
                continue;
            case "]":
                finished_dict = true;
                aliases[fst_word_string] = snd_word_string;
                fst_word_string = "";
                snd_word_string = "";
                i++;
                continue;
        }

        if (fst_word)
            fst_word_string += text[i];
        else 
            snd_word_string += text[i];
        i++;
    }
    return aliases;
}

async function handle_args (args) {
    if (args[0] === 'p')
        args[0] = "";

    let link = "";
    if (valid_URL(args))
        link = args;
    else if (valid_URL(args[1]))
        link = args[1];
    else if (valid_URL(args[2]))
        link = args[2];
    else{
        try {
            link = await get_link(adapt_input(args));
        }
        catch (e) {
            link = "";
            console.log("Exception in handle_args " + e);
        }
    }
    return link;
}

function dict_contains (dict,elem) {
    for (const [key,value] of Object.entries(dict)) {
        if (key == elem)
            return true;
    }
    return false;
}

//TODO implement this function so i can write error logs
//function write (filename)

module.exports = {adapt_input,valid_URL,sleep,queue_length,write_to_file,
                  get_links,read_from_file,read_aliases,handle_args,
                  dict_contains}