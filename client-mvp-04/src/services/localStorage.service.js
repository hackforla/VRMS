/**
 * Sets value in the local storage.
 * @param {string} key - A string specifying the name of the key you want to set the value of.
 * @param {object | string} value - An object or a string specifying the value of the key.
 */
export function setItem(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

/**
 * Gets value from the local storage
 * @param {string} key A string specifying the name of the key you want to get the value of.
 * @return {object | string} Value of the key. Return type depends on the given value type.
 */
// eslint-disable-next-line consistent-return
export function getItem(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

/**
 * Removes an item by key from the local storage.
 * @param {string} key - A string specifying the name of the key you want to delete.
 */
export function removeItem(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

/**
 * Clears all items from the local storage for the domain.
 */
export function clear() {
  try {
    window.localStorage.clear();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}
