import { filesystem } from "@/data/filesystem";

export default function ls(args?: string[]) {
  return Object.keys(filesystem).join("\n");
}