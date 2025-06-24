import { getAll, create, deleteById, updateById, addDoneMark } from '../models/habit.model.js';
import { ErrorCodes, AppError } from '../utils/errors.js';
import { validateEnum, validateString } from '../utils/validate.js';
import { calculateHabitProgress } from '../utils/stat.js';

const validateFrequency = (freq) => validateEnum(freq, ['daily', 'weekly', 'monthly'], { message: 'Invalid --freq parameter. Use "daily", "weekly", or "monthly".' });
const validateName = (name) => validateString(name, { isRequired: true, message: 'Invalid --name parameter. It must be a non-empty string.' });
const validateId = (id) => validateString(id, { isRequired: true, message: 'Invalid --id parameter. It must be a non-empty string.' });

const removeOptionalEmptyParams = (params, optionalFields) => {
  return Object.entries(params).reduce((acc, [name, value]) => {
    if (optionalFields.includes(name) && value == undefined) {
      return acc;
    }

    return {
      ...acc,
      [name]: value,
    };
  }, {});
};

const paramsValidators = {
  name: validateName,
  freq: validateFrequency,
  id: validateId,
};

const validateParameters = (params) => {
  for (const [param, value] of Object.entries(params)) {
    const validator = paramsValidators[param];

    if (validator) {
      validator(value);
    }
  }
};

const hideHabitFields = (habits, fields) => habits.map((habit) => {
  return Object.entries(habit).reduce((acc, [field, value]) => {
    if (fields.includes(field)) {
      return acc;
    }

    return {
      ...acc,
      [field]: value,
    };
  }, {});
});

async function loadAllHabits() {
  try {
    const habits = await getAll();

    return hideHabitFields(habits, ['doneMarks']);
  } catch (error) {
    throw new AppError({
      error,
      code: ErrorCodes.READ_HABITS_ERROR,
    });
  }
}

async function addHabit({ name, freq }) {
  validateParameters({ name, freq });

  try {
    const habit = await create({
      name,
      freq,
    });

    return habit;
  } catch (error) {
    throw new AppError({
      error,
      code: ErrorCodes.WRITE_HABITS_ERROR,
    });
  }
}

async function deleteHabit({ id }) {
  validateParameters({ id });

  try {
    const removedHabit = await deleteById(id);

    return removedHabit;
  } catch (error) {
    throw new AppError({
      error,
      code: ErrorCodes.DELETE_HABITS_ERROR,
    });
  }
}

async function updateHabit({ id, name, freq }) {
  const params = removeOptionalEmptyParams({ id, name, freq }, ['name', 'freq']);

  validateParameters(params);

  try {
    const updatedHabit = await updateById(id, params);

    return updatedHabit;
  } catch (error) {
    throw new AppError({
      error,
      code: ErrorCodes.UPDATE_HABITS_ERROR,
    });
  }
}

async function markAsDone({ id }) {
  validateParameters({ id });

  try {
    const updatedHabit = await addDoneMark(id);

    return updatedHabit;
  } catch (error) {
    throw new AppError({
      error,
      code: ErrorCodes.UPDATE_HABITS_ERROR,
    });
  }
}

async function getStats() {
  try {
    const habits = await getAll();

    return habits.reduce((acc, habit) => {
      return {
        ...acc,
        [habit.id]: {
          name: habit.name,
          frequency: habit.freq,
          progress: `${calculateHabitProgress(habit)}%`,
        },
      };
    }, []);
  } catch (error) {
    throw new AppError({
      error,
      code: ErrorCodes.READ_HABITS_ERROR,
    });
  }
}

export {
  loadAllHabits,
  addHabit,
  deleteHabit,
  updateHabit,
  markAsDone,
  getStats,
};
