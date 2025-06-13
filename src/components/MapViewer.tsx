// src/components/MapViewer.tsx
"use client";

import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";

interface Point {
  latitude: number;
  longitude: number;
  isHalse?: boolean;
}

export default function MapViewer({
  data,
}: {
  data: Point[];
}) {
  if (data.length === 0) return null;

  const segments: { path: LatLngExpression[]; color: string }[] = [];
  let currentSegment: LatLngExpression[] = [];
  let currentColor = "blue";

  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const latlng: LatLngExpression = [point.latitude, point.longitude];
    const isHalse = point.isHalse;

    if (currentSegment.length === 0) {
      currentSegment.push(latlng);
      currentColor = isHalse ? "red" : "blue";
    } else {
      const lastColor = currentColor;
      currentColor = isHalse ? "red" : "blue";

      if (lastColor === currentColor) {
        currentSegment.push(latlng);
      } else {
        // segment endet
        if (currentSegment.length > 1) {
          segments.push({ path: [...currentSegment], color: lastColor });
        }
        currentSegment = [currentSegment[currentSegment.length - 1], latlng];
      }
    }
  }

  if (currentSegment.length > 1) {
    segments.push({ path: [...currentSegment], color: currentColor });
  }

  const center: LatLngExpression = [data[0].latitude, data[0].longitude];

  return (
    <MapContainer center={center} zoom={17} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {segments.map((segment, idx) => (
        <Polyline key={idx} positions={segment.path} color={segment.color} />
      ))}
    </MapContainer>
  );
}