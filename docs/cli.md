# The Batfish CLI

The following is output by `batfish --help`:

```
Build websites with batfish.

[1mUsage[22m
  batfish <command> [options]

  You must provide a batfish configuration module, either with
  batish.config.js in process.cwd() or with the --config option.

[1mCommands[22m
  start            Start a development server.
  build            Build the static site.
  serve-static     Serve the static site.
  write-babelrc    Write a .babelrc file that other processes,
                   like your test runner, can use.

[1mShared options[22m
  -c, --config     Path to your configuration module.
                   Default: batfish.config.js
  -V, --verbose    Log extra stats.

[1m[35mstart[39m options[22m
  -p, --port       Server port. Default: 8080.
  -i, --include    Build only the specified page(s). Value
                   is a glob relative to the root of your site.
  --production     Build as though for production.
  --no-clear       Do not clear the destination directory.

[1m[35mbuild[39m options[22m
  -d, --debug      Build for debugging, not for production.
  --no-clear       Do not clear the destination directory.

[1m[35mserve-static[39m options[22m
  -p, --port       Server port. Default: 8080.

[1m[35mwrite-babelrc[39m options[22m
  --target         "node" or "browser". Default: "node".
  --dir            Directory where .babelrc should be written.
                   Default: same directory as Batfish config.

[1mExamples[22m
  No options are required for any command.
    [36mbatfish start[39m
    [36mbatfish build[39m
    [36mbatfish serve-static[39m
    [36mbatfish write-babelrc[39m
  Build with your Batfish config in a special place.
    [36mbatfish build -c conf/bf.js[39m
  Start with an alternate port.
    [36mbatfish start -p 9966[39m
  Start but only build the /about pages.
    [36mbatfish start -i about/**[39m
  Start but only build the /about/history page.
    [36mbatfish start --include about/history[39m
```
