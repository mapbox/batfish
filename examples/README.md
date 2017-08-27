# Examples

Each subdirectory in `examples/` is an example site, illustrating some subset of Batfish's features.

### Running examples

-   `cd` into the example's directory.
-   npm install`(or`yarn install\`) to get any dependencies of that example.
-   `npm run batfish -- start` (or `build` or `serve-static`).

`npm run batfish` is just a shortcut script that examples should include.
You can also use the Batfish CLI directly to run the examples: it lives in `bin/batfish.js`.
You'll need to make sure you either run the command from the example's directory or else use the `--config` argument, so Batfish can find the example's configuration.

Examples:

    # From project root directory
    bin/batfish.js --config examples/initial-experiments/batfish.config.js start

    # From examples/initial-experiments/
    ../../bin/batfish.js build && ../../bin/batfish.js serve-static

## Creating a new example

Create a new directory in `examples/`.
Add the following `package.json`:

```json
{
  "private": true,
  "scripts": {
    "batfish": "../../bin/example-batfish"
  },
  "dependencies": {}
}
```

Install dependencies as needed.

Create a configuration file and some pages ... and go from there!
