import { type FgColor, type BgColor, FG, colorize, DIM, RESET } from "./colors";

/**
 * Returns an ISO timestamp string, dimmed for console output.
 */
export function getTimestamp(): string {
  const now = new Date().toISOString();
  return `${DIM}${now}${RESET}`;
}

/**
 * Formats a tag/title label with color and padding.
 */
export function formatTag(
  tag: string,
  fg: FgColor = "white",
  bg: BgColor = "gray",
): string {
  const upper = ` ${tag.toUpperCase()} `;
  return colorize(upper, fg, bg, true);
}

/**
 * Serializes data — objects get pretty-printed JSON, primitives stay as-is.
 */
export function formatData(data: unknown, fg: FgColor = "white"): string {
  if (data === null) return colorize("null", "gray");
  if (data === undefined) return colorize("undefined", "gray");

  if (typeof data === "object") {
    try {
      const json = JSON.stringify(data, null, 2);
      // Colorize keys for readability
      const colored = json.replace(/"([^"]+)":/g, `${FG.cyan}"$1":${RESET}`);
      return colored;
    } catch {
      return String(data);
    }
  }

  if (typeof data === "boolean") {
    return colorize(String(data), data ? "brightGreen" : "brightRed");
  }

  if (typeof data === "number") {
    return colorize(String(data), "brightYellow");
  }

  return colorize(String(data), fg);
}

/**
 * Builds the full log line prefix: timestamp + tag.
 */
export function buildPrefix(tag: string, fg: FgColor, bg: BgColor): string {
  return `${getTimestamp()} ${formatTag(tag, fg, bg)}`;
}
