import { add, list, update, remove, done, stats } from '../controllers/habit.controller.js';

const commandHandlers = {
  add,
  list,
  update,
  done,
  delete: remove,
  stats,
};

const habitRouter = async (command, args) => {
  const handler = commandHandlers[command];

  if (handler) {
    await handler(args);
  }
};

export { habitRouter };
