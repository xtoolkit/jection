import type {Class, DesignPatern, JectionModule} from './utils';
import type {Instance} from './model/Instance';
import type {Register} from './model/Register';
import type {Scope} from './model/Scope';

type RegisterOptions = Partial<Pick<Register, 'bind' | 'createAtStart'>>;

export class Container {
  constructor(
    public readonly scoped: Scope,
    private readonly scopes: Scope[] = [],
    private readonly registers: Register[] = [],
    private readonly instances: Instance[] = []
  ) {}

  private register<T extends Class>(
    designPatern: DesignPatern,
    ctor: T,
    dependencies: any[] = [],
    options: RegisterOptions = {}
  ) {
    const register: Register = {
      ctor,
      scopeId: this.scoped.id,
      bind: options.bind || [],
      dependencies,
      designPatern,
      createAtStart: options.createAtStart || false
    };

    const registerIndex = this.registers.findIndex(
      item => item.ctor === ctor && item.scopeId === this.scoped.id
    );
    if (registerIndex < 0) this.registers.push(register);
    else this.registers[registerIndex] = register;
  }

  single<T extends Class>(
    ctor: T,
    dependencies?: any[],
    options?: RegisterOptions
  ) {
    this.register('singleton', ctor, dependencies, options);
  }

  factory<T extends Class>(
    ctor: T,
    dependencies?: any[],
    options?: RegisterOptions
  ) {
    this.register('factory', ctor, dependencies, options);
  }

  scope(id: Scope['id'], jectionModule: JectionModule) {
    const scope: Scope = {
      id,
      parent: this.scoped
    };

    this.scopes.push(scope);

    jectionModule(
      new Container(scope, this.scopes, this.registers, this.instances)
    );
  }

  private getRegister<T extends Class>(
    ctor: T,
    scopeId: Scope['id']
  ): Register<T> {
    const register = this.registers.find(
      item =>
        item.scopeId === scopeId &&
        (item.ctor === ctor || item.bind.includes(ctor))
    );

    if (!register) {
      const scope = this.scopes.find(item => item.id === scopeId);
      if (scope && scope.parent) return this.getRegister(ctor, scope.parent.id);
      throw new Error(ctor.name + ' Register not found');
    }

    return register as Register<T>;
  }

  get<T extends Class>(ctor: T, scopeId?: Scope['id']): InstanceType<T> {
    const register = this.getRegister(ctor, scopeId || this.scoped.id);

    if (register.designPatern === 'singleton') {
      const instance = this.instances.find(
        item => item.scopeId === register.scopeId && item.ctor === ctor
      );
      if (instance) return instance.instance;
    }

    const dependencies = register.dependencies.map((item: any) => {
      if (typeof item === 'function') {
        try {
          const dependencyRegister = this.getRegister(item, register.scopeId);
          return this.get(dependencyRegister.ctor, dependencyRegister.scopeId);
        } catch (error) {}
      }
      return item;
    });
    const instance = new register.ctor(...dependencies);

    this.instances.push({
      ctor: register.ctor,
      scopeId: register.scopeId,
      instance
    });

    return instance;
  }

  end(scopeId?: Scope['id']) {
    const scoped = scopeId || this.scoped.id;
    const scope = this.scopes.find(item => item.id === scoped);

    if (!scope) return;

    this.instances
      .filter(item => item.scopeId === scope.id || item.ctor === scope.id)
      .forEach(({instance}) => {
        this.instances.splice(
          this.instances.findIndex(item => item.instance === instance),
          1
        );
      });

    this.scopes
      .filter(item => item.parent?.id === scope.id)
      .forEach(child => this.end(child.id));
  }
}
