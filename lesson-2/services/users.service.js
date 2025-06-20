import { getFullFilePath, readFileData, writeFileData } from '../utils/path.js';
import { validateUser, validateUserId, validateUsers, ValidationError } from '../utils/validators.js';

const DBPath = getFullFilePath('../database.json');

const read = () => readFileData(DBPath);
const write = (data) => writeFileData(DBPath, data);

const getUsers = async () => {
  const { users } = await read();

  return users || [];
};

const addUsers = async (users) => {
  validateUsers(users);

  const data = await read();

  await write({
    ...data,
    users: [...data.users, ...users],
  });

  return users;
};

const replaceUsers = async (users) => {
  validateUsers(users);

  const data = await read();

  await write({
    ...data,
    users,
  });

  return users;
};

const deleteUsers = async () => {
  const data = await read();

  await write({
    ...data,
    users: [],
  });

  return [];
};

const getUsersById = async (id) => {
  validateUserId(id);

  const users = await getUsers();

  const user = users.find((u) => u.id === id);

  if (!user) {
    throw new ValidationError(`User with id ${id} not found`);
  }

  return user;
};

const replaceUserById = async (id, user) => {
  validateUserId(id);

  const users = await getUsers();

  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    throw new ValidationError(`User with id ${id} not found`);
  }

  users[userIndex] = {
    ...user,
    id,
  };

  await replaceUsers(users);

  return user;
};

const addUserById = async (id, user) => {
  validateUserId(id);

  const newUser = { ...user, id };

  validateUser(newUser);

  const users = await getUsers();

  users.push(newUser);

  await replaceUsers(users);

  return newUser;
};

const updateUserFieldsById = async (id, updatedFields) => {
  validateUserId(id);

  const users = await getUsers();

  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    throw new ValidationError(`User with id ${id} not found`);
  }

  const updatedUser = {
    ...users[userIndex],
    ...updatedFields,
    id,
  };

  users[userIndex] = updatedUser;

  await replaceUsers(users);

  return updatedUser;
};

const deleteUserById = async (id) => {
  const users = await getUsers();

  let removedUser = null;

  const filteredUsers = users.filter((user) => {
    if (user.id === id) {
      removedUser = user;
      return false;
    }
    return true;
  });

  if (!removedUser) {
    throw new ValidationError(`User with id ${id} not found`);
  }

  await replaceUsers(filteredUsers);

  return removedUser;
};

export {
  getUsers,
  addUsers,
  replaceUsers,
  deleteUsers,
  getUsersById,
  replaceUserById,
  updateUserFieldsById,
  deleteUserById,
  addUserById,
};
