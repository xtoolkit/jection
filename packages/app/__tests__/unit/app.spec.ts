import {JectionApplication} from '../helper';

describe('other JectionApplication', () => {
  it('basic', () => {
    const jection = new JectionApplication({id: 'foo'});

    expect(jection.container.scoped.id).toBe('foo');
  });
});
