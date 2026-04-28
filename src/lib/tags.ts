import type { FgColor, BgColor } from "../utils/colors";

export interface TagConfig {
  fg: FgColor;
  bg: BgColor;
  /** Which console method to use under the hood */
  level: "log" | "info" | "warn" | "error" | "debug";
}

/**
 * Built-in tag definitions.
 * You can extend these via `createLogger({ tags: { ... } })`.
 */
export const DEFAULT_TAGS: Record<string, TagConfig> = {
  // Generic
  info: { fg: "white", bg: "blue", level: "info" },
  success: { fg: "black", bg: "brightGreen", level: "log" },
  warn: { fg: "black", bg: "brightYellow", level: "warn" },
  error: { fg: "brightWhite", bg: "brightRed", level: "error" },
  debug: { fg: "black", bg: "gray", level: "debug" },

  // Domain-specific
  user: { fg: "black", bg: "brightCyan", level: "log" },
  auth: { fg: "brightWhite", bg: "magenta", level: "log" },
  db: { fg: "black", bg: "brightMagenta", level: "log" },
  api: { fg: "black", bg: "brightBlue", level: "log" },
  server: { fg: "black", bg: "green", level: "log" },
  request: { fg: "black", bg: "cyan", level: "log" },
  response: { fg: "black", bg: "brightGreen", level: "log" },
  cache: { fg: "black", bg: "yellow", level: "log" },
  job: { fg: "black", bg: "brightMagenta", level: "log" },
  event: { fg: "black", bg: "brightYellow", level: "log" },
  mail: { fg: "black", bg: "brightCyan", level: "log" },
  payment: { fg: "brightWhite", bg: "brightGreen", level: "log" },
  socket: { fg: "black", bg: "blue", level: "log" },
  test: { fg: "black", bg: "brightWhite", level: "log" },
};

export type BuiltinTag = keyof typeof DEFAULT_TAGS;
