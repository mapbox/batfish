# Node API

All of the functions accept two optional arguments:

- `batfishConfig`: See [`docs/configuration.md`](./configuration.md).
- `projectDirectory`: Absolute path to the root directory of your projects.
  This is used to establish some default values for the configuration.
  For example, the default [`pagesDirectory`] value is `{projectDirectory}/src/pages`.
  Defaults to `process.cwd()`.

## start

```
start(batfishConfig?: Object, projectDirectory?: string): EventEmitter
```

Start a development server.

Returns an EventEmitter that emits the following events.

- `notification`: The listener is passed a string message.
  These are the messages logged by the CLI.
- `error`: The listener is passed the error.

## build

```
build(batfishConfig?: Object, projectDirectory?: string): EventEmitter
```

Build the static site.

Returns an EventEmitter that emits the following events.

- `done`: Emitted when the build is complete.
- `notification`: The listener is passed a string message.
  These are the messages logged by the CLI.
- `error`: The listener is passed the error.

## serveStatic

```
serveStatic(batfishConfig?: Object, projectDirectory?: string): EventEmitter
```

Serve the static site.

Returns an EventEmitter that emits the following events.

- `notification`: The listener is passed a string message.
  These are the messages logged by the CLI.
- `error`: The listener is passed the error.

## writeBabelrc

```
writeBabelrc(batfishConfig?: Object, options?: {
  outputDirectory: string,
  target?: 'browser' | 'node'
}): string
```

Write a `.babelrc` file based on Batfish's Babel defaults and your Batfish config file.
This `.babelrc` file can be used for other processes that run Babel and want to understand the source files that you write for Batfish (which end up going fed through Webpack).
For example, you may want to generate a `.babelrc` file before running Jest tests against your client-side JS, so Jest can understand the same files that Batfish & Webpack do.

`options.outputDirectory` defaults to the directory of your Batfish configuration.

`options.target` defaults to `'node'`.

[`pagesdirectory`]: ./configuration.md#pagesdirectory
