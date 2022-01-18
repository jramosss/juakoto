import { Message } from 'discord.js';
import Commands from './commands';
const commands = new Commands();

export default function route(msg: Message, args: string[], raw_input: string) {
  switch (args[0]) {
    case 'andate':
    case 'leave':
    case 'tomatela':
    case 'shu':
    case 'chau':
      commands.leave(msg);
      break;
    case 'clear':
      commands.clear_queue(msg);
      break;
    case 'gracias':
      commands.gracias(msg);
      break;
    case 'find':
      commands.find(msg, args, raw_input);
      break;
    case 'help':
      commands.display_help(msg);
      break;
    case 'hola':
    case 'veni':
      commands.join(msg);
      break;
    case 'loop':
      commands.loop(msg);
      break;
    case 'quesuena':
      commands.now_playing(msg);
      break;
    case 'juernes':
      commands.juernes(msg);
      break;
    case 'mood':
      commands.mood(msg, args);
      break;
    case 'playi':
      commands.playI(msg, args);
      break;
    case 'jump':
      commands.jump(msg, args);
      break;
    case 'previaycachengue':
      commands.previa_y_cachengue(msg, args);
      break;
    case 'prefix':
      commands.change_prefix(msg, args);
      break;
    case 'showprefix':
      break;
    case 'status':
      commands.status(msg);
      break;
    case 'stop':
      commands.stop(msg);
      break;
    case 'queue':
    case 'q':
      commands.display_queue(msg);
      break;
    case 'resume':
      commands.resume(msg);
      break;
    case 'skip':
    case 'n':
    case 'next':
      commands.next(msg);
      break;
    case 'satura':
      commands.satura(msg);
      break;
    case 'spam':
      commands.spam(msg, args);
      break;
    case 'shuffle':
      commands.shuffle_queue(msg);
      break;
    case 'unmute':
      commands.unmute();
      break;
    case 'vs':
      commands.volume_set(msg, args);
      break;
    case 'volumeset':
      commands.volume_set(msg, args);
      break;
    case 'wendia':
      commands.wendia(msg);
      break;
  }
}
