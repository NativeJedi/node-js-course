import { ClassType } from '../types';
import { container } from '../container';

export function Injectable() {
  return function (target: ClassType) {
    container.register(target);
  };
}
