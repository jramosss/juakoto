/*
 * This module has functions to change and load the prefix of the bot 
*/

const Utils = require('./Utils.js')
const utils = new Utils();

const PREFIX_FILEPATH = "../db/prefix"

module.exports = class PrefixUtils {
    change_prefix = (new_prefix) =>  
        utils.write_to_file(PREFIX_FILEPATH,new_prefix,'w');
    
    load_prefix = () => utils.read_from_file(PREFIX_FILEPATH);
}