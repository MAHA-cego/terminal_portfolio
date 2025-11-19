import { commands } from "@/utils/commands";

export function commandParser(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const [name, ...args] = trimmed.split(/\s+/);
  const fn = (commands as any)[name];

  if (!fn) {
    return `
  Unknown command: ${name}
  Type "help" for available commands.

`;
  }

  try {
    return fn(args);
  } catch (err) {
    console.error("Command error", err);
    return "Command failed.";
  }
}
