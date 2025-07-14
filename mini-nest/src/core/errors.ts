class HttpError {
  name = 'HttpError';
  status: number;
  message: string;

  constructor(status = 500, message = 'Internal Server Error') {
    this.status = status;
    this.message = message;
  }
}

class BadRequestError extends HttpError {
  constructor(message: string) {
    super(400, message);
  }
}

class ValidationError extends BadRequestError {
  data: object;

  constructor(data: object) {
    super('Validation failed');
    this.data = data;
  }
}

class NotFoundError extends HttpError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

export { HttpError, BadRequestError, ValidationError, NotFoundError };
