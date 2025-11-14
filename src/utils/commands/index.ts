import help from './help';
import ls from './ls';
import open from './open';
import clear from './clear';

export const commands = {
  help,
  ls,
  open,
  clear,
};

export type CommandName = keyof typeof commands;
