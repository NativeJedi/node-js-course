import { AppError } from './errors.js';

const STAT_DAYS = 30;
const dayMilliSeconds = 24 * 60 * 60 * 1000;

function parseDate(dateStr) {
  return new Date(dateStr);
}

const getNowDate = () => {
  const offset = Number(process.env.DAY_OFFSET || 0);

  const now = Date.now() + offset * dayMilliSeconds;
  return new Date(now);
};

function getLast30DaysDates() {
  const now = getNowDate();
  const dates = [];

  for (let i = 0; i < STAT_DAYS; i++) {
    const d = new Date(now.getTime() - i * dayMilliSeconds);
    dates.push(d);
  }

  return dates;
}

function getWeekKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const oneJan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil((((d - oneJan) / dayMilliSeconds) + oneJan.getDay() + 1) / 7);
  return `${year}-W${week}`;
}

function getMonthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
}

function formatDate(date) {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

function calculateDailyProgress(doneMarks) {
  const recentDates = getLast30DaysDates().map(formatDate);

  const doneDays = new Set(
    doneMarks
      .map(m => formatDate(parseDate(m.date)))
      .filter(date => recentDates.includes(date))
  );

  return doneDays.size / STAT_DAYS;
}

function calculateWeeklyProgress(doneMarks) {
  const recentDates = getLast30DaysDates();
  const recentWeeks = new Set(recentDates.map(getWeekKey));

  const doneWeeks = new Set(
    doneMarks
      .map(m => getWeekKey(parseDate(m.date)))
      .filter(weekKey => recentWeeks.has(weekKey))
  );

  const totalWeeks = recentWeeks.size;

  return doneWeeks.size / totalWeeks;
}

function calculateMonthlyProgress(doneMarks) {
  const recentDates = getLast30DaysDates();
  const recentMonths = new Set(recentDates.map(getMonthKey));

  const doneMonths = new Set(
    doneMarks
      .map(m => getMonthKey(parseDate(m.date)))
      .filter(monthKey => recentMonths.has(monthKey))
  );

  const totalMonths = recentMonths.size;

  return doneMonths.size / totalMonths;
}

const PROGRESS_BY_FREQUENCY = {
  daily: calculateDailyProgress,
  weekly: calculateWeeklyProgress,
  monthly: calculateMonthlyProgress,
};

function calculateHabitProgress(habit) {
  const { freq, doneMarks } = habit;

  const progressParser = PROGRESS_BY_FREQUENCY[freq];

  if (!progressParser) {
    throw new AppError({
      error: new Error(`Unsupported frequency: ${freq}`),
    });
  }

  const progress = progressParser(doneMarks);

  return Math.round(progress * 100);
}

export {
  calculateHabitProgress,
};
