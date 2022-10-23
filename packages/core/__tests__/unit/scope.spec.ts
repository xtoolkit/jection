import {LocalUserDs} from '../helper/ca/local/ds/LocalUserDs';
import {RemoteUserDs} from '../helper/ca/remote/ds/RemoteUserDs';
import {UserRepo} from '../helper/ca/data/repo/UserRepo';
import {createContainer} from '../helper';

function createDeepScope() {
  const ctx = createContainer();
  const {container} = ctx;

  container.single(LocalUserDs);
  container.scope('other', ctx => {
    ctx.factory(LocalUserDs, [], {
      bind: [RemoteUserDs]
    });
  });
  container.scope('service', _ => {});
  container.scope(UserRepo, ctx => {
    ctx.single(RemoteUserDs);
  });

  return ctx;
}

describe('scopes test', () => {
  it('get scope instance', () => {
    const {container} = createDeepScope();

    const globalIns = container.get(LocalUserDs);
    const serviceIns = container.get(LocalUserDs, 'service');
    const otherIns = container.get(LocalUserDs, 'other');
    const bindIns = container.get(RemoteUserDs, 'other');
    const userRepoScopeIns = container.get(RemoteUserDs, UserRepo);
    const user = {id: 1, name: 'mehdi'};

    expect(globalIns === serviceIns).toBe(true);
    expect(globalIns === otherIns).toBe(false);
    expect(bindIns.add(user)).toBe('mehdi');
    expect(userRepoScopeIns.add(user)).toBe('RemoteUserDs.add');
  });

  it('end scope', () => {
    const {container, instances} = createDeepScope();

    const globalIns = container.get(LocalUserDs);
    const serviceIns = container.get(LocalUserDs, 'service');
    const otherIns = container.get(LocalUserDs, 'other');
    const bindIns = container.get(RemoteUserDs, 'other');
    const userRepoScopeIns = container.get(RemoteUserDs, UserRepo);

    const instanceLength = instances.length;
    container.end('main');
    expect(instances.length).toBe(instanceLength);

    container.end(UserRepo);
    expect(instances.some(item => item.instance === userRepoScopeIns)).toBe(
      false
    );

    container.end('other');
    expect(
      instances.some(
        item => item.instance === otherIns || item.instance === bindIns
      )
    ).toBe(false);

    container.end('service');
    expect(instances.some(item => item.instance === serviceIns)).toBe(true);
    expect(globalIns === serviceIns).toBe(true);

    container.end();
    expect(instances.length).toBe(0);
  });
});
