import { AppError } from './error.js';

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

const checkEmptyString = (value, fieldName) => {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ValidationError(`Invalid ${fieldName}: ${value}`);
  }
};

const validateUserId = (userId) => checkEmptyString(userId, 'user.id');

const validateUserName = (userName) => checkEmptyString(userName, 'user.name');

const validateUser = (user) => {
  if (
    typeof user !== 'object' ||
    user === null
  ) {
    throw new ValidationError(`Invalid user object: ${JSON.stringify(user)}`);
  }

  validateUserName(user.name);
  validateUserId(user.id);
};

const validateUsers = (users) => {
  if (!Array.isArray(users)) {
    throw new ValidationError('Users should be an array');
  }

  users.forEach((user) => validateUser(user));
};

export {
  ValidationError,
  validateUserId,
  validateUser,
  validateUsers,
};
