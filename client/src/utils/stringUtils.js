export const isWordInArrayInString = (arr, str) => {
  const words = str.split(' ');
  let foundWords = []
  for (let word of words) {
    if (arr.includes(word)) {
      foundWords.push(word)
    }
  }
  if(foundWords.length > 0) {
    return foundWords
  }
  return false;
};
