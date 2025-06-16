import { ErrorCodes } from './errors.js';

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.code = ErrorCodes.VALIDATION_ERROR;
    this.name = 'ValidationError';
  }
}

const validateString = (value, {
  isRequired = true,
  message = 'Invalid string value',
} = {}) => {
  if (typeof value !== 'string') {
    throw new ValidationError(message);
  }

  if (isRequired && value.trim() === '') {
    throw new ValidationError(message);
  }
};

const validateEnum = (value, allowedValues, { message } = {}) => {
  if (!allowedValues.includes(value)) {
    throw new ValidationError(message || `Value must be one of: ${allowedValues.join(', ')}`);
  }
};

export {
  validateString,
  validateEnum,
};
