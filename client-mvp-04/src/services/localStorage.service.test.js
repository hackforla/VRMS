/* eslint-disable no-undef */
import { setItem, getItem, removeItem, clear } from './localStorage.service';

describe('Tests Functions of the localStorage.service.js', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('sets and gets the given object value from the local storage', () => {
    const givenValue = {
      name: 'VRMS',
      location: 'LA',
    };
    setItem('vrms', givenValue);
    expect(getItem('vrms')).toEqual(givenValue);
  });

  it('sets and gets the given string value from the local storage', () => {
    const givenValue = 'This is a demo string value';
    setItem('demo', givenValue);
    expect(getItem('demo')).toEqual(givenValue);
  });

  it('removes item from the local storage', () => {
    const givenValue = 'This is a demo string value';
    setItem('demo', givenValue);
    expect(getItem('demo')).toEqual(givenValue);
    removeItem('demo');
    expect(getItem('demo')).toEqual(null);
  });

  it('clears all items from the local storage', () => {
    const stringValue = 'Hello World!';
    const objectValue = {
      type: 'Alien',
      currentLocation: 'Earth',
    };
    setItem('string', stringValue);
    setItem('object', objectValue);
    expect(getItem('string')).toEqual(stringValue);
    expect(getItem('object')).toEqual(objectValue);
    clear();
    expect(getItem('string')).toEqual(null);
    expect(getItem('object')).toEqual(null);
  });
});
