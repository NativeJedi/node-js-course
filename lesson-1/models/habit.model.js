import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const getFullFilePath = (filePath) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return join(__dirname, filePath);
};

const DBpath = getFullFilePath('../database.json');

const readDB = () => readFile(DBpath, 'utf-8').then(JSON.parse);

const writeDB = (data) => writeFile(DBpath, JSON.stringify(data, null, 2));

const createId = () => Date.now().toString();

function getAll() {
  return readDB();
}

async function getById(id) {
  const allHabits = await getAll();

  return allHabits.find(habit => habit.id === id);
}

async function create(habit) {
  const allHabits = await getAll();

  const newHabit = {
    ...habit,
    id: createId(),
    doneMarks: [],
  };

  await writeDB([...allHabits, newHabit]);

  return newHabit;
}

async function updateById(id, updatedFields) {
  const allHabits = await getAll();

  const habitIndex = allHabits.findIndex(habit => habit.id === id);

  if (habitIndex === -1) {
    return null;
  }

  const updatedHabit = {
    ...allHabits[habitIndex],
    ...updatedFields,
  };

  allHabits[habitIndex] = updatedHabit;

  await writeDB(allHabits);

  return updatedHabit;
}

async function deleteById(id) {
  const allHabits = await getAll();

  let removedHabit = null;

  const filteredHabits = allHabits.filter(habit => {
    if (habit.id === id) {
      removedHabit = habit;
      return false;
    }

    return true;
  });

  await writeDB(filteredHabits);

  return removedHabit;
}

async function addDoneMark(id) {
  const habit = await getById(id);

  if (!habit) {
    return null;
  }

  const doneMark = {
    date: new Date().toISOString(),
    id: createId(),
  };

  const updatedHabit = await updateById(id, {
    doneMarks: [...habit.doneMarks, doneMark],
  });

  return updatedHabit;
}

export { getAll, getById, create, updateById, deleteById, addDoneMark };
