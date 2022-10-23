import {LocalUserDs} from '../helper/ca/local/ds/LocalUserDs';
import {Container} from '../helper';

describe('Container test', () => {
  it('Test new container', () => {
    const newContainer = new Container({id: 'global'});

    newContainer.single(LocalUserDs);

    expect(newContainer.get(LocalUserDs).add({id: 1, name: 'mehdi'})).toBe(
      'mehdi'
    );
  });
});
