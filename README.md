# pretty-log-tagged

Make console logs readable with clean, structured, tag-based output.

[![npm version](https://img.shields.io/npm/v/pretty-log-tagged)](https://www.npmjs.com/package/pretty-log-tagged)
[![npm downloads](https://img.shields.io/npm/dm/pretty-log-tagged)](https://www.npmjs.com/package/pretty-log-tagged)
[![license](https://img.shields.io/npm/l/pretty-log-tagged)](./LICENSE)

## The Problem

```ts
console.log(`User login: ${JSON.stringify(user)}`);
console.log(`[PAYMENT] ${JSON.stringify(payload)}`);
console.log(`[DB] Query took ${ms}ms`);
```

Hard to scan. No structure. No color. Every log looks the same.

## The Solution

```ts
clog.user(user);
clog.payment(payload);
clog.db(`Query took ${ms}ms`);
```

Each log line gets a colored tag, a timestamp, and formatted output automatically.

## Installation

```bash
npm install pretty-log-tagged
```

## Usage

```ts
import { clog } from 'pretty-log-tagged';

clog.user({ id: 1, name: 'Jay' });
clog.error('Something went wrong');
clog.payment({ amount: 99.99, currency: 'USD' });
clog.server('Listening on port 3000');
clog.db({ query: 'SELECT *', table: 'users' });
clog.auth({ token: 'Bearer ...' });
```

The dot notation is the tag. Any property you access becomes the label of that log line. All built-in tags are pre-styled, and any unknown tag falls back to a default style automatically.

```ts
clog.anything('works too');
clog.myCustomTag({ whatever: true });
```

## Built-in Tags

| Tag        | Console Method |
|------------|----------------|
| `info`     | console.info   |
| `success`  | console.log    |
| `warn`     | console.warn   |
| `error`    | console.error  |
| `debug`    | console.debug  |
| `user`     | console.log    |
| `auth`     | console.log    |
| `db`       | console.log    |
| `api`      | console.log    |
| `server`   | console.log    |
| `request`  | console.log    |
| `response` | console.log    |
| `cache`    | console.log    |
| `job`      | console.log    |
| `event`    | console.log    |
| `mail`     | console.log    |
| `payment`  | console.log    |
| `socket`   | console.log    |
| `test`     | console.log    |

## Custom Logger

Need your own tags or want to silence logs in tests? Use `createLogger`:

```ts
import { createLogger } from 'pretty-log-tagged';

const log = createLogger({
  timestamp: true,   // show ISO timestamp, default: true
  silent: false,     // suppress all output, default: false
  tags: {
    stripe: { fg: 'black', bg: 'brightGreen', level: 'log' },
    redis:  { fg: 'white', bg: 'red',         level: 'warn' },
  },
});

log.stripe({ event: 'charge.succeeded' });
log.redis('Cache miss');
```

Silence all output in test environments:

```ts
const log = createLogger({ silent: process.env.NODE_ENV === 'test' });
```

## Options

| Option      | Type      | Default | Description                       |
|-------------|-----------|---------|-----------------------------------|
| `timestamp` | `boolean` | `true`  | Prepend ISO timestamp to each log |
| `silent`    | `boolean` | `false` | Suppress all output               |
| `tags`      | `object`  | `{}`    | Add or override tag definitions   |

## Tag Config

Each entry in `tags` accepts:

```ts
{
  fg: FgColor,     // foreground color
  bg: BgColor,     // background color
  level: 'log' | 'info' | 'warn' | 'error' | 'debug'
}
```

Available colors: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`, and their `bright` variants — `brightRed`, `brightGreen`, `brightBlue`, etc.

## TypeScript

Fully typed. The default `clog` instance and any instance from `createLogger` are typed with all built-in tags. Custom tags are accessible via string indexing.

```ts
import { clog, createLogger, PrettyLogger, LoggerOptions } from 'pretty-log-tagged';
```

## License

MIT