/*
 * This module has functions to change and load the prefix of the bot
 */

import Utils from './Utils';
const utils = new Utils();

const PREFIX_FILEPATH = '../db/prefix';

//TODO refactor

export default class PrefixUtils {
  change_prefix = (new_prefix: string) =>
    utils.write_to_file(PREFIX_FILEPATH, new_prefix, 'w');

  load_prefix = (): string => utils.read_from_file(PREFIX_FILEPATH);
}
