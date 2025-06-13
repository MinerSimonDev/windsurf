export function detectHalse(data: any[]) {
  const results = [];
  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1];
    const curr = data[i];
    const delta = Math.abs(curr.bearing - prev.bearing);
    if (delta > 90) {
      results.push({ index: i, delta });
    }
  }
  return results;
}