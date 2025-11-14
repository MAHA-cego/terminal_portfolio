export default function open(args: string[]) {
  const path = args.join(' ');
  return `Opening: ${path}`;
}
