export interface _Command {
  prefix: string;
  command: string;
  args: string[];
}

export interface Command {
  name: string;
  function: any;
}
