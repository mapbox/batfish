declare class WrappedError extends Error {
  originalError: Error
}

declare class ConfigValidationErrors extends WrappedError {
  validationErrors: Array<string>
}

declare class WebpackCompilationError extends WrappedError {
  stats: webpack$Stats
}
