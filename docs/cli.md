# The Batfish CLI

The following is output by `batfish --help`:

```
Build websites with batfish.

Usage
  batfish <command> [options]

  You must provide a batfish configuration module, either with
  batish.config.js in process.cwd() or with the --config option.

Commands
  start            Start a development server.
  build            Build the static site.
  serve-static     Serve the static site.
  write-babelrc    Write a .babelrc file that other processes,
                   like your test runner, can use.

Shared options
  -c, --config     Path to your configuration module.
                   Default: batfish.config.js
  -V, --verbose    Log extra stats.

start options
  -p, --port       Server port. Default: 8080.
  -i, --include    Build only the specified page(s). Value
                   is a glob relative to the root of your site.
  --production     Build as though for production.
  --no-clear       Do not clear the destination directory.
  -b, --browsers   A comma-separated browserslist string
                   specifying the browsers you want to support
                   during this dev build. Or "false" if you
                   want to support all your production browsers.

build options
  -d, --debug      Build for debugging, not for production.
  --no-clear       Do not clear the destination directory.

serve-static options
  -p, --port       Server port. Default: 8080.

write-babelrc options
  --target         "node" or "browser". Default: "node".
  --dir            Directory where .babelrc should be written.
                   Default: same directory as Batfish config.

Examples
  No options are required for any command.
    batfish start
    batfish build
    batfish serve-static
    batfish write-babelrc
  Build with your Batfish config in a special place.
    batfish build -c conf/bf.js
  Start with an alternate port.
    batfish start -p 9966
  Start but only build the /about pages.
    batfish start -i about/**
  Start but only build the /about/history page.
    batfish start --include about/history
  Start and build only for Chrome 60+.
    batfish start --browsers "Chrome >= 60"
```
