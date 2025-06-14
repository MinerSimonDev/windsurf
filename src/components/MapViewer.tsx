"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression, Map as LeafletMap } from "leaflet";

interface Point {
  latitude: number;
  longitude: number;
  isHalse?: boolean;
  time?: string;
  speed?: number;
}

function MarkerUpdater({ point }: { point: Point }) {
  const map = useMap();
  useEffect(() => {
    if (point) {
      map.setView([point.latitude, point.longitude], map.getZoom());
    }
  }, [point, map]);

  return <Marker position={[point.latitude, point.longitude]} />;
}

export default function MapViewer({ data }: { data: Point[] }) {
  const [index, setIndex] = useState(0);
  const selectedPoint = data[index];

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
      currentColor = isHalse ? "yellow" : "blue";
    } else {
      const lastColor = currentColor;
      currentColor = isHalse ? "yellow" : "blue";

      if (lastColor === currentColor) {
        currentSegment.push(latlng);
      } else {
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
    <div className="flex flex-col h-full">
      <MapContainer center={center} zoom={17} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {segments.map((segment, idx) => (
          <Polyline key={idx} positions={segment.path} color={segment.color} />
        ))}
        <MarkerUpdater point={selectedPoint} />
      </MapContainer>

      <div className="p-4">
        <input
          type="range"
          min={0}
          max={data.length - 1}
          value={index}
          onChange={(e) => setIndex(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="text-center mt-2 text-sm">
          Zeit: {selectedPoint.time ? new Date(selectedPoint.time).toLocaleString() : "Unbekannt"} <br />
          Geschwindigkeit: {selectedPoint.speed?.toFixed(1) ?? "?"} km/h
        </div>
      </div>
    </div>
  );
}
