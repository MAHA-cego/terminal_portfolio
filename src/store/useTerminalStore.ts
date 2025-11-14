import { create } from 'zustand';
import { commandParser } from '@/utils/commandParser';

export interface TerminalEntry {
  type: "input" | "output";
  value: string;
}

export interface TerminalState {
  history: TerminalEntry[];
  addEntry: (entry: TerminalEntry) => void;
  submitCommand: (cmd: string) => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
    history: [],
    addEntry: (entry: TerminalEntry) => set(s => ({history: [...s.history, entry]})),

    submitCommand: (cmd: string) => {
        const output = commandParser(cmd);
        get().addEntry({ type: "input", value: cmd});
        get().addEntry({ type: "output", value: output });
    }
}))