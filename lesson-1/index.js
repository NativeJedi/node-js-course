import { habitRouter } from './router/habit.router.js';
import { validateEnum } from './utils/validate.js';
import { parseArgs } from './utils/args.js';

const allowedCommands = ['add', 'list', 'update', 'delete', 'done', 'stats'];

const main = async () => {
  const [,, command, ...args] = process.argv;

  validateEnum(command, allowedCommands, { message: `Invalid command. Use ${allowedCommands.join(', ')}` });

  const params = await parseArgs(args);

  await habitRouter(command, params);
};

main().catch((error) => {
  console.error(error?.message || 'An unexpected error occurred.');
  process.exit(1);
});
