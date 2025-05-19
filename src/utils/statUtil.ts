/**
 * === Medelvärde (average) ===
 * Räknar ut summan av alla värden och dividerar med antalet.
 */
export function calculateAverage(values: number[]): number {
  let sum = 0;
  for (const v of values) {
    sum += v;
  }
  return Math.round(sum / values.length);
}

/**
 * === Minsta värdet (minimum) ===
 * Returnerar det lägsta talet i listan.
 */
export function calculateMin(values: number[]): number {
  let min = values[0];
  for (const v of values) {
    if (v < min) {
      min = v;
    }
  }
  return min;
}

/**
 * === Största värdet (maximum) ===
 * Returnerar det högsta talet i listan.
 */
export function calculateMax(values: number[]): number {
  let max = values[0];
  for (const v of values) {
    if (v > max) {
      max = v;
    }
  }
  return max;
}

/**
 * === Median ===
 * Returnerar det mittersta värdet i listan (sorterad),
 * eller medelvärdet av de två mittersta om listan har jämnt antal.
 */
export function calculateMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (values.length % 2 === 0) {
    const lowerMid = sorted[mid - 1];
    const upperMid = sorted[mid];
    return Math.round((lowerMid + upperMid) / 2);
  } else {
    return sorted[mid];
  }
}

/**
 * === Typvärde (mode) ===
 * Hittar det värde (eller värden) som förekommer flest gånger.
 * Returneras som en kommaseparerad sträng.
 */
export function calculateMode(values: number[]): string {
  const frequency: Record<number, number> = {};

  for (const val of values) {
    if (frequency[val] !== undefined) {
      frequency[val] += 1;
    } else {
      frequency[val] = 1;
    }
  }

  let maxFreq = 0;
  for (const key in frequency) {
    if (frequency[key] > maxFreq) {
      maxFreq = frequency[key];
    }
  }

  const modes: number[] = [];
  for (const key in frequency) {
    if (frequency[key] === maxFreq) {
      modes.push(parseInt(key));
    }
  }

  return modes.join(", ");
}
// == standardavikelse==
export const calculateStandardDeviation = (values: number[]): number => {
  const n = values.length;
  if (n === 0) return 0;

  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;

  return Math.sqrt(variance);
};




/**
 * === Samlad statistikfunktion ===
 * Returnerar alla statistikmått i ett enda objekt.
 * Om inga värden finns, returneras "-" för varje mått.
 */
export function calculatePokerStats(values: number[]) {
  if (values.length === 0) {
    return {
      average: "-",
      max: "-",
      min: "-",
      median: "-",
      mode: "-",
      stdDev: "-"
    };
  }

  return {
    average: calculateAverage(values),
    max: calculateMax(values),
    min: calculateMin(values),
    median: calculateMedian(values),
    mode: calculateMode(values),
    stdDev: calculateStandardDeviation(values)
  };
}
