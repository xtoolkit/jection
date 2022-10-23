import type {Scope} from '../../src/model/Scope';
import type {Register} from '../../src/model/Register';
import type {Instance} from '../../src/model/Instance';
import {Container} from '../../src';

export type {Scope, Register, Instance};
export {Container};

export function createContainer(
  scoped: Scope = {id: 'global'},
  scopes: Scope[] = [],
  registers: Register[] = [],
  instances: Instance[] = []
) {
  scopes.push(scoped);
  const container = new Container(scoped, scopes, registers, instances);

  return {
    container,
    scopes,
    registers,
    instances
  };
}
