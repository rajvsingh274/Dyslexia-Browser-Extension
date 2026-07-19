import { countSyllables } from "./syllables.js";

export function calculateMetrics(text) {

  const sentences = text
    .split(/[.!?]+/)
    .filter(s => s.trim().length > 0);

  const words = text.match(/\b\w+\b/g) || [];

  let syllables = 0;
  let difficult = 0;

  words.forEach(word => {
    const s = countSyllables(word);
    syllables += s;
    if (s > 2) difficult++;
  });

  const ASL = words.length / sentences.length || 0;
  const ASW = syllables / words.length || 0;
  const PDW = (difficult / words.length) * 100 || 0;

  return { ASL, ASW, PDW };
}
