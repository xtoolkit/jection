import {JectionApplication} from './JectionApplication';
import type {Class} from '@jection/core';

let globalJectionApplication: JectionApplication | undefined;

export function startJection() {
  if (globalJectionApplication) {
    throw new Error('Jection before start!');
  }

  globalJectionApplication = new JectionApplication({id: 'global'});

  return globalJectionApplication;
}

export function getGlobalJection() {
  if (!globalJectionApplication) {
    throw new Error('Jection not start before!');
  }

  return globalJectionApplication;
}

export function get<T extends Class>(ctor: T): InstanceType<T> {
  return getGlobalJection().container.get(ctor);
}
