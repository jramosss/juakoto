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

function write_to_file (filename,text,flagg){
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

//TODO implement this function so i can write error logs
//function write (filename)

module.exports = {adapt_input,valid_URL,sleep,queue_length,write_to_file,get_links}