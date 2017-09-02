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

[`pagesdirectory`]: ./configuration.md#pagesdirectory
