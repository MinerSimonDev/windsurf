import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapViewer({ data }: { data: any[] }) {
  const path: [number, number][] = data
    .filter((point) => typeof point.latitude === "number" && typeof point.longitude === "number")
    .map((point) => [point.latitude, point.longitude]);

  if (path.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <MapContainer center={path[0]} zoom={15} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline positions={path} color="blue" />
    </MapContainer>
  );
}