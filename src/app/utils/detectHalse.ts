// src/utils/detectHalse.ts
function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360;
}

export function detectHalse(points: any[], speedThreshold = 8, angleThreshold = 90, windowSize = 10) {
  const results: { index: number; type: 'halse' | 'crash' | 'none' }[] = [];

  for (let i = windowSize; i < points.length - windowSize; i++) {
    const start = points[i - windowSize];
    const center = points[i];
    const end = points[i + windowSize];

    const bearing1 = calculateBearing(start.lat, start.lon, center.lat, center.lon);
    const bearing2 = calculateBearing(center.lat, center.lon, end.lat, end.lon);

    let delta = Math.abs(bearing2 - bearing1);
    if (delta > 180) delta = 360 - delta;

    if (delta >= angleThreshold) {
      const speeds = points.slice(i - windowSize, i + windowSize + 1).map((p) => p.speed || 0);
      const maxSpeed = Math.max(...speeds);
      const minSpeed = Math.min(...speeds);

      if (maxSpeed < speedThreshold) {
        results.push({ index: i, type: "none" });
      } else if (minSpeed < speedThreshold) {
        results.push({ index: i, type: "crash" });
      } else {
        results.push({ index: i, type: "halse" });
      }
    }
  }

  return results;
}