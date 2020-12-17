const fs = require('fs')
const PREFIX_FILEPATH = "./prefix.txt"

function change_prefix (new_prefix) {
    try {
        fs.writeFileSync(PREFIX_FILEPATH,new_prefix)
    }
    catch (err) {
        console.log(err);
    }
}

function load_prefix () {
    let prefix = "";
    try {
        prefix = fs.readFileSync(PREFIX_FILEPATH,'utf8');
    }
    catch (err) {
        console.log(err)
    }
    return prefix;
}


module.exports = {change_prefix,load_prefix}