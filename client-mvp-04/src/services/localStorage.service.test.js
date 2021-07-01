/* eslint-disable no-undef */
import { setItem, getItem, removeItem, clear } from './localStorage.service';

describe('Tests Functions of the localStorage.service.js', () => {
  it('sets and gets the given value from the local storage', () => {
    const givenValue = 'this is a demo value';
    setItem('demo', givenValue);
    expect(getItem('demo')).toEqual(givenValue);
  });
  it('removes the item from the local storage', () => {
    removeItem('demo');
    expect(getItem('demo')).toEqual(null);
  });
  it('clears all items from the local storage', () => {
    setItem('one', '1');
    setItem('two', '2');
    setItem('three', '3');
    expect(getItem('one')).toEqual('1');
    expect(getItem('two')).toEqual('2');
    expect(getItem('three')).toEqual('3');
    clear();
    expect(getItem('one')).toEqual(null);
    expect(getItem('two')).toEqual(null);
    expect(getItem('three')).toEqual(null);
  });
});
