/**
 * ANSI color codes for terminal output
 */
export const RESET = "\x1b[0m";
export const BOLD = "\x1b[1m";
export const DIM = "\x1b[2m";

export const FG = {
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  brightRed: "\x1b[91m",
  brightGreen: "\x1b[92m",
  brightYellow: "\x1b[93m",
  brightBlue: "\x1b[94m",
  brightMagenta: "\x1b[95m",
  brightCyan: "\x1b[96m",
  brightWhite: "\x1b[97m",
} as const;

export const BG = {
  black: "\x1b[40m",
  red: "\x1b[41m",
  green: "\x1b[42m",
  yellow: "\x1b[43m",
  blue: "\x1b[44m",
  magenta: "\x1b[45m",
  cyan: "\x1b[46m",
  white: "\x1b[47m",
  gray: "\x1b[100m",
  brightRed: "\x1b[101m",
  brightGreen: "\x1b[102m",
  brightYellow: "\x1b[103m",
  brightBlue: "\x1b[104m",
  brightMagenta: "\x1b[105m",
  brightCyan: "\x1b[106m",
  brightWhite: "\x1b[107m",
} as const;

export type FgColor = keyof typeof FG;
export type BgColor = keyof typeof BG;

export function colorize(
  text: string,
  fg?: FgColor,
  bg?: BgColor,
  bold = false,
): string {
  let result = "";
  if (bold) result += BOLD;
  if (bg) result += BG[bg];
  if (fg) result += FG[fg];
  result += text;
  result += RESET;
  return result;
}
