# pretty-log

Make console logs readable with clean, structured, tag-based output.

## Installation

```bash
npm install pretty-log
```

## Usage

```ts
import { clog } from 'pretty-log';

clog.user({ id: 1, name: 'Jay' });
clog.error('Something went wrong');
clog.payment({ amount: 99.99, currency: 'USD' });
clog.server('Listening on port 3000');
```

The dot notation is the tag. Any property you access becomes the label of that log line. All built-in tags are pre-styled, and any unknown tag falls back to a default style automatically.

## Built-in Tags

| Tag       | Console Method |
|-----------|----------------|
| info      | console.info   |
| success   | console.log    |
| warn      | console.warn   |
| error     | console.error  |
| debug     | console.debug  |
| user      | console.log    |
| auth      | console.log    |
| db        | console.log    |
| api       | console.log    |
| server    | console.log    |
| request   | console.log    |
| response  | console.log    |
| cache     | console.log    |
| job       | console.log    |
| event     | console.log    |
| mail      | console.log    |
| payment   | console.log    |
| socket    | console.log    |
| test      | console.log    |

## Custom Logger

```ts
import { createLogger } from 'pretty-log';

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

## Options

| Option      | Type    | Default | Description                        |
|-------------|---------|---------|------------------------------------|
| `timestamp` | boolean | `true`  | Prepend ISO timestamp to each log  |
| `silent`    | boolean | `false` | Suppress all output                |
| `tags`      | object  | `{}`    | Add or override tag definitions    |

## Tag Config

Each tag entry accepts the following fields:

```ts
{
  fg: FgColor,                              // foreground color
  bg: BgColor,                              // background color
  level: 'log' | 'info' | 'warn' | 'error' | 'debug'
}
```

## License

MIT