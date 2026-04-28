import { DEFAULT_TAGS, TagConfig, BuiltinTag } from "./lib/tags";
import { buildPrefix, formatData } from "./utils/formatter";
import { FgColor, BgColor } from "./utils/colors";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LogFn = (...args: unknown[]) => void;

/**
 * The shape of a pretty-log instance.
 *
 * Built-in tags are fully typed; custom tags are accessible via string indexing.
 *
 * @example
 * clog.user({ id: 1, name: 'Jay' });
 * clog.payment({ amount: 99.99 });
 * clog.myCustomTag('hello!');
 */
export type PrettyLogger = {
  [K in BuiltinTag]: LogFn;
} & {
  /** Log under any arbitrary tag name */
  [tag: string]: LogFn;
};

export interface LoggerOptions {
  /**
   * Show ISO timestamp before each log.
   * @default true
   */
  timestamp?: boolean;

  /**
   * Suppress all output (useful for test environments).
   * @default false
   */
  silent?: boolean;

  /**
   * Extend or override built-in tag definitions.
   *
   * @example
   * createLogger({
   *   tags: {
   *     stripe: { fg: 'black', bg: 'brightGreen', level: 'log' },
   *   }
   * });
   */
  tags?: Record<string, TagConfig>;
}

// ─── Environment ──────────────────────────────────────────────────────────────

const isBrowser = typeof window !== "undefined";

// ─── Browser dispatch ─────────────────────────────────────────────────────────

/**
 * In browser environments, ANSI codes don't render.
 * Use CSS-styled console groups instead.
 */
function dispatchBrowser(
  tag: string,
  args: unknown[],
  level: TagConfig["level"],
  timestamp: boolean,
): void {
  const time = timestamp ? `${new Date().toISOString()} ` : "";
  const label = `${time}[${tag.toUpperCase()}]`;

  const styles: Record<string, string> = {
    error: "color:#ff4d4f;font-weight:bold",
    warn: "color:#faad14;font-weight:bold",
    info: "color:#1890ff;font-weight:bold",
    debug: "color:#722ed1;font-weight:bold",
    log: "color:#13c2c2;font-weight:bold",
  };

  const style = styles[level] ?? styles.log;

  switch (level) {
    case "info":
      console.info(`%c${label}`, style, ...args);
      break;
    case "warn":
      console.warn(`%c${label}`, style, ...args);
      break;
    case "error":
      console.error(`%c${label}`, style, ...args);
      break;
    case "debug":
      console.debug(`%c${label}`, style, ...args);
      break;
    default:
      console.log(`%c${label}`, style, ...args);
      break;
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates a pretty-log instance with optional configuration.
 *
 * Works in both Node.js (ANSI colors) and browser (CSS-styled console).
 *
 * @example
 * const clog = createLogger();
 * clog.user({ id: 1 });
 * clog.error('Something broke');
 * clog.myTag('custom stuff');
 */
export function createLogger(options: LoggerOptions = {}): PrettyLogger {
  const { timestamp = true, silent = false, tags: customTags = {} } = options;

  const tagMap: Record<string, TagConfig> = {
    ...DEFAULT_TAGS,
    ...customTags,
  };

  function dispatch(tag: string, args: unknown[]): void {
    if (silent) return;

    const config: TagConfig = tagMap[tag] ?? {
      fg: "white" as FgColor,
      bg: "gray" as BgColor,
      level: "log",
    };

    // Browser — use CSS-styled console
    if (isBrowser) {
      dispatchBrowser(tag, args, config.level, timestamp);
      return;
    }

    // Node.js — use ANSI colors
    const prefix = timestamp
      ? buildPrefix(tag, config.fg, config.bg)
      : buildPrefix(tag, config.fg, config.bg).replace(/^\S+\s/, "");

    const formatted = args.map((a) => formatData(a)).join(" ");
    const line = `${prefix}  ${formatted}`;

    switch (config.level) {
      case "info":
        console.info(line);
        break;
      case "warn":
        console.warn(line);
        break;
      case "error":
        console.error(line);
        break;
      case "debug":
        console.debug(line);
        break;
      default:
        console.log(line);
        break;
    }
  }

  return new Proxy({} as PrettyLogger, {
    get(_target, prop: string) {
      return (...args: unknown[]) => dispatch(prop, args);
    },
  });
}

// ─── Default instance ─────────────────────────────────────────────────────────

/**
 * Ready-to-use logger instance with default settings.
 *
 * @example
 * import { clog } from 'pretty-log-tagged';
 * clog.user({ id: 1 });
 * clog.error('Oops');
 */
export const clog = createLogger();
