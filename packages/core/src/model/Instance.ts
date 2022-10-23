import type {Class} from '../utils';
import type {Scope} from './Scope';

export interface Instance<T extends Class = Class> {
  ctor: T;
  scopeId: Scope['id'];
  instance: InstanceType<T>;
}
