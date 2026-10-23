import { Constructor } from '../types/utils';
import { Registry } from './Registry';

export function Injectable() {
  return (target: Constructor<any>) => {
    Registry.getInstance().register(target);
  };
}
