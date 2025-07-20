import { v4 as uuidv4 } from 'uuid';

const generateUniqueId = (): string => uuidv4();

export { generateUniqueId };
