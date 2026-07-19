import { chooseBest } from "./engine/chooser.js";

const text = "The individuals commenced utilizing the equipment to demonstrate sufficient capability.";

const weights = {
  wASL: 0.4,
  wASW: 0.4,
  wPDW: 0.2
};

const result = await chooseBest(text, weights);

console.log("BEST:", result.best);
console.log("ALL:", result.all);
