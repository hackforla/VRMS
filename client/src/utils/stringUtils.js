export const isAnySubstring = (arr, str) => {
  for (let word of arr) {
    if (str.toLowerCase().includes(word.toLowerCase())) {
      return true;
    }
  }
  return false;
};
