import {LocalUserDs} from '../helper/ca/local/ds/LocalUserDs';
import {createContainer} from '../helper';

describe('registers test', () => {
  it('basic', () => {
    const {container, registers} = createContainer();

    container.single(LocalUserDs);

    expect(registers[0].ctor).toBe(LocalUserDs);
  });

  it('overwrite in current scope', () => {
    const {container, registers} = createContainer();

    container.single(LocalUserDs);
    container.single(LocalUserDs);

    expect(registers[0].ctor).toBe(LocalUserDs);
    expect(registers.length).toBe(1);
  });

  it('register one ctor in tow scope', () => {
    const {container, registers} = createContainer();

    container.single(LocalUserDs);
    container.scope('other', ctx => {
      ctx.factory(LocalUserDs);
    });

    expect(registers[0].ctor).toBe(LocalUserDs);
    expect(registers[0].scopeId).toBe(container.scoped.id);
    expect(registers[1].ctor).toBe(LocalUserDs);
    expect(registers[1].scopeId).toBe('other');
    expect(registers.length).toBe(2);
  });
});
