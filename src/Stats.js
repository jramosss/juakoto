const Utils = require('./Utils');
const utils = new Utils();

module.exports = class Stats {
    dict = {};
    STATS_FILEPATH = '../db/stats';

    load_dict = _ => utils.read_from_file(this.STATS_FILEPATH);
}