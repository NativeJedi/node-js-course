import { addHabit, loadAllHabits, deleteHabit, updateHabit, markAsDone, getStats } from '../services/habit.service.js';

async function add({ name, freq }) {
  const addedHabit = await addHabit({ name, freq});

  console.log('Habit is added:', addedHabit);
}

async function list() {
  const habits = await loadAllHabits();

  if (!habits.length) {
    console.log('Habits list is empty. Use add --name "habit text" --freq "daily|weekly|monthly" to add a habit');
    return;
  }

  console.table(habits);
}

async function remove({ id }) {
  const deletedHabit = await deleteHabit({ id });

  if (!deletedHabit) {
    console.error('Habit with such id is not exists:', id);
    return;
  }

  console.log('Habit is removed:', deletedHabit);
}

async function update({ id, name, freq }) {
  const updatedHabit = await updateHabit({ id, name, freq });

  if (!updatedHabit) {
    console.error('Habit with such id is not exists:', id);
    return;
  }

  console.log('Habit is updated:', updatedHabit);
}

async function done({ id }) {
  const markedHabit = await markAsDone({ id });

  if (!markedHabit) {
    console.error('Habit with such id is not exists:', id);
    return;
  }

  console.log('Habit is done:', markedHabit);
}

async function stats () {
  const stats = await getStats();

  console.table(stats);
}

export { add, list, remove, update, done, stats };
