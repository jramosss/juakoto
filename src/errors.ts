import { EmojiIdentifierResolvable, Message } from 'discord.js';

export class MissingArguments extends Error {}

const usages: Object = {
  leave: '',
};

const usagesWithArgs = (args: string[]): Object => {
  return {
    find: args[1] + '<titulo del video>',
    leave: '',
  };
};

export const errorMessages = {
  MissingArguments: 'No me pasaste argumentos',
};

export default function errorHandler(
  msg: Message,
  function_name: string,
  error: Error,
  args?: string[],
  reaction?: EmojiIdentifierResolvable
) {
  let usagess: Object = args ? usagesWithArgs(args) : usages;
  msg.channel.send(errorMessages[error.name] + ' ' + usagess[function_name]);
  if (reaction) msg.react(reaction);
}
