import { spawnSync } from "child_process";

export function llmSimplify2(text) {

  const prompt = `You are a text simplification assistant.
Simplify the following text into plain English.
Use short sentences of no more than 12 words each.
Replace all difficult, technical, or polysyllabic words with the simplest possible alternatives.
Write in active voice wherever possible.
Do not add new information, opinions, or explanations.
Do not remove any factual content from the original.
Preserve the original meaning completely.
Return only the simplified text. No preamble, no explanation.

${text}`;

  const result = spawnSync("ollama", ["run", "mistral"], {
    input: prompt,
    encoding: "utf-8"
  });

  return result.stdout.trim();
}
