// Like all other declarations in this directory for 3rd-party modules,
// these are NOT comprehensive definitions. They define the shapes
// *that we use*. If we need to use another possible shape, we can verify
// against the documentation and adjust the definition accordingly.
//
// Essentially, these definitions are a way of double-checking the
// Webpack configuration properties we're using.

declare type webpack$Stats = {
  hash: string,
  hasErrors(): boolean,
  toJson(): JsonValue,
  endTime: number,
  startTime: number
};

declare type webpack$Condition =
  | string
  | RegExp
  | (() => boolean)
  | Array<webpack$Condition>
  | {
      test?: webpack$Condition,
      include?: webpack$Condition,
      exclude?: webpack$Condition,
      exclude?: webpack$Condition,
      and?: webpack$Condition,
      or?: webpack$Condition,
      not?: webpack$Condition
    };

declare type webpack$Compiler = {
  run: (callback: (Error, webpack$Stats) => mixed) => void,
  watch: (Object, callback: (Error, webpack$Stats) => mixed) => void
};

declare type webpack$Rule = {
  test?: webpack$Condition,
  include?: webpack$Condition,
  exclude?: webpack$Condition,
  loader?: string,
  options?: Object,
  use?: string | Array<{ loader: string, options?: Object }>
};

declare type webpack$Configuration = {|
  mode?: string,
  entry?: {
    [id: string]: string | Array<string>
  },
  output?: {|
    path?: string,
    publicPath?: string,
    pathinfo?: boolean,
    filename?: string,
    chunkFilename?: string,
    libraryTarget?: string
  |},
  externals?: {
    [id: string]: string
  },
  resolveLoader?: {|
    alias: { [id: string]: string },
    modules?: Array<string>
  |},
  resolve?: {|
    alias?: {
      [id: string]: string
    }
  |},
  module?: {|
    rules?: Array<webpack$Rule>
  |},
  plugins?: Array<Object>,
  devtool?: string | false,
  target?: 'node' | 'web',
  node?: { [feature: string]: boolean | 'mock' | 'empty' },
  performance?: {|
    hints?: 'warning' | false
  |},
  bail?: boolean,
  cache?: boolean
|};

declare module 'webpack' {
  declare module.exports: webpack$Configuration => webpack$Compiler;
}
