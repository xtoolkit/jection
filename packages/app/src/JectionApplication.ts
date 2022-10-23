import {Container} from '@jection/core';
import type {JectionModule} from '@jection/core';

export class JectionApplication {
  container: Container;

  constructor(scope: Container['scoped']) {
    this.container = new Container(scope);
  }

  module(jectionModule: JectionModule) {
    jectionModule(this.container);
  }

  modules(jectionModules: JectionModule[]) {
    jectionModules.forEach(item => this.module(item));
  }
}
