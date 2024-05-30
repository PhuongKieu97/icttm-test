const MIN_RANDOM = 0;
const MAX_RANDOM = 300;
const RANDOM_STEP = 1;

function generateRandom(min: number, max: number, step: number) {
  const randomNum = min + Math.random() * (max - min);
  return Math.round(randomNum / step) * step;
}

export function myRandom() {
  return generateRandom(MIN_RANDOM, MAX_RANDOM, RANDOM_STEP);
}
