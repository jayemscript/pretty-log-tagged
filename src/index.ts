/**
 * pretty-log
 * Make console logs readable with clean, structured, tag-based output.
 *
 * @example
 * // Named import — use the default `clog` instance
 * import { clog } from 'pretty-log';
 * clog.user({ id: 1, name: 'Jay' });
 * clog.error('Something went wrong');
 *
 * @example
 * // Create a custom logger with extra tags
 * import { createLogger } from 'pretty-log';
 * const log = createLogger({
 *   tags: {
 *     stripe: { fg: 'black', bg: 'brightGreen', level: 'log' },
 *   }
 * });
 * log.stripe({ amount: 9.99 });
 */

export { clog, createLogger } from "./logger";
export type { PrettyLogger, LogFn, LoggerOptions } from "./logger";
export type { TagConfig, BuiltinTag } from "./lib/tags";
export { DEFAULT_TAGS } from "./lib/tags";
