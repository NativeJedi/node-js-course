const ErrorCodes = {
  READ_HABITS_ERROR: 'READ_HABITS_ERROR',
  WRITE_HABITS_ERROR: 'WRITE_HABITS_ERROR',
  DELETE_HABITS_ERROR: 'DELETE_HABITS_ERROR',
  UPDATE_HABITS_ERROR: 'UPDATE_HABITS_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  UNKNOWN_COMMAND: 'UNKNOWN_COMMAND',
};

class AppError extends Error {
  constructor({
    error,
    code = ErrorCodes.UNKNOWN_ERROR,
  }) {
    super(error?.message ?? error ?? 'Unknown error');

    this.name = 'AppError';
    this.code = code;
  }
}

export {
  AppError,
  ErrorCodes,
};
