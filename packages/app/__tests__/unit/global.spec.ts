import {get, startJection, getGlobalJection} from '../helper';
import {Storage} from '../helper/Storage';

describe('Global jection scope', () => {
  it('basic', () => {
    expect(() => getGlobalJection()).toThrow('Jection not start before!');

    const jection = startJection();
    jection.modules([
      jm => {
        jm.single(Storage, [9]);
      },
      jm => {
        jm.single(Storage, [8]);
      }
    ]);

    const x = get(Storage).get(7);

    expect(x.storage).toBe(8);
    expect(x.local).toBe(7);
  });

  it('two start', () => {
    expect(() => startJection()).toThrow('Jection before start!');
  });
});
