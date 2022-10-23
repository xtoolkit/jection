import {LocalUserDs} from '../helper/ca/local/ds/LocalUserDs';
import {RemoteUserDs} from '../helper/ca/remote/ds/RemoteUserDs';
import {UserRepo} from '../helper/ca/data/repo/UserRepo';
import {createContainer} from '../helper';

describe('instance test', () => {
  it('basic', () => {
    const {container} = createContainer();

    container.single(LocalUserDs);

    const ins = container.get(LocalUserDs);

    expect(ins).toBeInstanceOf(LocalUserDs);
  });

  it('wrong instance', () => {
    const {container} = createContainer();

    container.single(LocalUserDs);

    expect(() => container.get(RemoteUserDs)).toThrow(
      'RemoteUserDs Register not found'
    );
  });

  it('singleton instance', () => {
    const {container, instances} = createContainer();

    container.single(LocalUserDs);

    const ins1 = container.get(LocalUserDs);
    const ins2 = container.get(LocalUserDs);

    expect(ins1).toBeInstanceOf(LocalUserDs);
    expect(ins2).toBeInstanceOf(LocalUserDs);
    expect(ins1 === ins2).toBe(true);
    expect(instances.length).toBe(1);
  });

  it('factory instance', () => {
    const {container, instances} = createContainer();

    container.factory(LocalUserDs);

    const ins1 = container.get(LocalUserDs);
    const ins2 = container.get(LocalUserDs);

    expect(ins1).toBeInstanceOf(LocalUserDs);
    expect(ins2).toBeInstanceOf(LocalUserDs);
    expect(ins1 === ins2).toBe(false);
    expect(instances.length).toBe(2);
  });

  it('bind instance', () => {
    const {container} = createContainer();

    container.single(LocalUserDs, [], {
      bind: [RemoteUserDs]
    });

    const ins = container.get(RemoteUserDs);

    expect(ins).toBeInstanceOf(LocalUserDs);
  });

  it('instance with dependencies', () => {
    const {container} = createContainer();

    container.single(LocalUserDs, [], {
      bind: [RemoteUserDs]
    });
    container.single(UserRepo, [LocalUserDs, RemoteUserDs]);

    const ins = container.get(UserRepo);

    expect(ins).toBeInstanceOf(UserRepo);
  });

  it('instance with multi dependencies type', () => {
    const {container} = createContainer();

    container.single(LocalUserDs);
    container.single(UserRepo, [() => 2, 3]);

    const ins = container.get(UserRepo);

    expect(ins).toBeInstanceOf(UserRepo);
    expect((ins.getLocalUserDs as any)()).toBe(2);
    expect(ins.getRemoteUserDs).toBe(3);
  });
});
