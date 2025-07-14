class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

class RouteNotFoundError extends AppError {
  constructor(route) {
    super(`Not found: ${route}`, 404);
  }
}

export { AppError, RouteNotFoundError };
