import { Inject } from './inject';

const CONFIG_TOKEN = 'CONFIG_TOKEN';

function Config() {
  return Inject(CONFIG_TOKEN);
}

export { CONFIG_TOKEN, Config };
