import type {Class, DesignPatern} from '../utils';
import type {Scope} from './Scope';

export interface Register<T extends Class = Class> {
  ctor: T;
  scopeId: Scope['id'];
  bind: Class[];
  dependencies: any[];
  designPatern: DesignPatern;
  createAtStart: boolean;
}
