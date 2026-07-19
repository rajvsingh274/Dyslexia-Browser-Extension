export const dictionary = {
  "utilize": "use",
  "approximately": "about",
  "assistance": "help",
  "commence": "start",
  "terminate": "end",
  "individual": "person",
  "purchase": "buy"
};

export function dictionarySimplify(text) {
  return text
    .split(" ")
    .map(word => {
      const clean = word.toLowerCase().replace(/[^a-z]/g, "");
      return dictionary[clean] || word;
    })
    .join(" ");
}
