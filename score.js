export function calculateScore(metrics, weights) {

  const { ASL, ASW, PDW } = metrics;
  const { wASL, wASW, wPDW } = weights;

  const score =
    (wASL * ASL) +
    (wASW * ASW * 10) +
    (wPDW * PDW / 10);

  return score;
}
