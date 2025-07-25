import { UsersRepository } from './repositories/users.repository';

const users = new UsersRepository();

const runDemo = async () => {
  const createdUser = await users.createUser({ name: 'Ukrlan', age: 60 });

  console.log('save(): ', createdUser);

  const searchedUser = await users.getUserById(createdUser.id);

  console.log('findById(): ', searchedUser);

  const updatedUser = await users.updateUserById(searchedUser.id, { age: 5 });

  console.log('update(): ', updatedUser);

  const searchedWithFilters = await users.findUsersWithFields({
    name: 'Ukrlan',
    age: 5,
  });

  console.log('find(filters): ', searchedWithFilters);

  await users.deleteUserById(updatedUser.id);

  console.log('delete(): ', updatedUser);
};

runDemo();
