export const isWordInArrayInString = (arr, str) => {
  const words = str.split(' ');
  for (let word of words) {
    if (arr.includes(word)) {
      return true;
    }
  }
  return false;
};
