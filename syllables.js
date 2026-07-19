export function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, "");

  if (word.length <= 3) return 1;

  const matches = word.match(/[aeiouy]{1,2}/g);

  return matches ? matches.length : 1;
}

