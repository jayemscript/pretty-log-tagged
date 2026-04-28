# Contributing

Contributions are welcome. Please read this guide before submitting a pull request.

## Getting Started

```bash
git clone https://github.com/jayemscript/pretty-log-tagged.git
cd pretty-log-tagged
npm install
```

## Development

Run the tests:

```bash
npm test
```

Type check without building:

```bash
npm run lint
```

Build the package:

```bash
npm run build
```

## Project Structure

```
src/
  index.ts          - public exports
  logger.ts         - core logger and createLogger factory
  lib/
    tags.ts         - built-in tag definitions
  utils/
    colors.ts       - ANSI color codes
    formatter.ts    - timestamp, label, and data formatting
test/
  logger.test.ts    - all tests
```

## Guidelines

- Keep changes focused. One feature or fix per pull request.
- Add or update tests for any changed behavior.
- Make sure `npm test` and `npm run lint` pass before submitting.
- Follow the existing code style — strict TypeScript, no external runtime dependencies.

## Adding a Built-in Tag

Open `src/lib/tags.ts` and add an entry to `DEFAULT_TAGS`:

```ts
mytag: { fg: 'black', bg: 'brightCyan', level: 'log' },
```

That is all that is needed. The Proxy in `logger.ts` picks it up automatically.

## Reporting Issues

Open an issue on GitHub with a clear description and a minimal reproduction if possible.

## License

By contributing, you agree that your contributions will be licensed under the MIT license.