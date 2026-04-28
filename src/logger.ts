import { DEFAULT_TAGS, type TagConfig, type BuiltinTag } from "./lib/tags";
import { buildPrefix, formatData } from "./utils/formatter";
import type { FgColor, BgColor } from "./utils/colors";

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

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates a pretty-log instance with optional configuration.
 *
 * All tag methods are auto-generated via a Proxy, so any dot-access
 * becomes a scoped logger: `logger.user(data)`, `logger.payment(data)`, etc.
 *
 * @example
 * const clog = createLogger();
 * clog.user({ id: 1 });          // [timestamp]  USER  { id: 1 }
 * clog.error('Something broke'); // [timestamp]  ERROR  Something broke
 * clog.myTag('custom stuff');    // [timestamp]  MYTAG  custom stuff
 */
export function createLogger(options: LoggerOptions = {}): PrettyLogger {
  const { timestamp = true, silent = false, tags: customTags = {} } = options;

  const tagMap: Record<string, TagConfig> = {
    ...DEFAULT_TAGS,
    ...customTags,
  };

  /**
   * Core log dispatch — called by every tag method.
   */
  function dispatch(tag: string, args: unknown[]): void {
    if (silent) return;

    const config: TagConfig = tagMap[tag] ?? {
      fg: "white" as FgColor,
      bg: "gray" as BgColor,
      level: "log",
    };

    const prefix = timestamp
      ? buildPrefix(tag, config.fg, config.bg)
      : buildPrefix(tag, config.fg, config.bg).replace(/^\S+\s/, "");

    const formatted = args.map((a) => formatData(a)).join(" ");
    const line = `${prefix}  ${formatted}`;

    // Route to the right console method
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

  /**
   * Proxy intercepts any property access and returns a log function
   * bound to that property name as the tag.
   */
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
 * import { clog } from 'pretty-log';
 * clog.user({ id: 1 });
 * clog.error('Oops');
 */
export const clog = createLogger();
