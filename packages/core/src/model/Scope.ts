import type {Class} from '../utils';

export interface Scope<T extends Class = Class> {
  id: T | string;
  parent?: Scope;
}
