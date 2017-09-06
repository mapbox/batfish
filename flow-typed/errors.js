declare class WrappedError extends Error {
  originalError: Error
}

declare class ConfigValidationError extends WrappedError {
  messages?: Array<string>
}

declare class WebpackCompilationError extends WrappedError {
  stats: webpack$Stats
}
