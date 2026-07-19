import { ruleSimplify } from "../models/ruleSimplifier.js";
import { llmSimplify1 } from "../models/llmModel1.js";
import { llmSimplify2 } from "../models/llmModel2.js";

import { readability } from "../metrics/readability.js";
import { calculateScore } from "../metrics/score.js";

export async function chooseBest(text, weights) {

  const outputs = [];

  // Model 1
  const r1 = ruleSimplify(text);
  const m1 = readability(r1);
  const s1 = calculateScore(m1, weights);
  outputs.push({ model: "rule", text: r1, score: s1 });

  // Model 2
  const r2 = llmSimplify1(text);
  const m2 = readability(r2);
  const s2 = calculateScore(m2, weights);
  outputs.push({ model: "llama3", text: r2, score: s2 });

  // Model 3
  const r3 = llmSimplify2(text);
  const m3 = readability(r3);
  const s3 = calculateScore(m3, weights);
  outputs.push({ model: "mistral", text: r3, score: s3 });

  outputs.sort((a, b) => a.score - b.score);

  return {
    best: outputs[0],
    all: outputs
  };
}
