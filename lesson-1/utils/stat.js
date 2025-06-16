import { AppError, ErrorCodes } from './errors.js';

const progressByFrequencyParsers = {
  daily: (doneCount) => {
    const hasCompletedToday = doneCount > 0;

    return hasCompletedToday ? 100 : 0;
  },
  weekly: (doneCount) => Math.min((doneCount / 7) * 100, 100),
  monthly: (doneCount) => {
    const daysInMonth = new Date().getDate();
    return Math.min((doneCount / daysInMonth) * 100, 100);
  },
};

function calculateHabitProgress(habit) {
  const { freq, doneMarks } = habit;

  const progressParser = progressByFrequencyParsers[freq];

  if (!progressParser) {
    throw new AppError({
      error: new Error(`Unsupported frequency: ${freq}`),
      code: ErrorCodes.VALIDATION_ERROR,
    });
  }

  const progress = progressParser(doneMarks.length);

  return Number(progress.toFixed(2));
};

export {
  calculateHabitProgress,
};
