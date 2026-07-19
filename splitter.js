export function splitSentences(text) {
  return text
    .replace(/,/g, ".")
    .replace(/ and /gi, ". ")
    .replace(/ but /gi, ". ");
}
