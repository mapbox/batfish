// All of these types are only partial, capturing the aspects of the module's
// API that are used in this codebase.

declare module 'pify' {
  declare module.exports: Function => (...Array<*>) => Promise<*>;
}

declare module 'p-try' {
  declare module.exports: <R>(fn: () => Promise<R> | R) => Promise<R>;
}

declare module 'mkdirp' {
  declare module.exports: {
    (string, (error: ?Error) => void): void,
    sync(string): void
  };
}

declare module 'globby' {
  declare module.exports: (
    patterns?: string | Array<string>,
    options?: {}
  ) => Promise<Array<string>>;
}

declare module 'del' {
  declare module.exports: {
    (
      patterns: string | Array<string>,
      options?: Object
    ): Promise<Array<string>>,
    sync(patterns: string | Array<string>, options?: Object): void
  };
}

declare module 'cpy' {
  declare module.exports: (
    files?: string | Array<string>,
    destination?: string,
    options?: {
      cwd?: string,
      parents?: boolean,
      rename?: string | (string => string)
    }
  ) => Promise<void>;
}

declare module 'is-glob' {
  declare module.exports: string => boolean;
}

declare module 'is-absolute-url' {
  declare module.exports: string => boolean;
}

declare module 'indefinite' {
  declare module.exports: string => string;
}

declare module 'micromatch' {
  declare module.exports: {
    (
      string | Array<string>,
      string | Array<string>,
      options?: Object
    ): Array<string>,
    any(string, string | Array<string>): boolean
  };
}

declare module 'gray-matter' {
  declare module.exports: {
    (
      string,
      { delims: [string, string] }
    ): {
      data: { [string]: JsonValue },
      content: string
    }
  };
}

declare module 'worker-farm' {
  declare module.exports: {
    (string): Function,
    end: Function
  };
}

declare module 'get-port' {
  declare module.exports: {
    (number): Promise<number>
  };
}

declare module 'webpack-merge' {
  declare module.exports: {
    (webpack$Configuration, webpack$Configuration): webpack$Configuration
  };
}

declare module 'pretty-error' {
  declare class PrettyError {
    render(Error): string;
  }
  declare module.exports: Class<PrettyError>;
}

declare module 'resolve-from' {
  declare module.exports: (string, string) => string;
}

declare module 'sitemap-static' {
  declare module.exports: {
    (stream$Writable, options?: Object): void
  };
}

declare module 'prettier' {
  declare module.exports: {
    format(string): string
  };
}

declare module 'slugg' {
  declare module.exports: string => string;
}

declare module 'time-stamp' {
  declare module.exports: string => string;
}

declare module '@mapbox/scroll-restorer' {
  declare module.exports: {
    start(?Object): void,
    end(): void,
    getSavedScroll(): Object,
    restoreScroll(state?: Object, attemps?: number): void
  };
}

declare module '@mapbox/link-hijacker' {
  declare module.exports: {
    hijack(optionsOrHandler?: Object | Function, handler?: Function): void
  };
}

declare module 'react-helmet' {
  declare type Props = {};

  declare type Attribute = {
    toString(): string,
    toComponent(): React$Element<*>
  };

  declare type Instance = {
    base: Attribute,
    bodyAttributes: Attribute,
    htmlAttributes: Attribute,
    link: Attribute,
    meta: Attribute,
    noscript: Attribute,
    script: Attribute,
    style: Attribute,
    title: Attribute
  };

  declare class Helmet extends React$Component<Props> {
    rewind(): Instance;
  }

  declare export default Helmet;
}
