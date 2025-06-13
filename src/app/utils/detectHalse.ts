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

export function detectHalse(points: any[]) {
  const results = [];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const bearing1 = calculateBearing(prev.lat, prev.lon, curr.lat, curr.lon);
    if (i < points.length - 1) {
      const next = points[i + 1];
      const bearing2 = calculateBearing(curr.lat, curr.lon, next.lat, next.lon);
      const delta = Math.abs(bearing2 - bearing1);
      const normalizedDelta = delta > 180 ? 360 - delta : delta;
      if (normalizedDelta > 90) {
        results.push({ index: i, lat: curr.lat, lon: curr.lon, delta: normalizedDelta });
      }
    }
  }
  return results;
}