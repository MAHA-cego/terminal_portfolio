import { commands } from "@/utils/commands";

export function commandParser(input: string): string{
    const [name, ...args] = input.trim().split(/\s+/);

    const cmd = commands[name as keyof typeof commands];
    if (!cmd) return `
  Unknown command: ${name}\n  Type "help" for available commands.
`;

    return cmd(args);
}