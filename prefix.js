const fs = require('fs')
const utils = require('./utils')
const PREFIX_FILEPATH = "./prefix"

function change_prefix (new_prefix) {
    utils.write_to_file(PREFIX_FILEPATH,new_prefix,'w');
}

function load_prefix () {
    return utils.read_from_file(PREFIX_FILEPATH);
}


module.exports = {change_prefix,load_prefix}