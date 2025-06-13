"use client";

import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";

interface Point {
  latitude: number;
  longitude: number;
}

export default function MapViewer({ data }: { data: Point[] }) {
  if (data.length === 0) return null;

  const path: LatLngExpression[] = data.map((point) => [
    point.latitude,
    point.longitude,
  ]);

  const center: LatLngExpression = path[0];

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline positions={path} color="blue" />
    </MapContainer>
  );
}
